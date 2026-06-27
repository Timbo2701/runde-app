import { router, useLocalSearchParams } from "expo-router";
import { Text, View } from "react-native";
import Animated, { FadeIn, FadeInDown, FadeInUp } from "react-native-reanimated";

import { colors, fonts, radii, spacing } from "@/design/tokens";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { AppHeader } from "@/ui/primitives/app-header";
import { BrandButton } from "@/ui/primitives/brand-button";
import { StageScreen } from "@/ui/primitives/stage-screen";

const choices = ["Timo", "Mika"] as const;
type Choice = (typeof choices)[number];
const TOTAL_ROUNDS = 5;

function countVotes(votes: Choice[]): Record<string, number> {
  const tally: Record<string, number> = {};
  for (const v of votes) tally[v] = (tally[v] ?? 0) + 1;
  return tally;
}

export function ResultsScreen() {
  const { code = "RUND24", round = "1", playerVote, botVote } = useLocalSearchParams<{
    code?: string;
    round?: string;
    playerVote?: string;
    botVote?: string;
  }>();

  const roundNumber = parseInt(round, 10) || 1;
  const isLastRound = roundNumber >= TOTAL_ROUNDS;

  const votes = [playerVote, botVote].filter((v): v is Choice =>
    choices.includes(v as Choice)
  );
  const tally = countVotes(votes);
  const sorted = [...choices].sort((a, b) => (tally[b] ?? 0) - (tally[a] ?? 0));
  const winner = sorted[0];
  const isTie = (tally[sorted[0]] ?? 0) === (tally[sorted[1]] ?? 0);
  const reducedMotion = useReducedMotion();

  const goNext = () => {
    if (isLastRound) {
      router.replace({ pathname: "/final", params: { code } });
    } else {
      router.replace({
        pathname: "/play",
        params: { code, round: String(roundNumber + 1) },
      });
    }
  };

  return (
    <StageScreen stageColor={colors.stageGrape} pattern="rings">
      <AppHeader
        title={`Raum ${code}`}
        actionLabel="Verlassen"
        onAction={() => router.replace("/")}
      />

      <View style={{ flex: 1, justifyContent: "center", paddingVertical: 24, gap: 32 }}>
        <Animated.View entering={reducedMotion ? undefined : FadeInUp.duration(300)} style={{ alignItems: "center", gap: 8 }}>
          <Text style={{ color: colors.sun, fontFamily: fonts.bodyBold, fontSize: 13, letterSpacing: 1 }}>
            ERGEBNIS · FRAGE {roundNumber}
          </Text>
          <Text style={{ color: colors.white, fontFamily: fonts.displayExtraBold, fontSize: 36, lineHeight: 40, textAlign: "center" }}>
            {isTie ? "Unentschieden!" : `${winner} gewinnt!`}
          </Text>
          <Text style={{ color: colors.whiteSoft, fontFamily: fonts.body, fontSize: 16, textAlign: "center" }}>
            {isTie ? "Beide haben gleich viele Stimmen." : "Die Gruppe hat gesprochen."}
          </Text>
        </Animated.View>

        <View style={{ gap: 12 }}>
          {sorted.map((person, index) => {
            const voteCount = tally[person] ?? 0;
            const isWinner = !isTie && index === 0;
            const pct = votes.length > 0 ? voteCount / votes.length : 0;

            return (
              <Animated.View
                key={person}
                entering={reducedMotion ? undefined : FadeInDown.delay(index * 100).duration(260)}
                style={{
                  borderRadius: radii.card,
                  borderCurve: "continuous",
                  backgroundColor: isWinner ? colors.surface : "rgba(255,255,255,0.1)",
                  padding: spacing.xl,
                  gap: 10,
                }}
              >
                <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
                  {isWinner && <Text style={{ fontSize: 22 }}>🏆</Text>}
                  <Text style={{ flex: 1, color: isWinner ? colors.ink : colors.white, fontFamily: fonts.bodyBold, fontSize: 20 }}>
                    {person}
                  </Text>
                  <Text style={{ color: isWinner ? colors.stageGrapeDeep : colors.whiteSoft, fontFamily: fonts.mono, fontSize: 16 }}>
                    {voteCount} {voteCount === 1 ? "Stimme" : "Stimmen"}
                  </Text>
                </View>
                <View style={{ height: 6, borderRadius: 3, backgroundColor: isWinner ? colors.surfaceSoft : colors.whiteFaint, overflow: "hidden" }}>
                  <Animated.View
                    entering={reducedMotion ? undefined : FadeIn.delay(300 + index * 100).duration(400)}
                    style={{ height: 6, width: `${pct * 100}%`, borderRadius: 3, backgroundColor: isWinner ? colors.stageGrapeDeep : colors.borderOnColor }}
                  />
                </View>
              </Animated.View>
            );
          })}
        </View>

        <Animated.View entering={reducedMotion ? undefined : FadeIn.delay(500).duration(300)} style={{ gap: 12 }}>
          <BrandButton
            label={isLastRound ? "Gesamtergebnis" : `Frage ${roundNumber + 1} von ${TOTAL_ROUNDS}`}
            onPress={goNext}
            tone="sun"
          />
          <BrandButton label="Lobby" onPress={() => router.replace({ pathname: "/lobby", params: { code } })} tone="outline" />
        </Animated.View>
      </View>
    </StageScreen>
  );
}
