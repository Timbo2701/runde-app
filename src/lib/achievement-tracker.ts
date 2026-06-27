/**
 * Achievement Runtime-Tracking
 * Lokal in AsyncStorage — kein Backend, kein Game Center, kein Google Play Games.
 * Alle Werte sind gerätelokal und mock-sicher.
 */

import AsyncStorage from "@react-native-async-storage/async-storage";

export type AchievementEvent =
  | { type: "round_played"; mode: string }
  | { type: "round_won"; mode: string; totalWins: number }
  | { type: "quiz_correct" }
  | { type: "quiz_wrong" }
  | { type: "schaetz_exact" }
  | { type: "bluff_trap_caught"; votes: number }
  | { type: "klassiker_all_votes" }
  | { type: "day_played" };

// Persisted per achievement: isUnlocked + raw progress counter
export interface PersistedAchievementEntry {
  isUnlocked: boolean;
  progress: number;
}

export type AchievementState = Record<string, PersistedAchievementEntry>;

const KEYS = {
  achievementState: "@runde:achievement_state",
  quizStreak: "@runde:quiz_streak",
  modesPlayed: "@runde:modes_played",
  lastPlayDate: "@runde:last_play_date",
  streakDays: "@runde:streak_days",
} as const;

// The 4 active game modes needed for chaos_legend
const CHAOS_MODES = ["klassiker", "schaetzrunde", "blitz-quiz", "bluff"];

/**
 * Fire an achievement event.
 * Returns the IDs of achievements newly unlocked by this event.
 */
export async function trackAchievementEvent(event: AchievementEvent): Promise<string[]> {
  // Read all relevant state in one go
  const raw = await AsyncStorage.multiGet([
    KEYS.achievementState,
    KEYS.quizStreak,
    KEYS.modesPlayed,
    KEYS.lastPlayDate,
    KEYS.streakDays,
  ]);
  const map = Object.fromEntries(raw.map(([k, v]) => [k, v ?? ""]));

  const state: AchievementState = map[KEYS.achievementState]
    ? (JSON.parse(map[KEYS.achievementState]) as AchievementState)
    : {};

  const quizStreak = parseInt(map[KEYS.quizStreak] || "0", 10);
  const modesPlayed: string[] = map[KEYS.modesPlayed]
    ? (JSON.parse(map[KEYS.modesPlayed]) as string[])
    : [];
  const lastPlayDate = map[KEYS.lastPlayDate] || "";
  const streakDays = parseInt(map[KEYS.streakDays] || "1", 10);

  const newlyUnlocked: string[] = [];
  const storageUpdates: [string, string][] = [];

  // Helpers
  const isUnlocked = (id: string) => state[id]?.isUnlocked ?? false;

  const unlock = (id: string) => {
    if (!isUnlocked(id)) {
      state[id] = { isUnlocked: true, progress: state[id]?.progress ?? 1 };
      newlyUnlocked.push(id);
    }
  };

  const setProgress = (id: string, current: number, target: number) => {
    const wasUnlocked = isUnlocked(id);
    const nowUnlocked = current >= target;
    state[id] = { isUnlocked: nowUnlocked, progress: current };
    if (nowUnlocked && !wasUnlocked) {
      newlyUnlocked.push(id);
    }
  };

  // ── Process event ──────────────────────────────────────────────────

  if (event.type === "round_played") {
    // first_round: always on first play
    unlock("first_round");

    // chaos_legend: played every active mode at least once
    if (!modesPlayed.includes(event.mode)) {
      modesPlayed.push(event.mode);
      storageUpdates.push([KEYS.modesPlayed, JSON.stringify(modesPlayed)]);
    }
    if (CHAOS_MODES.every((m) => modesPlayed.includes(m))) {
      unlock("chaos_legend");
    }
  }

  if (event.type === "round_won") {
    setProgress("three_wins", Math.min(event.totalWins, 3), 3);
  }

  if (event.type === "quiz_correct") {
    const newStreak = quizStreak + 1;
    storageUpdates.push([KEYS.quizStreak, String(newStreak)]);
    setProgress("quiz_head", Math.min(newStreak, 5), 5);
  }

  if (event.type === "quiz_wrong") {
    // Reset streak but don't regress already-unlocked
    storageUpdates.push([KEYS.quizStreak, "0"]);
    if (!isUnlocked("quiz_head")) {
      state["quiz_head"] = { isUnlocked: false, progress: 0 };
    }
  }

  if (event.type === "schaetz_exact") {
    unlock("perfect_estimate");
  }

  if (event.type === "bluff_trap_caught") {
    // bluff_master: at least one other player fell into your trap
    if (event.votes >= 1) {
      unlock("bluff_master");
    }
  }

  if (event.type === "klassiker_all_votes") {
    unlock("audience_darling");
  }

  if (event.type === "day_played") {
    const today = new Date().toISOString().slice(0, 10);
    if (lastPlayDate !== today) {
      const yesterday = new Date(Date.now() - 86_400_000).toISOString().slice(0, 10);
      const newStreak = lastPlayDate === yesterday ? streakDays + 1 : 1;
      storageUpdates.push([KEYS.lastPlayDate, today]);
      storageUpdates.push([KEYS.streakDays, String(newStreak)]);
      setProgress("five_day_streak", Math.min(newStreak, 5), 5);
    }
  }

  // Always persist updated achievement state
  storageUpdates.push([KEYS.achievementState, JSON.stringify(state)]);
  await AsyncStorage.multiSet(storageUpdates);

  return newlyUnlocked;
}

/** Read the full persisted achievement state (for profile display). */
export async function getAchievementState(): Promise<AchievementState> {
  const raw = await AsyncStorage.getItem(KEYS.achievementState);
  return raw ? (JSON.parse(raw) as AchievementState) : {};
}
