import { Suspense } from "react"
import { getEntityUrls, getRelatedEntity } from "@/lib/api/resolveEntity"
import { RelatedEntityCard } from "./RelatedEntityCard"

type Props = {
  /** Raw URL array from the film object (film.people, film.species, …). */
  urls: string[]
  emptyMessage?: string
}

export function RelatedEntityGrid({
  urls,
  emptyMessage = "Nothing linked to this film yet.",
}: Props) {
  // The API mixes ".../people/<id>" (this film's entity) with ".../people" (the whole list).
  // Only the ones with an id belong here.
  const entityUrls = getEntityUrls(urls)

  if (entityUrls.length === 0) {
    return (
      <p className="max-w-[52ch] rounded-xl border border-dashed border-[#E8D8C3] px-5 py-4 text-[#6B5548]">
        {emptyMessage}
      </p>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {entityUrls.map((url) => (
        <Suspense key={url} fallback={<CardSkeleton />}>
          <CardLoader url={url} />
        </Suspense>
      ))}
    </div>
  )
}

/** Server component: fetches one entity, hands plain data to the client card. */
async function CardLoader({ url }: { url: string }) {
  const entity = await getRelatedEntity(url)
  if (!entity) return <CardError />
  return <RelatedEntityCard entity={entity} />
}

function CardSkeleton() {
  return <div aria-hidden className="min-h-40 animate-pulse rounded-xl bg-[#F0E2CE]" />
}

function CardError() {
  return (
    <div className="flex min-h-40 items-center justify-center rounded-xl border border-dashed border-[#E8D8C3] p-6 text-center text-[#6B5548]">
      Couldn’t load this one. Refresh to try again.
    </div>
  )
}
