import { GhibliHero } from "@/components/features/home/GhibliHero";
import { getFilms } from "@/lib/api/ghibliClient";
import { TopMovies } from "@/components/features/home/TopMovies";
import { StartingPoint } from "@/components/features/home/StartingPoint";
import { CuratedDiscovery } from "@/components/features/home/CuratedDiscovery";

export default async function Page() {
  const films = (await getFilms()).sort((a, b) => a.title.localeCompare(b.title));
  return (
  <main role="main">
    <GhibliHero films={films} />
    <TopMovies films={films} />
    <StartingPoint />
    <CuratedDiscovery films={films} />
  </main>)
}
