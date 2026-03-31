# Industry: Health & Wellness

## Design Philosophy

Health apps must communicate **trust, clarity, and calm**. Users are often tracking sensitive personal data (weight, nutrition, medications). The design should feel like a clean, well-lit clinic — organized, reassuring, never overwhelming.

## Color Palettes

### Light Mode
- Background: `#F8F5F1` (warm cream) — feels approachable, not clinical
- Foreground: `#1A1A2E` (soft black) — softer than pure black, easier on eyes
- Primary: `#00897B` (teal) — health/wellness standard, conveys growth
- Primary hover: `#00796B` (deeper teal) or gradient `linear-gradient(135deg, #00897B, #26A69A)`
- Secondary: `#F0ECE7` (light beige surface)
- Accent: `#FF7043` (warm coral) — for CTAs and attention points
- Success: `#4CAF50` (natural green)
- Warning: `#FFB74D` (warm amber)
- Destructive: `#EF4444` (clear red)

### Dark Mode
- Background: `#030A12` (deep navy) — not pure black, has depth
- Card: `#121E30` (slightly lighter navy)
- Primary: `#4DB6AC` (lighter teal for contrast)
- Accent: `#FF8A65` (lighter coral)

### Domain Colors (Nutrition/Fitness)
- Protein: `#5C6BC0` (indigo blue)
- Carbs: `#66BB6A` (natural green)
- Fat: `#EF5350` (warm red)
- Fiber: `#FFB74D` (amber)
- Calories: `#FF7043` (coral)
- Water: `#42A5F5` (sky blue)

## Typography

- Display: Inter or Geist Sans — clean, modern, highly legible
- Body: Inter — optimized for reading at small sizes
- Mono: JetBrains Mono — for data/metrics display
- Scale: generous line-height (1.6 body, 1.2 headings)
- Weight: avoid ultra-bold except for key metrics. Normal (400) body, Medium (500) labels, SemiBold (600) headings

## Spacing & Layout

- Border radius: `rounded-xl` (12-16px) — soft, approachable
- Card padding: generous (p-6 minimum)
- Section spacing: `space-y-8` or `gap-8` — breathing room
- Content max-width: `max-w-4xl` for reading, `max-w-7xl` for dashboards

## Animation Guidelines

**Intensity: gentle**
- Duration: 0.3-0.6s
- Easing: `[0.16, 1, 0.3, 1]` (fast-in, slow-out — feels organic)
- Stagger: 0.06s between list items
- Scroll effects: yes, but restrained (fade+slide only, no pinning)

**Do:**
- Fade-up sections on scroll entry
- Stagger list items on page load
- Animate metric counters (calories, macros) on viewport entry
- Gentle hover lift on cards (2-4px translateY + shadow increase)
- Smooth progress bar fills (500ms transition)

**Don't:**
- Pin sections during scroll (feels aggressive)
- Use GSAP SplitText character animations (too playful)
- Add canvas backgrounds (distracting from data)
- Use custom cursors (unnecessary)
- Add sound effects (medical/health context)
- Use horizontal scroll galleries (confusing for data-focused UX)

## Depth Strategy: CSS Layers

Health apps should feel layered but calm:
1. **Background**: Warm cream or deep navy
2. **Surface**: White cards with subtle shadow (`shadow-sm` → `shadow-md` on hover)
3. **Elevated**: Stat cards, key metrics — `shadow-lg` with 2px translateY lift on hover
4. **Overlay**: Glass panels for modals/sheets — `backdrop-blur-lg bg-white/80`

Shadow system (replacing flat design):
```css
/* Base card */
shadow-sm: 0 1px 2px rgba(0,0,0,0.05)
/* Hover state */
shadow-md: 0 4px 6px -1px rgba(0,0,0,0.07), 0 2px 4px -2px rgba(0,0,0,0.05)
/* Elevated (key metrics) */
shadow-lg: 0 10px 15px -3px rgba(0,0,0,0.08), 0 4px 6px -4px rgba(0,0,0,0.04)
```

## Buttons

- Primary: Gradient teal (`bg-gradient-to-r from-teal-700 to-teal-600`) with depth shadow
- Hover: slight lift (translateY -2px) + shadow increase
- Active: press down (translateY 1px) + shadow decrease
- Border radius: `rounded-xl` matching cards
- Avoid: outline/ghost variants for primary actions (not enough visual weight for health CTAs)

## Charts & Data Visualization

- Use domain colors consistently (protein always blue, carbs always green)
- Animated entry: bars grow from 0, lines draw left-to-right
- Tooltips: glass panel style (`backdrop-blur-sm bg-white/90`)
- Progress rings: smooth 500ms fill animation
- Counter animation: numbers count up on viewport entry (use scroll-counter template)

## Trust Signals

- Use real metric displays (not placeholder data)
- Show precision (1 decimal for calories, whole numbers for macros)
- Consistent color coding across all views
- Clear status indicators (on-track = green, needs attention = amber, over = red)

## Multi-Tenant Considerations

Health platforms often serve multiple roles (admin, practitioner, patient). The palette above is the base — tenant overrides use CSS custom properties (`data-tenant` attribute) to swap the primary color while keeping the overall design language consistent.

## shadcn Augmentation (Health-Specific)

- `Card`: Add shadow-md hover lift, domain-color left border accent for categorized cards
- `Button`: Gradient primary, depth shadow, rounded-xl
- `Progress`: Domain-colored fill, gradient variant for macro progress
- `Badge`: Soft tint background (e.g., protein badge = `bg-indigo-50 text-indigo-700`)
- `Chart`: Glass tooltip, domain-colored series, animated entry
- `Avatar`: Presence ring (green=active, gray=offline) for practitioner status
