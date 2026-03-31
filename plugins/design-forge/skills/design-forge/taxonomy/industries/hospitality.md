# Hospitality Industry — Restaurants, Hotels, Events, Bars

> Food, accommodation, and experience businesses. Warmth, atmosphere, and sensory appeal are key.

## Color Palette

### Light Mode
- **Background**: `#FDF8F4` (warm off-white, linen)
- **Foreground**: `#292524` (stone-800)
- **Primary**: `#92400E` (amber-800 — warmth, earthiness)
- **Secondary**: `#B45309` (amber-700)
- **Accent**: `#DC2626` (red-600 — appetite, urgency for reservations)

### Dark Mode
- **Background**: `#1C1917` (stone-900, warm black)
- **Foreground**: `#F5F5F4` (stone-100)
- **Primary**: `#D97706` (amber-600)
- **Secondary**: `#F59E0B` (amber-500)
- **Accent**: `#EF4444` (red-500)

### Industry-Specific Accents
- **Fine Dining**: `#7C2D12` (deep burgundy/rust) — sophisticated
- **Casual Restaurant**: `#EA580C` (orange) — friendly, approachable
- **Hotel/Resort**: `#0F766E` (teal-700) — calm, luxury
- **Bar/Nightlife**: `#7C3AED` (violet) — energy, nightlife
- **Events**: `#BE185D` (pink-700) — celebration, festivity
- **Café**: `#78350F` (amber-900) — coffee, warmth

## Typography
- **Display**: Playfair Display, Cormorant, or serif alternative — elegance, tradition
- **Body**: Inter, Source Sans — clean readability for menus, descriptions
- **Mono**: Not used
- **Key traits**: Serif headings for warmth, generous whitespace, italics for descriptions

## Animation Intensity: `gentle`
- Duration: 0.4–0.6s
- Smooth, warm transitions that feel like hospitality — welcoming, not aggressive
- Image reveals with subtle scale (food photography deserves attention)
- Stagger for menu items, gentle parallax for ambiance photos

## Design Patterns
- **Hero with food/ambiance photography**: Full-bleed, atmospheric
- **Menu showcase**: Clean typographic menu with categories
- **Gallery/Carousel**: Food photography, rooms, event spaces
- **Reservation CTA**: Prominent booking button (OpenTable, Resy integration)
- **Hours & Location**: Always visible, map integration
- **Seasonal promotions**: Rotating featured items or events
- **Social proof**: Instagram feed integration, review highlights

## Component Recommendations
- `full-bleed-media` — Hero with atmospheric photography
- `feature-card-grid` — Menu categories or room types
- `testimonial-carousel` — Guest reviews
- `logo-marquee` — Press mentions, partner logos
- `gradient-headline-hero` — With warm gradient, reservation CTA
- `faq-accordion` — Dietary info, booking policies, parking

## Section Recommendations
```
heroes: ["gradient-headline-hero", "split-media-hero"]
showcases: ["feature-card-grid", "capabilities-bento"]
metrics: ["stats-showcase"]
media: ["full-bleed-media"]
social_proof: ["testimonial-carousel", "logo-marquee"]
content: ["faq-accordion"]
ctas: ["gradient-cta"]
```

## Asset Generation
- **Social media**: Daily specials, seasonal menus, event announcements, behind-the-scenes
- **Instagram stories**: Food photography with brand overlay
- **OG images**: Restaurant name + hero dish photo
- **Menu cards**: PDF/image menu for digital display
- **Event banners**: Special occasion promotions

## What to Avoid
- Cold/tech aesthetics — no near-black backgrounds for restaurants (unless fine dining/bar)
- Monospace fonts — feels too technical
- Aggressive scroll effects — let the photography speak
- Complex data visualizations — this isn't a dashboard
- Stock photography — authenticity is critical in hospitality

## shadcn Augmentation
- **Button**: Warm fill (primary amber), rounded, generous padding. "Reserve a Table" style
- **Card**: Warm background (`#FDF8F4`), subtle warm shadow, food photo with overlay gradient
- **Badge**: "Chef's Special", "Seasonal", "Gluten-Free" — warm accent colors
- **Tabs**: Menu categories (Starters, Mains, Desserts) with warm underline animation
- **Dialog**: Reservation form, clean and simple
