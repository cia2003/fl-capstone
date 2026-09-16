"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import type { Film } from "@/types";
import CarouselFallback from "./CarouselFallback";
import { CarouselSkeleton } from "./CarouselSkeleton";

const CAROUSEL_HEIGHT = 500;
const TOP_FILM_COUNT = 9;

type MovieCarousel3DHandle = {
  goToPrevious: () => void;
  goToNext: () => void;
};

const LazyMovieCarousel3D = dynamic(
  () =>
    import("./MovieCarousel3D").then(
      (module) => module.MovieCarousel3D,
    ),
  {
    ssr: false,
    loading: () => <CarouselSkeleton height={CAROUSEL_HEIGHT} />,
  },
);

type LoaderState = "checking" | "3d" | "fallback";

function canRunCarousel3D() {
  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  const navigatorWithHints = navigator as Navigator & {
    deviceMemory?: number;
    gpu?: unknown;
  };

  return (
    !reducedMotion &&
    Boolean(navigatorWithHints.gpu) &&
    (navigatorWithHints.hardwareConcurrency ?? 4) > 2 &&
    (navigatorWithHints.deviceMemory ?? 4) > 2
  );
}

export function MovieCarousel3DLoader({
  films,
}: {
  films: Film[];
}) {
  const [state, setState] = useState<LoaderState>("checking");
  const [inView, setInView] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const carouselRef = useRef<MovieCarousel3DHandle>(null);

  const topFilms = films.slice(0, TOP_FILM_COUNT);

  useEffect(() => {
    const node = containerRef.current;

    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return;

        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: "0px",
        threshold: 0,
      },
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, []);

  /**
   * Decide whether to use the 3D carousel or the lightweight
   * image-based fallback only after the carousel enters the viewport.
   */
  useEffect(() => {
    if (!inView) return;

    setState(canRunCarousel3D() ? "3d" : "fallback");
  }, [inView]);

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      carouselRef.current?.goToPrevious();
    }

    if (event.key === "ArrowRight") {
      event.preventDefault();
      carouselRef.current?.goToNext();
    }
  }

  return (
    <div
      ref={containerRef}
      style={{ minHeight: CAROUSEL_HEIGHT }}
      className="w-full"
    >
      <div
        role="region"
        aria-roledescription="carousel"
        aria-label="Daftar film unggulan, gunakan panah kiri dan kanan untuk navigasi"
        tabIndex={0}
        onKeyDown={handleKeyDown}
        className="outline-none"
      >
        {state === "checking" && (
          <CarouselSkeleton height={CAROUSEL_HEIGHT} />
        )}

        {state === "fallback" && (
          <CarouselFallback movies={topFilms} />
        )}

        {state === "3d" && (
          <LazyMovieCarousel3D
            ref={carouselRef}
            films={topFilms}
          />
        )}
      </div>
    </div>
  );
}