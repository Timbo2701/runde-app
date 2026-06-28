import type { DailyMission, LeaderboardEntry, RankedOpponent } from "@/types/ranked";

export const MOCK_OPPONENTS: RankedOpponent[] = [
  { id: "mika",    name: "Mika",    tier: "silver", division: 2, winrate: 58, avatarEmoji: "🦊" },
  { id: "neonfox", name: "NeonFox", tier: "gold",   division: 1, winrate: 71, avatarEmoji: "🌙" },
  { id: "ayri",    name: "Ayri",    tier: "silver", division: 1, winrate: 64, avatarEmoji: "⚡" },
  { id: "kaito",   name: "Kaito",   tier: "bronze", division: 1, winrate: 52, avatarEmoji: "🔥" },
  { id: "luma",    name: "Luma",    tier: "gold",   division: 3, winrate: 67, avatarEmoji: "✨" },
  { id: "zeno",    name: "Zeno",    tier: "neon",   division: 2, winrate: 75, avatarEmoji: "💎" },
  { id: "roxy",    name: "Roxy",    tier: "silver", division: 3, winrate: 61, avatarEmoji: "🎯" },
];

export function getRandomOpponent(): RankedOpponent {
  return MOCK_OPPONENTS[Math.floor(Math.random() * MOCK_OPPONENTS.length)];
}

export function getOpponentById(id: string): RankedOpponent {
  return MOCK_OPPONENTS.find((o) => o.id === id) ?? MOCK_OPPONENTS[0];
}

export const MOCK_DAILY_MISSIONS: DailyMission[] = [
  {
    id: "play3",
    label: "3 Matches spielen",
    description: "Spiele 3 Ranked Matches",
    emoji: "⚔️",
    current: 1,
    target: 3,
    xpReward: 150,
    completed: false,
  },
  {
    id: "win2",
    label: "2 Siege einfahren",
    description: "Gewinne 2 Ranked Matches",
    emoji: "🏆",
    current: 0,
    target: 2,
    xpReward: 300,
    completed: false,
  },
  {
    id: "perfect",
    label: "Perfekte Runde",
    description: "Gewinne alle 3 Runden in einem Match",
    emoji: "💥",
    current: 0,
    target: 1,
    xpReward: 500,
    completed: false,
  },
];

export const MOCK_LEADERBOARD: LeaderboardEntry[] = [
  { rank: 1,  name: "ZephyrKing",  tier: "legend", division: 1, lp: 2847, winrate: 82, avatarEmoji: "👑" },
  { rank: 2,  name: "NightOwl",    tier: "legend", division: 1, lp: 2741, winrate: 79, avatarEmoji: "🦉" },
  { rank: 3,  name: "Valkyrie",    tier: "legend", division: 1, lp: 2698, winrate: 77, avatarEmoji: "⚡" },
  { rank: 4,  name: "NeonFox",     tier: "elite",  division: 1, lp: 2511, winrate: 74, avatarEmoji: "🌙" },
  { rank: 5,  name: "Starfire",    tier: "elite",  division: 1, lp: 2483, winrate: 73, avatarEmoji: "🌟" },
  { rank: 6,  name: "ShadowRun",   tier: "elite",  division: 1, lp: 2421, winrate: 72, avatarEmoji: "🐺" },
  { rank: 7,  name: "Crysta",      tier: "elite",  division: 2, lp: 2388, winrate: 71, avatarEmoji: "💎" },
  { rank: 8,  name: "Axion",       tier: "elite",  division: 2, lp: 2344, winrate: 70, avatarEmoji: "🔮" },
  { rank: 9,  name: "Luma",        tier: "neon",   division: 1, lp: 2198, winrate: 68, avatarEmoji: "✨" },
  { rank: 10, name: "Zeno",        tier: "neon",   division: 2, lp: 2067, winrate: 66, avatarEmoji: "💜" },
  { rank: 11, name: "PixelGhost",  tier: "neon",   division: 2, lp: 2023, winrate: 65, avatarEmoji: "👾" },
  { rank: 12, name: "Ayri",        tier: "neon",   division: 3, lp: 1987, winrate: 64, avatarEmoji: "🌊" },
  { rank: 13, name: "Drift",       tier: "gold",   division: 1, lp: 1876, winrate: 63, avatarEmoji: "🎯" },
  { rank: 14, name: "Kairos",      tier: "gold",   division: 1, lp: 1831, winrate: 62, avatarEmoji: "⏳" },
  { rank: 15, name: "Rox",         tier: "gold",   division: 2, lp: 1788, winrate: 61, avatarEmoji: "🦁" },
  { rank: 16, name: "Ember",       tier: "gold",   division: 2, lp: 1743, winrate: 61, avatarEmoji: "🔥" },
  { rank: 17, name: "Mika",        tier: "gold",   division: 3, lp: 1699, winrate: 60, avatarEmoji: "🦊" },
  { rank: 18, name: "Vega",        tier: "gold",   division: 3, lp: 1654, winrate: 59, avatarEmoji: "⭐" },
  { rank: 19, name: "Kael",        tier: "silver", division: 1, lp: 1521, winrate: 58, avatarEmoji: "🌙" },
  { rank: 20, name: "Roxy",        tier: "silver", division: 1, lp: 1498, winrate: 57, avatarEmoji: "🎯" },
];
