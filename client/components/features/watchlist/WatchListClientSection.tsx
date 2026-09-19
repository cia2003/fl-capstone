"use client";

import { useState } from "react";
import Link from "next/link";
import { Film } from "@/types";
import { FilmCard } from "@/components/features/films/FilmCard";
import { useWatchlist } from "@/hooks/useWatchlist";

interface WatchlistClientSectionProps {
  initialFilms: Film[];
  initialWatchlist: string[];
}

export default function WatchlistClientSection({
  initialFilms,
  initialWatchlist,
}: WatchlistClientSectionProps) {
  // Pass initialWatchlist dari server ke hook
  const { watchlist, toggle } = useWatchlist(initialWatchlist);

  // Filter lokal secara real-time saat user melakukan toggle (hapus item)
  const activeFilms = initialFilms.filter((film) =>
    watchlist.includes(film.id)
  );

  if (activeFilms.length === 0) {
    return (
      <div className="mt-8 max-w-lg">
        <p>
          Your watchlist is empty. Find a story you’d like to keep around.
        </p>

        <Link
          href="/"
          className="mt-6 inline-block rounded-button border-[1.5px] border-primary px-button-x py-button-y text-sm font-semibold text-primary no-underline transition-colors hover:bg-primary hover:text-background"
        >
          Explore the films
        </Link>
      </div>
    );
  }

  return (
    <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {activeFilms.map((film, index) => (
        <FilmCard
          key={film.id}
          film={film}
          priority={index === 0} // LCP Image Preload otomatis aktif di HTML pertama dari server!
        />
      ))}
    </div>
  );
}