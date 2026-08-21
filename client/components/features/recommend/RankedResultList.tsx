import type { Film, Recommendation } from "@/types";
import { RankedResultItem, RankedResultItemSkeleton } from "./RankedResultItem";

type RankedResultListProps = {
  recommendations: Recommendation[], 
  films: Film[], 
  loading?: boolean
}
export function RankedResultList({ recommendations, films, loading = false }: RankedResultListProps) {
  const filmById = new Map(films.map(film => [film.id, film]));

  if (loading) {
    return (
      <ol className="mt-5 space-y-4">
        {Array.from({ length: 1 }).map((_, index) => (
          <RankedResultItemSkeleton key={index} />
        ))}
      </ol>
    )
  }

  return (
    <ol className="mt-5 space-y-4">
      {
      recommendations.map((recommendation, index) => {
        const film = filmById.get(recommendation.filmId);

        return film ? <RankedResultItem key={film.id} recommendation={recommendation} film={film} rank={index + 1} /> : null;
    })}
    </ol>
  );
}
