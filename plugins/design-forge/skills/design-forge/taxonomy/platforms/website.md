# Platform: Website (Marketing & Landing Pages)

## When This Applies

Marketing sites, landing pages, product showcases, company pages, documentation sites. The user is a visitor, not a daily user. First impression matters. Conversion is the goal.

## Layout Patterns

- **Hero sections**: Full-viewport, centered or split (image+text). Use `hero-centered` or `hero-split` templates.
- **Feature showcases**: Bento grid or feature cards. Alternating left/right image+text sections.
- **Pricing**: Card-based with CTA emphasis on recommended tier.
- **Testimonials**: Masonry grid or carousel.
- **Footer**: Multi-column with CTAs.

## Scroll Behavior

Websites benefit from scroll choreography — each section tells a story as the user scrolls.

**Available presets:**
- `section-fade-sequence` — Sections fade in with stagger. Good for all industries.
- `apple-showcase` — Full-viewport pinned sections with scrubbed timelines. For SaaS, creative.
- `parallax-layers` — Background/foreground depth separation. For creative, ecommerce.
- `horizontal-narrative` — Vertical scroll drives horizontal pan. For creative, portfolios.

**Guidelines:**
- First section loads instantly (no scroll trigger — it's above the fold)
- Subsequent sections trigger on `whileInView` or ScrollTrigger
- Metric counters animate on viewport entry (scroll-counter template)
- Pin sections only when the content justifies it (feature comparison, product specs)

## Animation Intensity

Websites can be more expressive than web apps — visitors see each animation once, not daily.

- SaaS landing: `expressive` — go bold
- Health landing: `gentle` — trust over flash
- Ecommerce landing: `moderate` — product is hero, not animation
- Creative portfolio: `expressive` — maximum expression

## Navigation

- Sticky navbar that compacts on scroll (`useNavbarCompact` hook)
- Mobile: hamburger or bottom sheet
- CTA button always visible in nav

## Performance

- Images: `next/image` with priority on hero, lazy on everything below
- Canvas/Three.js: visibility-gated (only renders when in viewport)
- Fonts: `font-display: swap`, preload critical weights only
- Core Web Vitals: LCP < 2.5s, CLS < 0.1, FID < 100ms

## shadcn Gaps (What Websites Need Beyond shadcn)

shadcn is built for apps, not marketing sites. Websites typically need:
- Hero sections (no shadcn equivalent)
- Scroll-driven animations (no shadcn equivalent)
- Canvas/3D backgrounds (no shadcn equivalent)
- Custom cursor interactions (no shadcn equivalent)
- Animated counters/metrics (no shadcn equivalent)
- Full-viewport section layouts (no shadcn equivalent)

Design Forge fills all of these.
