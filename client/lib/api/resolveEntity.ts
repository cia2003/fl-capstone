import type { EntityKind, RelatedEntity } from "@/types/entities"
import { getEntities, getEntity } from "./ghibliClient"
import { entityEndpoint, filmEndpoint } from "./endpoints"

const KINDS: EntityKind[] = [
  "people",
  "species",
  "vehicles",
  "locations",
]

const FIELDS: Record<EntityKind, [key: string, label: string][]> = {
  people: [
    ["gender", "Gender"],
    ["age", "Age"],
    ["eye_color", "Eye color"],
    ["hair_color", "Hair color"],
  ],
  species: [
    ["classification", "Classification"],
    ["eye_colors", "Eye colors"],
    ["hair_colors", "Hair colors"],
  ],
  vehicles: [
    ["vehicle_class", "Class"],
    ["length", "Length"],
  ],
  locations: [
    ["climate", "Climate"],
    ["terrain", "Terrain"],
    ["surface_water", "Surface water"],
  ],
}

/**
 * Parses a Ghibli entity URL.
 *
 * Example:
 * https://ghibliapi.dev/people/123
 * → { kind: "people", id: "123" }
 */
export function parseEntityUrl(
  url: string,
): { kind: EntityKind; id: string } | null {
  try {
    const [kind, id, ...rest] = new URL(url).pathname
      .split("/")
      .filter(Boolean)

    if (!id || rest.length > 0) {
      return null
    }

    if (!KINDS.includes(kind as EntityKind)) {
      return null
    }

    return {
      kind: kind as EntityKind,
      id,
    }
  } catch {
    return null
  }
}

/**
 * Keeps only URLs that point to one specific entity.
 */
export function getEntityUrls(urls: string[]): string[] {
  return Array.from(
    new Set(
      urls.filter((url) => parseEntityUrl(url) !== null),
    ),
  )
}

function asText(value: unknown): string | undefined {
  if (typeof value !== "string" && typeof value !== "number") {
    return undefined
  }

  const text = String(value).trim()

  return text && text.toUpperCase() !== "NA"
    ? text
    : undefined
}

/**
 * Converts raw API entity data into the shape required by the UI.
 */
function normalizeEntity(
  raw: Record<string, unknown>,
  kind: EntityKind,
): RelatedEntity | null {
  const id = asText(raw.id)

  if (!id) {
    return null
  }

  return {
    id,
    kind,
    url: entityEndpoint(kind, id),
    name: asText(raw.name) ?? "Unknown",
    description: asText(raw.description),
    details: FIELDS[kind].flatMap(([key, label]) => {
      const value = asText(raw[key])

      return value
        ? [{ label, value }]
        : []
    }),
  }
}

/**
 * Fetches one specific entity.
 */
export async function getRelatedEntity(
  url: string,
): Promise<RelatedEntity | null> {
  const parsed = parseEntityUrl(url)

  if (!parsed) {
    return null
  }

  try {
    const raw = await getEntity(parsed.kind, parsed.id)

    if (!raw) {
      return null
    }

    return normalizeEntity(raw, parsed.kind)
  } catch {
    return null
  }
}

/**
 * Checks whether an entity references the requested film.
 *
 * The Ghibli API stores relationships on entity objects
 * through their `films` array.
 */
function belongsToFilm(
  raw: Record<string, unknown>,
  filmId: string,
): boolean {
  const films = raw.films

  if (!Array.isArray(films)) {
    return false
  }

  const targetUrl = filmEndpoint(filmId)

  return films.some((film) => {
    if (typeof film !== "string") {
      return false
    }

    return (
      film === targetUrl ||
      film.endsWith(`/films/${filmId}`)
    )
  })
}

/**
 * Resolves all entities related to a film.
 *
 * The film endpoint is not always consistent:
 *
 * - sometimes it contains specific entity URLs
 * - sometimes it only contains the collection URL
 * - sometimes the relationship is omitted entirely
 *
 * Therefore we combine:
 *
 * 1. Direct entity references from the film.
 * 2. Reverse references from the entity collection.
 */
export async function resolveRelatedEntities({
  filmId,
  kind,
  urls,
}: {
  filmId: string
  kind: EntityKind
  urls: string[]
}): Promise<RelatedEntity[]> {
  /*
   * 1. Resolve entity URLs explicitly supplied by the film.
   */
  const directUrls = getEntityUrls(urls)

  const directEntities = (
    await Promise.all(
      directUrls.map(getRelatedEntity),
    )
  ).filter(
    (entity): entity is RelatedEntity =>
      entity !== null,
  )

  /*
   * 2. Fetch the complete entity collection.
   *
   * This allows us to recover relationships that the
   * film endpoint failed to include.
   */
  const collection = await getEntities(kind)

  const reverseEntities = collection.flatMap((raw) => {
    if (!belongsToFilm(raw, filmId)) {
      return []
    }

    const entity = normalizeEntity(raw, kind)

    return entity ? [entity] : []
  })

  /*
   * 3. Merge and deduplicate.
   *
   * Direct references are inserted first, so they take
   * precedence when the same entity exists in both sources.
   */
  const entities = new Map<string, RelatedEntity>()

  for (const entity of directEntities) {
    entities.set(entity.id, entity)
  }

  for (const entity of reverseEntities) {
    if (!entities.has(entity.id)) {
      entities.set(entity.id, entity)
    }
  }

  return Array.from(entities.values())
}