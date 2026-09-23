"use client";

import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "ghibli-compass-watchlist";
type ToggleResult = "saved" | "removed" | "failed"

function readStorage(): string[] {
  if (typeof window === "undefined") return [];

  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

export function useWatchlist() {
  const [watchlist, setWatchlist] = useState<string[]>([]);

  const toggle = useCallback((id: string): ToggleResult => {
    const storage = localStorage.getItem(STORAGE_KEY);

    try {
      const current: string[] = storage ? JSON.parse(storage) : [];

      const exists = current.includes(id);

      const next = exists
        ? current.filter((item) => item !== id)
        : [...current, id];

      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      setWatchlist(next);

      return exists ? "removed" : "saved";
    } catch {
      return "failed";
    }
  }, []);

  const has = useCallback(
    (id: string): boolean => watchlist.includes(id),
    [watchlist]
  );

  useEffect(() => {
    setWatchlist(readStorage())
  }, [])

  return { watchlist, toggle, has };
}