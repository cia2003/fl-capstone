"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import type { Film } from "@/types";
import CarouselFallback from "./CarouselFallback";

const LazyMovieCarousel3D = dynamic(
  () => import("./MovieCarousel3D").then((module) => module.MovieCarousel3D),
  { ssr: false, loading: () => null },
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

  useEffect(() => {
    setState(canRunCarousel3D() ? "3d" : "fallback");
  }, []);

  if (state !== "3d") {
    return <CarouselFallback movies={films} />;
  }

  return <LazyMovieCarousel3D films={films} />;
}