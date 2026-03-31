/**
 * Animation config resolver — maps taxonomy intensity to concrete values.
 *
 * Values match the animation_intensities in taxonomy/index.json (lines 17-46).
 * Section templates call getAnimationConfig(intensity) to derive durations,
 * easing curves, and stagger delays without reading the JSON directly.
 */

import type { AnimationIntensity, AnimationConfig } from "./types";

const configs: Record<AnimationIntensity, AnimationConfig> = {
  minimal: {
    duration: 0.2,
    stagger: 0.03,
    easing: [0, 0, 0.58, 1],
    easingCss: "cubic-bezier(0, 0, 0.58, 1)",
    scrollEffects: false,
  },
  gentle: {
    duration: 0.45,
    stagger: 0.06,
    easing: [0.16, 1, 0.3, 1],
    easingCss: "cubic-bezier(0.16, 1, 0.3, 1)",
    scrollEffects: true,
  },
  moderate: {
    duration: 0.6,
    stagger: 0.08,
    easing: [0.25, 0.46, 0.45, 0.94],
    easingCss: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
    scrollEffects: true,
  },
  expressive: {
    duration: 0.85,
    stagger: 0.12,
    easing: [0.22, 1, 0.36, 1],
    easingCss: "cubic-bezier(0.22, 1, 0.36, 1)",
    scrollEffects: true,
  },
};

/** Resolve taxonomy intensity to concrete animation values */
export function getAnimationConfig(
  intensity: AnimationIntensity = "moderate"
): AnimationConfig {
  return configs[intensity];
}

/**
 * Get GSAP-compatible easing string from intensity.
 * GSAP uses "power2.out" style or custom() with cubic bezier.
 */
export function getGsapEasing(intensity: AnimationIntensity = "moderate"): string {
  const map: Record<AnimationIntensity, string> = {
    minimal: "power1.out",
    gentle: "power3.out",
    moderate: "power2.out",
    expressive: "power4.out",
  };
  return map[intensity];
}

/**
 * Get Framer Motion transition config from intensity.
 * Returns a complete transition object ready for motion components.
 */
export function getMotionTransition(intensity: AnimationIntensity = "moderate") {
  const config = getAnimationConfig(intensity);
  return {
    duration: config.duration,
    ease: config.easing,
  };
}
