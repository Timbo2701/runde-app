import { router } from "expo-router";
import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import Animated, { FadeIn, FadeInDown, FadeInUp } from "react-native-reanimated";

import { GAME_MODES } from "@/data/game-modes";
import { colors, fonts, radii, spacing } from "@/design/tokens";
import type { GameModeConfig, GameModeType } from "@/lib/game-types";
import { makeRoomCode } from "@/lib/room";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { AppHeader } from "@/ui/primitives/app-header";
import { BrandButton } from "@/ui/primitives/brand-button";
import { StageScreen } from "@/ui/primitives/stage-screen";

function ModeCard({
  mode,
  selected,
  onPress,
  index,
  reducedMotion,
}: {
  mode: GameModeConfig;
  selected: boolean;
  onPress: () => void;
  index: number;
  reducedMotion: boolean;
}) {
  const unavailable = !mode.isAvailable;

  return (
    <Animated.View entering={reducedMotion ? undefined : FadeInDown.delay(60 + index * 55).duration(260)}>
      <Pressable
        accessibilityRole="radio"
        accessibilityState={{ checked: selected, disabled: unavailable }}
        disabled={unavailable}
        onPress={onPress}
        style={({ pressed }) => ({
          borderRadius: radii.card,
          borderCurve: "continuous",
          borderWidth: 2,
          borderColor: selected ? colors.sun : unavailable ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.2)",
          backgroundColor: selected
            ? colors.surface
            : unavailable
            ? "rgba(255,255,255,0.05)"
            : "rgba(255,255,255,0.1)",
          padding: spacing.xl,
          opacity: unavailable ? 0.58 : pressed ? 0.88 : 1,
          gap: 12,
        })}
      >
        {/* Top row */}
        <View style={{ flexDirection: "row", alignItems: "flex-start", gap: 14 }}>
          {/* Emoji badge */}
          <View
            style={{
              width: 52,
              height: 52,
              borderRadius: 16,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: selected ? `${mode.accentColor}22` : "rgba(255,255,255,0.1)",
            }}
          >
            <Text style={{ fontSize: 26 }}>{mode.emoji}</Text>
          </View>

          <View style={{ flex: 1, gap: 2 }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
              <Text
                style={{
                  color: selected ? colors.ink : colors.white,
                  fontFamily: fonts.displayExtraBold,
                  fontSize: 20,
                }}
              >
                {mode.title}
              </Text>
              {mode.comingSoon && (
                <View
                  style={{
                    backgroundColor: "rgba(255,255,255,0.15)",
                    paddingHorizontal: 8,
                    paddingVertical: 3,
                    borderRadius: radii.round,
                  }}
                >
                  <Text style={{ color: colors.whiteSoft, fontFamily: fonts.mono, fontSize: 10 }}>BALD</Text>
                </View>
              )}
              {selected && !mode.comingSoon && (
                <View
                  style={{
                    backgroundColor: mode.accentColor,
                    paddingHorizontal: 8,
                    paddingVertical: 3,
                    borderRadius: radii.round,
                  }}
                >
                  <Text style={{ color: colors.white, fontFamily: fonts.mono, fontSize: 10 }}>GEWÄHLT</Text>
                </View>
              )}
            </View>
            <Text
              style={{
                color: selected ? colors.inkMuted : colors.whiteSoft,
                fontFamily: fonts.bodyMedium,
                fontSize: 13,
                fontStyle: "italic",
              }}
            >
              {mode.hook}
            </Text>
          </View>
        </View>

        {/* Description */}
        <Text
          style={{
            color: selected ? colors.inkMuted : colors.whiteSoft,
            fontFamily: fonts.body,
            fontSize: 14,
            lineHeight: 20,
          }}
        >
          {mode.description}
        </Text>

        {/* Bottom: feel tags + meta */}
        <View style={{ flexDirection: "row", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
          {mode.feelTags.map((tag) => (
            <View
              key={tag}
              style={{
                backgroundColor: selected ? `${mode.accentColor}22` : "rgba(255,255,255,0.1)",
                paddingHorizontal: 10,
                paddingVertical: 4,
                borderRadius: radii.round,
              }}
            >
              <Text
                style={{
                  color: selected ? mode.accentColor : colors.whiteSoft,
                  fontFamily: fonts.bodySemiBold,
                  fontSize: 12,
                }}
              >
                {tag}
              </Text>
            </View>
          ))}
          <View style={{ flex: 1 }} />
          <Text style={{ color: colors.whiteSoft, fontFamily: fonts.body, fontSize: 12 }}>
            {mode.recommendedPlayers.min}–{mode.recommendedPlayers.max} Leute · ~{mode.estimatedMinutes} min
          </Text>
        </View>
      </Pressable>
    </Animated.View>
  );
}

export function ModeSelectScreen() {
  const [selectedMode, setSelectedMode] = useState<GameModeType>("klassiker");
  const reducedMotion = useReducedMotion();

  const handleStart = () => {
    const code = makeRoomCode();
    router.replace({ pathname: "/lobby", params: { code, mode: selectedMode } });
  };

  return (
    <StageScreen stageColor={colors.stageGrape} pattern="rings" scrollEnabled>
      <AppHeader
        title="Spielmodus"
        actionLabel="Zurück"
        onAction={() => (router.canGoBack() ? router.back() : router.replace("/"))}
      />

      <Animated.View
        entering={reducedMotion ? undefined : FadeInUp.duration(240)}
        style={{ paddingTop: 8, paddingBottom: 6, gap: 4 }}
      >
        <Text
          style={{
            color: colors.white,
            fontFamily: fonts.displayExtraBold,
            fontSize: 32,
            lineHeight: 36,
          }}
        >
          Was wird heute gespielt?
        </Text>
        <Text style={{ color: colors.whiteSoft, fontFamily: fonts.body, fontSize: 15 }}>
          Wähle einen Modus. Die Gruppe entscheidet den Rest.
        </Text>
      </Animated.View>

      <Animated.View
        entering={reducedMotion ? undefined : FadeIn.delay(40).duration(220)}
        style={{ gap: 12, marginTop: 16 }}
      >
        {GAME_MODES.map((mode, index) => (
          <ModeCard
            key={mode.id}
            mode={mode}
            selected={selectedMode === mode.id}
            onPress={() => setSelectedMode(mode.id)}
            index={index}
            reducedMotion={reducedMotion}
          />
        ))}
      </Animated.View>

      <Animated.View
        entering={reducedMotion ? undefined : FadeIn.delay(420).duration(260)}
        style={{ marginTop: 24, gap: 12 }}
      >
        <BrandButton label="Raum erstellen →" onPress={handleStart} tone="sun" />
        <BrandButton
          label="Abbrechen"
          onPress={() => (router.canGoBack() ? router.back() : router.replace("/"))}
          tone="outline"
        />
      </Animated.View>
    </StageScreen>
  );
}
