"use client";

import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "ghibli-compass-watchlist";

export function useWatchlist() {
  const [watchlist, setWatchlist] = useState<string[]>([]);
  useEffect(() => { setWatchlist(JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]")); }, []);
  const toggle = useCallback((id: string) => setWatchlist(current => {
    const next = current.includes(id) ? current.filter(item => item !== id) : [...current, id];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    return next;
  }), []);
  return { watchlist, toggle, has: (id: string) => watchlist.includes(id) };
}
