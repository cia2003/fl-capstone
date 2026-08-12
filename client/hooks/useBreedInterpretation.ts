"use client";

import { useState } from "react";

export function useBreedInterpretation() {
  const [data, setData] = useState<null | Record<string, unknown>>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchInterpretation = async () => {
    setLoading(true);
    setError(null);

    try {
      await new Promise((resolve) => setTimeout(resolve, 100));
      setData({ status: "placeholder" });
    } catch {
      setError("Unable to load breed interpretation.");
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, fetchInterpretation };
}
