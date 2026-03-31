/**
 * Size presets for social media and web asset generation.
 *
 * All dimensions in pixels. Updated for 2026 platform specs.
 *
 * Usage:
 *   import { SOCIAL_SIZES, WEB_SIZES } from "./size-presets";
 *   const { width, height } = SOCIAL_SIZES["instagram-post"];
 */

export interface SizePreset {
  width: number;
  height: number;
  label: string;
}

export const SOCIAL_SIZES: Record<string, SizePreset> = {
  "instagram-post": { width: 1080, height: 1080, label: "Instagram Post" },
  "instagram-story": { width: 1080, height: 1920, label: "Instagram Story" },
  "instagram-reel": { width: 1080, height: 1920, label: "Instagram Reel Cover" },
  "twitter-post": { width: 1200, height: 675, label: "Twitter/X Post" },
  "twitter-header": { width: 1500, height: 500, label: "Twitter/X Header" },
  "linkedin-post": { width: 1200, height: 627, label: "LinkedIn Post" },
  "linkedin-cover": { width: 1128, height: 191, label: "LinkedIn Cover" },
  "facebook-post": { width: 1200, height: 630, label: "Facebook Post" },
  "facebook-cover": { width: 820, height: 312, label: "Facebook Cover" },
  "youtube-thumbnail": { width: 1280, height: 720, label: "YouTube Thumbnail" },
  "pinterest-pin": { width: 1000, height: 1500, label: "Pinterest Pin" },
  "tiktok-cover": { width: 1080, height: 1920, label: "TikTok Cover" },
  "threads-post": { width: 1080, height: 1080, label: "Threads Post" },
};

export const WEB_SIZES: Record<string, SizePreset> = {
  "og-image": { width: 1200, height: 630, label: "OpenGraph Image" },
  "twitter-card": { width: 1200, height: 600, label: "Twitter Card" },
  "hero-desktop": { width: 1920, height: 1080, label: "Hero Desktop" },
  "hero-mobile": { width: 750, height: 1334, label: "Hero Mobile" },
  "feature-image": { width: 800, height: 600, label: "Feature Image" },
  "email-header": { width: 600, height: 200, label: "Email Header" },
  "email-banner": { width: 600, height: 300, label: "Email Banner" },
  "favicon": { width: 512, height: 512, label: "Favicon/App Icon" },
  "apple-touch": { width: 180, height: 180, label: "Apple Touch Icon" },
};

export const PRINT_SIZES: Record<string, SizePreset> = {
  "business-card": { width: 1050, height: 600, label: "Business Card (3.5×2in @300dpi)" },
  "a4-portrait": { width: 2480, height: 3508, label: "A4 Portrait (@300dpi)" },
  "a4-landscape": { width: 3508, height: 2480, label: "A4 Landscape (@300dpi)" },
  "letter-portrait": { width: 2550, height: 3300, label: "US Letter Portrait (@300dpi)" },
  "poster-18x24": { width: 5400, height: 7200, label: "Poster 18×24in (@300dpi)" },
};

/** Get all sizes for a social media kit (common subset) */
export function getSocialKitSizes(): Record<string, SizePreset> {
  return {
    "instagram-post": SOCIAL_SIZES["instagram-post"],
    "instagram-story": SOCIAL_SIZES["instagram-story"],
    "twitter-post": SOCIAL_SIZES["twitter-post"],
    "linkedin-post": SOCIAL_SIZES["linkedin-post"],
    "facebook-post": SOCIAL_SIZES["facebook-post"],
    "youtube-thumbnail": SOCIAL_SIZES["youtube-thumbnail"],
  };
}
