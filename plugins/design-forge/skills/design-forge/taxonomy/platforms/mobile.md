# Platform: Mobile App (React Native / Expo)

## When This Applies

React Native apps via Expo, cross-platform mobile experiences. Touch-first interaction, native navigation patterns, battery-conscious animations.

## Key Differences from Web

- **No hover states** — interactions are tap, long-press, swipe
- **No custom cursor** — never use CustomCursor on mobile
- **Touch targets**: minimum 44x44pt (Apple HIG) / 48x48dp (Material)
- **Safe areas**: respect notch, home indicator, status bar
- **Gesture navigation**: swipe-back, pull-to-refresh, swipe-to-delete
- **Bottom navigation**: primary nav lives at bottom, not sidebar
- **No viewport scroll triggers**: use `onScroll` events or Reanimated

## Animation Libraries (Mobile)

- **React Native Reanimated** (not Framer Motion) — worklet-based, runs on UI thread
- **Moti** — declarative animations for RN (wraps Reanimated)
- **React Native Gesture Handler** — gestures run on native thread
- **Lottie** — pre-rendered animations for complex sequences
- **NOT GSAP** — GSAP is web-only, doesn't work in React Native

## Animation Guidelines

Mobile animations must be battery-conscious and native-feeling:
- Duration: 200-350ms (faster than web — mobile feels sluggish at web durations)
- Easing: spring physics (`damping: 15, stiffness: 150`) — feels native
- No parallax (bad for scroll performance on mobile)
- No canvas backgrounds (battery drain)
- Reduce motion: respect `AccessibilityInfo.isReduceMotionEnabled`

## Layout Patterns

- **Tab navigation**: bottom tabs (5 max), each with its own stack
- **Stack navigation**: push/pop with native transitions
- **Modal sheets**: bottom sheet pattern (half/full screen)
- **Lists**: FlashList for performance, swipe actions
- **Cards**: rounded corners (`rounded-2xl`), shadow on iOS, elevation on Android

## Depth Strategy

- iOS: natural shadows (`shadowColor`, `shadowOffset`, `shadowOpacity`, `shadowRadius`)
- Android: `elevation` property
- Both: avoid blur effects (expensive on Android, limited support)
- Use layered backgrounds + shadow for depth, not glassmorphism

## Touch Interactions

- Tap: scale down slightly (0.97) on press, bounce back on release
- Long press: haptic feedback + context menu
- Swipe: spring physics for overscroll
- Pull to refresh: custom animated header
- No magnetic effects, no tilt cards, no cursor effects

## Design Forge Components (Mobile Compatibility)

| Component | Mobile Compatible? | Notes |
|---|---|---|
| GenerativeCanvas | No | Battery drain, no Canvas 2D in RN |
| GlassPanel | Limited | iOS only (`BlurView`), avoid on Android |
| ScrollProgress | Yes | Adapt to `onScroll` event |
| CustomCursor | No | No cursor on touch devices |
| Scanlines | No | Web CSS only |
| Typewriter | Yes | Adapt with Reanimated |
| HeroScene | No | Three.js not native (use expo-three if needed) |
| SoundLayer | Limited | Use expo-av instead |

## Expo-Specific Considerations

- Use `expo-haptics` for tactile feedback
- Use `expo-blur` for iOS blur effects (skip on Android)
- Use `expo-linear-gradient` for gradient backgrounds
- Navigation: `expo-router` with typed routes
- Icons: `@expo/vector-icons` or custom SVG via `react-native-svg`
