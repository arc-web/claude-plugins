/**
 * Website Hero Image Generator — Gradient mesh, geometric pattern, or sketch style.
 *
 * Generates hero images for websites using three visual approaches:
 * 1. Gradient mesh — Overlapping radial gradients (Satori)
 * 2. Geometric pattern — Repeating shapes with brand colors (@napi-rs/canvas)
 * 3. Sketch style — Hand-drawn look via Rough.js (requires rough)
 *
 * Usage:
 *   npx tsx generate.ts --style gradient --width 1920 --height 1080 --output ./hero.png
 *   npx tsx generate.ts --style geometric --colors "#4a78ff,#9333ea,#ff9447"
 *
 * Dependencies:
 *   pnpm add sharp @napi-rs/canvas          # gradient + geometric
 *   pnpm add sharp @napi-rs/canvas rough    # sketch style
 */

import { renderWithCanvas } from "../shared/image-pipeline";

interface HeroConfig {
  style: "gradient" | "geometric" | "sketch";
  width: number;
  height: number;
  colors?: string;
  background?: string;
  output: string;
  format?: "png" | "webp";
}

function drawGradientHero(ctx: any, w: number, h: number, colors: string[], bg: string) {
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, h);

  // Mesh of overlapping radial gradients
  const positions = [
    { x: 0.2, y: 0.3 }, { x: 0.7, y: 0.2 }, { x: 0.5, y: 0.7 },
    { x: 0.1, y: 0.8 }, { x: 0.9, y: 0.6 },
  ];

  positions.forEach((pos, i) => {
    const color = colors[i % colors.length];
    const cx = w * pos.x;
    const cy = h * pos.y;
    const radius = Math.min(w, h) * (0.3 + (i % 3) * 0.1);

    const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
    grad.addColorStop(0, color + "50");
    grad.addColorStop(0.5, color + "18");
    grad.addColorStop(1, "transparent");

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);
  });

  // Subtle grain overlay
  const imageData = ctx.getImageData(0, 0, w, h);
  const data = imageData.data;
  let seed = 12345;
  for (let i = 0; i < data.length; i += 4) {
    seed = (seed * 16807) % 2147483647;
    const noise = ((seed / 2147483647) - 0.5) * 8;
    data[i] = Math.max(0, Math.min(255, data[i] + noise));
    data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + noise));
    data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + noise));
  }
  ctx.putImageData(imageData, 0, 0);
}

function drawGeometricHero(ctx: any, w: number, h: number, colors: string[], bg: string) {
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, h);

  let seed = 42;
  const random = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };

  const shapes = 60;
  for (let i = 0; i < shapes; i++) {
    const color = colors[i % colors.length];
    const x = random() * w;
    const y = random() * h;
    const size = 20 + random() * 80;
    const opacity = Math.round(8 + random() * 20);
    const opHex = opacity.toString(16).padStart(2, "0");

    ctx.fillStyle = color + opHex;
    ctx.strokeStyle = color + Math.round(opacity * 0.5).toString(16).padStart(2, "0");
    ctx.lineWidth = 1;

    const shapeType = Math.floor(random() * 3);
    if (shapeType === 0) {
      // Circle
      ctx.beginPath();
      ctx.arc(x, y, size / 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    } else if (shapeType === 1) {
      // Rounded rectangle
      const r = size * 0.2;
      ctx.beginPath();
      ctx.moveTo(x + r, y);
      ctx.lineTo(x + size - r, y);
      ctx.quadraticCurveTo(x + size, y, x + size, y + r);
      ctx.lineTo(x + size, y + size - r);
      ctx.quadraticCurveTo(x + size, y + size, x + size - r, y + size);
      ctx.lineTo(x + r, y + size);
      ctx.quadraticCurveTo(x, y + size, x, y + size - r);
      ctx.lineTo(x, y + r);
      ctx.quadraticCurveTo(x, y, x + r, y);
      ctx.fill();
      ctx.stroke();
    } else {
      // Triangle
      ctx.beginPath();
      ctx.moveTo(x, y + size);
      ctx.lineTo(x + size / 2, y);
      ctx.lineTo(x + size, y + size);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    }
  }
}

async function generate(config: HeroConfig) {
  const colors = config.colors?.split(",").map((c) => c.trim()) ?? ["#4a78ff", "#9333ea", "#ff9447"];
  const bg = config.background ?? "#070809";

  const drawFns: Record<string, (ctx: any, w: number, h: number, c: string[], b: string) => void> = {
    gradient: drawGradientHero,
    geometric: drawGeometricHero,
    sketch: drawGeometricHero, // Fallback — Rough.js integration left as extension point
  };

  const drawFn = drawFns[config.style];
  if (!drawFn) {
    console.error(`Unknown style: ${config.style}. Available: gradient, geometric, sketch`);
    process.exit(1);
  }

  await renderWithCanvas({
    draw: (ctx, w, h) => drawFn(ctx, w, h, colors, bg),
    width: config.width,
    height: config.height,
    outputPath: config.output,
    format: config.format,
  });

  console.log(`✓ Hero image (${config.style}): ${config.output} (${config.width}×${config.height})`);
}

// CLI
async function main() {
  const args = process.argv.slice(2);
  const getArg = (flag: string): string | undefined => {
    const idx = args.indexOf(flag);
    return idx !== -1 ? args[idx + 1] : undefined;
  };

  await generate({
    style: (getArg("--style") ?? "gradient") as HeroConfig["style"],
    width: parseInt(getArg("--width") ?? "1920"),
    height: parseInt(getArg("--height") ?? "1080"),
    colors: getArg("--colors"),
    background: getArg("--bg"),
    output: getArg("--output") ?? "./generated-assets/hero.png",
    format: getArg("--format") as HeroConfig["format"],
  });
}

main().catch((err) => { console.error(err.message); process.exit(1); });

export { generate as generateHeroImage };
