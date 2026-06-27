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

export function BluffResult({ params, onNext, isLastRound, roundNumber, totalRounds, code }: Props) {
  const { name: profileName } = useProfile();
  const myName = profileName || "Du";
  const reducedMotion = useReducedMotion();

  const playerVote = params.playerVote ?? "";
  const botVote = params.botVote ?? "";
  const playerFake = params.playerFake ?? "";
  const botFake = params.botFake ?? "";
  const correctAnswer = params.correctAnswer ?? "";
  const questionPrompt = params.questionPrompt ?? "";

  const playerVotedCorrect = playerVote === correctAnswer;
  const botVotedCorrect = botVote === correctAnswer;

  // Count votes for each answer
  const allVotes = [playerVote, botVote];
  const votesForPlayerFake = allVotes.filter((v) => v === playerFake).length;
  const votesForBotFake = allVotes.filter((v) => v === botFake).length;
  const votesForCorrect = allVotes.filter((v) => v === correctAnswer).length;

  // Player points: 2 if voted correct + 1 per vote on own fake (from others)
  const otherVotesOnPlayerFake = (botVote === playerFake ? 1 : 0);
  const playerPoints = (playerVotedCorrect ? 2 : 0) + otherVotesOnPlayerFake;

  // Bot points: 2 if voted correct + votes on bot fake (from player)
  const otherVotesOnBotFake = (playerVote === botFake ? 1 : 0);
  const botPoints = (botVotedCorrect ? 2 : 0) + otherVotesOnBotFake;

  const answers = [
    {
      text: correctAnswer,
      label: "Die echte Antwort",
      icon: "🎯",
      votedBy: allVotes.filter((v) => v === correctAnswer),
      isCorrect: true,
    },
    {
      text: playerFake,
      label: "Deine Falle",
      icon: "🪤",
      votedBy: allVotes.filter((v) => v === playerFake),
      isCorrect: false,
    },
    {
      text: botFake,
      label: `${BOT_NAME}s Falle`,
      icon: "🪤",
      votedBy: allVotes.filter((v) => v === botFake),
      isCorrect: false,
    },
  ].filter((a) => a.text); // hide empty answers

  const players = [
    { id: "player", name: myName, points: playerPoints, voted: playerVote, votedCorrect: playerVotedCorrect },
    { id: "bot", name: BOT_NAME, points: botPoints, voted: botVote, votedCorrect: botVotedCorrect },
  ].sort((a, b) => b.points - a.points);

  const winner = players[0];
  const isTie = players[0].points === players[1]?.points;

  return (
    <View style={{ flex: 1, justifyContent: "center", paddingVertical: 16, gap: 22 }}>
      <Animated.View
        entering={reducedMotion ? undefined : FadeInDown.duration(300)}
        style={{ alignItems: "center", gap: 6 }}
      >
        <Text style={{ color: colors.sun, fontFamily: fonts.bodyBold, fontSize: 12, letterSpacing: 1.6 }}>
          AUFLÖSUNG · RUNDE {roundNumber}
        </Text>
        <Text style={{ color: colors.whiteSoft, fontFamily: fonts.body, fontSize: 14, textAlign: "center" }}>
          {questionPrompt}
        </Text>
      </Animated.View>

      {/* Correct answer reveal */}
      <Animated.View
        entering={reducedMotion ? undefined : ZoomIn.delay(200).duration(400)}
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
          DIE ECHTE ANTWORT
        </Text>
        <Text style={{ color: colors.sun, fontFamily: fonts.displayExtraBold, fontSize: 36, lineHeight: 42, textAlign: "center" }}>
          {correctAnswer}
        </Text>
      </Animated.View>

      {/* All answers breakdown */}
      <View style={{ gap: 8 }}>
        {answers.map((a, i) => (
          <Animated.View
            key={a.text + i}
            entering={reducedMotion ? undefined : FadeInDown.delay(300 + i * 80).duration(240)}
            style={{
              borderRadius: radii.control,
              borderCurve: "continuous",
              backgroundColor: a.isCorrect ? "rgba(67,184,107,0.15)" : "rgba(255,255,255,0.08)",
              borderWidth: 1,
              borderColor: a.isCorrect ? colors.online : colors.borderOnColor,
              padding: spacing.lg,
              gap: 6,
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
              <Text style={{ fontSize: 20 }}>{a.icon}</Text>
              <Text style={{ flex: 1, color: a.isCorrect ? colors.online : colors.whiteSoft, fontFamily: fonts.bodyBold, fontSize: 13, letterSpacing: 0.6 }}>
                {a.label.toUpperCase()}
              </Text>
              {a.votedBy.length > 0 && (
                <View style={{ backgroundColor: a.isCorrect ? colors.online : "rgba(255,255,255,0.2)", paddingHorizontal: 8, paddingVertical: 3, borderRadius: radii.round }}>
                  <Text style={{ color: colors.white, fontFamily: fonts.bodyBold, fontSize: 11 }}>
                    {a.votedBy.length} {a.votedBy.length === 1 ? "Stimme" : "Stimmen"}
                  </Text>
                </View>
              )}
            </View>
            <Text style={{ color: colors.white, fontFamily: fonts.bodySemiBold, fontSize: 18 }}>
              {a.text}
            </Text>
          </Animated.View>
        ))}
      </View>

      {/* Player scores */}
      <View style={{ gap: 8 }}>
        {players.map((p, i) => {
          const isWinner = !isTie && i === 0;
          return (
            <Animated.View
              key={p.id}
              entering={reducedMotion ? undefined : FadeInDown.delay(550 + i * 80).duration(260)}
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 12,
                padding: spacing.lg,
                borderRadius: radii.card,
                borderCurve: "continuous",
                backgroundColor: isWinner ? colors.surface : "rgba(255,255,255,0.1)",
                borderWidth: isWinner ? 2 : 0,
                borderColor: isWinner ? colors.sun : "transparent",
              }}
            >
              <View style={{ width: 36, height: 36, borderRadius: 18, alignItems: "center", justifyContent: "center", backgroundColor: isWinner ? colors.sun : colors.whiteFaint }}>
                <Text style={{ color: isWinner ? colors.ink : colors.white, fontFamily: fonts.bodyBold }}>{p.name[0]}</Text>
              </View>
              <Text style={{ flex: 1, color: isWinner ? colors.ink : colors.white, fontFamily: fonts.bodyBold, fontSize: 17 }}>
                {p.name}{isWinner ? " 👑" : ""}
              </Text>
              <Text style={{ color: isWinner ? colors.stageGrapeDeep : colors.whiteSoft, fontFamily: fonts.mono, fontSize: 16 }}>
                +{p.points} Pkt
              </Text>
            </Animated.View>
          );
        })}
      </View>

      <Animated.View entering={reducedMotion ? undefined : FadeIn.delay(700).duration(300)}>
        <BrandButton
          label={isLastRound ? "Gesamtergebnis 🏆" : `Frage ${roundNumber + 1} von ${totalRounds} →`}
          onPress={onNext}
          tone="sun"
        />
      </Animated.View>
    </View>
  );
}
