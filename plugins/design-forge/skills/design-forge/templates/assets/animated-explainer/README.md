# Animated Explainer Templates

Video/GIF generation for product demos, social content, and animated explainers.

## Library Options

| Library | License | Best For | Install Size |
|---------|---------|----------|-------------|
| **Motion Canvas** | MIT (free) | Code-driven animations, educational content | ~30MB |
| **Remotion** | Commercial license required | React-based video, complex compositions | ~150MB |
| **Rendervid** | MIT (free) | Template-driven, AI-agent MCP integration | ~40MB |

## Motion Canvas (Recommended — Free)

TypeScript generator-function API with real-time Vite preview. Export to frame sequences or video via FFmpeg.

### Setup

```bash
# Create a new Motion Canvas project
npm create @motion-canvas@latest my-explainer

# Or add to existing project
pnpm add @motion-canvas/core @motion-canvas/2d
pnpm add -D @motion-canvas/vite-plugin
```

### Project Structure

```
motion-canvas-starter/
├── src/
│   ├── project.ts           # Project config (scenes, audio)
│   ├── scenes/
│   │   ├── intro.tsx         # Opening title sequence
│   │   ├── feature.tsx       # Feature highlight with code
│   │   └── outro.tsx         # Closing CTA
│   └── components/
│       ├── BrandedText.tsx   # Text with brand colors/fonts
│       └── CodeBlock.tsx     # Syntax-highlighted code block
├── vite.config.ts
└── package.json
```

### Example Scene (intro.tsx)

```typescript
import { makeScene2D, Txt, Rect, Circle } from '@motion-canvas/2d';
import { all, createRef, waitFor } from '@motion-canvas/core';

export default makeScene2D(function* (view) {
  const title = createRef<Txt>();
  const subtitle = createRef<Txt>();

  view.add(
    <>
      <Txt
        ref={title}
        text="Your Product Name"
        fontSize={72}
        fontWeight={700}
        fill="#ededed"
        opacity={0}
        y={-40}
      />
      <Txt
        ref={subtitle}
        text="The tagline goes here"
        fontSize={28}
        fill="#a1a1a1"
        opacity={0}
        y={40}
      />
    </>
  );

  // Animate in
  yield* all(
    title().opacity(1, 0.6),
    title().y(0, 0.6),
  );
  yield* waitFor(0.3);
  yield* all(
    subtitle().opacity(1, 0.4),
    subtitle().y(20, 0.4),
  );
  yield* waitFor(2);
});
```

### Rendering

```bash
# Preview in browser
npx motion-canvas serve

# Export to frames
npx motion-canvas render

# Convert frames to MP4 (requires FFmpeg)
ffmpeg -framerate 30 -i output/frame%04d.png -c:v libx264 -pix_fmt yuv420p output.mp4

# Convert to GIF
ffmpeg -framerate 30 -i output/frame%04d.png -vf "fps=15,scale=640:-1" output.gif
```

## Remotion (Commercial License)

React-based video creation. Write compositions as React components. Requires paid license for commercial use.

### Setup

```bash
# Create new Remotion project
npx create-video@latest my-video

# Or add to existing
pnpm add remotion @remotion/cli @remotion/player
```

### Example Composition

```tsx
import { AbsoluteFill, useCurrentFrame, interpolate, spring } from 'remotion';

export const IntroScene: React.FC<{ title: string; brandColor: string }> = ({
  title, brandColor,
}) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 30], [0, 1]);
  const y = spring({ frame, fps: 30, config: { damping: 15 } });

  return (
    <AbsoluteFill style={{ background: '#070809', justifyContent: 'center', alignItems: 'center' }}>
      <h1 style={{
        fontSize: 72, fontWeight: 700, color: brandColor,
        opacity, transform: `translateY(${(1 - y) * 40}px)`,
      }}>
        {title}
      </h1>
    </AbsoluteFill>
  );
};
```

### Rendering

```bash
npx remotion render src/index.tsx IntroScene output.mp4
npx remotion still src/index.tsx IntroScene thumbnail.png --frame=60
```

## Brand Integration

Both frameworks accept brand colors/fonts from BrandConfig:

```typescript
import { resolveBrandConfig } from '../shared/brand-config';

const brand = resolveBrandConfig('saas', { name: 'Acme' });

// Use in Motion Canvas
<Txt fill={brand.colors.primary} fontFamily={brand.typography.displayFont} />

// Use in Remotion
<h1 style={{ color: brand.colors.primary, fontFamily: brand.typography.displayFont }} />
```

## FFmpeg Utilities

For post-processing (trim, resize, add audio):

```bash
# Add background music
ffmpeg -i video.mp4 -i music.mp3 -shortest -c:v copy -c:a aac output.mp4

# Resize for Instagram (1080x1080, center crop)
ffmpeg -i video.mp4 -vf "crop=min(iw\,ih):min(iw\,ih),scale=1080:1080" instagram.mp4

# Extract thumbnail at 2 seconds
ffmpeg -i video.mp4 -ss 2 -vframes 1 thumbnail.png

# Convert to GIF (optimized)
ffmpeg -i video.mp4 -vf "fps=15,scale=480:-1:flags=lanczos,split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse" output.gif
```
