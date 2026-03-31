/**
 * SplitMediaHero — Text left + parallax media right.
 *
 * Two-column hero with heading/CTAs on the left and a visual (image, video,
 * or component) on the right with optional parallax effect.
 *
 * Taxonomy: website · all industries · all intensities
 *
 * Dependencies: pnpm add motion (Framer Motion v12+)
 *
 * Usage:
 *   <SplitMediaHero
 *     heading="Ship faster with confidence"
 *     description="The deployment platform that scales with you."
 *     primaryCta={<a href="/start">Get Started</a>}
 *     media={<img src="/product-shot.png" alt="Product" />}
 *     animationIntensity="moderate"
 *   />
 */

"use client";

import { type ReactNode } from "react";
import { motion } from "motion/react";
import type { SectionBaseProps } from "../_shared/types";
import { getMotionTransition } from "../_shared/animation-config";
import { useSectionAnimation } from "../_shared/use-section-animation";

interface SplitMediaHeroProps extends SectionBaseProps {
  eyebrow?: string;
  heading: ReactNode;
  description?: ReactNode;
  primaryCta?: ReactNode;
  secondaryCta?: ReactNode;
  /** Visual content on the right side */
  media: ReactNode;
  /** Reverse layout (media left, text right). Default: false */
  reversed?: boolean;
}

export function SplitMediaHero({
  id,
  eyebrow,
  heading,
  description,
  primaryCta,
  secondaryCta,
  media,
  reversed = false,
  background,
  className = "",
  animationIntensity = "moderate",
}: SplitMediaHeroProps) {
  const { ref, isVisible, shouldAnimate, config } = useSectionAnimation({
    intensity: animationIntensity,
  });
  const transition = getMotionTransition(animationIntensity);

  const headingId = id ? `${id}-heading` : "split-hero-heading";

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      id={id}
      className={[
        "relative min-h-[min(100svh,56rem)] overflow-hidden",
        className,
      ].join(" ")}
      aria-labelledby={headingId}
    >
      {background && (
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          {background}
        </div>
      )}

      <div
        className={[
          "relative z-10 mx-auto flex min-h-[min(100svh,56rem)] w-[min(100%-2rem,1280px)] flex-col items-center gap-12 px-6 py-16 md:flex-row md:gap-16 md:py-24",
          reversed ? "md:flex-row-reverse" : "",
        ].join(" ")}
      >
        {/* Text side */}
        <div className="flex flex-1 flex-col justify-center">
          {eyebrow && (
            <motion.span
              className="mb-4 block font-mono text-xs uppercase tracking-[0.08em] text-white/50"
              initial={shouldAnimate ? { opacity: 0, y: 8 } : false}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={transition}
            >
              {eyebrow}
            </motion.span>
          )}

          <motion.h1
            id={headingId}
            className="text-[clamp(2rem,5vw,3.75rem)] font-semibold leading-[1.05] tracking-[-0.03em] text-[#ededed]"
            initial={shouldAnimate ? { opacity: 0, y: 20 } : false}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ ...transition, delay: config.stagger }}
          >
            {heading}
          </motion.h1>

          {description && (
            <motion.p
              className="mt-5 max-w-lg text-base leading-relaxed text-[#a1a1a1] md:text-lg"
              initial={shouldAnimate ? { opacity: 0, y: 14 } : false}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ ...transition, delay: config.stagger * 2 }}
            >
              {description}
            </motion.p>
          )}

          {(primaryCta || secondaryCta) && (
            <motion.div
              className="mt-8 flex flex-col gap-3 sm:flex-row"
              initial={shouldAnimate ? { opacity: 0, y: 10 } : false}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ ...transition, delay: config.stagger * 3 }}
            >
              {primaryCta}
              {secondaryCta}
            </motion.div>
          )}
        </div>

        {/* Media side */}
        <motion.div
          className="flex flex-1 items-center justify-center"
          initial={shouldAnimate ? { opacity: 0, x: reversed ? -30 : 30, scale: 0.96 } : false}
          animate={isVisible ? { opacity: 1, x: 0, scale: 1 } : {}}
          transition={{ ...transition, delay: config.stagger * 2, duration: transition.duration * 1.2 }}
        >
          {media}
        </motion.div>
      </div>
    </section>
  );
}
