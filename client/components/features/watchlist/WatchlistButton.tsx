"use client";

// import { Button } from "@/components/ui";
import { useWatchlist } from "@/hooks/useWatchlist";
import dynamic from "next/dynamic";


const LazyButton = dynamic(
  () => import("@/components/ui/Button").then(
    (module) => module.Button
  ),
  {
    ssr: false
  }
)
export function WatchlistButton({ filmId }: { filmId: string }) {
  const { has, toggle } = useWatchlist();

  const saved = has(filmId);

  return (
    <LazyButton
      variant="secondary"
      className="mt-6 cursor-pointer"
      idleLabel={saved ? "Remove from watchlist" : "Save to watchlist"}
      loadingLabel="Saving..."
      successLabel={saved ? "Removed" : "Saved"}
      errorLabel="Retry"
      onAction={() => {
        toggle(filmId);
      }}
    />
  );
}