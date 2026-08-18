import type { Film } from "@/types";
import { formatReleaseDate, formatRuntime } from "@/lib/utils/format";
import { WatchlistButton } from "@/components/features/watchlist/WatchlistButton";

export function FilmDetail({ film }: { film: Film }) {
  return <article className="mx-auto max-w-4xl">
    <div className="grid gap-8 md:grid-cols-[240px_1fr]">
      {film.image && <img src={film.image} alt={`Poster for ${film.title}`} className="w-full rounded-card" />}
      <div>
        <p className="text-caption font-medium tracking-caption text-text/70">{formatReleaseDate(film.release_date)} · {formatRuntime(film.running_time)} · RT {film.rt_score}</p>
        <h1 className="mt-2">{film.title}</h1>
        {film.original_title && <p className="mt-1 text-text/70">{film.original_title} ({film.original_title_romanised})</p>}
        <p className="mt-6">{film.description}</p>
        <dl className="mt-6 grid gap-4 sm:grid-cols-2">
          <div><dt className="text-caption font-medium tracking-caption text-text/70">Director</dt><dd>{film.director}</dd></div>
          <div><dt className="text-caption font-medium tracking-caption text-text/70">Producer</dt><dd>{film.producer}</dd></div>
        </dl>
        <WatchlistButton filmId={film.id} />
      </div>
    </div>
  </article>;
}
