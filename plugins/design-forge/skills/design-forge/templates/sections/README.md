# Section Templates

Composable page sections decomposed from premium reference sites (Apple MacBook Pro, Google Gemini). Each section is a self-contained component that accepts `animationIntensity` from the taxonomy routing system.

## Architecture

```
sections/
├── _shared/            Shared types, hooks, utilities
├── heroes/             Full-viewport opening sections
├── showcases/          Feature/capability display sections
├── metrics/            Numbers, stats, comparisons
├── media/              Video, image, parallax sections
├── social-proof/       Testimonials, logos, trust signals
├── content/            FAQ, demos, documentation
└── ctas/               Call-to-action closing sections
```

## Shared Contract

Every section extends `SectionBaseProps`:

```typescript
interface SectionBaseProps {
  id?: string                                // Anchor link + aria-labelledby
  animationIntensity?: AnimationIntensity     // "minimal" | "gentle" | "moderate" | "expressive"
  className?: string                         // Additional CSS classes
  background?: ReactNode                     // Background decoration slot
}
```

## Animation Intensity Levels

| Level | Duration | Scroll Effects | Use When |
|-------|----------|---------------|----------|
| `minimal` | 0.2s | Disabled | Legal, fintech — zero distraction |
| `gentle` | 0.45s | Enabled | Health, education — builds trust |
| `moderate` | 0.6s | Enabled | SaaS, ecommerce — guides attention |
| `expressive` | 0.85s | Enabled | Creative, portfolio — makes a statement |

All sections respect `prefers-reduced-motion: reduce` — animations degrade to instant display.

## Composing Pages

Stack sections in JSX to compose full pages:

```tsx
import { GradientHeadlineHero } from "./sections/heroes/gradient-headline-hero"
import { FeatureCardGrid } from "./sections/showcases/feature-card-grid"
import { CounterBar } from "./sections/metrics/counter-bar"
import { GradientCTA } from "./sections/ctas/gradient-cta"
import { SectionDivider } from "./sections/_shared/section-divider"

export default function LandingPage() {
  const intensity = "moderate" // From taxonomy routing

  return (
    <main>
      <GradientHeadlineHero animationIntensity={intensity} ... />
      <SectionDivider variant="gradient-fade" />
      <FeatureCardGrid animationIntensity={intensity} ... />
      <CounterBar animationIntensity={intensity} ... />
      <SectionDivider variant="gradient-fade" />
      <GradientCTA animationIntensity={intensity} ... />
    </main>
  )
}
```

## Taxonomy Integration

The `index.json` mappings recommend sections by industry/platform/style:

```json
"sections": {
  "heroes": ["gradient-headline-hero"],
  "showcases": ["feature-card-grid", "capabilities-bento"],
  "metrics": ["counter-bar"],
  "ctas": ["gradient-cta"]
}
```

## Section Catalog

### Heroes
| Template | Source | Pattern |
|----------|--------|---------|
| `gradient-headline-hero` | Gemini | Gradient bg + headline + CTAs |
| `product-reveal-hero` | Apple | Canvas image sequence + staged entrance |
| `split-media-hero` | General | Text left + parallax media right |

### Showcases
| Template | Source | Pattern |
|----------|--------|---------|
| `feature-card-grid` | Gemini | Icon cards + hover + stagger |
| `capabilities-bento` | Gemini | Mixed-size capability grid |
| `pinned-timeline-showcase` | Apple | Pinned section + timeline scrub |
| `image-sequence-scroll` | Apple | Canvas frame-by-frame on scroll |

### Metrics
| Template | Source | Pattern |
|----------|--------|---------|
| `counter-bar` | Apple | Animated counters on viewport entry |
| `spec-comparison` | Apple | Side-by-side spec grid |
| `stats-showcase` | General | Static numbers (fintech/legal) |

### Media
| Template | Source | Pattern |
|----------|--------|---------|
| `video-scroll-reveal` | Apple | Scroll-driven clip-path/opacity |
| `full-bleed-media` | Gemini | Edge-to-edge + overlay text |
| `parallax-layers` | Apple | Multi-depth parallax |

### Social Proof
| Template | Source | Pattern |
|----------|--------|---------|
| `testimonial-carousel` | General | Quote carousel + avatars |
| `logo-marquee` | General | Infinite scroll logos |
| `trust-signals` | General | Badges + certifications |

### Content
| Template | Source | Pattern |
|----------|--------|---------|
| `faq-accordion` | Gemini | Expandable Q&A |
| `interactive-demo` | Gemini | Iframe playground |
| `sticky-sidebar-content` | General | TOC tracking docs |

### CTAs
| Template | Source | Pattern |
|----------|--------|---------|
| `gradient-cta` | Gemini | Gradient bg + CTAs |
| `product-options-cta` | Apple | Product cards + pricing |
| `newsletter-cta` | General | Email capture |
