"use client";

import type { Film } from "@/types";
import { FilmCardSkeleton } from "../../films/FilmCardSkeleton";
import dynamic from "next/dynamic";

type CarouselFallbackProps = {
  movies: Film[];
};

const LazyFilmCard = dynamic(
  () => import("@/components/features/films/FilmCard").then(
    (module) => module.FilmCard
  ), 
  {
    ssr: false, 
    loading: () => <FilmCardSkeleton />
  }
)

export default function CarouselFallback({
  movies,
}: CarouselFallbackProps) {
  return (
    <section className="mx-5 md:mx-10 lg:mx-16 min-[1440px]:mx-24">
      <div className="mx-auto max-w-[1280px] pt-section-mobile md:pt-section-desktop">
        <h2 className="mb-4 text-2xl font-semibold">
          Top Movies
        </h2>

        <p className="mb-6 text-sm text-muted-foreground">
          Explore the top-rated Studio Ghibli movies based on
          their Rotten Tomatoes scores.
        </p>
      </div>

      <div className="mx-auto grid max-w-[1280px] grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4">
        {movies.map((movie) => (
          <LazyFilmCard film={movie} key={movie.id} />
        ))}
      </div>
    </section>
  );
}