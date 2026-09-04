"use client"

import type { Film } from "@/types";
import { FilmCard } from "./FilmCard";
import { useState } from "react";

export function FilmGrid({ films }: { films: Film[] }) {
  const [value, setValue] = useState("title-asc");
  const filteredFilms = [...films].sort((a, b) => {
    switch (value) {
      case "title-asc":
        return a.title.localeCompare(b.title);
      case "title-desc":
        return b.title.localeCompare(a.title);
      case "date-newest":
        return new Date(b.release_date).getTime() - new Date(a.release_date).getTime();
      case "date-oldest":
        return new Date(a.release_date).getTime() - new Date(b.release_date).getTime();
        default:
        return 0;
    }
    });
  
  return (
    <div className="relative mx-5 md:mx-10 lg:mx-16 min-[1440px]:mx-24">
        <div className="flex justify-between items-center mt-8 mx-auto max-w-[1280px]">
            <h2 className="text-lg font-bold">All Films</h2>
            <select
                value={value}
                onChange={(e) => setValue(e.target.value)}
                name="sort"
                className="rounded-md border px-3 py-2 hover:cursor-pointer"
            >
                <option value="title-asc">Title: A → Z</option>
                <option value="title-desc">Title: Z → A</option>
                <option value="date-newest">Newest</option>
                <option value="date-oldest">Oldest</option>
            </select>
        </div>
        <div className="grid gap-element sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mx-auto max-w-[1280px] py-section-mobile">
            {filteredFilms.map(film => <FilmCard key={film.id} film={film} />)}
        </div>
    </div>
  );
}