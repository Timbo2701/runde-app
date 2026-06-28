// WICHTIG: Alle Käufe sind MOCK-ONLY.
// Echte IAP muss über App Store In-App Purchase / Google Play Billing laufen.
// KEIN Apple Pay für digitale Güter.
// Siehe docs/MONETIZATION_RULES.md

export type PurchaseType =
  | "non_consumable"
  | "subscription"
  | "cosmetic"
  | "content_pack"
  | "host_pass"
  | "mock_only";

export type ShopCategory =
  | "werbung"
  | "kosmetik"
  | "gewinner_effekte"
  | "themenpakete"
  | "fragenpakete"
  | "host_pass";

export type UnlockStatus = "locked" | "owned" | "coming_soon";

export type ProductBadge = "NEU" | "BELIEBT" | "FEATURED" | "BALD";

export interface ShopItem {
  id: string;
  title: string;
  description: string;
  category: ShopCategory;
  priceLabel: string;
  purchaseType: PurchaseType;
  isOwned: boolean;
  isFeatured: boolean;
  isPopular: boolean;
  emoji: string;
  accentColor: string;
  mockEntitlement: string;
  cosmeticIds?: string[];
  unlockText: string;
  legalNote?: string;
  comingSoon?: boolean;
  badge?: ProductBadge;
}

export interface CosmeticItem {
  id: string;
  type: "avatar_frame" | "profile_background" | "name_badge" | "title" | "winner_effect";
  title: string;
  emoji: string;
  accentColor: string;
  isOwned: boolean;
  unlockedBy: "purchase" | "achievement";
  achievementId?: string;
}

export interface PremiumPlan {
  id: string;
  title: string;
  description: string;
  priceLabel: string;
  period: "monthly" | "yearly" | "lifetime";
  features: string[];
  isPopular: boolean;
}

export interface MockPurchaseState {
  ownedIds: string[];
  activeSubscription: string | null;
}
