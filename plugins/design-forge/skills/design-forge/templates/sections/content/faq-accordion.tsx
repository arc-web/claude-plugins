/**
 * FAQAccordion — Expandable Q&A section with spring-physics animation.
 *
 * Accessible accordion with keyboard navigation, ARIA attributes, and
 * animated height transitions. Designed for FAQ sections at page bottom.
 *
 * Taxonomy: website · all industries · gentle-expressive intensity
 * Decomposed from: Google Gemini FAQ section pattern
 *
 * Dependencies: pnpm add motion (Framer Motion v12+)
 *
 * Usage:
 *   <FAQAccordion
 *     heading="Frequently Asked Questions"
 *     items={[
 *       { question: "How does it work?", answer: "Simply sign up and..." },
 *       { question: "What's the pricing?", answer: "We offer three tiers..." },
 *     ]}
 *     animationIntensity="gentle"
 *   />
 */

"use client";

import { useState, useCallback, useId, type ReactNode } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import type { SectionBaseProps } from "../_shared/types";
import { getMotionTransition } from "../_shared/animation-config";
import { useSectionAnimation } from "../_shared/use-section-animation";

export interface FAQItem {
  question: string;
  answer: string | ReactNode;
}

interface FAQAccordionProps extends SectionBaseProps {
  heading?: ReactNode;
  description?: ReactNode;
  items: FAQItem[];
  /** Allow multiple items open at once. Default: false */
  allowMultiple?: boolean;
}

function AccordionItem({
  item,
  isOpen,
  onToggle,
  index,
  shouldAnimate,
  transition,
}: {
  item: FAQItem;
  isOpen: boolean;
  onToggle: () => void;
  index: number;
  shouldAnimate: boolean;
  transition: { duration: number; ease: number[] };
}) {
  const id = useId();
  const headerId = `${id}-header`;
  const panelId = `${id}-panel`;
  const prefersReducedMotion = useReducedMotion();

  return (
    <div className="border-b border-white/[0.08]">
      <h3>
        <button
          id={headerId}
          aria-expanded={isOpen}
          aria-controls={panelId}
          onClick={onToggle}
          className="flex w-full items-center justify-between py-5 text-left text-base font-medium text-[#ededed] transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent md:text-lg"
        >
          <span>{item.question}</span>
          <motion.span
            className="ml-4 shrink-0 text-[#a1a1a1]"
            animate={{ rotate: isOpen ? 45 : 0 }}
            transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.2 }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </motion.span>
        </button>
      </h3>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            id={panelId}
            role="region"
            aria-labelledby={headerId}
            initial={shouldAnimate ? { height: 0, opacity: 0 } : false}
            animate={{ height: "auto", opacity: 1 }}
            exit={shouldAnimate ? { height: 0, opacity: 0 } : undefined}
            transition={
              prefersReducedMotion
                ? { duration: 0 }
                : { duration: transition.duration * 0.8, ease: [0.16, 1, 0.3, 1] }
            }
            className="overflow-hidden"
          >
            <div className="pb-5 text-sm leading-relaxed text-[#a1a1a1] md:text-base">
              {item.answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function FAQAccordion({
  id,
  heading,
  description,
  items,
  allowMultiple = false,
  background,
  className = "",
  animationIntensity = "gentle",
}: FAQAccordionProps) {
  const [openIndices, setOpenIndices] = useState<Set<number>>(new Set());
  const { ref, isVisible, shouldAnimate, config } = useSectionAnimation({
    intensity: animationIntensity,
  });
  const transition = getMotionTransition(animationIntensity);

  const toggleItem = useCallback(
    (index: number) => {
      setOpenIndices((prev) => {
        const next = new Set(allowMultiple ? prev : []);
        if (prev.has(index)) next.delete(index);
        else next.add(index);
        return next;
      });
    },
    [allowMultiple]
  );

  const headingId = id ? `${id}-heading` : heading ? "faq-heading" : undefined;

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

      <div className="relative z-10 mx-auto w-[min(100%-2rem,800px)]">
        {(heading || description) && (
          <div className="mb-10 text-center">
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

        <motion.div
          initial={shouldAnimate ? { opacity: 0, y: 16 } : false}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ ...transition, delay: config.stagger * 2 }}
        >
          {items.map((item, i) => (
            <AccordionItem
              key={i}
              item={item}
              isOpen={openIndices.has(i)}
              onToggle={() => toggleItem(i)}
              index={i}
              shouldAnimate={shouldAnimate}
              transition={transition}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
