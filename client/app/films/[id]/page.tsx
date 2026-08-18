import { notFound } from "next/navigation";
import { FilmDetail } from "@/components/features/films/FilmDetail";
import { getFilm } from "@/lib/api/ghibliClient";

export default async function FilmPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const film = await getFilm(id); if (!film) notFound();

  return (
    <main role="main" className="mx-5 min-h-[calc(100vh-64px)] md:mx-10 lg:mx-16 min-[1440px]:mx-24">
      <section className="py-section-mobile md:py-section">
        <FilmDetail film={film} />
      </section>
    </main>
  )
}
