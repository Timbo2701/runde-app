import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useCallback, useContext, useEffect, useState } from "react";
import type { PropsWithChildren } from "react";

import type { MatchResult, RankedProfile } from "@/types/ranked";
import { applyLpChange } from "@/lib/ranked-logic";

const DEFAULT_RANKED: RankedProfile = {
  tier: "silver",
  division: 2,
  lp: 280,
  seasonPoints: 1240,
  wins: 14,
  losses: 9,
  winStreak: 2,
  bestWinStreak: 4,
  globalRank: 12481,
  mmr: 1420,
  seasonName: "Neon Season 1",
  battlePassLevel: 7,
  battlePassXp: 340,
  dailyMissionsCompleted: 1,
  totalMissions: 3,
};

type RankedContextValue = {
  rankedProfile: RankedProfile;
  updateRankedProfile: (update: Partial<RankedProfile>) => Promise<void>;
  applyMatchResult: (result: MatchResult) => Promise<void>;
  loaded: boolean;
};

const RankedContext = createContext<RankedContextValue>({
  rankedProfile: DEFAULT_RANKED,
  updateRankedProfile: async () => {},
  applyMatchResult: async () => {},
  loaded: false,
});

const STORAGE_KEY = "@runde:ranked_profile";

export function RankedProvider({ children }: PropsWithChildren) {
  const [profile, setProfile] = useState<RankedProfile>(DEFAULT_RANKED);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((raw) => {
      if (raw) {
        try {
          setProfile({ ...DEFAULT_RANKED, ...(JSON.parse(raw) as Partial<RankedProfile>) });
        } catch {
          // ignore corrupt data
        }
      }
      setLoaded(true);
    });
  }, []);

  const persist = useCallback(async (next: RankedProfile) => {
    setProfile(next);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }, []);

  const updateRankedProfile = useCallback(
    async (update: Partial<RankedProfile>) => {
      await persist({ ...profile, ...update });
    },
    [profile, persist]
  );

  const applyMatchResult = useCallback(
    async (result: MatchResult) => {
      const lpChanges = applyLpChange(profile, result.lpDelta);
      const newStreak = result.won ? profile.winStreak + 1 : 0;
      const next: RankedProfile = {
        ...profile,
        tier: lpChanges.tier,
        division: lpChanges.division,
        lp: lpChanges.lp,
        wins: result.won ? profile.wins + 1 : profile.wins,
        losses: result.won ? profile.losses : profile.losses + 1,
        winStreak: newStreak,
        bestWinStreak: Math.max(profile.bestWinStreak, newStreak),
        seasonPoints: profile.seasonPoints + (result.won ? 150 : 50),
        battlePassXp: (profile.battlePassXp + (result.won ? 240 : 80)) % 1000,
        battlePassLevel: profile.battlePassXp + (result.won ? 240 : 80) >= 1000
          ? profile.battlePassLevel + 1
          : profile.battlePassLevel,
        mmr: profile.mmr + (result.won ? 20 : -15),
      };
      await persist(next);
    },
    [profile, persist]
  );

  return (
    <RankedContext.Provider value={{ rankedProfile: profile, updateRankedProfile, applyMatchResult, loaded }}>
      {children}
    </RankedContext.Provider>
  );
}

export function useRanked() {
  return useContext(RankedContext);
}
