/**
 * GradientHeadlineHero — Gemini-style hero with gradient background + large headline.
 *
 * Full-viewport hero with announcement bar, fluid headline, gradient background,
 * and entrance animation driven by taxonomy intensity. Promoted from hero-centered
 * with added: gradient bg support, entrance animation, intensity-aware timing.
 *
 * Taxonomy: all platforms · all industries · all intensities
 * Decomposed from: Google Gemini about page hero pattern
 *
 * Dependencies: pnpm add motion (Framer Motion v12+)
 *
 * Usage:
 *   <GradientHeadlineHero
 *     announcement={<span>New: AI-powered features</span>}
 *     heading="Build smarter, ship faster"
 *     description="The platform that transforms how teams work."
 *     primaryCta={<a href="/start">Get Started</a>}
 *     secondaryCta={<a href="/demo">Watch Demo</a>}
 *     animationIntensity="gentle"
 *     gradientFrom="#4a78ff"
 *     gradientTo="#9333ea"
 *   />
 */

"use client";

import { useRef, type ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";
import type { SectionBaseProps, AnimationIntensity } from "../_shared/types";
import { getMotionTransition } from "../_shared/animation-config";

interface GradientHeadlineHeroProps extends SectionBaseProps {
  /** Optional announcement badge/banner above heading */
  announcement?: ReactNode;
  heading: ReactNode;
  /** Apply gradient to heading text. Default: false */
  gradientHeading?: boolean;
  description?: ReactNode;
  primaryCta?: ReactNode;
  secondaryCta?: ReactNode;
  /** Gradient start color for background glow. Default: transparent */
  gradientFrom?: string;
  /** Gradient end color for background glow. Default: transparent */
  gradientTo?: string;
}

export function GradientHeadlineHero({
  id,
  announcement,
  heading,
  gradientHeading = false,
  description,
  primaryCta,
  secondaryCta,
  background,
  className = "",
  animationIntensity = "moderate",
  gradientFrom,
  gradientTo,
}: GradientHeadlineHeroProps) {
  const prefersReducedMotion = useReducedMotion();
  const transition = getMotionTransition(animationIntensity);
  const shouldAnimate = !prefersReducedMotion && animationIntensity !== "minimal";

  const headingId = id ? `${id}-heading` : undefined;

  // Stagger children: announcement → heading → description → CTAs
  const staggerDelay = shouldAnimate ? transition.duration * 0.4 : 0;

  return (
    <section
      id={id}
      className={[
        "relative min-h-[min(100svh,62rem)] overflow-hidden",
        className,
      ].join(" ")}
      aria-labelledby={headingId}
    >
      {/* Background slot */}
      {background && (
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          {background}
        </div>
      )}

      {/* Gradient glow (Gemini-style radial gradient behind content) */}
      {(gradientFrom || gradientTo) && (
        <div
          className="absolute inset-0 pointer-events-none"
          aria-hidden="true"
          style={{
            background: `radial-gradient(ellipse 80% 50% at 50% 40%, ${gradientFrom || "transparent"}, ${gradientTo || "transparent"}, transparent)`,
            opacity: 0.3,
          }}
        />
      )}

      <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center px-6 py-24 text-center md:py-32 lg:py-40">
        {announcement && (
          <motion.div
            className="mb-8 flex items-center gap-3 text-sm text-[#a1a1a1]"
            initial={shouldAnimate ? { opacity: 0, y: 12 } : false}
            animate={{ opacity: 1, y: 0 }}
            transition={transition}
          >
            {announcement}
          </motion.div>
        )}

        <motion.h1
          id={headingId}
          className={[
            "text-[clamp(2.5rem,6vw,4.75rem)] font-semibold leading-[0.95] tracking-[-0.04em] text-[#ededed]",
            gradientHeading
              ? "bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent"
              : "",
          ].join(" ")}
          initial={shouldAnimate ? { opacity: 0, y: 20 } : false}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            ...transition,
            delay: staggerDelay,
          }}
        >
          {heading}
        </motion.h1>

        {description && (
          <motion.p
            className="mt-6 max-w-2xl text-base leading-relaxed text-[#a1a1a1] md:text-lg lg:text-xl"
            initial={shouldAnimate ? { opacity: 0, y: 16 } : false}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              ...transition,
              delay: staggerDelay * 2,
            }}
          >
            {description}
          </motion.p>
        )}

        {(primaryCta || secondaryCta) && (
          <motion.div
            className="mt-10 flex flex-col items-center gap-4 sm:flex-row"
            initial={shouldAnimate ? { opacity: 0, y: 12 } : false}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              ...transition,
              delay: staggerDelay * 3,
            }}
          >
            {primaryCta}
            {secondaryCta}
          </motion.div>
        )}
      </div>
    </section>
  );
}
