/**
 * PinnedTimelineShowcase — Apple MacBook-style pinned section with timeline scrub.
 *
 * Full-viewport section pinned in place while a GSAP timeline scrubs through
 * phased content reveals. Promoted from scroll-section-choreography with added:
 * animation intensity, mobile fallback (no pin), variant support, section props.
 *
 * Taxonomy: website · saas/creative · apple-showcase preset · moderate-expressive
 * Decomposed from: Apple MacBook Pro pinned showcase sections
 *
 * Dependencies: pnpm add gsap @gsap/react
 *
 * Usage:
 *   <PinnedTimelineShowcase
 *     title="Blazing Fast Performance"
 *     subtitle="The M4 Pro chip delivers unprecedented speed."
 *     metrics={[
 *       { label: "CPU cores", value: "14" },
 *       { label: "GPU cores", value: "20" },
 *       { label: "Memory", value: "48GB" },
 *     ]}
 *     visual={<img src="/macbook-chip.jpg" alt="M4 Pro chip" />}
 *     animationIntensity="expressive"
 *   />
 */

"use client";

import { useRef, useEffect, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { SectionBaseProps } from "../_shared/types";
import { getGsapEasing } from "../_shared/animation-config";

gsap.registerPlugin(ScrollTrigger);

interface Metric {
  label: string;
  value: string;
}

interface PinnedTimelineShowcaseProps extends SectionBaseProps {
  title: string;
  subtitle: string;
  metrics?: Metric[];
  /** Visual content (image, video, component) revealed in final phase */
  visual: React.ReactNode;
  /** Scroll distance multiplier (2 = 2x viewport height). Default: 2.5 */
  scrollDistance?: number;
}

export function PinnedTimelineShowcase({
  id,
  title,
  subtitle,
  metrics = [],
  visual,
  scrollDistance = 2.5,
  background,
  className = "",
  animationIntensity = "expressive",
}: PinnedTimelineShowcaseProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile for pin fallback
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Check reduced motion
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const shouldPin = !prefersReducedMotion && !isMobile && animationIntensity !== "minimal";
  const easing = getGsapEasing(animationIntensity);

  useGSAP(
    () => {
      if (!shouldPin || !containerRef.current) return;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: `+=${scrollDistance * 100}%`,
          pin: true,
          scrub: 0.5,
          anticipatePin: 1,
        },
      });

      // Phase 1: Title
      tl.from("[data-showcase='title']", {
        y: 60,
        opacity: 0,
        duration: 0.3,
        ease: easing,
      });

      // Phase 2: Subtitle
      tl.from(
        "[data-showcase='subtitle']",
        { y: 40, opacity: 0, duration: 0.25, ease: easing },
        "-=0.1"
      );

      // Phase 3: Metrics stagger
      if (metrics.length > 0) {
        tl.from("[data-showcase='metric']", {
          y: 30,
          opacity: 0,
          stagger: 0.08,
          duration: 0.25,
          ease: easing,
        });
      }

      // Phase 4: Visual scales in
      tl.from(
        "[data-showcase='visual']",
        { scale: 0.92, opacity: 0, duration: 0.4, ease: "power3.out" },
        "-=0.1"
      );

      // Phase 5: Hold for reading
      tl.to({}, { duration: 0.3 });
    },
    { scope: containerRef, dependencies: [shouldPin, scrollDistance, easing, metrics.length] }
  );

  return (
    <section
      ref={containerRef}
      id={id}
      className={[
        "relative min-h-screen flex items-center justify-center overflow-hidden",
        className,
      ].join(" ")}
    >
      {background && (
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          {background}
        </div>
      )}

      <div className="relative z-10 mx-auto max-w-5xl px-6 text-center">
        <h2
          data-showcase="title"
          className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl text-[#ededed]"
        >
          {title}
        </h2>

        <p
          data-showcase="subtitle"
          className="mx-auto mt-6 max-w-2xl text-lg text-[#a1a1a1]"
        >
          {subtitle}
        </p>

        {metrics.length > 0 && (
          <div className="mt-10 flex flex-wrap items-center justify-center gap-8">
            {metrics.map((metric, i) => (
              <div key={i} data-showcase="metric" className="text-center">
                <div className="text-3xl font-bold tabular-nums text-[#ededed]">
                  {metric.value}
                </div>
                <div className="mt-1 text-sm text-[#a1a1a1]">{metric.label}</div>
              </div>
            ))}
          </div>
        )}

        <div data-showcase="visual" className="mt-12">
          {visual}
        </div>
      </div>
    </section>
  );
}
