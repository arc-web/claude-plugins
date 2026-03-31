/**
 * VideoScrollReveal — Apple-style video with scroll-driven opacity + clip-path.
 *
 * Video element reveals as user scrolls through the section. Uses GSAP
 * ScrollTrigger to animate opacity, scale, and clip-path inset based
 * on scroll progress.
 *
 * Taxonomy: website · all industries · moderate-expressive intensity
 * Decomposed from: Apple MacBook Pro video reveal sections
 *
 * Dependencies: pnpm add gsap @gsap/react
 *
 * Usage:
 *   <VideoScrollReveal
 *     src="/product-demo.mp4"
 *     poster="/product-poster.jpg"
 *     heading="See it in action"
 *     animationIntensity="expressive"
 *   />
 */

"use client";

import { useRef, useEffect, useState, type ReactNode } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { SectionBaseProps } from "../_shared/types";
import { getGsapEasing } from "../_shared/animation-config";

gsap.registerPlugin(ScrollTrigger);

interface VideoScrollRevealProps extends SectionBaseProps {
  /** Video source URL */
  src: string;
  /** Poster image shown before video loads */
  poster?: string;
  /** Section heading shown above the video */
  heading?: ReactNode;
  description?: ReactNode;
  /** Reveal style. Default: "clip-inset" */
  revealStyle?: "clip-inset" | "scale-fade" | "split-curtain";
  /** Whether to autoplay when revealed. Default: true */
  autoplay?: boolean;
  /** Whether video loops. Default: true */
  loop?: boolean;
}

export function VideoScrollReveal({
  id,
  src,
  poster,
  heading,
  description,
  background,
  className = "",
  animationIntensity = "expressive",
  revealStyle = "clip-inset",
  autoplay = true,
  loop = true,
}: VideoScrollRevealProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const videoWrapRef = useRef<HTMLDivElement>(null);

  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const shouldAnimate = !prefersReducedMotion && animationIntensity !== "minimal";
  const easing = getGsapEasing(animationIntensity);

  useGSAP(
    () => {
      if (!shouldAnimate || !sectionRef.current || !videoWrapRef.current) return;

      const wrap = videoWrapRef.current;
      const video = videoRef.current;

      if (revealStyle === "clip-inset") {
        // Clip-path inset animation: starts clipped, reveals to full
        gsap.fromTo(
          wrap,
          { clipPath: "inset(15% 15% 15% 15% round 16px)", opacity: 0.3 },
          {
            clipPath: "inset(0% 0% 0% 0% round 0px)",
            opacity: 1,
            ease: easing,
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 60%",
              end: "top 10%",
              scrub: 0.5,
              onEnter: () => {
                if (autoplay && video) video.play().catch(() => {});
              },
            },
          }
        );
      } else if (revealStyle === "scale-fade") {
        // Scale up from 0.85 with fade
        gsap.fromTo(
          wrap,
          { scale: 0.85, opacity: 0 },
          {
            scale: 1,
            opacity: 1,
            ease: easing,
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 60%",
              end: "top 10%",
              scrub: 0.5,
              onEnter: () => {
                if (autoplay && video) video.play().catch(() => {});
              },
            },
          }
        );
      } else if (revealStyle === "split-curtain") {
        // Two clip-path halves opening like curtains
        gsap.fromTo(
          wrap,
          { clipPath: "inset(0 50% 0 50%)", opacity: 0.5 },
          {
            clipPath: "inset(0 0% 0 0%)",
            opacity: 1,
            ease: easing,
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 60%",
              end: "top 10%",
              scrub: 0.5,
              onEnter: () => {
                if (autoplay && video) video.play().catch(() => {});
              },
            },
          }
        );
      }
    },
    { scope: sectionRef, dependencies: [shouldAnimate, revealStyle, easing, autoplay] }
  );

  const headingId = id ? `${id}-heading` : heading ? "video-reveal-heading" : undefined;

  return (
    <section
      ref={sectionRef}
      id={id}
      className={["relative py-16 md:py-24 overflow-hidden", className].join(" ")}
      aria-labelledby={headingId}
    >
      {background && (
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          {background}
        </div>
      )}

      <div className="relative z-10 mx-auto w-[min(100%-2rem,1200px)]">
        {(heading || description) && (
          <div className="mb-12 text-center">
            {heading && (
              <h2
                id={headingId}
                className="text-3xl font-semibold tracking-[-0.03em] text-[#ededed] md:text-4xl lg:text-5xl"
              >
                {heading}
              </h2>
            )}
            {description && (
              <p className="mt-4 mx-auto max-w-2xl text-base text-[#a1a1a1] md:text-lg">
                {description}
              </p>
            )}
          </div>
        )}

        <div ref={videoWrapRef} className="rounded-xl overflow-hidden">
          <video
            ref={videoRef}
            src={src}
            poster={poster}
            loop={loop}
            muted
            playsInline
            preload="metadata"
            className="w-full h-auto"
          />
        </div>
      </div>
    </section>
  );
}
