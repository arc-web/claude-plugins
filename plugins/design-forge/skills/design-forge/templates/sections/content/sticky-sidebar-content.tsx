/**
 * StickySidebarContent — Documentation-style section with TOC tracking.
 *
 * Left sidebar with navigation that highlights current section on scroll.
 * Right content area with multiple content blocks. Promoted from sticky-sidebar
 * with added: TOC scroll-spy, animation intensity, section framing.
 *
 * Taxonomy: webapp · all industries · minimal-gentle intensity
 *
 * Dependencies: React 18+ (no external deps for basic version)
 *
 * Usage:
 *   <StickySidebarContent
 *     heading="Documentation"
 *     sections={[
 *       { id: "intro", title: "Introduction", content: <IntroContent /> },
 *       { id: "setup", title: "Getting Started", content: <SetupContent /> },
 *       { id: "api", title: "API Reference", content: <ApiContent /> },
 *     ]}
 *     animationIntensity="minimal"
 *   />
 */

"use client";

import { useState, useEffect, useRef, useCallback, type ReactNode } from "react";
import type { SectionBaseProps } from "../_shared/types";

interface ContentSection {
  id: string;
  title: string;
  content: ReactNode;
}

interface StickySidebarContentProps extends SectionBaseProps {
  heading?: ReactNode;
  sections: ContentSection[];
}

export function StickySidebarContent({
  id,
  heading,
  sections: contentSections,
  background,
  className = "",
  animationIntensity = "minimal",
}: StickySidebarContentProps) {
  const [activeId, setActiveId] = useState(contentSections[0]?.id ?? "");
  const sectionRefs = useRef<Map<string, HTMLElement>>(new Map());

  // Scroll spy: track which section is in view
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        }
      },
      { rootMargin: "-20% 0px -60% 0px", threshold: 0 }
    );

    sectionRefs.current.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [contentSections]);

  const scrollTo = useCallback((sectionId: string) => {
    const el = sectionRefs.current.get(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  const headingId = id ? `${id}-heading` : heading ? "sidebar-heading" : undefined;

  return (
    <section
      id={id}
      className={["relative py-16 md:py-24", className].join(" ")}
      aria-labelledby={headingId}
    >
      {background && (
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          {background}
        </div>
      )}

      <div className="relative z-10 mx-auto w-[min(100%-2rem,1200px)]">
        {heading && (
          <h2
            id={headingId}
            className="mb-10 text-2xl font-semibold tracking-[-0.03em] text-[#ededed] md:text-3xl"
          >
            {heading}
          </h2>
        )}

        <div className="flex flex-col gap-8 md:flex-row md:gap-12">
          {/* Sticky sidebar navigation */}
          <nav
            className="md:sticky md:top-24 md:w-56 md:shrink-0 md:self-start"
            aria-label="Table of contents"
          >
            <ul className="flex flex-row gap-2 overflow-x-auto md:flex-col md:gap-1 md:overflow-visible">
              {contentSections.map((section) => (
                <li key={section.id}>
                  <button
                    onClick={() => scrollTo(section.id)}
                    className={[
                      "block w-full whitespace-nowrap rounded-md px-3 py-2 text-left text-sm transition-colors md:whitespace-normal",
                      activeId === section.id
                        ? "bg-white/[0.06] font-medium text-[#ededed]"
                        : "text-[#a1a1a1] hover:text-[#ededed]",
                    ].join(" ")}
                    aria-current={activeId === section.id ? "true" : undefined}
                  >
                    {section.title}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          {/* Content area */}
          <div className="flex-1 space-y-16">
            {contentSections.map((section) => (
              <div
                key={section.id}
                id={section.id}
                ref={(el) => { if (el) sectionRefs.current.set(section.id, el); }}
                className="scroll-mt-24"
              >
                <h3 className="mb-4 text-xl font-semibold text-[#ededed]">
                  {section.title}
                </h3>
                <div className="text-sm leading-relaxed text-[#a1a1a1] md:text-base">
                  {section.content}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
