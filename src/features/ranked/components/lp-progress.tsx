import { useEffect } from "react";
import { Text, View } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";

import { colors, fonts, radii } from "@/design/tokens";
import { RANK_CONFIG, getDivisionLabel, getLpWithinDivision } from "@/lib/ranked-logic";
import type { RankTier } from "@/types/ranked";

interface LpProgressProps {
  lp: number;
  tier: RankTier;
  animated?: boolean;
}

export function LpProgress({ lp, tier, animated = true }: LpProgressProps) {
  const config = RANK_CONFIG[tier];
  const lpInDiv = getLpWithinDivision(lp);
  const progress = lpInDiv / 200;

  const width = useSharedValue(animated ? 0 : progress * 100);

  useEffect(() => {
    if (animated) {
      width.value = withTiming(progress * 100, { duration: 700 });
    }
  }, [progress, animated]);

  const barStyle = useAnimatedStyle(() => ({ width: `${width.value}%` }));

  const div1Active = lp >= 400;
  const div2Active = lp >= 200;

  return (
    <View style={{ gap: 4 }}>
      {/* Division markers */}
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        {[3, 2, 1].map((div) => (
          <Text
            key={div}
            style={{
              color: (div === 3 ? true : div === 2 ? div2Active : div1Active)
                ? config.color
                : colors.whiteSoft,
              fontFamily: fonts.bodyBold,
              fontSize: 10,
            }}
          >
            {getDivisionLabel(div as 1 | 2 | 3)}
          </Text>
        ))}
      </View>

      {/* Progress bar */}
      <View style={{
        height: 8,
        borderRadius: radii.round,
        backgroundColor: "rgba(255,255,255,0.12)",
        overflow: "hidden",
      }}>
        <Animated.View
          style={[{
            height: 8,
            borderRadius: radii.round,
            backgroundColor: config.color,
            shadowColor: config.glowColor,
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.8,
            shadowRadius: 4,
          }, barStyle]}
        />
      </View>

      {/* Division tick marks */}
      <View style={{ flexDirection: "row", paddingHorizontal: 0 }}>
        <View style={{ flex: 1 }} />
        <View style={{ width: 1, height: 4, backgroundColor: colors.whiteSoft, opacity: 0.4 }} />
        <View style={{ flex: 1 }} />
        <View style={{ width: 1, height: 4, backgroundColor: colors.whiteSoft, opacity: 0.4 }} />
        <View style={{ flex: 1 }} />
      </View>

      <Text style={{ color: colors.whiteSoft, fontFamily: fonts.mono, fontSize: 11, textAlign: "right" }}>
        {lpInDiv} / 200 LP
      </Text>
    </View>
  );
}
