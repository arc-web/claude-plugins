/**
 * useSectionAnimation — Shared hook for section entrance animations.
 *
 * Combines:
 * - prefers-reduced-motion detection (respects OS-level setting)
 * - Animation intensity from taxonomy routing
 * - IntersectionObserver for viewport-triggered animations
 *
 * Usage:
 *   const { ref, isVisible, shouldAnimate, config } = useSectionAnimation({
 *     intensity: "gentle",
 *     threshold: 0.15,
 *   });
 *
 * Dependencies: React 18+ (no external deps)
 */

"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import type { AnimationIntensity, AnimationConfig } from "./types";
import { getAnimationConfig } from "./animation-config";

interface UseSectionAnimationOptions {
  /** Animation intensity from taxonomy. Default: "moderate" */
  intensity?: AnimationIntensity;
  /** IntersectionObserver threshold (0-1). Default: 0.15 */
  threshold?: number;
  /** IntersectionObserver rootMargin. Default: "-40px" */
  rootMargin?: string;
  /** Only trigger once (don't re-animate on re-entry). Default: true */
  once?: boolean;
}

interface UseSectionAnimationReturn {
  /** Ref to attach to the section element */
  ref: React.RefObject<HTMLElement | null>;
  /** Whether the section is visible in viewport */
  isVisible: boolean;
  /** Whether animations should play (false when reduced-motion is preferred or intensity is minimal) */
  shouldAnimate: boolean;
  /** Whether prefers-reduced-motion is active */
  prefersReducedMotion: boolean;
  /** Resolved animation config */
  config: AnimationConfig;
}

/** Detect prefers-reduced-motion (SSR-safe) */
function useReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mq.matches);

    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  return prefersReducedMotion;
}

export function useSectionAnimation(
  options: UseSectionAnimationOptions = {}
): UseSectionAnimationReturn {
  const {
    intensity = "moderate",
    threshold = 0.15,
    rootMargin = "-40px",
    once = true,
  } = options;

  const ref = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const prefersReducedMotion = useReducedMotion();
  const config = getAnimationConfig(intensity);

  const shouldAnimate = !prefersReducedMotion && intensity !== "minimal";

  const handleIntersection = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      if (entry.isIntersecting) {
        setIsVisible(true);
      } else if (!once) {
        setIsVisible(false);
      }
    },
    [once]
  );

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Skip observer if reduced motion — show immediately
    if (prefersReducedMotion) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(handleIntersection, {
      threshold,
      rootMargin,
    });

    observer.observe(el);
    return () => observer.disconnect();
  }, [handleIntersection, threshold, rootMargin, prefersReducedMotion]);

  return { ref, isVisible, shouldAnimate, prefersReducedMotion, config };
}
