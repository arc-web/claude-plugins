# Style: Glassmorphism

## Characteristics

Frosted glass panels, backdrop blur, translucent layers creating visual depth. The layered transparency gives a sense of spatial hierarchy without heavy shadows. Think macOS Big Sur, iOS Control Center.

## Visual Signature

- **Border radius**: `rounded-xl` to `rounded-2xl` (12-20px)
- **Blur**: `backdrop-blur-lg` (16px) to `backdrop-blur-xl` (24px)
- **Background**: semi-transparent — `bg-white/60` (light) or `bg-slate-900/60` (dark)
- **Borders**: subtle white border — `border border-white/20`
- **Shadows**: soft, spread — `shadow-xl` with low opacity
- **Saturation**: `backdrop-saturate-150` for vibrancy through glass

## Glass Panel Recipe

```css
/* Light mode */
.glass-light {
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(16px) saturate(150%);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
}

/* Dark mode */
.glass-dark {
  background: rgba(15, 23, 42, 0.6);
  backdrop-filter: blur(16px) saturate(120%);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}
```

## Depth System

Glassmorphism creates depth through blur levels, not shadows:

1. **Background**: full blur, lowest opacity — `bg-white/30 backdrop-blur-xl`
2. **Midground**: medium blur — `bg-white/50 backdrop-blur-lg`
3. **Foreground**: light blur or none — `bg-white/80 backdrop-blur-sm`
4. **Interactive**: solid or near-solid — `bg-white/90`

Each layer has a slightly different transparency, creating depth through the stacking.

## Buttons

- Primary: glass with stronger background — `bg-primary/90 backdrop-blur-sm`
- Hover: increase opacity + subtle glow (`ring-2 ring-primary/20`)
- Or: gradient buttons work well over glass panels (creates visual anchor)

## Cards

- Glass panel with border highlight on top/left edge (light reflection)
- Hover: increase background opacity slightly + subtle lift
- Inner content has full opacity text
- Radial gradient accent glow (optional) — `GlassPanel` component handles this

## Performance Warning

`backdrop-filter` is GPU-intensive. Guidelines:
- Limit to 3-5 glass panels visible simultaneously
- Never use on scrolling list items (use solid background)
- Test on mid-range devices — blur can cause jank
- Fallback for browsers without support: solid semi-transparent background
- Avoid stacking glass panels (blur compounding = performance death)

## When to Use

- SaaS dashboards (sidebar + modal overlays)
- Creative portfolios (the existing control room aesthetic)
- Landing page overlays (pricing cards over hero)
- Stat cards over colorful/image backgrounds
- NOT for: data-dense tables, legal, fintech (readability concerns)
