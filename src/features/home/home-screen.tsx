import { router } from "expo-router";
import { useState } from "react";
import { useProfile } from "@/lib/profile-context";
import { Pressable, Text, View } from "react-native";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { BottomNav } from "@/ui/primitives/bottom-nav";

import { colors, fonts } from "@/design/tokens";
import { isRoomCodeReady, normalizeRoomCode } from "@/lib/room";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { AppHeader } from "@/ui/primitives/app-header";
import { BrandButton } from "@/ui/primitives/brand-button";
import { SocialSpotlight } from "@/ui/primitives/social-spotlight";
import { StageScreen } from "@/ui/primitives/stage-screen";
import { TextField } from "@/ui/primitives/text-field";

export function HomeScreen() {
  const [roomCode, setRoomCode] = useState("");
  const reducedMotion = useReducedMotion();
  const { name: profileName } = useProfile();
  const playerName = profileName || "Du";

  const joinRoom = () => {
    if (!isRoomCodeReady(roomCode)) return;
    router.push({ pathname: "/lobby", params: { code: normalizeRoomCode(roomCode), name: playerName } });
  };

  const createRoom = () => {
    router.push("/mode-select");
  };

  return (
    <View style={{ flex: 1 }}>
    <StageScreen stageColor={colors.stageBerry} pattern="confetti">
      <AppHeader showBrand />

      <Animated.View
        entering={reducedMotion ? undefined : FadeInUp.duration(260)}
        style={{ flex: 1, justifyContent: "center", paddingVertical: 26, gap: 30 }}
      >
        {/* Ranked Arena teaser */}
        <Pressable
          onPress={() => router.push("/ranked" as never)}
          style={({ pressed }) => ({
            flexDirection: "row",
            alignItems: "center",
            gap: 12,
            padding: 14,
            borderRadius: 20,
            backgroundColor: "rgba(111,43,211,0.35)",
            borderWidth: 1.5,
            borderColor: "rgba(111,43,211,0.6)",
            opacity: pressed ? 0.85 : 1,
          })}
          accessibilityRole="button"
        >
          <Text style={{ fontSize: 24 }}>⚔️</Text>
          <View style={{ flex: 1 }}>
            <Text style={{ color: colors.sun, fontFamily: fonts.bodyBold, fontSize: 13 }}>
              Ranked Arena
            </Text>
            <Text style={{ color: colors.whiteSoft, fontFamily: fonts.body, fontSize: 12 }}>
              Steig auf – Neon Season 1 läuft!
            </Text>
          </View>
          <Text style={{ color: colors.sun, fontFamily: fonts.bodyBold, fontSize: 16 }}>→</Text>
        </Pressable>
        <SocialSpotlight label="Wer ist heute dabei?" sublabel="Ein Code. Eine Runde. Viele Geschichten." />

        <Animated.View entering={reducedMotion ? undefined : FadeInDown.delay(90).duration(260)} style={{ gap: 14 }}>
          <TextField
            autoCapitalize="characters"
            label="Raumcode"
            maxLength={6}
            onChangeText={(value) => setRoomCode(normalizeRoomCode(value))}
            onSubmitEditing={joinRoom}
            placeholder="ABC123"
            value={roomCode}
            variant="code"
          />
          <BrandButton disabled={!isRoomCodeReady(roomCode)} label="Runde beitreten" onPress={joinRoom} tone="ink" />

          <View style={{ flexDirection: "row", alignItems: "center", gap: 12, paddingVertical: 3 }}>
            <View style={{ height: 1, flex: 1, backgroundColor: colors.borderOnColor }} />
            <Text style={{ color: colors.whiteSoft, fontFamily: fonts.bodyMedium, fontSize: 13 }}>oder</Text>
            <View style={{ height: 1, flex: 1, backgroundColor: colors.borderOnColor }} />
          </View>

          <BrandButton label="Neue Runde starten" onPress={createRoom} tone="sun" />
        </Animated.View>
      </Animated.View>

      <View style={{ gap: 12 }}>
        <Text selectable style={{ color: colors.whiteSoft, fontFamily: fonts.body, fontSize: 13, textAlign: "center" }}>
          Für Freundesrunden, die noch eine Geschichte brauchen.
        </Text>
        <Pressable
          onPress={() => router.push("/shop" as never)}
          style={({ pressed }) => ({
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: 6,
            opacity: pressed ? 0.7 : 1,
            paddingVertical: 4,
          })}
          accessibilityRole="button"
        >
          <Text style={{ fontSize: 14 }}>🛍️</Text>
          <Text style={{ color: colors.whiteSoft, fontFamily: fonts.bodySemiBold, fontSize: 13 }}>
            Shop
          </Text>
          <Text style={{ color: colors.sun, fontFamily: fonts.bodyBold, fontSize: 13 }}>✨</Text>
        </Pressable>
      </View>
    </StageScreen>
    <BottomNav activeTab="party" />
    </View>
  );
}

