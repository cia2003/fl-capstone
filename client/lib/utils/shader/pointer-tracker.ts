import type { PointerTracker } from "@/types/shader";

const clamp = (v: number) => Math.max(-1, Math.min(1, v));

export function createPointerTracker(area: HTMLElement): PointerTracker {
  const target = { x: 0, y: 0 }; // nilai mentah dari mouse
  const current = { x: 0, y: 0 }; // nilai yang dihaluskan
  const client = { x: 0, y:0 };

  let active = false;
  let pending = false;

  const onMove = (e: PointerEvent) => {
    if (e.pointerType === "touch") return;
    const r = area.getBoundingClientRect();

    client.x = e.clientX;
    client.y = e.clientY;

    pending = true;
    active = true;
  };
  const onLeave = () => {
    active = false;
    pending = false
  };

  area.addEventListener("pointermove", onMove, { passive: true });
  area.addEventListener("pointerleave", onLeave);

  return {
    get x() {
      return current.x;
    },
    get y() {
      return current.y;
    },

    update(dt, time) {
      if (pending) {
        pending = false;
        const r = area.getBoundingClientRect();

        if (r.width && r.height) {
            target.x = clamp(((client.x - r.left)/r.width) * 2 - 1)
            target.y = clamp(((client.y - r.top)/r.height) * 2 - 1)
        }
      }

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
      pending = false;
    },

    dispose() {
      area.removeEventListener("pointermove", onMove);
      area.removeEventListener("pointerleave", onLeave);
    },
  };
}