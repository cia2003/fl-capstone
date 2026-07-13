"use client";

import { useState } from "react";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [submitted, setSubmitted] = useState("");

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(query);
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col items-start">
      <div className="flex w-full gap-2">
        <input
          aria-label="search-input"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 rounded border px-3 py-2"
          placeholder="Search food name"
        />
        <button
          type="submit"
          className="rounded bg-black px-4 py-2 text-white"
        >
          search
        </button>
      </div>

      {submitted !== "" && (
        <p className="mt-2 text-sm">
          Show result for:{" "}
          <span className="bg-yellow-200 rounded px-1 py-0.5">
            {submitted}
          </span>
        </p>
      )}
    </form>
  );
}
