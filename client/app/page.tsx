"use client";

import { FormEvent, useState } from "react";

const suggestions = ["Latest updates", "Inspiration", "Help center"];

export default function Home() {
  const [query, setQuery] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log("Searching for:", query);
  };

  return (
    <div className="min-h-screen bg-zinc-50 px-4 py-16 font-sans text-zinc-900 sm:px-6 lg:px-8">
      <main className="mx-auto flex w-full max-w-5xl flex-col items-center justify-center">
        <div className="w-full rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm sm:p-10 lg:p-12">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-indigo-600">
            Discover
          </p>
          <h1 className="max-w-2xl text-3xl font-semibold tracking-tight text-zinc-950 sm:text-4xl">
            Search for what you need in seconds.
          </h1>
          <p className="mt-3 max-w-2xl text-lg text-zinc-600">
            Find articles, products, or resources with a simple and focused search experience.
          </p>

          <form onSubmit={handleSubmit} className="mt-8">
            <div className="flex flex-col gap-3 rounded-2xl border border-zinc-200 bg-zinc-50 p-3 sm:flex-row sm:items-center">
              <label className="flex-1">
                <span className="sr-only">Search</span>
                <input
                  type="text"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Try “design systems”"
                  className="w-full rounded-xl border border-transparent bg-transparent px-4 py-3 text-base text-zinc-900 outline-none placeholder:text-zinc-500 focus:border-indigo-400"
                />
              </label>
              <button
                type="submit"
                className="rounded-xl bg-zinc-950 px-5 py-3 text-sm font-medium text-white transition hover:bg-zinc-800"
              >
                Search
              </button>
            </div>
          </form>

          <div className="mt-4 flex flex-wrap gap-2">
            {suggestions.map((suggestion) => (
              <span
                key={suggestion}
                className="rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-sm text-zinc-600"
              >
                {suggestion}
              </span>
            ))}
          </div>

          {query ? (
            <p className="mt-6 text-sm text-zinc-500">
              Showing results for: <span className="font-medium text-zinc-700">{query}</span>
            </p>
          ) : null}
        </div>
      </main>
    </div>
  );
}
