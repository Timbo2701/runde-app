export type RankTier = "bronze" | "silver" | "gold" | "neon" | "elite" | "legend";
export type RankDivision = 1 | 2 | 3;
export type MindClashRoundType = "speed_choice" | "close_guess" | "bluff_tap";

export interface RankedProfile {
  tier: RankTier;
  division: RankDivision;
  lp: number;
  seasonPoints: number;
  wins: number;
  losses: number;
  winStreak: number;
  bestWinStreak: number;
  globalRank: number;
  mmr: number;
  seasonName: string;
  battlePassLevel: number;
  battlePassXp: number;
  dailyMissionsCompleted: number;
  totalMissions: number;
}

export interface RankedOpponent {
  id: string;
  name: string;
  tier: RankTier;
  division: RankDivision;
  winrate: number;
  avatarEmoji: string;
}

export interface MindClashQuestion {
  id: string;
  roundType: MindClashRoundType;
  prompt: string;
  // speed_choice
  options?: string[];
  correctOption?: number;
  // close_guess
  correctNumber?: number;
  unit?: string;
  hint?: string;
  // bluff_tap
  statements?: string[];
  realStatementIndex?: number;
}

export interface MatchRoundResult {
  roundType: MindClashRoundType;
  playerPoints: number;
  botPoints: number;
  playerAnswerMs: number;
  playerCorrect: boolean;
  botCorrect: boolean;
}

export interface MatchResult {
  submissionId: string;
  rounds: MatchRoundResult[];
  playerTotalPoints: number;
  botTotalPoints: number;
  won: boolean;
  lpDelta: number;
  streakBonus: number;
  isMvp: boolean;
  opponent: RankedOpponent;
  newLp: number;
  oldLp: number;
  oldTier: RankTier;
  oldDivision: RankDivision;
  rankUp: boolean;
}

export interface LeaderboardEntry {
  rank: number;
  name: string;
  tier: RankTier;
  division: RankDivision;
  lp: number;
  winrate: number;
  avatarEmoji: string;
  isPlayer?: boolean;
}

export interface BattlePassReward {
  level: number;
  free: { emoji: string; label: string; type: string };
  premium?: { emoji: string; label: string; type: string };
}

export interface DailyMission {
  id: string;
  label: string;
  description: string;
  emoji: string;
  current: number;
  target: number;
  xpReward: number;
  completed: boolean;
}
