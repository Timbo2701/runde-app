import { router } from "expo-router";
import { useState } from "react";
import { Text, View } from "react-native";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";

import { colors, fonts } from "@/design/tokens";
import { getInitials } from "@/lib/room";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { AppHeader } from "@/ui/primitives/app-header";
import { BrandButton } from "@/ui/primitives/brand-button";
import { SocialSpotlight } from "@/ui/primitives/social-spotlight";
import { StageScreen } from "@/ui/primitives/stage-screen";
import { TextField } from "@/ui/primitives/text-field";

export function ProfileScreen() {
  const [name, setName] = useState("Timo");
  const [vibe, setVibe] = useState("Erzählt die besten Geschichten");
  const [saved, setSaved] = useState(false);
  const reducedMotion = useReducedMotion();

  return (
    <StageScreen stageColor={colors.stageCoral} pattern="dots">
      <AppHeader title="Dein Profil" actionLabel="Zurück" onAction={() => router.back()} />

      <Animated.View entering={reducedMotion ? undefined : FadeInUp.duration(260)} style={{ flex: 1, justifyContent: "center", paddingVertical: 26, gap: 28 }}>
        <SocialSpotlight
          accent={colors.sun}
          label={name || "Dein Name"}
          sublabel="So sehen dich deine Freunde"
          size={142}
          symbol={
            <View
              style={{
                width: 92,
                height: 92,
                borderRadius: 46,
                alignItems: "center",
                justifyContent: "center",
                borderWidth: 5,
                borderColor: colors.ink,
                backgroundColor: colors.surface,
                transform: [{ rotate: "-4deg" }],
              }}
            >
              <Text style={{ color: colors.ink, fontFamily: fonts.displayExtraBold, fontSize: 34 }}>{getInitials(name)}</Text>
            </View>
          }
        />

        <Animated.View entering={reducedMotion ? undefined : FadeInDown.delay(80).duration(260)} style={{ gap: 16 }}>
          <TextField label="Name" maxLength={32} onChangeText={(value) => { setName(value); setSaved(false); }} value={name} />
          <TextField label="Dein Vibe" maxLength={56} onChangeText={(value) => { setVibe(value); setSaved(false); }} value={vibe} />
          <BrandButton disabled={!name.trim()} label={saved ? "Profil gespeichert" : "Profil speichern"} onPress={() => setSaved(true)} tone="sun" />
        </Animated.View>

        {saved ? (
          <Text accessibilityLiveRegion="polite" selectable style={{ color: colors.white, fontFamily: fonts.bodySemiBold, fontSize: 14, textAlign: "center" }}>
            Sieht gut aus. Dein Profil ist bereit für die nächste Runde.
          </Text>
        ) : null}
      </Animated.View>
    </StageScreen>
  );
}

