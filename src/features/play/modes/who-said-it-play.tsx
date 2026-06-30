// MOCK: This mode simulates multiplayer locally. Other players' submissions and
// votes are generated after a delay. Replace with Supabase Realtime subscriptions
// when backend is ready. The game logic (scoring, phase transitions) is production-ready.

import { useRef, useState } from "react";
import {
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInUp,
} from "react-native-reanimated";

import { WHO_SAID_IT_PROMPTS } from "@/data/who-said-it-prompts";
import { colors, fonts, radii, spacing } from "@/design/tokens";
import { useAuth } from "@/lib/auth-context";
import { useProfile } from "@/lib/profile-context";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import type {
  WhoSaidItRound,
  WhoSaidItSubmission,
  WhoSaidItVote,
} from "@/types/who-said-it";

// ─── Mock players (replace with real room players when backend is ready) ──────

const MOCK_PLAYERS = [
  { id: "bot_1", name: "Alex" },
  { id: "bot_2", name: "Mia" },
  { id: "bot_3", name: "Jonas" },
];

const MOCK_FAKE_ANSWERS = [
  "Ich hab verschlafen, aber mein Wecker war kaputt. Ehrlich!",
  "Das Universum wollte das so.",
  "Mein Hund hat mein Handy versteckt.",
  "Ich war geistig anwesend, nur körperlich nicht.",
  "GPS-Problem. Und Schicksal.",
  "Ich hab gebetet, das hat länger gedauert.",
  "Der Bus hatte Urlaub.",
  "Ich war zu entspannt zum Stressen.",
];

function getMockFake(existing: string[]): string {
  const unused = MOCK_FAKE_ANSWERS.filter((a) => !existing.includes(a));
  return unused[Math.floor(Math.random() * unused.length)] ?? MOCK_FAKE_ANSWERS[0];
}

// ─── Scoring ──────────────────────────────────────────────────────────────────

function calcScores(
  submissions: WhoSaidItSubmission[],
  votes: WhoSaidItVote[],
  targetPlayerId: string
): Record<string, number> {
  const scores: Record<string, number> = {};

  const realSubmission = submissions.find((s) => s.isRealAnswer);
  if (!realSubmission) return scores;

  const correctVotes = votes.filter(
    (v) => v.selectedSubmissionId === realSubmission.id
  );
  const totalVoters = votes.length;
  const correctCount = correctVotes.length;

  // Raters who guessed correctly: +2
  for (const vote of correctVotes) {
    scores[vote.voterPlayerId] = (scores[vote.voterPlayerId] ?? 0) + 2;
  }

  // Fake writers who fooled someone: +1 per person
  for (const sub of submissions) {
    if (sub.isRealAnswer) continue;
    const fooled = votes.filter((v) => v.selectedSubmissionId === sub.id).length;
    if (fooled > 0) {
      scores[sub.playerId] = (scores[sub.playerId] ?? 0) + fooled;
    }
  }

  // Target survived (<50% found them): +2
  if (totalVoters > 0 && correctCount / totalVoters < 0.5) {
    scores[targetPlayerId] = (scores[targetPlayerId] ?? 0) + 2;
    // Target perfect (0% correct): +1 bonus
    if (correctCount === 0) {
      scores[targetPlayerId] = (scores[targetPlayerId] ?? 0) + 1;
    }
  }

  return scores;
}

// ─── Phase Components ─────────────────────────────────────────────────────────

function PhaseBadge({ label }: { label: string }) {
  return (
    <View
      style={{
        alignSelf: "center",
        backgroundColor: "rgba(111,43,211,0.35)",
        borderWidth: 1,
        borderColor: "rgba(168,85,247,0.5)",
        borderRadius: radii.round,
        paddingHorizontal: 14,
        paddingVertical: 5,
        marginBottom: 16,
      }}
    >
      <Text style={{ color: colors.white, fontFamily: fonts.mono, fontSize: 11, letterSpacing: 1.5 }}>
        {label}
      </Text>
    </View>
  );
}

function PromptCard({ text, category }: { text: string; category: string }) {
  return (
    <Animated.View
      entering={FadeInDown.duration(300)}
      style={{
        backgroundColor: "rgba(0,0,0,0.3)",
        borderRadius: radii.card,
        borderWidth: 1.5,
        borderColor: "rgba(168,85,247,0.35)",
        padding: spacing.xl,
        gap: 8,
      }}
    >
      <Text style={{ color: "rgba(168,85,247,0.8)", fontFamily: fonts.mono, fontSize: 10, letterSpacing: 1.5 }}>
        {category.toUpperCase()}
      </Text>
      <Text
        style={{
          color: colors.white,
          fontFamily: fonts.displayExtraBold,
          fontSize: 20,
          lineHeight: 27,
        }}
      >
        {text}
      </Text>
    </Animated.View>
  );
}

// ─── Write Phase ──────────────────────────────────────────────────────────────

function WritePhase({
  round,
  isTarget,
  onSubmit,
}: {
  round: WhoSaidItRound;
  isTarget: boolean;
  onSubmit: (answer: string) => void;
}) {
  const [answer, setAnswer] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const reducedMotion = useReducedMotion();

  const hint = isTarget
    ? "Du bist dran. Antworte ehrlich."
    : `Täusche die Gruppe — schreib so, als wärst du ${round.targetPlayerName}.`;

  return (
    <ScrollView
      contentContainerStyle={{ padding: spacing.xl, gap: 20, paddingBottom: 40 }}
      keyboardShouldPersistTaps="handled"
    >
      <Animated.View entering={reducedMotion ? undefined : FadeInUp.duration(260)}>
        <PhaseBadge label="SCHREIBPHASE ✍️" />
      </Animated.View>

      <Text style={{ color: colors.whiteSoft, fontFamily: fonts.body, fontSize: 13, textAlign: "center" }}>
        Runde {round.roundNumber}
      </Text>

      <PromptCard text={round.prompt.text} category={round.prompt.category} />

      {/* Role hint — identical visual weight for both roles */}
      <View
        style={{
          backgroundColor: "rgba(255,255,255,0.05)",
          borderRadius: radii.control,
          padding: 12,
          borderWidth: 1,
          borderColor: "rgba(255,255,255,0.1)",
        }}
      >
        <Text style={{ color: colors.whiteSoft, fontFamily: fonts.body, fontSize: 13, textAlign: "center", lineHeight: 18 }}>
          {hint}
        </Text>
      </View>

      {!submitted ? (
        <>
          <TextInput
            value={answer}
            onChangeText={setAnswer}
            placeholder="Deine Antwort…"
            placeholderTextColor="rgba(255,255,255,0.3)"
            multiline
            style={{
              backgroundColor: "rgba(0,0,0,0.3)",
              borderRadius: radii.control,
              borderWidth: 1.5,
              borderColor: "rgba(168,85,247,0.4)",
              color: colors.white,
              fontFamily: fonts.body,
              fontSize: 15,
              padding: 14,
              minHeight: 100,
              textAlignVertical: "top",
            }}
          />
          <Pressable
            onPress={() => {
              if (!answer.trim()) return;
              setSubmitted(true);
              onSubmit(answer.trim());
            }}
            style={({ pressed }) => ({
              backgroundColor: answer.trim() ? colors.stageGrape : "rgba(255,255,255,0.15)",
              borderRadius: radii.control,
              paddingVertical: 15,
              alignItems: "center",
              opacity: pressed ? 0.85 : 1,
            })}
          >
            <Text style={{ color: colors.white, fontFamily: fonts.bodyBold, fontSize: 16 }}>
              Antwort einreichen
            </Text>
          </Pressable>
        </>
      ) : (
        <Animated.View
          entering={FadeIn.duration(250)}
          style={{
            backgroundColor: "rgba(0,0,0,0.25)",
            borderRadius: radii.card,
            borderWidth: 1,
            borderColor: "rgba(255,255,255,0.1)",
            padding: 24,
            alignItems: "center",
            gap: 8,
          }}
        >
          <Text style={{ fontSize: 32 }}>✅</Text>
          <Text style={{ color: colors.white, fontFamily: fonts.bodyBold, fontSize: 16 }}>
            Antwort gespeichert.
          </Text>
          <Text style={{ color: colors.whiteSoft, fontFamily: fonts.body, fontSize: 13 }}>
            Warte auf die anderen…
          </Text>
        </Animated.View>
      )}
    </ScrollView>
  );
}

// ─── Vote Phase ───────────────────────────────────────────────────────────────

function VotePhase({
  round,
  myPlayerId,
  onVote,
}: {
  round: WhoSaidItRound;
  myPlayerId: string;
  onVote: (submissionId: string) => void;
}) {
  const [selected, setSelected] = useState<string | null>(null);
  const [voted, setVoted] = useState(false);
  const isTarget = myPlayerId === round.targetPlayerId;
  const reducedMotion = useReducedMotion();

  // Shuffle submissions once (stable during this phase)
  const shuffled = useRef([...round.submissions].sort(() => Math.random() - 0.5));

  if (isTarget) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center", padding: spacing.xl, gap: 16 }}>
        <Text style={{ fontSize: 48 }}>🕵️</Text>
        <Text style={{ color: colors.white, fontFamily: fonts.displayExtraBold, fontSize: 22, textAlign: "center" }}>
          Du bist die Zielperson
        </Text>
        <Text style={{ color: colors.whiteSoft, fontFamily: fonts.body, fontSize: 14, textAlign: "center" }}>
          Die anderen versuchen gerade herauszufinden, welche Antwort von dir stammt. Warte…
        </Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={{ padding: spacing.xl, gap: 18, paddingBottom: 40 }}>
      <Animated.View entering={reducedMotion ? undefined : FadeInUp.duration(260)}>
        <PhaseBadge label="ABSTIMMUNG 🗳️" />
      </Animated.View>

      <Text
        style={{
          color: colors.white,
          fontFamily: fonts.displayExtraBold,
          fontSize: 22,
          textAlign: "center",
          lineHeight: 28,
        }}
      >
        Welche Antwort stammt{"\n"}wirklich von{" "}
        <Text style={{ color: colors.sun }}>{round.targetPlayerName}</Text>?
      </Text>

      <PromptCard text={round.prompt.text} category={round.prompt.category} />

      <View style={{ gap: 10 }}>
        {shuffled.current.map((sub, i) => {
          // Can't vote for own fake answer
          const isOwnFake = sub.playerId === myPlayerId && !sub.isRealAnswer;
          const isSelected = selected === sub.id;

          return (
            <Animated.View
              key={sub.id}
              entering={reducedMotion ? undefined : FadeInDown.delay(i * 70).duration(240)}
            >
              <Pressable
                disabled={isOwnFake || voted}
                onPress={() => setSelected(sub.id)}
                style={({ pressed }) => ({
                  backgroundColor: isSelected
                    ? "rgba(111,43,211,0.35)"
                    : "rgba(0,0,0,0.25)",
                  borderRadius: radii.card,
                  borderWidth: 1.5,
                  borderColor: isSelected
                    ? "rgba(168,85,247,0.8)"
                    : "rgba(255,255,255,0.12)",
                  padding: 16,
                  opacity: isOwnFake ? 0.3 : pressed ? 0.8 : 1,
                })}
              >
                <Text
                  style={{
                    color: colors.white,
                    fontFamily: isSelected ? fonts.bodySemiBold : fonts.body,
                    fontSize: 15,
                    lineHeight: 21,
                  }}
                >
                  {sub.answerText}
                </Text>
              </Pressable>
            </Animated.View>
          );
        })}
      </View>

      {!voted && (
        <Pressable
          disabled={!selected}
          onPress={() => {
            if (!selected) return;
            setVoted(true);
            onVote(selected);
          }}
          style={({ pressed }) => ({
            backgroundColor: selected ? colors.stageGrape : "rgba(255,255,255,0.1)",
            borderRadius: radii.control,
            paddingVertical: 15,
            alignItems: "center",
            opacity: pressed ? 0.85 : 1,
            marginTop: 4,
          })}
        >
          <Text style={{ color: colors.white, fontFamily: fonts.bodyBold, fontSize: 16 }}>
            {selected ? "Stimme abgeben" : "Wähle eine Antwort"}
          </Text>
        </Pressable>
      )}

      {voted && (
        <Animated.View
          entering={FadeIn.duration(250)}
          style={{ alignItems: "center", gap: 8, paddingVertical: 16 }}
        >
          <Text style={{ color: colors.whiteSoft, fontFamily: fonts.body, fontSize: 14 }}>
            Stimme abgegeben. Warte auf die anderen…
          </Text>
        </Animated.View>
      )}
    </ScrollView>
  );
}

// ─── Reveal Phase ─────────────────────────────────────────────────────────────

function RevealPhase({
  round,
  onContinue,
}: {
  round: WhoSaidItRound;
  onContinue: () => void;
}) {
  const reducedMotion = useReducedMotion();
  const realSub = round.submissions.find((s) => s.isRealAnswer);
  const fakeSubs = round.submissions.filter((s) => !s.isRealAnswer);

  const correctVoters = round.votes
    .filter((v) => v.selectedSubmissionId === realSub?.id)
    .map((v) => round.submissions.find((s) => s.playerId === v.voterPlayerId)?.playerName ?? v.voterPlayerId);

  return (
    <ScrollView contentContainerStyle={{ padding: spacing.xl, gap: 20, paddingBottom: 40 }}>
      <Animated.View entering={reducedMotion ? undefined : FadeInUp.duration(260)}>
        <PhaseBadge label="AUFLÖSUNG 🎉" />
      </Animated.View>

      <PromptCard text={round.prompt.text} category={round.prompt.category} />

      {/* Real answer */}
      <Animated.View
        entering={reducedMotion ? undefined : FadeInDown.delay(100).duration(300)}
        style={{
          backgroundColor: "rgba(255,216,77,0.12)",
          borderRadius: radii.card,
          borderWidth: 2,
          borderColor: "rgba(255,216,77,0.6)",
          padding: 18,
          gap: 6,
        }}
      >
        <Text style={{ color: colors.sun, fontFamily: fonts.mono, fontSize: 10, letterSpacing: 1.5 }}>
          ✓ ECHTE ANTWORT — {round.targetPlayerName.toUpperCase()}
        </Text>
        <Text style={{ color: colors.white, fontFamily: fonts.bodyBold, fontSize: 16, lineHeight: 22 }}>
          {realSub?.answerText}
        </Text>
      </Animated.View>

      {/* Fake answers */}
      {fakeSubs.map((sub, i) => {
        const fooled = round.votes.filter((v) => v.selectedSubmissionId === sub.id).length;
        return (
          <Animated.View
            key={sub.id}
            entering={reducedMotion ? undefined : FadeInDown.delay(200 + i * 80).duration(260)}
            style={{
              backgroundColor: "rgba(0,0,0,0.25)",
              borderRadius: radii.card,
              borderWidth: 1,
              borderColor: "rgba(255,255,255,0.12)",
              padding: 16,
              gap: 6,
            }}
          >
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
              <Text style={{ color: colors.whiteSoft, fontFamily: fonts.mono, fontSize: 10, letterSpacing: 1 }}>
                FAKE — {sub.playerName.toUpperCase()}
              </Text>
              {fooled > 0 && (
                <View
                  style={{
                    backgroundColor: "rgba(197,42,135,0.3)",
                    borderRadius: radii.round,
                    paddingHorizontal: 8,
                    paddingVertical: 3,
                  }}
                >
                  <Text style={{ color: colors.white, fontFamily: fonts.mono, fontSize: 10 }}>
                    +{fooled} reingelegt
                  </Text>
                </View>
              )}
            </View>
            <Text style={{ color: colors.white, fontFamily: fonts.body, fontSize: 14, lineHeight: 20 }}>
              {sub.answerText}
            </Text>
          </Animated.View>
        );
      })}

      {/* Who got it right */}
      {correctVoters.length > 0 && (
        <Animated.View
          entering={reducedMotion ? undefined : FadeInDown.delay(500).duration(240)}
          style={{
            backgroundColor: "rgba(67,184,107,0.1)",
            borderRadius: radii.control,
            borderWidth: 1,
            borderColor: "rgba(67,184,107,0.3)",
            padding: 12,
          }}
        >
          <Text style={{ color: colors.online, fontFamily: fonts.bodySemiBold, fontSize: 13 }}>
            ✓ Richtig geraten: {correctVoters.join(", ")}
          </Text>
        </Animated.View>
      )}

      {correctVoters.length === 0 && (
        <Animated.View
          entering={reducedMotion ? undefined : FadeInDown.delay(500).duration(240)}
          style={{
            backgroundColor: "rgba(255,216,77,0.1)",
            borderRadius: radii.control,
            borderWidth: 1,
            borderColor: "rgba(255,216,77,0.3)",
            padding: 12,
          }}
        >
          <Text style={{ color: colors.sun, fontFamily: fonts.bodySemiBold, fontSize: 13 }}>
            🎭 Niemand hat {round.targetPlayerName} erkannt!
          </Text>
        </Animated.View>
      )}

      {/* Round scores */}
      <Animated.View
        entering={reducedMotion ? undefined : FadeInDown.delay(650).duration(260)}
        style={{ gap: 8 }}
      >
        <Text style={{ color: colors.whiteSoft, fontFamily: fonts.mono, fontSize: 11, letterSpacing: 1.5 }}>
          PUNKTE DIESE RUNDE
        </Text>
        {Object.entries(round.scores)
          .sort(([, a], [, b]) => b - a)
          .map(([playerId, pts]) => {
            const playerName =
              round.submissions.find((s) => s.playerId === playerId)?.playerName ?? playerId;
            return (
              <View
                key={playerId}
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  paddingVertical: 8,
                  borderBottomWidth: 1,
                  borderBottomColor: "rgba(255,255,255,0.07)",
                }}
              >
                <Text style={{ color: colors.white, fontFamily: fonts.bodySemiBold, fontSize: 14 }}>
                  {playerName}
                </Text>
                <Text style={{ color: colors.sun, fontFamily: fonts.mono, fontSize: 16, fontWeight: "700" }}>
                  +{pts}
                </Text>
              </View>
            );
          })}
      </Animated.View>

      <Animated.View entering={reducedMotion ? undefined : FadeInDown.delay(800).duration(240)}>
        <Pressable
          onPress={onContinue}
          style={({ pressed }) => ({
            backgroundColor: colors.stageGrape,
            borderRadius: radii.control,
            paddingVertical: 15,
            alignItems: "center",
            opacity: pressed ? 0.85 : 1,
            marginTop: 8,
          })}
        >
          <Text style={{ color: colors.white, fontFamily: fonts.bodyBold, fontSize: 16 }}>
            Weiter
          </Text>
        </Pressable>
      </Animated.View>
    </ScrollView>
  );
}

// ─── Result Phase ─────────────────────────────────────────────────────────────

function ResultPhase({
  players,
  onRestart,
  onExit,
}: {
  players: { id: string; name: string; totalScore: number }[];
  onRestart: () => void;
  onExit: () => void;
}) {
  const reducedMotion = useReducedMotion();
  const sorted = [...players].sort((a, b) => b.totalScore - a.totalScore);
  const winner = sorted[0];

  return (
    <ScrollView contentContainerStyle={{ padding: spacing.xl, gap: 20, paddingBottom: 40 }}>
      <Animated.View entering={reducedMotion ? undefined : FadeInUp.duration(280)}>
        <PhaseBadge label="ERGEBNIS 🏆" />
      </Animated.View>

      <View style={{ alignItems: "center", gap: 8 }}>
        <Text style={{ fontSize: 56 }}>🎉</Text>
        <Text style={{ color: colors.sun, fontFamily: fonts.displayExtraBold, fontSize: 28, textAlign: "center" }}>
          {winner.name} gewinnt!
        </Text>
        <Text style={{ color: colors.whiteSoft, fontFamily: fonts.body, fontSize: 14 }}>
          mit {winner.totalScore} Punkten
        </Text>
      </View>

      <View style={{ gap: 10, marginTop: 8 }}>
        {sorted.map((p, i) => (
          <Animated.View
            key={p.id}
            entering={reducedMotion ? undefined : FadeInDown.delay(i * 80).duration(240)}
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: i === 0 ? "rgba(255,216,77,0.1)" : "rgba(0,0,0,0.2)",
              borderRadius: radii.card,
              borderWidth: i === 0 ? 1.5 : 1,
              borderColor: i === 0 ? "rgba(255,216,77,0.5)" : "rgba(255,255,255,0.1)",
              padding: 16,
              gap: 14,
            }}
          >
            <Text style={{ fontSize: 24, width: 32, textAlign: "center" }}>
              {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `#${i + 1}`}
            </Text>
            <Text style={{ flex: 1, color: colors.white, fontFamily: fonts.bodyBold, fontSize: 16 }}>
              {p.name}
            </Text>
            <Text style={{ color: i === 0 ? colors.sun : colors.whiteSoft, fontFamily: fonts.mono, fontSize: 18, fontWeight: "700" }}>
              {p.totalScore} Pts
            </Text>
          </Animated.View>
        ))}
      </View>

      <View style={{ gap: 10, marginTop: 12 }}>
        <Pressable
          onPress={onRestart}
          style={({ pressed }) => ({
            backgroundColor: colors.stageGrape,
            borderRadius: radii.control,
            paddingVertical: 15,
            alignItems: "center",
            opacity: pressed ? 0.85 : 1,
          })}
        >
          <Text style={{ color: colors.white, fontFamily: fonts.bodyBold, fontSize: 16 }}>
            Nochmal spielen
          </Text>
        </Pressable>
        <Pressable
          onPress={onExit}
          style={({ pressed }) => ({
            backgroundColor: "rgba(255,255,255,0.08)",
            borderRadius: radii.control,
            paddingVertical: 15,
            alignItems: "center",
            opacity: pressed ? 0.85 : 1,
          })}
        >
          <Text style={{ color: colors.whiteSoft, fontFamily: fonts.bodyBold, fontSize: 15 }}>
            Beenden
          </Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

type Props = {
  onBack?: () => void;
};

export function WhoSaidItPlay({ onBack }: Props) {
  const { user } = useAuth();
  const { name } = useProfile();

  const myPlayer = { id: user?.id ?? "player_me", name: name || "Du" };
  const allPlayers = [myPlayer, ...MOCK_PLAYERS];

  const TOTAL_ROUNDS = Math.min(allPlayers.length, 4);

  // Shuffle prompts
  const prompts = useRef([...WHO_SAID_IT_PROMPTS].sort(() => Math.random() - 0.5).slice(0, TOTAL_ROUNDS));
  const targetOrder = useRef([...allPlayers].sort(() => Math.random() - 0.5));

  const [playerScores, setPlayerScores] = useState<Record<string, number>>(
    Object.fromEntries(allPlayers.map((p) => [p.id, 0]))
  );
  const [currentRoundIdx, setCurrentRoundIdx] = useState(0);
  const [phase, setPhase] = useState<"write" | "vote" | "reveal" | "result">("write");
  const [submissions, setSubmissions] = useState<WhoSaidItSubmission[]>([]);
  const [votes, setVotes] = useState<WhoSaidItVote[]>([]);
  const [roundScores, setRoundScores] = useState<Record<string, number>>({});

  const currentPrompt = prompts.current[currentRoundIdx];
  const targetPlayer = targetOrder.current[currentRoundIdx % targetOrder.current.length];
  const isMyTarget = targetPlayer.id === myPlayer.id;

  // Too few players check
  if (allPlayers.length < 3) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center", padding: 24, gap: 16 }}>
        <Text style={{ fontSize: 40 }}>🕵️</Text>
        <Text style={{ color: colors.white, fontFamily: fonts.displayExtraBold, fontSize: 24, textAlign: "center" }}>
          Zu wenige Spieler
        </Text>
        <Text style={{ color: colors.whiteSoft, fontFamily: fonts.body, fontSize: 15, textAlign: "center" }}>
          Dieser Modus braucht mindestens 3 Spieler.
        </Text>
      </View>
    );
  }

  const currentRound: WhoSaidItRound = {
    roundNumber: currentRoundIdx + 1,
    promptId: currentPrompt.id,
    prompt: currentPrompt,
    targetPlayerId: targetPlayer.id,
    targetPlayerName: targetPlayer.name,
    phase,
    submissions,
    votes,
    scores: roundScores,
  };

  // ── Write phase ──
  function handleWriteSubmit(answer: string) {
    const mySubmission: WhoSaidItSubmission = {
      id: `sub_me_${currentRoundIdx}`,
      playerId: myPlayer.id,
      playerName: myPlayer.name,
      answerText: answer,
      isRealAnswer: isMyTarget,
    };

    const fakeWriters = MOCK_PLAYERS.filter((p) => p.id !== targetPlayer.id);
    const realAnswerBot = MOCK_PLAYERS.find((p) => p.id === targetPlayer.id);

    const mockSubs: WhoSaidItSubmission[] = [];
    const usedAnswers: string[] = [answer];

    for (const bot of fakeWriters) {
      const fake = getMockFake(usedAnswers);
      usedAnswers.push(fake);
      mockSubs.push({
        id: `sub_${bot.id}_${currentRoundIdx}`,
        playerId: bot.id,
        playerName: bot.name,
        answerText: fake,
        isRealAnswer: false,
      });
    }

    if (realAnswerBot && !isMyTarget) {
      const realFake = getMockFake(usedAnswers);
      mockSubs.push({
        id: `sub_${realAnswerBot.id}_${currentRoundIdx}`,
        playerId: realAnswerBot.id,
        playerName: realAnswerBot.name,
        answerText: realFake,
        isRealAnswer: true,
      });
    }

    const allSubs = [mySubmission, ...mockSubs];
    setSubmissions(allSubs);

    // MOCK: simulate other players submitting, then go to vote
    setTimeout(() => {
      setPhase("vote");
    }, 2500);
  }

  // ── Vote phase ──
  function handleVote(submissionId: string) {
    const myVoteRecord: WhoSaidItVote = {
      voterPlayerId: myPlayer.id,
      selectedSubmissionId: submissionId,
    };

    // MOCK: bots vote
    const realSub = submissions.find((s) => s.isRealAnswer);
    const voters = MOCK_PLAYERS.filter((p) => p.id !== targetPlayer.id);
    const mockVotes: WhoSaidItVote[] = voters.map((bot) => {
      // Bots have ~35% chance of finding the real answer
      const guessesRight = Math.random() < 0.35;
      const target = guessesRight && realSub ? realSub : submissions[Math.floor(Math.random() * submissions.length)];
      return {
        voterPlayerId: bot.id,
        selectedSubmissionId: target.id,
      };
    });

    const allVotes = [myVoteRecord, ...mockVotes];

    setTimeout(() => {
      const scores = calcScores(submissions, allVotes, targetPlayer.id);
      setVotes(allVotes);
      setRoundScores(scores);
      setPlayerScores((prev) => {
        const next = { ...prev };
        for (const [pid, pts] of Object.entries(scores)) {
          next[pid] = (next[pid] ?? 0) + pts;
        }
        return next;
      });
      setPhase("reveal");
    }, 1500);
  }

  // ── Reveal → next round ──
  function handleContinue() {
    if (currentRoundIdx + 1 >= TOTAL_ROUNDS) {
      setPhase("result");
    } else {
      setCurrentRoundIdx((i) => i + 1);
      setSubmissions([]);
      setVotes([]);
      setRoundScores({});
      setPhase("write");
    }
  }

  function handleRestart() {
    prompts.current = [...WHO_SAID_IT_PROMPTS].sort(() => Math.random() - 0.5).slice(0, TOTAL_ROUNDS);
    targetOrder.current = [...allPlayers].sort(() => Math.random() - 0.5);
    setCurrentRoundIdx(0);
    setPlayerScores(Object.fromEntries(allPlayers.map((p) => [p.id, 0])));
    setSubmissions([]);
    setVotes([]);
    setRoundScores({});
    setPhase("write");
  }

  const playersWithScores = allPlayers.map((p) => ({
    ...p,
    totalScore: playerScores[p.id] ?? 0,
  }));

  if (phase === "result") {
    return (
      <ResultPhase
        players={playersWithScores}
        onRestart={handleRestart}
        onExit={onBack ?? (() => {})}
      />
    );
  }

  if (phase === "write") {
    return (
      <WritePhase
        round={currentRound}
        isTarget={isMyTarget}
        onSubmit={handleWriteSubmit}
      />
    );
  }

  if (phase === "vote") {
    return (
      <VotePhase
        round={currentRound}
        myPlayerId={myPlayer.id}
        onVote={handleVote}
      />
    );
  }

  if (phase === "reveal") {
    return (
      <RevealPhase
        round={{ ...currentRound, votes, scores: roundScores }}
        onContinue={handleContinue}
      />
    );
  }

  return null;
}
