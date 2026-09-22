import {
    streamText,
    UIMessage,
    convertToModelMessages,
    createUIMessageStreamResponse,
    toUIMessageStream,
} from 'ai'

import { google } from '@ai-sdk/google'
import { filmRecommenderPrompt } from '@/agents/prompts/filmRecommender'
import { filmTools } from '@/agents/tools/filmTools'
import { getFilms } from '@/lib/api/ghibliClient'

export const runtime = "nodejs"
export const maxDuration = 30

const MAX_MESSAGES = 20
const MAX_MESSAGE_LENGTH = 1000

export async function POST(req: Request) {
    const { messages }: { messages: UIMessage[] } = await req.json()

    if (!Array.isArray(messages) || messages.length > MAX_MESSAGES) {
        return new Response("Too many messages", { status: 400 })
    }

    for (const message of messages) {
        const text = message.parts
            ?.filter(part => part.type === "text")
            .map(part => part.text)
            .join("") ?? ""

        if (text.length > MAX_MESSAGE_LENGTH) {
            return new Response("Message too long", { status: 400 })
        }
    }

    const films = await getFilms()

    const controller = new AbortController()

    const timeout = setTimeout(() => {
        controller.abort()
    }, 10_000)

    req.signal.addEventListener("abort", () => {
        controller.abort()
    })

    try {
        const result = streamText({
            model: google("gemini-3.5-flash-lite"),
            system: `${filmRecommenderPrompt} Verified film list: ${JSON.stringify(films)}`,
            messages: await convertToModelMessages(messages),
            tools: filmTools(films),
            abortSignal: controller.signal,
        })

        return createUIMessageStreamResponse({
            stream: toUIMessageStream({
                stream: result.stream,
            }),
        })
    } finally {
        clearTimeout(timeout)
    }
}