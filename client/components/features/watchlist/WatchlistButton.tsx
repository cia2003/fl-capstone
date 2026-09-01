"use client";

import { Button } from "@/components/ui";
import { useWatchlist } from "@/hooks/useWatchlist";

export function WatchlistButton({ filmId }: { filmId: string }) {
  const { has, toggle } = useWatchlist();
  return <Button variant="secondary" className="mt-6 cursor-pointer" onClick={() => toggle(filmId)}>{has(filmId) ? "Remove from watchlist" : "Save to watchlist"}</Button>;
}
