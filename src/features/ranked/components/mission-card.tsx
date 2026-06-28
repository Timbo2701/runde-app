import { Text, View } from "react-native";

import { colors, fonts, radii, spacing } from "@/design/tokens";
import type { DailyMission } from "@/types/ranked";

interface MissionCardProps {
  mission: DailyMission;
}

export function MissionCard({ mission }: MissionCardProps) {
  const progress = Math.min(mission.current / mission.target, 1);

  return (
    <View style={{
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.md,
      padding: spacing.md,
      paddingHorizontal: spacing.lg,
      borderRadius: radii.control,
      backgroundColor: mission.completed ? "rgba(67,184,107,0.12)" : "rgba(255,255,255,0.07)",
      borderWidth: 1,
      borderColor: mission.completed ? "rgba(67,184,107,0.4)" : "rgba(255,255,255,0.1)",
    }}>
      <Text style={{ fontSize: 22 }}>{mission.emoji}</Text>

      <View style={{ flex: 1, gap: 6 }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
          <Text style={{ color: colors.white, fontFamily: fonts.bodySemiBold, fontSize: 13 }}>
            {mission.label}
          </Text>
          <Text style={{ color: colors.whiteSoft, fontFamily: fonts.mono, fontSize: 11 }}>
            {mission.current}/{mission.target}
          </Text>
        </View>

        <View style={{
          height: 4,
          borderRadius: radii.round,
          backgroundColor: "rgba(255,255,255,0.12)",
          overflow: "hidden",
        }}>
          <View style={{
            width: `${progress * 100}%`,
            height: 4,
            borderRadius: radii.round,
            backgroundColor: mission.completed ? colors.online : colors.stageGrape,
          }} />
        </View>
      </View>

      <View style={{
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: radii.round,
        backgroundColor: "rgba(255,216,77,0.15)",
        borderWidth: 1,
        borderColor: "rgba(255,216,77,0.3)",
      }}>
        <Text style={{ color: colors.sun, fontFamily: fonts.bodyBold, fontSize: 11 }}>
          +{mission.xpReward} XP
        </Text>
      </View>
    </View>
  );
}
