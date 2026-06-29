import { router } from "expo-router";
import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";

import { colors, fonts, radii, spacing } from "@/design/tokens";
import { RANK_CONFIG, getWinrate } from "@/lib/ranked-logic";
import { useRanked } from "@/lib/ranked-context";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { AppHeader } from "@/ui/primitives/app-header";
import { StageScreen } from "@/ui/primitives/stage-screen";
import { BottomNav } from "@/ui/primitives/bottom-nav";
import { LeaderboardRow } from "@/features/ranked/components/leaderboard-row";
import type { LeaderboardEntry } from "@/types/ranked";
import { useLeaderboard } from "@/lib/supabase-hooks";
import { DataStatePanel } from "@/ui/primitives/data-state-panel";

const TABS = ["Global", "Diese Woche", "Season"] as const;
type TabId = typeof TABS[number];

const PODIUM_MEDALS = ["🥇", "🥈", "🥉"];
const PODIUM_COLORS = ["#FFD700", "#C0C0C0", "#CD7F32"];

function PodiumCard({ entry, pos }: { entry: LeaderboardEntry; pos: 0 | 1 | 2 }) {
  const config = RANK_CONFIG[entry.tier];
  const heights = [100, 80, 64];
  const sizes = [56, 48, 44];

  return (
    <View style={{ flex: 1, alignItems: "center", gap: spacing.sm }}>
      <Text style={{ fontSize: sizes[pos] / 2 }}>{entry.avatarEmoji}</Text>
      <Text style={{ color: PODIUM_COLORS[pos], fontFamily: fonts.bodyBold, fontSize: 13 }} numberOfLines={1}>
        {entry.name}
      </Text>
      <Text style={{ color: config.color, fontFamily: fonts.bodySemiBold, fontSize: 11 }}>
        {entry.lp} LP
      </Text>
      <View style={{
        width: "100%",
        height: heights[pos],
        borderRadius: radii.input,
        backgroundColor: `${PODIUM_COLORS[pos]}22`,
        borderTopWidth: 3,
        borderColor: PODIUM_COLORS[pos],
        alignItems: "center",
        justifyContent: "flex-start",
        paddingTop: spacing.sm,
      }}>
        <Text style={{ fontSize: 22 }}>{PODIUM_MEDALS[pos]}</Text>
        <Text style={{ color: PODIUM_COLORS[pos], fontFamily: fonts.displayExtraBold, fontSize: 20 }}>
          #{entry.rank}
        </Text>
      </View>
    </View>
  );
}

export function RankedLeaderboardScreen() {
  const [activeTab, setActiveTab] = useState<TabId>("Global");
  const { rankedProfile } = useRanked();
  const { data: leaderboard, loading, error, refresh } = useLeaderboard();
  const reducedMotion = useReducedMotion();
  const winrate = getWinrate(rankedProfile.wins, rankedProfile.losses);
  const databasePlayer = leaderboard.find((entry) => entry.isPlayer);

  if (loading || error || leaderboard.length === 0) {
    return (
      <View style={{ flex: 1 }}>
        <StageScreen stageColor={colors.stageGrapeDeep} pattern="dots">
          <AppHeader title="Rangliste" actionLabel="Zurück" onAction={() => router.back()} />
          <DataStatePanel
            title={loading ? "Rangliste wird geladen" : error ? "Rangliste nicht erreichbar" : "Noch keine Ranglistendaten"}
            message={loading ? "Die Platzierungen kommen direkt aus Supabase." : error ?? "Sobald Ranked-Profile existieren, erscheinen sie hier."}
            loading={loading}
            onRetry={loading ? undefined : () => void refresh()}
          />
        </StageScreen>
        <BottomNav activeTab="ranked" />
      </View>
    );
  }

  const playerEntry: LeaderboardEntry = {
    rank: databasePlayer?.rank ?? rankedProfile.globalRank,
    name: databasePlayer?.name ?? "Du",
    tier: rankedProfile.tier,
    division: rankedProfile.division,
    lp: rankedProfile.lp,
    winrate,
    avatarEmoji: databasePlayer?.avatarEmoji ?? "👤",
    isPlayer: true,
  };

  const top3 = leaderboard.slice(0, 3);
  const rest = leaderboard.slice(3).filter((entry) => !entry.isPlayer);

  return (
    <View style={{ flex: 1 }}>
      <StageScreen stageColor={colors.stageGrapeDeep} pattern="dots" scrollEnabled>
        <AppHeader
          title="Rangliste"
          actionLabel="Zurück"
          onAction={() => router.back()}
        />

        {/* Tabs */}
        <Animated.View
          entering={reducedMotion ? undefined : FadeIn.duration(300)}
          style={{ flexDirection: "row", gap: spacing.sm, marginBottom: spacing.xl }}
        >
          {TABS.map((tab) => {
            const active = activeTab === tab;
            return (
              <Pressable
                key={tab}
                onPress={() => setActiveTab(tab)}
                style={{
                  flex: 1,
                  paddingVertical: 8,
                  borderRadius: radii.control,
                  backgroundColor: active ? colors.stageGrape : "rgba(255,255,255,0.08)",
                  borderWidth: 1,
                  borderColor: active ? colors.stageGrape : "rgba(255,255,255,0.1)",
                  alignItems: "center",
                }}
              >
                <Text style={{
                  color: active ? colors.white : colors.whiteSoft,
                  fontFamily: active ? fonts.bodyBold : fonts.body,
                  fontSize: 12,
                }}>
                  {tab}
                </Text>
              </Pressable>
            );
          })}
        </Animated.View>

        {/* Data source notice */}
        <View style={{
          paddingHorizontal: 12,
          paddingVertical: 6,
          borderRadius: radii.control,
          backgroundColor: "rgba(255,216,77,0.1)",
          borderWidth: 1,
          borderColor: "rgba(255,216,77,0.25)",
          marginBottom: spacing.xl,
        }}>
          <Text style={{ color: colors.sun, fontFamily: fonts.body, fontSize: 11, textAlign: "center" }}>
            ● LIVE • Supabase Rangliste
          </Text>
        </View>

        {/* Podium */}
        <Animated.View
          entering={reducedMotion ? undefined : FadeInDown.delay(100).duration(400)}
          style={{ flexDirection: "row", alignItems: "flex-end", gap: spacing.md, marginBottom: spacing.xl }}
        >
          {top3[1] ? <PodiumCard entry={top3[1]} pos={1} /> : null}
          {top3[0] ? <PodiumCard entry={top3[0]} pos={0} /> : null}
          {top3[2] ? <PodiumCard entry={top3[2]} pos={2} /> : null}
        </Animated.View>

        {/* List */}
        <View style={{ gap: spacing.sm }}>
          {rest.map((entry, i) => (
            <Animated.View
              key={entry.rank}
              entering={reducedMotion ? undefined : FadeInDown.delay(150 + i * 30).duration(250)}
            >
              <LeaderboardRow entry={entry} />
            </Animated.View>
          ))}
        </View>

        {/* Divider */}
        <View style={{ alignItems: "center", paddingVertical: spacing.lg }}>
          <Text style={{ color: colors.whiteSoft, fontFamily: fonts.body, fontSize: 18 }}>•  •  •</Text>
          <Text style={{ color: colors.whiteSoft, fontFamily: fonts.body, fontSize: 12 }}>
            {(rankedProfile.globalRank - 20).toLocaleString("de-DE")} weitere Spieler
          </Text>
        </View>

        {/* Player row */}
        <Animated.View
          entering={reducedMotion ? undefined : FadeInDown.delay(600).duration(300)}
          style={{ marginBottom: 100 }}
        >
          <LeaderboardRow entry={playerEntry} />
        </Animated.View>
      </StageScreen>

      <BottomNav activeTab="ranked" />
    </View>
  );
}
