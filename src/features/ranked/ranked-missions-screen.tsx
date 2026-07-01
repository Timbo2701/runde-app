import { router } from "expo-router";
import { Text, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

import { colors, fonts, radii, spacing } from "@/design/tokens";
import { useMissions } from "@/lib/supabase-hooks";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { AppHeader } from "@/ui/primitives/app-header";
import { BottomNav } from "@/ui/primitives/bottom-nav";
import { DataStatePanel } from "@/ui/primitives/data-state-panel";
import { StageScreen } from "@/ui/primitives/stage-screen";
import { MissionCard } from "@/features/ranked/components/mission-card";

export function RankedMissionsScreen() {
  const { data: missions, loading, error, refresh } = useMissions();
  const reducedMotion = useReducedMotion();

  if (loading || error) {
    return (
      <View style={{ flex: 1 }}>
        <StageScreen stageColor={colors.stageGrapeDeep} pattern="dots">
          <AppHeader title="Tagesmissionen" actionLabel="Zurück" onAction={() => router.back()} />
          <DataStatePanel
            title={loading ? "Missionen werden geladen" : "Missionen nicht erreichbar"}
            message={loading ? "Tagesmissionen kommen direkt aus Supabase." : error ?? "Bitte versuche es erneut."}
            loading={loading}
            onRetry={loading ? undefined : () => void refresh()}
          />
        </StageScreen>
        <BottomNav activeTab="ranked" />
      </View>
    );
  }

  const completedCount = missions.filter((m) => m.completed).length;

  return (
    <View style={{ flex: 1 }}>
      <StageScreen stageColor={colors.stageGrapeDeep} pattern="dots" scrollEnabled>
        <AppHeader title="Tagesmissionen" actionLabel="Zurück" onAction={() => router.back()} />

        <Animated.View
          entering={reducedMotion ? undefined : FadeInDown.duration(240)}
          style={{
            marginTop: 16,
            marginBottom: 20,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            padding: spacing.lg,
            borderRadius: radii.card,
            backgroundColor: "rgba(0,0,0,0.25)",
          }}
        >
          <View>
            <Text style={{ color: colors.white, fontFamily: fonts.displayExtraBold, fontSize: 22 }}>
              {completedCount} / {missions.length}
            </Text>
            <Text style={{ color: colors.whiteSoft, fontFamily: fonts.body, fontSize: 12 }}>
              Missionen heute erledigt
            </Text>
          </View>
          <Text style={{ fontSize: 32 }}>⚔️</Text>
        </Animated.View>

        <View style={{ gap: 10, marginBottom: 100 }}>
          {missions.map((mission, i) => (
            <Animated.View key={mission.id} entering={reducedMotion ? undefined : FadeInDown.delay(i * 40).duration(220)}>
              <MissionCard mission={mission} />
            </Animated.View>
          ))}
          {missions.length === 0 && (
            <Text style={{ color: colors.whiteSoft, fontFamily: fonts.body, fontSize: 13, textAlign: "center", paddingVertical: 20 }}>
              Heute sind keine Missionen aktiv.
            </Text>
          )}
        </View>
      </StageScreen>
      <BottomNav activeTab="ranked" />
    </View>
  );
}
