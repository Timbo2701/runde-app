import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { useState } from "react";
import { Image, Pressable, Switch, Text, View } from "react-native";
import Animated, { FadeIn, FadeInDown, FadeInUp } from "react-native-reanimated";

import { colors, fonts, radii, spacing } from "@/design/tokens";
import { getInitials } from "@/lib/room";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { AppHeader } from "@/ui/primitives/app-header";
import { BrandButton } from "@/ui/primitives/brand-button";
import { StageScreen } from "@/ui/primitives/stage-screen";
import { TextField } from "@/ui/primitives/text-field";

type Tab = "profil" | "einstellungen";

type Settings = {
  musik: boolean;
  soundeffekte: boolean;
  vibrieren: boolean;
  bewegungseffekte: boolean;
};

function CameraIcon() {
  return (
    <View style={{ width: 16, height: 13, alignItems: "center", justifyContent: "center" }}>
      {/* Kamera-Bump oben */}
      <View style={{
        position: "absolute",
        top: 0,
        width: 6,
        height: 3,
        borderRadius: 1,
        backgroundColor: colors.white,
      }} />
      {/* Kamera-Körper */}
      <View style={{
        position: "absolute",
        bottom: 0,
        width: 16,
        height: 11,
        borderRadius: 2.5,
        backgroundColor: colors.white,
        alignItems: "center",
        justifyContent: "center",
      }}>
        {/* Linse */}
        <View style={{
          width: 5,
          height: 5,
          borderRadius: 3,
          backgroundColor: colors.ink,
          borderWidth: 1.5,
          borderColor: colors.white,
        }} />
      </View>
    </View>
  );
}

const SETTINGS_ROWS: { key: keyof Settings; label: string; sublabel: string }[] = [
  { key: "musik", label: "Musik", sublabel: "Hintergrundmusik während dem Spiel" },
  { key: "soundeffekte", label: "Soundeffekte", sublabel: "Töne bei Aktionen und Ergebnissen" },
  { key: "vibrieren", label: "Vibrieren", sublabel: "Haptisches Feedback bei Interaktionen" },
  { key: "bewegungseffekte", label: "Bewegungseffekte", sublabel: "Animationen und Übergänge" },
];

export function ProfileScreen() {
  const [tab, setTab] = useState<Tab>("profil");
  const [name, setName] = useState("Timo");
  const [photo, setPhoto] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [settings, setSettings] = useState<Settings>({
    musik: true,
    soundeffekte: true,
    vibrieren: true,
    bewegungseffekte: true,
  });
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
      setSaved(false);
    }
  };

  const toggleSetting = (key: keyof Settings) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <StageScreen stageColor={colors.stageCoral} pattern="dots">
      <AppHeader title="Dein Profil" actionLabel="Zurück" onAction={() => router.back()} />

      {/* Tab-Switcher */}
      <Animated.View
        entering={reducedMotion ? undefined : FadeIn.duration(220)}
        style={{
          flexDirection: "row",
          backgroundColor: "rgba(0,0,0,0.18)",
          borderRadius: radii.control,
          padding: 3,
          marginBottom: 24,
        }}
      >
        {(["profil", "einstellungen"] as Tab[]).map((t) => (
          <Pressable
            key={t}
            onPress={() => setTab(t)}
            style={{
              flex: 1,
              paddingVertical: 9,
              borderRadius: radii.control - 2,
              alignItems: "center",
              backgroundColor: tab === t ? colors.surface : "transparent",
            }}
          >
            <Text style={{
              fontFamily: fonts.bodySemiBold,
              fontSize: 14,
              color: tab === t ? colors.ink : colors.whiteSoft,
            }}>
              {t === "profil" ? "Profil" : "Einstellungen"}
            </Text>
          </Pressable>
        ))}
      </Animated.View>

      {/* PROFIL TAB */}
      {tab === "profil" && (
        <Animated.View entering={reducedMotion ? undefined : FadeInUp.duration(240)} style={{ gap: 28 }}>

          {/* Avatar */}
          <View style={{ alignItems: "center", gap: 14 }}>
            <Pressable onPress={pickPhoto} accessibilityLabel="Profilbild ändern" accessibilityRole="button">
              <View style={{
                width: 110,
                height: 110,
                borderRadius: 55,
                overflow: "hidden",
                backgroundColor: colors.sun,
                alignItems: "center",
                justifyContent: "center",
                borderWidth: 4,
                borderColor: colors.surface,
              }}>
                {photo ? (
                  <Image source={{ uri: photo }} style={{ width: 110, height: 110 }} />
                ) : (
                  <Text style={{ color: colors.ink, fontFamily: fonts.displayExtraBold, fontSize: 38 }}>
                    {getInitials(name)}
                  </Text>
                )}
              </View>

              {/* Kamera-Badge */}
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
                borderColor: colors.surface,
              }}>
                <CameraIcon />
              </View>
            </Pressable>

            <View style={{ alignItems: "center", gap: 3 }}>
              <Text style={{ color: colors.white, fontFamily: fonts.displayExtraBold, fontSize: 26 }}>
                {name || "Dein Name"}
              </Text>
              <Text style={{ color: colors.whiteSoft, fontFamily: fonts.body, fontSize: 14 }}>
                So sehen dich deine Freunde
              </Text>
            </View>
          </View>

          {/* Felder */}
          <Animated.View entering={reducedMotion ? undefined : FadeInDown.delay(80).duration(260)} style={{ gap: 14 }}>
            <TextField
              label="Name"
              maxLength={32}
              onChangeText={(v) => { setName(v); setSaved(false); }}
              value={name}
            />
            <BrandButton
              disabled={!name.trim()}
              label={saved ? "Profil gespeichert" : "Profil speichern"}
              onPress={() => setSaved(true)}
              tone="sun"
            />
          </Animated.View>

          {saved && (
            <Animated.Text
              entering={reducedMotion ? undefined : FadeIn.duration(220)}
              accessibilityLiveRegion="polite"
              selectable
              style={{ color: colors.white, fontFamily: fonts.bodySemiBold, fontSize: 14, textAlign: "center" }}
            >
              Sieht gut aus. Dein Profil ist bereit für die nächste Runde.
            </Animated.Text>
          )}
        </Animated.View>
      )}

      {/* EINSTELLUNGEN TAB */}
      {tab === "einstellungen" && (
        <Animated.View entering={reducedMotion ? undefined : FadeInUp.duration(240)} style={{ gap: 10 }}>
          {SETTINGS_ROWS.map((row, index) => (
            <Animated.View
              key={row.key}
              entering={reducedMotion ? undefined : FadeInDown.delay(index * 60).duration(240)}
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 14,
                padding: spacing.xl,
                borderRadius: radii.card,
                borderCurve: "continuous",
                backgroundColor: colors.surface,
              }}
            >
              <View style={{ flex: 1, gap: 2 }}>
                <Text style={{ color: colors.ink, fontFamily: fonts.bodySemiBold, fontSize: 16 }}>
                  {row.label}
                </Text>
                <Text style={{ color: colors.inkMuted, fontFamily: fonts.body, fontSize: 13 }}>
                  {row.sublabel}
                </Text>
              </View>
              <Switch
                value={settings[row.key]}
                onValueChange={() => toggleSetting(row.key)}
                trackColor={{ false: colors.surfaceSoft, true: colors.stageCoral }}
                thumbColor={colors.white}
              />
            </Animated.View>
          ))}
        </Animated.View>
      )}
    </StageScreen>
  );
}
