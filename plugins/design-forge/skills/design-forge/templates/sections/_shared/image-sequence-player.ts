/**
 * ImageSequencePlayer — Canvas frame renderer for Apple-style image sequences.
 *
 * Renders sequential still frames to a canvas, driven by a progress value (0-1).
 * Used by product-reveal-hero and image-sequence-scroll sections.
 *
 * Features:
 * - Progressive image preloading (prioritizes frames near current position)
 * - DPR-aware rendering (capped at 2x per Design Forge convention)
 * - Sliding window memory management (disposes distant frames)
 * - Reduced motion fallback (renders single key frame at 50%)
 *
 * Usage:
 *   const player = new ImageSequencePlayer({
 *     canvas: canvasRef.current,
 *     frameCount: 120,
 *     getFrameUrl: (index) => `/frames/hero-${String(index).padStart(4, '0')}.webp`,
 *   });
 *   player.preload();
 *   player.setProgress(0.5); // Renders frame 60
 *   player.dispose();
 */

interface ImageSequenceConfig {
  /** Canvas element to render frames on */
  canvas: HTMLCanvasElement;
  /** Total number of frames in the sequence */
  frameCount: number;
  /** Function that returns the URL for a given frame index (0-based) */
  getFrameUrl: (index: number) => string;
  /** Maximum DPR for rendering. Default: 2 */
  maxDpr?: number;
  /** Number of frames to keep decoded in memory. Default: 30 */
  windowSize?: number;
}

export class ImageSequencePlayer {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private frameCount: number;
  private getFrameUrl: (index: number) => string;
  private maxDpr: number;
  private windowSize: number;

  /** Cache of loaded Image objects indexed by frame number */
  private frames: Map<number, HTMLImageElement> = new Map();
  /** Set of frame indices currently being loaded */
  private loading: Set<number> = new Set();
  /** Current rendered frame index */
  private currentFrame: number = 0;
  /** Whether the player has been disposed */
  private disposed: boolean = false;

  constructor(config: ImageSequenceConfig) {
    this.canvas = config.canvas;
    this.ctx = config.canvas.getContext("2d")!;
    this.frameCount = config.frameCount;
    this.getFrameUrl = config.getFrameUrl;
    this.maxDpr = config.maxDpr ?? 2;
    this.windowSize = config.windowSize ?? 30;
  }

  /** Set canvas dimensions accounting for DPR */
  setSize(width: number, height: number): void {
    const dpr = Math.min(window.devicePixelRatio, this.maxDpr);
    this.canvas.width = width * dpr;
    this.canvas.height = height * dpr;
    this.canvas.style.width = `${width}px`;
    this.canvas.style.height = `${height}px`;
    this.ctx.scale(dpr, dpr);
  }

  /** Preload frames starting from center (key frame) and expanding outward */
  async preload(): Promise<void> {
    const keyFrame = Math.floor(this.frameCount / 2);
    const priority = [keyFrame, 0, this.frameCount - 1];

    // Load key frames first
    await Promise.all(priority.map((i) => this.loadFrame(i)));

    // Then load remaining frames in batches
    const remaining = Array.from({ length: this.frameCount }, (_, i) => i)
      .filter((i) => !priority.includes(i));

    const batchSize = 10;
    for (let b = 0; b < remaining.length; b += batchSize) {
      if (this.disposed) return;
      const batch = remaining.slice(b, b + batchSize);
      await Promise.all(batch.map((i) => this.loadFrame(i)));
    }
  }

  /** Load a single frame image */
  private loadFrame(index: number): Promise<HTMLImageElement> {
    if (this.frames.has(index)) return Promise.resolve(this.frames.get(index)!);
    if (this.loading.has(index)) {
      return new Promise((resolve) => {
        const check = () => {
          if (this.frames.has(index)) resolve(this.frames.get(index)!);
          else setTimeout(check, 16);
        };
        check();
      });
    }

    this.loading.add(index);
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        this.frames.set(index, img);
        this.loading.delete(index);
        this.evictDistantFrames(index);
        resolve(img);
      };
      img.onerror = () => {
        this.loading.delete(index);
        reject(new Error(`Failed to load frame ${index}`));
      };
      img.src = this.getFrameUrl(index);
    });
  }

  /** Remove frames far from current position to manage memory */
  private evictDistantFrames(currentIndex: number): void {
    if (this.frames.size <= this.windowSize) return;

    const entries = [...this.frames.entries()]
      .map(([idx, img]) => ({ idx, img, dist: Math.abs(idx - currentIndex) }))
      .sort((a, b) => b.dist - a.dist);

    while (this.frames.size > this.windowSize) {
      const evict = entries.shift();
      if (evict) {
        this.frames.delete(evict.idx);
      }
    }
  }

  /** Set progress (0-1) and render the corresponding frame */
  setProgress(progress: number): void {
    if (this.disposed) return;

    const clamped = Math.max(0, Math.min(1, progress));
    const frameIndex = Math.round(clamped * (this.frameCount - 1));

    if (frameIndex === this.currentFrame && this.frames.has(frameIndex)) return;
    this.currentFrame = frameIndex;

    const frame = this.frames.get(frameIndex);
    if (frame) {
      this.renderFrame(frame);
    } else {
      // Frame not loaded yet — load it and render when ready
      this.loadFrame(frameIndex).then((img) => {
        if (this.currentFrame === frameIndex) {
          this.renderFrame(img);
        }
      });
    }
  }

  /** Render a single frame to the canvas */
  private renderFrame(img: HTMLImageElement): void {
    const { width, height } = this.canvas.getBoundingClientRect();
    this.ctx.clearRect(0, 0, width, height);

    // Cover fit (like object-fit: cover)
    const imgRatio = img.naturalWidth / img.naturalHeight;
    const canvasRatio = width / height;

    let drawWidth: number, drawHeight: number, offsetX: number, offsetY: number;

    if (imgRatio > canvasRatio) {
      drawHeight = height;
      drawWidth = height * imgRatio;
      offsetX = (width - drawWidth) / 2;
      offsetY = 0;
    } else {
      drawWidth = width;
      drawHeight = width / imgRatio;
      offsetX = 0;
      offsetY = (height - drawHeight) / 2;
    }

    this.ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
  }

  /** Render the key frame (50% progress) for reduced-motion fallback */
  renderKeyFrame(): void {
    const keyIndex = Math.floor(this.frameCount / 2);
    const frame = this.frames.get(keyIndex);
    if (frame) {
      this.renderFrame(frame);
    } else {
      this.loadFrame(keyIndex).then((img) => this.renderFrame(img));
    }
  }

  /** Clean up all resources */
  dispose(): void {
    this.disposed = true;
    this.frames.clear();
    this.loading.clear();
  }
}
