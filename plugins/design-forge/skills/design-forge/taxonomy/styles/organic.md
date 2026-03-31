# Style: Organic

## Characteristics

Rounded, warm, nature-inspired. Soft curves, earthy colors, flowing shapes. Biophilic design — the interface feels alive and natural. Think Headspace, Calm, sustainable brands.

## Visual Signature

- **Border radius**: `rounded-2xl` to `rounded-3xl` (16-24px) — pill-like, flowing
- **Colors**: earth tones — sage green, warm beige, terracotta, sky blue
- **Shadows**: soft, warm-toned — `rgba(139, 90, 43, 0.08)` instead of black-based
- **Shapes**: organic blobs, wavy dividers (SVG), circular elements
- **Backgrounds**: subtle texture (paper, linen) or warm gradients
- **Borders**: rarely used — depth via shadows and color contrast

## Color Palettes

### Warm Earth
- Background: `#FAF7F2` (warm white)
- Foreground: `#3D3929` (warm brown-black)
- Primary: `#5B8C5A` (sage green)
- Secondary: `#F0E6D3` (sand)
- Accent: `#C67B4B` (terracotta)

### Cool Nature
- Background: `#F0F7F4` (mint white)
- Foreground: `#1A2E2A` (deep green-black)
- Primary: `#2D8B7A` (ocean teal)
- Secondary: `#E8F0EC` (light sage)
- Accent: `#E8985A` (warm amber)

## Depth System

Soft, warm shadows — never harsh:

```css
--shadow-organic-1: 0 2px 8px rgba(139, 90, 43, 0.06);
--shadow-organic-2: 0 4px 16px rgba(139, 90, 43, 0.08);
--shadow-organic-3: 0 8px 24px rgba(139, 90, 43, 0.10);
```

## Buttons

- Pill-shaped: `rounded-full`
- Solid fill with earthy primary color
- Hover: slight darken + subtle scale (1.02)
- No sharp edges anywhere
- Icon buttons: circular

## Cards

- Large border radius (`rounded-2xl`)
- Warm shadow (brown-tinted, not gray)
- Generous padding (`p-8`)
- Optional: wavy top/bottom edge using SVG clip-path

## Animation

**Intensity: gentle**
- Duration: 0.4-0.8s
- Easing: spring physics (`mass: 1, damping: 20, stiffness: 100`) — bouncy but controlled
- Scroll: fade-up reveals with organic easing
- Hover: gentle scale + shadow lift
- Loading: breathing pulse (scale 1.0 → 1.02 → 1.0)

## Typography

- Display: rounded sans-serif (Nunito, Poppins, Quicksand)
- Body: comfortable sans-serif at 16-18px
- Line-height: generous (1.7-1.8)
- Weight: medium (500) for most text — not too heavy, not too light
- No uppercase labels — organic style avoids rigidity

## Decorative Elements

- SVG blob shapes as section dividers
- Subtle grain/texture overlay (CSS noise filter)
- Circular image crops instead of square
- Wave patterns for section transitions
- Leaf/nature illustrations as accents (optional)

## When to Use

- Health and wellness (alternative to clinical modern)
- Meditation, mindfulness apps
- Sustainable/eco brands
- Children's education platforms
- Any project wanting "warm and approachable"
