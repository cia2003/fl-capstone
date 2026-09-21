"use client";

import { useHeroShader } from "@/hooks/useHeroShader";
import { useRef } from "react";

type HeroShaderProps = {
  className?: string;
  /** Tinggi garis langit, 0-1 dihitung dari bawah. Naikkan jika awan menutupi tanah. */
  horizon?: number;
  /** Opasitas keseluruhan awan, 0-1. */
  intensity?: number;
};

/**
 * Letakkan LANGSUNG di dalam <section class="relative"> hero, di antara gambar
 * dan overlay gradient. Semua logika ada di useHeroShader.
 */
export function HeroShader({
  className = "",
  horizon = 0.35,
  intensity = 0.85,
}: HeroShaderProps) {
  const wrapRef = useRef<HTMLDivElement>(null);

  useHeroShader(wrapRef, { horizon, intensity });

  return (
    <div
      ref={wrapRef}
      aria-hidden="true"
      className={`pointer-events-none ${className}`}
    />
  );
}