/**
 * Shader menulis posisi pointer (-1..1) ke elemen hero sebagai CSS variable,
 * sehingga elemen lain (mis. gambar latar) bisa ikut parallax lewat CSS saja:
 *
 *   transform: translate3d(calc(var(--hero-px, 0) * -14px), 0, 0);
 */
const VAR_X = "--hero-px";
const VAR_Y = "--hero-py";
let previousX = "";
let previousY = "";

export function setParallaxVars(host: HTMLElement, x: number, y: number) {
  const nextX = x.toFixed(3);
  const nextY = y.toFixed(3);

  if (nextX !== previousX) {
    host.style.setProperty(VAR_X, nextX);
    previousX = nextX;
  }
  if (nextY !== previousY) {
    host.style.setProperty(VAR_Y, nextY);
    previousY = nextY;
  }
}

export function clearParallaxVars(host: HTMLElement) {
  host.style.removeProperty(VAR_X);
  host.style.removeProperty(VAR_Y);
  previousX = "";
  previousY = "";
}
