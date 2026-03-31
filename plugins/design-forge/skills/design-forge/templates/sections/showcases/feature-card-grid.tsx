/**
 * FeatureCardGrid — Gemini-style feature showcase with icon cards + stagger reveal.
 *
 * Section wrapper around elevated cards with viewport-triggered stagger animation.
 * Promoted from feature-cards with added: animation intensity, entrance stagger,
 * hover escalation, reduced-motion support.
 *
 * Taxonomy: all platforms · all industries · gentle-expressive intensity
 * Decomposed from: Google Gemini feature showcase section
 *
 * Dependencies: pnpm add motion (Framer Motion v12+)
 *
 * Usage:
 *   <FeatureCardGrid
 *     eyebrow="Features"
 *     heading="Everything you need"
 *     items={[
 *       { icon: <BoltIcon />, title: "Fast", description: "Deploy in seconds" },
 *       { icon: <ShieldIcon />, title: "Secure", description: "Enterprise-grade" },
 *       { icon: <CodeIcon />, title: "Simple", description: "Clean DX" },
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

export interface FeatureItem {
  icon?: ReactNode;
  title: string;
  description: string;
}

interface FeatureCardGridProps extends SectionBaseProps {
  eyebrow?: string;
  heading?: ReactNode;
  description?: ReactNode;
  items: FeatureItem[];
  columns?: 2 | 3 | 4;
}

const COL_MAP: Record<number, string> = {
  2: "md:grid-cols-2",
  3: "md:grid-cols-2 lg:grid-cols-3",
  4: "md:grid-cols-2 lg:grid-cols-4",
};

export function FeatureCardGrid({
  id,
  eyebrow,
  heading,
  description,
  items,
  columns = 3,
  background,
  className = "",
  animationIntensity = "moderate",
}: FeatureCardGridProps) {
  const { ref, isVisible, shouldAnimate, config } = useSectionAnimation({
    intensity: animationIntensity,
  });
  const transition = getMotionTransition(animationIntensity);

  const headingId = id ? `${id}-heading` : heading ? "feature-grid-heading" : undefined;

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

      <ul
        className={["relative z-10 grid grid-cols-1 gap-4", COL_MAP[columns]].join(" ")}
        role="list"
      >
        {items.map((item, i) => (
          <motion.li
            key={item.title}
            className="group rounded-xl border border-[#333] bg-[#0a0a0a] p-6 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)] transition-colors duration-300 hover:border-[#444] hover:bg-white/[0.02]"
            initial={shouldAnimate ? { opacity: 0, y: 20 } : false}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{
              ...transition,
              delay: config.stagger * (i + 3),
            }}
            whileHover={
              shouldAnimate
                ? { y: -2, transition: { duration: 0.2, ease: "easeOut" } }
                : undefined
            }
          >
            {item.icon && (
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-white/[0.06] text-[#ededed]">
                {item.icon}
              </div>
            )}
            <h3 className="text-base font-medium tracking-tight text-[#ededed]">
              {item.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-[#a1a1a1]">
              {item.description}
            </p>
          </motion.li>
        ))}
      </ul>
    </section>
  );
}
