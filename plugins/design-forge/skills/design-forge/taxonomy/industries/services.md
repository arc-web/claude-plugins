# Services Industry — Electricians, Plumbers, HVAC, Contractors

> Trade and home service businesses. Trust, professionalism, and local presence are key.

## Color Palette

### Light Mode
- **Background**: `#f8fafc` (cool white)
- **Foreground**: `#0f172a` (slate-900)
- **Primary**: `#3B82F6` (professional blue — trust, reliability)
- **Secondary**: `#1E40AF` (darker blue — depth)
- **Accent**: `#FBBF24` (amber/yellow — energy, urgency, safety)

### Dark Mode
- **Background**: `#0a1628` (deep navy)
- **Foreground**: `#f8fafc` (cool white)
- **Primary**: `#60A5FA` (lighter blue)
- **Secondary**: `#3B82F6`
- **Accent**: `#FCD34D` (lighter amber)

### Industry-Specific Accents
- **Electrical**: `#FFD700` (electric yellow) — safety, power
- **Plumbing**: `#06B6D4` (cyan) — water, clean
- **HVAC**: `#EF4444` (red) — warmth, heating + `#3B82F6` (blue) — cooling
- **General Contractor**: `#F97316` (orange) — construction, energy

## Typography
- **Display**: Inter or system sans-serif — clean, professional, readable at all sizes
- **Body**: Inter — clear on mobile, high readability for service descriptions
- **Mono**: Not typically used
- **Key traits**: Strong weight contrast (700 headings, 400 body), generous line-height for mobile

## Animation Intensity: `gentle`
- Duration: 0.3–0.5s
- Trade customers browse on mobile between jobs — quick, no-nonsense
- Subtle fade-in for sections, no aggressive scroll effects
- Fast counter animations for metrics (response time, jobs completed)

## Design Patterns
- **Trust-first**: Certifications, license numbers, insurance badges above the fold
- **Before/After**: Photo grids showing work quality
- **Emergency CTA**: Prominent phone number, "Call Now" button with pulse animation
- **Service Area Map**: Local business emphasis
- **Review Scores**: Google/Yelp ratings prominently displayed
- **Photo Gallery**: Real job photos (not stock) — builds authenticity

## Component Recommendations
- `trust-signals` — Certifications, BBB rating, insurance badges
- `counter-bar` — "500+ jobs completed", "30 min response time"
- `testimonial-carousel` — Customer reviews
- `gradient-headline-hero` — Clean hero with phone number CTA
- `faq-accordion` — Common service questions
- `feature-card-grid` — Service offerings (electrical, plumbing, HVAC)

## Section Recommendations
```
heroes: ["gradient-headline-hero"]
showcases: ["feature-card-grid"]
metrics: ["counter-bar", "stats-showcase"]
social_proof: ["testimonial-carousel", "trust-signals"]
content: ["faq-accordion"]
ctas: ["gradient-cta"]
```

## Asset Generation
- **Social media**: Before/after posts, seasonal tips (winterize your pipes), emergency reminders
- **OG images**: Service area + phone number
- **Google Business**: Profile photo, cover photo with branding
- **Vehicle wrap mockups**: Device mockup of branded van/truck

## What to Avoid
- Glassmorphism or futuristic effects — clients expect professionalism, not tech aesthetic
- Custom cursors, sound layers, canvas backgrounds
- Aggressive animations or scroll jacking
- Dark mode as default (light mode preferred for trust)
- Small text or complex layouts (many users are on phones, outdoors)

## shadcn Augmentation
- **Button**: Solid fill with brand color, no gradients. Large touch target (48px min)
- **Card**: Clean white/light card with subtle shadow. Service icon + description
- **Badge**: License numbers, "Licensed & Insured", "Emergency Available"
- **Dialog**: Simple contact form, no complex animations
