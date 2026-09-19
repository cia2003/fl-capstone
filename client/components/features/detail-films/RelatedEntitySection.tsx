import { getEntityUrls } from "@/lib/api/resolveEntity"
import { RelatedEntityGrid } from "./RelatedEntityGrid"

type Props = {
  people: string[]
  species: string[]
  vehicles: string[]
  locations: string[]
}

const GROUPS = [
  { key: "people", title: "Characters", empty: "No characters listed for this film." },
  { key: "species", title: "Species", empty: "No species listed for this film." },
  { key: "vehicles", title: "Vehicles", empty: "No vehicles listed for this film." },
  { key: "locations", title: "Locations", empty: "No locations tied to this film yet." },
] as const

/** Section below the film hero: one heading + one card grid per category. */
export function RelatedEntitySection(props: Props) {
  return (
    <section
      aria-labelledby="related-title"
      className="border-t border-[#E8D8C3] mt-section-mobile py-section-mobile md:py-section max-w-[1280px] mx-auto"
    >
      <h2 id="related-title" className="text-2xl font-semibold text-[#2A1810]">
        In this film
      </h2>
      <p className="mt-2 max-w-[60ch] text-[#6B5548]">
        Hover or tap a card to see what the Ghibli API has on it.
      </p>

      <div className="mt-8 flex flex-col gap-8">
        {GROUPS.map(({ key, title, empty }) => {
          const count = getEntityUrls(props[key]).length
          return (
            <div key={key}>
              <h3 className="mb-3 text-lg font-medium text-[#2A1810]">
                {title}
                {count > 0 && (
                  <span className="ml-2 text-[13px] font-medium tracking-[0.02em] text-[#6B5548]">
                    {count}
                  </span>
                )}
              </h3>
              <RelatedEntityGrid urls={props[key]} emptyMessage={empty} />
            </div>
          )
        })}
      </div>
    </section>
  )
}
