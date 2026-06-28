import { router, useLocalSearchParams } from "expo-router";

import { getQuestion } from "@/data/questions";
import { colors } from "@/design/tokens";
import type { GameModeType } from "@/lib/game-types";
import { AppHeader } from "@/ui/primitives/app-header";
import { StageScreen } from "@/ui/primitives/stage-screen";

import { BluffPlay } from "./modes/bluff-play";
import { KlassikerPlay } from "./modes/klassiker-play";
import { QuizPlay } from "./modes/quiz-play";
import { SchaetzPlay } from "./modes/schaetz-play";
import { ZeichenVotePlay } from "./modes/zeichen-vote-play";

const TOTAL_ROUNDS = 5;

const stageColorForMode: Record<string, string> = {
  klassiker: colors.stageCoral,
  schaetzrunde: colors.stageCoral,
  "blitz-quiz": colors.stageGrape,
  bluff: colors.stageBerry,
  "zeichen-vote": colors.stageBerry,
};

const patternForMode: Record<string, "dots" | "rings"> = {
  klassiker: "dots",
  schaetzrunde: "dots",
  "blitz-quiz": "rings",
  bluff: "dots",
  "zeichen-vote": "rings",
};

export function PlayScreen() {
  const {
    code = "RUND24",
    round = "1",
    mode = "klassiker",
    playerWins = "0",
    botWins = "0",
  } = useLocalSearchParams<{ code?: string; round?: string; mode?: string; playerWins?: string; botWins?: string }>();

  const roundNumber = Math.min(Math.max(parseInt(round, 10) || 1, 1), TOTAL_ROUNDS);
  const modeType = mode as GameModeType;
  const question = getQuestion(modeType, roundNumber - 1);

  const stageColor = stageColorForMode[mode] ?? colors.stageCoral;
  const pattern = patternForMode[mode] ?? "dots";

  const goToResults = (params: Record<string, string>) => {
    router.replace({
      pathname: "/results",
      params: { code, round: String(roundNumber), mode, playerWins, botWins, ...params },
    });
  };

  const renderMode = () => {
    switch (modeType) {
      case "schaetzrunde":
        return (
          <SchaetzPlay
            code={code}
            roundNumber={roundNumber}
            totalRounds={TOTAL_ROUNDS}
            question={question}
            onResult={(playerGuess, botGuess) =>
              goToResults({
                playerGuess: String(playerGuess),
                botGuess: String(botGuess),
                correctAnswer: question.correctAnswer ?? "",
              })
            }
          />
        );
      case "blitz-quiz":
        return (
          <QuizPlay
            code={code}
            roundNumber={roundNumber}
            totalRounds={TOTAL_ROUNDS}
            question={question}
            onResult={(playerAnswer, botAnswer) =>
              goToResults({
                playerAnswer,
                botAnswer,
                correctAnswer: question.correctAnswer ?? "",
                options: JSON.stringify(question.options ?? []),
              })
            }
          />
        );
      case "bluff":
        return (
          <BluffPlay
            code={code}
            roundNumber={roundNumber}
            totalRounds={TOTAL_ROUNDS}
            question={question}
            onResult={(playerVote, botVote, playerFake, botFake) =>
              goToResults({
                playerVote,
                botVote,
                playerFake,
                botFake,
                correctAnswer: question.correctAnswer ?? "",
                questionPrompt: question.prompt,
              })
            }
          />
        );
      case "zeichen-vote":
        return (
          <ZeichenVotePlay
            code={code}
            roundNumber={roundNumber}
            totalRounds={TOTAL_ROUNDS}
            question={question}
            onResult={(playerVotedFor) =>
              goToResults({ playerVotedFor, promptText: question.prompt })
            }
          />
        );
      default:
        return (
          <KlassikerPlay
            code={code}
            roundNumber={roundNumber}
            totalRounds={TOTAL_ROUNDS}
            question={question.prompt}
            onResult={(playerVote, botVote) => goToResults({ playerVote, botVote })}
          />
        );
    }
  };

  return (
    <StageScreen stageColor={stageColor} pattern={pattern}>
      <AppHeader
        title={`Frage ${roundNumber} von ${TOTAL_ROUNDS}`}
        actionLabel="Lobby"
        onAction={() => router.replace({ pathname: "/lobby", params: { code } })}
      />
      {renderMode()}
    </StageScreen>
  );
}
