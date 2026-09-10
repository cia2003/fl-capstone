"use client";

import { Button } from "@/components/ui";
import { useWatchlist } from "@/hooks/useWatchlist";

export function WatchlistButton({ filmId }: { filmId: string }) {
  const { has, toggle } = useWatchlist();
  const saved = has(filmId);

  return (
    <Button
      variant="secondary"
      className="mt-6 cursor-pointer"
      idleLabel={saved ? "Remove from watchlist" : "Save to watchlist"}
      loadingLabel="Saving..."
      successLabel={saved ? "Removed" : "Saved"}
      errorLabel="Retry"
      onAction={() => toggle(filmId)}
    />
  );
}
