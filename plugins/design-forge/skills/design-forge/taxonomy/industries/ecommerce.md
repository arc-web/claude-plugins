# Industry: E-Commerce & Marketplace

## Design Philosophy

E-commerce is **product-focused and conversion-driven**. Images are the hero. The design should frame products beautifully, make browsing feel fast, and guide users toward purchase with clear visual hierarchy.

## Color Palettes

### Light Mode
- Background: `#FFFFFF` (pure white) — products need clean backdrop
- Foreground: `#18181B` (zinc-900)
- Primary: `#18181B` (black) or brand-specific — CTA buttons stand out against white
- Secondary: `#F4F4F5` (zinc-100)
- Accent: `#F59E0B` (amber) — sale badges, promotions
- Success: `#16A34A` (green-600) — in stock, discount applied
- Destructive: `#DC2626` — out of stock, removal

### Dark Mode
- Background: `#09090B` (zinc-950)
- Card: `#18181B` (zinc-900)
- Primary: `#FAFAFA` (zinc-50)
- Accent: `#FBBF24` (amber-400)

## Typography

- Display: brand font or Inter — headlines should feel editorial
- Body: Inter at 14-16px
- Price: Semi-bold, slightly larger than body, tabular-nums
- Sale price: colored (destructive for original, success for discounted)

## Animation Guidelines

**Intensity: moderate**
- Duration: 0.4-0.6s
- Product card hover: scale(1.02) + shadow lift — quick, inviting
- Grid reorder: GSAP Flip (filter/sort transitions)
- Image gallery: shared layout animation (Framer Motion)
- Cart: slide-in sheet with spring physics
- Stagger: 0.06s for product grid load

**Do:** Hover effects on product cards, smooth cart transitions, image zoom
**Don't:** Pin sections in product listings, use canvas backgrounds, custom cursors

## Depth Strategy: CSS Layers

- Product cards: `shadow-sm` → `shadow-lg` on hover with scale
- Image containers: zero shadow (clean crop)
- Cart/checkout: elevated with stronger shadow
- Modal (quick view): spring-physics open with backdrop blur

## shadcn Augmentation (E-Commerce)

- `Card`: Hover scale + shadow lift, image-first layout
- `Badge`: Pulse for "Sale" / "New" / "Limited", accent-colored
- `Button`: Solid dark primary (high contrast against white), subtle hover darken
- `Sheet`: Spring-physics cart drawer
- `Dialog`: Quick-view product modal with image gallery
- GSAP Flip: product grid reorder on filter/sort changes
