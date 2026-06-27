import type { Achievement } from "@/types/achievements";

// Achievements werden erspielt, NICHT gekauft.
// Kosmetik kann durch Achievements freigeschaltet werden.
// Keine Game Center / Google Play Games Integration — lokal/mockbasiert.

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: "first_round",
    title: "Erste Runde gespielt",
    description: "Spielst du das erste Mal mit. Der Anfang von allem.",
    emoji: "🎮",
    category: "spielen",
    isUnlocked: true,
    xp: 10,
    progress: { current: 1, target: 1 },
  },
  {
    id: "three_wins",
    title: "Dreifach-Sieger",
    description: "Gewinn 3 Runden insgesamt. Die anderen merken es langsam.",
    emoji: "🏆",
    category: "siegen",
    isUnlocked: false,
    xp: 25,
    progress: { current: 1, target: 3 },
  },
  {
    id: "perfect_estimate",
    title: "Volltreffer",
    description: "Triff in der Schätzrunde exakt die richtige Zahl.",
    emoji: "🎯",
    category: "modus",
    isUnlocked: false,
    xp: 50,
    unlocksCosmetic: "cosmetic_neon_frame",
  },
  {
    id: "bluff_master",
    title: "Bluff-Meister",
    description: "Überzeuge alle anderen mit deiner gefälschten Antwort.",
    emoji: "🃏",
    category: "modus",
    isUnlocked: false,
    xp: 40,
    unlocksCosmetic: "cosmetic_golden_crown",
  },
  {
    id: "quiz_head",
    title: "Quiz-Kopf",
    description: "Beantworte 5 Quiz-Fragen in Folge korrekt.",
    emoji: "⚡",
    category: "modus",
    isUnlocked: false,
    xp: 35,
    progress: { current: 2, target: 5 },
  },
  {
    id: "audience_darling",
    title: "Publikumsliebling",
    description: "Werde in der Klassiker-Runde von allen gewählt.",
    emoji: "🗳️",
    category: "siegen",
    isUnlocked: false,
    xp: 30,
  },
  {
    id: "five_day_streak",
    title: "5 Tage dabei",
    description: "Spiel 5 Tage hintereinander mindestens eine Runde.",
    emoji: "🔥",
    category: "streak",
    isUnlocked: false,
    xp: 60,
    progress: { current: 1, target: 5 },
  },
  {
    id: "invite_friends",
    title: "Gastgeber",
    description: "Lade 10 Freunde zu einer Runde ein.",
    emoji: "👥",
    category: "sozial",
    isUnlocked: false,
    xp: 45,
    progress: { current: 0, target: 10 },
  },
  {
    id: "chaos_legend",
    title: "Chaos-Legende",
    description: "Spiel jede Runde in einem anderen Modus.",
    emoji: "💥",
    category: "spielen",
    isUnlocked: false,
    xp: 55,
  },
  {
    id: "drawing_legend",
    title: "Zeichenlegende",
    description: "Gewinne im Zeichen-Vote dreimal hintereinander. (Kommt bald!)",
    emoji: "🎨",
    category: "modus",
    isUnlocked: false,
    xp: 70,
    progress: { current: 0, target: 3 },
  },
];

export function getUnlockedAchievements(): Achievement[] {
  return ACHIEVEMENTS.filter((a) => a.isUnlocked);
}

export function getRecentAchievements(limit = 3): Achievement[] {
  return ACHIEVEMENTS.slice(0, limit);
}
