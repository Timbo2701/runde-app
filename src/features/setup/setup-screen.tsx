import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { useProfile } from "@/lib/profile-context";
import { Image, Pressable, Text, TextInput, View } from "react-native";
import Animated, { FadeIn, FadeInDown, FadeInUp } from "react-native-reanimated";

import { colors, fonts, radii } from "@/design/tokens";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { BrandButton } from "@/ui/primitives/brand-button";
import { StageScreen } from "@/ui/primitives/stage-screen";

function NameInput({ name, setName }: { name: string; setName: (v: string) => void }) {
  const [focused, setFocused] = useState(false);
  return (
    <View style={{ gap: 6 }}>
      <Text style={{ color: colors.whiteSoft, fontFamily: fonts.bodySemiBold, fontSize: 13, letterSpacing: 0.4 }}>
        Dein Name
      </Text>
      <TextInput
        value={name}
        onChangeText={setName}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder="Wie heißt du?"
        placeholderTextColor="rgba(255,255,255,0.28)"
        maxLength={32}
        style={{
          minHeight: 54,
          backgroundColor: "rgba(255,255,255,0.10)",
          borderRadius: radii.control,
          borderCurve: "continuous",
          borderWidth: 1.5,
          borderColor: focused ? colors.sun : name ? "rgba(255,255,255,0.35)" : "rgba(255,255,255,0.15)",
          paddingHorizontal: 18,
          paddingVertical: 14,
          fontFamily: fonts.bodySemiBold,
          fontSize: 17,
          color: colors.white,
        }}
      />
      <Text style={{ color: "rgba(255,255,255,0.38)", fontFamily: fonts.body, fontSize: 12 }}>
        Leer lassen = zufälliger Name wird vergeben
      </Text>
    </View>
  );
}

function EmailInput({ email, setEmail }: { email: string; setEmail: (v: string) => void }) {
  const [focused, setFocused] = useState(false);
  return (
    <View style={{ gap: 6 }}>
      <Text style={{ color: colors.whiteSoft, fontFamily: fonts.bodySemiBold, fontSize: 13, letterSpacing: 0.4 }}>
        E-Mail
      </Text>
      <TextInput
        value={email}
        onChangeText={setEmail}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder="deine@email.de"
        placeholderTextColor="rgba(255,255,255,0.28)"
        keyboardType="email-address"
        autoCapitalize="none"
        maxLength={80}
        style={{
          minHeight: 54,
          backgroundColor: "rgba(255,255,255,0.10)",
          borderRadius: radii.control,
          borderCurve: "continuous",
          borderWidth: 1.5,
          borderColor: focused ? colors.sun : email ? "rgba(255,255,255,0.35)" : "rgba(255,255,255,0.15)",
          paddingHorizontal: 18,
          paddingVertical: 14,
          fontFamily: fonts.bodySemiBold,
          fontSize: 17,
          color: colors.white,
        }}
      />
    </View>
  );
}

function PasswordInput({ password, setPassword }: { password: string; setPassword: (v: string) => void }) {
  return (
    <View style={{ gap: 6 }}>
      <Text style={{ color: colors.whiteSoft, fontFamily: fonts.bodySemiBold, fontSize: 13 }}>Passwort</Text>
      <TextInput
        value={password}
        onChangeText={setPassword}
        placeholder="Mindestens 6 Zeichen"
        placeholderTextColor="rgba(255,255,255,0.28)"
        secureTextEntry
        style={{ minHeight: 54, backgroundColor: "rgba(255,255,255,0.10)", borderRadius: radii.control, borderWidth: 1.5, borderColor: "rgba(255,255,255,0.15)", paddingHorizontal: 18, fontFamily: fonts.bodySemiBold, fontSize: 17, color: colors.white }}
      />
    </View>
  );
}

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
  const auth = useAuth();
  const [name, setName] = useState("");
  const [photo, setPhoto] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
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
    setBusy(true);
    setMessage(null);
    try {
      if (!auth.session) {
        const result = await auth.signUp(email.trim(), password, finalName, photo);
        if (result.needsEmailConfirmation) {
          setMessage("Bestätige deine E-Mail und melde dich danach an.");
          return;
        }
      } else {
        await auth.completeOnboarding(finalName, photo);
        await profile.refresh();
      }
      router.replace("/");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Konto konnte nicht erstellt werden.");
    } finally {
      setBusy(false);
    }
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
          <NameInput name={name} setName={setName} />

          {!auth.session ? <EmailInput email={email} setEmail={setEmail} /> : null}
          {!auth.session ? <PasswordInput password={password} setPassword={setPassword} /> : null}
        </Animated.View>

        <Animated.View entering={reducedMotion ? undefined : FadeIn.delay(300).duration(280)} style={{ gap: 12, paddingBottom: 8 }}>
          <BrandButton
            label={busy ? "Konto wird erstellt…" : "Los geht's!"}
            onPress={finish}
            tone="sun"
            disabled={busy || (!auth.session && (!email.trim() || password.length < 6))}
          />
          {message ? <Text accessibilityLiveRegion="polite" style={{ color: colors.sun, fontFamily: fonts.bodySemiBold, fontSize: 13, textAlign: "center" }}>{message}</Text> : null}
          <Pressable onPress={() => router.replace("/auth" as never)} style={{ alignItems: "center", paddingVertical: 6 }}>
            <Text style={{ color: colors.whiteSoft, fontFamily: fonts.body, fontSize: 14 }}>
              Schon registriert? Anmelden
            </Text>
          </Pressable>
        </Animated.View>
      </View>
    </StageScreen>
  );
}
