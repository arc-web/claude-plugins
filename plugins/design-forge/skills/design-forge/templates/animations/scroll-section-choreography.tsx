/**
 * Scroll Section Choreography — Apple MacBook-style pinned showcase
 *
 * Full-viewport section pinned in place while a GSAP timeline scrubs
 * through a phased content reveal: title → subtitle → metrics → visual.
 *
 * Taxonomy: website (saas, creative) · apple-showcase preset · expressive intensity
 *
 * Dependencies: pnpm add gsap @gsap/react
 */

"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface Metric {
  label: string;
  value: string;
}

interface ScrollSectionProps {
  title: string;
  subtitle: string;
  metrics: Metric[];
  visual: React.ReactNode;
  /** Scroll distance multiplier. 2 = 2x viewport height of scroll. Default: 2.5 */
  scrollDistance?: number;
}

export function ScrollSectionChoreography({
  title,
  subtitle,
  metrics,
  visual,
  scrollDistance = 2.5,
}: ScrollSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
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

      // Phase 1: Title slides up and fades in
      tl.from("[data-choreography='title']", {
        y: 60,
        opacity: 0,
        duration: 0.3,
        ease: "power2.out",
      });

      // Phase 2: Subtitle follows
      tl.from(
        "[data-choreography='subtitle']",
        {
          y: 40,
          opacity: 0,
          duration: 0.25,
          ease: "power2.out",
        },
        "-=0.1"
      );

      // Phase 3: Metrics fan out with stagger
      tl.from("[data-choreography='metric']", {
        y: 30,
        opacity: 0,
        stagger: 0.08,
        duration: 0.25,
        ease: "power2.out",
      });

      // Phase 4: Visual scales in
      tl.from(
        "[data-choreography='visual']",
        {
          scale: 0.92,
          opacity: 0,
          duration: 0.4,
          ease: "power3.out",
        },
        "-=0.1"
      );

      // Phase 5: Hold for reading (empty space in timeline)
      tl.to({}, { duration: 0.3 });
    },
    { scope: containerRef }
  );

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      <div className="mx-auto max-w-5xl px-6 text-center">
        <h2
          data-choreography="title"
          className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl"
        >
          {title}
        </h2>

        <p
          data-choreography="subtitle"
          className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground"
        >
          {subtitle}
        </p>

        {metrics.length > 0 && (
          <div className="mt-10 flex flex-wrap items-center justify-center gap-8">
            {metrics.map((metric, i) => (
              <div key={i} data-choreography="metric" className="text-center">
                <div className="text-3xl font-bold tabular-nums">
                  {metric.value}
                </div>
                <div className="mt-1 text-sm text-muted-foreground">
                  {metric.label}
                </div>
              </div>
            ))}
          </div>
        )}

        <div data-choreography="visual" className="mt-12">
          {visual}
        </div>
      </div>
    </section>
  );
}
