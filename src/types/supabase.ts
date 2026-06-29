export type ProfileRecord = {
  id: string;
  username: string;
  displayName: string;
  avatarUrl: string | null;
  avatarInitials: string;
  onboardingCompleted: boolean;
  setupCompleted: boolean;
  isBot: boolean;
};

export type PlayerSettingsRecord = {
  musicEnabled: boolean;
  soundEnabled: boolean;
  hapticsEnabled: boolean;
  animationsEnabled: boolean;
};

export type PlayerStatsRecord = {
  roundsPlayed: number;
  wins: number;
  losses: number;
  favoriteMode: string | null;
  bestCategory: string | null;
};

export type AchievementProgressRecord = {
  id: string;
  slug: string;
  title: string;
  description: string;
  icon: string;
  category: string;
  targetValue: number;
  progress: number;
  unlocked: boolean;
};

export type MissionProgressRecord = {
  id: string;
  slug: string;
  title: string;
  description: string;
  icon: string;
  targetValue: number;
  progress: number;
  rewardXp: number;
  completed: boolean;
};

export type BattlePassProgressRecord = {
  id: string;
  title: string;
  maxLevel: number;
  xp: number;
  level: number;
  premiumUnlocked: boolean;
};

export type CosmeticOwnershipRecord = {
  ownedIds: string[];
  selectedBadge: string | null;
  selectedTitle: string | null;
  selectedWinnerEffect: string | null;
  selectedProfileBackground: string | null;
  selectedCrown: string | null;
};
