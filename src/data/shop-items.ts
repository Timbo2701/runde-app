// MOCK-DATEN — keine echten Käufe.
// Echte IAP: App Store In-App Purchase / Google Play Billing.
// Siehe docs/MONETIZATION_RULES.md

import { colors } from "@/design/tokens";
import type { ShopItem } from "@/types/shop";

export const SHOP_ITEMS: ShopItem[] = [
  // ── HOST PASS ──────────────────────────────────────────────────────
  {
    id: "host_pass_party",
    title: "Party Host Pass",
    description:
      "Du zahlst, die ganze Gruppe profitiert. Premium-Modi, größere Rooms, mehr Runden – alle spielen kostenlos mit.",
    category: "host_pass",
    priceLabel: "4,99 €",
    purchaseType: "host_pass",
    isOwned: false,
    isFeatured: true,
    isPopular: true,
    emoji: "⭐",
    accentColor: colors.sun,
    mockEntitlement: "host_pass_active",
    unlockText: "Freischalten",
    badge: "FEATURED",
    legalNote: "Einmaliger Kauf. Verfügbar über App Store / Google Play.",
  },

  // ── WERBUNG ────────────────────────────────────────────────────────
  {
    id: "remove_ads",
    title: "Werbung entfernen",
    description: "Keine Werbung mehr zwischen den Runden. Einmalig kaufen, für immer genießen.",
    category: "werbung",
    priceLabel: "2,99 €",
    purchaseType: "non_consumable",
    isOwned: false,
    isFeatured: false,
    isPopular: true,
    emoji: "🚫",
    accentColor: colors.stageCoral,
    mockEntitlement: "no_ads",
    unlockText: "Freischalten",
    badge: "BELIEBT",
    legalNote: "Non-Consumable In-App Purchase.",
  },

  // ── KOSMETIK ───────────────────────────────────────────────────────
  {
    id: "neon_frame_pack",
    title: "Neon Rahmen Pack",
    description: "Leuchtende Profilrahmen in Neon-Lila, Neon-Pink und Neon-Grün. Auffällig, unübersehbar.",
    category: "kosmetik",
    priceLabel: "1,99 €",
    purchaseType: "cosmetic",
    isOwned: false,
    isFeatured: false,
    isPopular: false,
    emoji: "🌈",
    accentColor: colors.stageGrape,
    mockEntitlement: "cosmetic_neon_frame",
    unlockText: "Freischalten",
    badge: "NEU",
  },
  {
    id: "retro_theme",
    title: "Retro Theme",
    description: "Pixeliger 80er-Look für Rooms und Hintergründe. Cassette vibes.",
    category: "themenpakete",
    priceLabel: "1,49 €",
    purchaseType: "cosmetic",
    isOwned: false,
    isFeatured: false,
    isPopular: false,
    emoji: "📼",
    accentColor: "#E87C2E",
    mockEntitlement: "theme_retro",
    unlockText: "Freischalten",
  },

  // ── GEWINNER-EFFEKTE ───────────────────────────────────────────────
  {
    id: "golden_crown",
    title: "Goldene Krone",
    description: "Animierte Goldkrone über deinem Avatar beim Winner-Reveal. Jeder sieht's.",
    category: "gewinner_effekte",
    priceLabel: "0,99 €",
    purchaseType: "cosmetic",
    isOwned: false,
    isFeatured: false,
    isPopular: true,
    emoji: "👑",
    accentColor: colors.sun,
    mockEntitlement: "cosmetic_golden_crown",
    unlockText: "Freischalten",
    badge: "BELIEBT",
  },
  {
    id: "winner_fx_pack",
    title: "Gewinner FX Pack",
    description: "Explodierendes Konfetti, Lichtstrahlen und Sieger-Fanfare. Der Moment gehört dir.",
    category: "gewinner_effekte",
    priceLabel: "1,99 €",
    purchaseType: "cosmetic",
    isOwned: false,
    isFeatured: false,
    isPopular: false,
    emoji: "🎆",
    accentColor: colors.stageBerry,
    mockEntitlement: "cosmetic_winner_fx",
    unlockText: "Freischalten",
    badge: "NEU",
  },

  // ── FRAGENPAKETE ───────────────────────────────────────────────────
  {
    id: "chaos_pack",
    title: "Chaos Fragen Pack",
    description: "+50 Fragen, die für echtes Chaos sorgen. Nur für mutige Runden.",
    category: "fragenpakete",
    priceLabel: "1,99 €",
    purchaseType: "content_pack",
    isOwned: false,
    isFeatured: false,
    isPopular: false,
    emoji: "💥",
    accentColor: colors.stageCoral,
    mockEntitlement: "pack_chaos",
    unlockText: "Freischalten",
  },
  {
    id: "schaetz_pack",
    title: "Schätzfragen Pack",
    description: "+40 Schätzfragen zu Zahlen, Rekorden und Alltagswissen. Bauchgefühl gefragt.",
    category: "fragenpakete",
    priceLabel: "1,99 €",
    purchaseType: "content_pack",
    isOwned: false,
    isFeatured: false,
    isPopular: false,
    emoji: "🎯",
    accentColor: colors.stageGrape,
    mockEntitlement: "pack_schaetz",
    unlockText: "Freischalten",
  },
  {
    id: "hot_takes_pack",
    title: "Hot Takes Pack",
    description: "+45 provokante Aussagen, kontroverse Fragen. Meinungen prallen aufeinander.",
    category: "fragenpakete",
    priceLabel: "1,99 €",
    purchaseType: "content_pack",
    isOwned: false,
    isFeatured: false,
    isPopular: true,
    emoji: "🌶️",
    accentColor: "#D63B1F",
    mockEntitlement: "pack_hot_takes",
    unlockText: "Freischalten",
    badge: "BELIEBT",
  },

  // ── THEMENPAKETE ───────────────────────────────────────────────────
  {
    id: "dark_party_theme",
    title: "Dark Party Theme",
    description: "Tiefes Dunkelblau, Neon-Akzente, Club-Atmosphäre. Für die Late-Night-Runde.",
    category: "themenpakete",
    priceLabel: "1,49 €",
    purchaseType: "cosmetic",
    isOwned: false,
    isFeatured: false,
    isPopular: false,
    emoji: "🌙",
    accentColor: "#1A1A4E",
    mockEntitlement: "theme_dark_party",
    unlockText: "Freischalten",
    comingSoon: true,
    badge: "BALD",
  },
];

export function getItemsByCategory(category: string): ShopItem[] {
  if (category === "all") return SHOP_ITEMS;
  return SHOP_ITEMS.filter((i) => i.category === category);
}

export function getFeaturedItem(): ShopItem | undefined {
  return SHOP_ITEMS.find((i) => i.isFeatured);
}
