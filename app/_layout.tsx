import AsyncStorage from "@react-native-async-storage/async-storage";
import { ProfileProvider } from "@/lib/profile-context";
import { BricolageGrotesque_700Bold } from "@expo-google-fonts/bricolage-grotesque/700Bold";
import { BricolageGrotesque_800ExtraBold } from "@expo-google-fonts/bricolage-grotesque/800ExtraBold";
import { IBMPlexMono_500Medium } from "@expo-google-fonts/ibm-plex-mono/500Medium";
import { InstrumentSans_400Regular } from "@expo-google-fonts/instrument-sans/400Regular";
import { InstrumentSans_500Medium } from "@expo-google-fonts/instrument-sans/500Medium";
import { InstrumentSans_600SemiBold } from "@expo-google-fonts/instrument-sans/600SemiBold";
import { InstrumentSans_700Bold } from "@expo-google-fonts/instrument-sans/700Bold";
import { useFonts } from "expo-font";
import { router, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { colors } from "@/design/tokens";

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
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (!fontsLoaded) return;
    AsyncStorage.getItem("@runde:onboarding_done").then((done) => {
      router.replace(done === "1" ? "/" : "/onboarding");
      setChecked(true);
    });
  }, [fontsLoaded]);

  if (!fontsLoaded || !checked) {
    return <View style={{ flex: 1, backgroundColor: colors.stageBerry }} />;
  }

  return (
    <SafeAreaProvider>
      <ProfileProvider>
        <StatusBar style="light" />
        <Stack
          screenOptions={{
            headerShown: false,
            animation: "fade",
            contentStyle: { backgroundColor: colors.stageBerry },
          }}
        />
      </ProfileProvider>
    </SafeAreaProvider>
  );
}
