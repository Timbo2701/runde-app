// Battle Pass level/XP math.
//
// IMPORTANT: `xp` stored in `user_battle_pass_progress.xp` (and therefore
// `RankedProfile.battlePassXp`) is the LIFETIME CUMULATIVE XP for the season,
// not the XP within the current level. The server (see the
// `submit_ranked_match_result` Postgres function) computes:
//
//   level = min(maxLevel, 1 + floor(totalXp / XP_PER_LEVEL))
//
// with XP_PER_LEVEL = 1000. Any UI that renders "currentXp / maxXp" MUST use
// this module to convert the raw cumulative value into level-relative XP.
// Rendering `battlePassXp` directly (e.g. "5840 / 1000 XP") is the bug that
// was reported by users ("zeigt 4000/1000 XP") — fixed by routing every
// consumer through `calculateBattlePassLevel`.

export const BATTLE_PASS_XP_PER_LEVEL = 1000;
export const BATTLE_PASS_DEFAULT_MAX_LEVEL = 50;

export interface BattlePassLevelInfo {
  /** Current level, clamped to [1, maxLevel]. */
  level: number;
  /** XP earned within the current level (0..xpForNextLevel). */
  currentLevelXp: number;
  /** XP required to go from the current level to the next one. */
  xpForNextLevel: number;
  /** currentLevelXp / xpForNextLevel, clamped to [0, 1]. At max level this is 1. */
  progressPercent: number;
  /** True once the player has hit maxLevel (progress bar should read full/maxed). */
  isMaxLevel: boolean;
  /** The raw lifetime XP total that was passed in, for convenience. */
  totalXp: number;
}

/**
 * Derive level, in-level XP, and progress percent from a cumulative total XP
 * value. Mirrors the server-side formula exactly so the client never shows a
 * different level than what's persisted in `user_battle_pass_progress`.
 */
export function calculateBattlePassLevel(
  totalXp: number,
  options?: { xpPerLevel?: number; maxLevel?: number }
): BattlePassLevelInfo {
  const xpPerLevel = options?.xpPerLevel ?? BATTLE_PASS_XP_PER_LEVEL;
  const maxLevel = options?.maxLevel ?? BATTLE_PASS_DEFAULT_MAX_LEVEL;

  const safeTotalXp = Math.max(0, Math.floor(totalXp || 0));

  const rawLevel = 1 + Math.floor(safeTotalXp / xpPerLevel);
  const isMaxLevel = rawLevel >= maxLevel;
  const level = Math.min(maxLevel, rawLevel);

  if (isMaxLevel) {
    return {
      level: maxLevel,
      currentLevelXp: xpPerLevel,
      xpForNextLevel: xpPerLevel,
      progressPercent: 1,
      isMaxLevel: true,
      totalXp: safeTotalXp,
    };
  }

  const currentLevelXp = safeTotalXp % xpPerLevel;
  const progressPercent = xpPerLevel === 0 ? 0 : Math.min(1, Math.max(0, currentLevelXp / xpPerLevel));

  return {
    level,
    currentLevelXp,
    xpForNextLevel: xpPerLevel,
    progressPercent,
    isMaxLevel: false,
    totalXp: safeTotalXp,
  };
}
