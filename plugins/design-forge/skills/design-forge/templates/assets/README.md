# Asset Generation Templates

Programmatic asset generation pipeline for Design Forge. Generate branded social media posts, OG images, device mockups, and more using code — no Figma or MidJourney needed.

## Pipeline Selection Guide

| Need | Pipeline | Speed | CSS Support | Browser? |
|------|----------|-------|-------------|----------|
| Social cards, OG images | Satori → resvg → Sharp | **~10ms** | Flexbox only | No |
| Full CSS layouts | Playwright → Sharp | ~50ms warm | Full CSS | Yes |
| Generative art | @napi-rs/canvas → Sharp | **~5ms** | Canvas API | No |
| Sketch style | Rough.js → canvas → Sharp | ~8ms | Canvas API | No |
| Data visualizations | D3.js → Satori/Playwright | Varies | SVG | Optional |
| PDF documents | @react-pdf/renderer | Medium | React subset | No |
| Video/GIF | Motion Canvas or Remotion | Slow | React | Yes |

## Quick Start

```bash
# Install core dependencies
pnpm add satori @resvg/resvg-js sharp

# Generate an OG image
npx tsx templates/assets/og-image/generate.ts --title "My Post" --brand "Acme"

# Generate a social media kit
npx tsx templates/assets/social-media-kit/generate.ts \
  --brand "Spark Electric" \
  --industry services \
  --headline "24/7 Emergency Service" \
  --variant announcement
```

## Asset Types

### OG Image (`og-image/`)
1200×630 OpenGraph image for link previews. Satori JSX template + HTML variant.

### Social Media Kit (`social-media-kit/`)
Batch generates branded images for all major platforms:
- Instagram Post (1080×1080)
- Instagram Story (1080×1920)  
- Twitter/X Post (1200×675)
- LinkedIn Post (1200×627)
- Facebook Post (1200×630)
- YouTube Thumbnail (1280×720)

Post variants: `announcement`, `quote`, `stat`, `tip`

### Generative Background (`generative-background/`)
Renders Design Forge canvas presets (grid-field, wave-field, constellation, etc.) to static PNG via @napi-rs/canvas. Uses existing DrawFunction factories.

### Device Mockup (`device-mockup/`)
Composite screenshots into device frames (iPhone, MacBook, iPad) using Sharp. Accepts URL (via Playwright screenshot) or local image.

### Quality Showcase (`quality-showcase/`)
Apple-style "zoom bubble" showcasing screen quality. Extracts regions, magnifies, adds annotations.

### Website Hero (`website-hero/`)
Generate hero images: gradient meshes (Satori), geometric patterns (@napi-rs/canvas), hand-drawn style (Rough.js).

### Data Visualization (`data-visualization/`)
D3.js chart cards and infographics rendered to static images.

### Animated Explainer (`animated-explainer/`)
Video content via Motion Canvas (MIT, free) or Remotion (commercial). Includes starter projects.

### Print Materials (`print-materials/`)
Business one-pagers and brochures via @react-pdf/renderer.

## BrandConfig

Every asset template accepts a `BrandConfig` populated from the taxonomy:

```typescript
const brand: BrandConfig = {
  name: "Spark Electric",
  tagline: "Powering your home safely",
  colors: {
    background: "#0a1628",
    foreground: "#f8fafc",
    primary: "#3B82F6",
    secondary: "#1E40AF",
    accent: "#FBBF24",
  },
  typography: { displayFont: "Inter", bodyFont: "Inter" },
  borderRadius: "12px",
  style: "modern",
};
```

Industry defaults are built-in. Override specific values as needed:
```typescript
import { resolveBrandConfig } from "./shared/brand-config";
const brand = resolveBrandConfig("services", { name: "Spark Electric", colors: { accent: "#FFD700" } });
```

## Library Stack

### Always Installed (~25MB)
- **Sharp** (54M DL/wk) — Resize, composite, format conversion
- **Satori** (912K DL/wk) — JSX → SVG, no browser needed
- **@resvg/resvg-js** (800K DL/wk) — SVG → PNG rasterization

### Install Per Use Case
- **@napi-rs/canvas** (8.2M DL/wk) — Canvas 2D, generative backgrounds
- **Playwright** (41M DL/wk) — HTML screenshots, device mockups
- **Motion Canvas** (MIT, free) — Video/animation generation
- **@react-pdf/renderer** (2.3M DL/wk) — PDF documents
- **Rough.js** — Hand-drawn sketch style
- **D3.js** — Data visualizations
