import type { PropsWithChildren } from "react";
import { useEffect } from "react";
import { ScrollView, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

import { colors } from "@/design/tokens";
import { useReducedMotion } from "@/lib/use-reduced-motion";

type StageScreenProps = PropsWithChildren<{
  stageColor: string;
  pattern?: "confetti" | "rings" | "dots" | "orbit";
  scrollEnabled?: boolean;
}>;

// Ambient depth glow — one distinct light-source profile per pattern type,
// so screens don't all read as the same flat fill with an identical glow
// pasted on top. Position, size, tint, and intensity vary per profile.
type GlowSpec = { top?: number; bottom?: number; left?: number; right?: number; size: number; color: string; opacity: number };
const GLOW_PROFILES: Record<NonNullable<StageScreenProps["pattern"]>, GlowSpec[]> = {
  // Structured / navigational screens (auth, lobby, mode-select, ranked home):
  // single confident light source, top-left, echoed faintly bottom-right.
  rings: [
    { top: -220, left: -160, size: 520, color: colors.white, opacity: 0.08 },
    { bottom: -180, right: -140, size: 420, color: colors.ink, opacity: 0.1 },
  ],
  // Calmer detail/list screens (profile, leaderboard, pass, cosmetics):
  // one soft wide glow centered high, nothing competing at the bottom.
  dots: [
    { top: -260, left: -80, size: 620, color: colors.white, opacity: 0.06 },
  ],
  // Celebratory screens (home, setup): warm sun-tinted glow opposite a cool
  // ink pocket, diagonal, higher contrast for an energetic first impression.
  confetti: [
    { top: -180, right: -180, size: 480, color: colors.sun, opacity: 0.1 },
    { bottom: -200, left: -120, size: 380, color: colors.ink, opacity: 0.12 },
  ],
  // Shop: a distinct three-point "spotlight rig" — brighter, more directional,
  // evoking product-shelf lighting rather than ambient party glow.
  orbit: [
    { top: -140, left: -100, size: 360, color: colors.sun, opacity: 0.09 },
    { top: 180, right: -160, size: 300, color: colors.white, opacity: 0.05 },
    { bottom: -220, left: 60, size: 460, color: colors.ink, opacity: 0.14 },
  ],
};

// Floating animated shape — gently drifts up/down and rotates
function FloatingShape({
  style,
  delay = 0,
  duration = 4000,
  yRange = 12,
  rotation = 0,
}: {
  style: object;
  delay?: number;
  duration?: number;
  yRange?: number;
  rotation?: number;
}) {
  const translateY = useSharedValue(0);
  const rotate = useSharedValue(0);

  useEffect(() => {
    translateY.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(-yRange, { duration, easing: Easing.inOut(Easing.sin) }),
          withTiming(yRange, { duration, easing: Easing.inOut(Easing.sin) })
        ),
        -1,
        true
      )
    );
    if (rotation !== 0) {
      rotate.value = withDelay(
        delay,
        withRepeat(
          withTiming(rotation, { duration: duration * 2.5, easing: Easing.inOut(Easing.quad) }),
          -1,
          true
        )
      );
    }
  }, []);

  const animStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: translateY.value },
      { rotate: `${rotate.value}deg` },
    ],
  }));

  return <Animated.View style={[style, animStyle]} />;
}

function Pattern({ type, reducedMotion }: { type: NonNullable<StageScreenProps["pattern"]>; reducedMotion: boolean }) {
  if (type === "orbit") {
    return <OrbitPattern reducedMotion={reducedMotion} />;
  }

  if (type === "rings") {
    return (
      <>
        <FloatingShape
          style={{
            position: "absolute",
            width: 230,
            height: 230,
            borderRadius: 999,
            borderWidth: 2,
            borderColor: colors.whiteFaint,
            right: -110,
            top: 150,
          }}
          delay={0}
          duration={5500}
          yRange={reducedMotion ? 0 : 14}
        />
        <FloatingShape
          style={{
            position: "absolute",
            width: 100,
            height: 100,
            borderRadius: 999,
            borderWidth: 2,
            borderColor: colors.whiteFaint,
            left: -52,
            bottom: 120,
          }}
          delay={800}
          duration={4200}
          yRange={reducedMotion ? 0 : 9}
        />
      </>
    );
  }

  if (type === "dots") {
    return (
      <>
        <FloatingShape
          style={{ position: "absolute", width: 18, height: 18, borderRadius: 9, backgroundColor: colors.whiteFaint, right: 38, top: 156 }}
          delay={0}
          duration={3800}
          yRange={reducedMotion ? 0 : 10}
        />
        <FloatingShape
          style={{ position: "absolute", width: 10, height: 10, borderRadius: 5, backgroundColor: colors.whiteFaint, left: 34, top: 278 }}
          delay={600}
          duration={4600}
          yRange={reducedMotion ? 0 : 7}
        />
        <FloatingShape
          style={{ position: "absolute", width: 15, height: 15, borderRadius: 8, backgroundColor: colors.whiteFaint, right: 84, bottom: 104 }}
          delay={1200}
          duration={5100}
          yRange={reducedMotion ? 0 : 11}
        />
      </>
    );
  }

  // confetti
  return (
    <>
      <FloatingShape
        style={{ position: "absolute", width: 76, height: 20, borderRadius: 10, backgroundColor: colors.whiteFaint, right: -14, top: 122 }}
        delay={0}
        duration={4800}
        yRange={reducedMotion ? 0 : 12}
        rotation={reducedMotion ? 0 : 6}
      />
      <FloatingShape
        style={{ position: "absolute", width: 55, height: 14, borderRadius: 8, backgroundColor: colors.whiteFaint, left: -12, top: 230 }}
        delay={700}
        duration={5200}
        yRange={reducedMotion ? 0 : 10}
        rotation={reducedMotion ? 0 : -8}
      />
      <FloatingShape
        style={{ position: "absolute", width: 2, height: 58, backgroundColor: colors.whiteFaint, left: 52, bottom: 104 }}
        delay={300}
        duration={6000}
        yRange={reducedMotion ? 0 : 16}
      />
      <FloatingShape
        style={{ position: "absolute", width: 58, height: 2, backgroundColor: colors.whiteFaint, left: 24, bottom: 132 }}
        delay={1100}
        duration={4400}
        yRange={reducedMotion ? 0 : 8}
      />
    </>
  );
}

// Shop-only decorative layer: small rotated squares (price-tag silhouettes)
// instead of rings/dots/confetti, so the storefront reads as its own place.
function OrbitPattern({ reducedMotion }: { reducedMotion: boolean }) {
  return (
    <>
      <FloatingShape
        style={{ position: "absolute", width: 34, height: 34, borderRadius: 9, borderWidth: 2, borderColor: colors.whiteFaint, right: 28, top: 100 }}
        delay={0}
        duration={5200}
        yRange={reducedMotion ? 0 : 10}
        rotation={reducedMotion ? 0 : 14}
      />
      <FloatingShape
        style={{ position: "absolute", width: 20, height: 20, borderRadius: 6, backgroundColor: colors.whiteFaint, left: 24, top: 210 }}
        delay={500}
        duration={4600}
        yRange={reducedMotion ? 0 : 8}
        rotation={reducedMotion ? 0 : -10}
      />
      <FloatingShape
        style={{ position: "absolute", width: 46, height: 46, borderRadius: 12, borderWidth: 2, borderColor: colors.whiteFaint, right: -10, bottom: 180 }}
        delay={900}
        duration={5800}
        yRange={reducedMotion ? 0 : 12}
        rotation={reducedMotion ? 0 : 18}
      />
    </>
  );
}

export function StageScreen({ children, stageColor, pattern = "confetti", scrollEnabled = false }: StageScreenProps) {
  const reducedMotion = useReducedMotion();

  return (
    <View style={{ flex: 1, backgroundColor: stageColor }}>
      {/* Ambient depth glow — profile varies per pattern type so screens
          don't all read as the same flat fill with an identical light
          source pasted on top. See GLOW_PROFILES above. */}
      <View style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
        {GLOW_PROFILES[pattern].map((glow, i) => (
          <View
            key={i}
            style={{
              position: "absolute",
              width: glow.size,
              height: glow.size,
              borderRadius: 999,
              top: glow.top,
              bottom: glow.bottom,
              left: glow.left,
              right: glow.right,
              backgroundColor: glow.color,
              opacity: glow.opacity,
            }}
          />
        ))}
      </View>

      {/* Decorative animated background */}
      <View style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
        <Pattern type={pattern} reducedMotion={reducedMotion} />
      </View>

      {/* SafeAreaView handles top/bottom insets reliably on all iPhone models */}
      <SafeAreaView style={{ flex: 1 }} edges={["top", "bottom"]}>
        <ScrollView
          contentInsetAdjustmentBehavior="never"
          keyboardShouldPersistTaps="handled"
          scrollEnabled={scrollEnabled}
          bounces={false}
          overScrollMode="never"
          style={{ flex: 1 }}
          contentContainerStyle={{ flexGrow: 1 }}
        >
          <View
            style={{
              flex: 1,
              width: "100%",
              maxWidth: 520,
              alignSelf: "center",
              paddingHorizontal: 20,
              paddingVertical: 8,
            }}
          >
            {children}
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
