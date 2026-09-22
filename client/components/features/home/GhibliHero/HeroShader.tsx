"use client";

import { useHeroShader } from "@/hooks/useHeroShader";
import { useRef } from "react";

type HeroShaderProps = {
  className?: string;
  horizon?: number;
  intensity?: number;
};


export function HeroShader({
  className = "",
  // Make the area of cloud upper or lower
  horizon = 0.35,
  // Cloud's opacity, from 0-1
  intensity = 0.80,
}: HeroShaderProps) {
  // Wrapper 
  const wrapRef = useRef<HTMLDivElement>(null);

  // All logics are here
  useHeroShader(wrapRef, { horizon, intensity });

  return (
    <div
      ref={wrapRef}
      aria-hidden="true"
      className={`pointer-events-none ${className}`}
    />
  );
}