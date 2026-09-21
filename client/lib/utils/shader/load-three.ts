import type { Three } from "@/types/shader";

/**
 * Memuat three.js secara lazy (chunk terpisah, tidak masuk bundle awal).
 * Destructuring langsung di sini penting: jika seluruh namespace `import("three")`
 * diteruskan sebagai objek, bundler tidak bisa membuang kode yang tidak dipakai.
 */
export async function loadThree(): Promise<Three> {
  const {
    WebGLRenderer,
    Scene,
    OrthographicCamera,
    PlaneGeometry,
    ShaderMaterial,
    Mesh,
    Vector2,
    NoBlending,
  } = await import("three");

  return { WebGLRenderer, Scene, OrthographicCamera, PlaneGeometry, ShaderMaterial, Mesh, Vector2, NoBlending };
}