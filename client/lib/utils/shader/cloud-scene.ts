import type { CloudScene, CloudSceneOptions, Three } from "@/types/shader";
import type { WebGLRenderer } from "three";
import { cloudFragmentShader } from "./glsl/cloud.frag";
import { cloudVertexShader } from "./glsl/cloud.vert";

/**
 * Satu-satunya file yang "tahu" three.js. Tidak menyentuh React, event, atau
 * halaman: hanya menerima ukuran + state frame, lalu menggambar ke canvas.
 * Mengembalikan null jika WebGL tidak tersedia.
 */
export function createCloudScene(
  three: Three,
  { horizon, intensity, renderScale }: CloudSceneOptions,
): CloudScene | null {
  /* 1. Renderer: kanvas WebGL transparan agar gambar hero terlihat di belakangnya */
  let renderer: WebGLRenderer;
  try {
    renderer = new three.WebGLRenderer({
      alpha: true,
      antialias: false, // awan sudah lembut, MSAA hanya buang GPU
      powerPreference: "low-power",
    });
  } catch {
    return null;
  }
  renderer.setClearColor(0x000000, 0);

  /* 2. Scene: satu quad layar penuh + kamera orthographic (kamera tidak berpengaruh) */
  const scene = new three.Scene();
  const camera = new three.OrthographicCamera(-1, 1, 1, -1, 0, 1);

  const uniforms = {
    uTime: { value: 0 },
    uAspect: { value: 1 },
    uPointer: { value: new three.Vector2() },
    uHorizon: { value: horizon },
    uIntensity: { value: intensity },
  };

  const geometry = new three.PlaneGeometry(2, 2);
  const material = new three.ShaderMaterial({
    vertexShader: cloudVertexShader,
    fragmentShader: cloudFragmentShader,
    uniforms,
    // Shader sudah mengeluarkan warna premultiplied, jadi jangan di-blend lagi.
    blending: three.NoBlending,
    depthTest: false,
    depthWrite: false,
  });
  scene.add(new three.Mesh(geometry, material));

  return {
    canvas: renderer.domElement,

    resize(width, height) {
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2) * renderScale);
      renderer.setSize(width, height, false); // false = CSS yang mengatur ukuran tampilan
      uniforms.uAspect.value = width / height;
    },

    render({ time, pointerX, pointerY }) {
      uniforms.uTime.value = time;
      uniforms.uPointer.value.set(pointerX, pointerY);
      renderer.render(scene, camera);
    },

    dispose() {
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      renderer.forceContextLoss(); // browser membatasi jumlah WebGL context aktif
    },
  };
}