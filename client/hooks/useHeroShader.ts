import { startHeroShader } from "@/lib/utils/shader/start-hero-shader";
import { loadThree } from "@/lib/utils/shader/load-three";
import { whenIdle } from "@/lib/utils/when-idle";
import type { HeroShaderOptions } from "@/types/shader";
import { useEffect, type RefObject } from "react";

/**
 * Jembatan antara React dan kode non-React.
 * Tugasnya hanya: tunggu browser idle, muat three.js, jalankan shader, lalu
 * hentikan saat komponen unmount atau opsi berubah.
 */
export function useHeroShader(
  wrapRef: RefObject<HTMLElement | null>,
  { horizon, intensity }: HeroShaderOptions,
) {
  useEffect(() => {
    const wrap = wrapRef.current;
    const host = wrap?.parentElement; // <section> hero
    if (!wrap || !host) return;

    let disposed = false;
    let stop: (() => void) | undefined;

    // Tunggu idle: gambar hero (LCP) dan teks tampil dulu, baru shader.
    const cancelIdle = whenIdle(async () => {
      const three = await loadThree(); // chunk terpisah, tidak masuk bundle awal
      if (disposed) return;
      stop = startHeroShader(three, wrap, host, { horizon, intensity });
    });

    return () => {
      disposed = true;
      cancelIdle();
      stop?.();
    };
  }, [wrapRef, horizon, intensity]);
}