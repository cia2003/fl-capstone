import type { FrameLoop, FrameLoopOptions } from "@/types/shader";

export function createFrameLoop({ target, onFrame, onStill }: FrameLoopOptions): FrameLoop {
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let raf = 0;
  let last = 0;
  let inView = true;
  let pageVisible = !document.hidden;
  const frameInterval = 1000 / 30;
  let lastDraw = 0;

  const tick = (now: number) => {
    if (now - lastDraw >= frameInterval) {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      lastDraw = now;
      onFrame(dt);
    }
    raf = requestAnimationFrame(tick);
  };

  const stop = () => {
    cancelAnimationFrame(raf);
    raf = 0;
  };

  const sync = () => {
    stop();
    // Do not run the animation
    if (reducedMotion.matches) {
      onStill();

      // If element is visible (on the screen) 
      // and the page is active, start the animation's loop
    } else if (inView && pageVisible) {
      last = performance.now();
      lastDraw = last - frameInterval;
      raf = requestAnimationFrame(tick);
    }
  };

  const onVisibility = () => {
    pageVisible = !document.hidden;
    sync();
  };

  const intersectionObserver = new IntersectionObserver(([entry]) => {
    inView = entry.isIntersecting;
    sync();
  });

  intersectionObserver.observe(target);
  document.addEventListener("visibilitychange", onVisibility);
  reducedMotion.addEventListener("change", sync);

  return {
    get running() {
      return raf !== 0;
    },
    sync,
    stop,
    dispose() {
      stop();
      intersectionObserver.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      reducedMotion.removeEventListener("change", sync);
    },
  };
}
