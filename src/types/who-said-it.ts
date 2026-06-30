export type WhoSaidItPhase = "write" | "vote" | "reveal" | "result";

export type WhoSaidItPrompt = {
  id: string;
  text: string;
  category: string;
  difficulty: number;
};

export type WhoSaidItSubmission = {
  id: string;
  playerId: string;
  playerName: string;
  answerText: string;
  isRealAnswer: boolean;
};

export type WhoSaidItVote = {
  voterPlayerId: string;
  selectedSubmissionId: string;
};

export type WhoSaidItRound = {
  roundNumber: number;
  promptId: string;
  prompt: WhoSaidItPrompt;
  targetPlayerId: string;
  targetPlayerName: string;
  phase: WhoSaidItPhase;
  submissions: WhoSaidItSubmission[];
  votes: WhoSaidItVote[];
  scores: Record<string, number>;
};

export type WhoSaidItGameState = {
  players: { id: string; name: string; totalScore: number }[];
  rounds: WhoSaidItRound[];
  currentRoundIndex: number;
  totalRounds: number;
  prompts: WhoSaidItPrompt[];
};
