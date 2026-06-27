import { router } from "expo-router";
import { useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import Animated, { FadeIn, FadeInDown, FadeInUp } from "react-native-reanimated";

import { SHOP_ITEMS } from "@/data/shop-items";
import { colors, fonts, radii, spacing } from "@/design/tokens";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import type { ShopCategory, ShopItem } from "@/types/shop";
import { AppHeader } from "@/ui/primitives/app-header";
import { StageScreen } from "@/ui/primitives/stage-screen";

type CategoryFilter = "all" | ShopCategory;

const CATEGORY_TABS: { id: CategoryFilter; label: string; emoji: string }[] = [
  { id: "all", label: "Alle", emoji: "✨" },
  { id: "host_pass", label: "Host Pass", emoji: "⭐" },
  { id: "werbung", label: "Werbefrei", emoji: "🚫" },
  { id: "kosmetik", label: "Kosmetik", emoji: "🎨" },
  { id: "gewinner_effekte", label: "Gewinner", emoji: "🏆" },
  { id: "themenpakete", label: "Themes", emoji: "🌈" },
  { id: "fragenpakete", label: "Fragen", emoji: "❓" },
];

function CategoryPill({
  tab,
  active,
  onPress,
}: {
  tab: (typeof CATEGORY_TABS)[number];
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: radii.round,
        borderWidth: 1.5,
        borderColor: active ? colors.sun : "rgba(255,255,255,0.22)",
        backgroundColor: active ? colors.sun : "rgba(255,255,255,0.08)",
        opacity: pressed ? 0.8 : 1,
        marginRight: 8,
      })}
    >
      <Text style={{ fontSize: 13 }}>{tab.emoji}</Text>
      <Text
        style={{
          color: active ? colors.ink : colors.white,
          fontFamily: fonts.bodySemiBold,
          fontSize: 13,
        }}
      >
        {tab.label}
      </Text>
    </Pressable>
  );
}

function FeaturedCard({ item }: { item: ShopItem }) {
  return (
    <View
      style={{
        borderRadius: radii.card,
        borderCurve: "continuous",
        backgroundColor: "rgba(255,216,77,0.13)",
        borderWidth: 2,
        borderColor: colors.sun,
        padding: spacing.xl,
        gap: 14,
      }}
    >
      {/* Badge */}
      <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
        <View
          style={{
            backgroundColor: colors.sun,
            paddingHorizontal: 10,
            paddingVertical: 3,
            borderRadius: radii.round,
          }}
        >
          <Text style={{ color: colors.ink, fontFamily: fonts.mono, fontSize: 10 }}>
            ⭐ FEATURED
          </Text>
        </View>
        <Text style={{ color: colors.whiteSoft, fontFamily: fonts.body, fontSize: 12 }}>
          Meistgekauft
        </Text>
      </View>

      <View style={{ flexDirection: "row", alignItems: "flex-start", gap: 14 }}>
        {/* Icon */}
        <View
          style={{
            width: 64,
            height: 64,
            borderRadius: 20,
            backgroundColor: "rgba(255,216,77,0.18)",
            alignItems: "center",
            justifyContent: "center",
            borderWidth: 1.5,
            borderColor: "rgba(255,216,77,0.4)",
          }}
        >
          <Text style={{ fontSize: 32 }}>{item.emoji}</Text>
        </View>

        <View style={{ flex: 1, gap: 4 }}>
          <Text
            style={{
              color: colors.white,
              fontFamily: fonts.displayExtraBold,
              fontSize: 22,
              lineHeight: 26,
            }}
          >
            {item.title}
          </Text>
          <Text
            style={{
              color: colors.whiteSoft,
              fontFamily: fonts.body,
              fontSize: 13,
              lineHeight: 18,
            }}
          >
            {item.description}
          </Text>
        </View>
      </View>

      {/* Host Pass Feature-Liste */}
      <View style={{ gap: 6 }}>
        {[
          "Premium-Modi hosten",
          "Größere Rooms (bis 20 Spieler)",
          "Mehr Runden pro Session",
          "Exklusive Themes & Fragenpakete",
        ].map((feat) => (
          <View key={feat} style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            <View
              style={{
                width: 18,
                height: 18,
                borderRadius: 9,
                backgroundColor: colors.sun,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text style={{ color: colors.ink, fontSize: 10, fontFamily: fonts.bodyBold }}>✓</Text>
            </View>
            <Text style={{ color: colors.white, fontFamily: fonts.bodyMedium, fontSize: 13 }}>
              {feat}
            </Text>
          </View>
        ))}
        <Text style={{ color: colors.whiteSoft, fontFamily: fonts.body, fontSize: 11, marginTop: 2 }}>
          Andere spielen kostenlos mit, wenn du Host bist.
        </Text>
      </View>

      {/* CTA */}
      <Pressable
        style={({ pressed }) => ({
          backgroundColor: colors.sun,
          borderRadius: radii.control,
          borderCurve: "continuous",
          paddingVertical: 15,
          alignItems: "center",
          opacity: pressed ? 0.88 : 1,
        })}
        onPress={() => {}}
        accessibilityRole="button"
        accessibilityLabel="Party Host Pass freischalten (Mock)"
      >
        <Text style={{ color: colors.ink, fontFamily: fonts.bodyBold, fontSize: 17 }}>
          {item.unlockText} — {item.priceLabel}
        </Text>
      </Pressable>

      {item.legalNote && (
        <Text
          style={{
            color: "rgba(255,255,255,0.45)",
            fontFamily: fonts.body,
            fontSize: 10,
            textAlign: "center",
          }}
        >
          {item.legalNote} · Platzhalter — kein echter Kauf.
        </Text>
      )}
    </View>
  );
}

function ShopItemCard({ item, index, reducedMotion }: { item: ShopItem; index: number; reducedMotion: boolean }) {
  const isComingSoon = item.comingSoon;

  return (
    <Animated.View
      entering={reducedMotion ? undefined : FadeInDown.delay(index * 50).duration(240)}
    >
      <View
        style={{
          borderRadius: radii.card,
          borderCurve: "continuous",
          backgroundColor: "rgba(0,0,0,0.22)",
          borderWidth: 1,
          borderColor: "rgba(255,255,255,0.1)",
          padding: spacing.xl,
          gap: 12,
          opacity: isComingSoon ? 0.65 : 1,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 14 }}>
          {/* Icon */}
          <View
            style={{
              width: 52,
              height: 52,
              borderRadius: 16,
              backgroundColor: `${item.accentColor}28`,
              alignItems: "center",
              justifyContent: "center",
              borderWidth: 1,
              borderColor: `${item.accentColor}44`,
            }}
          >
            <Text style={{ fontSize: 26 }}>{item.emoji}</Text>
          </View>

          {/* Info */}
          <View style={{ flex: 1, gap: 3 }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 7, flexWrap: "wrap" }}>
              <Text style={{ color: colors.white, fontFamily: fonts.bodyBold, fontSize: 16 }}>
                {item.title}
              </Text>
              {item.badge && item.badge !== "FEATURED" && (
                <View
                  style={{
                    backgroundColor:
                      item.badge === "BELIEBT"
                        ? colors.stageBerry
                        : item.badge === "NEU"
                        ? colors.stageGrape
                        : "rgba(255,255,255,0.2)",
                    paddingHorizontal: 7,
                    paddingVertical: 2,
                    borderRadius: radii.round,
                  }}
                >
                  <Text style={{ color: colors.white, fontFamily: fonts.mono, fontSize: 9 }}>
                    {item.badge}
                  </Text>
                </View>
              )}
            </View>
            <Text
              style={{
                color: colors.whiteSoft,
                fontFamily: fonts.body,
                fontSize: 12,
                lineHeight: 16,
              }}
              numberOfLines={2}
            >
              {item.description}
            </Text>
          </View>
        </View>

        {/* Price + CTA */}
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
          <Text
            style={{
              flex: 1,
              color: colors.sun,
              fontFamily: fonts.mono,
              fontSize: 18,
              fontWeight: "700",
            }}
          >
            {item.priceLabel}
          </Text>

          <Pressable
            disabled={isComingSoon}
            onPress={() => {}}
            accessibilityRole="button"
            style={({ pressed }) => ({
              paddingHorizontal: 18,
              paddingVertical: 10,
              borderRadius: radii.control,
              borderCurve: "continuous",
              backgroundColor: isComingSoon
                ? "rgba(255,255,255,0.12)"
                : colors.sun,
              opacity: pressed ? 0.8 : 1,
            })}
          >
            <Text
              style={{
                color: isComingSoon ? colors.whiteSoft : colors.ink,
                fontFamily: fonts.bodyBold,
                fontSize: 14,
              }}
            >
              {isComingSoon ? "Bald verfügbar" : item.unlockText}
            </Text>
          </Pressable>
        </View>
      </View>
    </Animated.View>
  );
}

export function ShopScreen() {
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>("all");
  const reducedMotion = useReducedMotion();

  const featured = SHOP_ITEMS.find((i) => i.isFeatured);
  const visibleItems = SHOP_ITEMS.filter((i) => {
    if (i.isFeatured && activeCategory === "all") return false;
    if (activeCategory === "all") return true;
    return i.category === activeCategory;
  });

  return (
    <StageScreen stageColor={colors.stageGrapeDeep} pattern="rings" scrollEnabled>
      <AppHeader
        title="Shop"
        actionLabel="Zurück"
        onAction={() => (router.canGoBack() ? router.back() : router.replace("/"))}
      />

      {/* Hero */}
      <Animated.View
        entering={reducedMotion ? undefined : FadeInUp.duration(260)}
        style={{ paddingTop: 8, paddingBottom: 4, gap: 4 }}
      >
        <Text style={{ color: colors.sun, fontFamily: fonts.mono, fontSize: 12, letterSpacing: 2 }}>
          RUNDE SHOP
        </Text>
        <Text
          style={{
            color: colors.white,
            fontFamily: fonts.displayExtraBold,
            fontSize: 34,
            lineHeight: 38,
          }}
        >
          Mach die Nacht{"\n"}unvergesslich.
        </Text>
        <Text style={{ color: colors.whiteSoft, fontFamily: fonts.body, fontSize: 14 }}>
          Kosmetik, Inhalte, kein Pay-to-Win.
        </Text>
      </Animated.View>

      {/* Category pills */}
      <Animated.View
        entering={reducedMotion ? undefined : FadeIn.delay(60).duration(220)}
        style={{ marginTop: 20, marginBottom: 4 }}
      >
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingVertical: 4 }}
        >
          {CATEGORY_TABS.map((tab) => (
            <CategoryPill
              key={tab.id}
              tab={tab}
              active={activeCategory === tab.id}
              onPress={() => setActiveCategory(tab.id)}
            />
          ))}
        </ScrollView>
      </Animated.View>

      {/* Featured item */}
      {featured && (activeCategory === "all" || activeCategory === "host_pass") && (
        <Animated.View
          entering={reducedMotion ? undefined : FadeInDown.delay(80).duration(280)}
          style={{ marginTop: 16 }}
        >
          <FeaturedCard item={featured} />
        </Animated.View>
      )}

      {/* Items */}
      <View style={{ marginTop: 16, gap: 12 }}>
        {visibleItems.length === 0 && (
          <View style={{ alignItems: "center", paddingVertical: 40, gap: 10 }}>
            <Text style={{ fontSize: 36 }}>🛍️</Text>
            <Text style={{ color: colors.whiteSoft, fontFamily: fonts.body, fontSize: 15 }}>
              Keine Artikel in dieser Kategorie.
            </Text>
          </View>
        )}
        {visibleItems.map((item, index) => (
          <ShopItemCard
            key={item.id}
            item={item}
            index={index}
            reducedMotion={reducedMotion}
          />
        ))}
      </View>

      {/* Legal footer */}
      <Animated.View
        entering={reducedMotion ? undefined : FadeIn.delay(300).duration(260)}
        style={{
          marginTop: 28,
          padding: spacing.xl,
          borderRadius: radii.card,
          backgroundColor: "rgba(0,0,0,0.2)",
          gap: 6,
        }}
      >
        <Text style={{ color: colors.whiteSoft, fontFamily: fonts.bodySemiBold, fontSize: 12 }}>
          ℹ️ Hinweis
        </Text>
        <Text
          style={{
            color: "rgba(255,255,255,0.5)",
            fontFamily: fonts.body,
            fontSize: 11,
            lineHeight: 16,
          }}
        >
          Alle Preise sind Platzhalter. Echte Käufe laufen über App Store In-App
          Purchase (iOS) bzw. Google Play Billing (Android). Kein Apple Pay für
          digitale Güter. Kein Pay-to-Win.
        </Text>
      </Animated.View>
    </StageScreen>
  );
}
