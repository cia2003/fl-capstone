import type { Film } from "@/types/film";
import { FilmCard } from "../films/FilmCard";

export function TopMovies({ films }: { films: Film[] }) {
    const topMovies = films.sort((a, b) => Number(b.rt_score) - Number(a.rt_score)).slice(0, 4);

    return (
        <section className="mx-5 md:mx-10 lg:mx-16 min-[1440px]:mx-24">
            <div className="mx-auto max-w-[1280px] pt-section-mobile md:pt-section-desktop">
                <h2 className="mb-4 text-2xl font-semibold">Top Movies</h2>
                <p className="mb-6 text-sm text-muted-foreground">
                    Explore the top-rated Studio Ghibli movies based on their Rotten Tomatoes scores.
                </p>
            </div>
            
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mx-auto max-w-[1280px]">
                {topMovies.map((film) => (
                    <FilmCard key={film.id} film={film} />
                ))}
            </div>
        </section>
    );
}