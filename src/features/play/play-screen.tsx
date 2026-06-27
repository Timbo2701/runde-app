import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Pressable, Text, View } from "react-native";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";

import { colors, fonts, radii } from "@/design/tokens";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { AppHeader } from "@/ui/primitives/app-header";
import { BrandButton } from "@/ui/primitives/brand-button";
import { StageScreen } from "@/ui/primitives/stage-screen";

const choices = ["Timo", "Mika"] as const;
type Choice = (typeof choices)[number];

const BOT_VOTE_DELAY_MS = 2400;

export function PlayScreen() {
  const { code = "RUND24" } = useLocalSearchParams<{ code?: string }>();
  const [choice, setChoice] = useState<Choice | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [botVoted, setBotVoted] = useState(false);
  const reducedMotion = useReducedMotion();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (submitted && !botVoted) {
      // Bot wählt zufällig nach kurzem Delay
      timerRef.current = setTimeout(() => {
        const botChoice = choices[Math.floor(Math.random() * choices.length)];
        setBotVoted(true);
        // Weiterleitung zu Ergebnissen mit Stimmen
        router.replace({
          pathname: "/results",
          params: {
            code,
            playerVote: choice ?? "",
            botVote: botChoice,
          },
        });
      }, BOT_VOTE_DELAY_MS);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [submitted, botVoted, choice, code]);

  return (
    <StageScreen stageColor={colors.stageCoral} pattern="dots">
      <AppHeader title="Frage 1 von 5" actionLabel="Lobby" onAction={() => router.back()} />

      <View style={{ flex: 1, justifyContent: "center", paddingVertical: 24, gap: 30 }}>
        <Animated.View entering={reducedMotion ? undefined : FadeInDown.duration(260)} style={{ gap: 12 }}>
          <Text style={{ color: colors.sun, fontFamily: fonts.bodyBold, fontSize: 14, letterSpacing: 0.8 }}>RAUM {code}</Text>
          <Text
            selectable
            style={{ color: colors.white, fontFamily: fonts.displayExtraBold, fontSize: 40, lineHeight: 43, maxWidth: 430 }}
          >
            Wer bringt die Gruppe am schnellsten zum Lachen?
          </Text>
          <Text selectable style={{ color: colors.whiteSoft, fontFamily: fonts.body, fontSize: 17, lineHeight: 24 }}>
            Tippe auf eine Person. Deine Wahl bleibt geheim.
          </Text>
        </Animated.View>

        <View style={{ gap: 12 }}>
          {choices.map((person) => {
            const selected = choice === person;
            return (
              <Pressable
                key={person}
                accessibilityRole="radio"
                accessibilityState={{ checked: selected, disabled: submitted }}
                disabled={submitted}
                onPress={() => setChoice(person)}
                style={({ pressed }) => ({
                  minHeight: 72,
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 14,
                  paddingHorizontal: 18,
                  borderRadius: radii.card,
                  borderCurve: "continuous",
                  borderWidth: 2,
                  borderColor: selected ? colors.sun : colors.borderOnColor,
                  backgroundColor: selected ? colors.surface : "rgba(255,255,255,0.1)",
                  opacity: submitted ? (selected ? 1 : 0.5) : pressed ? 0.84 : 1,
                })}
              >
                <View
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: selected ? colors.sun : colors.whiteFaint,
                  }}
                >
                  <Text style={{ color: selected ? colors.ink : colors.white, fontFamily: fonts.bodyBold }}>{person[0]}</Text>
                </View>
                <Text style={{ flex: 1, color: selected ? colors.ink : colors.white, fontFamily: fonts.bodyBold, fontSize: 19 }}>{person}</Text>
                <Text style={{ color: selected ? colors.stageCoralDeep : colors.whiteSoft, fontFamily: fonts.bodyBold, fontSize: 18 }}>
                  {selected ? "Gewählt" : "○"}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <BrandButton
          disabled={!choice || submitted}
          label={submitted ? "Warte auf Mika…" : "Stimme abgeben"}
          onPress={() => setSubmitted(true)}
          tone="sun"
        />

        {submitted ? (
          <Animated.View
            entering={reducedMotion ? undefined : FadeIn.duration(220)}
            accessibilityLiveRegion="polite"
            style={{ padding: 16, borderRadius: radii.control, borderCurve: "continuous", backgroundColor: colors.danger }}
          >
            <Text selectable style={{ color: colors.white, fontFamily: fonts.bodySemiBold, fontSize: 15, textAlign: "center" }}>
              Gespeichert. Das Ergebnis erscheint, wenn alle gewählt haben.
            </Text>
          </Animated.View>
        ) : null}
      </View>
    </StageScreen>
  );
}
