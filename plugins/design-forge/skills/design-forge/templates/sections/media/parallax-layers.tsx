/**
 * ParallaxLayers — Multi-depth parallax section with configurable layers.
 *
 * Multiple background/foreground elements move at different scroll speeds
 * creating depth. Promoted from gsap-scroll-trigger (ParallaxSection) with added:
 * multi-layer support, intensity-aware speed, section framing, reduced-motion.
 *
 * Taxonomy: website · all industries · gentle-expressive intensity
 * Decomposed from: Apple MacBook Pro parallax feature sections
 *
 * Dependencies: pnpm add gsap
 *
 * Usage:
 *   <ParallaxLayers
 *     layers={[
 *       { content: <img src="/bg-stars.jpg" />, speed: -40, zIndex: 0 },
 *       { content: <img src="/mid-clouds.png" />, speed: -20, zIndex: 1 },
 *     ]}
 *     animationIntensity="moderate"
 *   >
 *     <h2>Foreground Content</h2>
 *   </ParallaxLayers>
 */

"use client";

import { useRef, useEffect, useState, type ReactNode } from "react";
import type { SectionBaseProps } from "../_shared/types";

interface ParallaxLayer {
  /** Content for this layer (image, gradient div, etc.) */
  content: ReactNode;
  /** Scroll speed as yPercent. Negative = slower (background). Default: -30 */
  speed?: number;
  /** Z-index for layer stacking. Default: 0 */
  zIndex?: number;
  /** Additional CSS classes */
  className?: string;
}

interface ParallaxLayersProps extends SectionBaseProps {
  /** Array of background/decorative layers */
  layers: ParallaxLayer[];
  /** Foreground content (children) */
  children: ReactNode;
  /** Minimum section height. Default: "100vh" */
  minHeight?: string;
}

export function ParallaxLayers({
  id,
  layers,
  children,
  background,
  className = "",
  animationIntensity = "moderate",
  minHeight = "100vh",
}: ParallaxLayersProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const layerRefs = useRef<(HTMLDivElement | null)[]>([]);

  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const shouldAnimate = !prefersReducedMotion && animationIntensity !== "minimal";

  // Speed multiplier based on intensity
  const speedMultiplier = {
    minimal: 0,
    gentle: 0.5,
    moderate: 1,
    expressive: 1.5,
  }[animationIntensity];

  useEffect(() => {
    if (!shouldAnimate || !sectionRef.current) return;

    let triggers: { kill: () => void }[] = [];

    (async () => {
      const gsap = (await import("gsap")).default;
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);

      layerRefs.current.forEach((el, i) => {
        if (!el || !sectionRef.current) return;
        const layer = layers[i];
        const speed = (layer.speed ?? -30) * speedMultiplier;

        gsap.to(el, {
          yPercent: speed,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            scrub: true,
            start: "top bottom",
            end: "bottom top",
          },
        });
      });

      triggers = ScrollTrigger.getAll();
    })();

    return () => {
      triggers.forEach((t) => t.kill());
    };
  }, [shouldAnimate, layers, speedMultiplier]);

  return (
    <section
      ref={sectionRef}
      id={id}
      className={["relative overflow-hidden", className].join(" ")}
      style={{ minHeight }}
    >
      {/* Parallax layers */}
      {layers.map((layer, i) => (
        <div
          key={i}
          ref={(el) => { layerRefs.current[i] = el; }}
          className={[
            "absolute inset-0 will-change-transform",
            layer.className ?? "",
          ].join(" ")}
          style={{ zIndex: layer.zIndex ?? 0 }}
          aria-hidden="true"
        >
          {layer.content}
        </div>
      ))}

      {background && (
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          {background}
        </div>
      )}

      {/* Foreground content */}
      <div className="relative z-10">{children}</div>
    </section>
  );
}
