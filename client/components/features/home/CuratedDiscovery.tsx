import type { Film } from "@/types/film";
import { FilterableFilmGrid } from "./FilterableFilmGrid";

export function CuratedDiscovery({ films }: { films: Film[] }) {
    return (
        <section className="mx-4 sm:mx-6 md:mx-10 lg:mx-16 min-[1440px]:mx-24">
            <div className="mx-auto max-w-[1280px] pt-section-mobile md:pt-section-desktop">
                <h2 className="mb-3 text-2xl font-semibold sm:text-3xl">
                    Curated Discovery
                </h2>
                <p className="max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
                    Explore our handpicked selections of Studio Ghibli films,
                    carefully chosen to suit every taste and mood.
                </p>
            </div>
            <FilterableFilmGrid films={films} />
        </section>
    );
}
