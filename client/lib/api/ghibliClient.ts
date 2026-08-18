import type { Film } from "@/types";
import { filmEndpoint } from "./endpoints";

export async function getFilms(): Promise<Film[]> {
  const response = await fetch(filmEndpoint(), { next: { revalidate: 3600 } });
  if (!response.ok) throw new Error("Unable to load Studio Ghibli films.");
  return response.json();
}

export async function getFilm(id: string): Promise<Film | null> {
  const response = await fetch(filmEndpoint(id), { next: { revalidate: 3600 } });
  if (response.status === 404) return null;
  if (!response.ok) throw new Error("Unable to load this film.");
  return response.json();
}