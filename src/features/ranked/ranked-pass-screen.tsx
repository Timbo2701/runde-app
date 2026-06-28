import { router } from "expo-router";
import { Text, View } from "react-native";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";

import { colors, fonts, radii, spacing } from "@/design/tokens";
import { BATTLE_PASS_REWARDS } from "@/data/ranked-rewards";
import { useRanked } from "@/lib/ranked-context";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { AppHeader } from "@/ui/primitives/app-header";
import { StageScreen } from "@/ui/primitives/stage-screen";
import { BottomNav } from "@/ui/primitives/bottom-nav";
import type { BattlePassReward } from "@/types/ranked";

function RewardRow({ reward, currentLevel }: { reward: BattlePassReward; currentLevel: number }) {
  const isCurrent = reward.level === currentLevel;
  const isUnlocked = reward.level <= currentLevel;

  return (
    <View style={{
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.md,
      paddingVertical: 12,
      paddingHorizontal: spacing.lg,
      borderRadius: radii.control,
      backgroundColor: isCurrent
        ? "rgba(111,43,211,0.3)"
        : isUnlocked
        ? "rgba(67,184,107,0.08)"
        : "rgba(255,255,255,0.04)",
      borderWidth: isCurrent ? 2 : 1,
      borderColor: isCurrent
        ? colors.stageGrape
        : isUnlocked
        ? "rgba(67,184,107,0.3)"
        : "rgba(255,255,255,0.08)",
    }}>
      {/* Level */}
      <Text style={{
        width: 32,
        color: isCurrent ? colors.sun : isUnlocked ? colors.online : colors.whiteSoft,
        fontFamily: fonts.displayExtraBold,
        fontSize: 16,
        textAlign: "center",
      }}>
        {reward.level}
      </Text>

      {/* Separator */}
      <View style={{ width: 1, height: 32, backgroundColor: colors.whiteFaint }} />

      {/* Free reward */}
      <View style={{ flex: 1, flexDirection: "row", alignItems: "center", gap: 8 }}>
        <Text style={{ fontSize: 20, opacity: isUnlocked ? 1 : 0.5 }}>{reward.free.emoji}</Text>
        <Text style={{
          flex: 1,
          color: isUnlocked ? colors.white : colors.whiteSoft,
          fontFamily: fonts.bodySemiBold,
          fontSize: 12,
          opacity: isUnlocked ? 1 : 0.7,
        }} numberOfLines={2}>
          {reward.free.label}
        </Text>
      </View>

      {/* Separator */}
      <View style={{ width: 1, height: 32, backgroundColor: colors.whiteFaint }} />

      {/* Premium reward */}
      <View style={{ flex: 1, flexDirection: "row", alignItems: "center", gap: 8 }}>
        {reward.premium ? (
          <>
            <Text style={{ fontSize: 20, opacity: 0.4 }}>{reward.premium.emoji}</Text>
            <Text style={{
              flex: 1,
              color: colors.whiteSoft,
              fontFamily: fonts.body,
              fontSize: 12,
              opacity: 0.5,
            }} numberOfLines={2}>
              {reward.premium.label}
            </Text>
            <Text style={{ fontSize: 14 }}>🔒</Text>
          </>
        ) : (
          <Text style={{ color: colors.whiteSoft, fontFamily: fonts.body, fontSize: 11, opacity: 0.4 }}>—</Text>
        )}
      </View>

      {/* Status */}
      {isUnlocked && !isCurrent && (
        <Text style={{ fontSize: 14 }}>✅</Text>
      )}
      {isCurrent && (
        <View style={{
          width: 10,
          height: 10,
          borderRadius: 5,
          backgroundColor: colors.sun,
        }} />
      )}
    </View>
  );
}

export function RankedPassScreen() {
  const { rankedProfile } = useRanked();
  const reducedMotion = useReducedMotion();
  const xpProgress = rankedProfile.battlePassXp / 1000;

  // Build full reward list for levels 1-20
  const fullRewards = Array.from({ length: 20 }, (_, i) => {
    const level = i + 1;
    const explicit = BATTLE_PASS_REWARDS.find((r) => r.level === level);
    return explicit ?? {
      level,
      free: { emoji: "💬", label: `+${level * 50} Season XP`, type: "xp" },
      premium: { emoji: "✨", label: "Premium Bonus", type: "bonus" },
    };
  });

  return (
    <View style={{ flex: 1 }}>
      <StageScreen stageColor={colors.stageGrapeDeep} pattern="dots" scrollEnabled>
        <AppHeader
          title="Neon Pass"
          actionLabel="Zurück"
          onAction={() => router.back()}
        />

        {/* Header Card */}
        <Animated.View
          entering={reducedMotion ? undefined : FadeIn.duration(400)}
          style={{
            padding: spacing.xl,
            borderRadius: radii.card,
            backgroundColor: "rgba(111,43,211,0.25)",
            borderWidth: 2,
            borderColor: "rgba(111,43,211,0.6)",
            gap: spacing.lg,
            marginBottom: spacing.xl,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.md }}>
              <Text style={{ fontSize: 32 }}>🎖️</Text>
              <View>
                <Text style={{ color: colors.white, fontFamily: fonts.displayExtraBold, fontSize: 22 }}>
                  NEON PASS
                </Text>
                <Text style={{ color: colors.whiteSoft, fontFamily: fonts.body, fontSize: 12 }}>
                  {rankedProfile.seasonName}
                </Text>
              </View>
            </View>
            <View style={{
              paddingHorizontal: 12,
              paddingVertical: 6,
              borderRadius: radii.control,
              backgroundColor: "rgba(255,255,255,0.1)",
              borderWidth: 1,
              borderColor: "rgba(255,255,255,0.2)",
            }}>
              <Text style={{ color: colors.whiteSoft, fontFamily: fonts.body, fontSize: 11, textAlign: "center" }}>
                PREMIUM
              </Text>
              <Text style={{ color: colors.white, fontFamily: fonts.displayExtraBold, fontSize: 16, textAlign: "center" }}>
                9,99 €
              </Text>
            </View>
          </View>

          {/* Level progress */}
          <View style={{ gap: spacing.sm }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <Text style={{ color: colors.white, fontFamily: fonts.bodyBold, fontSize: 16 }}>
                Level {rankedProfile.battlePassLevel} / 50
              </Text>
              <Text style={{ color: colors.whiteSoft, fontFamily: fonts.mono, fontSize: 12 }}>
                {rankedProfile.battlePassXp} / 1000 XP
              </Text>
            </View>
            <View style={{
              height: 10,
              borderRadius: radii.round,
              backgroundColor: "rgba(255,255,255,0.12)",
              overflow: "hidden",
            }}>
              <View style={{
                width: `${xpProgress * 100}%`,
                height: 10,
                borderRadius: radii.round,
                backgroundColor: colors.stageGrape,
              }} />
            </View>
          </View>

          {/* Column headers */}
          <View style={{ flexDirection: "row", gap: spacing.md }}>
            <View style={{ width: 32 }} />
            <View style={{ width: 1 }} />
            <Text style={{ flex: 1, color: colors.whiteSoft, fontFamily: fonts.bodySemiBold, fontSize: 11 }}>
              GRATIS
            </Text>
            <View style={{ width: 1 }} />
            <Text style={{ flex: 1, color: "rgba(168,85,247,0.6)", fontFamily: fonts.bodySemiBold, fontSize: 11 }}>
              🔒 PREMIUM
            </Text>
          </View>
        </Animated.View>

        {/* Reward Track */}
        <View style={{ gap: spacing.sm }}>
          {fullRewards.map((reward, i) => (
            <Animated.View
              key={reward.level}
              entering={reducedMotion ? undefined : FadeInDown.delay(i * 25).duration(200)}
            >
              <RewardRow reward={reward} currentLevel={rankedProfile.battlePassLevel} />
            </Animated.View>
          ))}
        </View>

        {/* Disclaimer */}
        <View style={{
          margin: spacing.xl,
          padding: spacing.lg,
          borderRadius: radii.control,
          backgroundColor: "rgba(255,255,255,0.05)",
          borderWidth: 1,
          borderColor: "rgba(255,255,255,0.1)",
          gap: spacing.sm,
          marginBottom: 100,
        }}>
          <Text style={{ color: colors.whiteSoft, fontFamily: fonts.bodySemiBold, fontSize: 12 }}>
            ℹ️ Hinweise
          </Text>
          <Text style={{ color: colors.whiteSoft, fontFamily: fonts.body, fontSize: 12, lineHeight: 18, opacity: 0.7 }}>
            Kein Pay-to-Win. Nur Kosmetik & Prestige. Alle Premium-Items sind rein optisch und haben keinen Einfluss auf das Gameplay.{"\n\n"}
            Käufe sind aktuell Platzhalter – noch nicht verfügbar.
          </Text>
        </View>
      </StageScreen>

      <BottomNav activeTab="ranked" />
    </View>
  );
}
