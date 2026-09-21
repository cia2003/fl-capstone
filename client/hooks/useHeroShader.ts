import { startHeroShader } from "@/lib/utils/shader/start-hero-shader";
import { loadThree } from "@/lib/utils/shader/load-three";
import { whenIdle } from "@/lib/utils/when-idle";
import type { HeroShaderOptions } from "@/types/shader";
import { useEffect, type RefObject } from "react";

/**
 * Step-by-step:
 * 1. Wait until the page has finished loading. 
 * 2. Wait for the browser to become idle. 
 * 3. Load three.js only when needed
 * 4. Start the hero shader. 
 * 5. Clean everything up when the component unmounts or shader options change. 
 */

export function useHeroShader(
  wrapRef: RefObject<HTMLElement | null>,
  { horizon, intensity }: HeroShaderOptions,
) {
  useEffect(() => {
    // The shader is mounted inside 'wrap', while 'host' represents the surrounding hero section
    const wrap = wrapRef.current;
    const host = wrap?.parentElement;
    if (!wrap || !host) return;

    let disposed = false;
    let stop: (() => void) | undefined;
    let cancelIdle: (() => void) | undefined;

    // Let LCP and other critical resource finish first; shader still mounted
    // when browser is idle, not in first app's render
    const startWhenIdle = () => {
      cancelIdle = whenIdle(async () => {
        const three = await loadThree();

        if (disposed) return; // do not let run the shader
        stop = startHeroShader(three, wrap, host, { horizon, intensity });
      }, 3000);
    };

    // Run the shader when all documents and resources that needed for load event finish to be mounted
    // If still load, add listener to pay attention to event "load"
    if (document.readyState === "complete") {
      startWhenIdle();
    } else {
      window.addEventListener("load", startWhenIdle, { once: true });
    }

    return () => {
      disposed = true;
      window.removeEventListener("load", startWhenIdle);
      cancelIdle?.();
      stop?.();
    };
  }, [wrapRef, horizon, intensity]);
}
