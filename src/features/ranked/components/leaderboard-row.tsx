import { Text, View } from "react-native";

import { colors, fonts, radii } from "@/design/tokens";
import { RANK_CONFIG, getDivisionLabel, getTierLabel } from "@/lib/ranked-logic";
import type { LeaderboardEntry } from "@/types/ranked";

interface LeaderboardRowProps {
  entry: LeaderboardEntry;
}

export function LeaderboardRow({ entry }: LeaderboardRowProps) {
  const config = RANK_CONFIG[entry.tier];
  const isTop3 = entry.rank <= 3;
  const rankColors = ["#FFD700", "#C0C0C0", "#CD7F32"];

  return (
    <View style={{
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderRadius: radii.control,
      backgroundColor: entry.isPlayer
        ? "rgba(111,43,211,0.25)"
        : isTop3
        ? "rgba(255,255,255,0.07)"
        : "rgba(255,255,255,0.04)",
      borderWidth: entry.isPlayer ? 1.5 : 1,
      borderColor: entry.isPlayer
        ? "rgba(111,43,211,0.6)"
        : "rgba(255,255,255,0.08)",
    }}>
      {/* Rank number */}
      <Text style={{
        width: 28,
        color: isTop3 ? rankColors[entry.rank - 1] : colors.whiteSoft,
        fontFamily: fonts.displayExtraBold,
        fontSize: isTop3 ? 18 : 14,
        textAlign: "center",
      }}>
        {entry.rank}
      </Text>

      {/* Avatar */}
      <Text style={{ fontSize: 22 }}>{entry.avatarEmoji}</Text>

      {/* Name */}
      <Text style={{
        flex: 1,
        color: entry.isPlayer ? colors.sun : colors.white,
        fontFamily: entry.isPlayer ? fonts.bodyBold : fonts.bodySemiBold,
        fontSize: 14,
      }} numberOfLines={1}>
        {entry.name}{entry.isPlayer ? " (Du)" : ""}
      </Text>

      {/* Rank badge */}
      <View style={{
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: radii.round,
        backgroundColor: `${config.color}22`,
        borderWidth: 1,
        borderColor: `${config.color}55`,
      }}>
        <Text style={{ color: config.color, fontFamily: fonts.bodyBold, fontSize: 10 }}>
          {config.emoji} {entry.tier === "legend" ? "Legend" : `${getTierLabel(entry.tier)} ${getDivisionLabel(entry.division)}`}
        </Text>
      </View>

      {/* LP */}
      <Text style={{
        color: colors.whiteSoft,
        fontFamily: fonts.mono,
        fontSize: 12,
        minWidth: 40,
        textAlign: "right",
      }}>
        {entry.lp}
      </Text>
    </View>
  );
}
