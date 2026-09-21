import type { HeroShaderOptions, Three } from "@/types/shader";
import { createCloudScene } from "./cloud-scene";
import { createFrameLoop } from "./frame-loop";
import { clearParallaxVars, setParallaxVars } from "./parallax-vars";
import { createPointerTracker } from "./pointer-tracker";

/** Resolusi render relatif terhadap ukuran CSS. 0.5 = seperempat jumlah piksel. */
const RENDER_SCALE = 0.5;

/** Waktu (detik) yang dibekukan saat pengguna memilih reduced motion. */
const STILL_TIME = 8;

/**
 * Merangkai semua bagian. Tidak ada logika rendering atau matematika di sini,
 * hanya "siapa memanggil siapa". Mengembalikan fungsi untuk membersihkan semuanya.
 *
 *   wrap : elemen tempat <canvas> dipasang
 *   host : <section> hero (area pointer + tempat CSS variable ditulis)
 */
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

  const draw = () => {
    scene.render({ time, pointerX: pointer.x, pointerY: pointer.y });
    setParallaxVars(host, pointer.x, pointer.y); // gambar latar ikut bergeser
  };

  const loop = createFrameLoop({
    target: host,
    onFrame(dt) {
      time += dt;
      pointer.update(dt, time);
      draw();
    },
    onStill() {
      time = STILL_TIME;
      pointer.reset();
      draw();
    },
  });

  const resize = () => {
    const width = wrap.clientWidth;
    const height = wrap.clientHeight;
    if (!width || !height) return;
    scene.resize(width, height);
    if (!loop.running) draw();
  };

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

  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(wrap);

  resize();
  loop.sync();
  requestAnimationFrame(() => {
    canvas.style.opacity = "1"; // fade-in setelah frame pertama
  });

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