import type { Film, Recommendation } from "@/types";
import { RankedResultItem } from "./RankedResultItem";

export function RankedResultList({ recommendations, films }: { recommendations: Recommendation[]; films: Film[] }) {
  const filmById = new Map(films.map(film => [film.id, film]));
  return <ol className="mt-8 space-y-4">{recommendations.map((recommendation, index) => {
    const film = filmById.get(recommendation.filmId);
    return film ? <RankedResultItem key={film.id} recommendation={recommendation} film={film} rank={index + 1} /> : null;
  })}</ol>;
}
