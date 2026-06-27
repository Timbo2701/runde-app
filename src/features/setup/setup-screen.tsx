import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { useState } from "react";
import { useProfile } from "@/lib/profile-context";
import { Image, Pressable, Text, TextInput, View } from "react-native";
import Animated, { FadeIn, FadeInDown, FadeInUp } from "react-native-reanimated";

import { colors, fonts, radii, spacing } from "@/design/tokens";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { BrandButton } from "@/ui/primitives/brand-button";
import { StageScreen } from "@/ui/primitives/stage-screen";

const ADJECTIVES = ["Coole", "Wilde", "Lustige", "Schnelle", "Mutige"];
const NOUNS = ["Banane", "Katze", "Rakete", "Kokosnuss", "Ente", "Pinguin"];

function randomName() {
  const adj = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
  const noun = NOUNS[Math.floor(Math.random() * NOUNS.length)];
  return `${adj}${noun}`;
}

function CameraIcon() {
  return (
    <View style={{ width: 16, height: 13, alignItems: "center", justifyContent: "center" }}>
      <View style={{ position: "absolute", top: 0, width: 6, height: 3, borderRadius: 1, backgroundColor: colors.white }} />
      <View style={{ position: "absolute", bottom: 0, width: 16, height: 11, borderRadius: 2.5, backgroundColor: colors.white, alignItems: "center", justifyContent: "center" }}>
        <View style={{ width: 5, height: 5, borderRadius: 3, backgroundColor: colors.ink, borderWidth: 1.5, borderColor: colors.white }} />
      </View>
    </View>
  );
}

export function SetupScreen() {
  const profile = useProfile();
  const [name, setName] = useState("");
  const [photo, setPhoto] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const reducedMotion = useReducedMotion();

  const pickPhoto = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled && result.assets[0]) {
      setPhoto(result.assets[0].uri);
    }
  };

  const finish = async () => {
    const finalName = name.trim() || randomName();
    await AsyncStorage.setItem("@runde:onboarding_done", "1");
    await profile.setProfile({ name: finalName, photo, email: email.trim() });
    router.replace("/");
  };

  const initials = name.trim() ? name.trim()[0].toUpperCase() : "?";

  return (
    <StageScreen stageColor={colors.stageBerry} pattern="confetti">
      <View style={{ flex: 1, justifyContent: "space-between", gap: 24 }}>
        <Animated.View entering={reducedMotion ? undefined : FadeInUp.duration(280)} style={{ gap: 6, paddingTop: 16 }}>
          <Text style={{ color: colors.sun, fontFamily: fonts.bodyBold, fontSize: 12, letterSpacing: 1.4 }}>
            SCHRITT 2 VON 2
          </Text>
          <Text style={{ color: colors.white, fontFamily: fonts.displayExtraBold, fontSize: 30, lineHeight: 34 }}>
            Erstelle dein Profil
          </Text>
          <Text style={{ color: colors.whiteSoft, fontFamily: fonts.body, fontSize: 15 }}>
            So erkennen dich deine Freunde in der Runde.
          </Text>
        </Animated.View>

        <Animated.View entering={reducedMotion ? undefined : FadeInDown.delay(80).duration(280)} style={{ gap: 28, flex: 1, justifyContent: "center" }}>
          {/* Avatar picker */}
          <View style={{ alignItems: "center" }}>
            <Pressable onPress={pickPhoto} accessibilityLabel="Profilbild wählen" accessibilityRole="button">
              <View style={{
                width: 110,
                height: 110,
                borderRadius: 55,
                backgroundColor: colors.sun,
                alignItems: "center",
                justifyContent: "center",
                borderWidth: 4,
                borderColor: colors.whiteFaint,
                overflow: "hidden",
              }}>
                {photo ? (
                  <Image source={{ uri: photo }} style={{ width: 110, height: 110 }} />
                ) : (
                  <Text style={{ color: colors.ink, fontFamily: fonts.displayExtraBold, fontSize: 42 }}>
                    {initials}
                  </Text>
                )}
              </View>
              <View style={{
                position: "absolute",
                bottom: 2,
                right: 2,
                width: 32,
                height: 32,
                borderRadius: 16,
                backgroundColor: colors.ink,
                alignItems: "center",
                justifyContent: "center",
                borderWidth: 2,
                borderColor: colors.whiteFaint,
              }}>
                <CameraIcon />
              </View>
            </Pressable>
            <Text style={{ color: colors.whiteSoft, fontFamily: fonts.body, fontSize: 13, marginTop: 10 }}>
              Profilbild festlegen (optional)
            </Text>
          </View>

          {/* Name */}
          <View style={{ gap: 8 }}>
            <Text style={{ color: colors.white, fontFamily: fonts.bodySemiBold, fontSize: 14 }}>
              Dein Name
            </Text>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="Wie heißt du?"
              placeholderTextColor={colors.inkMuted}
              maxLength={32}
              style={{
                backgroundColor: colors.surface,
                borderRadius: radii.control,
                paddingHorizontal: spacing.xl,
                paddingVertical: 14,
                fontFamily: fonts.body,
                fontSize: 16,
                color: colors.ink,
              }}
            />
            <Text style={{ color: colors.whiteSoft, fontFamily: fonts.body, fontSize: 12 }}>
              Leer lassen = zufälliger Name wird vergeben
            </Text>
          </View>

          {/* Email (Placeholder) */}
          <View style={{ gap: 8 }}>
            <Text style={{ color: colors.white, fontFamily: fonts.bodySemiBold, fontSize: 14 }}>
              E-Mail verknüpfen{" "}
              <Text style={{ color: colors.whiteSoft, fontFamily: fonts.body, fontSize: 13 }}>(optional)</Text>
            </Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="deine@email.de"
              placeholderTextColor={colors.inkMuted}
              keyboardType="email-address"
              autoCapitalize="none"
              maxLength={80}
              style={{
                backgroundColor: colors.surface,
                borderRadius: radii.control,
                paddingHorizontal: spacing.xl,
                paddingVertical: 14,
                fontFamily: fonts.body,
                fontSize: 16,
                color: colors.ink,
              }}
            />
            <View style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 8,
              backgroundColor: "rgba(255,255,255,0.08)",
              borderRadius: radii.control,
              padding: 12,
            }}>
              <Text style={{ fontSize: 16 }}>🔒</Text>
              <Text style={{ color: colors.whiteSoft, fontFamily: fonts.body, fontSize: 12, flex: 1 }}>
                Dein Konto wird gespeichert – so behältst du deine Siege auch auf neuen Geräten.
              </Text>
            </View>
          </View>
        </Animated.View>

        <Animated.View entering={reducedMotion ? undefined : FadeIn.delay(300).duration(280)} style={{ gap: 12, paddingBottom: 8 }}>
          <BrandButton
            label="Los geht's!"
            onPress={finish}
            tone="sun"
          />
          <Pressable onPress={finish} style={{ alignItems: "center", paddingVertical: 6 }}>
            <Text style={{ color: colors.whiteSoft, fontFamily: fonts.body, fontSize: 14 }}>
              Überspringen
            </Text>
          </Pressable>
        </Animated.View>
      </View>
    </StageScreen>
  );
}
