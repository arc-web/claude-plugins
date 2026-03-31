/**
 * Device Mockup Generator — Composite screenshots into device frames.
 *
 * Takes a screenshot image (or URL via Playwright) and composites it
 * into an SVG device frame using Sharp.
 *
 * Usage:
 *   npx tsx generate.ts --image ./screenshot.png --device macbook --output ./mockup.png
 *   npx tsx generate.ts --url https://example.com --device iphone --output ./mockup.png
 *
 * Dependencies:
 *   pnpm add sharp                    # Image compositing
 *   pnpm add playwright               # Only if using --url (screenshot from URL)
 */

interface MockupConfig {
  /** Path to screenshot image */
  image?: string;
  /** URL to screenshot (requires Playwright) */
  url?: string;
  /** Device type */
  device: "iphone" | "macbook" | "ipad";
  output: string;
  format?: "png" | "webp";
}

/** Device frame dimensions and screen area within the frame */
const DEVICES = {
  iphone: {
    frameWidth: 440,
    frameHeight: 880,
    screenX: 28,
    screenY: 28,
    screenWidth: 384,
    screenHeight: 824,
    borderRadius: 40,
    color: "#1a1a1a",
    bezelWidth: 3,
  },
  macbook: {
    frameWidth: 1440,
    frameHeight: 900,
    screenX: 108,
    screenY: 36,
    screenWidth: 1224,
    screenHeight: 766,
    borderRadius: 8,
    color: "#2a2a2a",
    bezelWidth: 2,
  },
  ipad: {
    frameWidth: 820,
    frameHeight: 1100,
    screenX: 30,
    screenY: 50,
    screenWidth: 760,
    screenHeight: 1000,
    borderRadius: 16,
    color: "#1a1a1a",
    bezelWidth: 3,
  },
};

/** Generate an SVG device frame */
function createDeviceFrame(device: keyof typeof DEVICES): string {
  const d = DEVICES[device];

  if (device === "macbook") {
    return `<svg width="${d.frameWidth}" height="${d.frameHeight + 40}" xmlns="http://www.w3.org/2000/svg">
      <!-- Laptop screen body -->
      <rect x="80" y="0" width="${d.frameWidth - 160}" height="${d.frameHeight - 40}" rx="12" fill="${d.color}" />
      <rect x="${d.screenX}" y="${d.screenY}" width="${d.screenWidth}" height="${d.screenHeight}" rx="${d.borderRadius}" fill="#000" />
      <!-- Camera dot -->
      <circle cx="${d.frameWidth / 2}" cy="18" r="4" fill="#333" />
      <!-- Base -->
      <path d="M 0 ${d.frameHeight - 40} Q 0 ${d.frameHeight} 40 ${d.frameHeight} L ${d.frameWidth - 40} ${d.frameHeight} Q ${d.frameWidth} ${d.frameHeight} ${d.frameWidth} ${d.frameHeight - 40} Z" fill="#333" />
      <rect x="0" y="${d.frameHeight}" width="${d.frameWidth}" height="8" rx="4" fill="#2a2a2a" />
    </svg>`;
  }

  return `<svg width="${d.frameWidth}" height="${d.frameHeight}" xmlns="http://www.w3.org/2000/svg">
    <rect width="${d.frameWidth}" height="${d.frameHeight}" rx="${d.borderRadius + 12}" fill="${d.color}" />
    <rect x="${d.bezelWidth}" y="${d.bezelWidth}" width="${d.frameWidth - d.bezelWidth * 2}" height="${d.frameHeight - d.bezelWidth * 2}" rx="${d.borderRadius + 10}" fill="#111" />
    <rect x="${d.screenX}" y="${d.screenY}" width="${d.screenWidth}" height="${d.screenHeight}" rx="${d.borderRadius}" fill="#000" />
  </svg>`;
}

async function generateMockup(config: MockupConfig) {
  const sharp = (await import("sharp")).default;
  const { mkdir } = await import("fs/promises");
  const { dirname } = await import("path");

  await mkdir(dirname(config.output), { recursive: true });

  const device = DEVICES[config.device];
  let screenshotBuffer: Buffer;

  if (config.url) {
    // Screenshot from URL via Playwright
    const { chromium } = await import("playwright");
    const browser = await chromium.launch();
    const page = await browser.newPage({
      viewport: { width: device.screenWidth, height: device.screenHeight },
      deviceScaleFactor: 2,
    });
    await page.goto(config.url, { waitUntil: "networkidle" });
    screenshotBuffer = await page.screenshot({ type: "png" }) as Buffer;
    await browser.close();
  } else if (config.image) {
    screenshotBuffer = await (await import("fs/promises")).readFile(config.image) as unknown as Buffer;
  } else {
    throw new Error("Either --image or --url is required");
  }

  // Resize screenshot to fit screen area
  const resizedScreenshot = await sharp(screenshotBuffer)
    .resize(device.screenWidth * 2, device.screenHeight * 2, { fit: "cover" })
    .png()
    .toBuffer();

  // Create device frame SVG
  const frameSvg = createDeviceFrame(config.device);
  const frameHeight = config.device === "macbook" ? device.frameHeight + 40 : device.frameHeight;

  // Composite: frame + screenshot
  const result = await sharp(Buffer.from(frameSvg))
    .resize(device.frameWidth * 2, frameHeight * 2)
    .composite([
      {
        input: resizedScreenshot,
        top: device.screenY * 2,
        left: device.screenX * 2,
      },
    ])
    .png()
    .toFile(config.output);

  console.log(`✓ Device mockup (${config.device}): ${config.output} (${device.frameWidth * 2}×${frameHeight * 2})`);
  return config.output;
}

// CLI
async function main() {
  const args = process.argv.slice(2);
  const getArg = (flag: string): string | undefined => {
    const idx = args.indexOf(flag);
    return idx !== -1 ? args[idx + 1] : undefined;
  };

  const device = getArg("--device") as MockupConfig["device"];
  if (!device || !DEVICES[device]) {
    console.error("Usage: npx tsx generate.ts --image ./screenshot.png --device [iphone|macbook|ipad] --output ./mockup.png");
    process.exit(1);
  }

  await generateMockup({
    image: getArg("--image"),
    url: getArg("--url"),
    device,
    output: getArg("--output") ?? `./generated-assets/${device}-mockup.png`,
    format: getArg("--format") as MockupConfig["format"],
  });
}

main().catch((err) => { console.error(err.message); process.exit(1); });

export { generateMockup };
