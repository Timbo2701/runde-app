import { Pressable, Text, View } from "react-native";
import { router } from "expo-router";

import { colors, fonts, radii, spacing } from "@/design/tokens";
import type { BattlePassReward } from "@/types/ranked";

interface BattlePassTeaserProps {
  level: number;
  xp: number;
  maxXp?: number;
  maxLevel: number;
  rewards: BattlePassReward[];
}

export function BattlePassTeaser({ level, xp, maxXp = 1000, maxLevel, rewards }: BattlePassTeaserProps) {
  const progress = xp / maxXp;
  const nextRewards = rewards.filter((reward) => reward.level > level).slice(0, 2);

  return (
    <Pressable
      onPress={() => router.push("/ranked/pass" as never)}
      style={({ pressed }) => ({
        padding: spacing.lg,
        borderRadius: radii.card,
        backgroundColor: "rgba(111,43,211,0.2)",
        borderWidth: 1,
        borderColor: "rgba(111,43,211,0.5)",
        gap: spacing.md,
        opacity: pressed ? 0.85 : 1,
      })}
      accessibilityRole="button"
    >
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <Text style={{ fontSize: 18 }}>🎖️</Text>
          <Text style={{ color: colors.white, fontFamily: fonts.bodyBold, fontSize: 14 }}>
            Neon Pass
          </Text>
          <View style={{
            paddingHorizontal: 7,
            paddingVertical: 2,
            borderRadius: radii.round,
            backgroundColor: colors.stageGrape,
          }}>
            <Text style={{ color: colors.white, fontFamily: fonts.bodyBold, fontSize: 10 }}>
              LVL {level}
            </Text>
          </View>
        </View>
        <Text style={{ color: colors.whiteSoft, fontFamily: fonts.body, fontSize: 13 }}>→</Text>
      </View>

      {/* XP bar */}
      <View style={{ gap: 4 }}>
        <View style={{
          height: 6,
          borderRadius: radii.round,
          backgroundColor: "rgba(255,255,255,0.12)",
          overflow: "hidden",
        }}>
          <View style={{
            width: `${progress * 100}%`,
            height: 6,
            borderRadius: radii.round,
            backgroundColor: colors.stageGrape,
          }} />
        </View>
        <Text style={{ color: colors.whiteSoft, fontFamily: fonts.mono, fontSize: 10 }}>
          {xp} / {maxXp} XP • {Math.max(0, maxLevel - level)} Level bis Season-Ende
        </Text>
      </View>

      {/* Next rewards preview */}
      {nextRewards.length > 0 && (
        <View style={{ flexDirection: "row", gap: 8 }}>
          {nextRewards.map((r) => (
            <View key={r.level} style={{
              flex: 1,
              flexDirection: "row",
              alignItems: "center",
              gap: 6,
              padding: 8,
              borderRadius: radii.control,
              backgroundColor: "rgba(255,255,255,0.06)",
            }}>
              <Text style={{ fontSize: 14 }}>{r.free.emoji}</Text>
              <View style={{ flex: 1 }}>
                <Text style={{ color: colors.whiteSoft, fontFamily: fonts.body, fontSize: 9 }}>
                  Level {r.level}
                </Text>
                <Text style={{ color: colors.white, fontFamily: fonts.bodySemiBold, fontSize: 11 }} numberOfLines={1}>
                  {r.free.label}
                </Text>
              </View>
            </View>
          ))}
        </View>
      )}
    </Pressable>
  );
}
