/**
 * CounterBar — Section with multiple animated metric counters.
 *
 * Wraps ScrollCounter instances in a responsive section with heading,
 * labels, and viewport-triggered animation. Promoted from scroll-counter
 * with added: section framing, multi-counter layout, intensity-aware timing.
 *
 * Taxonomy: all platforms · all industries · gentle-expressive intensity
 * Decomposed from: Apple MacBook Pro metric counters pattern
 *
 * Dependencies: pnpm add motion (Framer Motion v12+)
 *
 * Usage:
 *   <CounterBar
 *     heading="By the numbers"
 *     metrics={[
 *       { target: 2847, suffix: "+", label: "Active users" },
 *       { target: 99.9, suffix: "%", decimals: 1, label: "Uptime" },
 *       { target: 1250000, prefix: "$", label: "Processed" },
 *       { target: 4.9, decimals: 1, label: "Rating" },
 *     ]}
 *     animationIntensity="gentle"
 *   />
 */

"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { motion, useInView, useMotionValue, animate, useReducedMotion } from "motion/react";
import type { SectionBaseProps } from "../_shared/types";
import { getAnimationConfig, getMotionTransition } from "../_shared/animation-config";
import { useSectionAnimation } from "../_shared/use-section-animation";

export interface MetricItem {
  /** Target number to count up to */
  target: number;
  /** Suffix (e.g., "%", "+", "k") */
  suffix?: string;
  /** Prefix (e.g., "$", "#") */
  prefix?: string;
  /** Decimal places. Default: 0 */
  decimals?: number;
  /** Label below the number */
  label: string;
}

interface CounterBarProps extends SectionBaseProps {
  heading?: ReactNode;
  description?: ReactNode;
  metrics: MetricItem[];
  /** Layout: horizontal bar or centered grid. Default: "bar" */
  layout?: "bar" | "grid";
}

/** Individual animated counter (internalized ScrollCounter) */
function Counter({
  target,
  suffix = "",
  prefix = "",
  decimals = 0,
  duration,
  isInView,
  shouldAnimate,
}: MetricItem & { duration: number; isInView: boolean; shouldAnimate: boolean }) {
  const ref = useRef<HTMLSpanElement>(null);
  const count = useMotionValue(0);

  useEffect(() => {
    if (!isInView || !shouldAnimate) return;

    const controls = animate(count, target, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (latest) => {
        if (!ref.current) return;
        const formatted =
          decimals > 0 ? latest.toFixed(decimals) : Math.round(latest).toString();
        const display = Number(formatted).toLocaleString(undefined, {
          minimumFractionDigits: decimals,
          maximumFractionDigits: decimals,
        });
        ref.current.textContent = `${prefix}${display}${suffix}`;
      },
    });

    return controls.stop;
  }, [isInView, shouldAnimate, target, duration, decimals, prefix, suffix, count]);

  return (
    <span
      ref={ref}
      className="text-[clamp(2rem,5vw,3.5rem)] font-semibold tracking-[-0.03em] text-[#ededed] tabular-nums"
      aria-label={`${prefix}${target.toLocaleString()}${suffix}`}
    >
      {shouldAnimate ? `${prefix}0${suffix}` : `${prefix}${target.toLocaleString()}${suffix}`}
    </span>
  );
}

export function CounterBar({
  id,
  heading,
  description,
  metrics,
  layout = "bar",
  background,
  className = "",
  animationIntensity = "moderate",
}: CounterBarProps) {
  const { ref, isVisible, shouldAnimate, config } = useSectionAnimation({
    intensity: animationIntensity,
  });
  const transition = getMotionTransition(animationIntensity);

  // Map intensity to counter duration: gentle=1.5s, moderate=1.0s, expressive=0.8s
  const counterDuration = {
    minimal: 0,
    gentle: 1.5,
    moderate: 1.0,
    expressive: 0.8,
  }[animationIntensity];

  const headingId = id ? `${id}-heading` : heading ? "counter-bar-heading" : undefined;

  const gridClass =
    layout === "grid"
      ? "grid grid-cols-2 lg:grid-cols-4 gap-8"
      : "flex flex-wrap justify-center gap-8 md:gap-16";

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      id={id}
      className={[
        "relative mx-auto w-[min(100%-2rem,1200px)] py-16 md:py-24",
        className,
      ].join(" ")}
      aria-labelledby={headingId}
    >
      {background && (
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          {background}
        </div>
      )}

      <div className="relative z-10">
        {(heading || description) && (
          <div className="mb-12 text-center">
            {heading && (
              <motion.h2
                id={headingId}
                className="text-2xl font-semibold tracking-[-0.03em] text-[#ededed] md:text-3xl"
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

        <div className={gridClass}>
          {metrics.map((metric, i) => (
            <motion.div
              key={metric.label}
              className="flex flex-col items-center text-center"
              initial={shouldAnimate ? { opacity: 0, y: 16 } : false}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{
                ...transition,
                delay: config.stagger * (i + 2),
              }}
            >
              <Counter
                {...metric}
                duration={counterDuration}
                isInView={isVisible}
                shouldAnimate={shouldAnimate}
              />
              <span className="mt-2 text-sm text-[#a1a1a1]">{metric.label}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
