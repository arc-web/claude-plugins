/**
 * NewsletterCTA — Email capture section with validation animation.
 *
 * Clean email signup with inline validation, success animation, and
 * optional description. Minimal footprint for page closers.
 *
 * Taxonomy: website · all industries · all intensities
 *
 * Dependencies: pnpm add motion (Framer Motion v12+)
 *
 * Usage:
 *   <NewsletterCTA
 *     heading="Stay in the loop"
 *     description="Get weekly tips and updates delivered to your inbox."
 *     placeholder="Enter your email"
 *     buttonText="Subscribe"
 *     animationIntensity="gentle"
 *   />
 */

"use client";

import { useState, type ReactNode, type FormEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import type { SectionBaseProps } from "../_shared/types";
import { getMotionTransition } from "../_shared/animation-config";
import { useSectionAnimation } from "../_shared/use-section-animation";

interface NewsletterCTAProps extends SectionBaseProps {
  heading?: ReactNode;
  description?: ReactNode;
  placeholder?: string;
  buttonText?: string;
  successMessage?: string;
  /** Async handler for form submission. Return true for success. */
  onSubmit?: (email: string) => Promise<boolean>;
}

export function NewsletterCTA({
  id,
  heading,
  description,
  placeholder = "Enter your email",
  buttonText = "Subscribe",
  successMessage = "You're subscribed! Check your inbox.",
  onSubmit,
  background,
  className = "",
  animationIntensity = "gentle",
}: NewsletterCTAProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const { ref, isVisible, shouldAnimate, config } = useSectionAnimation({
    intensity: animationIntensity,
  });
  const transition = getMotionTransition(animationIntensity);

  const headingId = id ? `${id}-heading` : heading ? "newsletter-heading" : undefined;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Basic email validation
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setStatus("error");
      setErrorMsg("Please enter a valid email address");
      return;
    }

    setStatus("loading");

    if (onSubmit) {
      const success = await onSubmit(email);
      setStatus(success ? "success" : "error");
      if (!success) setErrorMsg("Something went wrong. Please try again.");
    } else {
      // Demo mode: simulate success
      await new Promise((r) => setTimeout(r, 800));
      setStatus("success");
    }
  };

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      id={id}
      className={["relative py-16 md:py-24", className].join(" ")}
      aria-labelledby={headingId}
    >
      {background && (
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          {background}
        </div>
      )}

      <div className="relative z-10 mx-auto w-[min(100%-2rem,560px)] text-center">
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
            className="mt-3 text-sm text-[#a1a1a1] md:text-base"
            initial={shouldAnimate ? { opacity: 0, y: 8 } : false}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ ...transition, delay: config.stagger }}
          >
            {description}
          </motion.p>
        )}

        <motion.div
          className="mt-8"
          initial={shouldAnimate ? { opacity: 0, y: 10 } : false}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ ...transition, delay: config.stagger * 2 }}
        >
          <AnimatePresence mode="wait">
            {status === "success" ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center justify-center gap-2 rounded-lg bg-emerald-500/10 px-4 py-3 text-sm text-emerald-400"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M4 8l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {successMessage}
              </motion.div>
            ) : (
              <motion.form
                key="form"
                onSubmit={handleSubmit}
                className="flex flex-col gap-3 sm:flex-row"
              >
                <div className="relative flex-1">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setStatus("idle"); }}
                    placeholder={placeholder}
                    disabled={status === "loading"}
                    className={[
                      "w-full rounded-lg border bg-white/[0.04] px-4 py-3 text-sm text-[#ededed] placeholder-[#666] outline-none transition-colors",
                      status === "error"
                        ? "border-red-500/50 focus:border-red-500"
                        : "border-white/[0.08] focus:border-white/20",
                    ].join(" ")}
                    aria-invalid={status === "error"}
                    aria-describedby={status === "error" ? "newsletter-error" : undefined}
                  />
                </div>
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="shrink-0 rounded-lg bg-white px-6 py-3 text-sm font-medium text-black transition-opacity hover:opacity-90 disabled:opacity-50"
                >
                  {status === "loading" ? (
                    <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-black/20 border-t-black/60" />
                  ) : (
                    buttonText
                  )}
                </button>
              </motion.form>
            )}
          </AnimatePresence>

          {status === "error" && (
            <p id="newsletter-error" className="mt-2 text-xs text-red-400" role="alert">
              {errorMsg}
            </p>
          )}
        </motion.div>
      </div>
    </section>
  );
}
