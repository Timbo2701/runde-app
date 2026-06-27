import { useEffect, useRef, useState } from "react";
import { Text, TextInput, View } from "react-native";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";

import { colors, fonts, radii } from "@/design/tokens";
import type { RoundQuestion } from "@/lib/game-types";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { BrandButton } from "@/ui/primitives/brand-button";

const BOT_NAME = "Mika";
const BOT_THINK_DELAY_MS = 2000;

interface Props {
  code: string;
  roundNumber: number;
  totalRounds: number;
  question: RoundQuestion;
  onResult: (playerGuess: number, botGuess: number) => void;
}

export function SchaetzPlay({ code, roundNumber, totalRounds, question, onResult }: Props) {
  const [inputValue, setInputValue] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const reducedMotion = useReducedMotion();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setInputValue("");
    setSubmitted(false);
  }, [roundNumber]);

  const handleSubmit = () => {
    if (!inputValue || submitted) return;
    setSubmitted(true);
    const correctNum = parseInt(question.correctAnswer ?? "100", 10);
    timerRef.current = setTimeout(() => {
      const factor = 0.7 + Math.random() * 0.6;
      const botGuess = Math.round(correctNum * factor);
      onResult(parseInt(inputValue, 10), botGuess);
    }, BOT_THINK_DELAY_MS);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const hasValue = inputValue.trim().length > 0;

  return (
    <View style={{ flex: 1, justifyContent: "center", paddingVertical: 24, gap: 28 }}>
      <Animated.View
        key={roundNumber}
        entering={reducedMotion ? undefined : FadeInDown.duration(260)}
        style={{ gap: 12 }}
      >
        <Text style={{ color: colors.sun, fontFamily: fonts.bodyBold, fontSize: 14, letterSpacing: 0.8 }}>
          RAUM {code} · SCHÄTZRUNDE
        </Text>
        <Text
          selectable
          style={{ color: colors.white, fontFamily: fonts.displayExtraBold, fontSize: 36, lineHeight: 40, maxWidth: 430 }}
        >
          {question.prompt}
        </Text>
      </Animated.View>

      <Animated.View
        entering={reducedMotion ? undefined : FadeInDown.delay(120).duration(260)}
        style={{ gap: 8 }}
      >
        <Text style={{ color: colors.whiteSoft, fontFamily: fonts.bodySemiBold, fontSize: 13, letterSpacing: 0.6 }}>
          DEINE SCHÄTZUNG
        </Text>
        <TextInput
          value={inputValue}
          onChangeText={(t) => {
            const cleaned = t.replace(/[^0-9]/g, "");
            setInputValue(cleaned);
          }}
          keyboardType="numeric"
          editable={!submitted}
          placeholder="0"
          placeholderTextColor="rgba(255,255,255,0.25)"
          style={{
            backgroundColor: "rgba(0,0,0,0.25)",
            borderRadius: radii.control,
            borderWidth: 2,
            borderColor: hasValue ? colors.sun : colors.borderOnColor,
            color: colors.white,
            fontFamily: fonts.displayExtraBold,
            fontSize: 52,
            textAlign: "center",
            paddingVertical: 20,
            paddingHorizontal: 16,
          }}
        />
      </Animated.View>

      <BrandButton
        disabled={!hasValue || submitted}
        label={submitted ? `${BOT_NAME} schätzt…` : "Abschicken"}
        onPress={handleSubmit}
        tone="sun"
      />

      {submitted ? (
        <Animated.View
          entering={reducedMotion ? undefined : FadeIn.duration(220)}
          accessibilityLiveRegion="polite"
          style={{
            padding: 16,
            borderRadius: radii.control,
            borderCurve: "continuous",
            backgroundColor: "rgba(0,0,0,0.2)",
            borderWidth: 1,
            borderColor: colors.borderOnColor,
          }}
        >
          <Text style={{ color: colors.whiteSoft, fontFamily: fonts.bodySemiBold, fontSize: 15, textAlign: "center" }}>
            Deine Schätzung: {inputValue} · {BOT_NAME} überlegt noch...
          </Text>
        </Animated.View>
      ) : null}
    </View>
  );
}
