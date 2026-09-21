/**
 * Vertex shader: dijalankan sekali per titik sudut.
 * Kita hanya punya 1 quad yang menutupi layar, jadi cukup meneruskan posisi
 * apa adanya ke clip space (-1..1) dan mengirim uv (0..1) ke fragment shader.
 * Kamera dan matriks sengaja tidak dipakai.
 */
export const cloudVertexShader = /* glsl */ `
  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;