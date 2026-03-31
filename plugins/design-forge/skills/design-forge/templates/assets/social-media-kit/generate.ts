/**
 * Social Media Kit Generator — Batch generates branded assets for all platforms.
 *
 * Generates 6 social media images from a single brand config:
 * - Instagram Post (1080×1080)
 * - Instagram Story (1080×1920)
 * - Twitter/X Post (1200×675)
 * - LinkedIn Post (1200×627)
 * - Facebook Post (1200×630)
 * - YouTube Thumbnail (1280×720)
 *
 * Usage:
 *   npx tsx generate.ts --config ./social-kit-config.json
 *   npx tsx generate.ts --brand "Spark Electric" --industry services --headline "24/7 Emergency Service"
 *
 * Config JSON format:
 *   {
 *     "brand": { "name": "Spark Electric", "tagline": "Powering your home safely" },
 *     "industry": "services",
 *     "headline": "24/7 Emergency Service",
 *     "body": "Licensed electricians at your door in 30 minutes.",
 *     "variant": "announcement",
 *     "outputDir": "./generated-assets/social-kit"
 *   }
 *
 * Dependencies: pnpm add satori @resvg/resvg-js sharp
 */

import { renderWithSatori } from "../shared/image-pipeline";
import { loadFonts } from "../shared/satori-fonts";
import { resolveBrandConfig, type BrandConfig } from "../shared/brand-config";
import { getSocialKitSizes, type SizePreset } from "../shared/size-presets";
import { InstagramPost } from "./instagram-post";

type PostVariant = "announcement" | "quote" | "stat" | "tip";

interface SocialKitConfig {
  brand: Partial<BrandConfig> & { name: string };
  industry?: string;
  headline: string;
  body?: string;
  variant?: PostVariant;
  stat?: string;
  statLabel?: string;
  attribution?: string;
  tipNumber?: number;
  outputDir?: string;
  format?: "png" | "webp";
}

/**
 * Generate a single social media image.
 * Uses the Instagram Post template adapted to different aspect ratios.
 */
async function generateSocialImage(
  brand: BrandConfig,
  config: SocialKitConfig,
  size: SizePreset,
  name: string,
  fonts: any[],
  outputDir: string,
  format: "png" | "webp"
): Promise<string> {
  const outputPath = `${outputDir}/${name}.${format}`;

  await renderWithSatori({
    jsx: InstagramPost({
      brand,
      variant: config.variant ?? "announcement",
      headline: config.headline,
      body: config.body,
      stat: config.stat,
      statLabel: config.statLabel,
      attribution: config.attribution,
      tipNumber: config.tipNumber,
    }),
    width: size.width,
    height: size.height,
    fonts,
    outputPath,
    format,
  });

  return outputPath;
}

async function generateSocialKit(config: SocialKitConfig) {
  const outputDir = config.outputDir ?? "./generated-assets/social-kit";
  const format = config.format ?? "png";

  // Resolve brand
  const brand = resolveBrandConfig(config.industry ?? "saas", config.brand);

  // Load fonts
  const fonts = await loadFonts([brand.typography.displayFont]);

  // Get all social sizes
  const sizes = getSocialKitSizes();

  console.log(`\nGenerating social media kit for "${brand.name}"...`);
  console.log(`Industry: ${config.industry ?? "saas"} | Style: ${brand.style}`);
  console.log(`Output: ${outputDir}/\n`);

  const results: string[] = [];

  for (const [name, size] of Object.entries(sizes)) {
    const path = await generateSocialImage(
      brand, config, size, name, fonts, outputDir, format
    );
    const fileSizeKb = Math.round(
      (await import("fs")).statSync(path).size / 1024
    );
    console.log(`  ✓ ${size.label.padEnd(22)} ${size.width}×${size.height}  ${fileSizeKb}KB`);
    results.push(path);
  }

  console.log(`\n✓ ${results.length} assets generated in ${outputDir}/`);
  return results;
}

// CLI entry point
async function main() {
  const args = process.argv.slice(2);

  const configIndex = args.indexOf("--config");
  if (configIndex !== -1 && args[configIndex + 1]) {
    const fs = await import("fs/promises");
    const raw = await fs.readFile(args[configIndex + 1], "utf-8");
    const config: SocialKitConfig = JSON.parse(raw);
    await generateSocialKit(config);
    return;
  }

  const getArg = (flag: string): string | undefined => {
    const idx = args.indexOf(flag);
    return idx !== -1 ? args[idx + 1] : undefined;
  };

  const headline = getArg("--headline");
  if (!headline) {
    console.error("Usage: npx tsx generate.ts --brand \"Name\" --headline \"Text\" [--industry services] [--variant announcement]");
    process.exit(1);
  }

  await generateSocialKit({
    brand: { name: getArg("--brand") ?? "My Brand" },
    industry: getArg("--industry"),
    headline,
    body: getArg("--body"),
    variant: getArg("--variant") as PostVariant,
    outputDir: getArg("--output"),
    format: getArg("--format") as SocialKitConfig["format"],
  });
}

main().catch((err) => {
  console.error("Error generating social kit:", err.message);
  process.exit(1);
});

export { generateSocialKit };
