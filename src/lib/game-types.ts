export type GameModeType =
  | "klassiker"
  | "schaetzrunde"
  | "blitz-quiz"
  | "bluff"
  | "zeichen-vote"
  | "reihenfolge";

export type GameModeCategory =
  | "freundschaft"
  | "wissen"
  | "kreativ"
  | "chaos"
  | "schnell"
  | "schätzen";

export type GameModeDifficulty = "easy" | "medium" | "hard";

export type RoundType =
  | "voting"       // Klassiker: Wähle eine Person
  | "estimate"     // Schätzrunde: Zahleneingabe, closest wins
  | "multiple-choice" // Blitz-Quiz: A/B/C/D
  | "bluff"        // Bluff: Fake-Antworten schreiben + voten
  | "drawing"      // Zeichen-Vote: Zeichnen + anonym voten
  | "ordering";    // Reihenfolge: Items sortieren

export interface GameModeConfig {
  id: GameModeType;
  title: string;
  shortTitle: string;
  description: string;
  hook: string;
  category: GameModeCategory;
  difficulty: GameModeDifficulty;
  recommendedPlayers: { min: number; max: number };
  estimatedMinutes: number;
  emoji: string;
  accentColor: string;
  feelTags: string[];
  isAvailable: boolean;
  isPremiumPlaceholder: boolean;
  comingSoon: boolean;
  supportedRoundTypes: RoundType[];
}

export interface RoundQuestion {
  id: string;
  modeType: GameModeType;
  roundType: RoundType;
  prompt: string;
  options?: string[];         // für multiple-choice
  correctAnswer?: string;     // für quiz/schätzen
  bluffHint?: string;         // für bluff: Hinweis zum Thema
  category: string;
}

export interface PlayerSubmission {
  playerId: string;
  playerName: string;
  roundId: string;
  answer: string;
  submittedAt: number;
}

export interface Vote {
  voterId: string;
  voterName: string;
  targetId: string;
  targetName: string;
  roundId: string;
}

export interface PlayerScore {
  playerId: string;
  playerName: string;
  points: number;
  roundsWon: number;
}

export interface ScoreResult {
  roundId: string;
  winnerId: string | null;
  winnerName: string | null;
  isTie: boolean;
  scores: PlayerScore[];
}

export interface RoundResult {
  roundNumber: number;
  question: RoundQuestion;
  submissions: PlayerSubmission[];
  votes: Vote[];
  scoreResult: ScoreResult;
}

export interface GameSession {
  roomCode: string;
  mode: GameModeType;
  totalRounds: number;
  currentRound: number;
  players: PlayerScore[];
  results: RoundResult[];
}
