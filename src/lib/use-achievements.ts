import { useCallback, useEffect, useRef, useState } from "react";

import { COSMETICS } from "@/data/cosmetics";
import type { Achievement } from "@/types/achievements";
import type { AchievementEvent } from "./achievement-tracker";
import { useProfile } from "./profile-context";
import { useAuth } from "./auth-context";
import { fetchAchievements, trackAchievementEventRemote } from "@/services/supabase-data";

/**
 * Returns live achievement list (merged with persisted state).
 * Refreshes automatically after tracking events.
 */
export function useAchievements() {
  const { session } = useAuth();
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(Boolean(session));
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (session) {
      setLoading(true);
      try {
      const records = await fetchAchievements(session.user.id);
      setAchievements(records.map((record) => ({
        id: record.slug,
        title: record.title,
        description: record.description,
        emoji: record.icon,
        category: record.category as Achievement["category"],
        isUnlocked: record.unlocked,
        progress: { current: record.progress, target: record.targetValue },
        xp: 0,
      })));
        setError(null);
      } catch (nextError) {
        setError(nextError instanceof Error ? nextError.message : "Achievements konnten nicht geladen werden.");
      } finally {
        setLoading(false);
      }
      return;
    }
    setAchievements([]);
    setLoading(false);
    setError(null);
  }, [session]);

  useEffect(() => {
    const timer = setTimeout(() => void refresh(), 0);
    return () => clearTimeout(timer);
  }, [refresh]);

  return { achievements, loading, error, refresh };
}

/**
 * Fire an achievement event exactly once on mount.
 * Returns IDs of newly unlocked achievements (empty until resolved).
 * Also auto-unlocks any cosmetics tied to those achievements.
 */
export function useTrackEvent(event: AchievementEvent | null) {
  const [newlyUnlocked, setNewlyUnlocked] = useState<string[]>([]);
  const firedRef = useRef(false);
  const { addOwnedCosmetics } = useProfile();
  const { session } = useAuth();

  useEffect(() => {
    if (!event || firedRef.current) return;
    firedRef.current = true;
    if (!session) return;
    trackAchievementEventRemote(event as unknown as Record<string, unknown>).then((ids) => {
      setNewlyUnlocked(ids);
      if (ids.length > 0) {
        const cosmeticIds = COSMETICS
          .filter((c) => c.achievementId && ids.includes(c.achievementId))
          .map((c) => c.id);
        if (cosmeticIds.length > 0) {
          void addOwnedCosmetics(cosmeticIds, "achievement");
        }
      }
    });
  }, [event, session, addOwnedCosmetics]);

  return newlyUnlocked;
}
