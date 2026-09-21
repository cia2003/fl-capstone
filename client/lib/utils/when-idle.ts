export function whenIdle(fn: () => void, timeout?: number): () => void {
  // To check whether the browser support "requestIdleCallback"
  if ("requestIdleCallback" in window) {
    const id = window.requestIdleCallback(fn, timeout === undefined ? undefined : { timeout });

    // cancel the previous-scheduled job
    return () => window.cancelIdleCallback(id);
  }

  // If browser not supported, wait for 300ms, then run the fn -> function
  const id = setTimeout(fn, 300);
  return () => clearTimeout(id);
}
