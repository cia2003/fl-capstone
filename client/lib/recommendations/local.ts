import { Film } from "@/types";
import { RecommendationResponse } from "@/types";

export function rankLocally(query: string, films: Film[]): RecommendationResponse {
  const terms = query.toLowerCase().split(/\W+/).filter(term => term.length > 2);
  const ranked = films.map(film => {
    const searchable = `${film.title} ${film.description} ${film.director}`.toLowerCase();
    const matches = terms.filter(term => searchable.includes(term)).length;

    return { film, score: Math.min(98, 62 + matches * 12) };
  }).sort(
    (a, b) => b.score - a.score || a.film.title.localeCompare(b.film.title)
  ).slice(0, 3);
  return { 
    recommendations: ranked.map(({ film, score }) => ({ 
      filmId: film.id, 
      score, 
      reasoning: `${film.title} is a strong fit: ${film.description.slice(0, 170).trim()}${film.description.length > 170 ? "…" : ""}` })) 
    };
}