import type { ReactNode } from "react";
import { Text, View } from "react-native";

import { colors, fonts } from "@/design/tokens";

type SocialSpotlightProps = {
  accent?: string;
  label: string;
  sublabel?: string;
  size?: number;
  symbol?: ReactNode;
};

export function SocialSpotlight({ accent = colors.sun, label, sublabel, size = 152, symbol }: SocialSpotlightProps) {
  return (
    <View style={{ alignItems: "center", gap: 12 }}>
      <View style={{ width: size, height: size, alignItems: "center", justifyContent: "center" }}>
        <View
          style={{
            position: "absolute",
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: accent,
            transform: [{ translateX: 10 }, { translateY: -5 }],
          }}
        />
        {symbol ?? (
          <View
            style={{
              width: size * 0.58,
              height: size * 0.58,
              borderRadius: 24,
              borderCurve: "continuous",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: colors.ink,
              transform: [{ rotate: "-7deg" }],
              boxShadow: `0 12px 24px ${colors.shadow}`,
            }}
          >
            <Text style={{ color: colors.white, fontFamily: fonts.displayExtraBold, fontSize: 42 }}>R!</Text>
          </View>
        )}
      </View>
      <View style={{ alignItems: "center", gap: 3 }}>
        <Text selectable style={{ color: colors.white, fontFamily: fonts.displayExtraBold, fontSize: 30, textAlign: "center", lineHeight: 34 }}>
          {label}
        </Text>
        {sublabel ? (
          <Text selectable style={{ color: colors.whiteSoft, fontFamily: fonts.bodyMedium, fontSize: 15, textAlign: "center" }}>
            {sublabel}
          </Text>
        ) : null}
      </View>
    </View>
  );
}

