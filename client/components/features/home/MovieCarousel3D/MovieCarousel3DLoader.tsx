"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import type { Film } from "@/types";
import CarouselFallback from "./CarouselFallback";
import { CarouselSkeleton } from "./CarouselSkeleton";
import type { MovieCarousel3DHandle } from "./MovieCarousel3D";

const CAROUSEL_HEIGHT = 500;

const LazyMovieCarousel3D = dynamic(
  () => import("./MovieCarousel3D").then((module) => module.MovieCarousel3D),
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

export function MovieCarousel3DLoader({ films }: { films: Film[] }) {
  const [state, setState] = useState<LoaderState>("checking");
  const carouselRef = useRef<MovieCarousel3DHandle>(null);

  useEffect(() => {
    setState(canRunCarousel3D() ? "3d" : "fallback");
  }, []);

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      carouselRef.current?.goToPrevious();
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      carouselRef.current?.goToNext();
    }
  }

  return (
    <div style={{ minHeight: CAROUSEL_HEIGHT }} className="w-full">
      <div
        role="region"
        aria-roledescription="carousel"
        aria-label="Daftar film unggulan, gunakan panah kiri dan kanan untuk navigasi"
        tabIndex={0}
        onKeyDown={handleKeyDown}
        className="outline-none"
      >
        {state === "checking" && <CarouselSkeleton height={CAROUSEL_HEIGHT} />}
        {state === "fallback" && <CarouselFallback movies={films} />}
        {state === "3d" && <LazyMovieCarousel3D ref={carouselRef} films={films} />}
      </div>
    </div>
  );
}