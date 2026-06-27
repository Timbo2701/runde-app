import * as Haptics from "expo-haptics";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect } from "react";
import { Image, Text, View, useWindowDimensions } from "react-native";
import Animated, { FadeIn, FadeInDown, FadeInUp, ZoomIn } from "react-native-reanimated";

import { colors, fonts, radii, spacing } from "@/design/tokens";
import { useProfile } from "@/lib/profile-context";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { AppHeader } from "@/ui/primitives/app-header";
import { BrandButton } from "@/ui/primitives/brand-button";
import { ConfettiSystem } from "@/ui/primitives/confetti-system";
import { StageScreen } from "@/ui/primitives/stage-screen";

const TOTAL_ROUNDS = 5;
const MIKA_AVATAR = "https://i.pravatar.cc/150?img=47";

export function FinalScreen() {
  const { code = "RUND24" } = useLocalSearchParams<{ code?: string }>();
  const { name: profileName, photo: profilePhoto } = useProfile();
  const myName = profileName || "Du";
  const reducedMotion = useReducedMotion();
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();

  const scores = [
    { name: "Mika", points: 3, color: colors.stageCoral, avatar: MIKA_AVATAR },
    { name: myName, points: 2, color: colors.stageBerry, avatar: profilePhoto ?? null },
  ];
  const winner = scores[0];

  useEffect(() => {
    if (reducedMotion) return;
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

        <View style={{ flex: 1, justifyContent: "center", paddingVertical: 16, gap: 28 }}>

          {/* Hero */}
          <Animated.View
            entering={reducedMotion ? undefined : FadeInUp.duration(350)}
            style={{ alignItems: "center", gap: 10 }}
          >
            <Animated.Text
              entering={reducedMotion ? undefined : ZoomIn.delay(200).duration(400).springify().damping(10)}
              style={{ fontSize: 80, lineHeight: 88 }}
            >
              🏆
            </Animated.Text>

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
                  entering={reducedMotion ? undefined : FadeInDown.delay(250 + index * 130).duration(280)}
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

                    {/* Avatar with floating crown */}
                    <View style={{ position: "relative" }}>
                      {isWinner && (
                        <Animated.Text
                          entering={reducedMotion ? undefined : ZoomIn.delay(700).springify().damping(6)}
                          style={crownStyle}
                        >
                          👑
                        </Animated.Text>
                      )}
                      <View style={{
                        width: 48,
                        height: 48,
                        borderRadius: 24,
                        overflow: "hidden",
                        backgroundColor: player.color,
                        alignItems: "center",
                        justifyContent: "center",
                        borderWidth: isWinner ? 2.5 : 0,
                        borderColor: colors.sun,
                      }}>
                        {player.avatar
                          ? <Image source={{ uri: player.avatar }} style={{ width: 48, height: 48 }} />
                          : <Text style={{ color: colors.white, fontFamily: fonts.bodyBold, fontSize: 17 }}>{player.name[0]}</Text>
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

                  {/* Progress bar */}
                  <View style={{
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: isWinner ? colors.surfaceSoft : "rgba(255,255,255,0.1)",
                    overflow: "hidden",
                  }}>
                    <Animated.View
                      entering={reducedMotion ? undefined : FadeIn.delay(600 + index * 120).duration(700)}
                      style={{
                        height: 8,
                        width: `${pct * 100}%`,
                        borderRadius: 4,
                        backgroundColor: isWinner ? colors.stageGrape : colors.whiteSoft,
                      }}
                    />
                  </View>
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

        </View>
      </StageScreen>

      {/* Confetti — Reanimated worklets, UI thread, 60fps */}
      <ConfettiSystem
        active={!reducedMotion}
        screenWidth={screenWidth}
        screenHeight={screenHeight}
        count={70}
      />
    </View>
  );
}

const crownStyle = {
  position: "absolute" as const,
  top: -20,
  left: 10,
  fontSize: 22,
  transform: [{ rotate: "-12deg" }],
  zIndex: 10,
};
