import type { PlayerSettingsRecord } from "@/types/supabase";

type SettingsSubscriber = (settings: PlayerSettingsRecord) => void;

const subscribers = new Set<SettingsSubscriber>();

export function subscribeToSettings(subscriber: SettingsSubscriber): () => void {
  subscribers.add(subscriber);
  return () => subscribers.delete(subscriber);
}

export function publishSettings(settings: PlayerSettingsRecord): void {
  subscribers.forEach((subscriber) => subscriber(settings));
}
