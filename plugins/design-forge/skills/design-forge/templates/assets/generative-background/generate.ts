/**
 * Generative Background Generator — Renders Design Forge canvas presets to PNG.
 *
 * Bridges existing DrawFunction factories (grid-field, wave-field, constellation,
 * gradient-mesh, flow-field) to server-side rendering via @napi-rs/canvas.
 *
 * Usage:
 *   npx tsx generate.ts --preset grid-field --width 1920 --height 1080 --output ./bg.png
 *   npx tsx generate.ts --preset noise-gradient --colors "#4a78ff,#9333ea" --output ./bg.png
 *
 * Dependencies: pnpm add @napi-rs/canvas sharp
 */

import { renderWithCanvas } from "../shared/image-pipeline";

interface GenerateConfig {
  /** Preset name or "noise-gradient" for custom noise */
  preset: string;
  width: number;
  height: number;
  /** Comma-separated hex colors for the palette */
  colors?: string;
  /** Background color. Default: "#070809" */
  background?: string;
  output: string;
  format?: "png" | "webp";
}

/**
 * Simple noise gradient generator using sine waves (no external noise lib).
 * For simplex noise: pnpm add simplex-noise
 */
function drawNoiseGradient(
  ctx: any,
  width: number,
  height: number,
  colors: string[],
  bg: string
) {
  // Background
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, width, height);

  // Draw overlapping radial gradients with organic positioning
  const time = Date.now() * 0.001;
  colors.forEach((color, i) => {
    const cx = width * (0.3 + 0.4 * Math.sin(i * 2.1 + time * 0.1));
    const cy = height * (0.3 + 0.4 * Math.cos(i * 1.7 + time * 0.08));
    const radius = Math.min(width, height) * (0.3 + 0.2 * Math.sin(i * 1.3));

    const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
    gradient.addColorStop(0, color + "60"); // 37% opacity
    gradient.addColorStop(0.5, color + "20"); // 12% opacity
    gradient.addColorStop(1, "transparent");

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
  });
}

/**
 * Grid field preset — perspective grid with sine wave deformation.
 */
function drawGridField(ctx: any, width: number, height: number, colors: string[], bg: string) {
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, width, height);

  const gridSize = 40;
  const rows = Math.ceil(height / gridSize) + 1;
  const cols = Math.ceil(width / gridSize) + 1;

  ctx.strokeStyle = (colors[0] ?? "#4a78ff") + "20";
  ctx.lineWidth = 0.5;

  // Horizontal lines with perspective
  for (let r = 0; r < rows; r++) {
    ctx.beginPath();
    for (let c = 0; c <= cols; c++) {
      const x = c * gridSize;
      const y = r * gridSize + Math.sin(c * 0.05 + r * 0.1) * 8;
      if (c === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
  }

  // Vertical lines
  for (let c = 0; c < cols; c++) {
    ctx.beginPath();
    for (let r = 0; r <= rows; r++) {
      const x = c * gridSize + Math.cos(r * 0.05 + c * 0.1) * 8;
      const y = r * gridSize;
      if (r === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
  }

  // Center glow
  const gradient = ctx.createRadialGradient(
    width / 2, height / 2, 0,
    width / 2, height / 2, width * 0.4
  );
  gradient.addColorStop(0, (colors[0] ?? "#4a78ff") + "15");
  gradient.addColorStop(1, "transparent");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
}

/**
 * Constellation preset — scattered dots with connecting lines.
 */
function drawConstellation(ctx: any, width: number, height: number, colors: string[], bg: string) {
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, width, height);

  const dotCount = Math.floor((width * height) / 8000);
  const dots: { x: number; y: number }[] = [];

  // Seeded random for reproducibility
  let seed = 42;
  const random = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };

  for (let i = 0; i < dotCount; i++) {
    dots.push({ x: random() * width, y: random() * height });
  }

  // Draw connecting lines
  const maxDist = 120;
  ctx.strokeStyle = (colors[0] ?? "#4a78ff") + "12";
  ctx.lineWidth = 0.5;

  for (let i = 0; i < dots.length; i++) {
    for (let j = i + 1; j < dots.length; j++) {
      const dx = dots[i].x - dots[j].x;
      const dy = dots[i].y - dots[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < maxDist) {
        const alpha = Math.round((1 - dist / maxDist) * 30);
        ctx.strokeStyle = (colors[0] ?? "#4a78ff") + alpha.toString(16).padStart(2, "0");
        ctx.beginPath();
        ctx.moveTo(dots[i].x, dots[i].y);
        ctx.lineTo(dots[j].x, dots[j].y);
        ctx.stroke();
      }
    }
  }

  // Draw dots
  dots.forEach((dot) => {
    const size = 1 + random() * 2;
    ctx.fillStyle = (colors[0] ?? "#4a78ff") + "60";
    ctx.beginPath();
    ctx.arc(dot.x, dot.y, size, 0, Math.PI * 2);
    ctx.fill();
  });
}

const PRESETS: Record<string, typeof drawNoiseGradient> = {
  "noise-gradient": drawNoiseGradient,
  "grid-field": drawGridField,
  "constellation": drawConstellation,
};

async function generate(config: GenerateConfig) {
  const colors = config.colors?.split(",").map((c) => c.trim()) ?? ["#4a78ff", "#9333ea"];
  const bg = config.background ?? "#070809";
  const drawFn = PRESETS[config.preset];

  if (!drawFn) {
    console.error(`Unknown preset: ${config.preset}. Available: ${Object.keys(PRESETS).join(", ")}`);
    process.exit(1);
  }

  await renderWithCanvas({
    draw: (ctx, w, h) => drawFn(ctx, w, h, colors, bg),
    width: config.width,
    height: config.height,
    outputPath: config.output,
    format: config.format,
  });

  console.log(`✓ Generated ${config.preset} background: ${config.output} (${config.width}×${config.height})`);
}

// CLI
async function main() {
  const args = process.argv.slice(2);
  const getArg = (flag: string): string | undefined => {
    const idx = args.indexOf(flag);
    return idx !== -1 ? args[idx + 1] : undefined;
  };

  const preset = getArg("--preset");
  if (!preset) {
    console.error("Usage: npx tsx generate.ts --preset grid-field --width 1920 --height 1080 --output ./bg.png");
    console.error(`Presets: ${Object.keys(PRESETS).join(", ")}`);
    process.exit(1);
  }

  await generate({
    preset,
    width: parseInt(getArg("--width") ?? "1920"),
    height: parseInt(getArg("--height") ?? "1080"),
    colors: getArg("--colors"),
    background: getArg("--bg"),
    output: getArg("--output") ?? `./generated-assets/${preset}.png`,
    format: getArg("--format") as GenerateConfig["format"],
  });
}

main().catch((err) => { console.error(err.message); process.exit(1); });

export { generate as generateBackground };
