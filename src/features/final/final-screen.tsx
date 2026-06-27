import { router, useLocalSearchParams } from "expo-router";
import { Text, View } from "react-native";
import Animated, { FadeIn, FadeInDown, FadeInUp } from "react-native-reanimated";

import { colors, fonts, radii, spacing } from "@/design/tokens";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { AppHeader } from "@/ui/primitives/app-header";
import { BrandButton } from "@/ui/primitives/brand-button";
import { StageScreen } from "@/ui/primitives/stage-screen";

const TOTAL_ROUNDS = 5;

const scores = [
  { name: "Mika", points: 3, color: colors.stageCoral },
  { name: "Timo", points: 2, color: colors.stageBerry },
];

export function FinalScreen() {
  const { code = "RUND24" } = useLocalSearchParams<{ code?: string }>();
  const reducedMotion = useReducedMotion();
  const winner = scores[0];
  const maxPoints = TOTAL_ROUNDS;

  return (
    <StageScreen stageColor={colors.stageGrape} pattern="rings">
      <AppHeader title={`Raum ${code}`} actionLabel="Verlassen" onAction={() => router.replace("/")} />

      <View style={{ flex: 1, justifyContent: "center", paddingVertical: 24, gap: 36 }}>

        {/* Hero */}
        <Animated.View entering={reducedMotion ? undefined : FadeInUp.duration(350)} style={{ alignItems: "center", gap: 12 }}>
          <Text style={{ fontSize: 72, lineHeight: 80 }}>🏆</Text>
          <Text style={{ color: colors.sun, fontFamily: fonts.bodyBold, fontSize: 12, letterSpacing: 1.5 }}>
            GESAMTERGEBNIS
          </Text>
          <Text style={{ color: colors.white, fontFamily: fonts.displayExtraBold, fontSize: 36, lineHeight: 40, textAlign: "center" }}>
            {winner.name} gewinnt{"\n"}die Runde!
          </Text>
          <Text style={{ color: colors.whiteSoft, fontFamily: fonts.body, fontSize: 15, textAlign: "center" }}>
            {TOTAL_ROUNDS} Fragen — die Gruppe hat entschieden.
          </Text>
        </Animated.View>

        {/* Rangliste */}
        <View style={{ gap: 10 }}>
          {scores.map((player, index) => {
            const isWinner = index === 0;
            const pct = player.points / maxPoints;
            const rank = index + 1;

            return (
              <Animated.View
                key={player.name}
                entering={reducedMotion ? undefined : FadeInDown.delay(200 + index * 130).duration(280)}
                style={{
                  borderRadius: radii.card,
                  borderCurve: "continuous",
                  backgroundColor: isWinner ? colors.surface : "rgba(255,255,255,0.1)",
                  padding: spacing.xl,
                  gap: 14,
                }}
              >
                <View style={{ flexDirection: "row", alignItems: "center", gap: 14 }}>
                  {/* Rang */}
                  <Text style={{
                    color: isWinner ? colors.stageGrapeDeep : colors.whiteSoft,
                    fontFamily: fonts.displayExtraBold,
                    fontSize: 22,
                    width: 28,
                  }}>
                    {rank}.
                  </Text>

                  {/* Avatar */}
                  <View style={{
                    width: 44,
                    height: 44,
                    borderRadius: 22,
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: player.color,
                  }}>
                    <Text style={{ color: colors.white, fontFamily: fonts.bodyBold, fontSize: 16 }}>
                      {player.name[0]}
                    </Text>
                  </View>

                  {/* Name */}
                  <Text style={{ flex: 1, color: isWinner ? colors.ink : colors.white, fontFamily: fonts.bodyBold, fontSize: 19 }}>
                    {player.name}
                  </Text>

                  {/* Score als Bruch */}
                  <View style={{ alignItems: "flex-end", gap: 1 }}>
                    <Text style={{ color: isWinner ? colors.stageGrapeDeep : colors.whiteSoft, fontFamily: fonts.mono, fontSize: 20, fontWeight: "700" }}>
                      {player.points}/{TOTAL_ROUNDS}
                    </Text>
                    <Text style={{ color: isWinner ? colors.inkMuted : colors.whiteSoft, fontFamily: fonts.body, fontSize: 12 }}>
                      Siege
                    </Text>
                  </View>
                </View>

                {/* Fortschrittsbalken */}
                <View style={{ height: 6, borderRadius: 3, backgroundColor: isWinner ? colors.surfaceSoft : colors.whiteFaint, overflow: "hidden" }}>
                  <Animated.View
                    entering={reducedMotion ? undefined : FadeIn.delay(500 + index * 120).duration(600)}
                    style={{
                      height: 6,
                      width: `${pct * 100}%`,
                      borderRadius: 3,
                      backgroundColor: player.color,
                    }}
                  />
                </View>
              </Animated.View>
            );
          })}
        </View>

        {/* Buttons */}
        <Animated.View entering={reducedMotion ? undefined : FadeIn.delay(750).duration(300)} style={{ gap: 12 }}>
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
  );
}
