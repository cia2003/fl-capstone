import type { CloudScene, CloudSceneOptions, Three } from "@/types/shader";
import type { WebGLRenderer } from "three";
import { cloudFragmentShader } from "./glsl/cloud.frag";
import { cloudVertexShader } from "./glsl/cloud.vert";

// This file makes the "stage" to draw the cloud with WebGL (Three.js)
// It returns a canvas and 3 tools: resize, render, and dispose
export function createCloudScene(
  three: Three,
  { horizon, intensity, renderScale }: CloudSceneOptions,
): CloudScene | null {
  // Render a transparent canvas, so the background hero can be seen behind the cloud
  let renderer: WebGLRenderer;
  try {
    renderer = new three.WebGLRenderer({
      alpha: true,
      antialias: false, 
      powerPreference: "low-power",
    });
  } catch {
    return null;
  }
  renderer.setClearColor(0x000000, 0);

  // Create a one-flat square that covers the full screen, by making the camera flat
  // cloud.frag use uTime to move the cloud: if the time is stopped, the cloud is not moving to the left
  const scene = new three.Scene();
  const camera = new three.OrthographicCamera(-1, 1, 1, -1, 0, 1);

  const uniforms = {
    uTime: { value: 0 },
    uAspect: { value: 1 },
    uPointer: { value: new three.Vector2() },
    uHorizon: { value: horizon },
    uIntensity: { value: intensity },
  };

  // Create a flat square, then color it
  const geometry = new three.PlaneGeometry(2, 2);
  const material = new three.ShaderMaterial({
    vertexShader: cloudVertexShader,
    fragmentShader: cloudFragmentShader,
    uniforms,
    blending: three.NoBlending,
    depthTest: false,
    depthWrite: false,
  });

  scene.add(new three.Mesh(geometry, material));

  return {
    canvas: renderer.domElement,

    resize(width, height) {
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2) * renderScale);
      renderer.setSize(width, height, false);
      uniforms.uAspect.value = width / height;
    },

    // Run on every frame
    // Send the latest time and cursor offset to the shader, then draw one frame
    render({ time, pointerX, pointerY }) {
      uniforms.uTime.value = time;
      uniforms.uPointer.value.set(pointerX, pointerY);
      renderer.render(scene, camera);
    },

    // Free the GPU memory when we do not need the scene anymore
    dispose() {
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      renderer.forceContextLoss(); // browser limited number of active WebGL context
    },
  };
}