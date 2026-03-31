# Industry: Legal & Professional Services

## Design Philosophy

Legal platforms prioritize **readability, formality, and content hierarchy**. The interface should feel like a well-organized document — clean, structured, authoritative. Decoration is minimal; typography does the work.

## Color Palettes

### Light Mode
- Background: `#FFFFFF` (pure white)
- Foreground: `#1C1917` (stone-900)
- Primary: `#44403C` (stone-700) or `#292524` (stone-800) — muted authority
- Secondary: `#F5F5F4` (stone-100)
- Accent: `#0369A1` (sky-700) — for links and interactive elements only
- Destructive: `#B91C1C` (red-700)

### Dark Mode
- Background: `#1C1917` (stone-900)
- Card: `#292524` (stone-800)
- Primary: `#A8A29E` (stone-400)
- Accent: `#38BDF8` (sky-400)

## Typography

- Display: serif (Merriweather, Lora, or Georgia) — authority
- Body: Inter or system sans-serif at 16px — readability
- Mono: for case numbers, document IDs
- Line-height: 1.7 for body text (long reading)
- Paragraph max-width: `max-w-prose` (65ch)

## Animation Guidelines

**Intensity: minimal**
- Duration: 0.15-0.25s
- Only: page transitions (simple fade), button ripple
- No scroll effects, no stagger, no counters
- Content loads instantly — no reveal animations

## Depth Strategy: CSS Layers (Flat)

- Cards: `border` only, no shadow (or `shadow-xs` maximum)
- Border radius: `rounded-sm` (2-4px) — formal, not playful
- Modals: simple fade overlay
- No glass effects, no blur

## shadcn Augmentation (Legal)

- Components used near-stock with minimal augmentation
- `ScrollProgress`: useful for long documents (only Design Forge component recommended)
- `Table`: clean borders, no animation, dense spacing
- `Button`: solid, no gradient, `rounded-sm`
