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

export function SchaetzResult({ params, onNext, isLastRound, roundNumber, totalRounds, code }: Props) {
  const { name: profileName } = useProfile();
  const myName = profileName || "Du";
  const reducedMotion = useReducedMotion();

  const playerGuess = parseInt(params.playerGuess ?? "0", 10);
  const botGuess = parseInt(params.botGuess ?? "0", 10);
  const correctAnswer = parseInt(params.correctAnswer ?? "0", 10);

  const players = [
    { id: "player", name: myName, guess: playerGuess },
    { id: "bot", name: BOT_NAME, guess: botGuess },
  ];

  const withDeviation = players
    .map((p) => ({ ...p, deviation: Math.abs(p.guess - correctAnswer) }))
    .sort((a, b) => a.deviation - b.deviation);

  const rankPoints = [3, 2, 1];

  const ranked = withDeviation.map((p, i) => {
    const points = rankPoints[i] ?? 0;
    const exactHit = p.deviation === 0;
    const nearHit = correctAnswer !== 0 && p.deviation / Math.abs(correctAnswer) < 0.1;
    const badge = exactHit ? "Volltreffer!" : nearHit ? "Fast richtig!" : undefined;
    const pct = correctAnswer !== 0 ? Math.max(0, 1 - p.deviation / Math.abs(correctAnswer)) : 0;
    return { ...p, rank: i + 1, points: points + (exactHit ? 1 : 0), badge, pct };
  });

  const winner = ranked[0];
  const isTie = ranked.length > 1 && ranked[0].deviation === ranked[1].deviation;

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
          {isTie ? "Unentschieden!" : `${winner.name} liegt am nächsten!`}
        </Text>
      </Animated.View>

      {/* Correct answer reveal */}
      <Animated.View
        entering={reducedMotion ? undefined : ZoomIn.delay(250).duration(400)}
        style={{
          alignItems: "center",
          padding: spacing.xl,
          borderRadius: radii.card,
          backgroundColor: "rgba(0,0,0,0.25)",
          borderWidth: 2,
          borderColor: colors.sun,
          gap: 4,
        }}
      >
        <Text style={{ color: colors.whiteSoft, fontFamily: fonts.bodySemiBold, fontSize: 13, letterSpacing: 0.8 }}>
          RICHTIGE ANTWORT
        </Text>
        <Text style={{ color: colors.sun, fontFamily: fonts.displayExtraBold, fontSize: 52, lineHeight: 58 }}>
          {correctAnswer.toLocaleString("de-DE")}
        </Text>
      </Animated.View>

      {/* Ranked list */}
      <View style={{ gap: 10 }}>
        {ranked.map((p, i) => {
          const isWinner = !isTie && i === 0;
          return (
            <Animated.View
              key={p.id}
              entering={reducedMotion ? undefined : FadeInDown.delay(300 + i * 100).duration(260)}
              style={{
                borderRadius: radii.card,
                borderCurve: "continuous",
                backgroundColor: isWinner ? colors.surface : "rgba(255,255,255,0.1)",
                padding: spacing.lg,
                gap: 10,
                borderWidth: isWinner ? 2 : 0,
                borderColor: isWinner ? colors.sun : "transparent",
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
                <View
                  style={{
                    width: 36, height: 36, borderRadius: 18,
                    alignItems: "center", justifyContent: "center",
                    backgroundColor: isWinner ? colors.sun : colors.whiteFaint,
                  }}
                >
                  <Text style={{ color: isWinner ? colors.ink : colors.white, fontFamily: fonts.bodyBold, fontSize: 16 }}>
                    {p.rank}
                  </Text>
                </View>
                <Text style={{ flex: 1, color: isWinner ? colors.ink : colors.white, fontFamily: fonts.bodyBold, fontSize: 18 }}>
                  {p.name}
                  {isWinner ? " 🎯" : ""}
                </Text>
                <Text style={{ color: isWinner ? colors.stageGrapeDeep : colors.whiteSoft, fontFamily: fonts.mono, fontSize: 14 }}>
                  +{p.points} Pkt
                </Text>
              </View>

              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                <Text style={{ color: isWinner ? colors.inkMuted : colors.whiteSoft, fontFamily: fonts.body, fontSize: 14 }}>
                  Schätzung: {p.guess.toLocaleString("de-DE")}
                </Text>
                <Text style={{ color: isWinner ? colors.inkMuted : colors.whiteSoft, fontFamily: fonts.body, fontSize: 14 }}>
                  Abstand: {p.deviation.toLocaleString("de-DE")}
                </Text>
              </View>

              {/* Progress bar */}
              <View style={{ height: 6, borderRadius: 3, backgroundColor: isWinner ? colors.surfaceSoft : "rgba(255,255,255,0.1)", overflow: "hidden" }}>
                <Animated.View
                  entering={reducedMotion ? undefined : FadeIn.delay(450 + i * 80).duration(500)}
                  style={{
                    height: 6,
                    width: `${Math.max(5, p.pct * 100)}%`,
                    borderRadius: 3,
                    backgroundColor: isWinner ? colors.stageGrape : colors.whiteSoft,
                  }}
                />
              </View>

              {p.badge ? (
                <View style={{ alignSelf: "flex-start", backgroundColor: colors.sun, paddingHorizontal: 10, paddingVertical: 4, borderRadius: radii.round }}>
                  <Text style={{ color: colors.ink, fontFamily: fonts.bodyBold, fontSize: 12 }}>{p.badge}</Text>
                </View>
              ) : null}
            </Animated.View>
          );
        })}
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
