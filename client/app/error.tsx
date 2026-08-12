"use client";

export default function Error({ reset }: { reset: () => void }) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 px-6">
      <h2 className="text-2xl font-semibold text-zinc-900">Something went wrong.</h2>
      <button
        type="button"
        onClick={() => reset()}
        className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white"
      >
        Try again
      </button>
    </main>
  );
}
