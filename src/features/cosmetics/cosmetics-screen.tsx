import { router } from "expo-router";
import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";

import { ACHIEVEMENTS } from "@/data/achievements";
import {
  COSMETICS,
  getCosmeticsByCategory,
  type CosmeticCategory,
  type CosmeticItem,
} from "@/data/cosmetics";
import { colors, fonts, radii, spacing } from "@/design/tokens";
import { useAchievements } from "@/lib/use-achievements";
import { useProfile } from "@/lib/profile-context";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { AppHeader } from "@/ui/primitives/app-header";
import { BrandButton } from "@/ui/primitives/brand-button";
import { StageScreen } from "@/ui/primitives/stage-screen";

// ── Tab config ────────────────────────────────────────────────────────────────

const TABS: { id: CosmeticCategory; label: string; emoji: string }[] = [
  { id: "badge", label: "Rahmen", emoji: "🖼️" },
  { id: "title", label: "Titel", emoji: "🏅" },
  { id: "effect", label: "Effekte", emoji: "✨" },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

function isOwned(item: CosmeticItem, ownedCosmetics: string[], achievementState: Record<string, boolean>): boolean {
  if (item.source === "free") return true;
  // Explicit ownership (earned via shop purchase or achievement auto-unlock) always wins
  if (ownedCosmetics.includes(item.id)) return true;
  if (item.source === "achievement" && item.achievementId) {
    return achievementState[item.achievementId] ?? false;
  }
  return false;
}

function getSelectedForCategory(
  category: CosmeticCategory,
  selectedBadge: string | null,
  selectedTitle: string | null,
  selectedWinnerEffect: string | null
): string | null {
  if (category === "badge") return selectedBadge;
  if (category === "title") return selectedTitle;
  return selectedWinnerEffect;
}

function defaultForCategory(category: CosmeticCategory): string {
  if (category === "badge") return "badge_default";
  if (category === "title") return "title_none";
  return "effect_confetti";
}

// ── Sub-components ────────────────────────────────────────────────────────────

function SourceBadge({ item, achievementState, ownedCosmetics }: {
  item: CosmeticItem;
  achievementState: Record<string, boolean>;
  ownedCosmetics: string[];
}) {
  const owned = isOwned(item, ownedCosmetics, achievementState);
  if (owned) return null;

  if (item.source === "achievement" && item.achievementId) {
    const ach = ACHIEVEMENTS.find((a) => a.id === item.achievementId);
    return (
      <View style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: radii.round,
        backgroundColor: "rgba(111,43,211,0.25)",
        borderWidth: 1,
        borderColor: "rgba(111,43,211,0.5)",
        alignSelf: "flex-start",
      }}>
        <Text style={{ fontSize: 11 }}>{ach?.emoji ?? "🏆"}</Text>
        <Text style={{ color: "#b78af0", fontFamily: fonts.body, fontSize: 11 }}>
          {ach?.title ?? "Achievement"}
        </Text>
      </View>
    );
  }

  if (item.source === "shop" && item.price) {
    return (
      <View style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: radii.round,
        backgroundColor: "rgba(255,216,77,0.15)",
        borderWidth: 1,
        borderColor: "rgba(255,216,77,0.4)",
        alignSelf: "flex-start",
      }}>
        <Text style={{ color: colors.sun, fontFamily: fonts.bodySemiBold, fontSize: 11 }}>
          🛍️ {item.price}
        </Text>
      </View>
    );
  }

  return null;
}

function CosmeticCard({
  item,
  isSelected,
  owned,
  onPress,
  onBuy,
  index,
  reducedMotion,
}: {
  item: CosmeticItem;
  isSelected: boolean;
  owned: boolean;
  onPress: () => void;
  onBuy?: () => void;
  index: number;
  reducedMotion: boolean;
}) {
  return (
    <Animated.View
      entering={reducedMotion ? undefined : FadeInDown.delay(index * 60).duration(260)}
    >
      <Pressable
        onPress={onPress}
        disabled={!owned}
        style={({ pressed }) => ({
          flexDirection: "row",
          alignItems: "center",
          gap: 14,
          padding: spacing.md,
          paddingHorizontal: spacing.lg,
          borderRadius: radii.card,
          borderCurve: "continuous",
          borderWidth: isSelected ? 2 : 1,
          borderColor: isSelected
            ? item.accent
            : owned
            ? "rgba(255,255,255,0.15)"
            : "rgba(255,255,255,0.07)",
          backgroundColor: isSelected
            ? `${item.accent}22`
            : owned
            ? "rgba(255,255,255,0.07)"
            : "rgba(255,255,255,0.03)",
          opacity: pressed ? 0.8 : owned ? 1 : 0.55,
        })}
        accessibilityRole="radio"
        accessibilityState={{ checked: isSelected, disabled: !owned }}
      >
        {/* Emoji circle */}
        <View style={{
          width: 48,
          height: 48,
          borderRadius: 24,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: isSelected ? `${item.accent}33` : "rgba(255,255,255,0.08)",
          borderWidth: isSelected ? 1.5 : 0,
          borderColor: item.accent,
        }}>
          <Text style={{ fontSize: 24, lineHeight: 30, opacity: owned ? 1 : 0.5 }}>
            {item.emoji}
          </Text>
        </View>

        {/* Text */}
        <View style={{ flex: 1, gap: 4 }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            <Text style={{
              color: owned ? colors.white : colors.whiteSoft,
              fontFamily: isSelected ? fonts.bodyBold : fonts.bodySemiBold,
              fontSize: 15,
            }}>
              {item.label}
            </Text>
            {isSelected && (
              <View style={{
                paddingHorizontal: 7,
                paddingVertical: 2,
                borderRadius: radii.round,
                backgroundColor: item.accent,
              }}>
                <Text style={{ color: colors.ink, fontFamily: fonts.bodyBold, fontSize: 10 }}>
                  AKTIV
                </Text>
              </View>
            )}
            {!owned && (
              <Text style={{ color: "rgba(255,255,255,0.3)", fontFamily: fonts.body, fontSize: 11 }}>
                🔒
              </Text>
            )}
          </View>
          <Text style={{
            color: "rgba(255,255,255,0.5)",
            fontFamily: fonts.body,
            fontSize: 12,
            lineHeight: 16,
          }}>
            {item.description}
          </Text>
          {!owned && <SourceBadge item={item} achievementState={{}} ownedCosmetics={[]} />}
          {!owned && item.source === "shop" && onBuy && (
            <Pressable
              onPress={onBuy}
              style={({ pressed }) => ({
                marginTop: 4,
                alignSelf: "flex-start",
                paddingHorizontal: 12,
                paddingVertical: 6,
                borderRadius: radii.control,
                backgroundColor: colors.sun,
                opacity: pressed ? 0.8 : 1,
              })}
            >
              <Text style={{ color: colors.ink, fontFamily: fonts.bodyBold, fontSize: 12 }}>
                Kaufen {item.price}
              </Text>
            </Pressable>
          )}
        </View>

        {/* Selection indicator */}
        {owned && (
          <View style={{
            width: 22,
            height: 22,
            borderRadius: 11,
            borderWidth: 2,
            borderColor: isSelected ? item.accent : "rgba(255,255,255,0.25)",
            backgroundColor: isSelected ? item.accent : "transparent",
            alignItems: "center",
            justifyContent: "center",
          }}>
            {isSelected && (
              <Text style={{ color: colors.ink, fontFamily: fonts.bodyBold, fontSize: 12, lineHeight: 14 }}>
                ✓
              </Text>
            )}
          </View>
        )}
      </Pressable>
    </Animated.View>
  );
}

// ── Preview bar ───────────────────────────────────────────────────────────────

function PreviewBar({
  selectedBadge,
  selectedTitle,
  selectedWinnerEffect,
  reducedMotion,
}: {
  selectedBadge: string | null;
  selectedTitle: string | null;
  selectedWinnerEffect: string | null;
  reducedMotion: boolean;
}) {
  const badge = COSMETICS.find((c) => c.id === (selectedBadge ?? "badge_default"));
  const title = COSMETICS.find((c) => c.id === (selectedTitle ?? "title_none"));
  const effect = COSMETICS.find((c) => c.id === (selectedWinnerEffect ?? "effect_confetti"));

  return (
    <Animated.View
      entering={reducedMotion ? undefined : FadeIn.duration(300)}
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-around",
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.lg,
        borderRadius: radii.card,
        borderCurve: "continuous",
        backgroundColor: "rgba(255,255,255,0.06)",
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.12)",
        marginBottom: spacing.lg,
      }}
    >
      {[
        { label: "Rahmen", item: badge },
        { label: "Titel", item: title },
        { label: "Effekt", item: effect },
      ].map(({ label, item }) => (
        <View key={label} style={{ alignItems: "center", gap: 4 }}>
          <Text style={{ fontSize: 22 }}>{item?.emoji ?? "—"}</Text>
          <Text style={{ color: colors.whiteSoft, fontFamily: fonts.body, fontSize: 10 }}>
            {label}
          </Text>
          <Text style={{ color: colors.white, fontFamily: fonts.bodySemiBold, fontSize: 12 }}>
            {item?.label ?? "—"}
          </Text>
        </View>
      ))}
    </Animated.View>
  );
}

// ── Main screen ───────────────────────────────────────────────────────────────

export function CosmeticsScreen() {
  const { selectedBadge, selectedTitle, selectedWinnerEffect, ownedCosmetics, setProfile, addOwnedCosmetics } =
    useProfile();
  const reducedMotion = useReducedMotion();
  const { achievements } = useAchievements();

  const [activeTab, setActiveTab] = useState<CosmeticCategory>("badge");

  // Local selections (committed on "Speichern")
  const [localBadge, setLocalBadge] = useState<string>(selectedBadge ?? "badge_default");
  const [localTitle, setLocalTitle] = useState<string>(selectedTitle ?? "title_none");
  const [localEffect, setLocalEffect] = useState<string>(selectedWinnerEffect ?? "effect_confetti");

  const [saved, setSaved] = useState(false);

  // Real persisted achievement unlock map
  const achievementState = Object.fromEntries(
    achievements.map((a) => [a.id, a.isUnlocked])
  );

  const items = getCosmeticsByCategory(activeTab);

  const getLocal = (cat: CosmeticCategory) => {
    if (cat === "badge") return localBadge;
    if (cat === "title") return localTitle;
    return localEffect;
  };

  const setLocal = (cat: CosmeticCategory, id: string) => {
    if (cat === "badge") setLocalBadge(id);
    else if (cat === "title") setLocalTitle(id);
    else setLocalEffect(id);
    setSaved(false);
  };

  const handleSave = async () => {
    await setProfile({
      selectedBadge: localBadge,
      selectedTitle: localTitle,
      selectedWinnerEffect: localEffect,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const hasChanges =
    localBadge !== (selectedBadge ?? "badge_default") ||
    localTitle !== (selectedTitle ?? "title_none") ||
    localEffect !== (selectedWinnerEffect ?? "effect_confetti");

  return (
    <StageScreen stageColor={colors.stageGrape} pattern="dots" scrollEnabled>
      <AppHeader
        title="Kosmetik"
        actionLabel="Zurück"
        onAction={() => (router.canGoBack() ? router.back() : router.replace("/profile"))}
      />

      {/* Preview bar */}
      <PreviewBar
        selectedBadge={localBadge}
        selectedTitle={localTitle}
        selectedWinnerEffect={localEffect}
        reducedMotion={reducedMotion}
      />

      {/* Tab switcher */}
      <View style={{ flexDirection: "row", gap: 8, marginBottom: 4 }}>
        {TABS.map((tab) => {
          const active = activeTab === tab.id;
          return (
            <Pressable
              key={tab.id}
              onPress={() => setActiveTab(tab.id)}
              style={({ pressed }) => ({
                flex: 1,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                gap: 6,
                paddingVertical: 10,
                borderRadius: radii.control,
                borderCurve: "continuous",
                backgroundColor: active ? colors.stageGrape : "rgba(255,255,255,0.08)",
                borderWidth: active ? 1.5 : 1,
                borderColor: active ? "rgba(180,120,255,0.7)" : "rgba(255,255,255,0.12)",
                opacity: pressed ? 0.8 : 1,
              })}
              accessibilityRole="tab"
              accessibilityState={{ selected: active }}
            >
              <Text style={{ fontSize: 15 }}>{tab.emoji}</Text>
              <Text style={{
                color: active ? colors.white : colors.whiteSoft,
                fontFamily: active ? fonts.bodyBold : fonts.body,
                fontSize: 13,
              }}>
                {tab.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {/* Item list */}
      <View style={{ gap: 10 }}>
        {items.map((item, i) => {
          const owned = isOwned(item, ownedCosmetics, achievementState);
          const selected = getLocal(activeTab) === item.id;
          return (
            <CosmeticCard
              key={item.id}
              item={item}
              isSelected={selected}
              owned={owned}
              onPress={() => setLocal(activeTab, item.id)}
              onBuy={item.source === "shop" ? () => void addOwnedCosmetics([item.id]) : undefined}
              index={i}
              reducedMotion={reducedMotion}
            />
          );
        })}
      </View>

      {/* Lock info */}
      {items.some((item) => !isOwned(item, ownedCosmetics, achievementState)) && (
        <Animated.View
          entering={reducedMotion ? undefined : FadeIn.delay(300).duration(300)}
          style={{
            padding: spacing.md,
            paddingHorizontal: spacing.lg,
            borderRadius: radii.card,
            backgroundColor: "rgba(111,43,211,0.12)",
            borderWidth: 1,
            borderColor: "rgba(111,43,211,0.3)",
            gap: 4,
            marginBottom: 100,
          }}
        >
          <Text style={{ color: colors.whiteSoft, fontFamily: fonts.bodySemiBold, fontSize: 13 }}>
            🔒 Gesperrte Kosmetik
          </Text>
          <Text style={{ color: "rgba(255,255,255,0.45)", fontFamily: fonts.body, fontSize: 12, lineHeight: 17 }}>
            Achievement-Items werden durch Spielen freigeschaltet. Shop-Items sind im Runde Shop verfügbar.
          </Text>
        </Animated.View>
      )}

      {/* Save button */}
      <View style={{ paddingBottom: spacing.xl }}>
        <BrandButton
          label={saved ? "✓ Gespeichert!" : hasChanges ? "Auswahl speichern" : "Keine Änderungen"}
          onPress={() => void handleSave()}
          tone="sun"
          disabled={!hasChanges && !saved}
        />
      </View>
    </StageScreen>
  );
}
