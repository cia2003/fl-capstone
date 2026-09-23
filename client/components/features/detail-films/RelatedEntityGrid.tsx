import { resolveRelatedEntities } from "@/lib/api/resolveEntity"
import type { EntityKind } from "@/types/entities"
import { RelatedEntityCard } from "./RelatedEntityCard"

type Props = {
  urls: string[]
  filmId: string
  kind: EntityKind
  emptyMessage?: string
}

export async function RelatedEntityGrid({
  urls,
  filmId,
  kind,
  emptyMessage = "Nothing linked to this film yet.",
}: Props) {
  const entities = await resolveRelatedEntities({
    filmId,
    kind,
    urls,
  })

  if (entities.length === 0) {
    return (
      <p className="max-w-[52ch] rounded-xl border border-dashed border-[#E8D8C3] px-5 py-4 text-[#6B5548]">
        {emptyMessage}
      </p>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {entities.map((entity) => (
        <RelatedEntityCard
          key={`${entity.kind}-${entity.id}`}
          entity={entity}
        />
      ))}
    </div>
  )
}