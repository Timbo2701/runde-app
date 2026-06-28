import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { useState } from "react";
import { Image, Pressable, Share, Switch, Text, View } from "react-native";
import Animated, { FadeIn, FadeInDown, FadeInUp } from "react-native-reanimated";

import { COSMETICS } from "@/data/cosmetics";
import { colors, fonts, radii, spacing } from "@/design/tokens";
import { useAchievements } from "@/lib/use-achievements";
import { getInitials } from "@/lib/room";
import { useProfile } from "@/lib/profile-context";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import type { Achievement } from "@/types/achievements";
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
      <View style={{ position: "absolute", top: 0, width: 6, height: 3, borderRadius: 1, backgroundColor: colors.white }} />
      <View style={{ position: "absolute", bottom: 0, width: 16, height: 11, borderRadius: 2.5, backgroundColor: colors.white, alignItems: "center", justifyContent: "center" }}>
        <View style={{ width: 5, height: 5, borderRadius: 3, backgroundColor: colors.ink, borderWidth: 1.5, borderColor: colors.white }} />
      </View>
    </View>
  );
}

function AchievementPill({ achievement }: { achievement: Achievement }) {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        backgroundColor: achievement.isUnlocked
          ? "rgba(255,216,77,0.15)"
          : "rgba(255,255,255,0.06)",
        borderWidth: 1,
        borderColor: achievement.isUnlocked
          ? "rgba(255,216,77,0.4)"
          : "rgba(255,255,255,0.1)",
        borderRadius: radii.control,
        paddingHorizontal: 12,
        paddingVertical: 9,
      }}
    >
      <Text style={{ fontSize: 20, opacity: achievement.isUnlocked ? 1 : 0.4 }}>
        {achievement.emoji}
      </Text>
      <View style={{ flex: 1, gap: 1 }}>
        <Text
          style={{
            color: achievement.isUnlocked ? colors.white : colors.whiteSoft,
            fontFamily: fonts.bodySemiBold,
            fontSize: 13,
            opacity: achievement.isUnlocked ? 1 : 0.6,
          }}
        >
          {achievement.title}
        </Text>
        {achievement.progress && !achievement.isUnlocked && (
          <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
            <View
              style={{
                flex: 1,
                height: 3,
                borderRadius: 2,
                backgroundColor: "rgba(255,255,255,0.12)",
                overflow: "hidden",
              }}
            >
              <View
                style={{
                  height: 3,
                  width: `${Math.min(
                    100,
                    (achievement.progress.current / achievement.progress.target) * 100
                  )}%`,
                  borderRadius: 2,
                  backgroundColor: colors.sun,
                }}
              />
            </View>
            <Text style={{ color: colors.whiteSoft, fontFamily: fonts.mono, fontSize: 10 }}>
              {achievement.progress.current}/{achievement.progress.target}
            </Text>
          </View>
        )}
      </View>
      {achievement.isUnlocked && (
        <View
          style={{
            width: 20,
            height: 20,
            borderRadius: 10,
            backgroundColor: colors.sun,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text style={{ color: colors.ink, fontSize: 10, fontFamily: fonts.bodyBold }}>✓</Text>
        </View>
      )}
    </View>
  );
}

const SETTINGS_ROWS: { key: keyof Settings; label: string; sublabel: string; emoji: string; accentColor: string }[] = [
  { key: "musik", label: "Musik", sublabel: "Hintergrundmusik im Spiel", emoji: "🎵", accentColor: colors.stageGrape },
  { key: "soundeffekte", label: "Soundeffekte", sublabel: "Töne bei Aktionen & Ergebnissen", emoji: "🔊", accentColor: colors.stageCoral },
  { key: "vibrieren", label: "Vibrieren", sublabel: "Haptik bei Interaktionen", emoji: "📳", accentColor: colors.stageBerry },
  { key: "bewegungseffekte", label: "Animationen", sublabel: "Übergänge & Bewegungseffekte", emoji: "✨", accentColor: colors.sun },
];

export function ProfileScreen() {
  const profile = useProfile();
  const [tab, setTab] = useState<Tab>("profil");
  const [name, setName] = useState(profile.name || "");
  const [photo, setPhoto] = useState<string | null>(profile.photo);
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

  const shareProfile = async () => {
    const displayName = name.trim() || "Anonym";
    await Share.share({ message: `Spiel Runde mit mir! Mein Name: ${displayName}` });
  };

  const toggleSetting = (key: keyof Settings) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Mock stats
  const statsRows = [
    { emoji: "🎮", label: "Runden", value: String(profile.roundsPlayed || 0) },
    { emoji: "🏆", label: "Siege", value: String(profile.wins || 0) },
    { emoji: "⚡", label: "Lieblingsmodus", value: "Klassiker" },
    { emoji: "🎯", label: "Beste Kategorie", value: "Schätzen" },
  ];

  const { achievements } = useAchievements();
  const previewAchievements = achievements.slice(0, 4);
  const unlockedCount = achievements.filter((a) => a.isUnlocked).length;

  return (
    <StageScreen stageColor={colors.stageCoral} pattern="dots" scrollEnabled>
      <AppHeader title="Dein Profil" actionLabel="Zurück" onAction={() => router.canGoBack() ? router.back() : router.replace("/")} />

      {/* Tab-Switcher */}
      <Animated.View
        entering={reducedMotion ? undefined : FadeIn.duration(220)}
        style={{
          flexDirection: "row",
          backgroundColor: "rgba(0,0,0,0.18)",
          borderRadius: radii.control,
          padding: 3,
          marginTop: 16,
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
        <Animated.View entering={reducedMotion ? undefined : FadeInUp.duration(240)} style={{ gap: 24, paddingBottom: 16 }}>

          {/* Avatar */}
          <View style={{ alignItems: "center", gap: 14 }}>
            <Pressable onPress={pickPhoto} accessibilityLabel="Profilbild ändern" accessibilityRole="button">
              {/* Glow ring */}
              <View style={{
                width: 122,
                height: 122,
                borderRadius: 61,
                backgroundColor: "rgba(255,255,255,0.2)",
                alignItems: "center",
                justifyContent: "center",
              }}>
                <View style={{
                  width: 114,
                  height: 114,
                  borderRadius: 57,
                  overflow: "hidden",
                  backgroundColor: colors.sun,
                  alignItems: "center",
                  justifyContent: "center",
                  borderWidth: 3,
                  borderColor: colors.white,
                }}>
                  {photo ? (
                    <Image source={{ uri: photo }} style={{ width: 114, height: 114 }} />
                  ) : (
                    <Text style={{ color: colors.ink, fontFamily: fonts.displayExtraBold, fontSize: 40 }}>
                      {getInitials(name || "?")}
                    </Text>
                  )}
                </View>
              </View>

              {/* Kamera-Badge */}
              <View style={{
                position: "absolute",
                bottom: 4,
                right: 4,
                width: 32,
                height: 32,
                borderRadius: 16,
                backgroundColor: colors.ink,
                alignItems: "center",
                justifyContent: "center",
                borderWidth: 2,
                borderColor: colors.white,
              }}>
                <CameraIcon />
              </View>
            </Pressable>

            <View style={{ alignItems: "center", gap: 4 }}>
              <Text style={{ color: colors.white, fontFamily: fonts.displayExtraBold, fontSize: 28 }}>
                {name || "Dein Name"}
              </Text>
              {/* Titel-Badge (mock) */}
              {profile.selectedTitle ? (
                <View style={{
                  backgroundColor: "rgba(255,216,77,0.2)",
                  borderWidth: 1,
                  borderColor: "rgba(255,216,77,0.5)",
                  paddingHorizontal: 12,
                  paddingVertical: 4,
                  borderRadius: radii.round,
                }}>
                  <Text style={{ color: colors.sun, fontFamily: fonts.bodySemiBold, fontSize: 12 }}>
                    {COSMETICS.find((c) => c.id === profile.selectedTitle)?.label ?? profile.selectedTitle}
                  </Text>
                </View>
              ) : (
                <Text style={{ color: colors.whiteSoft, fontFamily: fonts.body, fontSize: 13 }}>
                  So sehen dich deine Freunde
                </Text>
              )}
            </View>
          </View>

          {/* Stats 2×2 Grid */}
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10 }}>
            {statsRows.map((stat) => (
              <View
                key={stat.label}
                style={{
                  flex: 1,
                  minWidth: "44%",
                  backgroundColor: "rgba(0,0,0,0.2)",
                  borderRadius: radii.control,
                  padding: spacing.lg,
                  gap: 4,
                  alignItems: "flex-start",
                }}
              >
                <Text style={{ fontSize: 18 }}>{stat.emoji}</Text>
                <Text style={{ color: colors.white, fontFamily: fonts.bodyBold, fontSize: 18, lineHeight: 22 }}>
                  {stat.value}
                </Text>
                <Text style={{ color: colors.whiteSoft, fontFamily: fonts.body, fontSize: 11 }}>
                  {stat.label}
                </Text>
              </View>
            ))}
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
              label={saved ? "✓ Gespeichert" : "Profil speichern"}
              onPress={() => { profile.setProfile({ name: name.trim(), photo }); setSaved(true); }}
              tone="sun"
            />
          </Animated.View>

          {/* Achievements Preview */}
          <View style={{ gap: 12 }}>
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
              <Text style={{ color: colors.white, fontFamily: fonts.bodyBold, fontSize: 16 }}>
                Achievements
              </Text>
              <View style={{
                backgroundColor: "rgba(255,216,77,0.2)",
                paddingHorizontal: 10,
                paddingVertical: 3,
                borderRadius: radii.round,
              }}>
                <Text style={{ color: colors.sun, fontFamily: fonts.mono, fontSize: 11 }}>
                  {unlockedCount}/{achievements.length}
                </Text>
              </View>
            </View>
            <View style={{ gap: 8 }}>
              {previewAchievements.map((a) => (
                <AchievementPill key={a.id} achievement={a} />
              ))}
            </View>
          </View>

          {/* Kosmetik Banner */}
          <Pressable
            onPress={() => router.push("/cosmetics" as never)}
            style={({ pressed }) => ({
              borderRadius: radii.card,
              borderCurve: "continuous",
              backgroundColor: "rgba(111,43,211,0.12)",
              borderWidth: 1.5,
              borderColor: "rgba(111,43,211,0.4)",
              padding: spacing.xl,
              flexDirection: "row",
              alignItems: "center",
              gap: 14,
              opacity: pressed ? 0.85 : 1,
            })}
            accessibilityRole="button"
          >
            <Text style={{ fontSize: 28 }}>🎨</Text>
            <View style={{ flex: 1, gap: 3 }}>
              <Text style={{ color: colors.white, fontFamily: fonts.bodyBold, fontSize: 16 }}>
                Kosmetik
              </Text>
              <Text style={{ color: colors.whiteSoft, fontFamily: fonts.body, fontSize: 12 }}>
                Rahmen, Titel & Gewinner-Effekte auswählen
              </Text>
            </View>
            <Text style={{ color: "#b78af0", fontFamily: fonts.bodyBold, fontSize: 18 }}>→</Text>
          </Pressable>

          {/* Shop Banner */}
          <Pressable
            onPress={() => router.push("/shop" as never)}
            style={({ pressed }) => ({
              borderRadius: radii.card,
              borderCurve: "continuous",
              backgroundColor: "rgba(255,216,77,0.12)",
              borderWidth: 1.5,
              borderColor: "rgba(255,216,77,0.35)",
              padding: spacing.xl,
              flexDirection: "row",
              alignItems: "center",
              gap: 14,
              opacity: pressed ? 0.85 : 1,
            })}
            accessibilityRole="button"
          >
            <Text style={{ fontSize: 28 }}>🛍️</Text>
            <View style={{ flex: 1, gap: 3 }}>
              <Text style={{ color: colors.white, fontFamily: fonts.bodyBold, fontSize: 16 }}>
                Runde Shop
              </Text>
              <Text style={{ color: colors.whiteSoft, fontFamily: fonts.body, fontSize: 12 }}>
                Kosmetik, Fragenpakete, Host Pass
              </Text>
            </View>
            <Text style={{ color: colors.sun, fontFamily: fonts.bodyBold, fontSize: 18 }}>→</Text>
          </Pressable>

          {/* Teilen */}
          <Pressable
            onPress={() => void shareProfile()}
            style={({ pressed }) => ({
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              paddingVertical: 14,
              borderRadius: radii.control,
              borderWidth: 1.5,
              borderColor: colors.borderOnColor,
              opacity: pressed ? 0.7 : 1,
            })}
          >
            <Text style={{ fontSize: 16 }}>👋</Text>
            <Text style={{ color: colors.white, fontFamily: fonts.bodySemiBold, fontSize: 15 }}>
              Freunde einladen
            </Text>
          </Pressable>
        </Animated.View>
      )}

      {/* EINSTELLUNGEN TAB */}
      {tab === "einstellungen" && (
        <Animated.View entering={reducedMotion ? undefined : FadeInUp.duration(240)} style={{ gap: 8 }}>
          <Text style={{ color: colors.whiteSoft, fontFamily: fonts.bodySemiBold, fontSize: 12, letterSpacing: 1.2, marginBottom: 4 }}>
            SOUND & HAPTIK
          </Text>

          <View style={{ backgroundColor: "rgba(0,0,0,0.22)", borderRadius: radii.card, overflow: "hidden" }}>
            {SETTINGS_ROWS.map((row, index) => (
              <Animated.View
                key={row.key}
                entering={reducedMotion ? undefined : FadeInDown.delay(index * 55).duration(240)}
              >
                {index > 0 && (
                  <View style={{ height: 1, backgroundColor: "rgba(255,255,255,0.07)", marginHorizontal: spacing.xl }} />
                )}
                <View style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 14,
                  paddingHorizontal: spacing.xl,
                  paddingVertical: 16,
                }}>
                  <View style={{
                    width: 40,
                    height: 40,
                    borderRadius: 12,
                    backgroundColor: `${row.accentColor}33`,
                    alignItems: "center",
                    justifyContent: "center",
                  }}>
                    <Text style={{ fontSize: 20 }}>{row.emoji}</Text>
                  </View>
                  <View style={{ flex: 1, gap: 2 }}>
                    <Text style={{ color: colors.white, fontFamily: fonts.bodySemiBold, fontSize: 15 }}>
                      {row.label}
                    </Text>
                    <Text style={{ color: colors.whiteSoft, fontFamily: fonts.body, fontSize: 12 }}>
                      {row.sublabel}
                    </Text>
                  </View>
                  <Switch
                    value={settings[row.key]}
                    onValueChange={() => toggleSetting(row.key)}
                    trackColor={{ false: "rgba(255,255,255,0.15)", true: colors.sun }}
                    thumbColor={settings[row.key] ? colors.ink : colors.whiteSoft}
                    ios_backgroundColor="rgba(255,255,255,0.15)"
                  />
                </View>
              </Animated.View>
            ))}
          </View>

          <Animated.View
            entering={reducedMotion ? undefined : FadeInDown.delay(280).duration(240)}
            style={{
              marginTop: 8,
              padding: spacing.xl,
              borderRadius: radii.card,
              backgroundColor: "rgba(0,0,0,0.22)",
              flexDirection: "row",
              alignItems: "center",
              gap: 12,
            }}
          >
            <Text style={{ fontSize: 22 }}>🔒</Text>
            <View style={{ flex: 1, gap: 2 }}>
              <Text style={{ color: colors.white, fontFamily: fonts.bodySemiBold, fontSize: 14 }}>
                Version 1.0
              </Text>
              <Text style={{ color: colors.whiteSoft, fontFamily: fonts.body, fontSize: 12 }}>
                Runde – das ehrlichste Partyspiel
              </Text>
            </View>
          </Animated.View>
        </Animated.View>
      )}
    </StageScreen>
  );
}
