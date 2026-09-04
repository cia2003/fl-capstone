"use client"
import type { Film } from "@/types";
import { formatReleaseDate, formatRuntime } from "@/lib/utils/format";
import { LuBookmark } from "react-icons/lu";
import { useWatchlist } from "@/hooks/useWatchlist";

export function FilmCard({ film }: { film: Film }) {
  const { has, toggle } = useWatchlist();
  const handleBookmarkClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggle(film.id);
  }

  return <article className="overflow-hidden rounded-card border border-primary/20 bg-white/35 shadow-sm hover:shadow-md transition-shadow scale-100 hover:scale-103 transition-transform cursor-pointer" onClick={() => (window.location.href = `/films/${film.id}`)}>
    {film.image && <img src={film.image} alt="" className="h-72 w-full object-cover" />}
    <div className="p-card">
      <LuBookmark className={`absolute right-3 top-3 text-lg text-primary border border-primary/20 bg-white p-2 rounded-full ${has(film.id) ? 'fill-current' : ''}`} size={35} onClick={handleBookmarkClick} />
      <p className="text-caption font-medium tracking-caption text-text/70">{formatReleaseDate(film.release_date)} · {formatRuntime(film.running_time)}</p>
      <h2 className="mt-2 text-h3">{film.title}</h2>
    </div>
  </article>;
}
