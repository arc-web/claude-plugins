/**
 * Scroll Sticky Overlay — Sticky panel with scroll-driven content swap
 *
 * Left panel stays fixed while right panel scrolls. As each right-side
 * section enters, the left content cross-fades to match. Great for feature
 * comparisons, product walkthroughs, and documentation highlights.
 *
 * Taxonomy: website (saas, ecommerce) · section-fade-sequence preset · moderate intensity
 *
 * Dependencies: pnpm add motion (Framer Motion v12+)
 */

"use client";

import { useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";

interface Section {
  /** Title shown in the scrolling right panel */
  title: string;
  /** Description in the scrolling right panel */
  description: string;
  /** Visual content shown in the sticky left panel */
  visual: React.ReactNode;
}

interface StickyOverlayProps {
  sections: Section[];
  /** Sticky panel alignment. Default: "left" */
  stickyPosition?: "left" | "right";
  /** Top offset for sticky positioning. Default: "6rem" */
  stickyTop?: string;
}

export function ScrollStickyOverlay({
  sections,
  stickyPosition = "left",
  stickyTop = "6rem",
}: StickyOverlayProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);

  // IntersectionObserver to detect which section is in view
  const observerCallback = (index: number) => (node: HTMLDivElement | null) => {
    sectionRefs.current[index] = node;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setActiveIndex(index);
        }
      },
      { rootMargin: "-40% 0px -40% 0px", threshold: 0 }
    );
    observer.observe(node);
  };

  const stickyPanel = (
    <div
      className="hidden lg:block lg:w-1/2"
      style={{ position: "sticky", top: stickyTop, height: "fit-content" }}
    >
      <div className="relative aspect-video overflow-hidden rounded-xl">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0 flex items-center justify-center"
          >
            {sections[activeIndex].visual}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );

  const scrollPanel = (
    <div className="w-full lg:w-1/2">
      <div className="space-y-[40vh] py-[20vh]">
        {sections.map((section, i) => (
          <div
            key={i}
            ref={observerCallback(i)}
            className="flex min-h-[40vh] items-center"
          >
            <div className="space-y-4">
              {/* Mobile: show visual inline */}
              <div className="lg:hidden mb-6 overflow-hidden rounded-xl">
                {section.visual}
              </div>

              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-medium text-primary">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="text-2xl font-semibold tracking-tight">
                  {section.title}
                </h3>
              </div>

              <p className="text-lg text-muted-foreground leading-relaxed max-w-lg">
                {section.description}
              </p>

              {/* Active indicator */}
              <div
                className="h-0.5 w-12 rounded-full transition-all duration-500"
                style={{
                  backgroundColor: i === activeIndex
                    ? "hsl(var(--primary))"
                    : "hsl(var(--border))",
                  width: i === activeIndex ? "3rem" : "1.5rem",
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <section className="relative">
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex gap-12 lg:gap-16">
          {stickyPosition === "left" ? (
            <>
              {stickyPanel}
              {scrollPanel}
            </>
          ) : (
            <>
              {scrollPanel}
              {stickyPanel}
            </>
          )}
        </div>
      </div>
    </section>
  );
}
