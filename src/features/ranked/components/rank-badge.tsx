import { Text, View } from "react-native";

import { colors, fonts, radii, spacing } from "@/design/tokens";
import { RANK_CONFIG, getDivisionLabel, getTierLabel } from "@/lib/ranked-logic";
import type { RankDivision, RankTier } from "@/types/ranked";

interface RankBadgeProps {
  tier: RankTier;
  division: RankDivision;
  size?: "sm" | "md" | "lg";
}

export function RankBadge({ tier, division, size = "md" }: RankBadgeProps) {
  const config = RANK_CONFIG[tier];
  const isLegend = tier === "legend";

  if (size === "sm") {
    return (
      <View style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: radii.round,
        backgroundColor: `${config.color}22`,
        borderWidth: 1,
        borderColor: `${config.color}66`,
      }}>
        <Text style={{ fontSize: 12 }}>{config.emoji}</Text>
        <Text style={{
          color: config.color,
          fontFamily: fonts.bodyBold,
          fontSize: 11,
        }}>
          {isLegend ? "Legend" : `${getTierLabel(tier)} ${getDivisionLabel(division)}`}
        </Text>
      </View>
    );
  }

  if (size === "lg") {
    return (
      <View style={{ alignItems: "center", gap: spacing.sm }}>
        <View style={{
          width: 80,
          height: 80,
          borderRadius: 40,
          backgroundColor: `${config.color}22`,
          borderWidth: 3,
          borderColor: config.color,
          alignItems: "center",
          justifyContent: "center",
          shadowColor: config.glowColor,
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.6,
          shadowRadius: 12,
          elevation: 8,
        }}>
          <Text style={{ fontSize: 36 }}>{config.emoji}</Text>
        </View>
        <Text style={{ color: config.color, fontFamily: fonts.displayExtraBold, fontSize: 20 }}>
          {isLegend ? "Legend" : `${getTierLabel(tier)} ${getDivisionLabel(division)}`}
        </Text>
      </View>
    );
  }

  // md (default)
  return (
    <View style={{ alignItems: "center", gap: 4 }}>
      <View style={{
        width: 52,
        height: 52,
        borderRadius: 26,
        backgroundColor: `${config.color}22`,
        borderWidth: 2,
        borderColor: config.color,
        alignItems: "center",
        justifyContent: "center",
        shadowColor: config.glowColor,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.5,
        shadowRadius: 8,
        elevation: 4,
      }}>
        <Text style={{ fontSize: 26 }}>{config.emoji}</Text>
      </View>
      <Text style={{ color: config.color, fontFamily: fonts.bodyBold, fontSize: 12 }}>
        {isLegend ? "Legend" : `${getTierLabel(tier)} ${getDivisionLabel(division)}`}
      </Text>
    </View>
  );
}
