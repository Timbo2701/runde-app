import { Text, View } from "react-native";
import Animated, { FadeIn, FadeInDown, FadeInUp, ZoomIn } from "react-native-reanimated";

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

function VoterBadge({ name, votedCorrect }: { name: string; votedCorrect: boolean }) {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: radii.round,
        backgroundColor: votedCorrect ? "rgba(67,184,107,0.2)" : "rgba(255,255,255,0.12)",
        borderWidth: 1,
        borderColor: votedCorrect ? "rgba(67,184,107,0.4)" : "rgba(255,255,255,0.15)",
      }}
    >
      <View
        style={{
          width: 16,
          height: 16,
          borderRadius: 8,
          backgroundColor: votedCorrect ? colors.online : "rgba(255,255,255,0.3)",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text style={{ color: colors.white, fontFamily: fonts.bodyBold, fontSize: 9 }}>{name[0]}</Text>
      </View>
      <Text style={{ color: votedCorrect ? colors.online : colors.whiteSoft, fontFamily: fonts.bodyBold, fontSize: 11 }}>
        {name}
      </Text>
    </View>
  );
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

  // Points: 2 for correct vote + 1 per other player voting on your fake
  const otherVotesOnPlayerFake = botVote === playerFake ? 1 : 0;
  const otherVotesOnBotFake = playerVote === botFake ? 1 : 0;
  const playerPoints = (playerVotedCorrect ? 2 : 0) + otherVotesOnPlayerFake;
  const botPoints = (botVotedCorrect ? 2 : 0) + otherVotesOnBotFake;

  const players = [
    { id: "player", name: myName, points: playerPoints, vote: playerVote, votedCorrect: playerVotedCorrect, fake: playerFake },
    { id: "bot", name: BOT_NAME, points: botPoints, vote: botVote, votedCorrect: botVotedCorrect, fake: botFake },
  ].sort((a, b) => b.points - a.points);

  const isTie = players[0].points === players[1]?.points;
  const winner = isTie ? null : players[0];

  // Build answer reveal list — note: "Deine Falle" is only shown to the local player
  // For a multi-device game this would need server-side reveal; here it's 1P+Bot so safe.
  const allVotes = [playerVote, botVote];

  interface AnswerEntry {
    text: string;
    label: string;
    sublabel?: string;
    isCorrect: boolean;
    isTrap: boolean;
    voters: { name: string; votedCorrect: boolean }[];
  }

  const answers: AnswerEntry[] = [
    {
      text: correctAnswer,
      label: "Die echte Antwort",
      sublabel: undefined,
      isCorrect: true,
      isTrap: false,
      voters: allVotes
        .map((v, i) => (v === correctAnswer ? { name: i === 0 ? myName : BOT_NAME, votedCorrect: true } : null))
        .filter(Boolean) as { name: string; votedCorrect: boolean }[],
    },
    ...(playerFake
      ? [{
          text: playerFake,
          label: "Deine Falle",
          sublabel: `${myName}s Erfindung`,
          isCorrect: false,
          isTrap: true,
          voters: allVotes
            .map((v, i) => (v === playerFake ? { name: i === 0 ? myName : BOT_NAME, votedCorrect: false } : null))
            .filter(Boolean) as { name: string; votedCorrect: boolean }[],
        }]
      : []),
    ...(botFake && botFake !== playerFake
      ? [{
          text: botFake,
          label: `${BOT_NAME}s Falle`,
          sublabel: undefined,
          isCorrect: false,
          isTrap: true,
          voters: allVotes
            .map((v, i) => (v === botFake ? { name: i === 0 ? myName : BOT_NAME, votedCorrect: false } : null))
            .filter(Boolean) as { name: string; votedCorrect: boolean }[],
        }]
      : []),
  ];

  const playerTrapCaught = otherVotesOnPlayerFake > 0;

  return (
    <View style={{ flex: 1, justifyContent: "center", paddingVertical: 12, gap: 18 }}>

      {/* Header */}
      <Animated.View
        entering={reducedMotion ? undefined : FadeInUp.duration(300)}
        style={{ alignItems: "center", gap: 5 }}
      >
        <Text style={{ color: colors.sun, fontFamily: fonts.bodyBold, fontSize: 12, letterSpacing: 1.6 }}>
          AUFLÖSUNG · RUNDE {roundNumber}
        </Text>
        <Text style={{ color: "rgba(255,255,255,0.5)", fontFamily: fonts.body, fontSize: 13, textAlign: "center" }}>
          {questionPrompt}
        </Text>
      </Animated.View>

      {/* Echte Antwort — großes Hero-Element */}
      <Animated.View
        entering={reducedMotion ? undefined : ZoomIn.delay(180).duration(420).springify().damping(11)}
        style={{
          alignItems: "center",
          padding: spacing.xl,
          paddingVertical: 20,
          borderRadius: radii.card,
          backgroundColor: "rgba(0,0,0,0.28)",
          borderWidth: 2,
          borderColor: colors.sun,
          gap: 5,
        }}
      >
        <Text style={{ color: "rgba(255,255,255,0.55)", fontFamily: fonts.bodySemiBold, fontSize: 11, letterSpacing: 1.2 }}>
          DIE ECHTE ANTWORT WAR
        </Text>
        <Text style={{ color: colors.sun, fontFamily: fonts.displayExtraBold, fontSize: 32, lineHeight: 38, textAlign: "center" }}>
          {correctAnswer}
        </Text>
        {playerTrapCaught && (
          <View
            style={{
              marginTop: 6,
              paddingHorizontal: 12,
              paddingVertical: 5,
              borderRadius: radii.round,
              backgroundColor: "rgba(255,216,77,0.15)",
              borderWidth: 1,
              borderColor: "rgba(255,216,77,0.35)",
            }}
          >
            <Text style={{ color: colors.sun, fontFamily: fonts.bodySemiBold, fontSize: 12 }}>
              Deine Falle hat gezündet! 🪤
            </Text>
          </View>
        )}
      </Animated.View>

      {/* Alle Antworten aufgedeckt */}
      <View style={{ gap: 8 }}>
        {answers.map((a, i) => (
          <Animated.View
            key={a.text + i}
            entering={reducedMotion ? undefined : FadeInDown.delay(300 + i * 90).duration(260)}
            style={{
              borderRadius: radii.control,
              borderCurve: "continuous",
              backgroundColor: a.isCorrect
                ? "rgba(67,184,107,0.13)"
                : "rgba(255,255,255,0.06)",
              borderWidth: a.isCorrect ? 1.5 : 1,
              borderColor: a.isCorrect
                ? "rgba(67,184,107,0.45)"
                : "rgba(255,255,255,0.12)",
              padding: spacing.md,
              paddingHorizontal: spacing.lg,
              gap: 5,
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
              <Text
                style={{
                  flex: 1,
                  color: a.isCorrect ? colors.online : colors.whiteSoft,
                  fontFamily: fonts.body,
                  fontSize: 10,
                  letterSpacing: 0.9,
                }}
              >
                {a.label.toUpperCase()}
                {a.sublabel ? `  ·  ${a.sublabel}` : ""}
              </Text>
              {a.voters.length > 0 && (
                <View
                  style={{
                    paddingHorizontal: 8,
                    paddingVertical: 3,
                    borderRadius: radii.round,
                    backgroundColor: a.isCorrect ? "rgba(67,184,107,0.25)" : "rgba(255,255,255,0.12)",
                  }}
                >
                  <Text style={{ color: a.isCorrect ? colors.online : colors.whiteSoft, fontFamily: fonts.bodyBold, fontSize: 10 }}>
                    {a.voters.length} {a.voters.length === 1 ? "Stimme" : "Stimmen"}
                  </Text>
                </View>
              )}
            </View>

            <Text style={{ color: colors.white, fontFamily: fonts.bodySemiBold, fontSize: 17 }}>
              {a.text}
            </Text>

            {/* Wer hat hier gewählt */}
            {a.voters.length > 0 && (
              <View style={{ flexDirection: "row", gap: 6, flexWrap: "wrap", marginTop: 2 }}>
                {a.voters.map((v, vi) => (
                  <VoterBadge key={v.name + vi} name={v.name} votedCorrect={v.votedCorrect} />
                ))}
              </View>
            )}
          </Animated.View>
        ))}
      </View>

      {/* Punkteübersicht */}
      <View style={{ gap: 8 }}>
        {players.map((p, i) => {
          const isWinner = !isTie && i === 0;
          const earnedTrap = p.id === "player" ? otherVotesOnPlayerFake : otherVotesOnBotFake;
          return (
            <Animated.View
              key={p.id}
              entering={reducedMotion ? undefined : FadeInDown.delay(560 + i * 80).duration(260)}
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 12,
                padding: spacing.md,
                paddingHorizontal: spacing.lg,
                borderRadius: radii.card,
                borderCurve: "continuous",
                backgroundColor: isWinner ? "rgba(255,216,77,0.12)" : "rgba(255,255,255,0.07)",
                borderWidth: isWinner ? 1.5 : 1,
                borderColor: isWinner ? "rgba(255,216,77,0.45)" : "rgba(255,255,255,0.10)",
              }}
            >
              <View
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 18,
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: isWinner ? colors.sun : colors.whiteFaint,
                }}
              >
                <Text style={{ color: isWinner ? colors.ink : colors.white, fontFamily: fonts.bodyBold, fontSize: 14 }}>
                  {p.name[0]}
                </Text>
              </View>
              <View style={{ flex: 1, gap: 2 }}>
                <Text style={{ color: isWinner ? colors.sun : colors.white, fontFamily: fonts.bodySemiBold, fontSize: 16 }}>
                  {p.name}{isWinner ? " 👑" : ""}
                </Text>
                <Text style={{ color: "rgba(255,255,255,0.4)", fontFamily: fonts.body, fontSize: 11 }}>
                  {p.votedCorrect ? "Echte Antwort erkannt (+2)" : "Falle getappt (+0)"}
                  {earnedTrap > 0 ? `  ·  Falle gezündet (+${earnedTrap})` : ""}
                </Text>
              </View>
              <Text
                style={{
                  color: isWinner ? colors.sun : colors.whiteSoft,
                  fontFamily: fonts.mono,
                  fontSize: 18,
                  fontWeight: "700",
                }}
              >
                +{p.points}
              </Text>
            </Animated.View>
          );
        })}
      </View>

      <Animated.View entering={reducedMotion ? undefined : FadeIn.delay(740).duration(300)}>
        <BrandButton
          label={isLastRound ? "Gesamtergebnis 🏆" : `Frage ${roundNumber + 1} von ${totalRounds} →`}
          onPress={onNext}
          tone="sun"
        />
      </Animated.View>
    </View>
  );
}
