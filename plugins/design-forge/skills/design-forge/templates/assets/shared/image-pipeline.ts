/**
 * Core image generation pipeline: Satori → resvg → Sharp.
 *
 * Three pipeline variants:
 * 1. Satori pipeline (JSX → SVG → PNG) — fast, no browser, flexbox only
 * 2. HTML pipeline (HTML → Playwright screenshot → Sharp) — full CSS
 * 3. Canvas pipeline (@napi-rs/canvas → Sharp) — generative art
 *
 * Usage:
 *   import { renderWithSatori, renderWithPlaywright, renderWithCanvas } from "./image-pipeline";
 *
 *   // Satori (fastest, no browser)
 *   await renderWithSatori({
 *     jsx: <OgImageTemplate brand={brand} title="Hello" />,
 *     width: 1200, height: 630,
 *     fonts, outputPath: "./output/og.png",
 *   });
 *
 *   // Playwright (full CSS)
 *   await renderWithPlaywright({
 *     html: "<html>...</html>",
 *     width: 1200, height: 630,
 *     outputPath: "./output/og.png",
 *   });
 *
 * Dependencies (install as needed):
 *   pnpm add satori @resvg/resvg-js sharp           # Satori pipeline
 *   pnpm add playwright sharp                        # HTML pipeline
 *   pnpm add @napi-rs/canvas sharp                   # Canvas pipeline
 */

import type { ReactNode } from "react";

// ─── Types ──────────────────────────────────────────────────────

interface SatoriFont {
  name: string;
  data: ArrayBuffer;
  weight: number;
  style: "normal" | "italic";
}

interface SatoriRenderOptions {
  /** JSX element to render */
  jsx: ReactNode;
  /** Output width in pixels */
  width: number;
  /** Output height in pixels */
  height: number;
  /** Loaded fonts for Satori */
  fonts: SatoriFont[];
  /** Output file path */
  outputPath: string;
  /** Output format. Default: "png" */
  format?: "png" | "webp" | "avif" | "jpeg";
  /** Output quality (1-100). Default: 90 */
  quality?: number;
}

interface PlaywrightRenderOptions {
  /** Complete HTML string to render */
  html: string;
  /** Output width in pixels */
  width: number;
  /** Output height in pixels */
  height: number;
  /** Output file path */
  outputPath: string;
  /** Output format. Default: "png" */
  format?: "png" | "webp" | "avif" | "jpeg";
  /** Output quality (1-100). Default: 90 */
  quality?: number;
  /** Device scale factor. Default: 2 */
  deviceScaleFactor?: number;
}

interface CanvasRenderOptions {
  /** Function that draws on the canvas context */
  draw: (ctx: any, width: number, height: number) => void | Promise<void>;
  /** Output width in pixels */
  width: number;
  /** Output height in pixels */
  height: number;
  /** Output file path */
  outputPath: string;
  /** Output format. Default: "png" */
  format?: "png" | "webp" | "avif" | "jpeg";
  /** Output quality (1-100). Default: 90 */
  quality?: number;
}

// ─── Satori Pipeline ────────────────────────────────────────────

/**
 * Render JSX to image via Satori → resvg → Sharp.
 * Fastest pipeline (~10ms). No browser needed. CSS subset (flexbox only).
 */
export async function renderWithSatori(options: SatoriRenderOptions): Promise<string> {
  const { jsx, width, height, fonts, outputPath, format = "png", quality = 90 } = options;

  // Dynamic imports for tree-shaking
  const satori = (await import("satori")).default;
  const { Resvg } = await import("@resvg/resvg-js");
  const sharp = (await import("sharp")).default;
  const { mkdir } = await import("fs/promises");
  const { dirname } = await import("path");

  // Ensure output directory exists
  await mkdir(dirname(outputPath), { recursive: true });

  // Step 1: JSX → SVG
  const svg = await satori(jsx as any, { width, height, fonts });

  // Step 2: SVG → PNG buffer
  const resvg = new Resvg(svg, {
    fitTo: { mode: "width" as const, value: width },
  });
  const pngBuffer = resvg.render().asPng();

  // Step 3: Optimize with Sharp
  let pipeline = sharp(pngBuffer);

  if (format === "webp") pipeline = pipeline.webp({ quality });
  else if (format === "avif") pipeline = pipeline.avif({ quality });
  else if (format === "jpeg") pipeline = pipeline.jpeg({ quality });
  else pipeline = pipeline.png({ quality: Math.round(quality / 10) });

  await pipeline.toFile(outputPath);

  return outputPath;
}

// ─── Playwright Pipeline ────────────────────────────────────────

/**
 * Render HTML to image via Playwright screenshot → Sharp.
 * Full CSS support. Medium speed (~50ms warm). Requires Playwright browser.
 */
export async function renderWithPlaywright(options: PlaywrightRenderOptions): Promise<string> {
  const {
    html, width, height, outputPath,
    format = "png", quality = 90, deviceScaleFactor = 2,
  } = options;

  const { chromium } = await import("playwright");
  const sharp = (await import("sharp")).default;
  const { mkdir } = await import("fs/promises");
  const { dirname } = await import("path");

  await mkdir(dirname(outputPath), { recursive: true });

  const browser = await chromium.launch();
  const page = await browser.newPage({
    viewport: { width, height },
    deviceScaleFactor,
  });

  await page.setContent(html, { waitUntil: "networkidle" });

  const screenshotBuffer = await page.screenshot({ type: "png", fullPage: false });
  await browser.close();

  // Optimize with Sharp
  let pipeline = sharp(screenshotBuffer);

  if (format === "webp") pipeline = pipeline.webp({ quality });
  else if (format === "avif") pipeline = pipeline.avif({ quality });
  else if (format === "jpeg") pipeline = pipeline.jpeg({ quality });
  // PNG: already in PNG format from screenshot

  await pipeline.toFile(outputPath);

  return outputPath;
}

// ─── Canvas Pipeline ────────────────────────────────────────────

/**
 * Render via @napi-rs/canvas → Sharp.
 * Best for generative art, custom drawing. Fast (~5ms). No browser.
 */
export async function renderWithCanvas(options: CanvasRenderOptions): Promise<string> {
  const { draw, width, height, outputPath, format = "png", quality = 90 } = options;

  const { createCanvas } = await import("@napi-rs/canvas");
  const sharp = (await import("sharp")).default;
  const { mkdir } = await import("fs/promises");
  const { dirname } = await import("path");

  await mkdir(dirname(outputPath), { recursive: true });

  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext("2d");

  await draw(ctx, width, height);

  const pngBuffer = canvas.toBuffer("image/png");

  // Optimize with Sharp
  let pipeline = sharp(pngBuffer);

  if (format === "webp") pipeline = pipeline.webp({ quality });
  else if (format === "avif") pipeline = pipeline.avif({ quality });
  else if (format === "jpeg") pipeline = pipeline.jpeg({ quality });

  await pipeline.toFile(outputPath);

  return outputPath;
}
