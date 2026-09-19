"use client"

import { useEffect, useState } from "react"
import Link from "next/link"

import { useWatchlist } from "@/hooks/useWatchlist"
import { getFilms } from "@/lib/api/ghibliClient"
import { Film } from "@/types"
import { FilmCard } from "@/components/features/films/FilmCard"
import { CatAnimation } from "@/components/ui/CatAnimation"

export default function Page() {
  const { watchlist } = useWatchlist()

  const [films, setFilms] = useState<Film[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    async function loadFilms() {
      if (watchlist.length === 0) {
        setFilms([])
        setIsLoading(false)
        return
      }

      setIsLoading(true)

      try {
        const allFilms = await getFilms()

        const watchlistFilms = allFilms.filter((film) =>
          watchlist.includes(film.id)
        )

        if (!cancelled) {
          setFilms(watchlistFilms)
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false)
        }
      }
    }

    loadFilms()

    return () => {
      cancelled = true
    }
  }, [watchlist])

  return (
    <main className="mx-5 min-h-[calc(100vh-64px)] md:mx-10 lg:mx-16 min-[1440px]:mx-24">
      <section className="mx-auto max-w-[1280px] py-8 md:py-16">
        <p className="text-caption font-medium tracking-caption text-primary">
          Watchlist
        </p>

        <h1 className="mt-2">
          These are your favorite movies
        </h1>

        {isLoading ? (
          <div className="flex flex-col items-center py-16 text-center">
            <CatAnimation size="sm" />

            <p className="mt-6">
              Finding your favorite stories…
            </p>
          </div>
        ) : films.length > 0 ? (
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {films.map((film, index) => (
              <FilmCard key={film.id} film={film} priority={index === 0} />
            ))}
          </div>
        ) : (
          <div className="mt-8 max-w-lg">
            <p>
              Your watchlist is empty. Find a story you’d like to keep
              around.
            </p>

            <Link
              href="/"
              className="mt-6 inline-block rounded-button border-[1.5px] border-primary px-button-x py-button-y text-sm font-semibold text-primary no-underline transition-colors hover:bg-primary hover:text-background"
            >
              Explore the films
            </Link>
          </div>
        )}
      </section>
    </main>
  )
}