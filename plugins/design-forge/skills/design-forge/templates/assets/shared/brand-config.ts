/**
 * BrandConfig — Bridge between taxonomy routing and asset generation.
 *
 * Every asset template accepts a BrandConfig that provides the visual
 * identity for generation. Taxonomy industry files define the defaults;
 * users can override with their specific brand values.
 *
 * Usage:
 *   const brand: BrandConfig = {
 *     name: "Spark Electric",
 *     tagline: "Powering your home safely",
 *     colors: { background: "#0a1628", foreground: "#f8fafc", primary: "#3b82f6", secondary: "#1e40af", accent: "#fbbf24" },
 *     typography: { displayFont: "Inter", bodyFont: "Inter" },
 *     borderRadius: "12px",
 *     style: "modern",
 *   };
 */

export interface BrandConfig {
  /** Business or product name */
  name: string;
  /** Short tagline or description */
  tagline?: string;
  /** Path to logo file (PNG/SVG with transparency) */
  logoPath?: string;

  /** Color system — populated from taxonomy industry palette */
  colors: {
    /** Page/card background */
    background: string;
    /** Primary text color */
    foreground: string;
    /** Primary brand color (buttons, highlights) */
    primary: string;
    /** Secondary color */
    secondary: string;
    /** Accent color (CTAs, alerts) */
    accent: string;
  };

  /** Typography system — populated from taxonomy industry file */
  typography: {
    /** Display/heading font family */
    displayFont: string;
    /** Body text font family */
    bodyFont: string;
    /** Monospace font for code/labels (optional) */
    monoFont?: string;
  };

  /** Border radius for cards/elements (CSS value) */
  borderRadius: string;

  /** Design style from taxonomy */
  style: "modern" | "minimalistic" | "glassmorphism" | "futuristic" | "brutalist" | "organic";

  /** Custom gradient direction (optional) */
  gradientDirection?: string;

  /** Any additional custom colors beyond the base palette */
  customColors?: Record<string, string>;
}

/**
 * Default brand configs per industry — derived from taxonomy/industries/*.md palettes.
 * Claude uses these as starting points, then overrides with user-provided values.
 */
export const industryDefaults: Record<string, Partial<BrandConfig>> = {
  health: {
    colors: { background: "#F8F5F1", foreground: "#1a1a1a", primary: "#00897B", secondary: "#4DB6AC", accent: "#FF7043" },
    typography: { displayFont: "Inter", bodyFont: "Inter" },
    borderRadius: "16px",
    style: "modern",
  },
  saas: {
    colors: { background: "#FAFAFA", foreground: "#111827", primary: "#6366F1", secondary: "#818CF8", accent: "#F59E0B" },
    typography: { displayFont: "Inter", bodyFont: "Inter" },
    borderRadius: "12px",
    style: "modern",
  },
  fintech: {
    colors: { background: "#FFFFFF", foreground: "#111827", primary: "#1E40AF", secondary: "#3B82F6", accent: "#059669" },
    typography: { displayFont: "Inter", bodyFont: "Inter" },
    borderRadius: "8px",
    style: "modern",
  },
  legal: {
    colors: { background: "#FFFFFF", foreground: "#1C1917", primary: "#44403C", secondary: "#78716C", accent: "#0369A1" },
    typography: { displayFont: "Inter", bodyFont: "Inter" },
    borderRadius: "4px",
    style: "minimalistic",
  },
  ecommerce: {
    colors: { background: "#FFFFFF", foreground: "#18181B", primary: "#18181B", secondary: "#3F3F46", accent: "#F59E0B" },
    typography: { displayFont: "Inter", bodyFont: "Inter" },
    borderRadius: "12px",
    style: "modern",
  },
  creative: {
    colors: { background: "#070809", foreground: "#f3efe8", primary: "#4A78FF", secondary: "#6C8CFF", accent: "#FF9447" },
    typography: { displayFont: "Inter", bodyFont: "Inter", monoFont: "JetBrains Mono" },
    borderRadius: "0px",
    style: "futuristic",
  },
  services: {
    colors: { background: "#0a1628", foreground: "#f8fafc", primary: "#3B82F6", secondary: "#1E40AF", accent: "#FBBF24" },
    typography: { displayFont: "Inter", bodyFont: "Inter" },
    borderRadius: "12px",
    style: "modern",
  },
  hospitality: {
    colors: { background: "#FDF8F4", foreground: "#292524", primary: "#92400E", secondary: "#B45309", accent: "#DC2626" },
    typography: { displayFont: "Inter", bodyFont: "Inter" },
    borderRadius: "12px",
    style: "organic",
  },
};

/** Merge user overrides with industry defaults */
export function resolveBrandConfig(
  industry: string,
  overrides: Partial<BrandConfig> & { name: string }
): BrandConfig {
  const defaults = industryDefaults[industry] ?? industryDefaults.saas;
  return {
    name: overrides.name,
    tagline: overrides.tagline,
    logoPath: overrides.logoPath,
    colors: { ...defaults.colors!, ...overrides.colors },
    typography: { ...defaults.typography!, ...overrides.typography },
    borderRadius: overrides.borderRadius ?? defaults.borderRadius ?? "12px",
    style: overrides.style ?? defaults.style ?? "modern",
    gradientDirection: overrides.gradientDirection,
    customColors: overrides.customColors,
  } as BrandConfig;
}
