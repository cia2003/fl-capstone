'use client';

import { FormEvent, useState } from 'react';

const mealPlans = [
  'Chicken Salad',
  'Grilled Chicken Bowl',
  'Beef Stir Fry',
  'Vegetable Curry',
  'Vegan Breakfast',
  'Pasta Primavera',
];

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const [submittedQuery, setSubmittedQuery] = useState('');
  const [status, setStatus] = useState<'idle' | 'found' | 'not-found' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [searchAttempted, setSearchAttempted] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedQuery = query.trim();
    setSearchAttempted(true);

    if (!trimmedQuery) {
      setSubmittedQuery('');
      setStatus('error');
      setMessage('Please enter a food name to search.');
      return;
    }

    const hasMatch = mealPlans.some((plan) =>
      plan.toLowerCase().includes(trimmedQuery.toLowerCase()),
    );

    setSubmittedQuery(trimmedQuery);

    if (hasMatch) {
      setStatus('found');
      setMessage('Show result for:');
    } else {
      setStatus('not-found');
      setMessage('No results found for:');
    }
  };

  return (
    <section className="w-full max-w-xl rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <label htmlFor="meal-search" className="sr-only">
          Search meal plans by food name
        </label>
        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            id="meal-search"
            name="meal-search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search meal plans..."
            className="min-w-0 flex-1 rounded-2xl border border-zinc-300 bg-zinc-50 px-4 py-3 text-sm text-zinc-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-200 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
            aria-describedby="search-helper search-status"
          />
          <button
            type="submit"
            className="inline-flex h-12 items-center justify-center rounded-2xl bg-slate-950 px-5 text-sm font-semibold text-white transition hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500"
          >
            Search
          </button>
        </div>
        <p id="search-helper" className="text-sm text-zinc-500 dark:text-zinc-400">
          Search by food name to find matching meal plans.
        </p>
      </form>

      <div aria-live="polite" className="mt-3 min-h-[2.25rem] text-sm text-zinc-900 dark:text-zinc-100">
        {searchAttempted && status === 'error' && (
          <p id="search-status" className="text-red-600 dark:text-red-400">
            {message}
          </p>
        )}

        {searchAttempted && status !== 'error' && submittedQuery && (
          <p id="search-status" className="text-zinc-800 dark:text-zinc-200">
            {message}{' '}
            <span className="inline-flex rounded-full bg-yellow-100 px-2 py-[2px] text-sm font-semibold text-zinc-900 dark:bg-yellow-200 dark:text-zinc-950">
              {submittedQuery}
            </span>
          </p>
        )}
      </div>
    </section>
  );
}
