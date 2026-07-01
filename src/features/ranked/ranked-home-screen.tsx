import { router } from "expo-router";
import { Pressable, Text, View } from "react-native";
import Animated, { FadeIn, FadeInDown, FadeInUp, useAnimatedStyle, useSharedValue, withRepeat, withSequence, withTiming } from "react-native-reanimated";
import { useEffect } from "react";

import { colors, fonts, radii, spacing } from "@/design/tokens";
import { useRanked } from "@/lib/ranked-context";
import { getFullRankLabel, getWinrate, RANK_CONFIG } from "@/lib/ranked-logic";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { AppHeader } from "@/ui/primitives/app-header";
import { BrandButton } from "@/ui/primitives/brand-button";
import { StageScreen } from "@/ui/primitives/stage-screen";
import { BottomNav } from "@/ui/primitives/bottom-nav";
import { RankBadge } from "@/features/ranked/components/rank-badge";
import { LpProgress } from "@/features/ranked/components/lp-progress";
import { MissionCard } from "@/features/ranked/components/mission-card";
import { BattlePassTeaser } from "@/features/ranked/components/battle-pass-teaser";
import { useBattlePass, useBattlePassRewards, useMissions } from "@/lib/supabase-hooks";
import { DataStatePanel } from "@/ui/primitives/data-state-panel";

function PlayButton({ onPress, reducedMotion }: { onPress: () => void; reducedMotion: boolean }) {
  const scale = useSharedValue(1);

  useEffect(() => {
    if (reducedMotion) return;
    scale.value = withRepeat(
      withSequence(
        withTiming(1.04, { duration: 900 }),
        withTiming(1, { duration: 900 })
      ),
      -1,
      true
    );
  }, [reducedMotion]);

  const animStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  return (
    <Animated.View style={animStyle}>
      <Pressable
        onPress={onPress}
        style={({ pressed }) => ({
          height: 64,
          borderRadius: radii.card,
          backgroundColor: colors.sun,
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "row",
          gap: 10,
          shadowColor: colors.sun,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.5,
          shadowRadius: 12,
          elevation: 10,
          opacity: pressed ? 0.9 : 1,
        })}
        accessibilityRole="button"
      >
        <Text style={{ fontSize: 22 }}>⚔️</Text>
        <Text style={{
          color: colors.ink,
          fontFamily: fonts.displayExtraBold,
          fontSize: 20,
          letterSpacing: 0.5,
        }}>
          SPIELEN
        </Text>
      </Pressable>
    </Animated.View>
  );
}

export function RankedHomeScreen() {
  const { rankedProfile, loaded, error: rankedError, refresh: refreshRanked } = useRanked();
  const { data: missions, loading: missionsLoading, error: missionsError, refresh: refreshMissions } = useMissions();
  const battlePass = useBattlePass();
  const passRewards = useBattlePassRewards();
  const reducedMotion = useReducedMotion();

  if (!loaded || missionsLoading || battlePass.loading || passRewards.loading) {
    return (
      <View style={{ flex: 1 }}>
        <StageScreen stageColor={colors.stageGrapeDeep} pattern="rings">
          <AppHeader title="Ranked Arena" />
          <DataStatePanel title="Arena wird geladen" message="Rang, Season und Missionen kommen direkt aus Supabase." loading />
        </StageScreen>
        <BottomNav activeTab="ranked" />
      </View>
    );
  }

  const dataError = rankedError ?? missionsError ?? battlePass.error ?? passRewards.error ?? (!battlePass.data ? "Für die aktive Season fehlt der Battle Pass." : null);
  if (dataError) {
    return (
      <View style={{ flex: 1 }}>
        <StageScreen stageColor={colors.stageGrapeDeep} pattern="rings">
          <AppHeader title="Ranked Arena" />
          <DataStatePanel
            title="Ranked-Daten nicht erreichbar"
            message={dataError}
            onRetry={() => { void refreshRanked(); void refreshMissions(); void battlePass.refresh(); void passRewards.refresh(); }}
          />
        </StageScreen>
        <BottomNav activeTab="ranked" />
      </View>
    );
  }

  const config = RANK_CONFIG[rankedProfile.tier];
  const winrate = getWinrate(rankedProfile.wins, rankedProfile.losses);

  return (
    <View style={{ flex: 1 }}>
      <StageScreen stageColor={colors.stageGrapeDeep} pattern="rings" scrollEnabled>
        <AppHeader title="Ranked Arena" />

        {/* Season Badge */}
        <Animated.View
          entering={reducedMotion ? undefined : FadeIn.duration(300)}
          style={{ alignItems: "flex-start", marginBottom: spacing.md }}
        >
          <View style={{
            paddingHorizontal: 12,
            paddingVertical: 4,
            borderRadius: radii.round,
            backgroundColor: "rgba(255,216,77,0.15)",
            borderWidth: 1,
            borderColor: "rgba(255,216,77,0.4)",
            flexDirection: "row",
            alignItems: "center",
            gap: 6,
          }}>
            <Text style={{ fontSize: 12 }}>⚡</Text>
            <Text style={{ color: colors.sun, fontFamily: fonts.bodyBold, fontSize: 12, letterSpacing: 0.8 }}>
              {rankedProfile.seasonName.toUpperCase()}
            </Text>
          </View>
        </Animated.View>

        {/* Hero */}
        <Animated.View
          entering={reducedMotion ? undefined : FadeInUp.duration(350)}
          style={{ alignItems: "center", gap: spacing.sm, marginBottom: spacing.xl }}
        >
          <Text style={{
            color: colors.white,
            fontFamily: fonts.displayExtraBold,
            fontSize: 38,
            lineHeight: 44,
            textAlign: "center",
          }}>
            Ranked Arena
          </Text>
          <Text style={{
            color: colors.whiteSoft,
            fontFamily: fonts.body,
            fontSize: 14,
            textAlign: "center",
          }}>
            Steig auf. Zeig Skill. Hol dir deinen Platz.
          </Text>
        </Animated.View>

        {/* Play button */}
        <Animated.View entering={reducedMotion ? undefined : FadeInDown.delay(100).duration(300)}>
          <PlayButton onPress={() => router.push("/ranked/queue" as never)} reducedMotion={reducedMotion} />
        </Animated.View>

        {/* Rank Card */}
        <Animated.View
          entering={reducedMotion ? undefined : FadeInDown.delay(180).duration(300)}
          style={{
            marginTop: spacing.xl,
            padding: spacing.xl,
            borderRadius: radii.card,
            backgroundColor: "rgba(0,0,0,0.25)",
            borderWidth: 1.5,
            borderColor: `${config.color}44`,
            gap: spacing.lg,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.xl }}>
            <RankBadge tier={rankedProfile.tier} division={rankedProfile.division} size="md" />

            <View style={{ flex: 1, gap: 8 }}>
              <Text style={{
                color: colors.white,
                fontFamily: fonts.displayExtraBold,
                fontSize: 22,
              }}>
                {getFullRankLabel(rankedProfile.tier, rankedProfile.division)}
              </Text>
              <LpProgress lp={rankedProfile.lp} tier={rankedProfile.tier} animated />
            </View>

            <View style={{ alignItems: "flex-end", gap: 4 }}>
              <Text style={{ color: colors.whiteSoft, fontFamily: fonts.mono, fontSize: 11 }}>
                #{rankedProfile.globalRank.toLocaleString("de-DE")}
              </Text>
              <Text style={{ color: colors.white, fontFamily: fonts.bodyBold, fontSize: 13 }}>
                {winrate}% WR
              </Text>
              {rankedProfile.winStreak >= 2 && (
                <Text style={{ color: colors.sun, fontFamily: fonts.bodyBold, fontSize: 12 }}>
                  🔥 {rankedProfile.winStreak} Streak
                </Text>
              )}
            </View>
          </View>
        </Animated.View>

        {/* Stats row */}
        <Animated.View
          entering={reducedMotion ? undefined : FadeInDown.delay(240).duration(300)}
          style={{ flexDirection: "row", gap: spacing.md, marginTop: spacing.lg }}
        >
          {[
            { label: "Siege", value: rankedProfile.wins, emoji: "🏆" },
            { label: "Niederlagen", value: rankedProfile.losses, emoji: "💀" },
            { label: "Season XP", value: rankedProfile.seasonPoints.toLocaleString("de-DE"), emoji: "⭐" },
          ].map((stat) => (
            <View
              key={stat.label}
              style={{
                flex: 1,
                alignItems: "center",
                gap: 2,
                padding: spacing.md,
                borderRadius: radii.control,
                backgroundColor: "rgba(255,255,255,0.07)",
                borderWidth: 1,
                borderColor: "rgba(255,255,255,0.1)",
              }}
            >
              <Text style={{ fontSize: 16 }}>{stat.emoji}</Text>
              <Text style={{ color: colors.white, fontFamily: fonts.displayExtraBold, fontSize: 18 }}>
                {stat.value}
              </Text>
              <Text style={{ color: colors.whiteSoft, fontFamily: fonts.body, fontSize: 10 }}>
                {stat.label}
              </Text>
            </View>
          ))}
        </Animated.View>

        {/* Daily Missions */}
        <Animated.View
          entering={reducedMotion ? undefined : FadeInDown.delay(300).duration(300)}
          style={{ marginTop: spacing.xl, gap: spacing.md }}
        >
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
            <Text style={{ color: colors.white, fontFamily: fonts.bodyBold, fontSize: 16 }}>
              Tagesmissionen
            </Text>
            <View style={{
              paddingHorizontal: 8,
              paddingVertical: 3,
              borderRadius: radii.round,
              backgroundColor: colors.stageGrape,
            }}>
              <Text style={{ color: colors.white, fontFamily: fonts.bodyBold, fontSize: 11 }}>
                {rankedProfile.dailyMissionsCompleted}/{rankedProfile.totalMissions}
              </Text>
            </View>
          </View>

          {missions.slice(0, 2).map((mission) => (
            <MissionCard key={mission.id} mission={mission} />
          ))}
        </Animated.View>

        {/* Battle Pass Teaser */}
        <Animated.View
          entering={reducedMotion ? undefined : FadeInDown.delay(360).duration(300)}
          style={{ marginTop: spacing.xl }}
        >
          <BattlePassTeaser
            xp={battlePass.data?.xp ?? rankedProfile.battlePassXp}
            maxLevel={battlePass.data?.maxLevel ?? 50}
            rewards={passRewards.data}
          />
        </Animated.View>

        {/* Action buttons */}
        <Animated.View
          entering={reducedMotion ? undefined : FadeInDown.delay(420).duration(300)}
          style={{ flexDirection: "row", gap: spacing.md, marginTop: spacing.xl, marginBottom: 100 }}
        >
          <View style={{ flex: 1 }}>
            <BrandButton
              label="Rangliste"
              onPress={() => router.push("/ranked/leaderboard" as never)}
              tone="outline"
            />
          </View>
          <View style={{ flex: 1 }}>
            <BrandButton
              label="Neon Pass"
              onPress={() => router.push("/ranked/pass" as never)}
              tone="outline"
            />
          </View>
        </Animated.View>
      </StageScreen>

      <BottomNav activeTab="ranked" />
    </View>
  );
}
