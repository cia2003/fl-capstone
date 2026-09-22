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

type FilmSection = {
  title: string;
  films: Film[];
};

function CategoryHeader({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <section className="pt-section-mobile mx-5 md:mx-10 md:pt-section-desktop lg:mx-16 min-[1440px]:mx-24">
      <div className="mx-auto max-w-[1280px]">
        <h1 className="mb-2 text-2xl font-semibold">{title}</h1>
        <p className="mb-6 max-w-2xl text-sm text-muted-foreground">
          {description}
        </p>
      </div>
    </section>
  );
}

function FilmSections({ sections }: { sections: FilmSection[] }) {
  return (
    <div className="space-y-12">
      {sections.map((section) => (
        <section key={section.title}>
          <div className="mx-5 mb-4 md:mx-10 lg:mx-16 min-[1440px]:mx-24">
            <div className="mx-auto max-w-[1280px]">
              <h2 className="text-xl font-semibold">{section.title}</h2>
            </div>
          </div>

          <FilmGrid films={section.films} />
        </section>
      ))}
    </div>
  );
}

function getReleaseSections(films: Film[]): FilmSection[] {
  const decades = [
    [1980, 1990],
    [1990, 2000],
    [2000, 2010],
    [2010, 2020],
    [2020, Infinity],
  ];

  return decades.map(([start, end]) => ({
    title: `${start}s`,
    films: films.filter((film) => {
      const year = Number(film.release_date);
      return year >= start && year < end;
    }),
  }));
}

function getDirectorSections(films: Film[]): FilmSection[] {
  const directors = [...new Set(films.map((film) => film.director))];

  return directors.map((director) => ({
    title: director,
    films: films.filter((film) => film.director === director),
  }));
}

function getCategoryFilms(category: string, films: Film[]): Film[] {
  switch (category) {
    case "highly-rated":
      return films
        .filter((film) => Number(film.rt_score) >= 90)
        .sort((a, b) => Number(b.rt_score) - Number(a.rt_score));

    case "classics":
      return films
        .filter((film) => Number(film.release_date) < 2000)
        .sort(
          (a, b) =>
            Number(a.release_date) - Number(b.release_date),
        );

    case "short-and-simple":
      return films
        .filter((film) => Number(film.running_time) <= 90)
        .sort(
          (a, b) =>
            Number(a.running_time) - Number(b.running_time),
        );

    default:
      return [];
  }
}

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

  const sections =
    category === "release"
      ? getReleaseSections(films)
      : category === "director"
        ? getDirectorSections(films)
        : [];

  const categoryFilms = getCategoryFilms(category, films);

  return (
    <main id="main-content" tabIndex={-1}>
      <CategoryHeader
        title={info.title}
        description={info.description}
      />

      {sections.length > 0 ? (
        <FilmSections sections={sections} />
      ) : (
        <FilmGrid films={categoryFilms} />
      )}
    </main>
  );
}