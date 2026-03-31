/**
 * OG Image Generator — CLI entry point.
 *
 * Generates a 1200×630 OpenGraph image using the Satori pipeline.
 * Reads brand config and content from CLI args or a JSON config file.
 *
 * Usage:
 *   npx tsx generate.ts --title "My Article" --description "A great read" --output ./og.png
 *   npx tsx generate.ts --config ./og-config.json
 *
 * Config JSON format:
 *   {
 *     "brand": { "name": "Acme", "colors": { ... } },
 *     "title": "My Article",
 *     "description": "A great read",
 *     "tag": "Blog"
 *   }
 *
 * Dependencies: pnpm add satori @resvg/resvg-js sharp
 */

import { renderWithSatori } from "../shared/image-pipeline";
import { loadFonts } from "../shared/satori-fonts";
import { resolveBrandConfig, type BrandConfig } from "../shared/brand-config";
import { WEB_SIZES } from "../shared/size-presets";
import { OgImageTemplate } from "./og-image-satori";

interface OgConfig {
  brand: Partial<BrandConfig> & { name: string };
  industry?: string;
  title: string;
  description?: string;
  tag?: string;
  output?: string;
  format?: "png" | "webp" | "avif";
}

async function generateOgImage(config: OgConfig) {
  const { width, height } = WEB_SIZES["og-image"];
  const outputPath = config.output ?? "./generated-assets/og-image.png";

  // Resolve brand config with industry defaults
  const brand = resolveBrandConfig(config.industry ?? "saas", config.brand);

  // Load fonts
  const fontFamilies = [brand.typography.displayFont];
  if (brand.typography.bodyFont !== brand.typography.displayFont) {
    fontFamilies.push(brand.typography.bodyFont);
  }
  const fonts = await loadFonts(fontFamilies);

  // Render
  const result = await renderWithSatori({
    jsx: OgImageTemplate({
      brand,
      title: config.title,
      description: config.description,
      tag: config.tag,
    }),
    width,
    height,
    fonts,
    outputPath,
    format: config.format ?? "png",
  });

  console.log(`✓ OG image generated: ${result} (${width}×${height})`);
  return result;
}

// CLI entry point
async function main() {
  const args = process.argv.slice(2);

  // Check for --config flag
  const configIndex = args.indexOf("--config");
  if (configIndex !== -1 && args[configIndex + 1]) {
    const fs = await import("fs/promises");
    const configPath = args[configIndex + 1];
    const raw = await fs.readFile(configPath, "utf-8");
    const config: OgConfig = JSON.parse(raw);
    await generateOgImage(config);
    return;
  }

  // Parse individual flags
  const getArg = (flag: string): string | undefined => {
    const idx = args.indexOf(flag);
    return idx !== -1 ? args[idx + 1] : undefined;
  };

  const title = getArg("--title");
  if (!title) {
    console.error("Usage: npx tsx generate.ts --title \"Title\" [--description \"Desc\"] [--output ./path.png]");
    process.exit(1);
  }

  await generateOgImage({
    brand: { name: getArg("--brand") ?? "My Brand" },
    industry: getArg("--industry"),
    title,
    description: getArg("--description"),
    tag: getArg("--tag"),
    output: getArg("--output"),
    format: getArg("--format") as OgConfig["format"],
  });
}

main().catch((err) => {
  console.error("Error generating OG image:", err.message);
  process.exit(1);
});

export { generateOgImage };
