import type { BattlePassReward } from "@/types/ranked";

export const BATTLE_PASS_REWARDS: BattlePassReward[] = [
  { level: 1, free: { emoji: "🎯", label: "Titel: 'Rookie'", type: "title" }, premium: { emoji: "✨", label: "Neon Trail", type: "effect" } },
  { level: 2, free: { emoji: "💬", label: "+200 Season XP", type: "xp" }, premium: { emoji: "🌙", label: "Mondlicht Rahmen", type: "frame" } },
  { level: 3, free: { emoji: "⚡", label: "Profil-Icon: Blitz", type: "icon" }, premium: { emoji: "💜", label: "Neon-Aura Effekt", type: "effect" } },
  { level: 4, free: { emoji: "🎮", label: "+300 Season XP", type: "xp" }, premium: { emoji: "🔮", label: "Kristall Rahmen", type: "frame" } },
  { level: 5, free: { emoji: "🖼️", label: "Silber Rahmen", type: "frame" }, premium: { emoji: "👑", label: "Neon Krone", type: "cosmetic" } },
  { level: 6, free: { emoji: "💬", label: "+400 Season XP", type: "xp" }, premium: { emoji: "🌊", label: "Wellen-Effekt", type: "effect" } },
  { level: 7, free: { emoji: "🏅", label: "Titel: 'Aufsteiger'", type: "title" }, premium: { emoji: "🔥", label: "Flammen Trail", type: "effect" } },
  { level: 8, free: { emoji: "⭐", label: "+500 Season XP", type: "xp" }, premium: { emoji: "💎", label: "Diamant Rahmen", type: "frame" } },
  { level: 9, free: { emoji: "🎯", label: "Profil-Icon: Zielscheibe", type: "icon" }, premium: { emoji: "🌟", label: "Sternregen Effekt", type: "effect" } },
  { level: 10, free: { emoji: "🏆", label: "+750 Season XP", type: "xp" }, premium: { emoji: "⚡", label: "Blitz Rahmen Neon", type: "frame" } },
  { level: 11, free: { emoji: "🎭", label: "Titel: 'Stimmungsmacher'", type: "title" }, premium: { emoji: "🌈", label: "Regenbogen Aura", type: "effect" } },
  { level: 12, free: { emoji: "💬", label: "+500 Season XP", type: "xp" }, premium: { emoji: "🦊", label: "Fuchs Icon", type: "icon" } },
  { level: 13, free: { emoji: "🎮", label: "Profil-Icon: Controller", type: "icon" }, premium: { emoji: "💫", label: "Magie Effekt", type: "effect" } },
  { level: 14, free: { emoji: "⭐", label: "+600 Season XP", type: "xp" }, premium: { emoji: "🌙", label: "Mond Rahmen", type: "frame" } },
  { level: 15, free: { emoji: "🥇", label: "Gold Rahmen", type: "frame" }, premium: { emoji: "🎆", label: "Feuerwerk Groß", type: "effect" } },
  { level: 16, free: { emoji: "🏅", label: "Titel: 'Veteran'", type: "title" }, premium: { emoji: "👾", label: "Pixel Rahmen", type: "frame" } },
  { level: 17, free: { emoji: "💬", label: "+700 Season XP", type: "xp" }, premium: { emoji: "⚡", label: "Gewitter Effekt", type: "effect" } },
  { level: 18, free: { emoji: "🎯", label: "Profil-Icon: Stern", type: "icon" }, premium: { emoji: "🦁", label: "Löwen Icon", type: "icon" } },
  { level: 19, free: { emoji: "⭐", label: "+800 Season XP", type: "xp" }, premium: { emoji: "💠", label: "Kristall Effekt", type: "effect" } },
  { level: 20, free: { emoji: "🔥", label: "Feuer Rahmen", type: "frame" }, premium: { emoji: "🏆", label: "Champion Krone", type: "cosmetic" } },
  { level: 25, free: { emoji: "💎", label: "Titel: 'Diamant'", type: "title" }, premium: { emoji: "🌌", label: "Galaxie Effekt", type: "effect" } },
  { level: 30, free: { emoji: "⭐", label: "+2000 Season XP", type: "xp" }, premium: { emoji: "👑", label: "Gold Krone", type: "cosmetic" } },
  { level: 40, free: { emoji: "🏅", label: "Titel: 'Legende'", type: "title" }, premium: { emoji: "🌟", label: "Legendärer Rahmen", type: "frame" } },
  { level: 50, free: { emoji: "🎖️", label: "Season 1 Medaille", type: "cosmetic" }, premium: { emoji: "👑", label: "Season 1 Krone (exklusiv)", type: "cosmetic" } },
];

export function getRewardForLevel(level: number): BattlePassReward | undefined {
  return BATTLE_PASS_REWARDS.find((r) => r.level === level);
}

export function getNextRewards(currentLevel: number, count = 3): BattlePassReward[] {
  const allLevels = Array.from({ length: 50 }, (_, i) => i + 1);
  const upcoming = allLevels.filter((l) => l > currentLevel);
  return upcoming.slice(0, count).map((level) => {
    const explicit = BATTLE_PASS_REWARDS.find((r) => r.level === level);
    if (explicit) return explicit;
    return {
      level,
      free: { emoji: "💬", label: `+${level * 50} XP`, type: "xp" },
      premium: { emoji: "✨", label: "Premium Bonus", type: "bonus" },
    };
  });
}
