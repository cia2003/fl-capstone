"use client";

import Image from "next/image";
import type { Film } from "@/types";
import { formatReleaseDate, formatRuntime } from "@/lib/utils/format";
import { LuBookmark, LuStar } from "react-icons/lu";
import { useWatchlist } from "@/hooks/useWatchlist";

export function FilmCard({ film, priority=false }: { film: Film, priority?:boolean }) {
  const { has, toggle } = useWatchlist();

  const handleBookmarkClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggle(film.id);
  };

  return (
    <article
      className="relative overflow-hidden rounded-card border border-primary/20 bg-white/35 shadow-sm transition-shadow hover:shadow-md hover:scale-103 cursor-pointer"
      onClick={() => (window.location.href = `/films/${film.id}`)}
    >
      {film.image && (
        <div className="relative h-72 w-full">
          <Image
            src={film.image}
            alt={film.title}
            priority={priority}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
            className="object-cover"
          />
        </div>
      )}

      <div className="p-card">
        <LuBookmark
          className={`absolute right-3 top-3 rounded-full border border-primary/20 bg-white p-2 text-primary ${
            has(film.id) ? "fill-current" : ""
          }`}
          size={35}
          onClick={handleBookmarkClick}
        />

        <div className="absolute left-3 top-3 flex items-center gap-2 rounded-[10px] bg-white p-2">
          <LuStar
            className="rounded-full text-lg text-yellow-500"
            size={24}
          />
          {film.rt_score}
        </div>

        <p className="text-caption font-medium tracking-caption text-text/70">
          {formatReleaseDate(film.release_date)} · {formatRuntime(film.running_time)}
        </p>

        <h2 className="mt-2 text-h3">{film.title}</h2>
      </div>
    </article>
  );
}