"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import type { Film } from "@/types";
import { CarouselSkeleton } from "./CarouselSkeleton";

const CAROUSEL_HEIGHT = 500;
const TOP_FILM_COUNT = 9;

type MovieCarousel3DHandle = {
  goToPrevious: () => void;
  goToNext: () => void;
  focusActiveSlide: () => void;
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

const LazyCarouselFallback = dynamic(
  () => import("./CarouselFallback"),
  { ssr: false },
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
  const [hasEnteredViewport, setHasEnteredViewport] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const carouselRef = useRef<MovieCarousel3DHandle>(null);

  const topFilms = films.slice(0, TOP_FILM_COUNT);

  useEffect(() => {
    const node = containerRef.current;

    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return;

        setIsVisible(entry.isIntersecting);

        if (entry.isIntersecting) {
          setHasEnteredViewport(true);
        }
      },
      {
        rootMargin: "0px",
        threshold: 0.1,
      },
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!hasEnteredViewport) return;

    setState(canRunCarousel3D() ? "3d" : "fallback");
  }, [hasEnteredViewport]);

  useEffect(() => {
    function handleVisibilityChange() {
      setIsVisible((prev) => prev && document.visibilityState === "visible");
    }

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  const isPaused = !isVisible;

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      carouselRef.current?.goToPrevious();
      carouselRef.current?.focusActiveSlide();
    }

    if (event.key === "ArrowRight") {
      event.preventDefault();
      carouselRef.current?.goToNext();
      carouselRef.current?.focusActiveSlide();
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
      >
        {state === "checking" && (
          <CarouselSkeleton height={CAROUSEL_HEIGHT} />
        )}

        {state === "fallback" && (
          <LazyCarouselFallback movies={topFilms} />
        )}

        {state === "3d" && (
          <LazyMovieCarousel3D
            ref={carouselRef}
            films={topFilms}
            isPaused={isPaused}
          />
        )}
      </div>
    </div>
  );
}