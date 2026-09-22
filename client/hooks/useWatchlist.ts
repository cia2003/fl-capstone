"use client";

import { useCallback, useEffect, useState, createContext, useContext } from "react";

const STORAGE_KEY = "ghibli-compass-watchlist";
type ToggleResult = "saved" | "removed" | "failed"

export function useWatchlist() {
  const [watchlist, setWatchlist] = useState<string[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);

    if (!stored) return;

    try {
      const parsed = JSON.parse(stored);

      if (Array.isArray(parsed)) {
        setWatchlist(parsed);
      }
    } catch {
      setWatchlist([]);
    }
  }, []);

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

  const has = useCallback((id: string): boolean => {
    const storage = localStorage.getItem(STORAGE_KEY);

    if (!storage) return false;

    try {
      const parsedStorage: unknown = JSON.parse(storage);

      if (!Array.isArray(parsedStorage)) {
        return false;
      }

      return parsedStorage.includes(id);
    } catch {
      return false;
    }
  }, []);

  return { watchlist, toggle, has };
}