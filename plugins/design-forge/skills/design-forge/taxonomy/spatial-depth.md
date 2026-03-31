# Spatial Depth — Adding Visual Depth Without Heavy Libraries

Techniques for creating 3D-like depth and visual richness using CSS, layered shadows, and lightweight effects. No Three.js required.

---

## Technique 1: Layered Box-Shadow Elevation System

Replace flat `shadow-sm` with stacked shadows that create realistic depth. Each level adds multiple shadow layers at different offsets.

```css
:root {
  /* 5-level elevation system */
  --elevation-1: 0 1px 2px rgba(0,0,0,0.04);
  --elevation-2: 0 2px 4px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.06);
  --elevation-3: 0 4px 8px rgba(0,0,0,0.04), 0 2px 4px rgba(0,0,0,0.06);
  --elevation-4: 0 8px 16px rgba(0,0,0,0.06), 0 4px 8px rgba(0,0,0,0.04);
  --elevation-5: 0 16px 32px rgba(0,0,0,0.08), 0 8px 16px rgba(0,0,0,0.04);

  /* Warm variant (for health, organic styles) */
  --elevation-warm-2: 0 2px 4px rgba(139,90,43,0.04), 0 1px 2px rgba(139,90,43,0.06);
  --elevation-warm-3: 0 4px 8px rgba(139,90,43,0.06), 0 2px 4px rgba(139,90,43,0.04);
}
```

**Card hover pattern:**
```tsx
<div className="shadow-[var(--elevation-2)] hover:shadow-[var(--elevation-4)]
  hover:-translate-y-1 transition-all duration-300">
  {/* card content */}
</div>
```

---

## Technique 2: CSS Perspective Depth

Real 3D positioning using CSS `perspective` and `translateZ`. Creates spatial separation without JavaScript.

```css
.depth-container {
  perspective: 1200px;
  perspective-origin: 50% 50%;
}

.depth-layer-back {
  transform: translateZ(-50px) scale(1.05);
  /* Further away = slightly larger to compensate perspective shrink */
}

.depth-layer-mid {
  transform: translateZ(0);
}

.depth-layer-front {
  transform: translateZ(30px);
  /* Closer = naturally larger, casts stronger shadow */
  filter: drop-shadow(0 8px 24px rgba(0,0,0,0.15));
}
```

**Use case:** Hero sections where background, content, and decorative elements exist at different depths.

---

## Technique 3: Atmospheric Gradients

Radial gradients behind content create a "light source" that implies depth and environment.

```css
/* Ambient glow behind a section */
.section-with-depth::before {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(
    ellipse 60% 40% at 50% 50%,
    rgba(0, 137, 123, 0.07) 0%,    /* primary color at low opacity */
    transparent 70%
  );
  pointer-events: none;
}

/* Mesh gradient (multiple overlapping radials) */
.mesh-gradient {
  background:
    radial-gradient(ellipse at 20% 50%, rgba(99,102,241,0.08) 0%, transparent 50%),
    radial-gradient(ellipse at 80% 20%, rgba(236,72,153,0.06) 0%, transparent 50%),
    radial-gradient(ellipse at 50% 80%, rgba(34,197,94,0.05) 0%, transparent 50%);
}
```

**Industry adaptation:**
- Health: single warm teal glow, very subtle (0.05-0.07 opacity)
- SaaS: indigo/violet mesh gradient (0.06-0.10 opacity)
- Creative: bold mesh with multiple colors (0.10-0.15 opacity)
- Legal/Fintech: no atmospheric gradients

---

## Technique 4: Frosted Glass Layering

Multiple glass panels at different blur levels create depth hierarchy.

```css
/* Layer 1: Deep background (heavy blur) */
.glass-deep {
  background: rgba(255,255,255,0.3);
  backdrop-filter: blur(24px) saturate(150%);
}

/* Layer 2: Mid panel (moderate blur) */
.glass-mid {
  background: rgba(255,255,255,0.5);
  backdrop-filter: blur(16px) saturate(130%);
}

/* Layer 3: Foreground panel (light blur or none) */
.glass-front {
  background: rgba(255,255,255,0.8);
  backdrop-filter: blur(8px);
}

/* Layer 4: Interactive elements (solid) */
.glass-interactive {
  background: rgba(255,255,255,0.95);
  /* Near-solid for readability */
}
```

**Performance warning:** Limit to 3-5 glass panels visible at once. Never use on scrolling list items.

---

## Technique 5: Gradient Buttons with Depth

Buttons that feel 3D without being skeuomorphic. Combines gradient fill, shadow, and transform.

```tsx
export function ElevatedButton({ children, ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "relative px-6 py-3 rounded-xl font-medium text-white",
        "bg-gradient-to-b from-primary-500 to-primary-600",
        "shadow-[0_4px_12px_rgba(0,0,0,0.15),0_1px_3px_rgba(0,0,0,0.1)]",
        "hover:-translate-y-0.5 hover:shadow-[0_6px_16px_rgba(0,0,0,0.2),0_2px_4px_rgba(0,0,0,0.1)]",
        "active:translate-y-0.5 active:shadow-[0_1px_4px_rgba(0,0,0,0.15)]",
        "transition-all duration-200"
      )}
      {...props}
    >
      {children}
    </button>
  );
}
```

The `from-X to-Y` gradient creates a subtle top-light effect. Combined with the shadow, the button appears to float above the surface.

---

## Technique 6: Inset Shadows for Recessed Elements

Create depth by making elements appear recessed into the surface.

```css
/* Input fields that feel inset */
.inset-input {
  box-shadow: inset 0 2px 4px rgba(0,0,0,0.06);
  border: 1px solid rgba(0,0,0,0.1);
}

/* Progress bar track */
.inset-track {
  box-shadow: inset 0 1px 3px rgba(0,0,0,0.1);
  border-radius: 9999px;
}
```

---

## Depth Strategy by Industry

| Industry | Primary Technique | Secondary | Avoid |
|----------|------------------|-----------|-------|
| Health | Layered shadows (warm) | Atmospheric gradient (subtle) | Glass layering, perspective |
| SaaS | Layered shadows + Glass | Atmospheric gradient (mesh) | Perspective depth |
| Fintech | Minimal shadows only | — | Everything else |
| Legal | Border only (no shadows) | — | Everything else |
| Ecommerce | Layered shadows | Gradient buttons | Glass layering |
| Creative | All techniques available | — | No restrictions |

---

## Combining with Motion

Depth effects work best with corresponding motion:
- Cards at elevation-2 hover to elevation-4 WITH 2px translateY lift
- Glass panels fade-in WITH blur increase (blur 0 → blur 16px)
- Atmospheric gradients can pulse gently (opacity 0.05 → 0.08, 3s cycle)
- Perspective layers can shift slightly on pointer move (parallax within the section)
