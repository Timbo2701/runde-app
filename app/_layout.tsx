import { AuthProvider, useAuth } from "@/lib/auth-context";
import { ProfileProvider } from "@/lib/profile-context";
import { RankedProvider } from "@/lib/ranked-context";
import { BricolageGrotesque_700Bold } from "@expo-google-fonts/bricolage-grotesque/700Bold";
import { BricolageGrotesque_800ExtraBold } from "@expo-google-fonts/bricolage-grotesque/800ExtraBold";
import { IBMPlexMono_500Medium } from "@expo-google-fonts/ibm-plex-mono/500Medium";
import { InstrumentSans_400Regular } from "@expo-google-fonts/instrument-sans/400Regular";
import { InstrumentSans_500Medium } from "@expo-google-fonts/instrument-sans/500Medium";
import { InstrumentSans_600SemiBold } from "@expo-google-fonts/instrument-sans/600SemiBold";
import { InstrumentSans_700Bold } from "@expo-google-fonts/instrument-sans/700Bold";
import { useFonts } from "expo-font";
import { router, Stack, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { colors } from "@/design/tokens";

function SessionRedirect() {
  const { configured, loading, session, profile } = useAuth();
  const segments = useSegments();

  useEffect(() => {
    const route = segments.join("/");
    if (!configured) {
      if (route !== "auth") router.replace("/auth");
      return;
    }
    if (loading) return;
    const publicRoute = route === "auth" || route === "onboarding" || route === "setup";

    if (!session) {
      if (!publicRoute) router.replace("/onboarding");
      return;
    }

    const setupComplete = Boolean(profile?.setupCompleted && profile?.onboardingCompleted);
    if (!setupComplete) {
      if (route !== "setup") router.replace("/setup");
      return;
    }

    if (publicRoute) router.replace("/");
  }, [configured, loading, session, profile, segments]);

  return loading ? <View style={{ position: "absolute", inset: 0, backgroundColor: colors.stageBerry, zIndex: 20 }} /> : null;
}

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    BricolageGrotesque_700Bold,
    BricolageGrotesque_800ExtraBold,
    InstrumentSans_400Regular,
    InstrumentSans_500Medium,
    InstrumentSans_600SemiBold,
    InstrumentSans_700Bold,
    IBMPlexMono_500Medium,
  });
  if (!fontsLoaded) {
    return <View style={{ flex: 1, backgroundColor: colors.stageBerry }} />;
  }

  return (
    <SafeAreaProvider>
      <AuthProvider>
        <ProfileProvider>
          <RankedProvider>
            <StatusBar style="light" />
            <SessionRedirect />
            <Stack
              screenOptions={{
                headerShown: false,
                animation: "fade",
                contentStyle: { backgroundColor: colors.stageBerry },
              }}
            />
          </RankedProvider>
        </ProfileProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
