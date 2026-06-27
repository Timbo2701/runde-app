import { Pressable, Text, View } from "react-native";

import { colors, fonts } from "@/design/tokens";

type AppHeaderProps = {
  actionLabel?: string;
  onAction?: () => void;
  showBrand?: boolean;
  title?: string;
};

export function AppHeader({ actionLabel, onAction, showBrand = false, title }: AppHeaderProps) {
  return (
    <View style={{ minHeight: 52, flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
      <Text
        selectable
        style={{ color: colors.white, fontFamily: showBrand ? fonts.displayExtraBold : fonts.bodyBold, fontSize: showBrand ? 24 : 17 }}
      >
        {showBrand ? "RUNDE!" : title}
      </Text>
      {actionLabel && onAction ? (
        <Pressable
          accessibilityRole="button"
          onPress={onAction}
          style={({ pressed }) => ({
            minHeight: 44,
            justifyContent: "center",
            paddingHorizontal: 14,
            borderRadius: 14,
            borderCurve: "continuous",
            backgroundColor: pressed ? "rgba(255,255,255,0.22)" : colors.whiteFaint,
          })}
        >
          <Text style={{ color: colors.white, fontFamily: fonts.bodySemiBold, fontSize: 14 }}>{actionLabel}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

