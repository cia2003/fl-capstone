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
  // create cloud animation
  const scene = createCloudScene(three, { horizon, intensity, renderScale: RENDER_SCALE });
  if (!scene) return undefined;

  // create container "canvas", set the width and height 100% from it's parent
  const { canvas } = scene;
  canvas.className = "block h-full w-full opacity-0 transition-opacity duration-1000";
  wrap.appendChild(canvas);

  // Track the cursor
  const pointer = createPointerTracker(host);
  let time = 0;
  let ready = false;

  // Draw one frame based on time and cursor's position
  // setParallaxVars write position of cursor as a variable of css in host, so that other element
  // Not only the clouds, the background image will move based on cursor's movement in area
  const draw = () => {
    scene.render({ time, pointerX: pointer.x, pointerY: pointer.y });
    setParallaxVars(host, pointer.x, pointer.y);
  };

  // Start the loop if ready: run the time, update the cursor's position, re-draw the frame
  const loop = createFrameLoop({
    target: host,
    onFrame(dt) {
      if (!ready) return;
      time += dt;
      pointer.update(dt, time);
      draw(); 
    },
    onStill() {
      if (!ready) return;
      time = STILL_TIME;
      pointer.reset();
      draw();
    },
  });
  
  // If the size is ready, run the loop
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
      draw(); // if loop is stopped (reduced motion / offscreen): redraw statically
    }
  });

  resizeObserver.observe(wrap);

  // Stop drawing the frame and hide it
  const onContextLost = (e: Event) => {
    e.preventDefault();
    loop.stop();
    canvas.style.opacity = "0";
  };

  // Run the loop
  const onContextRestored = () => {
    canvas.style.opacity = "1";
    loop.sync();
  };
  canvas.addEventListener("webglcontextlost", onContextLost);
  canvas.addEventListener("webglcontextrestored", onContextRestored);

  // Clean up the shader
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