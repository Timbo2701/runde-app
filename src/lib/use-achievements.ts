import { useCallback, useEffect, useRef, useState } from "react";

import { ACHIEVEMENTS } from "@/data/achievements";
import { COSMETICS } from "@/data/cosmetics";
import type { Achievement } from "@/types/achievements";
import {
  type AchievementEvent,
  type AchievementState,
  getAchievementState,
  trackAchievementEvent,
} from "./achievement-tracker";
import { useProfile } from "./profile-context";

/** Merge static achievement definitions with persisted runtime state. */
function mergeAchievements(
  staticList: Achievement[],
  state: AchievementState
): Achievement[] {
  return staticList.map((a) => {
    const persisted = state[a.id];
    if (!persisted) return a;
    return {
      ...a,
      isUnlocked: persisted.isUnlocked,
      progress: a.progress
        ? { ...a.progress, current: persisted.progress }
        : undefined,
    };
  });
}

/**
 * Returns live achievement list (merged with persisted state).
 * Refreshes automatically after tracking events.
 */
export function useAchievements() {
  const [achievements, setAchievements] = useState<Achievement[]>(ACHIEVEMENTS);

  const refresh = useCallback(async () => {
    const state = await getAchievementState();
    setAchievements(mergeAchievements(ACHIEVEMENTS, state));
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return { achievements, refresh };
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

  useEffect(() => {
    if (!event || firedRef.current) return;
    firedRef.current = true;
    trackAchievementEvent(event).then((ids) => {
      setNewlyUnlocked(ids);
      if (ids.length > 0) {
        const cosmeticIds = COSMETICS
          .filter((c) => c.achievementId && ids.includes(c.achievementId))
          .map((c) => c.id);
        if (cosmeticIds.length > 0) {
          void addOwnedCosmetics(cosmeticIds);
        }
      }
    });
  }, []); // intentionally empty — fire once on mount

  return newlyUnlocked;
}
