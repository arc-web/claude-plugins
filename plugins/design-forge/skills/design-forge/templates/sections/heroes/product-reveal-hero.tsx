/**
 * ProductRevealHero — Apple MacBook-style hero with canvas image sequence.
 *
 * Full-viewport hero that reveals a product through a canvas-based image
 * sequence tied to scroll position. As the user scrolls, frames advance
 * creating a cinematic product unveil effect.
 *
 * Taxonomy: website · saas/creative/ecommerce · apple-showcase · expressive
 * Decomposed from: Apple MacBook Pro hero reveal
 *
 * Dependencies: pnpm add gsap @gsap/react
 *
 * Usage:
 *   <ProductRevealHero
 *     heading="MacBook Pro"
 *     subheading="The most advanced Mac ever."
 *     frameCount={120}
 *     getFrameUrl={(i) => `/frames/hero-${String(i).padStart(4, '0')}.webp`}
 *     fallbackImage="/hero-poster.jpg"
 *     animationIntensity="expressive"
 *   />
 *
 * Note: Requires pre-rendered image sequence (120+ WebP frames recommended).
 * Use FFmpeg to extract: ffmpeg -i hero.mp4 -vf "fps=30" frames/hero-%04d.webp
 */

"use client";

import { useRef, useEffect, useState, useCallback, type ReactNode } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { SectionBaseProps } from "../_shared/types";
import { ImageSequencePlayer } from "../_shared/image-sequence-player";

gsap.registerPlugin(ScrollTrigger);

interface ProductRevealHeroProps extends SectionBaseProps {
  heading: ReactNode;
  subheading?: ReactNode;
  /** Total frames in the sequence */
  frameCount: number;
  /** Function returning URL for each frame index */
  getFrameUrl: (index: number) => string;
  /** Static fallback image for reduced-motion or before load */
  fallbackImage: string;
  /** CTA buttons below heading */
  primaryCta?: ReactNode;
  secondaryCta?: ReactNode;
  /** Scroll distance multiplier. Default: 3 */
  scrollDistance?: number;
}

export function ProductRevealHero({
  id,
  heading,
  subheading,
  frameCount,
  getFrameUrl,
  fallbackImage,
  primaryCta,
  secondaryCta,
  background,
  className = "",
  animationIntensity = "expressive",
  scrollDistance = 3,
}: ProductRevealHeroProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const playerRef = useRef<ImageSequencePlayer | null>(null);

  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const shouldAnimate = !prefersReducedMotion && animationIntensity !== "minimal";

  // Initialize image sequence player
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !shouldAnimate) return;

    const player = new ImageSequencePlayer({
      canvas,
      frameCount,
      getFrameUrl,
    });

    const rect = canvas.parentElement?.getBoundingClientRect();
    if (rect) {
      player.setSize(rect.width, rect.height);
    }

    player.preload().then(() => {
      setIsLoaded(true);
      player.setProgress(0);
    });

    playerRef.current = player;

    // Handle resize
    const handleResize = () => {
      const rect = canvas.parentElement?.getBoundingClientRect();
      if (rect) player.setSize(rect.width, rect.height);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      player.dispose();
      playerRef.current = null;
    };
  }, [shouldAnimate, frameCount, getFrameUrl]);

  // GSAP scroll-driven progress
  useGSAP(
    () => {
      if (!shouldAnimate || !sectionRef.current || !playerRef.current) return;

      const progress = { value: 0 };

      gsap.to(progress, {
        value: 1,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: `+=${scrollDistance * 100}%`,
          pin: true,
          scrub: 0.3,
          anticipatePin: 1,
        },
        onUpdate: () => {
          playerRef.current?.setProgress(progress.value);
        },
      });

      // Fade text out as scroll progresses
      gsap.to("[data-hero-text]", {
        opacity: 0,
        y: -40,
        ease: "power2.in",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "+=30%",
          scrub: true,
        },
      });
    },
    { scope: sectionRef, dependencies: [shouldAnimate, scrollDistance, isLoaded] }
  );

  return (
    <section
      ref={sectionRef}
      id={id}
      className={[
        "relative min-h-screen overflow-hidden bg-black",
        className,
      ].join(" ")}
    >
      {background && (
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          {background}
        </div>
      )}

      {/* Canvas for image sequence */}
      {shouldAnimate ? (
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full"
          aria-hidden="true"
        />
      ) : (
        /* Fallback: static image for reduced-motion */
        <img
          src={fallbackImage}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
          aria-hidden="true"
        />
      )}

      {/* Text overlay */}
      <div
        data-hero-text
        className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 text-center"
      >
        <h1 className="text-[clamp(3rem,8vw,6rem)] font-semibold leading-[0.9] tracking-[-0.04em] text-white">
          {heading}
        </h1>

        {subheading && (
          <p className="mt-4 max-w-xl text-lg text-white/70 md:text-xl">
            {subheading}
          </p>
        )}

        {(primaryCta || secondaryCta) && (
          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row">
            {primaryCta}
            {secondaryCta}
          </div>
        )}
      </div>
    </section>
  );
}
