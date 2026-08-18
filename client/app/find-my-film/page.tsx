import { ChatInput } from "@/components/features/recommend/ChatInput";
import { getFilms } from "@/lib/api/ghibliClient";

export default async function FindMyFilmPage() {
  const films = await getFilms();
  return (
  <main role="main" className="mx-5 min-h-[calc(100vh-64px)] md:mx-10 lg:mx-16 min-[1440px]:mx-24">
    <section className="mx-auto max-w-3xl py-section-mobile md:py-section">
      <p className="text-caption font-medium tracking-caption text-primary">FILM COMPASS</p>
      <h1 className="mt-2">What kind of story do you need?</h1>
      <p className="mt-4">Describe a feeling, pace, or theme. Recommendations are ranked against the verified Ghibli film list.</p>
      <ChatInput films={films} />
    </section>
  </main>)
}
