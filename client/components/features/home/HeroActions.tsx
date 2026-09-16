"use client";

import { Button } from "@/components/ui/Button";
import type { Film } from "@/types/film";

export function HeroActions({ films }: { films: Film[] }) {
  const getRandomFilm = () => {
    const randomIndex = Math.floor(Math.random() * films.length);
    return films[randomIndex];
  };

  return (
    <div className="mt-8 flex items-center gap-3">
      <Button
        variant="primary"
        idleLabel="Talk to Ghibli Compass"
        loadingLabel="Opening..."
        successLabel="Opened"
        errorLabel="Retry"
        onAction={() => {
          window.location.href = "/find-my-film";
        }}
      />

      <Button
        variant="secondary"
        idleLabel="Surprise Me!"
        loadingLabel="Choosing..."
        successLabel="Selected"
        errorLabel="Retry"
        onAction={() => {
          window.location.href = `/films/${getRandomFilm().id}`;
        }}
      />
    </div>
  );
}