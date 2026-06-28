import { router } from "expo-router";
import { Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { colors, fonts } from "@/design/tokens";

type TabId = "home" | "ranked" | "party" | "shop" | "profile";

const TABS: { id: TabId; emoji: string; label: string; route: string }[] = [
  { id: "home",    emoji: "🏠",  label: "Home",    route: "/"        },
  { id: "ranked",  emoji: "⚔️",  label: "Ranked",  route: "/ranked"  },
  { id: "party",   emoji: "🎉",  label: "Party",   route: "/"        },
  { id: "shop",    emoji: "🛍️",  label: "Shop",    route: "/shop"    },
  { id: "profile", emoji: "👤",  label: "Profil",  route: "/profile" },
];

interface BottomNavProps {
  activeTab: TabId;
}

export function BottomNav({ activeTab }: BottomNavProps) {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: "rgba(33,24,43,0.92)",
        borderTopWidth: 1,
        borderTopColor: colors.whiteFaint,
        paddingBottom: Math.max(insets.bottom, 8),
        paddingTop: 8,
        paddingHorizontal: 4,
        flexDirection: "row",
      }}
    >
      {TABS.map((tab) => {
        const active = activeTab === tab.id;
        const isRanked = tab.id === "ranked";

        return (
          <Pressable
            key={tab.id}
            onPress={() => {
              if (active && tab.id !== "ranked") return;
              router.push(tab.route as never);
            }}
            style={({ pressed }) => ({
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
              paddingVertical: isRanked ? 4 : 6,
              gap: 2,
              opacity: pressed ? 0.7 : 1,
            })}
            accessibilityRole="button"
            accessibilityState={{ selected: active }}
          >
            {isRanked ? (
              <View style={{
                width: 48,
                height: 48,
                borderRadius: 24,
                backgroundColor: active ? colors.sun : colors.stageGrape,
                alignItems: "center",
                justifyContent: "center",
                marginTop: -16,
                borderWidth: 3,
                borderColor: "rgba(33,24,43,0.9)",
                shadowColor: active ? colors.sun : colors.stageGrape,
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: 0.6,
                shadowRadius: 8,
                elevation: 8,
              }}>
                <Text style={{ fontSize: 20 }}>{tab.emoji}</Text>
              </View>
            ) : (
              <Text style={{ fontSize: 20, opacity: active ? 1 : 0.5 }}>{tab.emoji}</Text>
            )}
            <Text style={{
              color: active ? (isRanked ? colors.sun : colors.white) : colors.whiteSoft,
              fontFamily: active ? fonts.bodyBold : fonts.body,
              fontSize: 10,
              opacity: active ? 1 : 0.6,
            }}>
              {tab.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
