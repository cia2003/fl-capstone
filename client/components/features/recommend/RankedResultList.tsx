"use client"

import { useEffect, useState } from "react";
import type { Film, Recommendation } from "@/types";
import { RankedResultItem, RankedResultItemSkeleton } from "./RankedResultItem";
import { getFilm } from "@/lib/api/ghibliClient";

type RankedResultListProps = {
  recommendations: Recommendation[];
  loading?: boolean;
};

export function RankedResultList({ recommendations, loading = false }: RankedResultListProps) {
  const [films, setFilms] = useState<Record<string, Film>>({});
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function loadFilms() {
      setIsFetching(true);

      const entries = await Promise.all(
        recommendations.map(async (recommendation) => {
          try {
            const film = await getFilm(recommendation.filmId);
            return [recommendation.filmId, film] as const;
          } catch {
            return [recommendation.filmId, null] as const;
          }
        })
      );

      if (!cancelled) {
        const filmMap: Record<string, Film> = {};
        for (const [filmId, film] of entries) {
          if (film) filmMap[filmId] = film;
        }
        setFilms(filmMap);
        setIsFetching(false);
      }
    }

    if (recommendations.length > 0) {
      loadFilms();
    } else {
      setFilms({});
      setIsFetching(false);
    }

    return () => {
      cancelled = true;
    };
  }, [recommendations]);

  if (loading || isFetching) {
    return (
      <ol className="mt-5 space-y-4">
        {Array.from({ length: 1 }).map((_, index) => (
          <RankedResultItemSkeleton key={index} />
        ))}
      </ol>
    );
  }

  return (
    <ol className="mt-5 space-y-4">
      {recommendations.map((recommendation, index) => {
        const film = films[recommendation.filmId];

        return film ? (
          <RankedResultItem
            key={recommendation.filmId}
            recommendation={recommendation}
            film={film}
            rank={index + 1}
          />
        ) : null;
      })}
    </ol>
  );
}