/**
 * SpecComparison — Apple-style side-by-side specification grid.
 *
 * Two product columns with specs, animated highlight on the winning spec.
 * Responsive: stacks to sequential cards on mobile.
 *
 * Taxonomy: website · saas/fintech/ecommerce · moderate-expressive intensity
 * Decomposed from: Apple MacBook Pro spec comparison sections
 *
 * Dependencies: pnpm add motion (Framer Motion v12+)
 *
 * Usage:
 *   <SpecComparison
 *     heading="Compare models"
 *     products={[
 *       { name: "Pro", badge: "Popular", specs: { "CPU": "M4 Pro", "RAM": "18GB", "Storage": "512GB" } },
 *       { name: "Max", badge: "Best", specs: { "CPU": "M4 Max", "RAM": "36GB", "Storage": "1TB" } },
 *     ]}
 *     highlightProduct={1}
 *     animationIntensity="moderate"
 *   />
 */

"use client";

import { type ReactNode } from "react";
import { motion } from "motion/react";
import type { SectionBaseProps } from "../_shared/types";
import { getMotionTransition } from "../_shared/animation-config";
import { useSectionAnimation } from "../_shared/use-section-animation";

interface Product {
  name: string;
  badge?: string;
  image?: ReactNode;
  specs: Record<string, string>;
}

interface SpecComparisonProps extends SectionBaseProps {
  heading?: ReactNode;
  description?: ReactNode;
  products: Product[];
  /** Index of the product to highlight (0-based). Default: last product */
  highlightProduct?: number;
}

export function SpecComparison({
  id,
  heading,
  description,
  products,
  highlightProduct,
  background,
  className = "",
  animationIntensity = "moderate",
}: SpecComparisonProps) {
  const { ref, isVisible, shouldAnimate, config } = useSectionAnimation({
    intensity: animationIntensity,
  });
  const transition = getMotionTransition(animationIntensity);
  const highlighted = highlightProduct ?? products.length - 1;

  // Collect all unique spec keys across products
  const specKeys = [...new Set(products.flatMap((p) => Object.keys(p.specs)))];

  const headingId = id ? `${id}-heading` : heading ? "spec-comparison-heading" : undefined;

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
                className="text-3xl font-semibold tracking-[-0.03em] text-[#ededed] md:text-4xl lg:text-5xl"
                initial={shouldAnimate ? { opacity: 0, y: 12 } : false}
                animate={isVisible ? { opacity: 1, y: 0 } : {}}
                transition={transition}
              >
                {heading}
              </motion.h2>
            )}
            {description && (
              <motion.p
                className="mt-4 mx-auto max-w-2xl text-base text-[#a1a1a1] md:text-lg"
                initial={shouldAnimate ? { opacity: 0, y: 8 } : false}
                animate={isVisible ? { opacity: 1, y: 0 } : {}}
                transition={{ ...transition, delay: config.stagger }}
              >
                {description}
              </motion.p>
            )}
          </div>
        )}

        {/* Product headers */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_repeat(var(--cols),1fr)] gap-4 md:gap-0"
          style={{ "--cols": products.length } as React.CSSProperties}
        >
          {/* Desktop: empty cell for spec label column */}
          <div className="hidden md:block" />

          {/* Product headers */}
          <div className="grid gap-4 md:contents" style={{ gridTemplateColumns: `repeat(${products.length}, 1fr)` }}>
            {products.map((product, i) => (
              <motion.div
                key={product.name}
                className={[
                  "rounded-xl p-6 text-center",
                  i === highlighted
                    ? "border border-white/20 bg-white/[0.04]"
                    : "border border-transparent",
                ].join(" ")}
                initial={shouldAnimate ? { opacity: 0, y: 16 } : false}
                animate={isVisible ? { opacity: 1, y: 0 } : {}}
                transition={{ ...transition, delay: config.stagger * (i + 2) }}
              >
                {product.badge && (
                  <span className="mb-2 inline-block rounded-full bg-white/10 px-3 py-0.5 text-xs font-medium text-[#ededed]">
                    {product.badge}
                  </span>
                )}
                <h3 className="text-xl font-semibold text-[#ededed]">{product.name}</h3>
                {product.image && <div className="mt-4">{product.image}</div>}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Spec rows */}
        <div className="mt-8 space-y-0">
          {specKeys.map((key, rowIndex) => (
            <motion.div
              key={key}
              className="grid grid-cols-1 md:grid-cols-[200px_repeat(var(--cols),1fr)] border-b border-white/[0.06] py-4"
              style={{ "--cols": products.length } as React.CSSProperties}
              initial={shouldAnimate ? { opacity: 0, x: -10 } : false}
              animate={isVisible ? { opacity: 1, x: 0 } : {}}
              transition={{ ...transition, delay: config.stagger * (rowIndex + products.length + 2) }}
            >
              {/* Spec label */}
              <div className="text-sm font-medium text-[#a1a1a1] mb-2 md:mb-0 md:flex md:items-center">
                {key}
              </div>

              {/* Spec values */}
              <div className="grid gap-4 md:contents" style={{ gridTemplateColumns: `repeat(${products.length}, 1fr)` }}>
                {products.map((product, colIndex) => (
                  <div
                    key={`${product.name}-${key}`}
                    className={[
                      "flex items-center justify-center rounded-lg px-4 py-2 text-center",
                      colIndex === highlighted ? "bg-white/[0.03]" : "",
                    ].join(" ")}
                  >
                    <span className="text-sm font-medium text-[#ededed] tabular-nums">
                      {product.specs[key] ?? "—"}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
