/**
 * Shared types for Design Forge section templates.
 *
 * Every section template extends SectionBaseProps to integrate with
 * the taxonomy routing system (animation intensity, backgrounds, IDs).
 */

import { type ReactNode } from "react";

/** Maps to animation_intensities in taxonomy/index.json */
export type AnimationIntensity = "minimal" | "gentle" | "moderate" | "expressive";

/** Base props every section template accepts */
export interface SectionBaseProps {
  /** Unique ID for anchor links and aria-labelledby */
  id?: string;
  /** Animation intensity from taxonomy routing. Default: "moderate" */
  animationIntensity?: AnimationIntensity;
  /** Additional CSS classes */
  className?: string;
  /** Background slot for decorative elements (canvas, gradients, orbs) */
  background?: ReactNode;
}

/** Resolved animation config derived from intensity level */
export interface AnimationConfig {
  /** Primary animation duration in seconds */
  duration: number;
  /** Stagger delay between child elements in seconds */
  stagger: number;
  /** Cubic bezier easing as [x1, y1, x2, y2] */
  easing: [number, number, number, number];
  /** CSS easing string for Tailwind/CSS transitions */
  easingCss: string;
  /** Whether scroll-driven effects (pin, scrub, parallax) are enabled */
  scrollEffects: boolean;
}

/** Section divider variants */
export type DividerVariant = "line" | "gradient-fade" | "wave" | "none";
