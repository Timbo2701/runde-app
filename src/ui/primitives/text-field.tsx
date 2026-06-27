import { useState } from "react";
import { Text, TextInput, View } from "react-native";

import { colors, fonts, radii } from "@/design/tokens";

type TextFieldProps = {
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  keyboardType?: "default" | "email-address" | "numeric" | "phone-pad";
  label: string;
  maxLength?: number;
  onChangeText: (value: string) => void;
  onSubmitEditing?: () => void;
  placeholder?: string;
  value: string;
  variant?: "code" | "text";
  hint?: string;
};

export function TextField({
  autoCapitalize = "sentences",
  keyboardType = "default",
  label,
  maxLength,
  onChangeText,
  onSubmitEditing,
  placeholder,
  value,
  variant = "text",
  hint,
}: TextFieldProps) {
  const [focused, setFocused] = useState(false);

  const borderColor = focused
    ? colors.sun
    : value
    ? "rgba(255,255,255,0.35)"
    : "rgba(255,255,255,0.15)";

  const bgColor = variant === "code"
    ? "rgba(0,0,0,0.25)"
    : "rgba(255,255,255,0.10)";

  return (
    <View style={{ gap: 6 }}>
      <Text style={{ color: colors.whiteSoft, fontFamily: fonts.bodySemiBold, fontSize: 13, letterSpacing: 0.4 }}>
        {label}
      </Text>
      <TextInput
        accessibilityLabel={label}
        autoCapitalize={autoCapitalize}
        autoCorrect={false}
        keyboardType={keyboardType}
        maxLength={maxLength}
        onChangeText={onChangeText}
        onSubmitEditing={onSubmitEditing}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder={placeholder}
        placeholderTextColor="rgba(255,255,255,0.28)"
        returnKeyType="done"
        value={value}
        style={{
          minHeight: 54,
          borderRadius: radii.control,
          borderCurve: "continuous",
          borderWidth: 1.5,
          borderColor,
          backgroundColor: bgColor,
          paddingHorizontal: 18,
          color: colors.white,
          fontFamily: variant === "code" ? fonts.mono : fonts.bodySemiBold,
          fontSize: variant === "code" ? 22 : 17,
          letterSpacing: variant === "code" ? 4 : 0,
          textAlign: variant === "code" ? "center" : "left",
        }}
      />
      {hint && (
        <Text style={{ color: "rgba(255,255,255,0.38)", fontFamily: fonts.body, fontSize: 12 }}>
          {hint}
        </Text>
      )}
    </View>
  );
}
