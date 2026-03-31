/**
 * TrustSignals — Badges, certifications, and key numbers section.
 *
 * Displays trust indicators: security badges, partner logos, key metrics,
 * and certification stamps. Optional count-up animation for numbers.
 *
 * Taxonomy: website · health/fintech/legal/services · all intensities
 *
 * Dependencies: pnpm add motion (Framer Motion v12+)
 *
 * Usage:
 *   <TrustSignals
 *     heading="Trusted & Certified"
 *     signals={[
 *       { type: "metric", value: "10,000+", label: "Happy customers" },
 *       { type: "badge", icon: <ShieldIcon />, label: "SOC 2 Certified" },
 *       { type: "metric", value: "99.9%", label: "Uptime SLA" },
 *       { type: "badge", icon: <LockIcon />, label: "HIPAA Compliant" },
 *     ]}
 *     animationIntensity="gentle"
 *   />
 */

"use client";

import { type ReactNode } from "react";
import { motion } from "motion/react";
import type { SectionBaseProps } from "../_shared/types";
import { getMotionTransition } from "../_shared/animation-config";
import { useSectionAnimation } from "../_shared/use-section-animation";

export interface TrustSignal {
  type: "metric" | "badge";
  /** For metrics: the display value */
  value?: string;
  /** Label shown below the value or badge */
  label: string;
  /** Icon for badges */
  icon?: ReactNode;
}

interface TrustSignalsProps extends SectionBaseProps {
  heading?: ReactNode;
  signals: TrustSignal[];
}

export function TrustSignals({
  id,
  heading,
  signals,
  background,
  className = "",
  animationIntensity = "gentle",
}: TrustSignalsProps) {
  const { ref, isVisible, shouldAnimate, config } = useSectionAnimation({
    intensity: animationIntensity,
  });
  const transition = getMotionTransition(animationIntensity);

  const headingId = id ? `${id}-heading` : heading ? "trust-heading" : undefined;

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      id={id}
      className={["relative py-12 md:py-16", className].join(" ")}
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
            className="mb-10 text-center text-sm font-medium uppercase tracking-[0.08em] text-[#a1a1a1]"
            initial={shouldAnimate ? { opacity: 0, y: 8 } : false}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={transition}
          >
            {heading}
          </motion.h2>
        )}

        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
          {signals.map((signal, i) => (
            <motion.div
              key={signal.label}
              className="flex flex-col items-center text-center"
              initial={shouldAnimate ? { opacity: 0, y: 12 } : false}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ ...transition, delay: config.stagger * (i + 1) }}
            >
              {signal.type === "metric" ? (
                <>
                  <span className="text-2xl font-bold text-[#ededed] tabular-nums md:text-3xl">
                    {signal.value}
                  </span>
                  <span className="mt-1 text-xs text-[#a1a1a1]">{signal.label}</span>
                </>
              ) : (
                <>
                  {signal.icon && (
                    <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-white/[0.06] text-[#a1a1a1]">
                      {signal.icon}
                    </div>
                  )}
                  <span className="text-xs text-[#a1a1a1]">{signal.label}</span>
                </>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
