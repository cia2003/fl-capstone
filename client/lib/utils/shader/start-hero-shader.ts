import type { HeroShaderOptions, Three } from "@/types/shader";
import { createCloudScene } from "./cloud-scene";
import { createFrameLoop } from "./frame-loop";
import { clearParallaxVars, setParallaxVars } from "./parallax-vars";
import { createPointerTracker } from "./pointer-tracker";

const RENDER_SCALE = 0.5;
const STILL_TIME = 8;

export function startHeroShader(
  three: Three,
  wrap: HTMLElement,
  host: HTMLElement,
  { horizon, intensity }: HeroShaderOptions,
): (() => void) | undefined {
  const scene = createCloudScene(three, { horizon, intensity, renderScale: RENDER_SCALE });
  if (!scene) return undefined; // WebGL tidak ada -> gambar statis tetap tampil

  const { canvas } = scene;
  canvas.className = "block h-full w-full opacity-0 transition-opacity duration-1000";
  wrap.appendChild(canvas);

  const pointer = createPointerTracker(host);
  let time = 0;
  let ready = false;

  const draw = () => {
    scene.render({ time, pointerX: pointer.x, pointerY: pointer.y });
    setParallaxVars(host, pointer.x, pointer.y); // gambar latar ikut bergeser
  };

  const loop = createFrameLoop({
    target: host,
    onFrame(dt) {
      if (!ready) return;
      time += dt;
      pointer.update(dt, time); // baca dulu (getBoundingClientRect)...
      draw(); // ...baru tulis (CSS variable). Urutan ini mencegah forced reflow.
    },
    onStill() {
      if (!ready) return;
      time = STILL_TIME;
      pointer.reset();
      draw();
    },
  });
  
  const resizeObserver = new ResizeObserver(([entry]) => {
    const { width, height } = entry.contentRect;
    if (!width || !height) return;

    scene.resize(width, height);

    if (!ready) {
      ready = true;
      loop.sync();
      requestAnimationFrame(() => {
        canvas.style.opacity = "1"; // fade-in setelah ukuran siap
      });
    } else if (!loop.running) {
      draw(); // loop sedang berhenti (reduced motion / offscreen): gambar ulang statis
    }
  });
  resizeObserver.observe(wrap);

  const onContextLost = (e: Event) => {
    e.preventDefault(); // wajib, agar browser boleh memulihkan context
    loop.stop();
    canvas.style.opacity = "0";
  };
  const onContextRestored = () => {
    canvas.style.opacity = "1";
    loop.sync();
  };
  canvas.addEventListener("webglcontextlost", onContextLost);
  canvas.addEventListener("webglcontextrestored", onContextRestored);

  // Bersih-bersih (penting untuk React StrictMode dan navigasi Next.js).
  return () => {
    loop.dispose();
    pointer.dispose();
    resizeObserver.disconnect();
    canvas.removeEventListener("webglcontextlost", onContextLost);
    canvas.removeEventListener("webglcontextrestored", onContextRestored);
    clearParallaxVars(host);
    scene.dispose();
    canvas.remove();
  };
}