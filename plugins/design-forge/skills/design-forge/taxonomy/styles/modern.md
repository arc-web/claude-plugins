# Style: Modern

## Characteristics

Clean lines, generous whitespace, subtle depth, gradient accents. The most versatile style — works across most industries. Think Stripe, Linear, Vercel marketing (not the control room dark mode).

## Visual Signature

- **Border radius**: `rounded-lg` to `rounded-xl` (8-16px)
- **Shadows**: layered, soft — 2-3 stacked `box-shadow` values for depth
- **Colors**: one strong primary + neutral backgrounds + accent for CTAs
- **Gradients**: subtle, used on primary buttons and hero backgrounds
- **Whitespace**: generous — `gap-6` to `gap-8` between sections
- **Borders**: `1px solid` with low-opacity colors, not heavy dividers

## Depth System

```css
/* 5-level elevation */
--shadow-1: 0 1px 2px rgba(0,0,0,0.04);
--shadow-2: 0 2px 4px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.06);
--shadow-3: 0 4px 8px rgba(0,0,0,0.04), 0 2px 4px rgba(0,0,0,0.06);
--shadow-4: 0 8px 16px rgba(0,0,0,0.06), 0 4px 8px rgba(0,0,0,0.04);
--shadow-5: 0 16px 32px rgba(0,0,0,0.08), 0 8px 16px rgba(0,0,0,0.04);
```

Cards rest at level 2, hover to level 3-4. Key metrics at level 3 baseline.

## Buttons

- Primary: gradient fill (`bg-gradient-to-r from-primary-600 to-primary-500`)
- Depth shadow below button (not just border)
- Hover: translateY(-2px) + shadow increase
- Active: translateY(1px) + shadow decrease
- Transition: 200ms ease-out

## Cards

- White background (light mode) or slightly elevated surface (dark mode)
- Subtle border + shadow-2
- Hover: shadow-3 + 2px lift
- Content padding: `p-6`
- Clear hierarchy: title → description → content → actions

## Typography

- Headlines: tight tracking (`-0.02em`), semi-bold
- Body: normal weight, comfortable line-height (1.6)
- No uppercase labels unless specifically for status badges
- Color hierarchy: foreground (headings) → muted-foreground (descriptions) → primary (links)

## When to Use

- Most web apps and SaaS products
- Health, education, general business
- Any project where "clean and professional" is the goal
- Safe default when no specific style is requested
