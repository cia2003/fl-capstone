/**
 * Shader menulis posisi pointer (-1..1) ke elemen hero sebagai CSS variable,
 * sehingga elemen lain (mis. gambar latar) bisa ikut parallax lewat CSS saja:
 *
 *   transform: translate3d(calc(var(--hero-px, 0) * -14px), 0, 0);
 */
const VAR_X = "--hero-px";
const VAR_Y = "--hero-py";

export function setParallaxVars(host: HTMLElement, x: number, y: number) {
  host.style.setProperty(VAR_X, x.toFixed(3));
  host.style.setProperty(VAR_Y, y.toFixed(3));
}

export function clearParallaxVars(host: HTMLElement) {
  host.style.removeProperty(VAR_X);
  host.style.removeProperty(VAR_Y);
}