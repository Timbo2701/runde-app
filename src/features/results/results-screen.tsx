import { router, useLocalSearchParams } from "expo-router";

import { colors } from "@/design/tokens";
import { AppHeader } from "@/ui/primitives/app-header";
import { StageScreen } from "@/ui/primitives/stage-screen";

import { BluffResult } from "./modes/bluff-result";
import { KlassikerResult } from "./modes/klassiker-result";
import { QuizResult } from "./modes/quiz-result";
import { SchaetzResult } from "./modes/schaetz-result";
import { ZeichenVoteResult } from "./modes/zeichen-vote-result";

const TOTAL_ROUNDS = 5;

export function ResultsScreen() {
  const params = useLocalSearchParams<Record<string, string>>();
  const { code = "RUND24", round = "1", mode = "klassiker" } = params;

  const roundNumber = parseInt(round, 10) || 1;
  const isLastRound = roundNumber >= TOTAL_ROUNDS;

  const goNext = () => {
    if (isLastRound) {
      router.replace({ pathname: "/final", params: { code } });
    } else {
      router.replace({
        pathname: "/play",
        params: { code, round: String(roundNumber + 1), mode },
      });
    }
  };

  const sharedProps = {
    params,
    onNext: goNext,
    isLastRound,
    roundNumber,
    totalRounds: TOTAL_ROUNDS,
    code,
  };

  const stageColor = mode === "bluff"
    ? colors.stageGrapeDeep
    : mode === "schaetzrunde"
    ? colors.stageGrape
    : mode === "blitz-quiz"
    ? colors.stageBerry
    : mode === "zeichen-vote"
    ? colors.stageBerry
    : colors.stageGrape;

  const pattern: "dots" | "rings" = mode === "blitz-quiz" ? "dots" : "rings";

  const renderMode = () => {
    switch (mode) {
      case "schaetzrunde":
        return <SchaetzResult {...sharedProps} />;
      case "blitz-quiz":
        return <QuizResult {...sharedProps} />;
      case "bluff":
        return <BluffResult {...sharedProps} />;
      case "zeichen-vote":
        return <ZeichenVoteResult {...sharedProps} />;
      default:
        return <KlassikerResult {...sharedProps} />;
    }
  };

  return (
    <StageScreen stageColor={stageColor} pattern={pattern}>
      <AppHeader
        title={`Frage ${roundNumber} von ${TOTAL_ROUNDS}`}
        actionLabel="Verlassen"
        onAction={() => router.replace("/")}
      />
      {renderMode()}
    </StageScreen>
  );
}
