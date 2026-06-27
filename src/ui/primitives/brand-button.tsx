import * as Haptics from "expo-haptics";
import { Pressable, Text } from "react-native";

import { colors, fonts, radii } from "@/design/tokens";

type BrandButtonProps = {
  disabled?: boolean;
  label: string;
  onPress: () => void;
  tone?: "sun" | "ink" | "outline" | "surface";
};

const tones = {
  sun: { background: colors.sun, border: colors.sun, text: colors.ink },
  ink: { background: colors.ink, border: colors.ink, text: colors.white },
  outline: { background: "transparent", border: colors.borderOnColor, text: colors.white },
  surface: { background: colors.surface, border: colors.surface, text: colors.ink },
} as const;

export function BrandButton({ disabled = false, label, onPress, tone = "sun" }: BrandButtonProps) {
  const palette = tones[tone];

  const handlePress = () => {
    if (disabled) return;
    if (process.env.EXPO_OS === "ios") {
      void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onPress();
  };

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={handlePress}
      style={({ pressed }) => ({
        minHeight: 54,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 22,
        borderWidth: 1,
        borderColor: palette.border,
        borderRadius: radii.control,
        borderCurve: "continuous",
        backgroundColor: palette.background,
        opacity: disabled ? 0.48 : pressed ? 0.84 : 1,
        transform: [{ scale: pressed && !disabled ? 0.985 : 1 }],
      })}
    >
      <Text style={{ color: palette.text, fontFamily: fonts.bodyBold, fontSize: 17 }}>{label}</Text>
    </Pressable>
  );
}

