import { useEffect, useMemo } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";

const EFFECT_PALETTES: Record<string, string[]> = {
  effect_confetti: ["#FFD84D", "#C52A87", "#6F2BD3", "#FFFFFF", "#F0446E", "#A855F7", "#FFB347"],
  effect_fireworks: ["#FF4500", "#FF6A00", "#FFD84D", "#FF2244", "#FFFFFF", "#FF8C00", "#FF3D00"],
  effect_stars:     ["#FFD84D", "#FFF176", "#FFEE58", "#FFFFFF", "#FFD700", "#FFC107", "#FFECB3"],
  effect_lightning: ["#6F2BD3", "#A855F7", "#00E5FF", "#FFFFFF", "#7C4DFF", "#B388FF", "#40C4FF"],
};
const COLORS = EFFECT_PALETTES.effect_confetti;

interface ParticleConfig {
  id: number;
  color: string;
  startX: number;
  startY: number;
  driftX: number;
  size: number;
  isRect: boolean;
  delay: number;
  duration: number;
  rotateEnd: number;
}

function seededRandom(seed: number): number {
  const x = Math.sin(seed + 1) * 10000;
  return x - Math.floor(x);
}

function makeParticles(count: number, screenWidth: number, palette: string[]): ParticleConfig[] {
  return Array.from({ length: count }, (_, i) => {
    const r = (n: number) => seededRandom(i * 13 + n);
    return {
      id: i,
      color: palette[i % palette.length],
      startX: r(0) * screenWidth,
      startY: -10 - r(1) * 40,
      driftX: (r(2) - 0.5) * 180,
      size: 6 + r(3) * 8,
      isRect: i % 3 !== 0,
      delay: r(4) * 600,
      duration: 2400 + r(5) * 1200,
      rotateEnd: 360 + r(6) * 720,
    };
  });
}

function Particle({
  config,
  screenHeight,
  active,
}: {
  config: ParticleConfig;
  screenHeight: number;
  active: boolean;
}) {
  const y = useSharedValue(config.startY);
  const x = useSharedValue(config.startX);
  const rotate = useSharedValue(0);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (!active) return;
    const { delay, duration, driftX, rotateEnd } = config;
    const fadeDur = duration * 0.28;

    opacity.value = withDelay(delay, withTiming(1, { duration: 120 }));
    y.value = withDelay(
      delay,
      withTiming(screenHeight + 60, {
        duration,
        easing: Easing.in(Easing.quad),
      })
    );
    x.value = withDelay(
      delay,
      withTiming(config.startX + driftX, {
        duration,
        easing: Easing.inOut(Easing.sin),
      })
    );
    rotate.value = withDelay(delay, withTiming(rotateEnd, { duration }));
    opacity.value = withDelay(
      delay + duration * 0.72,
      withTiming(0, { duration: fadeDur, easing: Easing.in(Easing.quad) })
    );
  }, [active]);

  const animStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: x.value },
      { translateY: y.value },
      { rotate: `${rotate.value}deg` },
    ],
    opacity: opacity.value,
  }));

  const { size, color, isRect } = config;
  return (
    <Animated.View
      style={[
        styles.particle,
        {
          width: isRect ? size * 1.6 : size,
          height: isRect ? size * 0.6 : size,
          borderRadius: isRect ? 2 : size / 2,
          backgroundColor: color,
        },
        animStyle,
      ]}
    />
  );
}

interface ConfettiSystemProps {
  active: boolean;
  screenWidth: number;
  screenHeight: number;
  count?: number;
  effectId?: string;
}

export function ConfettiSystem({
  active,
  screenWidth,
  screenHeight,
  count = 70,
  effectId = "effect_confetti",
}: ConfettiSystemProps) {
  const palette = EFFECT_PALETTES[effectId] ?? EFFECT_PALETTES.effect_confetti;
  const particles = useMemo(
    () => makeParticles(count, screenWidth, palette),
    [count, screenWidth, effectId] // eslint-disable-line react-hooks/exhaustive-deps
  );

  if (!active) return null;

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {particles.map((cfg) => (
        <Particle
          key={cfg.id}
          config={cfg}
          screenHeight={screenHeight}
          active={active}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  particle: {
    position: "absolute",
    top: 0,
    left: 0,
  },
});
