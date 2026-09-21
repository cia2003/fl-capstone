import { CatAnimation } from "@/components/ui/CatAnimation"

export default function Loading() {
  return (
    <main id="main-content" tabIndex={-1} className="mx-5 min-h-[calc(100vh-64px)] md:mx-10 lg:mx-16 min-[1440px]:mx-24">
      <section className="mx-auto flex max-w-[1280px] flex-col items-center py-8 text-center md:py-16">
        <CatAnimation size="md" />

        <p className="mt-6 text-caption font-medium tracking-caption text-primary">
          Please wait
        </p>

        <h1 className="mt-2">
          Finding the stories…
        </h1>

        <p className="mt-3 max-w-lg">
          We’re looking through the film library for you.
        </p>
      </section>
    </main>
  )
}
