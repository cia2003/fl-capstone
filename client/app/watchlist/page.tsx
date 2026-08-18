"use client"

import { useWatchlist } from "@/hooks/useWatchlist"
import { getFilm } from "@/lib/api/ghibliClient"
import { useEffect, useState } from "react"
import { Film } from "@/types"
import { FilmCard } from "@/components/features/films/FilmCard"
import Link from "next/link"

export default function Page() { 
    const { watchlist } = useWatchlist()
    const [films, setFilms] = useState<Film[]>([])

    useEffect(() => {
        async function loadFilms() {
            const results = await Promise.all(
                watchlist.map((id) => getFilm(id))
            )
            
            setFilms(results.filter(
                (filtered): filtered is Film => filtered !== null
            ))
        }

        if (watchlist.length > 0) {
            loadFilms()
        } else {
            setFilms([])
        }
    }, [watchlist])

    return (
    <main role="main" className="mx-5 min-h-[calc(100vh-64px)] md:mx-10 lg:mx-16 min-[1440px]:mx-24">
        <section className="mx-auto max-w-[1280px] py-section-mobile md:py-section">
        <p className="text-caption font-medium tracking-caption text-primary">Watchlist</p>
        <h1 className="mt-2">This is your favorite movies</h1>

        {
            films.length > 0
                ?   <div className="mt-8 grid gap-element sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {films.map((film) => <FilmCard key={film.id} film={film} />)}
                    </div>
                : <div className="grid gap-2 w-fit">
                    <p className="mt-4 max-w-2xl">
                        I think you need to search you favorite one!
                    </p>
                    <Link href="/" className="text-center rounded-button border-[5px] border-primary px-button-x py-button-y text-sm font-semibold no-underline">Go Back Home</Link>
                </div>
        }
        </section>
    </main>
    )
}
