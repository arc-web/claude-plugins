# Industry: SaaS & B2B Platforms

## Design Philosophy

SaaS products must balance **data density with clarity**. Users spend hours in these tools daily — the design should feel polished and efficient without being sterile. Landing pages are bold and conversion-focused; the app itself is restrained and productive.

## Color Palettes

### Light Mode
- Background: `#FAFAFA` (near-white) or `#F8FAFC` (cool gray)
- Foreground: `#0F172A` (slate-900)
- Primary: `#6366F1` (indigo) or `#3B82F6` (blue) — tech-forward
- Primary hover: gradient `linear-gradient(135deg, #6366F1, #8B5CF6)` (indigo to violet)
- Secondary: `#F1F5F9` (slate-100)
- Accent: `#F59E0B` (amber) — for upgrade CTAs, feature highlights
- Success: `#10B981` (emerald)
- Destructive: `#EF4444`

### Dark Mode
- Background: `#0B1120` (deep navy-black)
- Card: `#1E293B` (slate-800)
- Primary: `#818CF8` (lighter indigo)
- Borders: `rgba(255,255,255,0.08)`

## Typography

- Display: Inter or Cal Sans — clean, slightly tight tracking for headlines
- Body: Inter — the SaaS standard
- Mono: JetBrains Mono or Fira Code — for code blocks, API keys, metrics
- Weight: Medium (500) for most UI, SemiBold (600) for section headers, Bold (700) for hero text only

## Spacing & Layout

- Border radius: `rounded-lg` (8px) — professional, not playful
- Card padding: `p-4` to `p-6` — balanced density
- Sidebar: 240-280px collapsed, with glass panel in dark mode
- Content: full-width with `max-w-screen-2xl` container

## Animation Guidelines

### App (webapp)
**Intensity: moderate**
- Duration: 0.4-0.8s
- Easing: `[0.25, 0.46, 0.45, 0.94]`
- List stagger: 0.08s
- GSAP Flip for grid reorder (sort/filter)
- Shared layout animation for tab switches

### Landing Page (website)
**Intensity: expressive**
- Full scroll choreography (apple-showcase preset)
- GSAP ScrollTrigger pinning for feature sections
- SplitText for hero headlines
- Canvas backgrounds (grid-field, point-cloud)
- Custom cursor with contextual labels
- Metric counters scrolling into view
- 3D gradient background (Three.js, lightweight)

## Depth Strategy

### App: Glassmorphism
- Sidebar: `backdrop-blur-xl bg-slate-900/80` (dark) or `bg-white/80` (light)
- Modal overlays: `backdrop-blur-lg`
- Stat cards: subtle elevation with `shadow-md`
- Hover: card lifts 4px with increased shadow

### Landing: Glassmorphism + Three.js Ambient
- Hero: gradient shader background or particle field
- Feature sections: glass panels over canvas
- Pricing cards: elevation + glass + hover lift

## Buttons

- Primary: gradient fill (indigo → violet) with depth shadow
- Secondary: ghost with border, hover fills with primary tint
- CTA (landing): larger, more padding, magnetic hover effect
- App buttons: standard size, ripple feedback

## Charts & Data

- Use the primary color spectrum for series (indigo-400 through indigo-700)
- Animated entry: bars grow, lines draw (moderate timing)
- Glass tooltip with backdrop blur
- Real-time data: pulse animation on live indicators
- Empty states: subtle illustration, not just text

## shadcn Augmentation (SaaS)

- `Card`: Elevation + hover lift, glass variant for dashboards
- `Button`: Gradient primary, magnetic hover on landing pages only
- `Tabs`: Shared layout animation (animated underline)
- `Sidebar`: Glass panel, spring collapse animation
- `Table`: Row stagger entrance, GSAP Flip for sort, sticky glass header
- `Badge`: Pulse for "Live" / "New" indicators
- `Chart`: Glass tooltip, animated entry, primary color spectrum
- `Dialog`: Spring physics open, backdrop blur
