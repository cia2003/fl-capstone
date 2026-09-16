import { ChatInput } from "@/components/features/recommend/ChatInput";

export default async function FindMyFilmPage() {
  return (
  <main role="main" className="mx-5 min-h-[calc(100vh-64px)] md:mx-10 lg:mx-16 min-[1440px]:mx-24">
    <section className="relative mx-auto max-w-3xl py-section-mobile md:py-section">
      <ChatInput />
    </section>
  </main>)
}
