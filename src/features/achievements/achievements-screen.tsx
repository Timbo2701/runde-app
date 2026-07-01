import { router } from "expo-router";
import { Text, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

import { colors, fonts, radii, spacing } from "@/design/tokens";
import { useAchievements } from "@/lib/use-achievements";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import type { Achievement, AchievementCategory } from "@/types/achievements";
import { AppHeader } from "@/ui/primitives/app-header";
import { DataStatePanel } from "@/ui/primitives/data-state-panel";
import { StageScreen } from "@/ui/primitives/stage-screen";

const CATEGORY_LABELS: Record<AchievementCategory, string> = {
  spielen: "Spielen",
  siegen: "Siegen",
  sozial: "Sozial",
  modus: "Modi",
  streak: "Serien",
};

function AchievementRow({ achievement, index }: { achievement: Achievement; index: number }) {
  const reducedMotion = useReducedMotion();
  return (
    <Animated.View entering={reducedMotion ? undefined : FadeInDown.delay(index * 30).duration(220)}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 12,
          backgroundColor: achievement.isUnlocked ? "rgba(255,216,77,0.13)" : "rgba(255,255,255,0.05)",
          borderWidth: 1,
          borderColor: achievement.isUnlocked ? "rgba(255,216,77,0.35)" : "rgba(255,255,255,0.09)",
          borderRadius: radii.control,
          padding: spacing.lg,
        }}
      >
        <View
          style={{
            width: 44,
            height: 44,
            borderRadius: 14,
            backgroundColor: achievement.isUnlocked ? "rgba(255,216,77,0.22)" : "rgba(255,255,255,0.06)",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text style={{ fontSize: 22, opacity: achievement.isUnlocked ? 1 : 0.4 }}>{achievement.emoji}</Text>
        </View>
        <View style={{ flex: 1, gap: 3 }}>
          <Text
            style={{
              color: achievement.isUnlocked ? colors.white : colors.whiteSoft,
              fontFamily: fonts.bodySemiBold,
              fontSize: 14,
              opacity: achievement.isUnlocked ? 1 : 0.7,
            }}
          >
            {achievement.title}
          </Text>
          <Text style={{ color: colors.whiteSoft, fontFamily: fonts.body, fontSize: 11, opacity: 0.75 }} numberOfLines={2}>
            {achievement.description}
          </Text>
          {achievement.progress && !achievement.isUnlocked && (
            <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginTop: 4 }}>
              <View style={{ flex: 1, height: 3, borderRadius: 2, backgroundColor: "rgba(255,255,255,0.12)", overflow: "hidden" }}>
                <View
                  style={{
                    height: 3,
                    width: `${Math.min(100, (achievement.progress.current / achievement.progress.target) * 100)}%`,
                    borderRadius: 2,
                    backgroundColor: colors.sun,
                  }}
                />
              </View>
              <Text style={{ color: colors.whiteSoft, fontFamily: fonts.mono, fontSize: 10 }}>
                {achievement.progress.current}/{achievement.progress.target}
              </Text>
            </View>
          )}
        </View>
        {achievement.isUnlocked && (
          <View style={{ width: 22, height: 22, borderRadius: 11, backgroundColor: colors.sun, alignItems: "center", justifyContent: "center" }}>
            <Text style={{ color: colors.ink, fontSize: 11, fontFamily: fonts.bodyBold }}>✓</Text>
          </View>
        )}
      </View>
    </Animated.View>
  );
}

export function AchievementsScreen() {
  const { achievements, loading, error, refresh } = useAchievements();
  const reducedMotion = useReducedMotion();

  if (loading || error) {
    return (
      <StageScreen stageColor={colors.stageCoral} pattern="dots">
        <AppHeader title="Achievements" actionLabel="Zurück" onAction={() => router.back()} />
        <DataStatePanel
          title={loading ? "Achievements werden geladen" : "Achievements nicht erreichbar"}
          message={loading ? "Alle Erfolge kommen direkt aus Supabase." : error ?? "Bitte versuche es erneut."}
          loading={loading}
          onRetry={loading ? undefined : () => void refresh()}
        />
      </StageScreen>
    );
  }

  const unlockedCount = achievements.filter((a) => a.isUnlocked).length;
  const categories = Array.from(new Set(achievements.map((a) => a.category)));

  return (
    <StageScreen stageColor={colors.stageCoral} pattern="dots" scrollEnabled>
      <AppHeader title="Achievements" actionLabel="Zurück" onAction={() => router.back()} />

      <Animated.View
        entering={reducedMotion ? undefined : FadeInDown.duration(240)}
        style={{
          marginTop: 16,
          marginBottom: 20,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          padding: spacing.lg,
          borderRadius: radii.card,
          backgroundColor: "rgba(0,0,0,0.2)",
        }}
      >
        <View>
          <Text style={{ color: colors.white, fontFamily: fonts.displayExtraBold, fontSize: 22 }}>
            {unlockedCount} / {achievements.length}
          </Text>
          <Text style={{ color: colors.whiteSoft, fontFamily: fonts.body, fontSize: 12 }}>
            Erfolge freigeschaltet
          </Text>
        </View>
        <Text style={{ fontSize: 32 }}>🏆</Text>
      </Animated.View>

      {categories.map((category) => (
        <View key={category} style={{ gap: 10, marginBottom: 22 }}>
          <Text style={{ color: colors.whiteSoft, fontFamily: fonts.bodySemiBold, fontSize: 12, letterSpacing: 1.2 }}>
            {CATEGORY_LABELS[category]?.toUpperCase() ?? category.toUpperCase()}
          </Text>
          <View style={{ gap: 8 }}>
            {achievements
              .filter((a) => a.category === category)
              .map((a, i) => (
                <AchievementRow key={a.id} achievement={a} index={i} />
              ))}
          </View>
        </View>
      ))}

      <View style={{ height: 40 }} />
    </StageScreen>
  );
}
