import { notFound } from "next/navigation";
import { getFilms } from "@/lib/api/ghibliClient";
import type { Film } from "@/types/film";
import { FilmGrid } from "@/components/features/films/FilmGrid";

const categoryInfo: Record<
  string,
  { title: string; description: string }
> = {
  release: {
    title: "By Release Year",
    description:
      "Explore Studio Ghibli films across the years and discover how its stories and animation have evolved over time.",
  },

  director: {
    title: "By Director",
    description:
      "Discover Studio Ghibli films through the unique visions and storytelling styles of its directors.",
  },

  "highly-rated": {
    title: "Highly Rated",
    description:
      "Discover some of the most highly rated Studio Ghibli films, loved by audiences around the world.",
  },

  classics: {
    title: "Classics",
    description:
      "Revisit the timeless Studio Ghibli films that helped shape the studio's beloved legacy.",
  },

  "short-and-simple": {
    title: "Short & Simple",
    description:
      "Looking for something easy to watch? Explore shorter Ghibli films that make for a simple and enjoyable viewing experience.",
  },
};

export default async function FilmPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;

  const info = categoryInfo[category];

  if (!info) {
    notFound();
  }

  const films = (await getFilms()) as Film[];

  /*
   * By Release Year
   */
  if (category === "release") {
    const releaseSections = [
      {
        title: "1980s",
        films: films.filter(
          (film) =>
            Number(film.release_date) >= 1980 &&
            Number(film.release_date) < 1990
        ),
      },
      {
        title: "1990s",
        films: films.filter(
          (film) =>
            Number(film.release_date) >= 1990 &&
            Number(film.release_date) < 2000
        ),
      },
      {
        title: "2000s",
        films: films.filter(
          (film) =>
            Number(film.release_date) >= 2000 &&
            Number(film.release_date) < 2010
        ),
      },
      {
        title: "2010s",
        films: films.filter(
          (film) =>
            Number(film.release_date) >= 2010 &&
            Number(film.release_date) < 2020
        ),
      },
      {
        title: "2020s",
        films: films.filter(
          (film) => Number(film.release_date) >= 2020
        ),
      },
    ];

    return (
      <main id="main-content" tabIndex={-1} role="main">
        <section className="pt-section-mobile mx-5 md:mx-10 md:pt-section-desktop lg:mx-16 min-[1440px]:mx-24">
          <div className="mx-auto max-w-[1280px]">
            <h1 className="mb-2 text-2xl font-semibold">
              {info.title}
            </h1>

            <p className="mb-6 max-w-2xl text-sm text-muted-foreground">
              {info.description}
            </p>
          </div>
        </section>

        <div className="space-y-12">
          {releaseSections.map((section) => (
            <section key={section.title}>
              <div className="mx-5 mb-4 md:mx-10 lg:mx-16 min-[1440px]:mx-24">
                <div className="mx-auto max-w-[1280px]">
                  <h2 className="text-xl font-semibold">
                    {section.title}
                  </h2>
                </div>
              </div>

              <FilmGrid films={section.films} />
            </section>
          ))}
        </div>
      </main>
    );
  }

  /*
   * By Director
   */
  if (category === "director") {
    const directors = [...new Set(films.map((film) => film.director))];

    return (
      <main id="main-content" tabIndex={-1} role="main">
        <section className="pt-section-mobile mx-5 md:mx-10 md:pt-section-desktop lg:mx-16 min-[1440px]:mx-24">
          <div className="mx-auto max-w-[1280px]">
            <h1 className="mb-2 text-2xl font-semibold">
              {info.title}
            </h1>

            <p className="mb-6 max-w-2xl text-sm text-muted-foreground">
              {info.description}
            </p>
          </div>
        </section>

        <div className="space-y-12">
          {directors.map((director) => {
            const directorFilms = films.filter(
              (film) => film.director === director
            );

            return (
              <section key={director}>
                <div className="mx-5 mb-4 md:mx-10 lg:mx-16 min-[1440px]:mx-24">
                  <div className="mx-auto max-w-[1280px]">
                    <h2 className="text-xl font-semibold">
                      {director}
                    </h2>
                  </div>
                </div>

                <FilmGrid films={directorFilms} />
              </section>
            );
          })}
        </div>
      </main>
    );
  }

  /*
   * Highly Rated
   */
  if (category === "highly-rated") {
    const highlyRatedFilms = films
      .filter((film) => Number(film.rt_score) >= 90)
      .sort((a, b) => Number(b.rt_score) - Number(a.rt_score));

    return (
      <main id="main-content" tabIndex={-1} role="main">
        <section className="pt-section-mobile mx-5 md:mx-10 md:pt-section-desktop lg:mx-16 min-[1440px]:mx-24">
          <div className="mx-auto max-w-[1280px]">
            <h1 className="mb-2 text-2xl font-semibold">
              {info.title}
            </h1>

            <p className="mb-6 max-w-2xl text-sm text-muted-foreground">
              {info.description}
            </p>
          </div>
        </section>

        <FilmGrid films={highlyRatedFilms} />
      </main>
    );
  }

  /*
   * Classics
   */
  if (category === "classics") {
    const classicFilms = films
      .filter((film) => Number(film.release_date) < 2000)
      .sort(
        (a, b) =>
          Number(a.release_date) - Number(b.release_date)
      );

    return (
      <main id="main-content" tabIndex={-1} role="main">
        <section className="pt-section-mobile mx-5 md:mx-10 md:pt-section-desktop lg:mx-16 min-[1440px]:mx-24">
          <div className="mx-auto max-w-[1280px]">
            <h1 className="mb-2 text-2xl font-semibold">
              {info.title}
            </h1>

            <p className="mb-6 max-w-2xl text-sm text-muted-foreground">
              {info.description}
            </p>
          </div>
        </section>

        <FilmGrid films={classicFilms} />
      </main>
    );
  }

  /*
   * Short & Simple
   */
  if (category === "short-and-simple") {
    const shortFilms = films
      .filter((film) => Number(film.running_time) <= 90)
      .sort(
        (a, b) =>
          Number(a.running_time) - Number(b.running_time)
      );

    return (
      <main id="main-content" tabIndex={-1} role="main">
        <section className="pt-section-mobile mx-5 md:mx-10 md:pt-section-desktop lg:mx-16 min-[1440px]:mx-24">
          <div className="mx-auto max-w-[1280px]">
            <h1 className="mb-2 text-2xl font-semibold">
              {info.title}
            </h1>

            <p className="mb-6 max-w-2xl text-sm text-muted-foreground">
              {info.description}
            </p>
          </div>
        </section>

        <FilmGrid films={shortFilms} />
      </main>
    );
  }

  return notFound();
}
