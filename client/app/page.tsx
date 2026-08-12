export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-5xl flex-col justify-center px-6 py-16">
      <p className="text-sm font-medium uppercase tracking-[0.2em] text-zinc-500">
        Cat breed matching
      </p>
      <h1 className="mt-4 max-w-2xl text-4xl font-semibold tracking-tight text-zinc-900 sm:text-5xl">
        Find the cat breed that fits your lifestyle.
      </h1>
      <p className="mt-6 max-w-2xl text-lg text-zinc-600">
        Starting from a quick profile, discover the best breed matches, compare traits,
        and get AI-backed interpretation grounded in real cat data.
      </p>

      <div className="mt-8 flex flex-wrap gap-4">
        <a
          href="/profile"
          className="rounded-md bg-zinc-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-zinc-700"
        >
          Start intake
        </a>
        <a
          href="/breeds"
          className="rounded-md border border-zinc-200 bg-white px-5 py-3 text-sm font-medium text-zinc-900 transition hover:bg-zinc-50"
        >
          Browse breeds
        </a>
      </div>
    </main>
  );
}
