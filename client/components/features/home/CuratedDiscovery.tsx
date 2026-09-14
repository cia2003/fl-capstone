"use client";

import type { Film } from "@/types/film";
import { FilmCard } from "../films/FilmCard";
import { useMemo, useState } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
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

    const paginationItems = useMemo(() => {
        if (totalPages <= 4) {
            return Array.from({ length: totalPages }, (_, i) => i + 1);
        }

        const pages: (number | "ellipsis")[] = [1];

        if (currentPage > 4) {
            pages.push("ellipsis");
        }

        const startPage = Math.max(2, currentPage - 1);
        const endPage = Math.min(totalPages - 1, currentPage + 1);

        for (let page = startPage; page <= endPage; page++) {
            pages.push(page);
        }

        if (currentPage < totalPages - 3) {
            pages.push("ellipsis");
        }

        pages.push(totalPages);

        return pages;
    }, [currentPage, totalPages]);

    const handleFilterChange = (
        setter: React.Dispatch<React.SetStateAction<string>>,
        value: string
    ) => {
        setter(value);
        setCurrentPage(1);
    };

    return (
        <section className="mx-4 sm:mx-6 md:mx-10 lg:mx-16 min-[1440px]:mx-24">
            <div className="mx-auto max-w-[1280px] pt-section-mobile md:pt-section-desktop">
                <h2 className="mb-3 text-2xl font-semibold sm:text-3xl">
                    Curated Discovery
                </h2>

                <p className="max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
                    Explore our handpicked selections of Studio Ghibli films,
                    carefully chosen to suit every taste and mood.
                </p>
            </div>

            <div className="mx-auto grid max-w-[1280px] gap-8 py-8 md:grid-cols-[220px_minmax(0,1fr)]">
                {/* FILTER SIDEBAR */}
                <aside className="min-w-0">
                    {/* Search */}
                    <div className="relative mb-6">
                        <LuSearch
                            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                            aria-hidden="true"
                        />

                        <Input
                            placeholder="Search by title"
                            value={search}
                            onChange={(e) => {
                                setSearch(e.target.value);
                                setCurrentPage(1);
                            }}
                            className="w-full pr-10"
                        />
                    </div>

                    {/* Filters */}
                    <div>
                        <h3 className="text-lg font-medium">
                            Filter Films
                        </h3>

                        <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-1">
                            <select
                                value={releaseYear}
                                className="min-w-0 rounded-md border px-3 py-2 text-sm hover:cursor-pointer"
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
                                className="min-w-0 rounded-md border px-3 py-2 text-sm hover:cursor-pointer"
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
                                className="min-w-0 rounded-md border px-3 py-2 text-sm hover:cursor-pointer"
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
                                className="min-w-0 rounded-md border px-3 py-2 text-sm hover:cursor-pointer"
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
                </aside>

                {/* FILMS */}
                <div className="min-w-0 pb-section-mobile md:pb-section-desktop">
                    {currentFilms.length > 0 ? (
                        <>
                            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:gap-6 xl:grid-cols-3">
                                {currentFilms.map((film) => (
                                    <FilmCard
                                        key={film.id}
                                        film={film}
                                    />
                                ))}
                            </div>

                            {/* PAGINATION */}
                            {totalPages > 1 && (
                                <div className="mt-8 flex w-full items-center justify-center gap-1.5 sm:gap-2">
                                    {/* Previous */}
                                    <Button
                                        disabled={currentPage === 1}
                                        onAction={() =>
                                            setCurrentPage((page) => Math.max(1, page - 1))
                                        }
                                        idleLabel="←"
                                        loadingLabel="..."
                                        successLabel="←"
                                        errorLabel="Retry"
                                        className="shrink-0 px-2.5 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-40 sm:px-3"
                                    />

                                    {/* Page numbers */}
                                    <div className="flex min-w-0 items-center justify-center gap-1.5 sm:gap-2">
                                        {paginationItems.map((item, index) => {
                                            if (item === "ellipsis") {
                                                return (
                                                    <span
                                                        key={`ellipsis-${index}`}
                                                        className="flex h-9 min-w-9 items-center justify-center text-sm text-muted-foreground sm:h-10 sm:min-w-10"
                                                        aria-hidden="true"
                                                    >
                                                        …
                                                    </span>
                                                );
                                            }

                                            const isActive = currentPage === item;

                                            return (
                                                <Button
                                                    key={item}
                                                    variant={isActive ? "primary" : "transparent"}
                                                    onAction={() => setCurrentPage(item)}
                                                    idleLabel={String(item)}
                                                    loadingLabel="..."
                                                    successLabel={String(item)}
                                                    errorLabel="Retry"
                                                    className="h-9 min-w-9 rounded-md px-2 text-sm sm:h-10 sm:min-w-10 sm:px-3"
                                                />
                                            );
                                        })}
                                    </div>

                                    {/* Next */}
                                    <Button
                                        disabled={currentPage === totalPages}
                                        onAction={() =>
                                            setCurrentPage((page) =>
                                                Math.min(totalPages, page + 1)
                                            )
                                        }
                                        idleLabel="→"
                                        loadingLabel="..."
                                        successLabel="→"
                                        errorLabel="Retry"
                                        className="shrink-0 px-2.5 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-40 sm:px-3"
                                    />
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