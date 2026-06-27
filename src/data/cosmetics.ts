// Kosmetik-Katalog — alle Einträge sind lokal/mock.
// Keine echten IAP hier; "owned" wird via ownedCosmetics im ProfileContext verwaltet.
// Freischalt-Quelle: achievement (gratis) oder shop (Mock-Kauf).

export type CosmeticCategory = "badge" | "title" | "effect";

export interface CosmeticItem {
  id: string;
  category: CosmeticCategory;
  label: string;
  description: string;
  emoji: string;
  /** Hex accent color for the preview card */
  accent: string;
  /** How this item is obtained */
  source: "free" | "achievement" | "shop";
  /** Achievement ID that unlocks this (if source === "achievement") */
  achievementId?: string;
  /** Mock price label (displayed, not functional) */
  price?: string;
}

export const COSMETICS: CosmeticItem[] = [
  // ── Badges (Profilrahmen) ─────────────────────────────────────────────────
  {
    id: "badge_default",
    category: "badge",
    label: "Standard",
    description: "Der klassische Runde-Rahmen. Immer verfügbar.",
    emoji: "⭕",
    accent: "#6F2BD3",
    source: "free",
  },
  {
    id: "cosmetic_neon_frame",
    category: "badge",
    label: "Neon-Rahmen",
    description: "Ein leuchtender Neon-Ring für Volltreffer.",
    emoji: "💚",
    accent: "#43B86B",
    source: "achievement",
    achievementId: "perfect_estimate",
  },
  {
    id: "cosmetic_golden_crown",
    category: "badge",
    label: "Goldene Krone",
    description: "Nur für echte Bluff-Meister.",
    emoji: "👑",
    accent: "#FFD84D",
    source: "achievement",
    achievementId: "bluff_master",
  },
  {
    id: "badge_star",
    category: "badge",
    label: "Stern-Rahmen",
    description: "Glänze im Profil deiner Mitspieler.",
    emoji: "⭐",
    accent: "#FFD84D",
    source: "shop",
    price: "1,99 €",
  },
  {
    id: "badge_flame",
    category: "badge",
    label: "Flammen-Rahmen",
    description: "Für alle, die immer Feuer geben.",
    emoji: "🔥",
    accent: "#C52A87",
    source: "shop",
    price: "1,99 €",
  },

  // ── Titles (Spielertitel) ─────────────────────────────────────────────────
  {
    id: "title_none",
    category: "title",
    label: "Kein Titel",
    description: "Kein Titel angezeigt.",
    emoji: "—",
    accent: "#6F2BD3",
    source: "free",
  },
  {
    id: "title_legend",
    category: "title",
    label: "Legende",
    description: "Für alle, die schon alles gesehen haben.",
    emoji: "🏅",
    accent: "#FFD84D",
    source: "shop",
    price: "0,99 €",
  },
  {
    id: "title_chaos",
    category: "title",
    label: "Chaos-König",
    description: "Dein Chaos ist ihre Unterhaltung.",
    emoji: "💥",
    accent: "#C52A87",
    source: "achievement",
    achievementId: "chaos_legend",
  },
  {
    id: "title_bluff",
    category: "title",
    label: "Der Bluffer",
    description: "Du lügst so gut, das nennt man Talent.",
    emoji: "🃏",
    accent: "#6F2BD3",
    source: "achievement",
    achievementId: "bluff_master",
  },
  {
    id: "title_crowd",
    category: "title",
    label: "Publikumsliebling",
    description: "Alle lieben dich — und das zu Recht.",
    emoji: "🗳️",
    accent: "#43B86B",
    source: "achievement",
    achievementId: "audience_darling",
  },

  // ── Effects (Gewinner-Effekte) ─────────────────────────────────────────────
  {
    id: "effect_confetti",
    category: "effect",
    label: "Konfetti",
    description: "Klassisches Konfetti wenn du gewinnst.",
    emoji: "🎉",
    accent: "#FFD84D",
    source: "free",
  },
  {
    id: "effect_fireworks",
    category: "effect",
    label: "Feuerwerk",
    description: "Großes Feuerwerk für große Siege.",
    emoji: "🎆",
    accent: "#C52A87",
    source: "shop",
    price: "0,99 €",
  },
  {
    id: "effect_stars",
    category: "effect",
    label: "Sternenregen",
    description: "Ein Regen aus goldenen Sternen.",
    emoji: "✨",
    accent: "#FFD84D",
    source: "shop",
    price: "0,99 €",
  },
  {
    id: "effect_lightning",
    category: "effect",
    label: "Blitz",
    description: "Für alle, die wie der Blitz gewinnen.",
    emoji: "⚡",
    accent: "#6F2BD3",
    source: "achievement",
    achievementId: "quiz_head",
  },
];

export function getCosmeticsByCategory(cat: CosmeticCategory): CosmeticItem[] {
  return COSMETICS.filter((c) => c.category === cat);
}

export function getCosmeticById(id: string): CosmeticItem | undefined {
  return COSMETICS.find((c) => c.id === id);
}
