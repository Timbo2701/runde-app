import { ActivityIndicator, Text, View } from "react-native";

import { colors, fonts, radii, spacing } from "@/design/tokens";
import { BrandButton } from "@/ui/primitives/brand-button";

type DataStatePanelProps = {
  title: string;
  message: string;
  loading?: boolean;
  onRetry?: () => void;
};

export function DataStatePanel({ title, message, loading = false, onRetry }: DataStatePanelProps) {
  return (
    <View
      accessibilityRole={loading ? "progressbar" : "alert"}
      style={{
        padding: spacing.xl,
        borderRadius: radii.card,
        backgroundColor: "rgba(0,0,0,0.24)",
        borderWidth: 1,
        borderColor: colors.whiteFaint,
        alignItems: "center",
        gap: spacing.md,
      }}
    >
      {loading ? <ActivityIndicator color={colors.sun} size="large" /> : <Text style={{ fontSize: 30 }}>↻</Text>}
      <Text style={{ color: colors.white, fontFamily: fonts.displayExtraBold, fontSize: 20, textAlign: "center" }}>
        {title}
      </Text>
      <Text style={{ color: colors.whiteSoft, fontFamily: fonts.body, fontSize: 14, lineHeight: 21, textAlign: "center" }}>
        {message}
      </Text>
      {!loading && onRetry ? <BrandButton label="Erneut versuchen" onPress={onRetry} tone="sun" /> : null}
    </View>
  );
}
