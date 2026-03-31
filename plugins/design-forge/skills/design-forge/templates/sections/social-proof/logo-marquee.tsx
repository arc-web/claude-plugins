/**
 * LogoMarquee — Infinite scrolling partner/client logos.
 *
 * CSS-only infinite scroll animation. Pauses on hover. Duplicates children
 * for seamless loop. Reduced-motion: static grid layout.
 *
 * Taxonomy: website · all industries · all intensities
 *
 * Usage:
 *   <LogoMarquee
 *     heading="Trusted by industry leaders"
 *     logos={[
 *       { src: "/logos/acme.svg", alt: "Acme Corp" },
 *       { src: "/logos/beta.svg", alt: "Beta Inc" },
 *     ]}
 *     animationIntensity="gentle"
 *   />
 */

import { type ReactNode } from "react";
import type { SectionBaseProps } from "../_shared/types";

export interface Logo {
  src: string;
  alt: string;
  width?: number;
}

interface LogoMarqueeProps extends SectionBaseProps {
  heading?: ReactNode;
  logos: Logo[];
  /** Scroll speed in seconds per full cycle. Default: 30 */
  speed?: number;
  /** Direction. Default: "left" */
  direction?: "left" | "right";
}

export function LogoMarquee({
  id,
  heading,
  logos,
  speed = 30,
  direction = "left",
  background,
  className = "",
  animationIntensity = "moderate",
}: LogoMarqueeProps) {
  const headingId = id ? `${id}-heading` : heading ? "marquee-heading" : undefined;
  const isMinimal = animationIntensity === "minimal";

  // Duplicate logos for seamless loop
  const duplicated = [...logos, ...logos];

  return (
    <section
      id={id}
      className={["relative py-12 md:py-16 overflow-hidden", className].join(" ")}
      aria-labelledby={headingId}
    >
      {background && (
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          {background}
        </div>
      )}

      <div className="relative z-10">
        {heading && (
          <h2
            id={headingId}
            className="mb-8 text-center text-sm font-medium uppercase tracking-[0.08em] text-[#a1a1a1]"
          >
            {heading}
          </h2>
        )}

        {isMinimal ? (
          /* Static grid for minimal intensity / reduced motion */
          <div className="mx-auto flex w-[min(100%-2rem,1000px)] flex-wrap items-center justify-center gap-8">
            {logos.map((logo) => (
              <img
                key={logo.alt}
                src={logo.src}
                alt={logo.alt}
                width={logo.width ?? 120}
                className="h-8 w-auto opacity-40 grayscale"
                loading="lazy"
              />
            ))}
          </div>
        ) : (
          /* Animated marquee */
          <div className="group relative">
            {/* Fade edges */}
            <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-[#070809] to-transparent" />
            <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-[#070809] to-transparent" />

            <div
              className="flex w-max items-center gap-12 group-hover:[animation-play-state:paused] motion-reduce:flex-wrap motion-reduce:justify-center motion-reduce:w-auto motion-reduce:gap-8"
              style={{
                animation: `marquee-${direction} ${speed}s linear infinite`,
              }}
            >
              {duplicated.map((logo, i) => (
                <img
                  key={`${logo.alt}-${i}`}
                  src={logo.src}
                  alt={i < logos.length ? logo.alt : ""}
                  aria-hidden={i >= logos.length}
                  width={logo.width ?? 120}
                  className="h-8 w-auto shrink-0 opacity-40 grayscale transition-all duration-300 hover:opacity-70 hover:grayscale-0"
                  loading="lazy"
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Keyframes injected via style tag (works in any framework) */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @keyframes marquee-left {
              from { transform: translateX(0); }
              to { transform: translateX(-50%); }
            }
            @keyframes marquee-right {
              from { transform: translateX(-50%); }
              to { transform: translateX(0); }
            }
            @media (prefers-reduced-motion: reduce) {
              [style*="marquee"] { animation: none !important; }
            }
          `,
        }}
      />
    </section>
  );
}
