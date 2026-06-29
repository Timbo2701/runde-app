import { useEffect, useRef, useState } from "react";
import { Pressable, Text, View } from "react-native";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";

import { colors, fonts, radii } from "@/design/tokens";
import type { RoundQuestion } from "@/lib/game-types";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { BrandButton } from "@/ui/primitives/brand-button";

const BOT_NAME = "Mika";
const BOT_THINK_DELAY_MS = 1500;

interface Props {
  code: string;
  roundNumber: number;
  totalRounds: number;
  question: RoundQuestion;
  onResult: (playerAnswer: string, botAnswer: string) => void;
}

export function QuizPlay({ code, roundNumber, totalRounds, question, onResult }: Props) {
  const [selected, setSelected] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const reducedMotion = useReducedMotion();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const options = question.options ?? [];

  useEffect(() => {
    const timer = setTimeout(() => {
      setSelected(null);
      setSubmitted(false);
    }, 0);
    return () => clearTimeout(timer);
  }, [roundNumber]);

  const handleSubmit = () => {
    if (!selected || submitted) return;
    setSubmitted(true);
    const correctAnswer = question.correctAnswer ?? "";
    timerRef.current = setTimeout(() => {
      // Bot: correct 60%, random wrong 40%
      let botAnswer: string;
      if (Math.random() < 0.6) {
        botAnswer = correctAnswer;
      } else {
        const wrongOptions = options.filter((o) => o !== correctAnswer);
        botAnswer = wrongOptions[Math.floor(Math.random() * wrongOptions.length)] ?? correctAnswer;
      }
      onResult(selected, botAnswer);
    }, BOT_THINK_DELAY_MS);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: "center", paddingVertical: 24, gap: 24 }}>
      <Animated.View
        key={roundNumber}
        entering={reducedMotion ? undefined : FadeInDown.duration(260)}
        style={{ gap: 12 }}
      >
        <Text style={{ color: colors.sun, fontFamily: fonts.bodyBold, fontSize: 14, letterSpacing: 0.8 }}>
          RAUM {code} · BLITZ-QUIZ
        </Text>
        <Text
          selectable
          style={{ color: colors.white, fontFamily: fonts.displayExtraBold, fontSize: 36, lineHeight: 40, maxWidth: 430 }}
        >
          {question.prompt}
        </Text>
      </Animated.View>

      <View style={{ gap: 10 }}>
        {options.map((option, i) => {
          const isSelected = selected === option;
          const isDimmed = submitted && !isSelected;
          return (
            <Animated.View
              key={option}
              entering={reducedMotion ? undefined : FadeInDown.delay(i * 60).duration(220)}
            >
              <Pressable
                disabled={submitted}
                onPress={() => setSelected(option)}
                style={({ pressed }) => ({
                  paddingHorizontal: 20,
                  paddingVertical: 18,
                  borderRadius: radii.card,
                  borderCurve: "continuous",
                  borderWidth: 2,
                  borderColor: isSelected ? colors.sun : colors.borderOnColor,
                  backgroundColor: isSelected ? colors.surface : "rgba(255,255,255,0.1)",
                  opacity: isDimmed ? 0.4 : pressed ? 0.82 : 1,
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 12,
                })}
              >
                <View
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 16,
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: isSelected ? colors.sun : colors.whiteFaint,
                  }}
                >
                  <Text style={{ color: isSelected ? colors.ink : colors.white, fontFamily: fonts.bodyBold, fontSize: 13 }}>
                    {String.fromCharCode(65 + i)}
                  </Text>
                </View>
                <Text style={{ flex: 1, color: isSelected ? colors.ink : colors.white, fontFamily: fonts.bodySemiBold, fontSize: 18 }}>
                  {option}
                </Text>
                {isSelected && (
                  <Text style={{ color: colors.stageGrapeDeep, fontFamily: fonts.bodyBold, fontSize: 16 }}>✓</Text>
                )}
              </Pressable>
            </Animated.View>
          );
        })}
      </View>

      <BrandButton
        disabled={!selected || submitted}
        label={submitted ? `${BOT_NAME} denkt nach…` : "Abschicken"}
        onPress={handleSubmit}
        tone="sun"
      />

      {submitted ? (
        <Animated.View
          entering={reducedMotion ? undefined : FadeIn.duration(220)}
          style={{
            padding: 14,
            borderRadius: radii.control,
            backgroundColor: "rgba(0,0,0,0.2)",
            borderWidth: 1,
            borderColor: colors.borderOnColor,
          }}
        >
          <Text style={{ color: colors.whiteSoft, fontFamily: fonts.bodySemiBold, fontSize: 15, textAlign: "center" }}>
            Antwort gespeichert · {BOT_NAME} überlegt...
          </Text>
        </Animated.View>
      ) : null}
    </View>
  );
}
