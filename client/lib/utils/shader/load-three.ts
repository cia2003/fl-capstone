import type { Three } from "@/types/shader";

/**
 * mount three.js as lazy (separate chunk, not enter the first js bundle).
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