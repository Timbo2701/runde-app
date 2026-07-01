import { router } from "expo-router";
import { useRef, useState } from "react";
import { Dimensions, Pressable, ScrollView, Text, View } from "react-native";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";

import { colors, fonts, spacing } from "@/design/tokens";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { BrandButton } from "@/ui/primitives/brand-button";
import { StageScreen } from "@/ui/primitives/stage-screen";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const SLIDES = [
  {
    emoji: "🎉",
    title: "Bereit für den peinlichsten Abend des Jahres?",
    body: "Runde stellt Fragen, die eure Freundschaft auf die Probe stellen – und ihr liebt es trotzdem.",
    color: colors.stageBerry,
    pattern: "confetti" as const,
  },
  {
    emoji: "🎯",
    title: "Frage. Wählen. Eingestehen.",
    body: "Ihr bekommt eine Frage über eure Gruppe. Jeder wählt still eine Person. Die Gruppe entscheidet – keine Ausreden.",
    color: colors.stageCoral,
    pattern: "dots" as const,
  },
  {
    emoji: "🏆",
    title: "Siege zählen. Ausreden auch.",
    body: "Wer am öftesten gewählt wird, sammelt Punkte. Nach 5 Runden steht fest, wer wirklich wer ist.",
    color: colors.stageGrape,
    pattern: "rings" as const,
  },
  {
    emoji: "🔥",
    title: "Mehr Leute = mehr Drama",
    body: "Teile den Raumcode und los – kein Download, kein Anmelden für deine Freunde. Einfach rein und mitspielen.",
    color: colors.stageBerry,
    pattern: "confetti" as const,
  },
];

export function OnboardingScreen() {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<ScrollView>(null);
  const reducedMotion = useReducedMotion();
  const isLast = activeIndex === SLIDES.length - 1;

  const goNext = () => {
    if (isLast) {
      router.replace("/setup");
    } else {
      const next = activeIndex + 1;
      scrollRef.current?.scrollTo({ x: next * SCREEN_WIDTH, animated: true });
      setActiveIndex(next);
    }
  };

  const slide = SLIDES[activeIndex];

  return (
    <StageScreen stageColor={slide.color} pattern={slide.pattern}>
      <View style={{ flex: 1, gap: 0 }}>
        <ScrollView
          ref={scrollRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          scrollEventThrottle={16}
          onMomentumScrollEnd={(e) => {
            const index = Math.round(e.nativeEvent.contentOffset.x / SCREEN_WIDTH);
            setActiveIndex(index);
          }}
          style={{ flex: 1, marginHorizontal: -spacing.xl }}
          contentContainerStyle={{ alignItems: "center" }}
        >
          {SLIDES.map((s, i) => (
            <View
              key={i}
              style={{
                width: SCREEN_WIDTH,
                flex: 1,
                paddingHorizontal: spacing.xl,
                justifyContent: "center",
                alignItems: "center",
                gap: 28,
              }}
            >
              <Animated.Text
                entering={reducedMotion ? undefined : FadeIn.duration(300)}
                style={{ fontSize: 88, lineHeight: 100 }}
              >
                {s.emoji}
              </Animated.Text>
              <Animated.View
                entering={reducedMotion ? undefined : FadeInDown.delay(100).duration(300)}
                style={{ alignItems: "center", gap: 16 }}
              >
                <Text
                  style={{
                    color: colors.white,
                    fontFamily: fonts.displayExtraBold,
                    fontSize: 30,
                    lineHeight: 34,
                    letterSpacing: -0.4,
                    textAlign: "center",
                  }}
                >
                  {s.title}
                </Text>
                <Text
                  style={{
                    color: colors.whiteSoft,
                    fontFamily: fonts.body,
                    fontSize: 17,
                    lineHeight: 27,
                    textAlign: "center",
                    maxWidth: 310,
                  }}
                >
                  {s.body}
                </Text>
              </Animated.View>
            </View>
          ))}
        </ScrollView>

        <View style={{ gap: 20, paddingBottom: 8 }}>
          {/* Step indicator */}
          <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 6 }}>
            {SLIDES.map((_, i) => (
              <Pressable
                key={i}
                onPress={() => {
                  scrollRef.current?.scrollTo({ x: i * SCREEN_WIDTH, animated: true });
                  setActiveIndex(i);
                }}
                style={{
                  width: i === activeIndex ? 28 : 8,
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: i === activeIndex ? colors.white : colors.whiteFaint,
                }}
              />
            ))}
          </View>

          <BrandButton
            label={isLast ? "Konto erstellen →" : "Weiter →"}
            onPress={goNext}
            tone="sun"
          />

          {!isLast && (
            <Pressable onPress={() => router.replace("/setup")} style={{ alignItems: "center", paddingVertical: 4 }}>
              <Text style={{ color: colors.whiteSoft, fontFamily: fonts.body, fontSize: 14 }}>
                Überspringen
              </Text>
            </Pressable>
          )}
        </View>
      </View>
    </StageScreen>
  );
}
