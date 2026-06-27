import { Text, View } from "react-native";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";

import { colors, fonts, radii, spacing } from "@/design/tokens";
import { useProfile } from "@/lib/profile-context";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { BrandButton } from "@/ui/primitives/brand-button";

const BOT_NAME = "Mika";

interface Props {
  params: Record<string, string | undefined>;
  onNext: () => void;
  isLastRound: boolean;
  roundNumber: number;
  totalRounds: number;
  code: string;
}

export function QuizResult({ params, onNext, isLastRound, roundNumber, totalRounds, code }: Props) {
  const { name: profileName } = useProfile();
  const myName = profileName || "Du";
  const reducedMotion = useReducedMotion();

  const playerAnswer = params.playerAnswer ?? "";
  const botAnswer = params.botAnswer ?? "";
  const correctAnswer = params.correctAnswer ?? "";
  const options: string[] = (() => {
    try {
      return JSON.parse(params.options ?? "[]");
    } catch {
      return [];
    }
  })();

  const playerCorrect = playerAnswer === correctAnswer;
  const botCorrect = botAnswer === correctAnswer;

  const players = [
    { id: "player", name: myName, answer: playerAnswer, correct: playerCorrect },
    { id: "bot", name: BOT_NAME, answer: botAnswer, correct: botCorrect },
  ];

  return (
    <View style={{ flex: 1, justifyContent: "center", paddingVertical: 16, gap: 24 }}>
      <Animated.View
        entering={reducedMotion ? undefined : FadeInDown.duration(300)}
        style={{ alignItems: "center", gap: 8 }}
      >
        <Text style={{ color: colors.sun, fontFamily: fonts.bodyBold, fontSize: 12, letterSpacing: 1.6 }}>
          ERGEBNIS · RUNDE {roundNumber}
        </Text>
        <Text style={{ color: colors.white, fontFamily: fonts.displayExtraBold, fontSize: 34, lineHeight: 38, textAlign: "center" }}>
          {playerCorrect ? "Richtig! ✓" : "Leider falsch"}
        </Text>
      </Animated.View>

      {/* Options reveal */}
      {options.length > 0 && (
        <View style={{ gap: 8 }}>
          {options.map((option, i) => {
            const isCorrect = option === correctAnswer;
            const playerChose = option === playerAnswer;
            const botChose = option === botAnswer;
            return (
              <Animated.View
                key={option}
                entering={reducedMotion ? undefined : FadeInDown.delay(100 + i * 80).duration(240)}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 12,
                  paddingHorizontal: 16,
                  paddingVertical: 14,
                  borderRadius: radii.control,
                  borderCurve: "continuous",
                  borderWidth: 2,
                  borderColor: isCorrect ? colors.online : "rgba(255,255,255,0.12)",
                  backgroundColor: isCorrect ? "rgba(67,184,107,0.15)" : "rgba(255,255,255,0.06)",
                }}
              >
                <Text style={{ fontSize: 18 }}>{isCorrect ? "✓" : "✗"}</Text>
                <Text style={{
                  flex: 1,
                  color: isCorrect ? colors.online : colors.whiteSoft,
                  fontFamily: fonts.bodySemiBold,
                  fontSize: 16,
                }}>
                  {option}
                </Text>
                <View style={{ flexDirection: "row", gap: 6 }}>
                  {playerChose && (
                    <View style={{ backgroundColor: playerChose && isCorrect ? colors.online : colors.danger, paddingHorizontal: 8, paddingVertical: 3, borderRadius: radii.round }}>
                      <Text style={{ color: colors.white, fontFamily: fonts.bodyBold, fontSize: 11 }}>Du</Text>
                    </View>
                  )}
                  {botChose && (
                    <View style={{ backgroundColor: botChose && isCorrect ? colors.online : "rgba(255,255,255,0.2)", paddingHorizontal: 8, paddingVertical: 3, borderRadius: radii.round }}>
                      <Text style={{ color: colors.white, fontFamily: fonts.bodyBold, fontSize: 11 }}>{BOT_NAME}</Text>
                    </View>
                  )}
                </View>
              </Animated.View>
            );
          })}
        </View>
      )}

      {/* Player scores */}
      <View style={{ gap: 10 }}>
        {players.map((p, i) => (
          <Animated.View
            key={p.id}
            entering={reducedMotion ? undefined : FadeInDown.delay(400 + i * 80).duration(260)}
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 12,
              padding: spacing.lg,
              borderRadius: radii.card,
              borderCurve: "continuous",
              backgroundColor: p.correct ? colors.surface : "rgba(255,255,255,0.1)",
              borderWidth: p.correct ? 2 : 0,
              borderColor: p.correct ? colors.sun : "transparent",
            }}
          >
            <View style={{
              width: 40, height: 40, borderRadius: 20,
              alignItems: "center", justifyContent: "center",
              backgroundColor: p.correct ? colors.online : "rgba(255,255,255,0.12)",
            }}>
              <Text style={{ color: colors.white, fontFamily: fonts.bodyBold }}>{p.name[0]}</Text>
            </View>
            <Text style={{ flex: 1, color: p.correct ? colors.ink : colors.white, fontFamily: fonts.bodyBold, fontSize: 17 }}>
              {p.name}
            </Text>
            <Text style={{ color: p.correct ? colors.stageGrapeDeep : colors.whiteSoft, fontFamily: fonts.mono, fontSize: 16 }}>
              {p.correct ? "+2 Pkt" : "+0 Pkt"}
            </Text>
          </Animated.View>
        ))}
      </View>

      <Animated.View entering={reducedMotion ? undefined : FadeIn.delay(600).duration(300)}>
        <BrandButton
          label={isLastRound ? "Gesamtergebnis 🏆" : `Frage ${roundNumber + 1} von ${totalRounds} →`}
          onPress={onNext}
          tone="sun"
        />
      </Animated.View>
    </View>
  );
}
