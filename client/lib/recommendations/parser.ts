import { Film } from "@/types";
import { RecommendationResponse } from "@/types";

export function parseRecommendations(content: string | undefined, films: Film[]): RecommendationResponse | null {
  if (!content) return null;

  try {
    const parsed = JSON.parse(content.replace(/```json\n?/g, "").replace(/```/g, "")) as RecommendationResponse;
    const filmIds = new Set(films.map(film => film.id));
    const recommendations = Array.isArray(parsed.recommendations)
      ? parsed.recommendations.filter(recommendation => (
        filmIds.has(recommendation.filmId)
        && typeof recommendation.score === "number"
        && typeof recommendation.reasoning === "string"
      )).slice(0, 3)
      : [];

    return recommendations.length ? { recommendations } : null;
  } catch {
    return null;
  }
}