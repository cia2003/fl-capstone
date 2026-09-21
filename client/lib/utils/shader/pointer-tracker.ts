import type { PointerTracker } from "@/types/shader";

const clamp = (v: number) => Math.max(-1, Math.min(1, v));

/**
 * Melacak posisi mouse relatif terhadap `area`, lalu menghaluskannya.
 * Tanpa mouse (layar sentuh, atau pointer di luar jendela) posisinya melayang
 * pelan sendiri, jadi parallax tetap terasa hidup.
 */
export function createPointerTracker(area: HTMLElement): PointerTracker {
  const target = { x: 0, y: 0 }; // nilai mentah dari mouse
  const current = { x: 0, y: 0 }; // nilai yang dihaluskan
  let active = false;

  const onMove = (e: PointerEvent) => {
    if (e.pointerType === "touch") return;
    const r = area.getBoundingClientRect();
    if (!r.width || !r.height) return;
    target.x = clamp(((e.clientX - r.left) / r.width) * 2 - 1);
    target.y = clamp(-(((e.clientY - r.top) / r.height) * 2 - 1)); // y dibalik: atas = positif
    active = true;
  };
  const onLeave = () => {
    active = false;
  };

  window.addEventListener("pointermove", onMove, { passive: true });
  document.documentElement.addEventListener("pointerleave", onLeave);

  return {
    get x() {
      return current.x;
    },
    get y() {
      return current.y;
    },

    update(dt, time) {
      if (!active) {
        target.x = Math.sin(time * 0.15) * 0.5;
        target.y = Math.cos(time * 0.11) * 0.15;
      }
      // Damping independen frame-rate: mendekati target ~3x per detik.
      const k = 1 - Math.exp(-dt * 3);
      current.x += (target.x - current.x) * k;
      current.y += (target.y - current.y) * k;
    },

    reset() {
      target.x = target.y = current.x = current.y = 0;
      active = false;
    },

    dispose() {
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    },
  };
}