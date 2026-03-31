/**
 * OG Image Template — Satori JSX template for 1200×630 OpenGraph images.
 *
 * Renders a branded OG image with title, description, logo, and gradient
 * background. Uses Satori (flexbox layout, no browser needed).
 *
 * Usage:
 *   import { OgImageTemplate } from "./og-image-satori";
 *   import { renderWithSatori } from "../shared/image-pipeline";
 *   import { loadFonts } from "../shared/satori-fonts";
 *
 *   const fonts = await loadFonts(["Inter"]);
 *   await renderWithSatori({
 *     jsx: <OgImageTemplate brand={brand} title="My Post Title" />,
 *     width: 1200, height: 630, fonts,
 *     outputPath: "./generated-assets/og-image.png",
 *   });
 */

import type { BrandConfig } from "../shared/brand-config";

interface OgImageTemplateProps {
  brand: BrandConfig;
  title: string;
  description?: string;
  /** Optional tag/category shown above the title */
  tag?: string;
}

/**
 * Satori-compatible JSX template.
 *
 * Note: Satori only supports flexbox layout, no CSS Grid.
 * All styles must use the inline style prop (no Tailwind in Satori).
 */
export function OgImageTemplate({ brand, title, description, tag }: OgImageTemplateProps) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "60px 80px",
        background: `linear-gradient(135deg, ${brand.colors.background}, ${brand.colors.primary}22)`,
        fontFamily: brand.typography.displayFont,
      }}
    >
      {/* Top: Logo + Brand */}
      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        {brand.logoPath && (
          <img
            src={brand.logoPath}
            width={48}
            height={48}
            style={{ borderRadius: "8px" }}
          />
        )}
        <span
          style={{
            fontSize: "24px",
            fontWeight: 600,
            color: brand.colors.foreground,
            opacity: 0.8,
          }}
        >
          {brand.name}
        </span>
      </div>

      {/* Middle: Title + Description */}
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {tag && (
          <span
            style={{
              fontSize: "16px",
              fontWeight: 600,
              color: brand.colors.primary,
              textTransform: "uppercase" as const,
              letterSpacing: "0.08em",
            }}
          >
            {tag}
          </span>
        )}
        <h1
          style={{
            fontSize: title.length > 60 ? "40px" : title.length > 30 ? "52px" : "64px",
            fontWeight: 700,
            color: brand.colors.foreground,
            lineHeight: 1.1,
            letterSpacing: "-0.03em",
            margin: 0,
          }}
        >
          {title}
        </h1>
        {description && (
          <p
            style={{
              fontSize: "22px",
              color: brand.colors.foreground,
              opacity: 0.7,
              lineHeight: 1.4,
              margin: 0,
            }}
          >
            {description}
          </p>
        )}
      </div>

      {/* Bottom: Tagline + Accent line */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {brand.tagline && (
          <span
            style={{
              fontSize: "18px",
              color: brand.colors.foreground,
              opacity: 0.5,
            }}
          >
            {brand.tagline}
          </span>
        )}
        <div
          style={{
            width: "80px",
            height: "4px",
            background: `linear-gradient(90deg, ${brand.colors.primary}, ${brand.colors.accent})`,
            borderRadius: "2px",
          }}
        />
      </div>
    </div>
  );
}
