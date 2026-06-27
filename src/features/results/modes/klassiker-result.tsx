import { Image, Text, View } from "react-native";
import Animated, { FadeIn, FadeInDown, FadeInUp, ZoomIn } from "react-native-reanimated";

import { colors, fonts, radii, spacing } from "@/design/tokens";
import { useProfile } from "@/lib/profile-context";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { BrandButton } from "@/ui/primitives/brand-button";

const MIKA_AVATAR = "https://i.pravatar.cc/150?img=47";
const BOT_NAME = "Mika";
const TOTAL_ROUNDS = 5;

function countVotes(votes: string[]): Record<string, number> {
  const tally: Record<string, number> = {};
  for (const v of votes) tally[v] = (tally[v] ?? 0) + 1;
  return tally;
}

interface Props {
  params: Record<string, string | undefined>;
  onNext: () => void;
  isLastRound: boolean;
  roundNumber: number;
  totalRounds: number;
  code: string;
}

export function KlassikerResult({ params, onNext, isLastRound, roundNumber, totalRounds, code }: Props) {
  const { name: profileName, photo: profilePhoto } = useProfile();
  const myName = profileName || "Du";
  const reducedMotion = useReducedMotion();

  const { playerVote, botVote } = params;
  const choices = [myName, BOT_NAME];

  const votes = [playerVote, botVote].filter(
    (v): v is string => typeof v === "string" && choices.includes(v)
  );
  const tally = countVotes(votes);
  const sorted = [...choices].sort((a, b) => (tally[b] ?? 0) - (tally[a] ?? 0));
  const winner = sorted[0];
  const isTie = (tally[sorted[0]] ?? 0) === (tally[sorted[1]] ?? 0);

  const avatarFor = (person: string) =>
    person === BOT_NAME ? MIKA_AVATAR : (profilePhoto ?? null);
  const colorFor = (person: string) =>
    person === BOT_NAME ? colors.stageCoral : colors.stageBerry;

  return (
    <View style={{ flex: 1, justifyContent: "center", paddingVertical: 16, gap: 28 }}>
      <Animated.View
        entering={reducedMotion ? undefined : FadeInUp.duration(300)}
        style={{ alignItems: "center", gap: 10 }}
      >
        {!isTie && (
          <Animated.Text
            entering={reducedMotion ? undefined : ZoomIn.delay(200).duration(350)}
            style={{ fontSize: 60, lineHeight: 68 }}
          >
            🎯
          </Animated.Text>
        )}
        <Text style={{ color: colors.sun, fontFamily: fonts.bodyBold, fontSize: 12, letterSpacing: 1.6 }}>
          ERGEBNIS · RUNDE {roundNumber}
        </Text>
        <Text style={{ color: colors.white, fontFamily: fonts.displayExtraBold, fontSize: 38, lineHeight: 42, textAlign: "center" }}>
          {isTie ? "Unentschieden!" : `${winner} gewinnt!`}
        </Text>
        <Text style={{ color: colors.whiteSoft, fontFamily: fonts.body, fontSize: 16, textAlign: "center" }}>
          {isTie ? "Beide haben gleich viele Stimmen." : "Die Gruppe hat gesprochen. 🗣️"}
        </Text>
      </Animated.View>

      <View style={{ gap: 10 }}>
        {sorted.map((person, index) => {
          const voteCount = tally[person] ?? 0;
          const isWinner = !isTie && index === 0;
          const pct = votes.length > 0 ? voteCount / votes.length : 0;
          const avatarUri = avatarFor(person);
          const avatarColor = colorFor(person);

          return (
            <Animated.View
              key={person}
              entering={reducedMotion ? undefined : FadeInDown.delay(index * 110).duration(260)}
              style={{
                borderRadius: radii.card,
                borderCurve: "continuous",
                backgroundColor: isWinner ? colors.surface : "rgba(255,255,255,0.1)",
                padding: spacing.xl,
                gap: 12,
                borderWidth: isWinner ? 2 : 0,
                borderColor: isWinner ? colors.sun : "transparent",
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
                <View
                  style={{
                    width: 44, height: 44, borderRadius: 22, overflow: "hidden",
                    backgroundColor: avatarColor, alignItems: "center", justifyContent: "center",
                    borderWidth: isWinner ? 2 : 0, borderColor: colors.sun,
                  }}
                >
                  {avatarUri
                    ? <Image source={{ uri: avatarUri }} style={{ width: 44, height: 44 }} />
                    : <Text style={{ color: colors.white, fontFamily: fonts.bodyBold, fontSize: 16 }}>{person[0]}</Text>
                  }
                </View>
                <Text style={{ flex: 1, color: isWinner ? colors.ink : colors.white, fontFamily: fonts.bodyBold, fontSize: 20 }}>
                  {person}{isWinner ? " 👑" : ""}
                </Text>
                <View style={{ backgroundColor: isWinner ? colors.stageGrape : "rgba(255,255,255,0.12)", paddingHorizontal: 12, paddingVertical: 5, borderRadius: radii.round }}>
                  <Text style={{ color: isWinner ? colors.white : colors.whiteSoft, fontFamily: fonts.mono, fontSize: 14 }}>
                    {voteCount} {voteCount === 1 ? "Stimme" : "Stimmen"}
                  </Text>
                </View>
              </View>
              <View style={{ height: 8, borderRadius: 4, backgroundColor: isWinner ? colors.surfaceSoft : "rgba(255,255,255,0.1)", overflow: "hidden" }}>
                <Animated.View
                  entering={reducedMotion ? undefined : FadeIn.delay(350 + index * 100).duration(500)}
                  style={{ height: 8, width: `${pct * 100}%`, borderRadius: 4, backgroundColor: isWinner ? colors.stageGrape : colors.whiteSoft }}
                />
              </View>
            </Animated.View>
          );
        })}
      </View>

      <Animated.View entering={reducedMotion ? undefined : FadeIn.delay(550).duration(300)} style={{ gap: 12 }}>
        <BrandButton
          label={isLastRound ? "Gesamtergebnis 🏆" : `Frage ${roundNumber + 1} von ${totalRounds} →`}
          onPress={onNext}
          tone="sun"
        />
      </Animated.View>
    </View>
  );
}
