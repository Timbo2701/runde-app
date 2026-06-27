import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useCallback, useContext, useEffect, useState } from "react";
import type { PropsWithChildren } from "react";

type ProfileState = {
  name: string;
  photo: string | null;
  email: string;
};

type ProfileContextValue = ProfileState & {
  setProfile: (update: Partial<ProfileState>) => Promise<void>;
  loaded: boolean;
};

const ProfileContext = createContext<ProfileContextValue>({
  name: "",
  photo: null,
  email: "",
  loaded: false,
  setProfile: async () => {},
});

export function ProfileProvider({ children }: PropsWithChildren) {
  const [state, setState] = useState<ProfileState>({ name: "", photo: null, email: "" });
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    AsyncStorage.multiGet(["@runde:profile_name", "@runde:profile_photo", "@runde:profile_email"]).then(
      (pairs) => {
        const map = Object.fromEntries(pairs.map(([k, v]) => [k, v ?? ""]));
        setState({
          name: map["@runde:profile_name"] || "",
          photo: map["@runde:profile_photo"] || null,
          email: map["@runde:profile_email"] || "",
        });
        setLoaded(true);
      }
    );
  }, []);

  const setProfile = useCallback(async (update: Partial<ProfileState>) => {
    const next = { ...state, ...update };
    setState(next);
    await AsyncStorage.multiSet([
      ["@runde:profile_name", next.name],
      ["@runde:profile_photo", next.photo ?? ""],
      ["@runde:profile_email", next.email],
    ]);
  }, [state]);

  return (
    <ProfileContext.Provider value={{ ...state, loaded, setProfile }}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  return useContext(ProfileContext);
}
