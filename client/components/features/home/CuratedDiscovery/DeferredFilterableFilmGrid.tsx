"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import type { Film } from "@/types/film";
import { FilterableFilmGridSkeleton } from "./FilterableFilmGridSkeleton";

const FilterableFilmGrid = dynamic(
  () => import("./FilterableFilmGrid").then((module) => module.FilterableFilmGrid),
  { ssr: false },
);

export function DeferredFilterableFilmGrid({ films }: { films: Film[] }) {
  const [shouldLoad, setShouldLoad] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      { rootMargin: "800px 0px" },
    );

    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  return <div ref={containerRef}>{
    shouldLoad ? <FilterableFilmGrid films={films} />
               : <FilterableFilmGridSkeleton />
    }</div>;
}
