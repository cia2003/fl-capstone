import Link from "next/link";
import type { Film, Recommendation } from "@/types";
import { formatReleaseDate } from "@/lib/utils/format";

export function RankedResultItem({ recommendation, film, rank }: { recommendation: Recommendation; film: Film; rank: number }) {
  return <li className="rounded-card border border-primary/20 bg-white/35 p-card">
    <p className="text-caption font-medium tracking-caption text-text/70">#{rank} match · {recommendation.score * 100}%</p>
    <h3 className="mt-1">{film.title} <span className="font-body text-sm font-normal text-text/65">({formatReleaseDate(film.release_date)})</span></h3>
    <p className="mt-2">{recommendation.reasoning}</p>
    <Link href={`/films/${film.id}`} className="mt-3 inline-block text-sm font-semibold" target="_blank">Check verified film details</Link>
  </li>;
}

export function RankedResultItemSkeleton() {
  return (
    <li className="animate-pulse rounded-card border border-primary/20 bg-white/35 p-card">
      <div className="flex gap-4">
        {/* Poster */}
        <div className="h-32 w-20 shrink-0 rounded-lg bg-muted" />

        <div className="flex-1 space-y-3">
          {/* Rank + title */}
          <div className="h-5 w-3/4 rounded bg-muted" />

          {/* Description */}
          <div className="h-4 w-full rounded bg-muted" />
          <div className="h-4 w-5/6 rounded bg-muted" />

          {/* Score */}
          <div className="h-4 w-20 rounded bg-muted" />
        </div>
      </div>
    </li>
  );
}
