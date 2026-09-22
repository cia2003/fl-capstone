export function FilmCardSkeleton() {
  return (
    <article className="relative overflow-hidden rounded-card border border-primary/20 bg-white/35 shadow-sm">
      {/* Poster image */}
      <div className="relative h-72 w-full animate-pulse bg-muted" />

      <div className="p-card">
        {/* Bookmark icon placeholder */}
        <div className="absolute right-3 top-3 h-[35px] w-[35px] animate-pulse rounded-full border border-primary/20 bg-white" />

        {/* Rating badge placeholder */}
        <div className="absolute left-3 top-3 h-[40px] w-[60px] animate-pulse rounded-[10px] bg-white" />

        {/* Release date · runtime */}
        <div className="h-3 w-2/3 animate-pulse rounded bg-muted" />

        {/* Title */}
        <div className="mt-2 h-5 w-4/5 animate-pulse rounded bg-muted" />
      </div>
    </article>
  );
}