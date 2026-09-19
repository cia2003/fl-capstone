// hooks/useWatchlist.ts
"use client";

import { useCallback, useState } from "react";
import Cookies from "js-cookie"

const STORAGE_KEY = "ghibli-compass-watchlist";

export function useWatchlist(initialWatchlist: string[] = []) {
  const [watchlist, setWatchlist] = useState<string[]>(initialWatchlist);

  const toggle = useCallback((id: string) => {
    setWatchlist((current) => {
      const next = current.includes(id) 
        ? current.filter((item) => item !== id) 
        : [...current, id];

      // Simpan ke Cookie (berlaku 365 hari)
      Cookies.set(STORAGE_KEY, JSON.stringify(next), { expires: 365 });
      return next;
    });
  }, []);

  return { watchlist, toggle, has: (id: string) => watchlist.includes(id) };
}