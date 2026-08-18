import Link from "next/link";
import type { Film } from "@/types";
import { formatReleaseDate, formatRuntime } from "@/lib/utils/format";

export function FilmCard({ film }: { film: Film }) {
  return <article className="overflow-hidden rounded-card border border-primary/20 bg-white/35 shadow-sm">
    {film.image && <img src={film.image} alt="" className="h-72 w-full object-cover" />}
    <div className="p-card">
      <p className="text-caption font-medium tracking-caption text-text/70">{formatReleaseDate(film.release_date)} · {formatRuntime(film.running_time)}</p>
      <h2 className="mt-2 text-h3">{film.title}</h2>
      <p className="mt-2 line-clamp-3">{film.description}</p>
      <Link href={`/films/${film.id}`} className="mt-4 inline-block text-sm font-semibold">View film</Link>
    </div>
  </article>;
}
