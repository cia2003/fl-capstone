"use client";

import { useCallback, useEffect, useState } from "react";
import Cookies from "js-cookie";

const STORAGE_KEY = "ghibli-compass-watchlist";

export function useWatchlist() {
  const [watchlist, setWatchlist] = useState<string[]>([]);

  useEffect(() => {
    const stored = Cookies.get(STORAGE_KEY);

    if (!stored) return;

    try {
      setWatchlist(JSON.parse(stored));
    } catch {
      setWatchlist([]);
    }
  }, []);

  const toggle = useCallback((id: string) => {
    setWatchlist((current) => {
      const next = current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id];

      Cookies.set(STORAGE_KEY, JSON.stringify(next), {
        expires: 365,
      });

      return next;
    });
  }, []);

  const has = useCallback(
    (id: string) => watchlist.includes(id),
    [watchlist]
  );

  return { watchlist, toggle, has };
}