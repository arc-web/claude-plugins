# Scroll Choreography — Section-Based Scroll Experiences

Premium scroll patterns for marketing sites, product showcases, and storytelling pages. Inspired by Apple.com product pages, Stripe, and Linear.

---

## Pattern 1: Full-Viewport Pinned Sections (Apple MacBook Style)

Each section is `min-h-screen`, pinned in place while a GSAP timeline scrubs through a sequence of reveals.

```tsx
"use client";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function PinnedShowcase({ title, subtitle, metrics, image }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "+=200%",      // 2x viewport of scroll distance
        pin: true,
        scrub: 0.5,         // smooth scrub lag
      },
    });

    // Phase 1: Title slides up
    tl.from(".showcase-title", { y: 60, opacity: 0, duration: 0.3 });
    // Phase 2: Subtitle appears
    tl.from(".showcase-subtitle", { y: 40, opacity: 0, duration: 0.2 }, "-=0.1");
    // Phase 3: Metrics fan out
    tl.from(".showcase-metric", { y: 30, opacity: 0, stagger: 0.08, duration: 0.3 });
    // Phase 4: Image scales in
    tl.from(".showcase-image", { scale: 0.9, opacity: 0, duration: 0.4 });
  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="min-h-screen flex items-center justify-center">
      {/* Content here */}
    </section>
  );
}
```

**When to use:** SaaS landing pages, product showcases, feature highlights.
**When NOT to use:** Health, legal, fintech apps — too aggressive.

---

## Pattern 2: Scroll-Driven Metric Counters

Numbers animate from 0 to target value as the section enters the viewport.

```tsx
"use client";
import { useRef } from "react";
import { useInView, useMotionValue, useTransform, animate } from "motion/react";
import { useEffect } from "react";

export function AnimatedCounter({ target, suffix = "", duration = 1.5 }: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const count = useMotionValue(0);

  useEffect(() => {
    if (isInView) {
      animate(count, target, {
        duration,
        ease: [0.16, 1, 0.3, 1],
        onUpdate: (v) => {
          if (ref.current) {
            ref.current.textContent = Math.round(v).toLocaleString() + suffix;
          }
        },
      });
    }
  }, [isInView, target, duration, suffix, count]);

  return <span ref={ref}>0{suffix}</span>;
}
```

**When to use:** Any landing page with stats. Health dashboards (calorie counters, macro totals). SaaS metrics.
**Intensity adaptation:** Health uses `duration: 1.5` (gentle). SaaS uses `duration: 0.8` (snappy).

---

## Pattern 3: Sticky Content with Scroll-Driven Swap

Left panel is sticky, right panel scrolls. As each right-side section enters, the left content cross-fades to match.

```tsx
export function StickySwap({ sections }: { sections: Section[] }) {
  return (
    <div className="relative flex gap-16">
      {/* Sticky left panel */}
      <div className="sticky top-24 h-fit w-1/2">
        {sections.map((section, i) => (
          <div
            key={i}
            className="absolute inset-0 transition-opacity duration-500"
            style={{ opacity: /* driven by scroll position */ }}
          >
            {section.visual}
          </div>
        ))}
      </div>

      {/* Scrolling right panel */}
      <div className="w-1/2 space-y-[50vh]">
        {sections.map((section, i) => (
          <div key={i} className="min-h-[50vh] flex items-center">
            <div>
              <h3>{section.title}</h3>
              <p>{section.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
```

Use GSAP ScrollTrigger `onEnter`/`onLeaveBack` to toggle which left-panel content is visible.

**When to use:** Feature comparison, product specs, documentation walkthroughs.

---

## Pattern 4: Scroll-Driven Image/Video Reveal

Image opacity or clip-path driven by scroll progress.

```css
/* CSS approach with scroll-driven animations (modern browsers) */
@keyframes reveal-down {
  from { clip-path: inset(100% 0 0 0); }
  to   { clip-path: inset(0 0 0 0); }
}

.scroll-reveal-image {
  animation: reveal-down linear;
  animation-timeline: view();
  animation-range: entry 0% entry 100%;
}
```

Or with GSAP for broader support:
```tsx
gsap.from(".reveal-image", {
  clipPath: "inset(100% 0% 0% 0%)",
  scrollTrigger: { trigger: ".reveal-image", start: "top 80%", end: "top 30%", scrub: true },
});
```

---

## Pattern 5: Section Cross-Fade Sequence

Sections fade in as previous sections fade out. No pinning — simpler and works everywhere.

```tsx
import { motion } from "motion/react";

export function FadeSection({ children }: { children: React.ReactNode }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.section>
  );
}
```

**When to use:** Universal — works for all industries. The gentlest scroll pattern. Default for health, fintech, legal.

---

## Intensity Adaptation

| Preset | Industries | Techniques |
|--------|-----------|------------|
| `section-fade-sequence` | health, fintech, legal, ecommerce | Framer Motion `whileInView` fade+slide only |
| `apple-showcase` | saas (landing), creative | GSAP pinning, timeline scrub, SplitText, canvas |
| `parallax-layers` | creative, ecommerce (landing) | Multi-layer depth, background speed offset |
| `horizontal-narrative` | creative, portfolio | GSAP `containerAnimation`, vertical→horizontal |

---

## Performance Notes

- Pin sections only when the content justifies the scroll distance
- Limit to 3-5 pinned sections per page (more = scroll fatigue)
- Always test on mobile — pinning behaves differently on touch
- Use `scrub: 0.5` (not `true`) for smoother lag
- Add `will-change: transform` to animated elements
- Clean up ScrollTrigger instances on unmount (`useGSAP` handles this)
