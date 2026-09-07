import { getFilms } from "@/lib/api/ghibliClient";
import type { Film } from "@/types/film";
import { FilmGrid } from "@/components/features/films/FilmGrid";

export default async function Explore() {
	const films = (await getFilms()) as Film[];

	return (
		<main role="main">
			<section className="pt-section-mobile mx-5 md:mx-10 md:pt-section-desktop lg:mx-16 min-[1440px]:mx-24">
				<div className="mx-auto max-w-[1280px]">
					<h1 className="mb-2 text-2xl font-semibold">All Movies</h1>
					<p className="mb-6 max-w-2xl text-sm text-muted-foreground">
						Explore the complete collection of Studio Ghibli films, from timeless classics to modern masterpieces.
					</p>
				</div>
			</section>

			<FilmGrid films={films} />
		</main>
	);
}