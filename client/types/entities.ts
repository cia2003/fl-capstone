export type EntityKind = "people" | "species" | "vehicles" | "locations"

export type RelatedEntity = {
    id: string, 
    kind: EntityKind, 
    name: string, 
    url: string, 
    description?: string, 
    details: { label: string; value: string }[]
}

export const KIND_LABEL: Record<EntityKind, string> = {
  people: "Character",
  species: "Species",
  vehicles: "Vehicle",
  locations: "Location",
}