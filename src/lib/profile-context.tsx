import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useCallback, useContext, useEffect, useState } from "react";
import type { PropsWithChildren } from "react";

type ProfileState = {
  name: string;
  photo: string | null;
  email: string;
  // Stats (lokal/mock)
  roundsPlayed: number;
  wins: number;
  // Kosmetik (mock — keine echte Payment-Abhängigkeit)
  selectedBadge: string | null;
  selectedTitle: string | null;
  selectedWinnerEffect: string | null;
  ownedCosmetics: string[];
};

type ProfileContextValue = ProfileState & {
  setProfile: (update: Partial<ProfileState>) => Promise<void>;
  loaded: boolean;
};

const ProfileContext = createContext<ProfileContextValue>({
  name: "",
  photo: null,
  email: "",
  roundsPlayed: 0,
  wins: 0,
  selectedBadge: null,
  selectedTitle: null,
  selectedWinnerEffect: null,
  ownedCosmetics: [],
  loaded: false,
  setProfile: async () => {},
});

const KEYS = [
  "@runde:profile_name",
  "@runde:profile_photo",
  "@runde:profile_email",
  "@runde:rounds_played",
  "@runde:wins",
  "@runde:selected_badge",
  "@runde:selected_title",
  "@runde:selected_winner_effect",
  "@runde:owned_cosmetics",
] as const;

export function ProfileProvider({ children }: PropsWithChildren) {
  const [state, setState] = useState<ProfileState>({
    name: "",
    photo: null,
    email: "",
    roundsPlayed: 0,
    wins: 0,
    selectedBadge: null,
    selectedTitle: null,
    selectedWinnerEffect: null,
    ownedCosmetics: [],
  });
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    AsyncStorage.multiGet([...KEYS]).then((pairs) => {
      const map = Object.fromEntries(pairs.map(([k, v]) => [k, v ?? ""]));
      setState({
        name: map["@runde:profile_name"] || "",
        photo: map["@runde:profile_photo"] || null,
        email: map["@runde:profile_email"] || "",
        roundsPlayed: parseInt(map["@runde:rounds_played"] || "0", 10),
        wins: parseInt(map["@runde:wins"] || "0", 10),
        selectedBadge: map["@runde:selected_badge"] || null,
        selectedTitle: map["@runde:selected_title"] || null,
        selectedWinnerEffect: map["@runde:selected_winner_effect"] || null,
        ownedCosmetics: map["@runde:owned_cosmetics"]
          ? (JSON.parse(map["@runde:owned_cosmetics"]) as string[])
          : [],
      });
      setLoaded(true);
    });
  }, []);

  const setProfile = useCallback(
    async (update: Partial<ProfileState>) => {
      const next = { ...state, ...update };
      setState(next);
      await AsyncStorage.multiSet([
        ["@runde:profile_name", next.name],
        ["@runde:profile_photo", next.photo ?? ""],
        ["@runde:profile_email", next.email],
        ["@runde:rounds_played", String(next.roundsPlayed)],
        ["@runde:wins", String(next.wins)],
        ["@runde:selected_badge", next.selectedBadge ?? ""],
        ["@runde:selected_title", next.selectedTitle ?? ""],
        ["@runde:selected_winner_effect", next.selectedWinnerEffect ?? ""],
        ["@runde:owned_cosmetics", JSON.stringify(next.ownedCosmetics)],
      ]);
    },
    [state]
  );

  return (
    <ProfileContext.Provider value={{ ...state, loaded, setProfile }}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  return useContext(ProfileContext);
}
