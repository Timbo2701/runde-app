import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useRef } from "react";
import { Pressable, ScrollView, Text, useWindowDimensions, View } from "react-native";
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInUp,
  ZoomIn,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { colors, fonts, radii, spacing } from "@/design/tokens";
import { getFullRankLabel, RANK_CONFIG, applyLpChange, getLpWithinDivision, getWinrate } from "@/lib/ranked-logic";
import { useRanked } from "@/lib/ranked-context";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { ConfettiSystem } from "@/ui/primitives/confetti-system";
import { RankBadge } from "@/features/ranked/components/rank-badge";
import type { MatchResult } from "@/types/ranked";

// ── Animated LP bar ───────────────────────────────────────────────────────────

function LpBar({ oldLp, newLp, tier, reducedMotion }: {
  oldLp: number; newLp: number; tier: string; reducedMotion: boolean;
}) {
  const config = RANK_CONFIG[tier as keyof typeof RANK_CONFIG];
  const startPct = (getLpWithinDivision(oldLp) / 200) * 100;
  const endPct = (getLpWithinDivision(newLp) / 200) * 100;
  const width = useSharedValue(reducedMotion ? endPct : startPct);

  useEffect(() => {
    if (!reducedMotion) width.value = withDelay(700, withTiming(endPct, { duration: 900 }));
  }, [endPct, reducedMotion]);

  const barStyle = useAnimatedStyle(() => ({ width: `${width.value}%` }));

  return (
    <View style={{
      height: 12, borderRadius: radii.round,
      backgroundColor: "rgba(255,255,255,0.1)", overflow: "hidden",
    }}>
      <Animated.View style={[{
        height: 12, borderRadius: radii.round,
        backgroundColor: config?.color ?? colors.stageGrape,
        shadowColor: config?.glowColor ?? colors.stageGrape,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.7, shadowRadius: 6,
      }, barStyle]} />
    </View>
  );
}

// ── LP delta badge ────────────────────────────────────────────────────────────

function LpDeltaBadge({ delta, reducedMotion }: { delta: number; reducedMotion: boolean }) {
  const scale = useSharedValue(reducedMotion ? 1 : 0);
  const won = delta > 0;

  useEffect(() => {
    scale.value = withDelay(400, withSpring(1, { damping: 8, stiffness: 160 }));
  }, []);

  const style = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  return (
    <Animated.View style={[{
      paddingHorizontal: 20, paddingVertical: 10,
      borderRadius: radii.control,
      backgroundColor: won ? "rgba(67,184,107,0.15)" : "rgba(240,68,110,0.15)",
      borderWidth: 2,
      borderColor: won ? colors.online : colors.stageCoral,
    }, style]}>
      <Text style={{
        color: won ? colors.online : colors.stageCoral,
        fontFamily: fonts.displayExtraBold,
        fontSize: 28,
        textShadowColor: won ? colors.online : colors.stageCoral,
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 8,
      }}>
        {delta > 0 ? "+" : ""}{delta} LP
      </Text>
    </Animated.View>
  );
}

// ── Round result row ──────────────────────────────────────────────────────────

function RoundRow({ label, playerPts, botPts, playerCorrect, index }: {
  label: string; playerPts: number; botPts: number; playerCorrect: boolean; index: number;
}) {
  return (
    <Animated.View
      entering={FadeInDown.delay(300 + index * 80).duration(250)}
      style={{
        flexDirection: "row", alignItems: "center", gap: 12,
        paddingVertical: 10, paddingHorizontal: 14,
        borderRadius: radii.control,
        backgroundColor: "rgba(255,255,255,0.04)",
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.08)",
      }}
    >
      <Text style={{ fontSize: 16 }}>
        {label === "Speed Choice" ? "⚡" : label === "Close Guess" ? "🎯" : "🃏"}
      </Text>
      <Text style={{ flex: 1, color: colors.whiteSoft, fontFamily: fonts.body, fontSize: 13 }}>{label}</Text>
      <Text style={{ color: playerCorrect ? colors.online : colors.stageCoral, fontFamily: fonts.bodyBold, fontSize: 13 }}>
        {playerCorrect ? "✓" : "✗"}
      </Text>
      <Text style={{ color: colors.white, fontFamily: fonts.mono, fontSize: 14, minWidth: 40, textAlign: "right" }}>
        {playerPts} : {botPts}
      </Text>
    </Animated.View>
  );
}

// ── Main screen ───────────────────────────────────────────────────────────────

export function RankedResultScreen() {
  const { result: resultParam } = useLocalSearchParams<{ result: string }>();
  const { rankedProfile, applyMatchResult } = useRanked();
  const reducedMotion = useReducedMotion();
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const applied = useRef(false);

  const result: MatchResult | null = (() => {
    try { return JSON.parse(decodeURIComponent(resultParam ?? "")) as MatchResult; }
    catch { return null; }
  })();

  useEffect(() => {
    if (result && !applied.current) {
      applied.current = true;
      void applyMatchResult(result);
    }
  }, []);

  if (!result) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.stageGrapeDeep, alignItems: "center", justifyContent: "center" }}>
        <Text style={{ color: colors.white, fontFamily: fonts.body }}>Fehler beim Laden</Text>
      </View>
    );
  }

  const lpChanges = applyLpChange(rankedProfile, result.lpDelta);
  const oppConfig = RANK_CONFIG[result.opponent.tier];
  const newWinrate = getWinrate(
    result.won ? rankedProfile.wins + 1 : rankedProfile.wins,
    result.won ? rankedProfile.losses : rankedProfile.losses + 1
  );
  const xpGained = result.won ? 240 : 80;
  const bgColor = result.won ? "#120D1F" : "#0E0E14";
  const heroGlow = result.won ? colors.sun : colors.stageCoral;

  return (
    <View style={{ flex: 1, backgroundColor: bgColor }}>
      {/* Top glow */}
      <View style={{
        position: "absolute", top: 0, left: 0, right: 0, height: 260,
        backgroundColor: result.won ? "rgba(255,216,77,0.06)" : "rgba(240,68,110,0.06)",
      }} pointerEvents="none" />

      {/* Scroll content */}
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingTop: insets.top + 16,
          paddingBottom: insets.bottom + 32,
          paddingHorizontal: 20,
          gap: 20,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Hero ── */}
        <Animated.View
          entering={reducedMotion ? undefined : ZoomIn.duration(380).springify().damping(11)}
          style={{ alignItems: "center", gap: 10, paddingVertical: 8 }}
        >
          <Text style={{ fontSize: 64 }}>{result.won ? "🏆" : "🛡️"}</Text>
          <Text style={{
            color: result.won ? colors.sun : colors.white,
            fontFamily: fonts.displayExtraBold,
            fontSize: result.won ? 52 : 40,
            textAlign: "center",
            lineHeight: result.won ? 56 : 46,
            textShadowColor: heroGlow,
            textShadowOffset: { width: 0, height: 0 },
            textShadowRadius: result.won ? 20 : 10,
          }}>
            {result.won ? "SIEG!" : "Niederlage"}
          </Text>
          {!result.won && (
            <Text style={{ color: colors.whiteSoft, fontFamily: fonts.body, fontSize: 15, textAlign: "center" }}>
              Knapp vorbei – beim nächsten Mal klappt's! 💪
            </Text>
          )}

          {/* Badges row */}
          <View style={{ flexDirection: "row", gap: 8, flexWrap: "wrap", justifyContent: "center", marginTop: 4 }}>
            {result.isMvp && (
              <View style={{ paddingHorizontal: 12, paddingVertical: 4, borderRadius: radii.round, backgroundColor: colors.sun }}>
                <Text style={{ color: colors.ink, fontFamily: fonts.bodyBold, fontSize: 12 }}>⭐ MVP</Text>
              </View>
            )}
            {result.streakBonus > 0 && (
              <View style={{ paddingHorizontal: 12, paddingVertical: 4, borderRadius: radii.round, backgroundColor: "rgba(255,216,77,0.15)", borderWidth: 1, borderColor: "rgba(255,216,77,0.4)" }}>
                <Text style={{ color: colors.sun, fontFamily: fonts.bodyBold, fontSize: 12 }}>🔥 +{result.streakBonus} LP Streak</Text>
              </View>
            )}
            {(rankedProfile.winStreak >= 2 || result.won) && result.won && (
              <View style={{ paddingHorizontal: 12, paddingVertical: 4, borderRadius: radii.round, backgroundColor: "rgba(67,184,107,0.15)", borderWidth: 1, borderColor: "rgba(67,184,107,0.3)" }}>
                <Text style={{ color: colors.online, fontFamily: fonts.bodyBold, fontSize: 12 }}>
                  🔥 {rankedProfile.winStreak + 1} Siege in Folge
                </Text>
              </View>
            )}
          </View>
        </Animated.View>

        {/* ── Score & LP ── */}
        <Animated.View
          entering={reducedMotion ? undefined : FadeInUp.delay(200).duration(350)}
          style={{
            borderRadius: radii.card,
            backgroundColor: "rgba(255,255,255,0.05)",
            borderWidth: 1.5,
            borderColor: result.won ? "rgba(255,216,77,0.2)" : "rgba(240,68,110,0.2)",
            overflow: "hidden",
          }}
        >
          {/* Score row */}
          <View style={{
            flexDirection: "row", alignItems: "center", justifyContent: "space-between",
            padding: 20, borderBottomWidth: 1, borderBottomColor: "rgba(255,255,255,0.06)",
          }}>
            <View style={{ alignItems: "center", gap: 4 }}>
              <Text style={{ color: colors.whiteSoft, fontFamily: fonts.body, fontSize: 12 }}>Du</Text>
              <Text style={{ color: result.won ? colors.sun : colors.white, fontFamily: fonts.displayExtraBold, fontSize: 40 }}>
                {result.playerTotalPoints}
              </Text>
            </View>

            {/* Center LP badge */}
            <LpDeltaBadge delta={result.lpDelta} reducedMotion={reducedMotion} />

            <View style={{ alignItems: "center", gap: 4 }}>
              <Text style={{ color: colors.whiteSoft, fontFamily: fonts.body, fontSize: 12 }}>{result.opponent.name}</Text>
              <Text style={{ color: oppConfig.color, fontFamily: fonts.displayExtraBold, fontSize: 40 }}>
                {result.botTotalPoints}
              </Text>
            </View>
          </View>

          {/* Rank progress */}
          <View style={{ padding: 20, gap: 12 }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 14 }}>
              <RankBadge tier={lpChanges.tier} division={lpChanges.division} size="sm" />
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 6 }}>
                  <Text style={{ color: colors.white, fontFamily: fonts.bodyBold, fontSize: 14 }}>
                    {getFullRankLabel(lpChanges.tier, lpChanges.division)}
                  </Text>
                  <Text style={{ color: colors.whiteSoft, fontFamily: fonts.mono, fontSize: 12 }}>
                    {getLpWithinDivision(lpChanges.lp)} / 200 LP
                  </Text>
                </View>
                <LpBar
                  oldLp={result.oldLp}
                  newLp={lpChanges.lp}
                  tier={lpChanges.tier}
                  reducedMotion={reducedMotion}
                />
              </View>
            </View>

            {lpChanges.rankUp && (
              <Animated.View
                entering={reducedMotion ? undefined : ZoomIn.delay(900).springify()}
                style={{
                  padding: 14, borderRadius: radii.control,
                  backgroundColor: "rgba(255,216,77,0.12)",
                  borderWidth: 1.5, borderColor: colors.sun,
                  flexDirection: "row", alignItems: "center", gap: 12,
                }}
              >
                <Text style={{ fontSize: 28 }}>🎉</Text>
                <View>
                  <Text style={{ color: colors.sun, fontFamily: fonts.displayExtraBold, fontSize: 18 }}>
                    RANG AUFGESTIEGEN!
                  </Text>
                  <Text style={{ color: colors.whiteSoft, fontFamily: fonts.body, fontSize: 13 }}>
                    Willkommen in {getFullRankLabel(lpChanges.tier, lpChanges.division)}!
                  </Text>
                </View>
              </Animated.View>
            )}
          </View>
        </Animated.View>

        {/* ── XP & Stats strip ── */}
        <Animated.View
          entering={reducedMotion ? undefined : FadeIn.delay(400).duration(300)}
          style={{ flexDirection: "row", gap: 10 }}
        >
          {[
            { emoji: "🎖️", label: "Neon Pass XP", value: `+${xpGained} XP` },
            { emoji: "⭐", label: "Season XP", value: `+${result.won ? 150 : 50}` },
            { emoji: result.won ? "🏆" : "📊", label: result.won ? "Win-Rate" : "Win-Rate", value: `${newWinrate}%` },
          ].map((stat) => (
            <View key={stat.label} style={{
              flex: 1, alignItems: "center", gap: 4,
              padding: 12, borderRadius: radii.control,
              backgroundColor: "rgba(255,255,255,0.05)",
              borderWidth: 1, borderColor: "rgba(255,255,255,0.08)",
            }}>
              <Text style={{ fontSize: 18 }}>{stat.emoji}</Text>
              <Text style={{ color: colors.white, fontFamily: fonts.bodyBold, fontSize: 14 }}>{stat.value}</Text>
              <Text style={{ color: colors.whiteSoft, fontFamily: fonts.body, fontSize: 10, textAlign: "center" }}>{stat.label}</Text>
            </View>
          ))}
        </Animated.View>

        {/* ── Round Breakdown ── */}
        <Animated.View
          entering={reducedMotion ? undefined : FadeInDown.delay(250).duration(300)}
          style={{ gap: 8 }}
        >
          <Text style={{ color: colors.white, fontFamily: fonts.bodyBold, fontSize: 15, marginBottom: 2 }}>
            Runden-Übersicht
          </Text>
          {result.rounds.map((round, i) => (
            <RoundRow
              key={i}
              label={round.roundType === "speed_choice" ? "Speed Choice" : round.roundType === "close_guess" ? "Close Guess" : "Bluff Tap"}
              playerPts={round.playerPoints}
              botPts={round.botPoints}
              playerCorrect={round.playerCorrect}
              index={i}
            />
          ))}
        </Animated.View>

        {/* ── Opponent ── */}
        <Animated.View
          entering={reducedMotion ? undefined : FadeIn.delay(500).duration(300)}
          style={{
            flexDirection: "row", alignItems: "center", gap: 14,
            padding: 14, borderRadius: radii.control,
            backgroundColor: "rgba(255,255,255,0.04)",
            borderWidth: 1, borderColor: "rgba(255,255,255,0.07)",
          }}
        >
          <View style={{
            width: 44, height: 44, borderRadius: 22,
            backgroundColor: `${oppConfig.color}22`,
            alignItems: "center", justifyContent: "center",
            borderWidth: 1.5, borderColor: `${oppConfig.color}55`,
          }}>
            <Text style={{ fontSize: 24 }}>{result.opponent.avatarEmoji}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ color: colors.whiteSoft, fontFamily: fonts.body, fontSize: 11 }}>Gegner</Text>
            <Text style={{ color: colors.white, fontFamily: fonts.bodyBold, fontSize: 15 }}>{result.opponent.name}</Text>
          </View>
          <View style={{
            paddingHorizontal: 10, paddingVertical: 4, borderRadius: radii.round,
            backgroundColor: `${oppConfig.color}18`,
            borderWidth: 1, borderColor: `${oppConfig.color}44`,
          }}>
            <Text style={{ color: oppConfig.color, fontFamily: fonts.bodyBold, fontSize: 12 }}>
              {oppConfig.emoji} {getFullRankLabel(result.opponent.tier, result.opponent.division)}
            </Text>
          </View>
        </Animated.View>

        {/* ── Buttons ── */}
        <Animated.View
          entering={reducedMotion ? undefined : FadeInDown.delay(600).duration(300)}
          style={{ gap: 12, marginTop: 4 }}
        >
          <Pressable
            onPress={() => router.replace("/ranked/queue" as never)}
            style={({ pressed }) => ({
              paddingVertical: 18,
              borderRadius: radii.control,
              backgroundColor: colors.sun,
              alignItems: "center",
              shadowColor: colors.sun,
              shadowOffset: { width: 0, height: 0 },
              shadowOpacity: 0.5,
              shadowRadius: 14,
              opacity: pressed ? 0.88 : 1,
              transform: [{ scale: pressed ? 0.98 : 1 }],
            })}
          >
            <Text style={{ color: colors.ink, fontFamily: fonts.displayExtraBold, fontSize: 18 }}>
              ⚔️  Nochmal spielen
            </Text>
          </Pressable>

          <Pressable
            onPress={() => router.replace("/ranked" as never)}
            style={({ pressed }) => ({
              paddingVertical: 14,
              borderRadius: radii.control,
              backgroundColor: "rgba(255,255,255,0.06)",
              borderWidth: 1.5,
              borderColor: "rgba(255,255,255,0.15)",
              alignItems: "center",
              opacity: pressed ? 0.75 : 1,
            })}
          >
            <Text style={{ color: colors.white, fontFamily: fonts.bodySemiBold, fontSize: 16 }}>
              Ranked Arena
            </Text>
          </Pressable>
        </Animated.View>
      </ScrollView>

      {/* Confetti on win */}
      {result.won && (
        <ConfettiSystem
          active={!reducedMotion}
          screenWidth={screenWidth}
          screenHeight={screenHeight}
          count={55}
          effectId="effect_stars"
        />
      )}
    </View>
  );
}
