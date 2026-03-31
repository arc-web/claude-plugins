/**
 * CapabilitiesBento — Gemini-style mixed-size capability grid with reveal animation.
 *
 * Section wrapper around BentoGrid with heading, description, viewport-triggered
 * stagger reveal, and hover effects. Promoted from bento-grid with added:
 * section framing, entrance animation, intensity-aware timing.
 *
 * Taxonomy: website/webapp · all industries · gentle-expressive intensity
 * Decomposed from: Google Gemini capabilities grid pattern
 *
 * Dependencies: pnpm add motion (Framer Motion v12+)
 *
 * Usage:
 *   <CapabilitiesBento
 *     eyebrow="Capabilities"
 *     heading="One platform, endless possibilities"
 *     items={[
 *       { title: "Code Generation", description: "...", colSpan: 2, rowSpan: 2, content: <DemoPreview /> },
 *       { title: "Analysis", description: "...", content: <ChartPreview /> },
 *       { title: "Research", description: "...", content: <SearchPreview /> },
 *     ]}
 *     animationIntensity="moderate"
 *   />
 */

"use client";

import { type ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";
import type { SectionBaseProps } from "../_shared/types";
import { getAnimationConfig, getMotionTransition } from "../_shared/animation-config";
import { useSectionAnimation } from "../_shared/use-section-animation";

export interface BentoItem {
  title: string;
  description: string;
  /** Custom content rendered inside the cell (demo previews, charts, etc.) */
  content?: ReactNode;
  icon?: ReactNode;
  colSpan?: 1 | 2 | 3 | 4;
  rowSpan?: 1 | 2 | 3;
}

interface CapabilitiesBentoProps extends SectionBaseProps {
  eyebrow?: string;
  heading?: ReactNode;
  description?: ReactNode;
  items: BentoItem[];
  gap?: number;
  rowHeight?: number;
}

const COL_SPAN: Record<number, string> = {
  1: "col-span-1",
  2: "sm:col-span-2",
  3: "sm:col-span-2 lg:col-span-3",
  4: "sm:col-span-2 lg:col-span-4",
};

const ROW_SPAN: Record<number, string> = {
  1: "row-span-1",
  2: "row-span-2",
  3: "row-span-3",
};

export function CapabilitiesBento({
  id,
  eyebrow,
  heading,
  description,
  items,
  gap = 16,
  rowHeight = 200,
  background,
  className = "",
  animationIntensity = "moderate",
}: CapabilitiesBentoProps) {
  const { ref, isVisible, shouldAnimate, config } = useSectionAnimation({
    intensity: animationIntensity,
  });
  const transition = getMotionTransition(animationIntensity);

  const headingId = id ? `${id}-heading` : heading ? "bento-heading" : undefined;

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      id={id}
      className={[
        "relative mx-auto w-[min(100%-2rem,1200px)] py-20 md:py-28",
        className,
      ].join(" ")}
      aria-labelledby={headingId}
    >
      {background && (
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          {background}
        </div>
      )}

      {(eyebrow || heading) && (
        <div className="relative z-10 mb-12 text-center md:mb-16">
          {eyebrow && (
            <motion.span
              className="mb-3 block font-mono text-xs uppercase tracking-[0.08em] text-white/50"
              initial={shouldAnimate ? { opacity: 0, y: 8 } : false}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={transition}
            >
              {eyebrow}
            </motion.span>
          )}
          {heading && (
            <motion.h2
              id={headingId}
              className="text-3xl font-semibold tracking-[-0.03em] text-[#ededed] md:text-4xl lg:text-5xl"
              initial={shouldAnimate ? { opacity: 0, y: 12 } : false}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ ...transition, delay: config.stagger }}
            >
              {heading}
            </motion.h2>
          )}
          {description && (
            <motion.p
              className="mt-4 mx-auto max-w-2xl text-base text-[#a1a1a1] md:text-lg"
              initial={shouldAnimate ? { opacity: 0, y: 10 } : false}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ ...transition, delay: config.stagger * 2 }}
            >
              {description}
            </motion.p>
          )}
        </div>
      )}

      <div
        className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
        role="list"
        aria-label="Capabilities grid"
        style={{ gap, gridAutoRows: rowHeight }}
      >
        {items.map((item, i) => (
          <motion.div
            key={item.title}
            role="listitem"
            className={[
              "col-span-1",
              COL_SPAN[item.colSpan ?? 1],
              ROW_SPAN[item.rowSpan ?? 1],
              "group rounded-xl border border-white/[0.08] bg-white/[0.02] p-6",
              "transition-colors duration-300 hover:border-white/[0.16] hover:bg-white/[0.04]",
              "focus-within:ring-2 focus-within:ring-blue-500/40",
              "flex flex-col",
            ].join(" ")}
            initial={shouldAnimate ? { opacity: 0, y: 24, scale: 0.97 } : false}
            animate={isVisible ? { opacity: 1, y: 0, scale: 1 } : {}}
            transition={{
              ...transition,
              delay: config.stagger * (i + 3),
            }}
          >
            {item.icon && (
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-white/[0.06] text-[#ededed]">
                {item.icon}
              </div>
            )}
            <h3 className="text-base font-medium tracking-tight text-[#ededed]">
              {item.title}
            </h3>
            <p className="mt-1 text-sm leading-relaxed text-[#a1a1a1]">
              {item.description}
            </p>
            {item.content && (
              <div className="mt-4 flex-1 overflow-hidden rounded-lg">
                {item.content}
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </section>
  );
}
