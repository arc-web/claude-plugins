# Asset Generation Reference Guide

Comprehensive reference for Design Forge's programmatic asset generation pipeline. Generate branded images, videos, PDFs, and more using code instead of Figma or MidJourney.

## Pipeline Architecture

Three rendering pipelines, one Sharp output:

```
Pipeline 1 (Fastest — no browser):
  JSX Template → Satori → SVG → @resvg/resvg-js → PNG → Sharp → optimized output

Pipeline 2 (Full CSS — browser required):
  HTML/CSS Template → Playwright screenshot → PNG → Sharp → optimized output

Pipeline 3 (Generative — no browser):
  Draw function → @napi-rs/canvas → PNG → Sharp → optimized output
```

## When to Use Which Pipeline

| Scenario | Pipeline | Why |
|----------|----------|-----|
| Social cards, OG images | Satori | Fast (10ms), deterministic, no browser |
| Complex CSS layouts, CSS Grid | Playwright | Full CSS support, any layout |
| Generative art, noise gradients | @napi-rs/canvas | Canvas 2D API, pixel-level control |
| Device mockups from URL | Playwright + Sharp | Need browser to screenshot the URL |
| Device mockups from image | Sharp only | Just compositing, no browser needed |
| Data visualizations | D3.js → Satori or Playwright | SVG output from D3, then rasterize |
| PDF documents | @react-pdf/renderer | React component model for layouts |
| Video/GIF | Motion Canvas or Remotion | Frame-by-frame rendering |

## Library Quick Reference

### Tier 1: Core (always install)

**Sharp** — Image manipulation powerhouse
```bash
pnpm add sharp
```
- Resize, crop, composite, rotate, blur, sharpen
- Format conversion: PNG, WebP, AVIF, JPEG, GIF, TIFF
- 54M weekly downloads, libvips-backed (8x faster than WASM)
- Key methods: `sharp(input).resize().composite([]).toFile()`

**Satori** — JSX to SVG without a browser
```bash
pnpm add satori @resvg/resvg-js
```
- Converts React JSX to SVG string
- Supports: flexbox, custom fonts, text wrapping, images
- Does NOT support: CSS Grid, animations, pseudo-elements
- Key: `satori(jsx, { width, height, fonts })`

### Tier 2: Per use case

**@napi-rs/canvas** — Fastest Canvas API for Node.js
```bash
pnpm add @napi-rs/canvas
```
- Skia-backed, zero system dependencies
- 68 ops/s benchmark (faster than node-canvas)
- Full Canvas 2D API: paths, gradients, text, images
- Key: `createCanvas(w, h).getContext('2d')`

**Playwright** — Full CSS screenshots
```bash
pnpm add playwright
npx playwright install chromium
```
- 3ms warm screenshot time (fastest browser automation)
- Full CSS: Grid, animations, custom fonts, media queries
- Also generates PDFs with full CSS fidelity
- Key: `page.screenshot({ type: 'png' })`

### Tier 3: Video/Animation

**Motion Canvas** (MIT, free)
```bash
npm create @motion-canvas@latest
```
- TypeScript generator-function API
- Real-time Vite preview
- Export to frames → FFmpeg to video

**Remotion** (commercial license required)
```bash
npx create-video@latest
```
- React components as video
- Baked-in FFmpeg in v4
- Lambda rendering for cloud

## BrandConfig Integration

Every asset template reads from BrandConfig, which is populated from taxonomy industry files:

```typescript
import { resolveBrandConfig } from './shared/brand-config';

// Auto-fills colors, typography, style from taxonomy
const brand = resolveBrandConfig('services', {
  name: 'Spark Electric',
  tagline: 'Powering your home safely',
  // Override specific colors if needed
  colors: { accent: '#FFD700' },
});

// brand.colors.primary → "#3B82F6" (from services.md)
// brand.colors.accent → "#FFD700" (overridden)
// brand.typography.displayFont → "Inter"
// brand.borderRadius → "12px"
// brand.style → "modern"
```

## Size Presets

All sizes available in `shared/size-presets.ts`:

**Social Media** (13 sizes):
instagram-post (1080×1080), instagram-story (1080×1920), twitter-post (1200×675), linkedin-post (1200×627), facebook-post (1200×630), youtube-thumbnail (1280×720), pinterest-pin (1000×1500), and more.

**Web** (9 sizes):
og-image (1200×630), hero-desktop (1920×1080), hero-mobile (750×1334), feature-image (800×600), email-header (600×200), favicon (512×512), and more.

**Print** (5 sizes):
business-card (1050×600 @300dpi), a4-portrait (2480×3508), letter-portrait (2550×3300), and more.

## Common Recipes

### Generate OG image for a blog post
```typescript
import { renderWithSatori } from './shared/image-pipeline';
import { loadFonts } from './shared/satori-fonts';
import { OgImageTemplate } from './og-image/og-image-satori';
import { resolveBrandConfig } from './shared/brand-config';

const brand = resolveBrandConfig('saas', { name: 'My App' });
const fonts = await loadFonts(['Inter']);

await renderWithSatori({
  jsx: OgImageTemplate({ brand, title: 'How We Scaled to 1M Users', tag: 'Engineering' }),
  width: 1200, height: 630, fonts,
  outputPath: './public/og/scaled-to-1m.png',
});
```

### Generate social media kit
```bash
npx tsx templates/assets/social-media-kit/generate.ts \
  --brand "Spark Electric" \
  --industry services \
  --headline "24/7 Emergency Electrical Service" \
  --body "Licensed electricians at your door in 30 minutes" \
  --variant announcement
```

### Generate device mockup from screenshot
```bash
npx tsx templates/assets/device-mockup/generate.ts \
  --image ./screenshot.png \
  --device macbook \
  --output ./mockup.png
```

### Generate generative background
```bash
npx tsx templates/assets/generative-background/generate.ts \
  --preset constellation \
  --colors "#6366f1,#a855f7" \
  --width 1920 --height 1080 \
  --output ./hero-bg.png
```

### Generate hero image with gradient mesh
```bash
npx tsx templates/assets/website-hero/generate.ts \
  --style gradient \
  --colors "#4a78ff,#9333ea,#ff9447" \
  --width 1920 --height 1080 \
  --output ./hero.png
```

## Satori CSS Subset

Satori only supports these CSS properties (use inline styles, not Tailwind):

**Layout**: display (flex only), flexDirection, flexWrap, alignItems, justifyContent, gap, padding, margin, width, height, minWidth, maxWidth, position, top/right/bottom/left, overflow

**Typography**: fontSize, fontWeight, fontFamily, fontStyle, textAlign, textTransform, letterSpacing, lineHeight, textDecoration, textOverflow, whiteSpace

**Visual**: color, backgroundColor, backgroundImage (linear-gradient, radial-gradient, url), border, borderRadius, opacity, boxShadow, transform

**NOT supported**: CSS Grid, animations, transitions, pseudo-elements, media queries, calc(), clamp(), var()

## Performance Tips

1. **Reuse font buffers** — `loadFonts()` caches internally, but call once per script run
2. **Batch Sharp operations** — pipeline multiple images through one Sharp instance
3. **Use WebP for web** — 25-35% smaller than PNG with no quality loss
4. **Skip Playwright when possible** — Satori is 10x faster for structured layouts
5. **DPR cap at 2x** — higher DPR doubles file size with no perceptible quality gain on most screens
