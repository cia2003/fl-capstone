import { noiseGLSL } from "./noise";

/**
 * Fragment shader: dijalankan sekali per piksel.
 * Satu lapisan awan = fbm dipotong smoothstep + pencahayaan murah.
 * Tiga lapisan dengan kedalaman berbeda digabung dari belakang ke depan.
 */
export const cloudFragmentShader = /* glsl */ `
  uniform float uTime;       // detik sejak mount
  uniform float uAspect;     // lebar / tinggi, supaya awan tidak gepeng
  uniform vec2  uPointer;    // posisi pointer yang sudah dihaluskan, -1..1
  uniform float uHorizon;    // 0..1 dari bawah: di atas garis ini awan muncul
  uniform float uIntensity;  // opasitas keseluruhan

  varying vec2 vUv;

  ${noiseGLSL}

  // Satu lapisan awan. Mengembalikan warna PREMULTIPLIED (rgb sudah dikali alpha),
  // karena canvas WebGL menganggap alpha-nya premultiplied secara default.
  //
  //   scale    : makin besar, awan makin kecil dan rapat
  //   speed    : kecepatan angin
  //   depth    : 0 = jauh (hampir diam), 1 = dekat (bergeser paling banyak saat pointer bergerak)
  //   seed     : geser domain noise supaya tiap lapisan punya bentuk berbeda
  //   lo, hi   : rentang tinggi (uv.y) tempat awan memudar, berfungsi sebagai "masker langit"
  //   strength : opasitas maksimum lapisan ini
  vec4 cloudLayer(
    vec2 uv, float scale, float speed, float depth, float seed,
    float lo, float hi, float strength
  ) {
    vec2 p = uv * vec2(uAspect, 1.0) * scale;

    p += vec2(uTime * speed, uTime * speed * 0.2); // angin: geser + sedikit naik
    p += uPointer * depth * 0.35;                  // PARALLAX: lapisan dekat bergeser lebih jauh
    p += seed;

    float n  = fbm(p);
    float n2 = fbm(p + vec2(-0.05, 0.07)); // ambil sampel ke arah cahaya (kiri-atas)

    float density = smoothstep(0.54, 0.66, n);
    float sky     = smoothstep(lo, hi, uv.y);
    float alpha   = density * sky * strength;

    // Pencahayaan murah: sisi awan yang menghadap cahaya lebih terang.
    float light = clamp(0.55 + (n - n2) * 8.0, 0.0, 1.0);
    vec3 shadow = vec3(0.66, 0.75, 0.90);
    vec3 lit    = vec3(1.00, 0.99, 0.96);

    return vec4(mix(shadow, lit, light) * alpha, alpha);
  }

  void main() {
    //                        scale  speed  depth  seed  lo               hi                strength
    vec4 far  = cloudLayer(vUv, 3.2, 0.010, 0.25, 11.0, uHorizon + 0.10, uHorizon + 0.40, 0.55);
    vec4 mid  = cloudLayer(vUv, 2.2, 0.020, 0.60, 37.0, uHorizon,        uHorizon + 0.35, 0.80);
    vec4 near = cloudLayer(vUv, 1.4, 0.038, 1.00, 71.0, uHorizon - 0.10, uHorizon + 0.30, 1.00);

    // Operator "over" untuk warna premultiplied: hasil = depan + belakang * (1 - alpha_depan)
    vec4 col = far;
    col = mid  + col * (1.0 - mid.a);
    col = near + col * (1.0 - near.a);
    col *= uIntensity;

    // Dither 1/255 supaya gradasi lembut tidak terlihat berundak (banding).
    col.rgb += (hash(gl_FragCoord.xy + fract(uTime)) - 0.5) / 255.0 * col.a;

    gl_FragColor = col;
  }
`;