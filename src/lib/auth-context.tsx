import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { PropsWithChildren } from "react";
import type { Session, User } from "@supabase/supabase-js";

import { isSupabaseConfigured, supabase } from "@/lib/supabase";
import { ensureUserBootstrap, fetchProfile, updateProfileRecord } from "@/services/supabase-data";
import type { ProfileRecord } from "@/types/supabase";

type AuthContextValue = {
  configured: boolean;
  loading: boolean;
  session: Session | null;
  user: User | null;
  profile: ProfileRecord | null;
  error: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, displayName: string, avatarUrl: string | null) => Promise<{ needsEmailConfirmation: boolean }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<ProfileRecord | null>;
  completeOnboarding: (displayName: string, avatarUrl: string | null) => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function messageFrom(error: unknown): string {
  return error instanceof Error ? error.message : "Unbekannter Supabase-Fehler";
}

export function AuthProvider({ children }: PropsWithChildren) {
  const [loading, setLoading] = useState(Boolean(supabase));
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<ProfileRecord | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadProfile = useCallback(async (nextSession: Session | null) => {
    if (!nextSession) {
      setProfile(null);
      return null;
    }
    await ensureUserBootstrap();
    const nextProfile = await fetchProfile(nextSession.user.id);
    setProfile(nextProfile);
    return nextProfile;
  }, []);

  useEffect(() => {
    if (!supabase) {
      return;
    }

    let alive = true;
    supabase.auth.getSession().then(async ({ data, error: sessionError }) => {
      if (!alive) return;
      try {
        if (sessionError) throw sessionError;
        setSession(data.session);
        await loadProfile(data.session);
      } catch (nextError) {
        setError(messageFrom(nextError));
      } finally {
        if (alive) setLoading(false);
      }
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setError(null);
      void loadProfile(nextSession).catch((nextError) => setError(messageFrom(nextError)));
    });

    return () => {
      alive = false;
      listener.subscription.unsubscribe();
    };
  }, [loadProfile]);

  const signIn = useCallback(async (email: string, password: string) => {
    if (!supabase) throw new Error("Supabase ist noch nicht konfiguriert.");
    setError(null);
    const { data, error: signInError } = await supabase.auth.signInWithPassword({ email, password });
    if (signInError) throw signInError;
    setSession(data.session);
    await loadProfile(data.session);
  }, [loadProfile]);

  const signUp = useCallback(async (email: string, password: string, displayName: string, avatarUrl: string | null) => {
    if (!supabase) throw new Error("Supabase ist noch nicht konfiguriert.");
    setError(null);
    const usernameBase = displayName.trim().toLowerCase().replace(/[^a-z0-9_]/g, "").slice(0, 20) || "spieler";
    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { display_name: displayName.trim(), username: `${usernameBase}_${Date.now().toString().slice(-5)}` } },
    });
    if (signUpError) throw signUpError;
    setSession(data.session);
    if (data.session && data.user) {
      await loadProfile(data.session);
      const nextProfile = await updateProfileRecord(data.user.id, {
        displayName,
        avatarUrl,
        onboardingCompleted: true,
        setupCompleted: true,
      });
      setProfile(nextProfile);
    }
    return { needsEmailConfirmation: !data.session };
  }, [loadProfile]);

  const signOut = useCallback(async () => {
    if (!supabase) return;
    const { error: signOutError } = await supabase.auth.signOut();
    if (signOutError) throw signOutError;
    setSession(null);
    setProfile(null);
  }, []);

  const refreshProfile = useCallback(async () => loadProfile(session), [loadProfile, session]);

  const completeOnboarding = useCallback(async (displayName: string, avatarUrl: string | null) => {
    if (!session) throw new Error("Für das Profil-Setup ist eine Anmeldung erforderlich.");
    const next = await updateProfileRecord(session.user.id, {
      displayName,
      avatarUrl,
      onboardingCompleted: true,
      setupCompleted: true,
    });
    setProfile(next);
  }, [session]);

  const value = useMemo<AuthContextValue>(() => ({
    configured: isSupabaseConfigured,
    loading,
    session,
    user: session?.user ?? null,
    profile,
    error,
    signIn,
    signUp,
    signOut,
    refreshProfile,
    completeOnboarding,
  }), [loading, session, profile, error, signIn, signUp, signOut, refreshProfile, completeOnboarding]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth muss innerhalb des AuthProvider verwendet werden.");
  return context;
}
