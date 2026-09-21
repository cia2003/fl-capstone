/**
 * Potongan GLSL yang bisa disisipkan ke shader mana pun lewat `${noiseGLSL}`.
 * Alur: hash -> value noise -> fbm (noise berlapis).
 */
export const noiseGLSL = /* glsl */ `
  // Angka acak semu dari sebuah koordinat 2D (tanpa tekstur).
  float hash(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
  }

  // Value noise: acak di titik-titik grid, lalu diinterpolasi mulus di antaranya.
  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f); // smoothstep supaya tidak terlihat kotak-kotak

    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));

    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
  }

  // fbm = fractal Brownian motion: tumpuk noise dengan frekuensi 2x dan
  // amplitudo 0.5x tiap lapis. Hasilnya bentuk "berawan": gumpalan besar
  // dengan detail kecil di tepinya.
  float fbm(vec2 p) {
    float value = 0.0;
    float amp = 0.5;
    mat2 rot = mat2(0.8, 0.6, -0.6, 0.8); // putar tiap oktaf agar pola tidak searah grid
    for (int i = 0; i < 5; i++) {
      value += amp * noise(p);
      p = rot * p * 2.0 + 7.0;
      amp *= 0.5;
    }
    return value;
  }
`;