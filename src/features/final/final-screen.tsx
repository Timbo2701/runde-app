import * as Haptics from "expo-haptics";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect } from "react";
import { Image, Pressable, Text, View, useWindowDimensions } from "react-native";
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
  Easing,
} from "react-native-reanimated";

import { colors, fonts, radii, spacing } from "@/design/tokens";
import { trackAchievementEvent } from "@/lib/achievement-tracker";
import { useProfile } from "@/lib/profile-context";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { AppHeader } from "@/ui/primitives/app-header";
import { BrandButton } from "@/ui/primitives/brand-button";
import { ConfettiSystem } from "@/ui/primitives/confetti-system";
import { StageScreen } from "@/ui/primitives/stage-screen";

const TOTAL_ROUNDS = 5;
const MIKA_AVATAR = "https://i.pravatar.cc/150?img=47";

// Goldene Krone als eigenständiges View-Overlay (kein plain Emoji im Text).
// Pop-/Bounce-Animation via Reanimated Spring.
function CrownBadge({ reducedMotion }: { reducedMotion: boolean }) {
  const scale = useSharedValue(0);
  const rotate = useSharedValue(-20);

  useEffect(() => {
    scale.value = withDelay(
      680,
      withSpring(1, { damping: 6, stiffness: 220, mass: 0.8 })
    );
    rotate.value = withDelay(
      680,
      withSpring(-14, { damping: 8, stiffness: 180 })
    );
  }, []);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }, { rotate: `${rotate.value}deg` }],
  }));

  if (reducedMotion) {
    return (
      <View style={crownContainerStyle}>
        <View style={crownCircleStyle}>
          <Text style={{ fontSize: 16, lineHeight: 20 }}>👑</Text>
        </View>
      </View>
    );
  }

  return (
    <Animated.View style={[crownContainerStyle, animStyle]}>
      {/* Glow-Ring */}
      <View
        style={{
          position: "absolute",
          width: 36,
          height: 36,
          borderRadius: 18,
          backgroundColor: "rgba(255,216,77,0.35)",
        }}
      />
      {/* Gold-Kreis mit Krone */}
      <View style={crownCircleStyle}>
        <Text style={{ fontSize: 16, lineHeight: 20 }}>👑</Text>
      </View>
    </Animated.View>
  );
}

const crownContainerStyle = {
  position: "absolute" as const,
  top: -18,
  left: 4,
  width: 30,
  height: 30,
  alignItems: "center" as const,
  justifyContent: "center" as const,
  zIndex: 10,
};

const crownCircleStyle = {
  width: 30,
  height: 30,
  borderRadius: 15,
  backgroundColor: colors.sun,
  alignItems: "center" as const,
  justifyContent: "center" as const,
  shadowColor: colors.sun,
  shadowOffset: { width: 0, height: 0 },
  shadowOpacity: 0.9,
  shadowRadius: 8,
  elevation: 10,
};

function ProgressBar({
  pct,
  isWinner,
  delay,
  reducedMotion,
}: {
  pct: number;
  isWinner: boolean;
  delay: number;
  reducedMotion: boolean;
}) {
  const width = useSharedValue(0);

  useEffect(() => {
    if (reducedMotion) {
      width.value = pct * 100;
    } else {
      width.value = withDelay(
        delay,
        withTiming(pct * 100, { duration: 650, easing: Easing.out(Easing.cubic) })
      );
    }
  }, [pct]);

  const barStyle = useAnimatedStyle(() => ({ width: `${width.value}%` }));

  return (
    <View
      style={{
        height: 8,
        borderRadius: 4,
        backgroundColor: isWinner ? colors.surfaceSoft : "rgba(255,255,255,0.1)",
        overflow: "hidden",
      }}
    >
      <Animated.View
        style={[
          {
            height: 8,
            borderRadius: 4,
            backgroundColor: isWinner ? colors.stageGrape : colors.whiteSoft,
          },
          barStyle,
        ]}
      />
    </View>
  );
}

export function FinalScreen() {
  const { code = "RUND24", playerWins = "0", botWins = "0" } = useLocalSearchParams<{ code?: string; playerWins?: string; botWins?: string }>();
  const { name: profileName, photo: profilePhoto } = useProfile();
  const myName = profileName || "Du";
  const reducedMotion = useReducedMotion();
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();

  const myPoints = parseInt(playerWins, 10);
  const mikaPoints = parseInt(botWins, 10);

  const scores = myPoints >= mikaPoints
    ? [
        { name: myName, points: myPoints, color: colors.stageBerry, avatar: profilePhoto ?? null },
        { name: "Mika", points: mikaPoints, color: colors.stageCoral, avatar: MIKA_AVATAR },
      ]
    : [
        { name: "Mika", points: mikaPoints, color: colors.stageCoral, avatar: MIKA_AVATAR },
        { name: myName, points: myPoints, color: colors.stageBerry, avatar: profilePhoto ?? null },
      ];
  const winner = scores[0];

  const { roundsPlayed, wins, setProfile, selectedWinnerEffect } = useProfile();

  useEffect(() => {
    // Track stats: +1 round played, +1 win if local player won
    const playerWon = myPoints > mikaPoints;
    const newWins = playerWon ? wins + 1 : wins;
    void setProfile({ roundsPlayed: roundsPlayed + 1, wins: newWins });

    // Achievement events
    void trackAchievementEvent({ type: "round_played", mode: "klassiker" });
    void trackAchievementEvent({ type: "day_played" });
    if (playerWon) {
      void trackAchievementEvent({ type: "round_won", mode: "klassiker", totalWins: newWins });
    }
  }, []); // run once on mount

  useEffect(() => {
    if (reducedMotion) return;
    // Kurzer Success-Haptic beim Winner-Reveal (iOS)
    if (process.env.EXPO_OS === "ios") {
      const t = setTimeout(() => {
        void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }, 400);
      return () => clearTimeout(t);
    }
  }, [reducedMotion]);

  return (
    <View style={{ flex: 1 }}>
      <StageScreen stageColor={colors.stageGrape} pattern="rings">
        <AppHeader title={`Raum ${code}`} actionLabel="Verlassen" onAction={() => router.replace("/")} />

        <View style={{ flex: 1, justifyContent: "center", paddingVertical: 16, gap: 24 }}>

          {/* Hero */}
          <Animated.View
            entering={reducedMotion ? undefined : FadeInUp.duration(350)}
            style={{ alignItems: "center", gap: 10 }}
          >
            <Animated.View
              entering={reducedMotion ? undefined : ZoomIn.delay(200).duration(400).springify().damping(10)}
              style={{
                width: 80,
                height: 80,
                borderRadius: 40,
                backgroundColor: "rgba(255,216,77,0.2)",
                alignItems: "center",
                justifyContent: "center",
                borderWidth: 2,
                borderColor: "rgba(255,216,77,0.5)",
              }}
            >
              <Text style={{ fontSize: 44, lineHeight: 52 }}>🏆</Text>
            </Animated.View>

            <View style={{ alignItems: "center", gap: 6 }}>
              <Text style={{ color: colors.sun, fontFamily: fonts.bodyBold, fontSize: 12, letterSpacing: 1.6 }}>
                GESAMTERGEBNIS
              </Text>
              <Text style={{
                color: colors.white,
                fontFamily: fonts.displayExtraBold,
                fontSize: 38,
                lineHeight: 42,
                textAlign: "center",
              }}>
                {winner.name}{"\n"}gewinnt!
              </Text>
              <Text style={{ color: colors.whiteSoft, fontFamily: fonts.body, fontSize: 15, textAlign: "center" }}>
                {TOTAL_ROUNDS} Fragen — die Gruppe hat entschieden.
              </Text>
            </View>
          </Animated.View>

          {/* Rangliste */}
          <View style={{ gap: 10 }}>
            {scores.map((player, index) => {
              const isWinner = index === 0;
              const pct = player.points / TOTAL_ROUNDS;
              const rank = index + 1;

              return (
                <Animated.View
                  key={player.name}
                  entering={
                    reducedMotion
                      ? undefined
                      : FadeInDown.delay(250 + index * 130).duration(280)
                  }
                  style={{
                    borderRadius: radii.card,
                    borderCurve: "continuous",
                    backgroundColor: isWinner ? colors.surface : "rgba(255,255,255,0.1)",
                    padding: spacing.xl,
                    gap: 14,
                    borderWidth: isWinner ? 2 : 0,
                    borderColor: isWinner ? colors.sun : "transparent",
                  }}
                >
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
                    {/* Rang */}
                    <Text style={{
                      color: isWinner ? colors.stageGrapeDeep : colors.whiteSoft,
                      fontFamily: fonts.displayExtraBold,
                      fontSize: 22,
                      width: 30,
                    }}>
                      {rank}.
                    </Text>

                    {/* Avatar mit CrownBadge */}
                    <View style={{ position: "relative" }}>
                      {isWinner && <CrownBadge reducedMotion={reducedMotion} />}
                      <View style={{
                        width: 52,
                        height: 52,
                        borderRadius: 26,
                        overflow: "hidden",
                        backgroundColor: player.color,
                        alignItems: "center",
                        justifyContent: "center",
                        borderWidth: isWinner ? 2.5 : 0,
                        borderColor: colors.sun,
                      }}>
                        {player.avatar
                          ? <Image source={{ uri: player.avatar }} style={{ width: 52, height: 52 }} />
                          : <Text style={{ color: colors.white, fontFamily: fonts.bodyBold, fontSize: 18 }}>{player.name[0]}</Text>
                        }
                      </View>
                    </View>

                    {/* Name */}
                    <Text style={{
                      flex: 1,
                      color: isWinner ? colors.ink : colors.white,
                      fontFamily: fonts.bodyBold,
                      fontSize: 19,
                    }}>
                      {player.name}
                    </Text>

                    {/* Score */}
                    <View style={{ alignItems: "flex-end", gap: 1 }}>
                      <Text style={{
                        color: isWinner ? colors.stageGrapeDeep : colors.whiteSoft,
                        fontFamily: fonts.mono,
                        fontSize: 22,
                        fontWeight: "700",
                      }}>
                        {player.points}/{TOTAL_ROUNDS}
                      </Text>
                      <Text style={{
                        color: isWinner ? colors.inkMuted : colors.whiteSoft,
                        fontFamily: fonts.body,
                        fontSize: 11,
                      }}>
                        Siege
                      </Text>
                    </View>
                  </View>

                  {/* Animierter Fortschrittsbalken */}
                  <ProgressBar
                    pct={pct}
                    isWinner={isWinner}
                    delay={600 + index * 120}
                    reducedMotion={reducedMotion}
                  />
                </Animated.View>
              );
            })}
          </View>

          {/* Buttons */}
          <Animated.View entering={reducedMotion ? undefined : FadeIn.delay(800).duration(300)} style={{ gap: 12 }}>
            <BrandButton
              label="Nochmal spielen"
              onPress={() => router.replace({ pathname: "/lobby", params: { code } })}
              tone="sun"
            />
            <BrandButton
              label="Zur Startseite"
              onPress={() => router.replace("/")}
              tone="outline"
            />
          </Animated.View>

          {/* Shop-Tease */}
          <Animated.View entering={reducedMotion ? undefined : FadeIn.delay(1000).duration(300)}>
            <Pressable
              onPress={() => router.push("/shop" as never)}
              style={({ pressed }) => ({
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                paddingVertical: 12,
                opacity: pressed ? 0.7 : 1,
              })}
              accessibilityRole="button"
            >
              <Text style={{ fontSize: 16 }}>✨</Text>
              <Text style={{ color: colors.whiteSoft, fontFamily: fonts.bodySemiBold, fontSize: 13 }}>
                Gewinner-Effekte im Shop freischalten
              </Text>
              <Text style={{ color: colors.sun, fontFamily: fonts.bodyBold, fontSize: 13 }}>→</Text>
            </Pressable>
          </Animated.View>

        </View>
      </StageScreen>

      {/* Winner-Effekt — Typ aus selectedWinnerEffect Kosmetik */}
      <ConfettiSystem
        active={!reducedMotion}
        screenWidth={screenWidth}
        screenHeight={screenHeight}
        count={70}
        effectId={selectedWinnerEffect ?? "effect_confetti"}
      />
    </View>
  );
}
