import { router } from "expo-router";
import { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";

import { colors, fonts, radii, spacing } from "@/design/tokens";
import { useAuth } from "@/lib/auth-context";
import { BrandButton } from "@/ui/primitives/brand-button";
import { StageScreen } from "@/ui/primitives/stage-screen";

export function AuthScreen() {
  const { signIn, configured } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const login = async () => {
    setBusy(true);
    setMessage(null);
    try {
      await signIn(email.trim(), password);
      router.replace("/");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Anmeldung fehlgeschlagen.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <StageScreen stageColor={colors.stageGrapeDeep} pattern="rings">
      <View style={{ flex: 1, justifyContent: "center", gap: spacing.xl }}>
        <View style={{ gap: 8 }}>
          <Text style={{ color: colors.sun, fontFamily: fonts.mono, fontSize: 12, letterSpacing: 1.6 }}>WILLKOMMEN ZURÜCK</Text>
          <Text style={{ color: colors.white, fontFamily: fonts.displayExtraBold, fontSize: 36, lineHeight: 40 }}>Deine Runde wartet.</Text>
          <Text style={{ color: colors.whiteSoft, fontFamily: fonts.body, fontSize: 15 }}>Melde dich an und spiele mit deinem echten Profil weiter.</Text>
        </View>

        <View style={{ gap: 14, padding: spacing.xl, borderRadius: radii.card, backgroundColor: "rgba(0,0,0,0.24)", borderWidth: 1, borderColor: colors.whiteFaint }}>
          <TextInput value={email} onChangeText={setEmail} placeholder="E-Mail" placeholderTextColor="rgba(255,255,255,0.35)" autoCapitalize="none" keyboardType="email-address" style={{ minHeight: 54, borderRadius: radii.control, backgroundColor: "rgba(255,255,255,0.1)", color: colors.white, paddingHorizontal: 16, fontFamily: fonts.body }} />
          <TextInput value={password} onChangeText={setPassword} placeholder="Passwort" placeholderTextColor="rgba(255,255,255,0.35)" secureTextEntry style={{ minHeight: 54, borderRadius: radii.control, backgroundColor: "rgba(255,255,255,0.1)", color: colors.white, paddingHorizontal: 16, fontFamily: fonts.body }} />
          <BrandButton label={busy ? "Wird angemeldet…" : "Anmelden"} onPress={() => void login()} tone="sun" disabled={busy || !configured || !email.trim() || password.length < 6} />
          {message ? <Text accessibilityLiveRegion="polite" style={{ color: colors.stageCoral, fontFamily: fonts.bodySemiBold, fontSize: 13 }}>{message}</Text> : null}
          {!configured ? (
            <Text accessibilityRole="alert" style={{ color: colors.sun, fontFamily: fonts.body, fontSize: 12, lineHeight: 18 }}>
              Dieser Build hat keine Supabase-Konfiguration. Bitte EXPO_PUBLIC_SUPABASE_URL und den Publishable Key im Build-System hinterlegen und die App neu bauen.
            </Text>
          ) : null}
        </View>

        <Pressable onPress={() => router.replace("/onboarding" as never)} style={{ alignItems: "center", padding: 10 }}>
          <Text style={{ color: colors.whiteSoft, fontFamily: fonts.bodySemiBold, fontSize: 14 }}>Noch kein Konto? Konto erstellen</Text>
        </Pressable>
      </View>
    </StageScreen>
  );
}
