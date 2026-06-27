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

const disabledTones = {
  sun: { background: "rgba(255,216,77,0.22)", border: "rgba(255,216,77,0.22)", text: "rgba(255,255,255,0.38)" },
  ink: { background: "rgba(33,24,43,0.28)", border: "rgba(33,24,43,0.28)", text: "rgba(255,255,255,0.28)" },
  outline: { background: "transparent", border: "rgba(255,255,255,0.18)", text: "rgba(255,255,255,0.28)" },
  surface: { background: "rgba(255,249,245,0.22)", border: "rgba(255,249,245,0.22)", text: "rgba(33,24,43,0.38)" },
} as const;

export function BrandButton({ disabled = false, label, onPress, tone = "sun" }: BrandButtonProps) {
  const palette = disabled ? disabledTones[tone] : tones[tone];

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
        borderWidth: 1.5,
        borderColor: palette.border,
        borderRadius: radii.control,
        borderCurve: "continuous",
        backgroundColor: palette.background,
        opacity: pressed && !disabled ? 0.84 : 1,
        transform: [{ scale: pressed && !disabled ? 0.985 : 1 }],
      })}
    >
      <Text style={{
        color: palette.text,
        fontFamily: fonts.bodyBold,
        fontSize: 17,
        letterSpacing: disabled ? 0.2 : 0,
      }}>
        {label}
      </Text>
    </Pressable>
  );
}
