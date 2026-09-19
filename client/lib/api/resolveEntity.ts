import type { EntityKind, RelatedEntity } from "@/types/entities"

const KINDS: EntityKind[] = ["people", "species", "vehicles", "locations"]

/** Which raw API fields become rows on the back of the card, per endpoint. */
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

export function parseEntityUrl(url: string): { kind: EntityKind; id: string } | null {
  try {
    const [kind, id, ...rest] = new URL(url).pathname.split("/").filter(Boolean)
    if (!id || rest.length > 0) return null
    if (!KINDS.includes(kind as EntityKind)) return null
    return { kind: kind as EntityKind, id }
  } catch {
    return null
  }
}

/** Keeps only URLs that point at one entity (have an id), without duplicates. */
export function getEntityUrls(urls: string[]): string[] {
  return Array.from(new Set(urls.filter((u) => parseEntityUrl(u) !== null)))
}

function asText(value: unknown): string | undefined {
  if (typeof value !== "string" && typeof value !== "number") return undefined
  const text = String(value).trim()
  return text && text.toUpperCase() !== "NA" ? text : undefined
}

/** Server-side fetch. Returns null on any failure so one bad URL never breaks the page. */
export async function getRelatedEntity(url: string): Promise<RelatedEntity | null> {
  const parsed = parseEntityUrl(url)
  if (!parsed) return null

  try {
    // Static reference data: cache for a day.
    const res = await fetch(url, { next: { revalidate: 60 * 60 * 24 } })
    if (!res.ok) return null
    const raw = (await res.json()) as Record<string, unknown>

    return {
      id: parsed.id,
      kind: parsed.kind,
      url,
      name: asText(raw.name) ?? "Unknown",
      description: asText(raw.description),
      details: FIELDS[parsed.kind].flatMap(([key, label]) => {
        const value = asText(raw[key])
        return value ? [{ label, value }] : []
      }),
    }
  } catch {
    return null
  }
}