/**
 * InteractiveDemo — Iframe playground with loading states.
 *
 * Embedded live preview / playground section. Handles loading states,
 * responsive container, and optional tab switching between demos.
 *
 * Taxonomy: website · saas/creative · moderate-expressive intensity
 * Decomposed from: Google Gemini interactive demo pattern
 *
 * Dependencies: pnpm add motion (Framer Motion v12+)
 *
 * Usage:
 *   <InteractiveDemo
 *     heading="Try it yourself"
 *     demos={[
 *       { label: "Chat", src: "https://demo.example.com/chat" },
 *       { label: "Code", src: "https://demo.example.com/code" },
 *     ]}
 *     animationIntensity="moderate"
 *   />
 */

"use client";

import { useState, type ReactNode } from "react";
import { motion } from "motion/react";
import type { SectionBaseProps } from "../_shared/types";
import { getMotionTransition } from "../_shared/animation-config";
import { useSectionAnimation } from "../_shared/use-section-animation";

interface Demo {
  label: string;
  src: string;
  /** Aspect ratio override. Default: "16/9" */
  aspectRatio?: string;
}

interface InteractiveDemoProps extends SectionBaseProps {
  heading?: ReactNode;
  description?: ReactNode;
  /** Single demo or array for tabbed interface */
  demos: Demo[];
}

export function InteractiveDemo({
  id,
  heading,
  description,
  demos,
  background,
  className = "",
  animationIntensity = "moderate",
}: InteractiveDemoProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const { ref, isVisible, shouldAnimate, config } = useSectionAnimation({
    intensity: animationIntensity,
  });
  const transition = getMotionTransition(animationIntensity);

  const headingId = id ? `${id}-heading` : heading ? "demo-heading" : undefined;
  const activeDemo = demos[activeIndex];

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      id={id}
      className={["relative py-16 md:py-24", className].join(" ")}
      aria-labelledby={headingId}
    >
      {background && (
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          {background}
        </div>
      )}

      <div className="relative z-10 mx-auto w-[min(100%-2rem,1100px)]">
        {(heading || description) && (
          <div className="mb-10 text-center">
            {heading && (
              <motion.h2
                id={headingId}
                className="text-3xl font-semibold tracking-[-0.03em] text-[#ededed] md:text-4xl"
                initial={shouldAnimate ? { opacity: 0, y: 12 } : false}
                animate={isVisible ? { opacity: 1, y: 0 } : {}}
                transition={transition}
              >
                {heading}
              </motion.h2>
            )}
            {description && (
              <motion.p
                className="mt-3 text-base text-[#a1a1a1]"
                initial={shouldAnimate ? { opacity: 0, y: 8 } : false}
                animate={isVisible ? { opacity: 1, y: 0 } : {}}
                transition={{ ...transition, delay: config.stagger }}
              >
                {description}
              </motion.p>
            )}
          </div>
        )}

        {/* Tabs (if multiple demos) */}
        {demos.length > 1 && (
          <motion.div
            className="mb-6 flex justify-center gap-1 rounded-lg bg-white/[0.04] p-1"
            initial={shouldAnimate ? { opacity: 0, y: 8 } : false}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ ...transition, delay: config.stagger * 2 }}
            role="tablist"
          >
            {demos.map((demo, i) => (
              <button
                key={demo.label}
                role="tab"
                aria-selected={i === activeIndex}
                onClick={() => { setActiveIndex(i); setIsLoading(true); }}
                className={[
                  "rounded-md px-4 py-2 text-sm font-medium transition-colors",
                  i === activeIndex
                    ? "bg-white/10 text-[#ededed]"
                    : "text-[#a1a1a1] hover:text-[#ededed]",
                ].join(" ")}
              >
                {demo.label}
              </button>
            ))}
          </motion.div>
        )}

        {/* Demo container */}
        <motion.div
          className="relative overflow-hidden rounded-xl border border-white/[0.08] bg-[#0a0a0a]"
          initial={shouldAnimate ? { opacity: 0, y: 16 } : false}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ ...transition, delay: config.stagger * 3 }}
        >
          {/* Loading skeleton */}
          {isLoading && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-[#0a0a0a]">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-white/20 border-t-white/60" />
            </div>
          )}

          <div style={{ aspectRatio: activeDemo.aspectRatio ?? "16/9" }}>
            <iframe
              src={activeDemo.src}
              title={activeDemo.label}
              className="h-full w-full border-0"
              onLoad={() => setIsLoading(false)}
              sandbox="allow-scripts allow-same-origin allow-popups"
              loading="lazy"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
