# Platform: Web App (Dashboard & Tools)

## When This Applies

SaaS dashboards, admin panels, productivity tools, data management, CRM, ERP. Users spend hours here daily. Efficiency and consistency matter more than first impressions.

## Layout Patterns

- **Sidebar + Main**: Primary layout. Collapsible sidebar, main content area. Use `sticky-sidebar` template.
- **Bento Grid**: For dashboard overviews — stat cards, charts, activity feed. Use `bento-grid` template.
- **Split View**: List + detail pane. Common for email, messaging, CRM contacts.
- **Tab-based**: Multiple views within a page. shadcn Tabs with shared layout animation.

## Scroll Behavior

Web apps have LESS scroll choreography than websites. Content loads, user works.

- **Do**: Stagger list items on initial load (subtle, 0.03-0.06s)
- **Do**: Animate counters on dashboard first load
- **Do**: Smooth page transitions between routes
- **Don't**: Pin sections, use full-viewport scroll sequences
- **Don't**: Use parallax in data-heavy views
- **Don't**: Add canvas backgrounds to work areas (distracting)

## Animation Intensity

Lower than websites — users see these animations daily.

- SaaS app: `moderate` — polished but not distracting
- Health app: `gentle` — trust and calm
- Fintech app: `minimal` — precision over polish
- Legal app: `minimal` — content is king

## Navigation

- Sidebar: 240-280px, collapsible to icons on desktop, bottom bar on mobile
- Breadcrumbs for nested routes
- Command palette (Cmd+K) for power users
- Tabs for in-page view switching

## Data Display

- Tables: sticky header, row hover highlight, sort animation (GSAP Flip)
- Cards: consistent spacing, action buttons on hover
- Charts: animated entry on first load, static on re-render
- Empty states: illustration + CTA, not just text
- Loading: skeleton screens (shadcn Skeleton), not spinners

## Performance

- Route-based code splitting
- Skeleton loading for async data
- Optimistic updates for mutations
- Virtual lists for 100+ items (TanStack Virtual)
- No canvas/Three.js in data views — reserve for landing/marketing

## shadcn Coverage (Strong)

Web apps are shadcn's sweet spot:
- Sidebar, Tabs, Table, Card, Dialog, Sheet, Form, Input — all well-covered
- Design Forge augments with: motion wrappers, glass effects, animated counters, hover elevation
- Key gap: scroll-reveal for dashboard sections, animated metric counters, spring-physics for drawers
