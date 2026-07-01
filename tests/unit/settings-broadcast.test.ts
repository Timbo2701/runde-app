import { describe, expect, it, vi } from "vitest";

import { publishSettings, subscribeToSettings } from "../../src/services/settings-broadcast";
import type { PlayerSettingsRecord } from "../../src/types/supabase";

const SETTINGS: PlayerSettingsRecord = {
  musicEnabled: false,
  soundEnabled: true,
  hapticsEnabled: true,
  animationsEnabled: false,
};

describe("settings broadcast", () => {
  it("updates active subscribers and leaves removed subscribers untouched", () => {
    const active = vi.fn();
    const removed = vi.fn();
    const unsubscribeActive = subscribeToSettings(active);
    const unsubscribeRemoved = subscribeToSettings(removed);

    unsubscribeRemoved();
    publishSettings(SETTINGS);

    expect(active).toHaveBeenCalledWith(SETTINGS);
    expect(removed).not.toHaveBeenCalled();
    unsubscribeActive();
  });
});
