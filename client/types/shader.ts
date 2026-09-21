/** Hanya bagian three.js yang dipakai, dipilih satu-satu agar bundler bisa tree-shake. */
export type Three = Pick<
  typeof import("three"),
  | "WebGLRenderer"
  | "Scene"
  | "OrthographicCamera"
  | "PlaneGeometry"
  | "ShaderMaterial"
  | "Mesh"
  | "Vector2"
  | "NoBlending"
>;

export type HeroShaderOptions = {
  /** Tinggi garis langit, 0-1 dihitung dari bawah. */
  horizon: number;
  /** Opasitas keseluruhan awan, 0-1. */
  intensity: number;
};

export type CloudSceneOptions = HeroShaderOptions & {
  /** Resolusi render relatif terhadap ukuran CSS (0.5 = seperempat piksel). */
  renderScale: number;
};

export type CloudFrameState = {
  /** Detik sejak mulai, menggerakkan angin. */
  time: number;
  /** Posisi pointer yang sudah dihaluskan, -1..1 (y positif = atas). */
  pointerX: number;
  pointerY: number;
};

export type CloudScene = {
  canvas: HTMLCanvasElement;
  resize(width: number, height: number): void;
  render(state: CloudFrameState): void;
  dispose(): void;
};

export type PointerTracker = {
  /** Nilai yang sudah dihaluskan, -1..1 (y positif = atas, sama seperti uv di shader). */
  readonly x: number;
  readonly y: number;
  update(dt: number, time: number): void;
  reset(): void;
  dispose(): void;
};

export type FrameLoopOptions = {
  /** Loop hanya berjalan selama elemen ini terlihat di layar. */
  target: Element;
  /** Dipanggil tiap frame. `dt` dalam detik (dibatasi 0.05 agar tidak melompat setelah tab tertidur). */
  onFrame(dt: number): void;
  /** Dipanggil saat pengguna memilih reduced motion: gambar satu frame statis saja. */
  onStill(): void;
};

export type FrameLoop = {
  readonly running: boolean;
  /** Hitung ulang: jalan atau berhenti sesuai kondisi terbaru. */
  sync(): void;
  stop(): void;
  dispose(): void;
};