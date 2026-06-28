import type { MindClashRoundType, RankDivision, RankTier, RankedProfile } from "@/types/ranked";

export const RANK_CONFIG: Record<RankTier, { label: string; color: string; glowColor: string; emoji: string }> = {
  bronze: { label: "Bronze",  color: "#CD7F32", glowColor: "#FF8C00", emoji: "🥉" },
  silver: { label: "Silber",  color: "#C0C0C0", glowColor: "#E8E8E8", emoji: "🥈" },
  gold:   { label: "Gold",    color: "#FFD700", glowColor: "#FFE44D", emoji: "🥇" },
  neon:   { label: "Neon",    color: "#A855F7", glowColor: "#C084FC", emoji: "⚡" },
  elite:  { label: "Elite",   color: "#F0446E", glowColor: "#FF6B8A", emoji: "💎" },
  legend: { label: "Legend",  color: "#FFD84D", glowColor: "#FFE87A", emoji: "👑" },
};

const TIER_ORDER: RankTier[] = ["bronze", "silver", "gold", "neon", "elite", "legend"];

export function getTierLabel(tier: RankTier): string {
  return RANK_CONFIG[tier].label;
}

export function getDivisionLabel(division: RankDivision): string {
  return ["I", "II", "III"][division - 1];
}

export function getFullRankLabel(tier: RankTier, division: RankDivision): string {
  if (tier === "legend") return "Legend";
  return `${getTierLabel(tier)} ${getDivisionLabel(division)}`;
}

// LP is 0–599 total, split into 3 divisions of 200 LP each
// Division 3 = 0–199, Division 2 = 200–399, Division 1 = 400–599
export function getCurrentDivisionFromLp(lp: number): RankDivision {
  if (lp >= 400) return 1;
  if (lp >= 200) return 2;
  return 3;
}

export function getLpWithinDivision(lp: number): number {
  return lp % 200;
}

export function getLpProgress(lp: number): number {
  return (lp % 200) / 200;
}

export function calculateLpDelta(
  won: boolean,
  winStreak: number
): { lpDelta: number; streakBonus: number } {
  const streakBonus = winStreak >= 3 ? 5 : 0;
  if (won) {
    const base = 25 + Math.floor(Math.random() * 11); // 25–35
    return { lpDelta: base + streakBonus, streakBonus };
  }
  const loss = -(15 + Math.floor(Math.random() * 11)); // -15 to -25
  return { lpDelta: loss, streakBonus: 0 };
}

export function applyLpChange(
  profile: RankedProfile,
  lpDelta: number
): { tier: RankTier; division: RankDivision; lp: number; rankUp: boolean; oldTier: RankTier; oldDivision: RankDivision } {
  const oldTier = profile.tier;
  const oldDivision = profile.division;

  let totalLp = getTotalLp(profile.tier, profile.lp) + lpDelta;
  totalLp = Math.max(0, totalLp);

  const { tier, lp } = fromTotalLp(totalLp);
  const division = getCurrentDivisionFromLp(lp);

  const rankUp = TIER_ORDER.indexOf(tier) > TIER_ORDER.indexOf(oldTier);

  return { tier, division, lp, rankUp, oldTier, oldDivision };
}

function getTotalLp(tier: RankTier, lp: number): number {
  return TIER_ORDER.indexOf(tier) * 600 + lp;
}

function fromTotalLp(totalLp: number): { tier: RankTier; lp: number } {
  const maxTotal = (TIER_ORDER.length - 1) * 600 + 599;
  const clamped = Math.min(totalLp, maxTotal);
  const tierIndex = Math.min(Math.floor(clamped / 600), TIER_ORDER.length - 1);
  return { tier: TIER_ORDER[tierIndex], lp: clamped - tierIndex * 600 };
}

export function getWinrate(wins: number, losses: number): number {
  if (wins + losses === 0) return 0;
  return Math.round((wins / (wins + losses)) * 100);
}

export function getBotResult(
  roundType: MindClashRoundType,
  correctNumber?: number
): { correct: boolean; points: number; answerMs: number } {
  const roll = Math.random();
  const answerMs = Math.floor(Math.random() * 6000) + 2000;

  if (roundType === "speed_choice") {
    const correct = roll < 0.65;
    return { correct, points: correct ? 2 : 0, answerMs };
  }
  if (roundType === "bluff_tap") {
    const correct = roll < 0.55;
    return { correct, points: correct ? 2 : 0, answerMs };
  }
  // close_guess
  const ref = correctNumber ?? 100;
  const deviation = (Math.random() * 0.4 - 0.2) * ref; // ±20%
  const botAnswer = Math.round(ref + deviation);
  const pctOff = Math.abs(botAnswer - ref) / ref;
  let points = 0;
  if (pctOff <= 0.1) points = 3;
  else if (pctOff <= 0.25) points = 2;
  else if (pctOff <= 0.5) points = 1;
  return { correct: pctOff <= 0.1, points, answerMs };
}

export function calcCloseGuessPoints(playerAnswer: number, correct: number): number {
  const pct = Math.abs(playerAnswer - correct) / correct;
  if (pct <= 0.05) return 3;
  if (pct <= 0.15) return 2;
  if (pct <= 0.3) return 1;
  return 0;
}
