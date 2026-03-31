/**
 * Instagram Post Template — 1080×1080 branded social card.
 *
 * Square format with brand colors, headline, optional description,
 * and accent elements. Satori-compatible (flexbox layout).
 *
 * Variants:
 * - "announcement" — Bold headline with gradient accent
 * - "quote" — Centered quote with attribution
 * - "stat" — Large number/metric with label
 * - "tip" — Numbered tip with icon
 */

import type { BrandConfig } from "../shared/brand-config";

type PostVariant = "announcement" | "quote" | "stat" | "tip";

interface InstagramPostProps {
  brand: BrandConfig;
  variant?: PostVariant;
  headline: string;
  body?: string;
  /** For "stat" variant: the metric number */
  stat?: string;
  /** For "stat" variant: the metric label */
  statLabel?: string;
  /** For "quote" variant: attribution */
  attribution?: string;
  /** For "tip" variant: tip number */
  tipNumber?: number;
}

export function InstagramPost({
  brand,
  variant = "announcement",
  headline,
  body,
  stat,
  statLabel,
  attribution,
  tipNumber,
}: InstagramPostProps) {
  const base = {
    width: "100%",
    height: "100%",
    display: "flex" as const,
    flexDirection: "column" as const,
    fontFamily: brand.typography.displayFont,
  };

  if (variant === "stat") {
    return (
      <div
        style={{
          ...base,
          justifyContent: "center",
          alignItems: "center",
          padding: "80px",
          background: `linear-gradient(135deg, ${brand.colors.background}, ${brand.colors.primary}15)`,
          textAlign: "center" as const,
        }}
      >
        <div
          style={{
            fontSize: "160px",
            fontWeight: 800,
            color: brand.colors.primary,
            lineHeight: 1,
            letterSpacing: "-0.04em",
          }}
        >
          {stat ?? headline}
        </div>
        <div
          style={{
            fontSize: "28px",
            color: brand.colors.foreground,
            opacity: 0.7,
            marginTop: "16px",
          }}
        >
          {statLabel ?? body}
        </div>
        <div
          style={{
            position: "absolute" as const,
            bottom: "40px",
            fontSize: "18px",
            fontWeight: 600,
            color: brand.colors.foreground,
            opacity: 0.5,
          }}
        >
          {brand.name}
        </div>
      </div>
    );
  }

  if (variant === "quote") {
    return (
      <div
        style={{
          ...base,
          justifyContent: "center",
          alignItems: "center",
          padding: "80px",
          background: brand.colors.background,
          textAlign: "center" as const,
        }}
      >
        <div
          style={{
            fontSize: "72px",
            color: brand.colors.primary,
            opacity: 0.3,
            lineHeight: 1,
          }}
        >
          "
        </div>
        <div
          style={{
            fontSize: "36px",
            fontWeight: 600,
            color: brand.colors.foreground,
            lineHeight: 1.3,
            marginTop: "-20px",
            maxWidth: "800px",
          }}
        >
          {headline}
        </div>
        {attribution && (
          <div
            style={{
              fontSize: "20px",
              color: brand.colors.foreground,
              opacity: 0.5,
              marginTop: "24px",
            }}
          >
            — {attribution}
          </div>
        )}
        <div
          style={{
            position: "absolute" as const,
            bottom: "40px",
            fontSize: "18px",
            fontWeight: 600,
            color: brand.colors.foreground,
            opacity: 0.5,
          }}
        >
          {brand.name}
        </div>
      </div>
    );
  }

  if (variant === "tip") {
    return (
      <div
        style={{
          ...base,
          justifyContent: "center",
          padding: "80px",
          background: brand.colors.background,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            marginBottom: "32px",
          }}
        >
          <div
            style={{
              width: "56px",
              height: "56px",
              borderRadius: brand.borderRadius,
              background: brand.colors.primary,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "28px",
              fontWeight: 700,
              color: "#fff",
            }}
          >
            {tipNumber ?? "#"}
          </div>
          <span
            style={{
              fontSize: "20px",
              fontWeight: 600,
              color: brand.colors.primary,
              textTransform: "uppercase" as const,
              letterSpacing: "0.08em",
            }}
          >
            Tip
          </span>
        </div>
        <div
          style={{
            fontSize: "44px",
            fontWeight: 700,
            color: brand.colors.foreground,
            lineHeight: 1.2,
          }}
        >
          {headline}
        </div>
        {body && (
          <div
            style={{
              fontSize: "22px",
              color: brand.colors.foreground,
              opacity: 0.6,
              marginTop: "20px",
              lineHeight: 1.5,
            }}
          >
            {body}
          </div>
        )}
        <div
          style={{
            position: "absolute" as const,
            bottom: "40px",
            left: "80px",
            fontSize: "18px",
            fontWeight: 600,
            color: brand.colors.foreground,
            opacity: 0.5,
          }}
        >
          {brand.name}
        </div>
      </div>
    );
  }

  // Default: announcement
  return (
    <div
      style={{
        ...base,
        justifyContent: "space-between",
        padding: "80px",
        background: `linear-gradient(160deg, ${brand.colors.background} 0%, ${brand.colors.primary}12 100%)`,
      }}
    >
      {/* Top accent bar */}
      <div
        style={{
          width: "60px",
          height: "4px",
          background: `linear-gradient(90deg, ${brand.colors.primary}, ${brand.colors.accent})`,
          borderRadius: "2px",
        }}
      />

      {/* Content */}
      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        <div
          style={{
            fontSize: headline.length > 50 ? "40px" : "52px",
            fontWeight: 700,
            color: brand.colors.foreground,
            lineHeight: 1.15,
            letterSpacing: "-0.02em",
          }}
        >
          {headline}
        </div>
        {body && (
          <div
            style={{
              fontSize: "22px",
              color: brand.colors.foreground,
              opacity: 0.6,
              lineHeight: 1.5,
            }}
          >
            {body}
          </div>
        )}
      </div>

      {/* Bottom: Brand */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <span
          style={{
            fontSize: "20px",
            fontWeight: 600,
            color: brand.colors.foreground,
            opacity: 0.6,
          }}
        >
          {brand.name}
        </span>
      </div>
    </div>
  );
}
