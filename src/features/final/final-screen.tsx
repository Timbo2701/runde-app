import { router, useLocalSearchParams } from "expo-router";
import { Text, View } from "react-native";
import Animated, { FadeIn, FadeInDown, FadeInUp } from "react-native-reanimated";

import { colors, fonts, radii, spacing } from "@/design/tokens";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { AppHeader } from "@/ui/primitives/app-header";
import { BrandButton } from "@/ui/primitives/brand-button";
import { StageScreen } from "@/ui/primitives/stage-screen";

const players = [
  { name: "Timo", color: colors.stageBerry },
  { name: "Mika", color: colors.stageCoral },
];

export function FinalScreen() {
  const { code = "RUND24" } = useLocalSearchParams<{ code?: string }>();
  const reducedMotion = useReducedMotion();

  // Simulierte Gesamtpunktzahl (wird später aus echten Votes berechnet)
  const scores = [
    { name: "Mika", points: 3, color: colors.stageCoral },
    { name: "Timo", points: 2, color: colors.stageBerry },
  ];
  const overallWinner = scores[0];

  return (
    <StageScreen stageColor={colors.stageGrape} pattern="rings">
      <AppHeader title={`Raum ${code}`} actionLabel="Verlassen" onAction={() => router.replace("/")} />

      <View style={{ flex: 1, justifyContent: "center", paddingVertical: 24, gap: 32 }}>
        <Animated.View entering={reducedMotion ? undefined : FadeInUp.duration(350)} style={{ alignItems: "center", gap: 10 }}>
          <Text style={{ fontSize: 64 }}>🏆</Text>
          <Text style={{ color: colors.sun, fontFamily: fonts.bodyBold, fontSize: 13, letterSpacing: 1 }}>
            GESAMTERGEBNIS
          </Text>
          <Text style={{ color: colors.white, fontFamily: fonts.displayExtraBold, fontSize: 38, lineHeight: 42, textAlign: "center" }}>
            {overallWinner.name} gewinnt die Runde!
          </Text>
          <Text style={{ color: colors.whiteSoft, fontFamily: fonts.body, fontSize: 16, textAlign: "center" }}>
            5 Fragen — die Gruppe hat entschieden.
          </Text>
        </Animated.View>

        <View style={{ gap: 12 }}>
          {scores.map((player, index) => {
            const isWinner = index === 0;
            const maxPoints = scores[0].points;
            const pct = maxPoints > 0 ? player.points / maxPoints : 0;

            return (
              <Animated.View
                key={player.name}
                entering={reducedMotion ? undefined : FadeInDown.delay(200 + index * 120).duration(280)}
                style={{
                  borderRadius: radii.card,
                  borderCurve: "continuous",
                  backgroundColor: isWinner ? colors.surface : "rgba(255,255,255,0.1)",
                  padding: spacing.xl,
                  gap: 12,
                }}
              >
                <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
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
                  <Text style={{ flex: 1, color: isWinner ? colors.ink : colors.white, fontFamily: fonts.bodyBold, fontSize: 20 }}>
                    {player.name}
                  </Text>
                  <Text style={{ color: isWinner ? colors.stageGrapeDeep : colors.whiteSoft, fontFamily: fonts.mono, fontSize: 18 }}>
                    {player.points}×
                  </Text>
                </View>
                <View style={{ height: 8, borderRadius: 4, backgroundColor: isWinner ? colors.surfaceSoft : colors.whiteFaint, overflow: "hidden" }}>
                  <Animated.View
                    entering={reducedMotion ? undefined : FadeIn.delay(500 + index * 100).duration(500)}
                    style={{ height: 8, width: `${pct * 100}%`, borderRadius: 4, backgroundColor: player.color }}
                  />
                </View>
              </Animated.View>
            );
          })}
        </View>

        <Animated.View entering={reducedMotion ? undefined : FadeIn.delay(700).duration(300)} style={{ gap: 12 }}>
          <BrandButton label="Nochmal spielen" onPress={() => router.replace({ pathname: "/lobby", params: { code } })} tone="sun" />
          <BrandButton label="Zur Startseite" onPress={() => router.replace("/")} tone="outline" />
        </Animated.View>
      </View>
    </StageScreen>
  );
}
