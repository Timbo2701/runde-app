import { Text, View } from "react-native";
import Animated, { FadeIn, FadeInDown, ZoomIn } from "react-native-reanimated";

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

function AnswerStatusBadge({ correct }: { correct: boolean }) {
  return (
    <View
      style={{
        width: 28,
        height: 28,
        borderRadius: 14,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: correct ? colors.online : colors.danger,
      }}
    >
      <Text style={{ color: colors.white, fontFamily: fonts.bodyBold, fontSize: 13, lineHeight: 16 }}>
        {correct ? "✓" : "✕"}
      </Text>
    </View>
  );
}

function PlayerChip({ name, correct }: { name: string; correct: boolean }) {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 5,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: radii.round,
        backgroundColor: correct ? "rgba(67,184,107,0.25)" : "rgba(122,22,55,0.35)",
        borderWidth: 1,
        borderColor: correct ? "rgba(67,184,107,0.5)" : "rgba(255,255,255,0.15)",
      }}
    >
      <View
        style={{
          width: 16,
          height: 16,
          borderRadius: 8,
          backgroundColor: correct ? colors.online : "rgba(255,255,255,0.25)",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text style={{ color: colors.white, fontFamily: fonts.bodyBold, fontSize: 9 }}>{name[0]}</Text>
      </View>
      <Text style={{ color: correct ? colors.online : colors.whiteSoft, fontFamily: fonts.bodyBold, fontSize: 11 }}>
        {name}
      </Text>
    </View>
  );
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

  const bothCorrect = playerCorrect && botCorrect;
  const bothWrong = !playerCorrect && !botCorrect;

  const headline = bothCorrect
    ? "Beide richtig!"
    : playerCorrect
    ? "Richtig!"
    : bothWrong
    ? "Keiner hat's gewusst"
    : "Leider falsch";

  const headlineColor = playerCorrect ? colors.online : bothWrong ? colors.whiteSoft : colors.stageCoral;

  return (
    <View style={{ flex: 1, justifyContent: "center", paddingVertical: 16, gap: 22 }}>
      {/* Header */}
      <Animated.View
        entering={reducedMotion ? undefined : FadeInDown.duration(300)}
        style={{ alignItems: "center", gap: 8 }}
      >
        <Animated.View
          entering={reducedMotion ? undefined : ZoomIn.delay(100).duration(350).springify().damping(10)}
          style={{
            width: 56,
            height: 56,
            borderRadius: 28,
            backgroundColor: playerCorrect ? "rgba(67,184,107,0.2)" : "rgba(122,22,55,0.3)",
            alignItems: "center",
            justifyContent: "center",
            borderWidth: 2,
            borderColor: playerCorrect ? "rgba(67,184,107,0.5)" : "rgba(255,255,255,0.15)",
          }}
        >
          <Text style={{ fontSize: 28, lineHeight: 34 }}>{playerCorrect ? "🎯" : "💡"}</Text>
        </Animated.View>
        <Text style={{ color: colors.sun, fontFamily: fonts.bodyBold, fontSize: 12, letterSpacing: 1.6 }}>
          ERGEBNIS · RUNDE {roundNumber}
        </Text>
        <Text style={{ color: headlineColor, fontFamily: fonts.displayExtraBold, fontSize: 32, lineHeight: 36, textAlign: "center" }}>
          {headline}
        </Text>
        {!playerCorrect && (
          <View style={{ alignItems: "center", gap: 3, marginTop: 2 }}>
            <Text style={{ color: "rgba(255,255,255,0.5)", fontFamily: fonts.body, fontSize: 13 }}>
              Die richtige Antwort war:
            </Text>
            <Text style={{ color: colors.sun, fontFamily: fonts.displayExtraBold, fontSize: 20, lineHeight: 24, textAlign: "center" }}>
              {correctAnswer}
            </Text>
          </View>
        )}
      </Animated.View>

      {/* Antwort-Optionen */}
      {options.length > 0 && (
        <View style={{ gap: 8 }}>
          {options.map((option, i) => {
            const isCorrect = option === correctAnswer;
            const playerChose = option === playerAnswer;
            const botChose = option === botAnswer;
            const highlight = isCorrect || playerChose || botChose;

            return (
              <Animated.View
                key={option}
                entering={reducedMotion ? undefined : FadeInDown.delay(120 + i * 70).duration(240)}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 12,
                  paddingHorizontal: 14,
                  paddingVertical: 12,
                  borderRadius: radii.control,
                  borderCurve: "continuous",
                  borderWidth: isCorrect ? 2 : 1,
                  borderColor: isCorrect
                    ? colors.online
                    : playerChose && !playerCorrect
                    ? "rgba(122,22,55,0.6)"
                    : "rgba(255,255,255,0.10)",
                  backgroundColor: isCorrect
                    ? "rgba(67,184,107,0.15)"
                    : playerChose && !playerCorrect
                    ? "rgba(122,22,55,0.2)"
                    : "rgba(255,255,255,0.05)",
                  opacity: highlight ? 1 : 0.45,
                }}
              >
                {/* Status badge */}
                {isCorrect ? (
                  <AnswerStatusBadge correct={true} />
                ) : playerChose && !playerCorrect ? (
                  <AnswerStatusBadge correct={false} />
                ) : (
                  <View style={{ width: 28, height: 28 }} />
                )}

                <Text
                  style={{
                    flex: 1,
                    color: isCorrect ? colors.online : playerChose ? colors.whiteSoft : "rgba(255,255,255,0.5)",
                    fontFamily: isCorrect || playerChose ? fonts.bodySemiBold : fonts.body,
                    fontSize: 15,
                  }}
                >
                  {option}
                </Text>

                {/* Spieler-Chips */}
                <View style={{ flexDirection: "row", gap: 5, alignItems: "center" }}>
                  {playerChose && <PlayerChip name={myName} correct={playerCorrect} />}
                  {botChose && <PlayerChip name={BOT_NAME} correct={botCorrect} />}
                </View>
              </Animated.View>
            );
          })}
        </View>
      )}

      {/* Punkte */}
      <View style={{ gap: 8 }}>
        {[
          { id: "player", name: myName, correct: playerCorrect },
          { id: "bot", name: BOT_NAME, correct: botCorrect },
        ].map((p, i) => (
          <Animated.View
            key={p.id}
            entering={reducedMotion ? undefined : FadeInDown.delay(420 + i * 80).duration(260)}
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 12,
              padding: spacing.md,
              paddingHorizontal: spacing.lg,
              borderRadius: radii.card,
              borderCurve: "continuous",
              backgroundColor: p.correct ? "rgba(67,184,107,0.12)" : "rgba(255,255,255,0.07)",
              borderWidth: p.correct ? 1.5 : 1,
              borderColor: p.correct ? "rgba(67,184,107,0.45)" : "rgba(255,255,255,0.10)",
            }}
          >
            <View
              style={{
                width: 36,
                height: 36,
                borderRadius: 18,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: p.correct ? colors.online : "rgba(255,255,255,0.10)",
              }}
            >
              <Text style={{ color: colors.white, fontFamily: fonts.bodyBold, fontSize: 14 }}>
                {p.name[0]}
              </Text>
            </View>
            <Text style={{ flex: 1, color: p.correct ? colors.white : colors.whiteSoft, fontFamily: fonts.bodySemiBold, fontSize: 16 }}>
              {p.name}
            </Text>
            <View style={{ alignItems: "flex-end", gap: 1 }}>
              <Text
                style={{
                  color: p.correct ? colors.online : "rgba(255,255,255,0.4)",
                  fontFamily: fonts.mono,
                  fontSize: 16,
                  fontWeight: "700",
                }}
              >
                {p.correct ? "+2 Pkt" : "+0 Pkt"}
              </Text>
              {p.correct && (
                <Text style={{ color: "rgba(67,184,107,0.7)", fontFamily: fonts.body, fontSize: 10 }}>
                  Richtige Antwort
                </Text>
              )}
            </View>
          </Animated.View>
        ))}
      </View>

      <Animated.View entering={reducedMotion ? undefined : FadeIn.delay(620).duration(300)}>
        <BrandButton
          label={isLastRound ? "Gesamtergebnis 🏆" : `Frage ${roundNumber + 1} von ${totalRounds} →`}
          onPress={onNext}
          tone="sun"
        />
      </Animated.View>
    </View>
  );
}
