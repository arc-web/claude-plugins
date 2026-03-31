# Style: Minimalistic

## Characteristics

Extreme restraint. Typography-driven. Near-zero decoration. Content is the design. Think Notion, iA Writer, Medium's reading view.

## Visual Signature

- **Border radius**: `rounded-sm` to `rounded-md` (2-6px) — deliberate, not playful
- **Shadows**: none or `shadow-xs` only — flatness is intentional
- **Colors**: 2-3 max — background, foreground, one accent
- **Gradients**: none
- **Whitespace**: maximum — content breathes
- **Borders**: thin, low-contrast (`border-gray-200`)
- **Icons**: line-style only, never filled

## Depth System

Minimal depth. Hierarchy comes from typography weight and spacing, not shadows.

- Cards: border only, no shadow
- Active elements: subtle background tint (gray-50/gray-100)
- Modals: simple overlay, no blur
- Hover: background tint, not lift

## Buttons

- Primary: solid background, no gradient
- No shadow, no lift on hover
- Hover: darken/lighten background by one step
- Padding: minimal, text-tight
- Some designs use text-only buttons with underline

## Cards

- Border only (no shadow)
- Minimal padding (`p-4`)
- No hover effects or very subtle (background tint)
- Clear content hierarchy through typography alone

## Typography

- This is the hero of minimalistic design
- Headlines: regular or medium weight (not bold) — counter-intuitive but intentional
- Body: comfortable 16-18px, generous line-height (1.7-1.8)
- Max-width: `max-w-prose` (65ch) for readability
- Serif options work well here (Merriweather, Lora)
- Monospace for accents and labels

## Animation

- Duration: 0.15-0.2s — near-instant
- Only: page transitions (opacity), button feedback (background tint)
- No scroll effects, no stagger, no counters, no entrance animations
- Content appears instantly — the absence of animation IS the design statement

## When to Use

- Documentation sites, blogs, reading-focused apps
- Legal platforms (conservative aesthetic)
- Any project where "less is more" is explicit
- When the client says "clean" repeatedly
