"use client";

import type { Film } from "@/types/film";
import { FilmCard } from "../films/FilmCard";
import { useMemo, useState } from "react";
import { Input } from "@/components/ui/Input";
import { LuSearch } from "react-icons/lu";

export function CuratedDiscovery({ films }: { films: Film[] }) {
    const [search, setSearch] = useState("");
    const [releaseYear, setReleaseYear] = useState("");
    const [rtScore, setRtScore] = useState("");
    const [director, setDirector] = useState("");
    const [runningTime, setRunningTime] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    const filmsPerPage = 6;

    const releaseYears = Array.from(
        new Set(films.map((film) => film.release_date))
    ).sort((a, b) => Number(a) - Number(b));

    const rtScores = Array.from(
        new Set(films.map((film) => film.rt_score))
    ).sort((a, b) => Number(a) - Number(b));

    const directors = Array.from(
        new Set(films.map((film) => film.director))
    ).sort();

    const runningTimes = Array.from(
        new Set(films.map((film) => film.running_time))
    ).sort((a, b) => Number(a) - Number(b));

    // Filter + search
    const filteredFilms = useMemo(() => {
        return films.filter((film) => {
            const matchesSearch = film.title
                .toLowerCase()
                .includes(search.toLowerCase());

            const matchesReleaseYear =
                releaseYear === "" || film.release_date === releaseYear;

            const matchesRtScore =
                rtScore === "" || film.rt_score === rtScore;

            const matchesDirector =
                director === "" || film.director === director;

            const matchesRunningTime =
                runningTime === "" || film.running_time === runningTime;

            return (
                matchesSearch &&
                matchesReleaseYear &&
                matchesRtScore &&
                matchesDirector &&
                matchesRunningTime
            );
        });
    }, [films, search, releaseYear, rtScore, director, runningTime]);

    // Pagination
    const totalPages = Math.ceil(filteredFilms.length / filmsPerPage);

    const startIndex = (currentPage - 1) * filmsPerPage;
    const currentFilms = filteredFilms.slice(
        startIndex,
        startIndex + filmsPerPage
    );

    const handleFilterChange = (
        setter: React.Dispatch<React.SetStateAction<string>>,
        value: string
    ) => {
        setter(value);
        setCurrentPage(1);
    };

    return (
        <section className="mx-5 md:mx-10 lg:mx-16 min-[1440px]:mx-24">
            <div className="mx-auto max-w-[1280px] pt-section-mobile md:pt-section-desktop">
                <h2 className="mb-4 text-2xl font-semibold">
                    Curated Discovery
                </h2>

                <p className="mb-6 text-sm text-muted-foreground">
                    Explore our handpicked selections of Studio Ghibli films,
                    carefully chosen to suit every taste and mood.
                </p>
            </div>

            <div className="mx-auto grid max-w-[1280px] gap-8 md:grid-cols-[220px_1fr]">
                {/* FILTER SIDEBAR */}
                <div>
                    {/* Search */}
                    <div className="relative mb-6">
                        <LuSearch className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" />

                        <Input
                            placeholder="Search by title"
                            value={search}
                            onChange={(e) => {
                                setSearch(e.target.value);
                                setCurrentPage(1);
                            }}
                        />
                    </div>

                    {/* Filters */}
                    <div className="mb-6">
                        <h3 className="text-lg font-medium">
                            Filter Films
                        </h3>

                        <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-1">
                            <select
                                value={releaseYear}
                                className="rounded-md border px-3 py-2 hover:cursor-pointer"
                                onChange={(e) =>
                                    handleFilterChange(
                                        setReleaseYear,
                                        e.target.value
                                    )
                                }
                            >
                                <option value="">Release Year</option>

                                {releaseYears.map((year) => (
                                    <option key={year} value={year}>
                                        {year}
                                    </option>
                                ))}
                            </select>

                            <select
                                value={rtScore}
                                className="rounded-md border px-3 py-2 hover:cursor-pointer"
                                onChange={(e) =>
                                    handleFilterChange(
                                        setRtScore,
                                        e.target.value
                                    )
                                }
                            >
                                <option value="">
                                    Rotten Tomatoes Score
                                </option>

                                {rtScores.map((score) => (
                                    <option key={score} value={score}>
                                        {score}
                                    </option>
                                ))}
                            </select>

                            <select
                                value={director}
                                className="rounded-md border px-3 py-2 hover:cursor-pointer"
                                onChange={(e) =>
                                    handleFilterChange(
                                        setDirector,
                                        e.target.value
                                    )
                                }
                            >
                                <option value="">Director</option>

                                {directors.map((director) => (
                                    <option key={director} value={director}>
                                        {director}
                                    </option>
                                ))}
                            </select>

                            <select
                                value={runningTime}
                                className="rounded-md border px-3 py-2 hover:cursor-pointer"
                                onChange={(e) =>
                                    handleFilterChange(
                                        setRunningTime,
                                        e.target.value
                                    )
                                }
                            >
                                <option value="">Running Time</option>

                                {runningTimes.map((time) => (
                                    <option key={time} value={time}>
                                        {time}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* FILMS */}
                <div className="pb-section-mobile md:pb-section-desktop">
                    {currentFilms.length > 0 ? (
                        <>
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                {currentFilms.map((film) => (
                                    <FilmCard
                                        key={film.id}
                                        film={film}
                                    />
                                ))}
                            </div>

                            {/* PAGINATION */}
                            {totalPages > 1 && (
                                <div className="mt-8 flex items-center justify-center gap-2">
                                    <button
                                        disabled={currentPage === 1}
                                        onClick={() =>
                                            setCurrentPage((page) =>
                                                page - 1
                                            )
                                        }
                                        className="rounded-md border px-3 py-2 disabled:cursor-not-allowed disabled:opacity-40"
                                    >
                                        ←
                                    </button>

                                    {Array.from(
                                        { length: totalPages },
                                        (_, index) => index + 1
                                    ).map((page) => (
                                        <button
                                            key={page}
                                            onClick={() =>
                                                setCurrentPage(page)
                                            }
                                            className={`rounded-md px-3 py-2 ${
                                                currentPage === page
                                                    ? "bg-primary text-white"
                                                    : ""
                                            }`}
                                        >
                                            {page}
                                        </button>
                                    ))}

                                    <button
                                        disabled={currentPage === totalPages}
                                        onClick={() =>
                                            setCurrentPage((page) =>
                                                page + 1
                                            )
                                        }
                                        className="rounded-md border px-3 py-2 disabled:cursor-not-allowed disabled:opacity-40"
                                    >
                                        →
                                    </button>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="py-16 text-center">
                            <p className="text-muted-foreground">
                                No films found.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}