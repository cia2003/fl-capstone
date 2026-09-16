import { GhibliHero } from "@/components/features/home/GhibliHero";
import { getFilms } from "@/lib/api/ghibliClient";
import { StartingPoint } from "@/components/features/home/StartingPoint";
import { CuratedDiscovery } from "@/components/features/home/CuratedDiscovery";
import { MovieCarousel3DLoader } from "@/components/features/home/MovieCarousel3D/MovieCarousel3DLoader";

export default async function Page() {
  const films = (await getFilms()).sort((a, b) => a.title.localeCompare(b.title));
  const topFilms = [...films]
    .sort((a, b) => Number(b.rt_score) - Number(a.rt_score))
    .slice(0, 9);
  return (
  <main role="main">
    <GhibliHero films={films} />
    <MovieCarousel3DLoader films={topFilms} />
    <StartingPoint />
    <CuratedDiscovery films={films} />
  </main>)
}
