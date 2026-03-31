/**
 * StatsShowcase — Static numbers with labels (no animation variant).
 *
 * Clean, minimal stat display for industries that don't want animated
 * counters (fintech, legal). Optional subtle fade-in on viewport entry.
 *
 * Taxonomy: website/webapp · fintech/legal/health · minimal-gentle intensity
 *
 * Dependencies: pnpm add motion (Framer Motion v12+)
 *
 * Usage:
 *   <StatsShowcase
 *     stats={[
 *       { value: "$2.4B", label: "Assets managed" },
 *       { value: "99.99%", label: "Uptime" },
 *       { value: "150+", label: "Enterprise clients" },
 *       { value: "SOC 2", label: "Certified" },
 *     ]}
 *     animationIntensity="minimal"
 *   />
 */

"use client";

import { type ReactNode } from "react";
import { motion } from "motion/react";
import type { SectionBaseProps } from "../_shared/types";
import { getMotionTransition } from "../_shared/animation-config";
import { useSectionAnimation } from "../_shared/use-section-animation";

export interface Stat {
  value: string;
  label: string;
  /** Optional description below the label */
  description?: string;
}

interface StatsShowcaseProps extends SectionBaseProps {
  heading?: ReactNode;
  stats: Stat[];
  /** Layout direction. Default: "horizontal" */
  layout?: "horizontal" | "grid";
  /** Number of columns for grid layout. Default: 4 */
  columns?: 2 | 3 | 4;
}

export function StatsShowcase({
  id,
  heading,
  stats,
  layout = "horizontal",
  columns = 4,
  background,
  className = "",
  animationIntensity = "minimal",
}: StatsShowcaseProps) {
  const { ref, isVisible, shouldAnimate, config } = useSectionAnimation({
    intensity: animationIntensity,
  });
  const transition = getMotionTransition(animationIntensity);

  const headingId = id ? `${id}-heading` : heading ? "stats-heading" : undefined;

  const containerClass =
    layout === "grid"
      ? `grid grid-cols-2 md:grid-cols-${columns} gap-8`
      : "flex flex-wrap items-start justify-center gap-8 md:gap-16";

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      id={id}
      className={["relative py-12 md:py-20", className].join(" ")}
      aria-labelledby={headingId}
    >
      {background && (
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          {background}
        </div>
      )}

      <div className="relative z-10 mx-auto w-[min(100%-2rem,1000px)]">
        {heading && (
          <motion.h2
            id={headingId}
            className="mb-10 text-center text-2xl font-semibold tracking-[-0.03em] text-[#ededed] md:text-3xl"
            initial={shouldAnimate ? { opacity: 0, y: 8 } : false}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={transition}
          >
            {heading}
          </motion.h2>
        )}

        <div className={containerClass}>
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              className="flex flex-col items-center text-center"
              initial={shouldAnimate ? { opacity: 0, y: 8 } : false}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ ...transition, delay: config.stagger * (i + 1) }}
            >
              <span className="text-3xl font-bold text-[#ededed] tabular-nums md:text-4xl">
                {stat.value}
              </span>
              <span className="mt-2 text-sm font-medium text-[#a1a1a1]">
                {stat.label}
              </span>
              {stat.description && (
                <span className="mt-1 text-xs text-[#666]">{stat.description}</span>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
