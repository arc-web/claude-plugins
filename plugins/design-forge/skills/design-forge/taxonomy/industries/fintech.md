# Industry: Fintech & Financial Services

## Design Philosophy

Finance demands **precision, trust, and restraint**. Users are managing money — every interaction must feel reliable. Minimal animation, maximum clarity. Data tables and charts are the hero elements, not visual effects.

## Color Palettes

### Light Mode
- Background: `#FFFFFF` (pure white) or `#F9FAFB` (gray-50)
- Foreground: `#111827` (gray-900)
- Primary: `#1E40AF` (blue-800) — institutional trust
- Secondary: `#F3F4F6` (gray-100)
- Accent: `#059669` (emerald) — for positive values, gains
- Destructive: `#DC2626` (red-600) — for losses, alerts
- Warning: `#D97706` (amber-600)

### Dark Mode
- Background: `#111827` (gray-900)
- Card: `#1F2937` (gray-800)
- Primary: `#3B82F6` (blue-500)
- Positive: `#34D399` (emerald-300)
- Negative: `#F87171` (red-300)

## Typography

- Display: Inter — clean, institutional
- Body: Inter at 14px — dense but readable
- Mono: `tabular-nums` variant — critical for aligned number columns
- Tables: 13px body, tight line-height (1.4)

## Animation Guidelines

**Intensity: minimal**
- Duration: 0.15-0.3s
- Easing: `ease-out`
- No scroll effects beyond basic fade
- Counter animations for key metrics only (portfolio value, P&L)
- No stagger on tables (instant render)

**Do:** Smooth number transitions, subtle row highlights, toast notifications
**Don't:** Pin sections, use canvas, custom cursors, magnetic effects, parallax

## Depth Strategy: CSS Layers (Minimal)

- Cards: `shadow-sm` base, no hover lift (stability feels intentional)
- Active row: slight background tint, no animation
- Modals: simple fade, no spring physics
- Tables: sticky header with subtle border-bottom, no glass effect

## shadcn Augmentation (Fintech)

- `Table`: Sticky header, `tabular-nums` for number columns, alternating row tints
- `Card`: Minimal shadow, colored left-border for status (green=positive, red=negative)
- `Badge`: Static, no animation — used for transaction status
- `Chart`: Animated counter for totals, domain-colored series (green=gain, red=loss)
- `Button`: Solid fills, no gradients, no magnetic hover
