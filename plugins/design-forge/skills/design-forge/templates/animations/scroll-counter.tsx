/**
 * Scroll Counter — Animated metric that counts up on viewport entry
 *
 * Numbers animate from 0 to target when the element scrolls into view.
 * Supports integer and decimal targets, custom suffixes, and locale formatting.
 *
 * Taxonomy: all platforms · all industries · gentle-expressive intensity
 *
 * Dependencies: pnpm add motion (Framer Motion v12+)
 */

"use client";

import { useEffect, useRef } from "react";
import { useInView, useMotionValue, animate } from "motion/react";

interface ScrollCounterProps {
  /** Target number to count up to */
  target: number;
  /** Suffix to append (e.g., "%", "+", "k") */
  suffix?: string;
  /** Prefix to prepend (e.g., "$", "#") */
  prefix?: string;
  /** Animation duration in seconds. Health: 1.5, SaaS: 0.8, Fintech: 0.5 */
  duration?: number;
  /** Decimal places to show. Default: 0 (integers) */
  decimals?: number;
  /** Use locale formatting (1,000 vs 1000). Default: true */
  localeFormat?: boolean;
  /** CSS class for the number display */
  className?: string;
}

export function ScrollCounter({
  target,
  suffix = "",
  prefix = "",
  duration = 1.2,
  decimals = 0,
  localeFormat = true,
  className,
}: ScrollCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const count = useMotionValue(0);

  useEffect(() => {
    if (!isInView) return;

    const controls = animate(count, target, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (latest) => {
        if (!ref.current) return;

        const formatted = decimals > 0
          ? latest.toFixed(decimals)
          : Math.round(latest).toString();

        const display = localeFormat
          ? Number(formatted).toLocaleString(undefined, {
              minimumFractionDigits: decimals,
              maximumFractionDigits: decimals,
            })
          : formatted;

        ref.current.textContent = `${prefix}${display}${suffix}`;
      },
    });

    return controls.stop;
  }, [isInView, target, duration, decimals, localeFormat, prefix, suffix, count]);

  return (
    <span
      ref={ref}
      className={className}
      aria-label={`${prefix}${target.toLocaleString()}${suffix}`}
    >
      {prefix}0{suffix}
    </span>
  );
}

/**
 * Usage examples:
 *
 * <ScrollCounter target={2847} suffix="+" duration={1.5} />
 * → "2,847+" (health: gentle timing)
 *
 * <ScrollCounter target={99.9} suffix="%" decimals={1} duration={0.8} />
 * → "99.9%" (SaaS: snappy timing)
 *
 * <ScrollCounter target={1250000} prefix="$" duration={0.5} />
 * → "$1,250,000" (fintech: fast, precise)
 */
