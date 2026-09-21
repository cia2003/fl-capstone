/** requestIdleCallback dengan fallback untuk Safari. Mengembalikan fungsi pembatal. */
export function whenIdle(fn: () => void, timeout?: number): () => void {
  if ("requestIdleCallback" in window) {
    const id = window.requestIdleCallback(fn, timeout === undefined ? undefined : { timeout });
    return () => window.cancelIdleCallback(id);
  }
  const id = setTimeout(fn, 300);
  return () => clearTimeout(id);
}
