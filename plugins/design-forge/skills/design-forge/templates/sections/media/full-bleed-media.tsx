/**
 * FullBleedMedia — Edge-to-edge image/video with overlay text.
 *
 * Viewport-width media section with optional text overlay, gradient scrim,
 * and scroll-triggered fade. Gemini-style full-bleed visual.
 *
 * Taxonomy: website · all industries · all intensities
 * Decomposed from: Google Gemini full-bleed media sections
 *
 * Dependencies: pnpm add motion (Framer Motion v12+)
 *
 * Usage:
 *   <FullBleedMedia
 *     src="/feature-hero.jpg"
 *     alt="Product showcase"
 *     heading="See the difference"
 *     description="Crystal clear quality in every detail."
 *     overlayPosition="bottom-left"
 *     animationIntensity="moderate"
 *   />
 */

"use client";

import { type ReactNode } from "react";
import { motion } from "motion/react";
import type { SectionBaseProps } from "../_shared/types";
import { getMotionTransition } from "../_shared/animation-config";
import { useSectionAnimation } from "../_shared/use-section-animation";

interface FullBleedMediaProps extends SectionBaseProps {
  /** Image source URL */
  src: string;
  /** Alt text for the image */
  alt: string;
  /** Optional video source (takes priority over image) */
  videoSrc?: string;
  heading?: ReactNode;
  description?: ReactNode;
  /** Where to position the text overlay */
  overlayPosition?: "center" | "bottom-left" | "bottom-center" | "top-left";
  /** Aspect ratio. Default: "16/9" */
  aspectRatio?: string;
  /** Show gradient scrim behind text. Default: true */
  scrim?: boolean;
}

const POSITION_CLASSES: Record<string, string> = {
  center: "items-center justify-center text-center",
  "bottom-left": "items-end justify-start text-left pb-12 pl-8 md:pb-16 md:pl-12",
  "bottom-center": "items-end justify-center text-center pb-12 md:pb-16",
  "top-left": "items-start justify-start text-left pt-12 pl-8 md:pt-16 md:pl-12",
};

const SCRIM_CLASSES: Record<string, string> = {
  center: "bg-black/40",
  "bottom-left": "bg-gradient-to-t from-black/70 via-black/20 to-transparent",
  "bottom-center": "bg-gradient-to-t from-black/70 via-black/20 to-transparent",
  "top-left": "bg-gradient-to-b from-black/70 via-black/20 to-transparent",
};

export function FullBleedMedia({
  id,
  src,
  alt,
  videoSrc,
  heading,
  description,
  overlayPosition = "bottom-left",
  aspectRatio = "16/9",
  scrim = true,
  background,
  className = "",
  animationIntensity = "moderate",
}: FullBleedMediaProps) {
  const { ref, isVisible, shouldAnimate, config } = useSectionAnimation({
    intensity: animationIntensity,
  });
  const transition = getMotionTransition(animationIntensity);

  const headingId = id ? `${id}-heading` : heading ? "bleed-heading" : undefined;

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      id={id}
      className={["relative w-full overflow-hidden", className].join(" ")}
      style={{ aspectRatio }}
      aria-labelledby={headingId}
    >
      {/* Media */}
      {videoSrc ? (
        <video
          src={videoSrc}
          poster={src}
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : (
        <motion.img
          src={src}
          alt={alt}
          className="absolute inset-0 h-full w-full object-cover"
          initial={shouldAnimate ? { scale: 1.05, opacity: 0 } : false}
          animate={isVisible ? { scale: 1, opacity: 1 } : {}}
          transition={{ ...transition, duration: transition.duration * 1.5 }}
          loading="lazy"
        />
      )}

      {/* Scrim */}
      {scrim && (heading || description) && (
        <div
          className={["absolute inset-0", SCRIM_CLASSES[overlayPosition]].join(" ")}
          aria-hidden="true"
        />
      )}

      {/* Text overlay */}
      {(heading || description) && (
        <div
          className={[
            "absolute inset-0 z-10 flex flex-col px-6",
            POSITION_CLASSES[overlayPosition],
          ].join(" ")}
        >
          <div className="max-w-2xl">
            {heading && (
              <motion.h2
                id={headingId}
                className="text-2xl font-semibold text-white md:text-4xl lg:text-5xl"
                initial={shouldAnimate ? { opacity: 0, y: 16 } : false}
                animate={isVisible ? { opacity: 1, y: 0 } : {}}
                transition={transition}
              >
                {heading}
              </motion.h2>
            )}
            {description && (
              <motion.p
                className="mt-3 text-sm text-white/80 md:text-base lg:text-lg"
                initial={shouldAnimate ? { opacity: 0, y: 10 } : false}
                animate={isVisible ? { opacity: 1, y: 0 } : {}}
                transition={{ ...transition, delay: config.stagger * 2 }}
              >
                {description}
              </motion.p>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
