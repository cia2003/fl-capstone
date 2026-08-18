import { FilmCard } from "@/components/features/films/FilmCard";
import { getFilms } from "@/lib/api/ghibliClient";

export default async function Page() {
  const films = (await getFilms()).sort((a, b) => a.title.localeCompare(b.title));
  return (
  <main role="main" className="mx-5 min-h-[calc(100vh-64px)] md:mx-10 lg:mx-16 min-[1440px]:mx-24">
    <section className="mx-auto max-w-[1280px] py-section-mobile md:py-section">
      <p className="text-caption font-medium tracking-caption text-primary">STUDIO GHIBLI FILM GUIDE</p>
      <h1 className="mt-2">Find a story for your next quiet evening.</h1><p className="mt-4 max-w-2xl">Browse verified film details, save your favourites locally, or ask Ghibli Compass for a thoughtful starting point.</p>
      {/* <div className="mt-8 grid gap-element sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {films.map(film => <FilmCard key={film.id} film={film} />)}
      </div> */}
    </section>
  </main>)
}
