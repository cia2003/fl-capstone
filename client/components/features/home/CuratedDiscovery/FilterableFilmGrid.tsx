"use client";

import { useMemo, useState } from "react";
import { LuSearch } from "react-icons/lu";
import { Button } from "@/components/ui/Button";
import { FilterSelect } from "@/components/ui/FilterSelect";
import { Input } from "@/components/ui/Input";
import type { Film } from "@/types/film";
import { FilmCard } from "../../films/FilmCard";

export function FilterableFilmGrid({ films }: { films: Film[] }) {
    const [openFilter, setOpenFilter] = useState<string | null>(null);
    const [search, setSearch] = useState("");
    const [releaseYear, setReleaseYear] = useState("");
    const [rtScore, setRtScore] = useState("");
    const [director, setDirector] = useState("");
    const [runningTime, setRunningTime] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const filmsPerPage = 6;

    const releaseYears = Array.from(new Set(films.map((film) => String(film.release_date)))).sort(
        (a, b) => Number(a) - Number(b)
    );
    const rtScores = Array.from(new Set(films.map((film) => String(film.rt_score)))).sort(
        (a, b) => Number(a) - Number(b)
    );
    const directors = Array.from(new Set(films.map((film) => film.director))).sort();
    const runningTimes = Array.from(new Set(films.map((film) => String(film.running_time)))).sort(
        (a, b) => Number(a) - Number(b)
    );

    const filteredFilms = useMemo(() => films.filter((film) => {
        const matchesSearch = film.title.toLowerCase().includes(search.toLowerCase());
        const matchesReleaseYear = releaseYear === "" || String(film.release_date) === releaseYear;
        const matchesRtScore = rtScore === "" || String(film.rt_score) === rtScore;
        const matchesDirector = director === "" || film.director === director;
        const matchesRunningTime = runningTime === "" || String(film.running_time) === runningTime;

        return matchesSearch && matchesReleaseYear && matchesRtScore && matchesDirector && matchesRunningTime;
    }), [films, search, releaseYear, rtScore, director, runningTime]);

    const totalPages = Math.ceil(filteredFilms.length / filmsPerPage);
    const startIndex = (currentPage - 1) * filmsPerPage;
    const currentFilms = filteredFilms.slice(startIndex, startIndex + filmsPerPage);

    const paginationItems = useMemo(() => {
        if (totalPages <= 4) return Array.from({ length: totalPages }, (_, i) => i + 1);

        const pages: (number | "ellipsis")[] = [1];
        if (currentPage > 4) pages.push("ellipsis");

        const startPage = Math.max(2, currentPage - 1);
        const endPage = Math.min(totalPages - 1, currentPage + 1);
        for (let page = startPage; page <= endPage; page++) pages.push(page);
        if (currentPage < totalPages - 3) pages.push("ellipsis");
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
        <div className="mx-auto grid max-w-[1280px] gap-8 py-8 md:grid-cols-[220px_minmax(0,1fr)]">
            <aside className="min-w-0">
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

                <div>
                    <h3 className="text-lg font-medium">Filter Films</h3>
                    <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-1">
                        <FilterSelect
                        label="Release Year"
                        value={releaseYear}
                        onChange={(value) => {
                            handleFilterChange(setReleaseYear, value);
                            setOpenFilter(null);
                        }}
                        options={releaseYears.map((year) => ({
                            value: year,
                            label: year,
                        }))}
                        isOpen={openFilter === "releaseYear"}
                        onToggle={() =>
                            setOpenFilter((current) =>
                            current === "releaseYear" ? null : "releaseYear"
                            )
                        }
                        />

                        <FilterSelect
                        label="Score"
                        value={rtScore}
                        onChange={(value) => {
                            handleFilterChange(setRtScore, value);
                            setOpenFilter(null);
                        }}
                        options={rtScores.map((score) => ({
                            value: score,
                            label: score,
                        }))}
                        isOpen={openFilter === "rtScore"}
                        onToggle={() =>
                            setOpenFilter((current) =>
                            current === "rtScore" ? null : "rtScore"
                            )
                        }
                        />

                        <FilterSelect
                        label="Director"
                        value={director}
                        onChange={(value) => {
                            handleFilterChange(setDirector, value);
                            setOpenFilter(null);
                        }}
                        options={directors.map((d) => ({
                            value: d,
                            label: d,
                        }))}
                        isOpen={openFilter === "director"}
                        onToggle={() =>
                            setOpenFilter((current) =>
                            current === "director" ? null : "director"
                            )
                        }
                        />

                        <FilterSelect
                        label="Running Time"
                        value={runningTime}
                        onChange={(value) => {
                            handleFilterChange(setRunningTime, value);
                            setOpenFilter(null);
                        }}
                        options={runningTimes.map((t) => ({
                            value: t,
                            label: t,
                        }))}
                        isOpen={openFilter === "runningTime"}
                        onToggle={() =>
                            setOpenFilter((current) =>
                            current === "runningTime" ? null : "runningTime"
                            )
                        }
                        />
                    </div>
                </div>
            </aside>

            <div className="min-w-0 pb-section-mobile md:pb-section-desktop">
                {currentFilms.length > 0 ? (
                    <>
                        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:gap-6 xl:grid-cols-3">
                            {currentFilms.map((film) => <FilmCard key={film.id} film={film} />)}
                        </div>

                        {totalPages > 1 && (
                            <div className="mt-8 flex w-full items-center justify-center gap-1.5 sm:gap-2">
                                <Button
                                    disabled={currentPage === 1}
                                    onAction={() => setCurrentPage((page) => Math.max(1, page - 1))}
                                    idleLabel="←"
                                    loadingLabel="..."
                                    successLabel="←"
                                    errorLabel="Retry"
                                    className="shrink-0 px-2.5 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-40 sm:px-3"
                                />
                                <div className="flex min-w-0 items-center justify-center gap-1.5 sm:gap-2">
                                    {paginationItems.map((item, index) => item === "ellipsis" ? (
                                        <span key={`ellipsis-${index}`} className="flex h-9 min-w-9 items-center justify-center text-sm text-muted-foreground sm:h-10 sm:min-w-10" aria-hidden="true">…</span>
                                    ) : (
                                        <Button
                                            key={item}
                                            variant={currentPage === item ? "primary" : "transparent"}
                                            onAction={() => setCurrentPage(item)}
                                            idleLabel={String(item)}
                                            loadingLabel="..."
                                            successLabel={String(item)}
                                            errorLabel="Retry"
                                            className="h-9 min-w-9 rounded-md px-2 text-sm sm:h-10 sm:min-w-10 sm:px-3"
                                        />
                                    ))}
                                </div>
                                <Button
                                    disabled={currentPage === totalPages}
                                    onAction={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
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
                        <p className="text-muted-foreground">No films found.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
