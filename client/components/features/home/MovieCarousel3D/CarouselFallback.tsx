"use client";

import type { Film } from "@/types";
import { useRouter } from "next/navigation";

type CarouselFallbackProps = {
  movies: Film[];
};

export default function CarouselFallback({
  movies,
}: CarouselFallbackProps) {
  const router = useRouter();

  return (
    <section className="mx-5 md:mx-10 lg:mx-16 min-[1440px]:mx-24">
      <div className="mx-auto max-w-[1280px] pt-section-mobile md:pt-section-desktop">
        <h2 className="mb-4 text-2xl font-semibold">Top Movies</h2>
        <p className="mb-6 text-sm text-muted-foreground">
          Explore the top-rated Studio Ghibli movies based on their Rotten Tomatoes scores.
        </p>
      </div>
      <div className="mx-auto grid max-w-[1280px] grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-5">
      {movies.map((movie) => (
        <button
          key={movie.id}
          type="button"
          onClick={() => router.push(`/films/${movie.id}`)}
          aria-label={`Open ${movie.title}`}
            className="
            relative aspect-[2/3]
            overflow-hidden rounded-xl
            p-3.5
            text-white
            text-left
          "
        >
          {/* Dark gradient */}
          <div
            className="
              pointer-events-none absolute inset-0 z-10
              bg-gradient-to-t from-black/65
              via-transparent to-transparent
            "
          />

          {/* Rating */}
          <div
            className="
              absolute right-2.5 top-2.5 z-10
              flex items-center gap-1
              rounded-full bg-white
              px-2 py-0.5
              text-xs font-semibold text-[#2A1810]
            "
          >
            <span className="text-[#D4A017]">★</span>
            {movie.rt_score}
          </div>

          {/* Movie info */}
          <div className="absolute bottom-3.5 left-3.5 right-3.5 z-10">
            <h3 className="font-heading text-[15px] font-semibold">
              {movie.title}
            </h3>

            <p className="mt-0.5 text-xs text-white/90">
              {movie.release_date} · {movie.running_time} min
            </p>
          </div>
          <img
            src={movie.image}
            alt=""
            className="absolute inset-0 z-0 h-full w-full object-cover"
          />
        </button>
      ))}
      </div>
    </section>
  );
}