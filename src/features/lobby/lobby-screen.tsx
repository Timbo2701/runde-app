import * as Haptics from "expo-haptics";
import { router, useLocalSearchParams } from "expo-router";
import { Image, Share, Text, View } from "react-native";
import { useProfile } from "@/lib/profile-context";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";

import { getModeById } from "@/data/game-modes";
import { colors, fonts, radii } from "@/design/tokens";
import { getInitials, normalizeRoomCode } from "@/lib/room";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { AppHeader } from "@/ui/primitives/app-header";
import { BrandButton } from "@/ui/primitives/brand-button";
import { SocialSpotlight } from "@/ui/primitives/social-spotlight";
import { StageScreen } from "@/ui/primitives/stage-screen";

const MIKA_AVATAR = "https://i.pravatar.cc/150?img=47";

export function LobbyScreen() {
  const params = useLocalSearchParams<{ code?: string; name?: string; mode?: string }>();
  const code = normalizeRoomCode(params.code ?? "RUND24") || "RUND24";
  const { name: profileName, photo: profilePhoto } = useProfile();
  const myName = profileName || params.name || "Du";
  const gameMode = getModeById(params.mode ?? "klassiker");

  const players = [
    { id: "you", name: myName, color: colors.stageBerry, photo: profilePhoto ?? null },
    { id: "mika", name: "Mika", color: colors.stageCoral, photo: MIKA_AVATAR },
  ];
  const reducedMotion = useReducedMotion();

  const shareRoom = async () => {
    await Share.share({ message: `Komm in meine Runde! Raumcode: ${code}` });
  };

  const startRound = () => {
    if (process.env.EXPO_OS === "ios") void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    router.push({ pathname: "/play", params: { code, mode: gameMode.id } });
  };

  return (
    <StageScreen stageColor={colors.stageGrape} pattern="rings">
      <AppHeader title={`Raum ${code}`} actionLabel="Verlassen" onAction={() => router.replace("/")} />

      <Animated.View entering={reducedMotion ? undefined : FadeInUp.duration(260)} style={{ paddingTop: 20, gap: 26 }}>
        {/* Mode badge */}
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10, alignSelf: "center" }}>
          <View style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 8,
            backgroundColor: "rgba(255,255,255,0.12)",
            paddingHorizontal: 16,
            paddingVertical: 8,
            borderRadius: 999,
            borderWidth: 1,
            borderColor: "rgba(255,255,255,0.2)",
          }}>
            <Text style={{ fontSize: 18 }}>{gameMode.emoji}</Text>
            <Text style={{ color: colors.white, fontFamily: fonts.bodyBold, fontSize: 14 }}>{gameMode.title}</Text>
            <View style={{ width: 1, height: 14, backgroundColor: "rgba(255,255,255,0.3)" }} />
            {gameMode.feelTags.slice(0, 2).map((tag) => (
              <Text key={tag} style={{ color: colors.whiteSoft, fontFamily: fonts.body, fontSize: 12 }}>{tag}</Text>
            ))}
          </View>
        </View>

        <SocialSpotlight
          accent={colors.stageCoral}
          label="Die Runde wird warm"
          sublabel="Zwei Leute sind schon da"
          size={132}
          symbol={
            <View style={{ alignItems: "center" }}>
              <Text style={{ color: colors.ink, fontFamily: fonts.displayExtraBold, fontSize: 48, lineHeight: 50 }}>2</Text>
              <Text style={{ color: colors.ink, fontFamily: fonts.bodyBold, fontSize: 13 }}>Leute</Text>
            </View>
          }
        />

        <Animated.View
          entering={reducedMotion ? undefined : FadeInDown.delay(80).duration(260)}
          style={{
            gap: 16,
            padding: 22,
            borderRadius: radii.card,
            borderCurve: "continuous",
            backgroundColor: colors.surface,
            boxShadow: `0 14px 34px ${colors.shadow}`,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
            <View style={{ gap: 2 }}>
              <Text style={{ color: colors.ink, fontFamily: fonts.bodyBold, fontSize: 18 }}>Mitspieler</Text>
              <Text style={{ color: colors.inkMuted, fontFamily: fonts.body, fontSize: 14 }}>Bereit für die erste Frage</Text>
            </View>
            <Text selectable style={{ color: colors.stageGrapeDeep, fontFamily: fonts.mono, fontSize: 15, letterSpacing: 1 }}>
              {code}
            </Text>
          </View>

          <View style={{ gap: 10 }}>
            {players.map((player, index) => (
              <Animated.View
                key={player.id}
                entering={reducedMotion ? undefined : FadeInDown.delay(130 + index * 55)}
                style={{ flexDirection: "row", alignItems: "center", gap: 12, paddingVertical: 8 }}
              >
                <View style={{ width: 42, height: 42, borderRadius: 21, overflow: "hidden", backgroundColor: player.color, alignItems: "center", justifyContent: "center" }}>
                  {player.photo
                    ? <Image source={{ uri: player.photo }} style={{ width: 42, height: 42 }} />
                    : <Text style={{ color: colors.white, fontFamily: fonts.bodyBold, fontSize: 14 }}>{getInitials(player.name)}</Text>
                  }
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ color: colors.ink, fontFamily: fonts.bodySemiBold, fontSize: 16 }}>{player.name}</Text>
                  <Text style={{ color: colors.inkMuted, fontFamily: fonts.body, fontSize: 13 }}>{index === 0 ? "Du moderierst" : "Ist dabei"}</Text>
                </View>
                <View style={{ width: 9, height: 9, borderRadius: 5, backgroundColor: colors.online }} />
              </Animated.View>
            ))}
          </View>
        </Animated.View>

        <View style={{ gap: 12 }}>
          <BrandButton label="Spiel starten" onPress={startRound} tone="sun" />
          <BrandButton label="Einladung teilen" onPress={() => void shareRoom()} tone="outline" />
        </View>
      </Animated.View>
    </StageScreen>
  );
}
