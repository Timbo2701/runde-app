import { router } from "expo-router";
import { useState } from "react";
import { useProfile } from "@/lib/profile-context";
import { Text, View } from "react-native";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";

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
    <StageScreen stageColor={colors.stageBerry} pattern="confetti">
      <AppHeader showBrand actionLabel="Profil" onAction={() => router.push("/profile")} />

      <Animated.View
        entering={reducedMotion ? undefined : FadeInUp.duration(260)}
        style={{ flex: 1, justifyContent: "center", paddingVertical: 26, gap: 30 }}
      >
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

      <Text selectable style={{ color: colors.whiteSoft, fontFamily: fonts.body, fontSize: 13, textAlign: "center" }}>
        Für Freundesrunden, die noch eine Geschichte brauchen.
      </Text>
    </StageScreen>
  );
}

