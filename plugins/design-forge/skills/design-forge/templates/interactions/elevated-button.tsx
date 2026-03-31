/**
 * Elevated Button — Button with depth, gradient, and micro-interaction
 *
 * Replaces flat shadcn buttons with a button that feels 3D:
 * gradient fill + layered shadow + hover lift + active press.
 *
 * Taxonomy: all platforms · all industries except legal · modern/organic/glassmorphism styles
 *
 * Dependencies: none (pure CSS + Tailwind)
 */

import { forwardRef } from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const elevatedButtonVariants = cva(
  [
    "inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium",
    "transition-all duration-200 ease-out",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
    "disabled:pointer-events-none disabled:opacity-50",
    "[&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  ].join(" "),
  {
    variants: {
      variant: {
        default: [
          "bg-gradient-to-b from-primary to-primary/90 text-primary-foreground",
          "shadow-[0_4px_12px_rgba(0,0,0,0.15),0_1px_3px_rgba(0,0,0,0.1)]",
          "hover:-translate-y-0.5 hover:shadow-[0_6px_16px_rgba(0,0,0,0.2),0_2px_4px_rgba(0,0,0,0.1)]",
          "active:translate-y-0.5 active:shadow-[0_1px_4px_rgba(0,0,0,0.15)]",
        ].join(" "),
        secondary: [
          "bg-gradient-to-b from-secondary to-secondary/90 text-secondary-foreground",
          "shadow-[0_2px_8px_rgba(0,0,0,0.08),0_1px_2px_rgba(0,0,0,0.06)]",
          "hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(0,0,0,0.12),0_2px_4px_rgba(0,0,0,0.08)]",
          "active:translate-y-0.5 active:shadow-[0_1px_3px_rgba(0,0,0,0.08)]",
        ].join(" "),
        destructive: [
          "bg-gradient-to-b from-destructive to-destructive/90 text-destructive-foreground",
          "shadow-[0_4px_12px_rgba(220,38,38,0.25),0_1px_3px_rgba(0,0,0,0.1)]",
          "hover:-translate-y-0.5 hover:shadow-[0_6px_16px_rgba(220,38,38,0.3),0_2px_4px_rgba(0,0,0,0.1)]",
          "active:translate-y-0.5 active:shadow-[0_1px_4px_rgba(220,38,38,0.2)]",
        ].join(" "),
        outline: [
          "border border-input bg-background text-foreground",
          "shadow-[0_1px_3px_rgba(0,0,0,0.04)]",
          "hover:-translate-y-0.5 hover:shadow-[0_3px_8px_rgba(0,0,0,0.08)] hover:bg-accent",
          "active:translate-y-0 active:shadow-none",
        ].join(" "),
        ghost: [
          "text-foreground",
          "hover:bg-accent hover:text-accent-foreground",
          // No elevation for ghost — it's intentionally flat
        ].join(" "),
      },
      size: {
        default: "h-10 rounded-xl px-5 text-sm",
        sm: "h-8 rounded-lg px-3.5 text-xs",
        lg: "h-12 rounded-xl px-8 text-base",
        icon: "h-10 w-10 rounded-xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ElevatedButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof elevatedButtonVariants> {
  asChild?: boolean;
}

export const ElevatedButton = forwardRef<HTMLButtonElement, ElevatedButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(elevatedButtonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
ElevatedButton.displayName = "ElevatedButton";

/**
 * Industry-specific usage:
 *
 * Health:    <ElevatedButton variant="default" size="lg" className="rounded-xl" />
 *           Uses the project's teal primary with warm gradient
 *
 * SaaS:     <ElevatedButton variant="default" />
 *           Uses the project's indigo/blue primary with bold gradient
 *
 * Ecommerce: <ElevatedButton variant="default" size="lg" className="rounded-lg" />
 *            Dark primary for high contrast against white product backgrounds
 *
 * Fintech:  Don't use ElevatedButton — use standard shadcn Button (no elevation needed)
 *
 * Legal:    Don't use ElevatedButton — use standard shadcn Button with rounded-sm
 */
