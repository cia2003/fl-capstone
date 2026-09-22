function FilmCardSkeleton() {
    return (
        <div className="overflow-hidden rounded-lg border border-border">
            {/* poster */}
            <div className="aspect-[2/3] w-full animate-pulse bg-muted" />

            {/* text content */}
            <div className="space-y-2 p-4">
                <div className="h-4 w-3/4 animate-pulse rounded bg-muted" />
                <div className="h-3 w-1/2 animate-pulse rounded bg-muted" />
                <div className="h-3 w-1/3 animate-pulse rounded bg-muted" />
            </div>
        </div>
    );
}

export function FilterableFilmGridSkeleton() {
    return (
        <div className="mx-auto grid max-w-[1280px] gap-8 py-8 md:grid-cols-[220px_minmax(0,1fr)]">
            {/* Sidebar: search + filters */}
            <aside className="min-w-0">
                <div className="mb-6 h-10 w-full animate-pulse rounded-md bg-muted" />

                <div>
                    <div className="h-6 w-28 animate-pulse rounded bg-muted" />
                    <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-1">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <div
                                key={i}
                                className="h-10 w-full animate-pulse rounded-md bg-muted"
                            />
                        ))}
                    </div>
                </div>
            </aside>

            {/* Film grid + pagination */}
            <div className="min-w-0 pb-section-mobile md:pb-section-desktop">
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:gap-6 xl:grid-cols-3">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <FilmCardSkeleton key={i} />
                    ))}
                </div>

                <div className="mt-8 flex w-full items-center justify-center gap-1.5 sm:gap-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <div
                            key={i}
                            className="h-9 w-9 animate-pulse rounded-md bg-muted sm:h-10 sm:w-10"
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}