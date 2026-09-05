import { notFound } from "next/navigation";
import { getFilms } from "@/lib/api/ghibliClient";
import type { Film } from "@/types/film";
import { FilmGrid } from "@/components/features/films/FilmGrid";

export default async function FilmPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;

  const films = await getFilms() as Film[]
  const filteredFilms = films.filter(
    film => {
      switch (category) {
        case "highly-rated":
          return Number(film.rt_score) >= 90;
        case "classics":
          return Number(film.release_date) < 2000;
        case "short-and-simple":
          return Number(film.running_time) < 90;
        default:
          notFound();
      }
    }
);

  return (
    <main role="main">
      <section className="pt-section-mobile md:pt-section-desktop mx-5 md:mx-10 lg:mx-16 min-[1440px]:mx-24">
        <div className="mx-auto max-w-[1280px]">
          <h1 className="mb-4 text-2xl font-semibold">{category.replace(/-/g, ' ')}</h1>
          <p className="mb-6 text-sm text-muted-foreground">
            {category === "highly-rated" && "Experience the magic of animation with Studio Ghibli's timeless classics."}
            {category === "classics" && "Dive into fantastical worlds and imaginative storytelling."}
            {category === "short-and-simple" && "Embark on thrilling adventures with unforgettable characters."}
          </p>          
        </div>
      </section>
      <FilmGrid films={filteredFilms} />
    </main>
  )
}
