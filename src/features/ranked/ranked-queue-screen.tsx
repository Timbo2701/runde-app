import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Pressable, Text, View } from "react-native";
import Animated, {
  FadeIn,
  FadeInUp,
  ZoomIn,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { colors, fonts, radii } from "@/design/tokens";
import { getFullRankLabel, RANK_CONFIG, getWinrate } from "@/lib/ranked-logic";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { useRanked } from "@/lib/ranked-context";
import { useAuth } from "@/lib/auth-context";
import type { RankedOpponent, RankedProfile } from "@/types/ranked";
import { useRankedBots } from "@/lib/supabase-hooks";
import { DataStatePanel } from "@/ui/primitives/data-state-panel";

// ── Smart bot selection ────────────────────────────────────────────────────────

const TIER_ORDER = ["bronze", "silver", "gold", "neon", "elite", "legend"] as const;

function selectBot(
  bots: RankedOpponent[],
  profile: RankedProfile,
  lastOpponentId: string | null
): RankedOpponent {
  const tierIdx = TIER_ORDER.indexOf(profile.tier as typeof TIER_ORDER[number]);
  const lpInDiv = profile.lp % 200;
  const nearPromotion = lpInDiv >= 160 || profile.lp >= 560;
  const onWinStreak = profile.winStreak >= 3;

  // Base pool: same tier
  let candidates = bots.filter((b) => b.tier === profile.tier);

  // Near promotion: add lowest division of next tier
  if (nearPromotion && tierIdx < TIER_ORDER.length - 1) {
    const nextTier = TIER_ORDER[tierIdx + 1];
    const nextTierBots = bots.filter((b) => b.tier === nextTier && b.division === 3);
    candidates = [...candidates, ...nextTierBots];
  }

  // Win streak: prefer bots in same or higher division (slightly stronger)
  if (onWinStreak) {
    const stronger = candidates.filter(
      (b) => b.tier === profile.tier && b.division <= profile.division
    );
    if (stronger.length > 0) candidates = stronger;
  }

  // Avoid repeat opponent
  const noRepeat = candidates.filter((b) => b.id !== lastOpponentId);
  const pool = noRepeat.length > 0 ? noRepeat : candidates;

  // Fallback to all bots
  if (pool.length === 0) return bots[Math.floor(Math.random() * bots.length)];
  return pool[Math.floor(Math.random() * pool.length)];
}

// ── Pulse ring (stays separate component – hooks rule) ────────────────────────

function PulseRing({ delay, size, reducedMotion }: { delay: number; size: number; reducedMotion: boolean }) {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(0.5);

  useEffect(() => {
    if (reducedMotion) return;
    scale.value = withDelay(
      delay,
      withRepeat(
        withSequence(withTiming(2.2, { duration: 1600 }), withTiming(1, { duration: 0 })),
        -1
      )
    );
    opacity.value = withDelay(
      delay,
      withRepeat(
        withSequence(withTiming(0, { duration: 1600 }), withTiming(0.5, { duration: 0 })),
        -1
      )
    );
  }, [reducedMotion]);

  const style = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[{
        position: "absolute",
        width: size,
        height: size,
        borderRadius: size / 2,
        borderWidth: 1.5,
        borderColor: colors.stageGrape,
      }, style]}
    />
  );
}

// ── Countdown digit ───────────────────────────────────────────────────────────

function CountdownDigit({ digit, reducedMotion }: { digit: number; reducedMotion: boolean }) {
  const scale = useSharedValue(reducedMotion ? 1 : 1.6);
  const opacity = useSharedValue(reducedMotion ? 1 : 0);

  useEffect(() => {
    scale.value = withSpring(1, { damping: 22, stiffness: 200 });
    opacity.value = withTiming(1, { duration: 120 });
  }, [digit]);

  const style = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }], opacity: opacity.value }));

  return (
    <Animated.Text style={[{
      color: colors.sun,
      fontFamily: fonts.displayExtraBold,
      fontSize: 96,
      lineHeight: 108,
      textAlign: "center",
      textShadowColor: colors.sun,
      textShadowOffset: { width: 0, height: 0 },
      textShadowRadius: 24,
    }, style]}>
      {digit}
    </Animated.Text>
  );
}

// ── Main screen ───────────────────────────────────────────────────────────────

type Phase = "searching" | "found" | "countdown";

export function RankedQueueScreen() {
  const reducedMotion = useReducedMotion();
  const { rankedProfile } = useRanked();
  const { profile: authProfile } = useAuth();
  const playerInitials = authProfile?.avatarInitials ?? authProfile?.displayName?.slice(0, 2).toUpperCase() ?? "Du";
  const { data: rankedBots, loading: rankedBotsLoading, error: rankedBotsError, refresh } = useRankedBots();
  const insets = useSafeAreaInsets();
  const [phase, setPhase] = useState<Phase>("searching");
  const [opponent, setOpponent] = useState<RankedOpponent | null>(null);
  const [countdown, setCountdown] = useState(3);
  const lastOpponentIdRef = useRef<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimer = () => { if (timerRef.current) clearTimeout(timerRef.current); };

  // Step 1: find opponent using smart selection
  useEffect(() => {
    if (rankedBotsLoading || rankedBotsError || rankedBots.length === 0) return;
    timerRef.current = setTimeout(() => {
      const selected = selectBot(rankedBots, rankedProfile, lastOpponentIdRef.current);
      lastOpponentIdRef.current = selected.id;
      setOpponent(selected);
      setPhase("found");
    }, 1400 + Math.random() * 800);
    return clearTimer;
  }, [rankedBots, rankedBotsError, rankedBotsLoading, rankedProfile]);

  // Step 2: show VS card for 2s, then countdown
  useEffect(() => {
    if (phase !== "found") return;
    timerRef.current = setTimeout(() => {
      setPhase("countdown");
      setCountdown(3);
    }, 2000);
    return clearTimer;
  }, [phase]);

  // Step 3: countdown 3→2→1→navigate
  useEffect(() => {
    if (phase !== "countdown") return;
    if (countdown <= 0) {
      if (opponent) {
        router.replace({
          pathname: "/ranked/match" as never,
          params: { opponentId: opponent.id },
        });
      }
      return;
    }
    timerRef.current = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return clearTimer;
  }, [phase, countdown]);

  const oppConfig = opponent ? RANK_CONFIG[opponent.tier] : null;
  const myWinrate = getWinrate(rankedProfile.wins, rankedProfile.losses);

  if (rankedBotsLoading || rankedBotsError || rankedBots.length === 0) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.stageGrapeDeep, justifyContent: "center", paddingHorizontal: 24, paddingTop: insets.top, paddingBottom: insets.bottom }}>
        <DataStatePanel
          title={rankedBotsLoading ? "Gegner werden geladen" : rankedBotsError ? "Matchmaking nicht erreichbar" : "Keine Gegner verfügbar"}
          message={rankedBotsLoading ? "Die Gegnerliste kommt direkt aus Supabase." : rankedBotsError ?? "In der Datenbank ist aktuell kein aktiver Ranked-Bot vorhanden."}
          loading={rankedBotsLoading}
          onRetry={rankedBotsLoading ? undefined : () => void refresh()}
        />
        <Pressable onPress={() => router.back()} style={{ alignItems: "center", padding: 18 }}>
          <Text style={{ color: colors.whiteSoft, fontFamily: fonts.bodySemiBold }}>Zurück zur Arena</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.stageGrapeDeep }}>
      {/* Subtle arena grid background */}
      <View style={{
        position: "absolute", inset: 0,
        opacity: 0.04,
        backgroundColor: "transparent",
      }} pointerEvents="none" />

      {/* Back button */}
      {phase === "searching" && (
        <Pressable
          onPress={() => { clearTimer(); router.back(); }}
          style={{
            position: "absolute",
            top: insets.top + 12,
            right: 20,
            paddingHorizontal: 16,
            paddingVertical: 8,
            borderRadius: radii.control,
            backgroundColor: "rgba(255,255,255,0.1)",
            borderWidth: 1,
            borderColor: colors.whiteFaint,
            zIndex: 10,
          }}
        >
          <Text style={{ color: colors.whiteSoft, fontFamily: fonts.bodySemiBold, fontSize: 13 }}>
            Abbrechen
          </Text>
        </Pressable>
      )}

      <View style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 24,
        paddingTop: insets.top,
        paddingBottom: insets.bottom + 24,
      }}>

        {/* ── SEARCHING ── */}
        {phase === "searching" && (
          <Animated.View entering={FadeIn.duration(300)} style={{ alignItems: "center", gap: 40 }}>
            {/* Radar */}
            <View style={{ width: 160, height: 160, alignItems: "center", justifyContent: "center" }}>
              <PulseRing delay={0}    size={80}  reducedMotion={reducedMotion} />
              <PulseRing delay={500}  size={80}  reducedMotion={reducedMotion} />
              <PulseRing delay={1000} size={80}  reducedMotion={reducedMotion} />
              {/* Center dot */}
              <View style={{
                width: 56,
                height: 56,
                borderRadius: 28,
                backgroundColor: colors.stageGrape,
                alignItems: "center",
                justifyContent: "center",
                borderWidth: 2.5,
                borderColor: "rgba(168,85,247,0.6)",
                shadowColor: colors.stageGrape,
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: 0.8,
                shadowRadius: 12,
              }}>
                <Text style={{ fontSize: 26 }}>⚔️</Text>
              </View>
            </View>

            <View style={{ alignItems: "center", gap: 8 }}>
              <Text style={{
                color: colors.white,
                fontFamily: fonts.displayExtraBold,
                fontSize: 26,
                textAlign: "center",
              }}>
                Gegner wird gesucht…
              </Text>
              <Text style={{ color: colors.whiteSoft, fontFamily: fonts.body, fontSize: 14 }}>
                Ø Wartezeit: ~8 Sekunden
              </Text>
            </View>

            {/* My rank preview */}
            <View style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 12,
              paddingHorizontal: 20,
              paddingVertical: 12,
              borderRadius: radii.control,
              backgroundColor: "rgba(255,255,255,0.06)",
              borderWidth: 1,
              borderColor: colors.whiteFaint,
            }}>
              <Text style={{ fontSize: 20 }}>{RANK_CONFIG[rankedProfile.tier].emoji}</Text>
              <View>
                <Text style={{ color: colors.white, fontFamily: fonts.bodySemiBold, fontSize: 13 }}>
                  {getFullRankLabel(rankedProfile.tier, rankedProfile.division)}
                </Text>
                <Text style={{ color: colors.whiteSoft, fontFamily: fonts.body, fontSize: 11 }}>
                  {rankedProfile.lp} LP • {myWinrate}% WR
                </Text>
              </View>
            </View>
          </Animated.View>
        )}

        {/* ── FOUND ── */}
        {(phase === "found" || phase === "countdown") && opponent && oppConfig && (
          <Animated.View
            entering={reducedMotion ? undefined : FadeInUp.duration(350)}
            style={{ alignItems: "center", gap: 28, width: "100%" }}
          >
            {/* Found label */}
            <Animated.View entering={reducedMotion ? undefined : FadeIn.duration(250)}>
              <Text style={{
                color: colors.sun,
                fontFamily: fonts.displayExtraBold,
                fontSize: 30,
                letterSpacing: 0.3,
                textAlign: "center",
                textShadowColor: colors.sun,
                textShadowOffset: { width: 0, height: 0 },
                textShadowRadius: 16,
              }}>
                Gegner gefunden! ⚔️
              </Text>
            </Animated.View>

            {/* VS Battle Card */}
            <View style={{
              width: "100%",
              borderRadius: radii.card,
              backgroundColor: "rgba(0,0,0,0.4)",
              borderWidth: 1.5,
              borderColor: "rgba(111,43,211,0.5)",
              overflow: "hidden",
            }}>
              {/* Top accent bar */}
              <View style={{ height: 3, backgroundColor: colors.stageGrape, opacity: 0.8 }} />

              <View style={{ flexDirection: "row", alignItems: "stretch", paddingVertical: 24 }}>
                {/* Player side */}
                <View style={{ flex: 1, alignItems: "center", gap: 8 }}>
                  <View style={{
                    width: 68,
                    height: 68,
                    borderRadius: 34,
                    backgroundColor: colors.stageBerry,
                    alignItems: "center",
                    justifyContent: "center",
                    borderWidth: 2.5,
                    borderColor: colors.white,
                    shadowColor: colors.stageBerry,
                    shadowOffset: { width: 0, height: 0 },
                    shadowOpacity: 0.6,
                    shadowRadius: 10,
                  }}>
                    <Text style={{ color: colors.white, fontFamily: fonts.displayExtraBold, fontSize: playerInitials.length > 2 ? 16 : 22 }}>
                      {playerInitials}
                    </Text>
                  </View>
                  <Text style={{ color: colors.white, fontFamily: fonts.displayExtraBold, fontSize: 16 }}>
                    Du
                  </Text>
                  <View style={{
                    paddingHorizontal: 8,
                    paddingVertical: 3,
                    borderRadius: radii.round,
                    backgroundColor: `${RANK_CONFIG[rankedProfile.tier].color}22`,
                    borderWidth: 1,
                    borderColor: `${RANK_CONFIG[rankedProfile.tier].color}55`,
                  }}>
                    <Text style={{ color: RANK_CONFIG[rankedProfile.tier].color, fontFamily: fonts.bodyBold, fontSize: 11 }}>
                      {RANK_CONFIG[rankedProfile.tier].emoji} {getFullRankLabel(rankedProfile.tier, rankedProfile.division)}
                    </Text>
                  </View>
                  <Text style={{ color: colors.whiteSoft, fontFamily: fonts.mono, fontSize: 11 }}>
                    {myWinrate}% WR
                  </Text>
                </View>

                {/* VS divider */}
                <View style={{ alignItems: "center", justifyContent: "center", paddingHorizontal: 12, gap: 4 }}>
                  <View style={{ width: 1, flex: 1, backgroundColor: colors.whiteFaint }} />
                  <Text style={{
                    color: colors.sun,
                    fontFamily: fonts.displayExtraBold,
                    fontSize: 26,
                    textShadowColor: colors.sun,
                    textShadowOffset: { width: 0, height: 0 },
                    textShadowRadius: 10,
                  }}>
                    VS
                  </Text>
                  <View style={{ width: 1, flex: 1, backgroundColor: colors.whiteFaint }} />
                </View>

                {/* Opponent side */}
                <View style={{ flex: 1, alignItems: "center", gap: 8 }}>
                  <View style={{
                    width: 68,
                    height: 68,
                    borderRadius: 34,
                    backgroundColor: `${oppConfig.color}25`,
                    alignItems: "center",
                    justifyContent: "center",
                    borderWidth: 2.5,
                    borderColor: oppConfig.color,
                    shadowColor: oppConfig.color,
                    shadowOffset: { width: 0, height: 0 },
                    shadowOpacity: 0.5,
                    shadowRadius: 10,
                  }}>
                    <Text style={{ color: oppConfig.color, fontFamily: fonts.displayExtraBold, fontSize: opponent.avatarEmoji.length > 2 ? 16 : 22 }}>
                      {opponent.avatarEmoji}
                    </Text>
                  </View>
                  <Text style={{ color: colors.white, fontFamily: fonts.displayExtraBold, fontSize: 16 }}>
                    {opponent.name}
                  </Text>
                  <View style={{
                    paddingHorizontal: 8,
                    paddingVertical: 3,
                    borderRadius: radii.round,
                    backgroundColor: `${oppConfig.color}22`,
                    borderWidth: 1,
                    borderColor: `${oppConfig.color}55`,
                  }}>
                    <Text style={{ color: oppConfig.color, fontFamily: fonts.bodyBold, fontSize: 11 }}>
                      {oppConfig.emoji} {getFullRankLabel(opponent.tier, opponent.division)}
                    </Text>
                  </View>
                  <Text style={{ color: colors.whiteSoft, fontFamily: fonts.mono, fontSize: 11 }}>
                    {opponent.winrate}% WR
                  </Text>
                </View>
              </View>

              {/* Bottom accent bar */}
              <View style={{ height: 3, backgroundColor: oppConfig.color, opacity: 0.5 }} />
            </View>

            {/* Countdown or "starting" */}
            {phase === "found" && (
              <Animated.View entering={reducedMotion ? undefined : FadeIn.delay(300).duration(300)}>
                <Text style={{ color: colors.whiteSoft, fontFamily: fonts.body, fontSize: 14, textAlign: "center" }}>
                  Match startet in Kürze…
                </Text>
              </Animated.View>
            )}

            {phase === "countdown" && (
              <View style={{ alignItems: "center", gap: 8 }}>
                <CountdownDigit digit={countdown} reducedMotion={reducedMotion} />
                <Text style={{ color: colors.whiteSoft, fontFamily: fonts.bodyBold, fontSize: 14, letterSpacing: 1.2 }}>
                  MATCH STARTET
                </Text>
              </View>
            )}
          </Animated.View>
        )}
      </View>
    </View>
  );
}
