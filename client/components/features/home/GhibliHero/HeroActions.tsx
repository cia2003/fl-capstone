"use client";

import type { Film } from "@/types/film";

export function HeroActions({ films }: { films: Film[] }) {
  const getRandomFilm = () => {
    const randomIndex = Math.floor(Math.random() * films.length);
    return films[randomIndex];
  };

  return (
    <div className="mt-8 flex items-center gap-3">
      <button
        type="button"
        className="cursor-pointer rounded-button bg-accent px-button-x py-button-y text-sm font-semibold text-[#21170d] transition-colors hover:bg-accent/85 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        onClick={() => {
          window.location.href = "/find-my-film";
        }}
      >
        Talk to Ghibli Compass
      </button>

      <button
        type="button"
        className="cursor-pointer rounded-button border-[1.5px] border-primary bg-transparent px-button-x py-button-y text-sm font-semibold text-primary transition-colors hover:bg-primary/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        onClick={() => {
          window.location.href = `/films/${getRandomFilm().id}`;
        }}
      >
        Surprise Me!
      </button>
    </div>
  );
}
