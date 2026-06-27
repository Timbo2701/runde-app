import { router } from "expo-router";
import { Text, View } from "react-native";

import { BrandButton } from "@/ui/primitives/brand-button";
import { StageScreen } from "@/ui/primitives/stage-screen";
import { colors, fonts } from "@/design/tokens";

export default function NotFoundScreen() {
  return (
    <StageScreen stageColor={colors.stageGrape} pattern="rings">
      <View style={{ flex: 1, justifyContent: "center", gap: 20 }}>
        <Text
          selectable
          style={{ color: colors.white, fontFamily: fonts.displayExtraBold, fontSize: 42, lineHeight: 44 }}
        >
          Hier spielt gerade niemand.
        </Text>
        <Text selectable style={{ color: colors.whiteSoft, fontFamily: fonts.body, fontSize: 17, lineHeight: 24 }}>
          Geh zurück zum Start und öffne eine neue Runde.
        </Text>
        <BrandButton label="Zum Start" onPress={() => router.replace("/")} tone="sun" />
      </View>
    </StageScreen>
  );
}

