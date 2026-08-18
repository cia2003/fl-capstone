"use client";

import { useState } from "react";
import type { Film, Recommendation } from "@/types";
import { Button, Input } from "@/components/ui";
import { RankedResultList } from "./RankedResultList";

export function ChatInput({ films }: { films: Film[] }) {
  const [query, setQuery] = useState(""); const [results, setResults] = useState<Recommendation[]>([]); const [error, setError] = useState(""); const [loading, setLoading] = useState(false);
  async function submit(event: React.FormEvent) {
    event.preventDefault(); setLoading(true); setError("");
    try { const response = await fetch("/api/ai/recommend", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ query, films }) });
      if (!response.ok) throw new Error((await response.json()).error ?? "Could not find a film.");
      const data = JSON.parse(await response.text()) as { recommendations: Recommendation[] }; setResults(data.recommendations);
    } catch (reason) { setError(reason instanceof Error ? reason.message : "Could not find a film."); } finally { setLoading(false); }
  }
  return <><form onSubmit={submit} className="mt-6 flex flex-col gap-3 sm:flex-row"><label className="sr-only" htmlFor="film-query">What are you in the mood for?</label><Input id="film-query" value={query} onChange={event => setQuery(event.target.value)} placeholder="I want a gentle, hopeful adventure…" required /><Button type="submit" disabled={loading}>{loading ? "Thinking…" : "Recommend"}</Button></form>{error && <p role="alert" className="mt-3 text-primary">{error}</p>}{results.length > 0 && <RankedResultList recommendations={results} films={films} />}</>;
}
