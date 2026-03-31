/**
 * TestimonialCarousel — Quote carousel with avatars, auto-play, keyboard nav.
 *
 * Rotating testimonials with avatar, name, role, and company. Auto-advances
 * with pause on hover/focus. Keyboard navigable (arrow keys).
 *
 * Taxonomy: website · all industries · gentle-expressive intensity
 *
 * Dependencies: pnpm add motion (Framer Motion v12+)
 *
 * Usage:
 *   <TestimonialCarousel
 *     heading="What our customers say"
 *     testimonials={[
 *       { quote: "Game changer.", name: "Jane Doe", role: "CTO", company: "Acme", avatar: "/avatars/jane.jpg" },
 *       { quote: "Love it.", name: "John Smith", role: "Founder", company: "Beta Inc" },
 *     ]}
 *     animationIntensity="moderate"
 *   />
 */

"use client";

import { useState, useEffect, useCallback, type ReactNode } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import type { SectionBaseProps } from "../_shared/types";
import { getMotionTransition } from "../_shared/animation-config";
import { useSectionAnimation } from "../_shared/use-section-animation";

export interface Testimonial {
  quote: string;
  name: string;
  role?: string;
  company?: string;
  avatar?: string;
}

interface TestimonialCarouselProps extends SectionBaseProps {
  heading?: ReactNode;
  description?: ReactNode;
  testimonials: Testimonial[];
  /** Auto-advance interval in ms. 0 to disable. Default: 5000 */
  autoPlayInterval?: number;
}

export function TestimonialCarousel({
  id,
  heading,
  description,
  testimonials,
  autoPlayInterval = 5000,
  background,
  className = "",
  animationIntensity = "moderate",
}: TestimonialCarouselProps) {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const prefersReducedMotion = useReducedMotion();
  const { ref, isVisible, shouldAnimate, config } = useSectionAnimation({
    intensity: animationIntensity,
  });
  const transition = getMotionTransition(animationIntensity);

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % testimonials.length);
  }, [testimonials.length]);

  const prev = useCallback(() => {
    setCurrent((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  }, [testimonials.length]);

  // Auto-advance
  useEffect(() => {
    if (!autoPlayInterval || isPaused || prefersReducedMotion) return;
    const timer = setInterval(next, autoPlayInterval);
    return () => clearInterval(timer);
  }, [autoPlayInterval, isPaused, next, prefersReducedMotion]);

  // Keyboard navigation
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowRight") next();
      else if (e.key === "ArrowLeft") prev();
    },
    [next, prev]
  );

  const headingId = id ? `${id}-heading` : heading ? "testimonial-heading" : undefined;
  const t = testimonials[current];

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      id={id}
      className={["relative py-16 md:py-24 overflow-hidden", className].join(" ")}
      aria-labelledby={headingId}
    >
      {background && (
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          {background}
        </div>
      )}

      <div className="relative z-10 mx-auto w-[min(100%-2rem,800px)]">
        {heading && (
          <motion.h2
            id={headingId}
            className="mb-12 text-center text-2xl font-semibold tracking-[-0.03em] text-[#ededed] md:text-3xl"
            initial={shouldAnimate ? { opacity: 0, y: 12 } : false}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={transition}
          >
            {heading}
          </motion.h2>
        )}

        <div
          role="region"
          aria-roledescription="carousel"
          aria-label="Testimonials"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onFocus={() => setIsPaused(true)}
          onBlur={() => setIsPaused(false)}
          onKeyDown={handleKeyDown}
          tabIndex={0}
          className="focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40 rounded-2xl"
        >
          <AnimatePresence mode="wait">
            <motion.blockquote
              key={current}
              className="flex flex-col items-center text-center"
              initial={shouldAnimate ? { opacity: 0, x: 20 } : false}
              animate={{ opacity: 1, x: 0 }}
              exit={shouldAnimate ? { opacity: 0, x: -20 } : undefined}
              transition={transition}
              aria-live="polite"
            >
              <p className="text-xl leading-relaxed text-[#ededed] md:text-2xl lg:text-3xl font-medium">
                &ldquo;{t.quote}&rdquo;
              </p>

              <footer className="mt-8 flex items-center gap-4">
                {t.avatar && (
                  <img
                    src={t.avatar}
                    alt=""
                    className="h-12 w-12 rounded-full object-cover"
                  />
                )}
                <div className="text-left">
                  <cite className="not-italic text-sm font-medium text-[#ededed]">
                    {t.name}
                  </cite>
                  {(t.role || t.company) && (
                    <div className="text-xs text-[#a1a1a1]">
                      {[t.role, t.company].filter(Boolean).join(", ")}
                    </div>
                  )}
                </div>
              </footer>
            </motion.blockquote>
          </AnimatePresence>

          {/* Dots navigation */}
          {testimonials.length > 1 && (
            <div className="mt-8 flex justify-center gap-2" role="tablist">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  role="tab"
                  aria-selected={i === current}
                  aria-label={`Testimonial ${i + 1}`}
                  onClick={() => setCurrent(i)}
                  className={[
                    "h-2 rounded-full transition-all duration-300",
                    i === current ? "w-6 bg-white/60" : "w-2 bg-white/20 hover:bg-white/30",
                  ].join(" ")}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
