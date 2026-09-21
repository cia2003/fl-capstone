import {
    streamText,
    convertToModelMessages,
    createUIMessageStreamResponse,
    toUIMessageStream,
    type UIMessage,
} from "ai"
import { google } from "@ai-sdk/google"
import { filmRecommenderPrompt } from "@/agents/prompts/filmRecommender"
import { filmTools } from "@/agents/tools/filmTools"
import { getFilms } from "@/lib/api/ghibliClient"

export const runtime = "nodejs"
export const maxDuration = 30

// ---------------------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------------------

const MODEL_ID = "gemini-3.5-flash-lite"

const LIMITS = {
    /** Hard cap on the raw request body (roughly a token budget per request). */
    maxBodyChars: 100_000,
    maxMessages: 20,
    maxPartsPerMessage: 20,
    maxUserChars: 1_000,
    maxAssistantChars: 5_000,
    maxOutputTokens: 800,
} as const

const RATE_LIMIT = {
    windowMs: 60_000,
    maxRequests: 10,
    /** Upper bound on tracked clients so the Map cannot grow without limit. */
    maxTrackedClients: 5_000,
} as const

const FILMS_CACHE_TTL_MS = 10 * 60_000
const FILMS_RETRY_AFTER_FAILURE_MS = 60_000

/** Artificial per-chunk delay for local demos only; never applied in production. */
const DEV_STREAM_DELAY_MS = process.env.NODE_ENV === "production" ? 0 : 100

/** Fields sent to the model. Adjust to match your Film type. */
const PROMPT_FILM_FIELDS = [
    "title",
    "original_title",
    "director",
    "release_date",
    "running_time",
    "rt_score",
    "description",
] as const

// ---------------------------------------------------------------------------
// HTTP helpers
// ---------------------------------------------------------------------------

function jsonError(error: string, status: number, headers?: HeadersInit) {
    return Response.json({ error }, { status, headers })
}

/**
 * On Vercel, x-forwarded-for is set by the platform and can be trusted.
 * Behind other proxies, the first hop may be client-controlled.
 */
function getClientIp(req: Request) {
    return (
        req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
        req.headers.get("x-real-ip") ??
        "unknown"
    )
}

// ---------------------------------------------------------------------------
// Rate limiting (in-memory, best-effort)
//
// State lives in a single serverless instance, so it is not shared across
// instances and resets on cold start. For strict enforcement, swap this
// function for Upstash Ratelimit or a Vercel Firewall rule; the call site
// only needs "seconds until retry, or null".
// ---------------------------------------------------------------------------

const rateLimitEntries = new Map<string, { count: number; resetAt: number }>()

function pruneRateLimitEntries(now: number) {
    for (const [key, entry] of rateLimitEntries) {
        if (entry.resetAt <= now) rateLimitEntries.delete(key)
    }

    if (rateLimitEntries.size >= RATE_LIMIT.maxTrackedClients) {
        const oldestKey = rateLimitEntries.keys().next().value
        if (oldestKey !== undefined) rateLimitEntries.delete(oldestKey)
    }
}

/** Returns seconds until the client may retry, or null if the request is allowed. */
function checkRateLimit(clientId: string): number | null {
    const now = Date.now()
    const entry = rateLimitEntries.get(clientId)

    if (!entry || entry.resetAt <= now) {
        if (rateLimitEntries.size >= RATE_LIMIT.maxTrackedClients) {
            pruneRateLimitEntries(now)
        }
        rateLimitEntries.set(clientId, {
            count: 1,
            resetAt: now + RATE_LIMIT.windowMs,
        })
        return null
    }

    entry.count += 1
    if (entry.count <= RATE_LIMIT.maxRequests) return null

    return Math.max(1, Math.ceil((entry.resetAt - now) / 1000))
}

// ---------------------------------------------------------------------------
// Request parsing and validation
// ---------------------------------------------------------------------------

type ParseResult =
    | { ok: true; messages: UIMessage[] }
    | { ok: false; status: number; error: string }

const fail = (status: number, error: string): ParseResult => ({
    ok: false,
    status,
    error,
})

function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null
}

function validateMessages(input: unknown): ParseResult {
    if (
        !Array.isArray(input) ||
        input.length === 0 ||
        input.length > LIMITS.maxMessages
    ) {
        return fail(400, `messages must be an array of 1 to ${LIMITS.maxMessages} items.`)
    }

    for (const message of input) {
        if (!isRecord(message) || (message.role !== "user" && message.role !== "assistant")) {
            return fail(400, "Each message must have the role 'user' or 'assistant'.")
        }

        const { role, parts } = message
        if (
            !Array.isArray(parts) ||
            parts.length > LIMITS.maxPartsPerMessage ||
            (role === "user" && parts.length === 0)
        ) {
            return fail(400, `Each message must have 1 to ${LIMITS.maxPartsPerMessage} parts.`)
        }

        const maxChars = role === "user" ? LIMITS.maxUserChars : LIMITS.maxAssistantChars

        for (const part of parts) {
            if (!isRecord(part) || typeof part.type !== "string") {
                return fail(400, "Invalid message part.")
            }
            if (role === "user" && part.type !== "text") {
                return fail(400, "User messages may only contain text.")
            }
            if (part.type === "text") {
                if (typeof part.text !== "string") {
                    return fail(400, "Text parts must contain a string.")
                }
                if (part.text.length > maxChars) {
                    return fail(400, `${role} messages must not exceed ${maxChars} characters.`)
                }
            }
        }
    }

    // Gemini 3.5 Flash-Lite rejects requests whose last turn is a model turn.
    if (input[input.length - 1].role !== "user") {
        return fail(400, "The last message must come from the user.")
    }

    return { ok: true, messages: input as UIMessage[] }
}

async function readMessages(req: Request): Promise<ParseResult> {
    // Reject early when the client declares an oversized body (bytes >= chars).
    const declaredLength = Number(req.headers.get("content-length"))
    if (declaredLength > LIMITS.maxBodyChars) {
        return fail(413, "Request body is too large.")
    }

    const raw = await req.text()
    if (raw.length > LIMITS.maxBodyChars) {
        return fail(413, "Request body is too large.")
    }

    let body: unknown
    try {
        body = JSON.parse(raw)
    } catch {
        return fail(400, "Request body must be valid JSON.")
    }

    return validateMessages(isRecord(body) ? body.messages : undefined)
}

// ---------------------------------------------------------------------------
// Film data (cached, with stale fallback)
// ---------------------------------------------------------------------------

type Films = Awaited<ReturnType<typeof getFilms>>
type FilmsCacheEntry = { films: Films; promptJson: string; expiresAt: number }

let filmsCache: FilmsCacheEntry | null = null

/** Keeps only the fields the model needs, falling back to the full record. */
function toPromptFilm(film: object) {
    const source = film as Record<string, unknown>
    const picked = Object.fromEntries(
        PROMPT_FILM_FIELDS.filter(field => field in source).map(field => [field, source[field]]),
    )
    return Object.keys(picked).length > 0 ? picked : film
}

async function getCachedFilms(): Promise<FilmsCacheEntry> {
    const now = Date.now()
    if (filmsCache && filmsCache.expiresAt > now) return filmsCache

    try {
        const films = await getFilms()
        const entry: FilmsCacheEntry = {
            films,
            promptJson: JSON.stringify(films.map(toPromptFilm)),
            expiresAt: now + FILMS_CACHE_TTL_MS,
        }
        filmsCache = entry
        return entry
    } catch (error) {
        if (!filmsCache) throw error

        console.warn("Film API unavailable, serving stale data:", error)
        filmsCache.expiresAt = now + FILMS_RETRY_AFTER_FAILURE_MS
        return filmsCache
    }
}

// ---------------------------------------------------------------------------
// Streaming helpers
// ---------------------------------------------------------------------------

function withDelay<T>(stream: ReadableStream<T>, delayMs: number): ReadableStream<T> {
    if (delayMs <= 0) return stream

    return stream.pipeThrough(
        new TransformStream<T, T>({
            async transform(chunk, controller) {
                await new Promise(resolve => setTimeout(resolve, delayMs))
                controller.enqueue(chunk)
            },
        }),
    )
}

// ---------------------------------------------------------------------------
// Route handler
// ---------------------------------------------------------------------------

export async function POST(req: Request) {
    // 1. Rate limit first: it is the cheapest check and guards everything below.
    const retryAfter = checkRateLimit(getClientIp(req))
    if (retryAfter !== null) {
        return jsonError(
            "Too many chat requests. Please try again shortly.",
            429,
            { "Retry-After": String(retryAfter) },
        )
    }

    // 2. Parse and validate the body (size cap, JSON, message shape and length).
    const parsed = await readMessages(req)
    if (!parsed.ok) return jsonError(parsed.error, parsed.status)

    // 3. Load film data (cached; falls back to stale data if the API is down).
    let filmData: FilmsCacheEntry
    try {
        filmData = await getCachedFilms()
    } catch (error) {
        console.error("Failed to load film data:", error)
        return jsonError("Film data is temporarily unavailable. Please try again later.", 503)
    }

    // 4. Convert client messages; failures here are caused by bad input.
    let modelMessages: Awaited<ReturnType<typeof convertToModelMessages>>
    try {
        modelMessages = await convertToModelMessages(parsed.messages)
    } catch (error) {
        console.warn("Could not convert messages:", error)
        return jsonError("Messages could not be processed.", 400)
    }

    // 5. Stream the model response.
    try {
        const result = streamText({
            model: google(MODEL_ID),
            system: `${filmRecommenderPrompt}\n\nVerified film list:\n${filmData.promptJson}`,
            messages: modelMessages,
            tools: filmTools(filmData.films),
            maxOutputTokens: LIMITS.maxOutputTokens,
            abortSignal: req.signal,
            // Provider errors surface inside the stream, not as thrown exceptions.
            onError({ error }) {
                console.error("streamText error:", error)
            },
        })

        return createUIMessageStreamResponse({
            stream: toUIMessageStream({
                stream: withDelay(result.stream, DEV_STREAM_DELAY_MS),
            }),
        })
    } catch (error) {
        console.error("Chat route failed:", error)
        return jsonError("The chat service is unavailable. Please try again later.", 502)
    }
}