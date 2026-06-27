export type AchievementCategory =
  | "spielen"
  | "siegen"
  | "sozial"
  | "modus"
  | "streak";

export interface Achievement {
  id: string;
  title: string;
  description: string;
  emoji: string;
  category: AchievementCategory;
  isUnlocked: boolean;
  unlocksCosmetic?: string;
  progress?: {
    current: number;
    target: number;
  };
  xp: number;
}
