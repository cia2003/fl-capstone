import type { Film } from "@/types"
import type { EntityKind } from "@/types/entities"
import { entityEndpoint, filmEndpoint } from "./endpoints"

export async function getFilms(): Promise<Film[]> {
  const response = await fetch(filmEndpoint(), {
    next: { revalidate: 3600 },
  })

  if (!response.ok) {
    throw new Error("Unable to load Studio Ghibli films.")
  }

  return response.json()
}

export async function getFilm(id: string): Promise<Film> {
  const response = await fetch(filmEndpoint(id), {
    next: { revalidate: 3600 },
  })

  if (response.status === 404) {
    throw new Error("Could not find your film")
  }

  if (!response.ok) {
    throw new Error("Unable to load this film.")
  }

  return response.json()
}

export async function getEntities(
  kind: EntityKind,
): Promise<Record<string, unknown>[]> {
  const response = await fetch(entityEndpoint(kind), {
    next: { revalidate: 86400 },
  })

  if (!response.ok) {
    return []
  }

  return response.json()
}

export async function getEntity(
  kind: EntityKind,
  id: string,
): Promise<Record<string, unknown> | null> {
  const response = await fetch(entityEndpoint(kind, id), {
    next: { revalidate: 86400 },
  })

  if (!response.ok) {
    return null
  }

  return response.json()
}