import { createContext, useCallback, useContext, useEffect, useState } from "react";
import type { PropsWithChildren } from "react";
import { View } from "react-native";

import { colors } from "@/design/tokens";
import { useAuth } from "@/lib/auth-context";
import {
  fetchCosmeticOwnership,
  fetchPlayerStats,
  grantCosmetics,
  saveSelectedCosmetics,
  updatePlayerStatsRecord,
  updateProfileRecord,
} from "@/services/supabase-data";

type ProfileState = {
  name: string;
  photo: string | null;
  email: string;
  roundsPlayed: number;
  wins: number;
  losses: number;
  favoriteMode: string | null;
  bestCategory: string | null;
  selectedBadge: string | null;
  selectedTitle: string | null;
  selectedWinnerEffect: string | null;
  ownedCosmetics: string[];
};

type ProfileContextValue = ProfileState & {
  setProfile: (update: Partial<ProfileState>) => Promise<void>;
  addOwnedCosmetics: (ids: string[], source?: "mock" | "achievement") => Promise<void>;
  refresh: () => Promise<void>;
  loaded: boolean;
  error: string | null;
};

const EMPTY_PROFILE: ProfileState = {
  name: "",
  photo: null,
  email: "",
  roundsPlayed: 0,
  wins: 0,
  losses: 0,
  favoriteMode: null,
  bestCategory: null,
  selectedBadge: null,
  selectedTitle: null,
  selectedWinnerEffect: null,
  ownedCosmetics: [],
};

const ProfileContext = createContext<ProfileContextValue>({
  ...EMPTY_PROFILE,
  loaded: false,
  error: null,
  setProfile: async () => {},
  addOwnedCosmetics: async () => {},
  refresh: async () => {},
});

export function ProfileProvider({ children }: PropsWithChildren) {
  const { session, loading: authLoading, refreshProfile } = useAuth();
  const [state, setState] = useState<ProfileState>(EMPTY_PROFILE);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!session) {
      setState(EMPTY_PROFILE);
      setLoaded(!authLoading);
      setError(null);
      return;
    }

    setLoaded(false);
    try {
      const [remoteProfile, stats, cosmetics] = await Promise.all([
        refreshProfile(),
        fetchPlayerStats(session.user.id),
        fetchCosmeticOwnership(session.user.id),
      ]);
      if (!remoteProfile) throw new Error("Profil fehlt in der Datenbank.");
      setState({
        name: remoteProfile.displayName,
        photo: remoteProfile.avatarUrl,
        email: session.user.email ?? "",
        roundsPlayed: stats.roundsPlayed,
        wins: stats.wins,
        losses: stats.losses,
        favoriteMode: stats.favoriteMode,
        bestCategory: stats.bestCategory,
        selectedBadge: cosmetics.selectedBadge,
        selectedTitle: cosmetics.selectedTitle,
        selectedWinnerEffect: cosmetics.selectedWinnerEffect,
        ownedCosmetics: cosmetics.ownedIds,
      });
      setError(null);
    } catch (nextError) {
      setError(nextError instanceof Error ? nextError.message : "Profildaten konnten nicht geladen werden.");
    } finally {
      setLoaded(true);
    }
  }, [authLoading, refreshProfile, session]);

  useEffect(() => {
    const timer = setTimeout(() => void refresh(), 0);
    return () => clearTimeout(timer);
  }, [refresh]);

  const setProfile = useCallback(async (update: Partial<ProfileState>) => {
    if (!session) throw new Error("Zum Speichern ist eine Anmeldung erforderlich.");
    const next = { ...state, ...update };

    const identityChanged = update.name !== undefined || update.photo !== undefined;
    if (identityChanged) {
      await updateProfileRecord(session.user.id, {
        displayName: next.name,
        avatarUrl: next.photo,
      });
    }
    if (update.selectedBadge !== undefined || update.selectedTitle !== undefined || update.selectedWinnerEffect !== undefined) {
      await saveSelectedCosmetics(session.user.id, {
        badge: next.selectedBadge,
        title: next.selectedTitle,
        winnerEffect: next.selectedWinnerEffect,
      });
    }
    if (
      update.roundsPlayed !== undefined || update.wins !== undefined || update.losses !== undefined ||
      update.favoriteMode !== undefined || update.bestCategory !== undefined
    ) {
      await updatePlayerStatsRecord(session.user.id, {
        roundsPlayed: next.roundsPlayed,
        wins: next.wins,
        losses: next.losses,
        favoriteMode: next.favoriteMode,
        bestCategory: next.bestCategory,
      });
    }

    setState(next);
    setError(null);
  }, [session, state]);

  const addOwnedCosmetics = useCallback(async (ids: string[], source: "mock" | "achievement" = "mock") => {
    if (!session) throw new Error("Zum Freischalten ist eine Anmeldung erforderlich.");
    await grantCosmetics(session.user.id, ids, source);
    const cosmetics = await fetchCosmeticOwnership(session.user.id);
    setState((current) => ({
      ...current,
      ownedCosmetics: cosmetics.ownedIds,
      selectedBadge: cosmetics.selectedBadge,
      selectedTitle: cosmetics.selectedTitle,
      selectedWinnerEffect: cosmetics.selectedWinnerEffect,
    }));
  }, [session]);

  if (!loaded) return <View style={{ flex: 1, backgroundColor: colors.stageBerry }} />;

  return (
    <ProfileContext.Provider value={{ ...state, loaded, error, setProfile, addOwnedCosmetics, refresh }}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  return useContext(ProfileContext);
}
