
export function FilmGridSkeleton() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, index) => ( 
                <div key={index} className="animate-pulse">
                    <div className="h-64 w-full rounded-card bg-muted" />
                    <div className="mt-4 h-6 w-3/4 rounded bg-muted" />
                    <div className="mt-2 h-4 w-1/2 rounded bg-muted" />
                </div>
            ))}
        </div>
    );
}