import Link from "next/link";
import type { Film, Recommendation } from "@/types";
import { formatReleaseDate } from "@/lib/utils/format";

export function RankedResultItem({ recommendation, film, rank }: { recommendation: Recommendation; film: Film; rank: number }) {
  return <li className="rounded-card border border-primary/20 bg-white/35 p-card">
    <p className="text-caption font-medium tracking-caption text-text/70">#{rank} match · {recommendation.score}%</p>
    <h3 className="mt-1">{film.title} <span className="font-body text-sm font-normal text-text/65">({formatReleaseDate(film.release_date)})</span></h3>
    <p className="mt-2">{recommendation.reasoning}</p>
    <Link href={`/films/${film.id}`} className="mt-3 inline-block text-sm font-semibold">Check verified film details</Link>
  </li>;
}
