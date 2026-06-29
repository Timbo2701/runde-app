import { createContext, useCallback, useContext, useEffect, useState } from "react";
import type { PropsWithChildren } from "react";
import { View } from "react-native";

import { colors } from "@/design/tokens";
import { useAuth } from "@/lib/auth-context";
import { fetchRankedProfile, submitRankedMatchResult } from "@/services/supabase-data";
import type { RankedMatchSubmission } from "@/services/supabase-data";
import type { MatchResult, RankedProfile } from "@/types/ranked";

const EMPTY_RANKED_PROFILE: RankedProfile = {
  tier: "bronze",
  division: 3,
  lp: 0,
  seasonPoints: 0,
  wins: 0,
  losses: 0,
  winStreak: 0,
  bestWinStreak: 0,
  globalRank: 0,
  mmr: 1000,
  seasonName: "",
  battlePassLevel: 1,
  battlePassXp: 0,
  dailyMissionsCompleted: 0,
  totalMissions: 0,
};

type RankedContextValue = {
  rankedProfile: RankedProfile;
  applyMatchResult: (result: MatchResult) => Promise<RankedMatchSubmission>;
  refresh: () => Promise<void>;
  loaded: boolean;
  error: string | null;
};

const RankedContext = createContext<RankedContextValue>({
  rankedProfile: EMPTY_RANKED_PROFILE,
  applyMatchResult: async () => ({ profile: EMPTY_RANKED_PROFILE, lpDelta: 0 }),
  refresh: async () => {},
  loaded: false,
  error: null,
});

export function RankedProvider({ children }: PropsWithChildren) {
  const { session, loading: authLoading } = useAuth();
  const [profile, setProfile] = useState<RankedProfile>(EMPTY_RANKED_PROFILE);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!session) {
      setProfile(EMPTY_RANKED_PROFILE);
      setLoaded(!authLoading);
      setError(null);
      return;
    }
    setLoaded(false);
    try {
      const remote = await fetchRankedProfile(session.user.id);
      if (!remote) throw new Error("Ranked-Profil fehlt in der Datenbank.");
      setProfile(remote);
      setError(null);
    } catch (nextError) {
      setError(nextError instanceof Error ? nextError.message : "Ranked-Profil konnte nicht geladen werden.");
    } finally {
      setLoaded(true);
    }
  }, [authLoading, session]);

  useEffect(() => {
    const timer = setTimeout(() => void refresh(), 0);
    return () => clearTimeout(timer);
  }, [refresh]);

  const applyMatchResult = useCallback(async (result: MatchResult) => {
    if (!session) throw new Error("Für Ranked ist eine Anmeldung erforderlich.");
    const remote = await submitRankedMatchResult(result);
    const refreshed = await fetchRankedProfile(session.user.id);
    const nextProfile = refreshed ?? remote.profile;
    setProfile(nextProfile);
    setError(null);
    return { ...remote, profile: nextProfile };
  }, [session]);

  if (!loaded) return <View style={{ flex: 1, backgroundColor: colors.stageGrapeDeep }} />;

  return (
    <RankedContext.Provider value={{ rankedProfile: profile, applyMatchResult, refresh, loaded, error }}>
      {children}
    </RankedContext.Provider>
  );
}

export function useRanked() {
  return useContext(RankedContext);
}

export const useRankedProfile = useRanked;
