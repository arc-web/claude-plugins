/**
 * Print Materials Generator — Business one-pagers and brochures via @react-pdf/renderer.
 *
 * Generates branded PDF documents from React components. Uses the taxonomy
 * BrandConfig for colors, typography, and style.
 *
 * Usage:
 *   npx tsx generate.ts --type one-pager --config ./print-config.json --output ./one-pager.pdf
 *
 * Config JSON format:
 *   {
 *     "brand": { "name": "Acme Corp", "tagline": "Building the future" },
 *     "industry": "saas",
 *     "title": "Product Overview",
 *     "sections": [
 *       { "heading": "The Problem", "body": "Teams waste hours on..." },
 *       { "heading": "Our Solution", "body": "Acme automates..." },
 *       { "heading": "Key Features", "bullets": ["Feature A", "Feature B", "Feature C"] },
 *       { "heading": "Pricing", "body": "Starting at $49/mo" }
 *     ],
 *     "stats": [
 *       { "value": "10x", "label": "Faster deployments" },
 *       { "value": "99.9%", "label": "Uptime SLA" }
 *     ],
 *     "contactEmail": "hello@acme.com",
 *     "contactUrl": "https://acme.com"
 *   }
 *
 * Dependencies: pnpm add @react-pdf/renderer
 */

import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  renderToFile,
  Font,
} from "@react-pdf/renderer";
import { resolveBrandConfig, type BrandConfig } from "../shared/brand-config";

// Register default font (Inter from Google Fonts)
Font.register({
  family: "Inter",
  fonts: [
    { src: "https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuLyfMZg.ttf", fontWeight: 400 },
    { src: "https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuGKYMZg.ttf", fontWeight: 600 },
    { src: "https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuFuYMZg.ttf", fontWeight: 700 },
  ],
});

interface PrintSection {
  heading: string;
  body?: string;
  bullets?: string[];
}

interface PrintStat {
  value: string;
  label: string;
}

interface PrintConfig {
  brand: Partial<BrandConfig> & { name: string };
  industry?: string;
  title: string;
  subtitle?: string;
  sections: PrintSection[];
  stats?: PrintStat[];
  contactEmail?: string;
  contactUrl?: string;
  output?: string;
}

function createStyles(brand: BrandConfig) {
  return StyleSheet.create({
    page: {
      padding: 48,
      fontFamily: "Inter",
      backgroundColor: "#FFFFFF",
      color: "#1a1a1a",
    },
    header: {
      marginBottom: 24,
      borderBottomWidth: 2,
      borderBottomColor: brand.colors.primary,
      paddingBottom: 16,
    },
    brandName: {
      fontSize: 14,
      fontWeight: 600,
      color: brand.colors.primary,
      letterSpacing: 0.5,
    },
    title: {
      fontSize: 28,
      fontWeight: 700,
      color: "#111827",
      marginTop: 8,
      lineHeight: 1.2,
    },
    subtitle: {
      fontSize: 12,
      color: "#6B7280",
      marginTop: 4,
    },
    statsRow: {
      flexDirection: "row" as const,
      justifyContent: "space-around" as const,
      backgroundColor: brand.colors.primary + "08",
      borderRadius: 8,
      padding: 16,
      marginBottom: 24,
    },
    stat: {
      alignItems: "center" as const,
    },
    statValue: {
      fontSize: 24,
      fontWeight: 700,
      color: brand.colors.primary,
    },
    statLabel: {
      fontSize: 9,
      color: "#6B7280",
      marginTop: 2,
    },
    sectionHeading: {
      fontSize: 14,
      fontWeight: 600,
      color: "#111827",
      marginTop: 16,
      marginBottom: 6,
    },
    sectionBody: {
      fontSize: 10,
      color: "#374151",
      lineHeight: 1.6,
    },
    bullet: {
      fontSize: 10,
      color: "#374151",
      lineHeight: 1.8,
      paddingLeft: 12,
    },
    bulletDot: {
      color: brand.colors.primary,
    },
    footer: {
      position: "absolute" as const,
      bottom: 32,
      left: 48,
      right: 48,
      flexDirection: "row" as const,
      justifyContent: "space-between" as const,
      borderTopWidth: 1,
      borderTopColor: "#E5E7EB",
      paddingTop: 12,
    },
    footerText: {
      fontSize: 8,
      color: "#9CA3AF",
    },
  });
}

function OnePager({ config, brand }: { config: PrintConfig; brand: BrandConfig }) {
  const styles = createStyles(brand);

  return React.createElement(
    Document,
    null,
    React.createElement(
      Page,
      { size: "LETTER", style: styles.page },
      // Header
      React.createElement(
        View,
        { style: styles.header },
        React.createElement(Text, { style: styles.brandName }, brand.name.toUpperCase()),
        React.createElement(Text, { style: styles.title }, config.title),
        config.subtitle &&
          React.createElement(Text, { style: styles.subtitle }, config.subtitle)
      ),
      // Stats row
      config.stats &&
        config.stats.length > 0 &&
        React.createElement(
          View,
          { style: styles.statsRow },
          ...config.stats.map((stat, i) =>
            React.createElement(
              View,
              { key: i, style: styles.stat },
              React.createElement(Text, { style: styles.statValue }, stat.value),
              React.createElement(Text, { style: styles.statLabel }, stat.label)
            )
          )
        ),
      // Sections
      ...config.sections.map((section, i) =>
        React.createElement(
          View,
          { key: i },
          React.createElement(Text, { style: styles.sectionHeading }, section.heading),
          section.body &&
            React.createElement(Text, { style: styles.sectionBody }, section.body),
          section.bullets &&
            React.createElement(
              View,
              null,
              ...section.bullets.map((bullet, j) =>
                React.createElement(
                  Text,
                  { key: j, style: styles.bullet },
                  `\u2022  ${bullet}`
                )
              )
            )
        )
      ),
      // Footer
      React.createElement(
        View,
        { style: styles.footer, fixed: true } as any,
        React.createElement(
          Text,
          { style: styles.footerText },
          config.contactEmail ?? brand.name
        ),
        React.createElement(
          Text,
          { style: styles.footerText },
          config.contactUrl ?? ""
        )
      )
    )
  );
}

async function generatePrintMaterial(config: PrintConfig) {
  const brand = resolveBrandConfig(config.industry ?? "saas", config.brand);
  const outputPath = config.output ?? "./generated-assets/one-pager.pdf";

  const { mkdir } = await import("fs/promises");
  const { dirname } = await import("path");
  await mkdir(dirname(outputPath), { recursive: true });

  const doc = React.createElement(OnePager, { config, brand });
  await renderToFile(doc, outputPath);

  console.log(`\u2713 Print material generated: ${outputPath}`);
  return outputPath;
}

// CLI
async function main() {
  const args = process.argv.slice(2);
  const getArg = (flag: string): string | undefined => {
    const idx = args.indexOf(flag);
    return idx !== -1 ? args[idx + 1] : undefined;
  };

  const configPath = getArg("--config");
  if (!configPath) {
    console.error(
      "Usage: npx tsx generate.ts --config ./print-config.json [--output ./one-pager.pdf]"
    );
    process.exit(1);
  }

  const fs = await import("fs/promises");
  const raw = await fs.readFile(configPath, "utf-8");
  const config: PrintConfig = JSON.parse(raw);
  config.output = getArg("--output") ?? config.output;

  await generatePrintMaterial(config);
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});

export { generatePrintMaterial };
