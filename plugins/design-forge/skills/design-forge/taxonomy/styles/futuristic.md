# Style: Futuristic (Control Room)

## Characteristics

This is Design Forge's original aesthetic — the "control room" from Next.js Conf patterns. Near-black backgrounds, cream text, monospace labels, scanline overlays, sharp corners. Think mission control, cyberpunk dashboards, terminal interfaces.

## Visual Signature

- **Border radius**: `rounded-none` (0px) — deliberately sharp, industrial
- **Backgrounds**: `#070809` (near-black) with grid/particle canvas overlays
- **Text**: `#F3EFE8` (cream) — warmer than pure white
- **Accents**: blue `#4A78FF`, green `#7DE58D`, orange `#FF9447`
- **Borders**: `rgba(255,255,255,0.08)` — barely visible grid lines
- **Labels**: 10px uppercase, `letter-spacing: 0.08em`, 50% opacity

## Design Forge Components (All Available)

This style uses the FULL Design Forge component set:
- `GenerativeCanvas` with all presets (grid-field, orbital-ellipses, point-cloud, particle-system)
- `GlassPanel` at `blur(28px) saturate(120%)`
- `CustomCursor` with contextual labels
- `Scanlines` overlay (4px repeating, 18% opacity)
- `Typewriter` for dramatic text reveals
- `HeroScene` for Three.js environments
- `SoundLayer` for ambient audio (opt-in)
- `ScrollProgress` with glow dot
- `HoverCardCanvas` for interactive cards

## Typography

- Body: Instrument Sans or Geist Sans
- Labels/UI: IBM Plex Mono or Geist Mono
- Display: character-forward fonts (avoid generic sans-serif)
- Numbering: two-digit padded (01, 02, 03)
- Labels pattern: `<span class="text-[10px] uppercase tracking-[0.08em] opacity-50 font-mono">LABEL</span>`

## Depth System: Glassmorphism + Canvas

- Hero: canvas preset background (grid-field or particle-system)
- Content panels: glassmorphism over canvas
- Scanlines overlay on top of everything (CSS `::after`)
- Glass blur: `blur(28px) saturate(120%)` + gradient top-to-bottom

## Buttons

- Scale + lift: `scale(1.02) translateY(-0.08rem)` on hover
- Border: colored on hover (bracket effect for links)
- No rounded corners
- Transition: 200ms

## Scroll Behavior

Full `apple-showcase` choreography:
- GSAP ScrollTrigger pinning
- SplitText character reveals
- Horizontal galleries via containerAnimation
- Parallax depth layers

## Reference

See `references/nextjs-conf-patterns.md` for the complete Geist design system specification.
See `references/design-patterns.md` for CSS recipes using this aesthetic.

## When to Use

- Creative portfolios and agency sites
- Developer tools and technical products
- Interactive experiences and demos
- Any project where "wow factor" is the goal
- NOT for: health, legal, fintech, conservative brands
