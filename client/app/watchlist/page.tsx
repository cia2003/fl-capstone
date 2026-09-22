import WatchlistClientSection from "@/components/features/watchlist/WatchListClientSection";
import { getFilms } from "@/lib/api/ghibliClient";

export default async function Page() {
  const films = await getFilms()
  
  return (
    <main id="main-content" tabIndex={-1} className="mx-5 min-h-[calc(100vh-64px)] md:mx-10 lg:mx-16 min-[1440px]:mx-24">
      <section className="mx-auto max-w-[1280px] py-8 md:py-16">
        <p className="text-caption font-medium tracking-caption text-primary">
          Watchlist
        </p>

        <h1 className="mt-2">
          These are your favorite movies
        </h1>
        <WatchlistClientSection initialFilms={films} />
      </section>
    </main>
  )
}
