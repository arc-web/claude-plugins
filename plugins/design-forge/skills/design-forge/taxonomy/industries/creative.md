# Industry: Creative & Portfolio

## Design Philosophy

Creative projects are where **maximum expression lives**. This is the home of the existing "control room" aesthetic — near-black, scanlines, monospace labels, glassmorphism. All Design Forge components are appropriate. The design IS the product.

## Color Palettes

### Control Room (Default Creative Palette)
- Background: `#070809` (near-black)
- Text: `#F3EFE8` (cream)
- Blue: `#4A78FF` (primary accent, links)
- Green: `#7DE58D` (status, success)
- Orange: `#FF9447` (warning, hover accents)
- Lines: `rgba(255,255,255,0.08)` (borders)

### Alternative: Neon
- Background: `#0A0A0A`
- Primary: `#00FF88` (neon green)
- Accent: `#FF00FF` (magenta)
- Text: `#E0E0E0`

### Alternative: Warm Creative
- Background: `#1A1A2E`
- Primary: `#E94560` (warm red)
- Accent: `#FFD700` (gold)
- Text: `#EAEAEA`

## Typography

- Display: character-forward — avoid Inter, Roboto, system fonts
- Body: Instrument Sans or Geist Sans
- Labels: IBM Plex Mono or Geist Mono, 10px, uppercase, `letter-spacing: 0.08em`, `rgba(255,255,255,0.5)`
- Numbering: two-digit padded (01, 02, 03)

## Animation Guidelines

**Intensity: expressive**
- Duration: 0.5-1.2s
- Easing: `[0.22, 1, 0.36, 1]` (dramatic slow-out)
- Full GSAP ScrollTrigger: pinning, scrubbing, horizontal galleries
- SplitText character/word reveals for headlines
- Canvas backgrounds on all sections
- Custom cursor with contextual labels
- Sound design (opt-in, lazy-loaded)

## Depth Strategy: Three.js Ambient + Glassmorphism

- Hero: Three.js floating geometry or particle field
- Sections: canvas preset backgrounds (grid-field, orbital-ellipses, point-cloud)
- Panels: glassmorphism (`backdrop-blur-[28px] saturate(120%)`)
- Effects: scanlines overlay (4px repeating, 18% opacity)

## Available Components (ALL)

Every Design Forge component is appropriate for creative projects:
- GenerativeCanvas (all 4 presets)
- GlassPanel, ScrollProgress, CustomCursor
- HoverCardCanvas, SoundLayer
- Scanlines, Typewriter
- HeroScene (Three.js)
- All animation templates (GSAP + Framer Motion)
- All interaction templates

## Visual Signatures

- Border-radius: `rounded-none` (0px — deliberately sharp)
- Glassmorphism: `blur(28px) saturate(120%)` + gradient top-bottom
- Buttons: scale + lift on hover (`scale(1.02) translateY(-0.08rem)`)
- Links: bracket effect with colored borders on hover
- Scanlines: 4px repeating, 18% opacity
