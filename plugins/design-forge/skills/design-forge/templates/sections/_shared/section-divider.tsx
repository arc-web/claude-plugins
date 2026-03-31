/**
 * SectionDivider — Visual transition between page sections.
 *
 * Place between section components to create visual separation.
 * Variants match common design patterns from Apple/Gemini-style pages.
 *
 * Usage:
 *   <GradientHeadlineHero ... />
 *   <SectionDivider variant="gradient-fade" />
 *   <FeatureCardGrid ... />
 */

import type { DividerVariant } from "./types";

interface SectionDividerProps {
  /** Visual style of the divider */
  variant?: DividerVariant;
  /** Additional CSS classes */
  className?: string;
}

export function SectionDivider({
  variant = "gradient-fade",
  className = "",
}: SectionDividerProps) {
  if (variant === "none") return null;

  const variants: Record<Exclude<DividerVariant, "none">, string> = {
    line: "h-px bg-white/[0.08]",
    "gradient-fade":
      "h-px bg-gradient-to-r from-transparent via-white/[0.12] to-transparent",
    wave: "h-16 bg-[url(\"data:image/svg+xml,%3Csvg viewBox='0 0 1200 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 30 Q300 0 600 30 Q900 60 1200 30 L1200 60 L0 60Z' fill='%23ffffff08'/%3E%3C/svg%3E\")] bg-cover bg-no-repeat",
  };

  return (
    <div
      className={["mx-auto w-[min(100%-2rem,1200px)]", variants[variant], className].join(
        " "
      )}
      role="separator"
      aria-hidden="true"
    />
  );
}
