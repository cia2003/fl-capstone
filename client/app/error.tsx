"use client"

import Link from "next/link"
import { CatAnimation } from "@/components/ui/CatAnimation"

export default function Error() {
  return (
    <main id="main-content" tabIndex={-1} className="mx-5 min-h-[calc(100vh-64px)] md:mx-10 lg:mx-16 min-[1440px]:mx-24">
      <section className="mx-auto flex max-w-[1280px] flex-col items-center py-8 text-center md:py-16">
        <CatAnimation size="md" />

        <p className="mt-6 text-caption font-medium tracking-caption text-primary">
          Something went wrong
        </p>

        <h1 className="mt-2">
          We could not load that story
        </h1>

        <p className="mt-3 max-w-lg">
          Something interrupted the journey. Please try again.
        </p>

        <Link
          href="/"
          className="mt-6 rounded-button border-[1.5px] border-primary px-button-x py-button-y text-sm font-semibold text-primary no-underline transition-colors hover:bg-primary hover:text-background"
        >
          Return to the film library
        </Link>
      </section>
    </main>
  )
}
