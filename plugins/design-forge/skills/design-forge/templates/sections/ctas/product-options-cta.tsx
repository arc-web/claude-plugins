/**
 * ProductOptionsCTA — Product selection cards with pricing.
 *
 * Apple-style product selection section where users choose between variants.
 * Cards with specs, pricing, and radio-like selection state.
 *
 * Taxonomy: website · saas/ecommerce · moderate-expressive intensity
 * Decomposed from: Apple MacBook Pro product options section
 *
 * Dependencies: pnpm add motion (Framer Motion v12+)
 *
 * Usage:
 *   <ProductOptionsCTA
 *     heading="Choose your MacBook Pro"
 *     options={[
 *       { name: "14-inch M4", price: "$1,599", features: ["M4 chip", "16GB RAM", "512GB SSD"], badge: "Starting at" },
 *       { name: "14-inch M4 Pro", price: "$1,999", features: ["M4 Pro chip", "24GB RAM", "512GB SSD"], highlighted: true },
 *       { name: "16-inch M4 Pro", price: "$2,499", features: ["M4 Pro chip", "24GB RAM", "512GB SSD"], badge: "New" },
 *     ]}
 *     ctaLabel="Buy"
 *     ctaHref="/buy"
 *     animationIntensity="moderate"
 *   />
 */

"use client";

import { useState, type ReactNode } from "react";
import { motion } from "motion/react";
import type { SectionBaseProps } from "../_shared/types";
import { getMotionTransition } from "../_shared/animation-config";
import { useSectionAnimation } from "../_shared/use-section-animation";

interface ProductOption {
  name: string;
  price: string;
  features: string[];
  badge?: string;
  highlighted?: boolean;
}

interface ProductOptionsCTAProps extends SectionBaseProps {
  heading?: ReactNode;
  description?: ReactNode;
  options: ProductOption[];
  ctaLabel?: string;
  ctaHref?: string;
}

export function ProductOptionsCTA({
  id,
  heading,
  description,
  options,
  ctaLabel = "Buy",
  ctaHref = "#",
  background,
  className = "",
  animationIntensity = "moderate",
}: ProductOptionsCTAProps) {
  const [selected, setSelected] = useState(
    options.findIndex((o) => o.highlighted) >= 0
      ? options.findIndex((o) => o.highlighted)
      : 0
  );
  const { ref, isVisible, shouldAnimate, config } = useSectionAnimation({
    intensity: animationIntensity,
  });
  const transition = getMotionTransition(animationIntensity);

  const headingId = id ? `${id}-heading` : heading ? "product-options-heading" : undefined;

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

      <div className="relative z-10 mx-auto w-[min(100%-2rem,1100px)]">
        {(heading || description) && (
          <div className="mb-12 text-center">
            {heading && (
              <motion.h2
                id={headingId}
                className="text-3xl font-semibold tracking-[-0.03em] text-[#ededed] md:text-4xl"
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

        <div
          className="grid grid-cols-1 gap-4 md:grid-cols-3"
          role="radiogroup"
          aria-label="Product options"
        >
          {options.map((option, i) => (
            <motion.button
              key={option.name}
              role="radio"
              aria-checked={i === selected}
              onClick={() => setSelected(i)}
              className={[
                "relative flex flex-col rounded-xl border p-6 text-left transition-all duration-200",
                i === selected
                  ? "border-white/30 bg-white/[0.04] ring-1 ring-white/20"
                  : "border-white/[0.08] bg-transparent hover:border-white/[0.16]",
              ].join(" ")}
              initial={shouldAnimate ? { opacity: 0, y: 20 } : false}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ ...transition, delay: config.stagger * (i + 2) }}
            >
              {option.badge && (
                <span className="mb-3 inline-block self-start rounded-full bg-white/10 px-3 py-0.5 text-xs font-medium text-[#ededed]">
                  {option.badge}
                </span>
              )}

              <h3 className="text-lg font-semibold text-[#ededed]">{option.name}</h3>
              <p className="mt-1 text-2xl font-bold text-[#ededed]">{option.price}</p>

              <ul className="mt-4 space-y-2">
                {option.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm text-[#a1a1a1]">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="shrink-0 text-[#a1a1a1]">
                      <path d="M3.5 7L6 9.5L10.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>

              {/* Selection indicator */}
              <div
                className={[
                  "mt-auto pt-4 flex items-center justify-center",
                  i === selected ? "opacity-100" : "opacity-0",
                ].join(" ")}
              >
                <div className="h-1.5 w-1.5 rounded-full bg-blue-500" />
              </div>
            </motion.button>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          className="mt-8 flex justify-center"
          initial={shouldAnimate ? { opacity: 0, y: 10 } : false}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ ...transition, delay: config.stagger * (options.length + 3) }}
        >
          <a
            href={ctaHref}
            className="inline-flex items-center rounded-full bg-blue-600 px-8 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-500"
          >
            {ctaLabel} {options[selected]?.name}
          </a>
        </motion.div>
      </div>
    </section>
  );
}
