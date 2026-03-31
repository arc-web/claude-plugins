/**
 * Font loading utilities for Satori/Takumi asset generation.
 *
 * Satori requires fonts as ArrayBuffer. This module handles loading fonts
 * from Google Fonts CDN or local files. Caches loaded fonts for reuse.
 *
 * Usage:
 *   import { loadFonts } from "./satori-fonts";
 *   const fonts = await loadFonts(["Inter", "JetBrains Mono"]);
 *   const svg = await satori(<MyTemplate />, { width: 1200, height: 630, fonts });
 */

interface SatoriFont {
  name: string;
  data: ArrayBuffer;
  weight: number;
  style: "normal" | "italic";
}

/** Google Fonts CDN URL builder */
function googleFontUrl(family: string, weight: number = 400): string {
  const encoded = encodeURIComponent(family);
  return `https://fonts.googleapis.com/css2?family=${encoded}:wght@${weight}&display=swap`;
}

/** Extract font file URL from Google Fonts CSS response */
async function extractFontUrl(family: string, weight: number = 400): Promise<string> {
  const cssUrl = googleFontUrl(family, weight);
  const response = await fetch(cssUrl, {
    headers: {
      // Request woff2 format
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    },
  });

  const css = await response.text();
  const match = css.match(/url\(([^)]+\.woff2)\)/);
  if (!match) throw new Error(`Could not find font URL for ${family} weight ${weight}`);
  return match[1];
}

/** Font cache to avoid re-downloading */
const fontCache = new Map<string, ArrayBuffer>();

/** Load a single font as ArrayBuffer */
async function loadFont(family: string, weight: number = 400): Promise<ArrayBuffer> {
  const cacheKey = `${family}-${weight}`;
  if (fontCache.has(cacheKey)) return fontCache.get(cacheKey)!;

  const fontUrl = await extractFontUrl(family, weight);
  const response = await fetch(fontUrl);
  const buffer = await response.arrayBuffer();

  fontCache.set(cacheKey, buffer);
  return buffer;
}

/**
 * Load a font from a local file path.
 * Use when fonts are bundled in the project rather than fetched from CDN.
 */
async function loadLocalFont(filePath: string): Promise<ArrayBuffer> {
  if (fontCache.has(filePath)) return fontCache.get(filePath)!;

  const fs = await import("fs/promises");
  const buffer = await fs.readFile(filePath);
  const arrayBuffer = buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength);

  fontCache.set(filePath, arrayBuffer as ArrayBuffer);
  return arrayBuffer as ArrayBuffer;
}

/**
 * Load fonts for Satori. Returns array of SatoriFont objects.
 *
 * @param families - Font family names (from BrandConfig.typography)
 * @param weights - Weights to load per family. Default: [400, 600, 700]
 */
export async function loadFonts(
  families: string[],
  weights: number[] = [400, 600, 700]
): Promise<SatoriFont[]> {
  const fonts: SatoriFont[] = [];

  for (const family of families) {
    for (const weight of weights) {
      try {
        const data = await loadFont(family, weight);
        fonts.push({ name: family, data, weight, style: "normal" });
      } catch {
        // Skip unavailable weights silently
        console.warn(`Font ${family} weight ${weight} not available, skipping`);
      }
    }
  }

  return fonts;
}

/**
 * Load fonts from local file paths for Satori.
 *
 * @param fontFiles - Array of { path, name, weight } objects
 */
export async function loadLocalFonts(
  fontFiles: { path: string; name: string; weight: number }[]
): Promise<SatoriFont[]> {
  const fonts: SatoriFont[] = [];

  for (const file of fontFiles) {
    const data = await loadLocalFont(file.path);
    fonts.push({ name: file.name, data, weight: file.weight, style: "normal" });
  }

  return fonts;
}
