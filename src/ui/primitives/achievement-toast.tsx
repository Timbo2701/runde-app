import { useEffect } from "react";
import { Text, View } from "react-native";
import Animated, {
  FadeInDown,
  FadeOutUp,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";

import { ACHIEVEMENTS } from "@/data/achievements";
import { colors, fonts, radii } from "@/design/tokens";
import { useReducedMotion } from "@/lib/use-reduced-motion";

interface Props {
  /** IDs of newly unlocked achievements to show. First one is displayed. */
  unlockedIds: string[];
  /** Called when the toast finishes (auto-dismiss after ~3s). */
  onDismiss?: () => void;
}

const SHOW_MS = 3200;

export function AchievementToast({ unlockedIds, onDismiss }: Props) {
  const reducedMotion = useReducedMotion();
  const opacity = useSharedValue(1);

  const achievementId = unlockedIds[0];
  const achievement = achievementId
    ? ACHIEVEMENTS.find((a) => a.id === achievementId)
    : null;

  useEffect(() => {
    if (!achievement) return;
    // Auto-dismiss after SHOW_MS
    const timer = setTimeout(() => {
      if (!reducedMotion) {
        opacity.value = withTiming(0, { duration: 300 });
      }
      setTimeout(() => onDismiss?.(), reducedMotion ? 0 : 320);
    }, SHOW_MS);
    return () => clearTimeout(timer);
  }, [achievement]);

  const animStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

  if (!achievement) return null;

  return (
    <Animated.View
      entering={reducedMotion ? undefined : FadeInDown.delay(500).duration(360).springify().damping(14)}
      style={[
        {
          position: "absolute",
          top: 60,
          left: 16,
          right: 16,
          zIndex: 999,
          flexDirection: "row",
          alignItems: "center",
          gap: 12,
          paddingHorizontal: 16,
          paddingVertical: 14,
          borderRadius: radii.card,
          borderCurve: "continuous",
          backgroundColor: "rgba(21,14,30,0.97)",
          borderWidth: 1.5,
          borderColor: "rgba(255,216,77,0.6)",
          shadowColor: colors.sun,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.35,
          shadowRadius: 12,
          elevation: 12,
        },
        animStyle,
      ]}
    >
      {/* Trophy circle */}
      <View
        style={{
          width: 44,
          height: 44,
          borderRadius: 22,
          backgroundColor: "rgba(255,216,77,0.18)",
          borderWidth: 1.5,
          borderColor: "rgba(255,216,77,0.5)",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text style={{ fontSize: 22, lineHeight: 28 }}>{achievement.emoji}</Text>
      </View>

      <View style={{ flex: 1, gap: 2 }}>
        <Text style={{ color: colors.sun, fontFamily: fonts.bodyBold, fontSize: 11, letterSpacing: 1.2 }}>
          ACHIEVEMENT FREIGESCHALTET
        </Text>
        <Text style={{ color: colors.white, fontFamily: fonts.bodySemiBold, fontSize: 15, lineHeight: 19 }}>
          {achievement.title}
        </Text>
        <Text style={{ color: "rgba(255,255,255,0.5)", fontFamily: fonts.body, fontSize: 12 }}>
          +{achievement.xp} XP
        </Text>
      </View>

      {/* Gold checkmark */}
      <View
        style={{
          width: 24,
          height: 24,
          borderRadius: 12,
          backgroundColor: colors.sun,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text style={{ color: colors.ink, fontFamily: fonts.bodyBold, fontSize: 13, lineHeight: 16 }}>✓</Text>
      </View>
    </Animated.View>
  );
}
