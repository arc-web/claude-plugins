# shadcn/ui Bridge — What It Provides vs What Design Forge Augments

Design Forge works WITH shadcn components, not instead of them. This doc maps the boundary.

**Principle:** shadcn provides structure and accessibility. Design Forge adds motion and depth.

---

## Component Augmentation Map

| shadcn Component | What shadcn Provides | What Design Forge Adds |
|---|---|---|
| `Button` | Click target, variants (default, destructive, outline, secondary, ghost, link), sizes, disabled state | Gradient fills, scale+lift hover (`scale(1.02) translateY(-2px)`), depth shadow, active press feedback, magnetic hover (creative only) |
| `Card` | Container with Header/Title/Description/Content/Footer, border, shadow-sm | Elevation layers (5-level shadow system), glass effect (`backdrop-blur-lg bg-white/60`), hover canvas background, glow accent border |
| `Badge` | Status/tag indicator, color variants | Animated pulse for live status, domain-color mapping (health: protein=blue, carbs=green), count-up animation |
| `Dialog` / `Sheet` | Modal/drawer with Radix overlay, focus trap, keyboard dismiss | Enter/exit motion (Framer Motion AnimatePresence), backdrop blur, glass panel styling, spring physics |
| `Tabs` | Tab switching, keyboard navigation, ARIA roles | Shared layout animation (underline morph between tabs), content fade transition, scroll-to-tab on mobile |
| `NavigationMenu` | Nav structure, dropdown, keyboard nav | Compact-on-scroll hook (`useNavbarCompact`), bracket hover effect, cursor spotlight |
| `Table` | Data display, header/body/row/cell, sort header | Row entrance stagger, sort animation (GSAP Flip), sticky header with glass effect |
| `Chart` (Recharts) | Bar, line, area, pie, radar charts via Recharts | Glass tooltip overlay, animated entry (bars grow, lines draw), domain-colored series, scroll-triggered reveal |
| `Sidebar` | App navigation, collapsible, mobile responsive | Glass panel background, collapse spring animation, mobile bottom-bar variant |
| `Progress` | Linear progress bar, value/max | Scroll-linked variant, glowing dot at leading edge, gradient fill, animated value label |
| `Accordion` | Expandable sections, keyboard nav | Spring-physics height animation, stagger-open for multiple sections |
| `Avatar` | User image with fallback | Hover scale, presence ring animation, group stack with overlap |
| `Input` / `Textarea` | Form inputs with labels, validation | Focus glow ring, shake on validation error, character count animation |
| `Select` | Dropdown selection | Open/close spring, option hover highlight slide |
| `Toast` / `Sonner` | Notifications | Slide + fade entrance, progress bar for auto-dismiss, stacked layout |

## Design Forge-Only Components (No shadcn Equivalent)

| Component | Purpose | When to Use |
|---|---|---|
| `GenerativeCanvas` | Animated canvas backgrounds with presets | Hero sections, ambient backgrounds, creative projects |
| `CustomCursor` | 3-layer cursor with contextual labels | Portfolio, creative, SaaS landing pages (never in health/legal) |
| `Scanlines` | CRT overlay effect | Futuristic/control room aesthetic only |
| `Typewriter` | Character-cycling text reveal | Headlines, hero sections, creative projects |
| `HeroScene` | Three.js container with telemetry HUD | 3D hero sections, product showcases |
| `SoundLayer` | Ambient audio + hover tones | Portfolio, experimental (always opt-in, never auto-play) |
| `GlassPanel` | Glassmorphism panel | Overlays, sidebars, stat cards (when glassmorphism depth strategy is active) |
| `ScrollProgress` | Fixed progress bar with glow dot | Long-form content, documentation, landing pages |
| `HoverCardCanvas` | Per-card canvas background | Feature showcases, SaaS product pages |

## Augmentation by Industry

### Health
- shadcn `Card` + elevated shadow + gentle hover lift (no canvas bg)
- shadcn `Button` + gradient teal fill + subtle depth shadow
- shadcn `Progress` + domain-colored fill (protein=blue, carbs=green)
- shadcn `Badge` + soft tint background matching domain color
- Skip: CustomCursor, Scanlines, SoundLayer, magnetic hover

### SaaS
- shadcn `Card` + glass effect + hover canvas background (creative dashboards)
- shadcn `Button` + gradient + magnetic hover (landing pages only)
- shadcn `Tabs` + shared layout animation (underline morph)
- shadcn `Sidebar` + glass panel background
- Available: CustomCursor (landing only), ScrollProgress

### Fintech
- shadcn `Table` + row stagger entrance + sticky glass header
- shadcn `Card` + minimal elevation (shadow-sm to shadow-md only)
- shadcn `Chart` + domain-colored series + glass tooltip
- Skip: All canvas, Three.js, CustomCursor, Scanlines, magnetic hover

### Legal
- shadcn components used as-is with minimal augmentation
- Only: subtle fade transitions between views, ripple on buttons
- Skip: All Design Forge components except ScrollProgress (for long documents)

### E-commerce
- shadcn `Card` + elevation + hover scale (product cards)
- shadcn `Badge` + pulse for "Sale" / "New" status
- GSAP Flip for product grid reorder (filter/sort animations)
- Skip: Canvas backgrounds, Three.js, Scanlines, SoundLayer

### Creative
- Full Design Forge component access — no restrictions
- shadcn components get maximum augmentation (glass, canvas bg, custom cursor)
- All scroll choreography presets available
