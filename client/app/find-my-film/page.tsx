import { ChatInput } from "@/components/features/recommend/ChatInput";
import { getFilms } from "@/lib/api/ghibliClient";

export default async function FindMyFilmPage() {
  const films = await getFilms();
  return (
  <main role="main" className="mx-5 min-h-[calc(100vh-64px)] md:mx-10 lg:mx-16 min-[1440px]:mx-24">
    <section className="mx-auto max-w-3xl py-section-mobile md:py-section">
      <ChatInput films={films} />
    </section>
  </main>)
}
