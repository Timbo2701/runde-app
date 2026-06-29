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
  correctNumber?: number,
  botTier: RankTier = "bronze"
): { correct: boolean; points: number; answerMs: number } {
  // Accuracy and speed scale with tier
  const tierConfig: Record<RankTier, { accuracy: number; minMs: number; maxMs: number }> = {
    bronze: { accuracy: 0.52, minMs: 1800, maxMs: 3500 },
    silver: { accuracy: 0.62, minMs: 1300, maxMs: 2800 },
    gold:   { accuracy: 0.70, minMs: 900,  maxMs: 2200 },
    neon:   { accuracy: 0.77, minMs: 700,  maxMs: 1700 },
    elite:  { accuracy: 0.84, minMs: 500,  maxMs: 1400 },
    legend: { accuracy: 0.90, minMs: 350,  maxMs: 1100 },
  };
  const cfg = tierConfig[botTier];
  const roll = Math.random();

  if (roundType === "speed_choice") {
    const correct = roll < cfg.accuracy;
    const answerMs = Math.floor(cfg.minMs + Math.random() * (cfg.maxMs - cfg.minMs));
    const points = correct ? (answerMs < 2000 ? 5 : answerMs < 5000 ? 4 : 3) : 0;
    return { correct, points, answerMs };
  }
  if (roundType === "bluff_tap") {
    // bluff_tap is slightly harder – use slightly reduced accuracy
    const correct = roll < cfg.accuracy * 0.85;
    const answerMs = Math.floor(cfg.minMs + Math.random() * (cfg.maxMs - cfg.minMs));
    return { correct, points: correct ? 3 : 0, answerMs };
  }
  // close_guess: accuracy affects deviation range; stronger bots guess closer
  const ref = correctNumber ?? 100;
  const maxDeviation = (1 - cfg.accuracy) * 0.8; // legend deviates ~8%, bronze ~38%
  const deviation = (Math.random() * maxDeviation * 2 - maxDeviation) * ref;
  const botAnswer = Math.round(ref + deviation);
  const points = calcCloseGuessPoints(botAnswer, ref);
  const answerMs = Math.floor(cfg.minMs + Math.random() * (cfg.maxMs - cfg.minMs));
  return { correct: points >= 3, points, answerMs };
}

export function calcCloseGuessPoints(playerAnswer: number, correct: number): number {
  if (correct === 0) return playerAnswer === 0 ? 5 : 0;
  const pct = Math.abs(playerAnswer - correct) / Math.abs(correct);
  if (pct === 0) return 5;
  if (pct <= 0.03) return 4;
  if (pct <= 0.10) return 3;
  if (pct <= 0.25) return 2;
  if (pct <= 0.50) return 1;
  return 0;
}
