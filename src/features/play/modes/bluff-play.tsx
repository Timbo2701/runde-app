import { useEffect, useRef, useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";

import { colors, fonts, radii } from "@/design/tokens";
import type { RoundQuestion } from "@/lib/game-types";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { BrandButton } from "@/ui/primitives/brand-button";

const BOT_NAME = "Mika";
const BOT_FAKE_POOL = [
  "Kohlenstoff", "Spinat", "Ein Pferd", "1847", "Silizium",
  "Natriumchlorid", "Der Papst", "Schokolade", "Kartoffelstärke",
  "Das Nilpferd", "Marmor", "Zitronensaft", "Kupfer", "Rosmarin",
];
const BOT_THINK_MS = 1500;

interface Props {
  code: string;
  roundNumber: number;
  totalRounds: number;
  question: RoundQuestion;
  onResult: (playerVote: string, botVote: string, playerFake: string, botFake: string) => void;
}

type Phase = "write" | "vote";

export function BluffPlay({ code, roundNumber, totalRounds, question, onResult }: Props) {
  const [phase, setPhase] = useState<Phase>("write");
  const [playerFake, setPlayerFake] = useState("");
  const [botFake, setBotFake] = useState("");
  const [fakeSubmitted, setFakeSubmitted] = useState(false);

  const [voteOptions, setVoteOptions] = useState<string[]>([]);
  const [playerVote, setPlayerVote] = useState<string | null>(null);
  const [voteSubmitted, setVoteSubmitted] = useState(false);

  const reducedMotion = useReducedMotion();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const correctAnswer = question.correctAnswer ?? "";

  useEffect(() => {
    const timer = setTimeout(() => {
      setPhase("write");
      setPlayerFake("");
      setBotFake("");
      setFakeSubmitted(false);
      setVoteOptions([]);
      setPlayerVote(null);
      setVoteSubmitted(false);
    }, 0);
    return () => clearTimeout(timer);
  }, [roundNumber]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const handleFakeSubmit = () => {
    if (!playerFake.trim() || fakeSubmitted) return;
    setFakeSubmitted(true);

    timerRef.current = setTimeout(() => {
      // Pick a bot fake that isn't the real answer or the player's fake
      const available = BOT_FAKE_POOL.filter(
        (f) => f !== correctAnswer && f.toLowerCase() !== playerFake.toLowerCase()
      );
      const chosen = available[Math.floor(Math.random() * available.length)] ?? "Das Nilpferd";
      setBotFake(chosen);

      // Build shuffled options: [correctAnswer, playerFake, botFake]
      const opts = [correctAnswer, playerFake.trim(), chosen].sort(() => Math.random() - 0.5);
      setVoteOptions(opts);
      setPhase("vote");
    }, BOT_THINK_MS);
  };

  const handleVoteSubmit = () => {
    if (!playerVote || voteSubmitted) return;
    setVoteSubmitted(true);

    timerRef.current = setTimeout(() => {
      // Bot votes: not for own fake, picks randomly between correct and player fake
      const botChoices = [correctAnswer, playerFake.trim()];
      const botVote = botChoices[Math.floor(Math.random() * botChoices.length)];
      onResult(playerVote, botVote, playerFake.trim(), botFake);
    }, BOT_THINK_MS);
  };

  if (phase === "write") {
    return (
      <View style={{ flex: 1, justifyContent: "center", paddingVertical: 24, gap: 28 }}>
        <Animated.View
          key={`write-${roundNumber}`}
          entering={reducedMotion ? undefined : FadeInDown.duration(260)}
          style={{ gap: 12 }}
        >
          <Text style={{ color: colors.sun, fontFamily: fonts.bodyBold, fontSize: 14, letterSpacing: 0.8 }}>
            RAUM {code} · BLUFF-MODUS
          </Text>
          <Text
            selectable
            style={{ color: colors.white, fontFamily: fonts.displayExtraBold, fontSize: 34, lineHeight: 38, maxWidth: 430 }}
          >
            {question.prompt}
          </Text>
          {question.bluffHint ? (
            <Text style={{ color: colors.whiteSoft, fontFamily: fonts.body, fontSize: 15 }}>
              Hinweis: {question.bluffHint}
            </Text>
          ) : null}
        </Animated.View>

        <Animated.View
          entering={reducedMotion ? undefined : FadeInDown.delay(120).duration(260)}
          style={{ gap: 8 }}
        >
          <Text style={{ color: colors.whiteSoft, fontFamily: fonts.bodySemiBold, fontSize: 13, letterSpacing: 0.6 }}>
            MEINE FAKE-ANTWORT
          </Text>
          <TextInput
            value={playerFake}
            onChangeText={setPlayerFake}
            editable={!fakeSubmitted}
            placeholder="Erfinde eine Antwort..."
            placeholderTextColor="rgba(255,255,255,0.25)"
            multiline={false}
            style={{
              backgroundColor: "rgba(0,0,0,0.25)",
              borderRadius: radii.control,
              borderWidth: 2,
              borderColor: playerFake.trim() ? colors.sun : colors.borderOnColor,
              color: colors.white,
              fontFamily: fonts.bodySemiBold,
              fontSize: 24,
              textAlign: "center",
              paddingVertical: 20,
              paddingHorizontal: 16,
            }}
          />
          <Text style={{ color: colors.whiteSoft, fontFamily: fonts.body, fontSize: 13, textAlign: "center" }}>
            Schreib etwas Überzeugendes. Die anderen müssen wählen!
          </Text>
        </Animated.View>

        <BrandButton
          disabled={!playerFake.trim() || fakeSubmitted}
          label={fakeSubmitted ? `${BOT_NAME} denkt nach…` : "Fertig"}
          onPress={handleFakeSubmit}
          tone="sun"
        />
      </View>
    );
  }

  // Phase: vote
  return (
    <View style={{ flex: 1, justifyContent: "center", paddingVertical: 24, gap: 24 }}>
      <Animated.View
        entering={reducedMotion ? undefined : FadeInDown.duration(260)}
        style={{ gap: 10 }}
      >
        <Text style={{ color: colors.sun, fontFamily: fonts.bodyBold, fontSize: 14, letterSpacing: 0.8 }}>
          JETZT ABSTIMMEN
        </Text>
        <Text
          style={{ color: colors.white, fontFamily: fonts.displayExtraBold, fontSize: 28, lineHeight: 32 }}
        >
          Welche Antwort ist die echte?
        </Text>
        <Text style={{ color: colors.whiteSoft, fontFamily: fonts.body, fontSize: 15 }}>
          {question.prompt}
        </Text>
      </Animated.View>

      <View style={{ gap: 10 }}>
        {voteOptions.map((option, i) => {
          const isOwn = option === playerFake.trim();
          const isSelected = playerVote === option;
          const isDimmed = voteSubmitted && !isSelected;
          return (
            <Animated.View
              key={option}
              entering={reducedMotion ? undefined : FadeInDown.delay(i * 70).duration(220)}
            >
              <Pressable
                disabled={isOwn || voteSubmitted}
                onPress={() => setPlayerVote(option)}
                style={({ pressed }) => ({
                  paddingHorizontal: 20,
                  paddingVertical: 18,
                  borderRadius: radii.card,
                  borderCurve: "continuous",
                  borderWidth: 2,
                  borderColor: isSelected ? colors.sun : isOwn ? colors.whiteFaint : colors.borderOnColor,
                  backgroundColor: isSelected
                    ? colors.surface
                    : isOwn
                    ? "rgba(255,255,255,0.04)"
                    : "rgba(255,255,255,0.1)",
                  opacity: isDimmed ? 0.4 : isOwn ? 0.45 : pressed ? 0.82 : 1,
                })}
              >
                <Text
                  style={{
                    color: isSelected ? colors.ink : isOwn ? colors.whiteSoft : colors.white,
                    fontFamily: fonts.bodySemiBold,
                    fontSize: 19,
                    textAlign: "center",
                  }}
                >
                  {option}
                  {isOwn ? "  (Deine Falle)" : ""}
                </Text>
              </Pressable>
            </Animated.View>
          );
        })}
      </View>

      <BrandButton
        disabled={!playerVote || voteSubmitted}
        label={voteSubmitted ? `${BOT_NAME} stimmt ab…` : "Stimme abgeben"}
        onPress={handleVoteSubmit}
        tone="sun"
      />

      {voteSubmitted ? (
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
            Stimme abgegeben · {BOT_NAME} entscheidet...
          </Text>
        </Animated.View>
      ) : null}
    </View>
  );
}
