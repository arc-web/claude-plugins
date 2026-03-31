/**
 * Quality Showcase Generator — Apple-style zoom bubble annotations.
 *
 * Takes a screenshot, extracts regions, magnifies them, and composites
 * with annotation labels to showcase screen quality or UI details.
 *
 * Usage:
 *   npx tsx generate.ts --image ./screenshot.png --config ./showcase-config.json --output ./showcase.png
 *
 * Config JSON format:
 *   {
 *     "regions": [
 *       { "x": 100, "y": 200, "size": 80, "label": "Retina-quality text", "zoom": 3 },
 *       { "x": 500, "y": 300, "size": 60, "label": "Pixel-perfect icons", "zoom": 4 }
 *     ],
 *     "background": "#070809"
 *   }
 *
 * Dependencies: pnpm add sharp satori @resvg/resvg-js
 */

interface ZoomRegion {
  /** X position of the region center in the source image */
  x: number;
  /** Y position of the region center */
  y: number;
  /** Size of the square extraction area */
  size: number;
  /** Text label for the annotation */
  label: string;
  /** Zoom magnification factor. Default: 3 */
  zoom?: number;
}

interface ShowcaseConfig {
  image: string;
  regions: ZoomRegion[];
  background?: string;
  output: string;
  format?: "png" | "webp";
}

async function generateShowcase(config: ShowcaseConfig) {
  const sharp = (await import("sharp")).default;
  const { mkdir, readFile } = await import("fs/promises");
  const { dirname } = await import("path");

  await mkdir(dirname(config.output), { recursive: true });

  const bg = config.background ?? "#070809";

  // Load source image
  const sourceBuffer = await readFile(config.image);
  const sourceMeta = await sharp(sourceBuffer).metadata();
  const sourceWidth = sourceMeta.width ?? 1920;
  const sourceHeight = sourceMeta.height ?? 1080;

  // Output dimensions: source image centered with zoom bubbles around it
  const padding = 200;
  const outputWidth = sourceWidth + padding * 2;
  const outputHeight = sourceHeight + padding * 2;

  // Start with background
  let pipeline = sharp({
    create: {
      width: outputWidth,
      height: outputHeight,
      channels: 4,
      background: bg,
    },
  }).png();

  const composites: { input: Buffer; top: number; left: number }[] = [];

  // Add source image centered
  composites.push({
    input: sourceBuffer as unknown as Buffer,
    top: padding,
    left: padding,
  });

  // Generate zoom bubbles
  for (let i = 0; i < config.regions.length; i++) {
    const region = config.regions[i];
    const zoom = region.zoom ?? 3;
    const bubbleSize = region.size * zoom;

    // Extract region from source
    const halfSize = Math.floor(region.size / 2);
    const extractLeft = Math.max(0, Math.min(region.x - halfSize, sourceWidth - region.size));
    const extractTop = Math.max(0, Math.min(region.y - halfSize, sourceHeight - region.size));

    const extracted = await sharp(sourceBuffer)
      .extract({
        left: extractLeft,
        top: extractTop,
        width: Math.min(region.size, sourceWidth - extractLeft),
        height: Math.min(region.size, sourceHeight - extractTop),
      })
      .resize(bubbleSize, bubbleSize, { kernel: "nearest" })
      .png()
      .toBuffer();

    // Create circular mask
    const mask = Buffer.from(
      `<svg width="${bubbleSize}" height="${bubbleSize}">
        <circle cx="${bubbleSize / 2}" cy="${bubbleSize / 2}" r="${bubbleSize / 2}" fill="white" />
      </svg>`
    );

    const circularBubble = await sharp(extracted)
      .composite([{ input: mask, blend: "dest-in" }])
      .png()
      .toBuffer();

    // Create border ring
    const borderSize = bubbleSize + 6;
    const borderRing = Buffer.from(
      `<svg width="${borderSize}" height="${borderSize}">
        <circle cx="${borderSize / 2}" cy="${borderSize / 2}" r="${borderSize / 2}" fill="none" stroke="#ffffff30" stroke-width="3" />
      </svg>`
    );

    // Position bubble at edge of the image
    const angle = (i / config.regions.length) * Math.PI * 2 - Math.PI / 2;
    const bubbleX = Math.round(outputWidth / 2 + Math.cos(angle) * (sourceWidth / 2 + 60)) - bubbleSize / 2;
    const bubbleY = Math.round(outputHeight / 2 + Math.sin(angle) * (sourceHeight / 2 + 60)) - bubbleSize / 2;

    composites.push({
      input: await sharp(borderRing).resize(borderSize, borderSize).png().toBuffer(),
      top: Math.round(bubbleY - 3),
      left: Math.round(bubbleX - 3),
    });

    composites.push({
      input: circularBubble,
      top: Math.round(bubbleY),
      left: Math.round(bubbleX),
    });

    // Create label
    const labelSvg = Buffer.from(
      `<svg width="300" height="40">
        <text x="150" y="28" text-anchor="middle" font-family="Inter, sans-serif" font-size="16" font-weight="600" fill="#ededed">${region.label}</text>
      </svg>`
    );

    composites.push({
      input: labelSvg,
      top: Math.round(bubbleY + bubbleSize + 12),
      left: Math.round(bubbleX + bubbleSize / 2 - 150),
    });

    // Draw connecting line from source region to bubble
    const lineStartX = padding + region.x;
    const lineStartY = padding + region.y;
    const lineEndX = Math.round(bubbleX + bubbleSize / 2);
    const lineEndY = Math.round(bubbleY + bubbleSize / 2);

    const lineSvg = Buffer.from(
      `<svg width="${outputWidth}" height="${outputHeight}">
        <line x1="${lineStartX}" y1="${lineStartY}" x2="${lineEndX}" y2="${lineEndY}" stroke="#ffffff15" stroke-width="1" stroke-dasharray="4,4" />
        <circle cx="${lineStartX}" cy="${lineStartY}" r="4" fill="#ffffff30" />
      </svg>`
    );

    composites.push({
      input: await sharp(lineSvg).png().toBuffer(),
      top: 0,
      left: 0,
    });
  }

  await pipeline.composite(composites).toFile(config.output);

  console.log(`✓ Quality showcase: ${config.output} (${outputWidth}×${outputHeight}, ${config.regions.length} zoom regions)`);
  return config.output;
}

// CLI
async function main() {
  const args = process.argv.slice(2);
  const getArg = (flag: string): string | undefined => {
    const idx = args.indexOf(flag);
    return idx !== -1 ? args[idx + 1] : undefined;
  };

  const configPath = getArg("--config");
  const imagePath = getArg("--image");

  if (!imagePath) {
    console.error("Usage: npx tsx generate.ts --image ./screenshot.png --config ./regions.json --output ./showcase.png");
    process.exit(1);
  }

  let regions: ZoomRegion[] = [];
  if (configPath) {
    const fs = await import("fs/promises");
    const raw = await fs.readFile(configPath, "utf-8");
    const parsed = JSON.parse(raw);
    regions = parsed.regions ?? [];
  } else {
    // Default: 4 corners
    regions = [
      { x: 200, y: 200, size: 80, label: "Detail A", zoom: 3 },
      { x: 800, y: 200, size: 80, label: "Detail B", zoom: 3 },
      { x: 200, y: 600, size: 80, label: "Detail C", zoom: 3 },
      { x: 800, y: 600, size: 80, label: "Detail D", zoom: 3 },
    ];
  }

  await generateShowcase({
    image: imagePath,
    regions,
    background: getArg("--bg"),
    output: getArg("--output") ?? "./generated-assets/quality-showcase.png",
    format: getArg("--format") as ShowcaseConfig["format"],
  });
}

main().catch((err) => { console.error(err.message); process.exit(1); });

export { generateShowcase };
