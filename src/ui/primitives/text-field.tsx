import { Text, TextInput, View } from "react-native";

import { colors, fonts, radii } from "@/design/tokens";

type TextFieldProps = {
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  label: string;
  maxLength?: number;
  onChangeText: (value: string) => void;
  onSubmitEditing?: () => void;
  placeholder?: string;
  value: string;
  variant?: "code" | "text";
};

export function TextField({
  autoCapitalize = "sentences",
  label,
  maxLength,
  onChangeText,
  onSubmitEditing,
  placeholder,
  value,
  variant = "text",
}: TextFieldProps) {
  return (
    <View style={{ gap: 8 }}>
      <Text style={{ color: colors.white, fontFamily: fonts.bodySemiBold, fontSize: 14 }}>{label}</Text>
      <TextInput
        accessibilityLabel={label}
        autoCapitalize={autoCapitalize}
        autoCorrect={false}
        maxLength={maxLength}
        onChangeText={onChangeText}
        onSubmitEditing={onSubmitEditing}
        placeholder={placeholder}
        placeholderTextColor={colors.placeholder}
        returnKeyType="done"
        value={value}
        style={{
          minHeight: 56,
          borderRadius: radii.input,
          borderCurve: "continuous",
          borderWidth: 2,
          borderColor: colors.surface,
          backgroundColor: colors.surface,
          paddingHorizontal: 16,
          color: colors.ink,
          fontFamily: variant === "code" ? fonts.mono : fonts.bodySemiBold,
          fontSize: variant === "code" ? 20 : 17,
          letterSpacing: variant === "code" ? 3 : 0,
          textAlign: variant === "code" ? "center" : "left",
        }}
      />
    </View>
  );
}
