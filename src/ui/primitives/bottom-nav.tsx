import { router } from "expo-router";
import { Pressable, Text, View } from "react-native";
import Svg, { Path } from "react-native-svg";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { colors, fonts } from "@/design/tokens";

export type TabId = "party" | "friends" | "ranked" | "shop" | "profile";

// Heroicons outline (MIT)
function IconParty({ color, size = 22 }: { color: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path stroke={color} strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round"
        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
      />
    </Svg>
  );
}

function IconFriends({ color, size = 22 }: { color: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path stroke={color} strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round"
        d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
      />
    </Svg>
  );
}

function IconRanked({ color, size = 22 }: { color: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path stroke={color} strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round"
        d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
      />
    </Svg>
  );
}

function IconShop({ color, size = 22 }: { color: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path stroke={color} strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round"
        d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
      />
    </Svg>
  );
}

function IconProfile({ color, size = 22 }: { color: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path stroke={color} strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round"
        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
      />
    </Svg>
  );
}

const TABS: { id: TabId; label: string; route: string }[] = [
  { id: "party",   label: "Party",   route: "/"        },
  { id: "friends", label: "Friends", route: "/friends" },
  { id: "ranked",  label: "Ranked",  route: "/ranked"  },
  { id: "shop",    label: "Shop",    route: "/shop"    },
  { id: "profile", label: "Profil",  route: "/profile" },
];

function TabIcon({ id, color }: { id: TabId; color: string }) {
  if (id === "party")   return <IconParty color={color} />;
  if (id === "friends") return <IconFriends color={color} />;
  if (id === "ranked")  return <IconRanked color={color} />;
  if (id === "shop")    return <IconShop color={color} />;
  return <IconProfile color={color} />;
}

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
        backgroundColor: "rgba(33,24,43,0.96)",
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
              gap: 3,
              opacity: pressed ? 0.7 : 1,
            })}
            accessibilityRole="button"
            accessibilityState={{ selected: active }}
          >
            {isRanked ? (
              <View style={{
                width: 50,
                height: 50,
                borderRadius: 25,
                backgroundColor: active ? colors.sun : colors.stageGrape,
                alignItems: "center",
                justifyContent: "center",
                marginTop: -18,
                borderWidth: 3,
                borderColor: "rgba(33,24,43,0.95)",
                shadowColor: active ? colors.sun : colors.stageGrape,
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: 0.65,
                shadowRadius: 10,
                elevation: 8,
              }}>
                <IconRanked color={active ? colors.ink : colors.white} />
              </View>
            ) : (
              <TabIcon id={tab.id} color={active ? colors.white : "rgba(255,255,255,0.38)"} />
            )}
            <Text style={{
              color: active ? (isRanked ? colors.sun : colors.white) : "rgba(255,255,255,0.38)",
              fontFamily: active ? fonts.bodyBold : fonts.body,
              fontSize: 10,
            }}>
              {tab.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
