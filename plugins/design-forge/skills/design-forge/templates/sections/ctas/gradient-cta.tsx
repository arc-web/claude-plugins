/**
 * GradientCTA — Final call-to-action section with gradient background.
 *
 * Full-width section with gradient background, headline, description,
 * and action buttons. Designed as the closing section of a landing page.
 *
 * Taxonomy: website · all industries · all intensities
 * Decomposed from: Google Gemini CTA footer pattern
 *
 * Dependencies: pnpm add motion (Framer Motion v12+)
 *
 * Usage:
 *   <GradientCTA
 *     heading="Ready to get started?"
 *     description="Join thousands of teams building with our platform."
 *     primaryCta={<a href="/signup">Start for Free</a>}
 *     secondaryCta={<a href="/contact">Talk to Sales</a>}
 *     gradientFrom="#4a78ff"
 *     gradientTo="#9333ea"
 *     animationIntensity="moderate"
 *   />
 */

"use client";

import { type ReactNode } from "react";
import { motion } from "motion/react";
import type { SectionBaseProps } from "../_shared/types";
import { getMotionTransition } from "../_shared/animation-config";
import { useSectionAnimation } from "../_shared/use-section-animation";

interface GradientCTAProps extends SectionBaseProps {
  heading: ReactNode;
  description?: ReactNode;
  primaryCta?: ReactNode;
  secondaryCta?: ReactNode;
  /** Gradient start color. Default: "#4a78ff" */
  gradientFrom?: string;
  /** Gradient end color. Default: "#9333ea" */
  gradientTo?: string;
  /** Gradient direction. Default: "to bottom right" */
  gradientDirection?: string;
}

export function GradientCTA({
  id,
  heading,
  description,
  primaryCta,
  secondaryCta,
  background,
  className = "",
  animationIntensity = "moderate",
  gradientFrom = "#4a78ff",
  gradientTo = "#9333ea",
  gradientDirection = "to bottom right",
}: GradientCTAProps) {
  const { ref, isVisible, shouldAnimate, config } = useSectionAnimation({
    intensity: animationIntensity,
  });
  const transition = getMotionTransition(animationIntensity);

  const headingId = id ? `${id}-heading` : "cta-heading";

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      id={id}
      className={["relative overflow-hidden py-16 md:py-24", className].join(" ")}
      aria-labelledby={headingId}
    >
      {/* Gradient background */}
      <div
        className="absolute inset-0 opacity-20"
        aria-hidden="true"
        style={{
          background: `linear-gradient(${gradientDirection}, ${gradientFrom}, ${gradientTo})`,
        }}
      />

      {/* Subtle noise/grain overlay for texture */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        aria-hidden="true"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
        }}
      />

      {background && (
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          {background}
        </div>
      )}

      <div className="relative z-10 mx-auto flex max-w-3xl flex-col items-center px-6 text-center">
        <motion.h2
          id={headingId}
          className="text-3xl font-semibold tracking-[-0.03em] text-[#ededed] md:text-4xl lg:text-5xl"
          initial={shouldAnimate ? { opacity: 0, y: 16 } : false}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={transition}
        >
          {heading}
        </motion.h2>

        {description && (
          <motion.p
            className="mt-4 max-w-xl text-base leading-relaxed text-[#a1a1a1] md:text-lg"
            initial={shouldAnimate ? { opacity: 0, y: 12 } : false}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ ...transition, delay: config.stagger * 2 }}
          >
            {description}
          </motion.p>
        )}

        {(primaryCta || secondaryCta) && (
          <motion.div
            className="mt-8 flex flex-col items-center gap-4 sm:flex-row"
            initial={shouldAnimate ? { opacity: 0, y: 10 } : false}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ ...transition, delay: config.stagger * 4 }}
          >
            {primaryCta}
            {secondaryCta}
          </motion.div>
        )}
      </div>
    </section>
  );
}
