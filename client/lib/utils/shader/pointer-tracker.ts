import type { PointerTracker } from "@/types/shader";

const clamp = (v: number) => Math.max(-1, Math.min(1, v));

export function createPointerTracker(area: HTMLElement): PointerTracker {
  const target = { x: 0, y: 0 };
  const current = { x: 0, y: 0 };
  const client = { x: 0, y:0 };

  let active = false;
  let pending = false;

  // If the cursor move in certain area, note the position
  // Only use mouse, ignore touch screen
  const onMove = (e: PointerEvent) => {
    if (e.pointerType === "touch") return;

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

    // Set the target position: this is based on widh and height of the area
    // the clouds will follow the cursor as an offset/parallax
    update(dt, time) {
      // Only calculate when the cursor moved since the last frame
      // If the cursor stops in area, the target stays the same, so the offset stays too
      if (pending) {
        pending = false;
        const r = area.getBoundingClientRect();
        
        // Set the cloud's target position
        if (r.width && r.height) {
            target.x = clamp(((client.x - r.left)/r.width) * 2 - 1)
            target.y = clamp(((client.y - r.top)/r.height) * 2 - 1)
        }
      }

      // if cursor is outside the area, the position of clouds will move to a certain position
      if (!active) {
        target.x = Math.sin(time * 0.15) * 0.5;
        target.y = Math.cos(time * 0.11) * 0.15;
      }
      
      // Make the clouds move smoothly to the target's position based on cursor movement
      const k = 1 - Math.exp(-dt * 4);
      current.x += (target.x - current.x) * k;
      current.y += (target.y - current.y) * k;
    },

    // Put everything back to the center (0)
    // Used when animation is stopped
    reset() {
      target.x = target.y = current.x = current.y = 0;
      active = false;
      pending = false;
    },

    // Remove the listener when the component is removed
    dispose() {
      area.removeEventListener("pointermove", onMove);
      area.removeEventListener("pointerleave", onLeave);
    },
  };
}
