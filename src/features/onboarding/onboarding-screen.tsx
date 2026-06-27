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
    title: "Willkommen bei Runde!",
    body: "Das Partyspiel für deine Freundesrunde. Stimmt ab, lacht zusammen – und entscheidet, wer wirklich wer ist.",
    color: colors.stageBerry,
    pattern: "confetti" as const,
  },
  {
    emoji: "📝",
    title: "Wie funktioniert's?",
    body: "Erstelle einen Raum oder tritt mit einem Code bei. Dann beantwortet ihr zusammen lustige Fragen über euch.",
    color: colors.stageCoral,
    pattern: "dots" as const,
  },
  {
    emoji: "🏆",
    title: "Punkte sammeln",
    body: "Wer am häufigsten von der Gruppe gewählt wird, sammelt Siege. Nach 5 Runden sieht ihr wer wirklich gewonnen hat.",
    color: colors.stageGrape,
    pattern: "rings" as const,
  },
  {
    emoji: "👥",
    title: "Gemeinsam mehr Spaß",
    body: "Je mehr Leute mitspielen, desto witziger wird's. Teile einfach den Raumcode mit deinen Freunden – los geht's!",
    color: colors.stageGrape,
    pattern: "dots" as const,
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
        {/* Slides */}
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
                gap: 24,
              }}
            >
              <Animated.Text
                entering={reducedMotion ? undefined : FadeIn.duration(300)}
                style={{ fontSize: 80, lineHeight: 90 }}
              >
                {s.emoji}
              </Animated.Text>
              <Animated.View
                entering={reducedMotion ? undefined : FadeInDown.delay(100).duration(300)}
                style={{ alignItems: "center", gap: 14 }}
              >
                <Text
                  style={{
                    color: colors.white,
                    fontFamily: fonts.displayExtraBold,
                    fontSize: 32,
                    lineHeight: 36,
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
                    lineHeight: 26,
                    textAlign: "center",
                    maxWidth: 320,
                  }}
                >
                  {s.body}
                </Text>
              </Animated.View>
            </View>
          ))}
        </ScrollView>

        {/* Dots + Button */}
        <View style={{ gap: 24, paddingBottom: 16 }}>
          {/* Dots */}
          <View style={{ flexDirection: "row", justifyContent: "center", gap: 8 }}>
            {SLIDES.map((_, i) => (
              <Pressable
                key={i}
                onPress={() => {
                  scrollRef.current?.scrollTo({ x: i * SCREEN_WIDTH, animated: true });
                  setActiveIndex(i);
                }}
                style={{
                  width: i === activeIndex ? 24 : 8,
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: i === activeIndex ? colors.white : colors.whiteFaint,
                }}
              />
            ))}
          </View>

          <BrandButton
            label={isLast ? "Weiter →" : "Nächste →"}
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
