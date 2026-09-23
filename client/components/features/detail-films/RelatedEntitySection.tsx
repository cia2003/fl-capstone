import type { EntityKind } from "@/types/entities"
import { RelatedEntityGrid } from "./RelatedEntityGrid"

type Props = {
  filmId: string
  people: string[]
  species: string[]
  vehicles: string[]
  locations: string[]
}

const GROUPS: {
  key: keyof Omit<Props, "filmId">
  kind: EntityKind
  title: string
  empty: string
}[] = [
  {
    key: "people",
    kind: "people",
    title: "Characters",
    empty: "No characters listed for this film.",
  },
  {
    key: "species",
    kind: "species",
    title: "Species",
    empty: "No species listed for this film.",
  },
  {
    key: "vehicles",
    kind: "vehicles",
    title: "Vehicles",
    empty: "No vehicles listed for this film.",
  },
  {
    key: "locations",
    kind: "locations",
    title: "Locations",
    empty: "No locations tied to this film yet.",
  },
]

/** Section below the film hero: one heading + one card grid per category. */
export function RelatedEntitySection({
  filmId,
  people,
  species,
  vehicles,
  locations,
}: Props) {
  const entities = {
    people,
    species,
    vehicles,
    locations,
  }

  return (
    <section
      aria-labelledby="related-title"
      className="mx-auto mt-section-mobile max-w-[1280px] border-t border-[#E8D8C3] py-section-mobile md:py-section"
    >
      <h2
        id="related-title"
        className="text-2xl font-semibold text-[#2A1810]"
      >
        In this film
      </h2>

      <p className="mt-2 max-w-[60ch] text-[#6B5548]">
        Hover or tap a card to explore about film's entities
      </p>

      <div className="mt-8 flex flex-col gap-8">
        {GROUPS.map(({ key, kind, title, empty }) => (
          <div key={key}>
            <h3 className="mb-3 text-lg font-medium text-[#2A1810]">
              {title}
            </h3>

            <RelatedEntityGrid
              filmId={filmId}
              kind={kind}
              urls={entities[key]}
              emptyMessage={empty}
            />
          </div>
        ))}
      </div>
    </section>
  )
}