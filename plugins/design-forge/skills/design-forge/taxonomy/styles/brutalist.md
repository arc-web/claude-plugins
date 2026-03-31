# Style: Brutalist

## Characteristics

Raw, deliberate, anti-aesthetic. Thick borders, stark contrasts, visible structure. The design doesn't hide its construction — it celebrates it. Think Craigslist meets art gallery.

## Visual Signature

- **Border radius**: `rounded-none` — always square
- **Borders**: 2-4px solid black — heavy, visible
- **Shadows**: offset box-shadow (`4px 4px 0 #000`) — not soft, graphic
- **Colors**: high contrast — black, white, one accent (often yellow or red)
- **Backgrounds**: flat colors, no gradients
- **Typography**: oversized, often monospace or display fonts
- **Layout**: visible grid, asymmetric, intentionally "broken" alignment

## Depth System: Offset Shadows

No blur, no soft shadows. Depth comes from hard offset:

```css
.brutalist-card {
  border: 3px solid #000;
  box-shadow: 6px 6px 0 #000;
  background: #fff;
}

.brutalist-card:hover {
  transform: translate(-2px, -2px);
  box-shadow: 8px 8px 0 #000;
}

.brutalist-card:active {
  transform: translate(2px, 2px);
  box-shadow: 2px 2px 0 #000;
}
```

## Buttons

- Thick border, no border-radius
- Hard offset shadow
- Hover: translate up-left, shadow grows
- Active: translate down-right, shadow shrinks (press effect)
- Background: flat accent color or black

## Typography

- Display: oversized (3-6rem), often ALL CAPS
- Body: monospace or simple sans-serif
- Weight extremes: very bold headlines, normal body
- No tracking adjustments — raw
- Sometimes: rotated text, overlapping text, broken layouts

## Animation

**Intensity: moderate but unconventional**
- Movements are snappy, not smooth
- Easing: `steps()` or linear — no organic curves
- Effects: glitch, shake, hard cut (not fade)
- Hover: instant state change, no transition
- Or: deliberately slow, exaggerated transitions (making a point)

## When to Use

- Art galleries, experimental projects
- Underground/indie brands
- Developer blogs that want personality
- Intentional anti-design statements
- NOT for: any business that needs to appear "professional" or trustworthy
