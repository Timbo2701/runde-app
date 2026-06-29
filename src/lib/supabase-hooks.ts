import { useCallback, useEffect, useState } from "react";

import { useAuth } from "@/lib/auth-context";
import {
  fetchBattlePass,
  fetchBattlePassRewards,
  fetchCosmeticOwnership,
  fetchLeaderboard,
  fetchMissions,
  fetchRankedBots,
  fetchRankedQuestions,
  fetchSettings,
  updateSettingsRecord,
} from "@/services/supabase-data";
import type { BattlePassReward, DailyMission, LeaderboardEntry, MindClashQuestion, RankedOpponent } from "@/types/ranked";
import type { BattlePassProgressRecord, CosmeticOwnershipRecord, PlayerSettingsRecord } from "@/types/supabase";

const EMPTY_BOTS: RankedOpponent[] = [];
const EMPTY_QUESTIONS: MindClashQuestion[] = [];
const EMPTY_LEADERBOARD: LeaderboardEntry[] = [];
const EMPTY_MISSIONS: DailyMission[] = [];
const EMPTY_REWARDS: BattlePassReward[] = [];
const DEFAULT_SETTINGS: PlayerSettingsRecord = {
  musicEnabled: true,
  soundEnabled: true,
  hapticsEnabled: true,
  animationsEnabled: true,
};
const EMPTY_COSMETICS: CosmeticOwnershipRecord = {
  ownedIds: [],
  selectedBadge: null,
  selectedTitle: null,
  selectedWinnerEffect: null,
  selectedProfileBackground: null,
  selectedCrown: null,
};

function useRemoteData<T>(load: () => Promise<T>, initialData: T, enabled: boolean) {
  const [data, setData] = useState<T>(initialData);
  const [loading, setLoading] = useState(enabled);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!enabled) {
      setData(initialData);
      setLoading(false);
      setError(null);
      return;
    }
    setLoading(true);
    try {
      setData(await load());
      setError(null);
    } catch (nextError) {
      setError(nextError instanceof Error ? nextError.message : "Daten konnten nicht geladen werden.");
    } finally {
      setLoading(false);
    }
  }, [enabled, initialData, load]);

  useEffect(() => {
    const timer = setTimeout(() => void refresh(), 0);
    return () => clearTimeout(timer);
  }, [refresh]);

  return { data, loading, error, refresh };
}

export function useRankedBots() {
  const { session } = useAuth();
  const load = useCallback(() => fetchRankedBots(), []);
  return useRemoteData(load, EMPTY_BOTS, Boolean(session));
}

export function useRankedQuestions() {
  const { session } = useAuth();
  const load = useCallback(() => fetchRankedQuestions(), []);
  return useRemoteData(load, EMPTY_QUESTIONS, Boolean(session));
}

export function useLeaderboard() {
  const { session } = useAuth();
  const userId = session?.user.id;
  const load = useCallback(() => fetchLeaderboard(userId), [userId]);
  return useRemoteData(load, EMPTY_LEADERBOARD, Boolean(session));
}

export function useMissions() {
  const { session } = useAuth();
  const userId = session?.user.id;
  const load = useCallback(async (): Promise<DailyMission[]> => {
    if (!userId) return EMPTY_MISSIONS;
    const records = await fetchMissions(userId);
    return records.map((record) => ({
      id: record.slug,
      label: record.title,
      description: record.description,
      emoji: record.icon,
      current: record.progress,
      target: record.targetValue,
      xpReward: record.rewardXp,
      completed: record.completed,
    }));
  }, [userId]);
  return useRemoteData(load, EMPTY_MISSIONS, Boolean(session));
}

export function useBattlePass() {
  const { session } = useAuth();
  const userId = session?.user.id;
  const load = useCallback(async (): Promise<BattlePassProgressRecord | null> => (
    userId ? fetchBattlePass(userId) : null
  ), [userId]);
  return useRemoteData<BattlePassProgressRecord | null>(load, null, Boolean(session));
}

export function useBattlePassRewards() {
  const { session } = useAuth();
  const load = useCallback(() => fetchBattlePassRewards(), []);
  return useRemoteData(load, EMPTY_REWARDS, Boolean(session));
}

export function usePlayerSettings() {
  const { session } = useAuth();
  const userId = session?.user.id;
  const load = useCallback(async () => {
    if (!userId) return DEFAULT_SETTINGS;
    const settings = await fetchSettings(userId);
    if (!settings) throw new Error("Einstellungen fehlen in der Datenbank.");
    return settings;
  }, [userId]);
  const remote = useRemoteData(load, DEFAULT_SETTINGS, Boolean(session));
  const save = useCallback(async (settings: PlayerSettingsRecord) => {
    if (!userId) throw new Error("Zum Speichern ist eine Anmeldung erforderlich.");
    await updateSettingsRecord(userId, settings);
  }, [userId]);
  return { ...remote, save };
}

export function useCosmetics() {
  const { session } = useAuth();
  const userId = session?.user.id;
  const load = useCallback(async () => (userId ? fetchCosmeticOwnership(userId) : EMPTY_COSMETICS), [userId]);
  return useRemoteData(load, EMPTY_COSMETICS, Boolean(session));
}
