import type { PropsWithChildren } from "react";
import { ScrollView, View, useWindowDimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { colors } from "@/design/tokens";

type StageScreenProps = PropsWithChildren<{
  stageColor: string;
  pattern?: "confetti" | "rings" | "dots";
}>;

function Pattern({ type }: { type: NonNullable<StageScreenProps["pattern"]> }) {
  if (type === "rings") {
    return (
      <>
        <View
          style={{
            position: "absolute",
            width: 230,
            height: 230,
            borderRadius: 999,
            borderWidth: 2,
            borderColor: colors.whiteFaint,
            right: -110,
            top: 150,
          }}
        />
        <View
          style={{
            position: "absolute",
            width: 100,
            height: 100,
            borderRadius: 999,
            borderWidth: 2,
            borderColor: colors.whiteFaint,
            left: -52,
            bottom: 120,
          }}
        />
      </>
    );
  }

  if (type === "dots") {
    return (
      <>
        <View style={{ position: "absolute", width: 18, height: 18, borderRadius: 9, backgroundColor: colors.whiteFaint, right: 38, top: 156 }} />
        <View style={{ position: "absolute", width: 10, height: 10, borderRadius: 5, backgroundColor: colors.whiteFaint, left: 34, top: 278 }} />
        <View style={{ position: "absolute", width: 15, height: 15, borderRadius: 8, backgroundColor: colors.whiteFaint, right: 84, bottom: 104 }} />
      </>
    );
  }

  return (
    <>
      <View style={{ position: "absolute", width: 76, height: 20, borderRadius: 10, backgroundColor: colors.whiteFaint, right: -14, top: 122, transform: [{ rotate: "22deg" }] }} />
      <View style={{ position: "absolute", width: 55, height: 14, borderRadius: 8, backgroundColor: colors.whiteFaint, left: -12, top: 230, transform: [{ rotate: "-28deg" }] }} />
      <View style={{ position: "absolute", width: 2, height: 58, backgroundColor: colors.whiteFaint, left: 52, bottom: 104 }} />
      <View style={{ position: "absolute", width: 58, height: 2, backgroundColor: colors.whiteFaint, left: 24, bottom: 132 }} />
    </>
  );
}

export function StageScreen({ children, stageColor, pattern = "confetti" }: StageScreenProps) {
  const insets = useSafeAreaInsets();
  const { height } = useWindowDimensions();

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      keyboardShouldPersistTaps="handled"
      style={{ flex: 1, backgroundColor: stageColor }}
      contentContainerStyle={{ minHeight: height, backgroundColor: stageColor }}
    >
      <View style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
        <Pattern type={pattern} />
      </View>
      <View
        style={{
          flex: 1,
          width: "100%",
          maxWidth: 520,
          alignSelf: "center",
          paddingTop: Math.max(insets.top, 20),
          paddingBottom: Math.max(insets.bottom, 24),
          paddingHorizontal: 20,
        }}
      >
        {children}
      </View>
    </ScrollView>
  );
}
