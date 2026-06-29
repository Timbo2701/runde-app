import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import Animated, {
  FadeInDown,
  FadeInUp,
  ZoomIn,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { colors, fonts, radii } from "@/design/tokens";
import { getBotResult, calcCloseGuessPoints, RANK_CONFIG } from "@/lib/ranked-logic";
import { useRanked } from "@/lib/ranked-context";
import { useAuth } from "@/lib/auth-context";
import { useRankedBots, useRankedQuestions } from "@/lib/supabase-hooks";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import type { MatchResult, MatchRoundResult, MindClashQuestion } from "@/types/ranked";
import { DataStatePanel } from "@/ui/primitives/data-state-panel";

const ROUND_TYPES = ["speed_choice", "close_guess", "bluff_tap"] as const;
const ROUND_LABELS = ["Speed Choice", "Close Guess", "Bluff Tap"];
const ROUND_EMOJIS = ["⚡", "🎯", "🃏"];
const ROUND_DESCS = ["Erste richtige Antwort gewinnt", "Schätze die Zahl so nah wie möglich", "Finde die einzig wahre Aussage"];
const ROUND_TIMERS = [10, 15, 8];

function createSubmissionId() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (char) => {
    const value = Math.floor(Math.random() * 16);
    return (char === "x" ? value : (value & 0x3) | 0x8).toString(16);
  });
}

type Phase = "round_intro" | "playing" | "round_result";

// ── Timer bar ─────────────────────────────────────────────────────────────────

function TimerBar({ seconds, max }: { seconds: number; max: number }) {
  const pct = seconds / max;
  const isUrgent = seconds <= 3;
  const color = pct > 0.5 ? colors.online : pct > 0.25 ? colors.sun : colors.stageCoral;

  return (
    <View style={{ gap: 6 }}>
      <View style={{
        height: 10,
        borderRadius: radii.round,
        backgroundColor: "rgba(255,255,255,0.1)",
        overflow: "hidden",
      }}>
        <View style={{
          width: `${pct * 100}%`,
          height: 10,
          borderRadius: radii.round,
          backgroundColor: color,
          shadowColor: color,
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: isUrgent ? 0.9 : 0.4,
          shadowRadius: isUrgent ? 8 : 4,
        }} />
      </View>
      <Text style={{
        color,
        fontFamily: fonts.displayExtraBold,
        fontSize: isUrgent ? 20 : 15,
        textAlign: "center",
        textShadowColor: isUrgent ? color : "transparent",
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: isUrgent ? 8 : 0,
      }}>
        {seconds}s
      </Text>
    </View>
  );
}

// ── Points pop animation ──────────────────────────────────────────────────────

function PointsPop({ points, visible }: { points: number; visible: boolean }) {
  const translateY = useSharedValue(0);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (!visible || points === 0) return;
    opacity.value = withSequence(withTiming(1, { duration: 100 }), withTiming(0, { duration: 600 }));
    translateY.value = withSequence(withTiming(-40, { duration: 500 }), withTiming(0, { duration: 0 }));
  }, [visible, points]);

  const style = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  if (!visible || points === 0) return null;
  return (
    <Animated.Text style={[{
      position: "absolute",
      top: -8,
      right: -8,
      color: colors.sun,
      fontFamily: fonts.displayExtraBold,
      fontSize: 22,
      textShadowColor: colors.sun,
      textShadowOffset: { width: 0, height: 0 },
      textShadowRadius: 10,
      zIndex: 20,
    }, style]}>
      +{points}
    </Animated.Text>
  );
}

// ── VS Header ────────────────────────────────────────────────────────────────

function VSHeader({
  playerScore, botScore, playerInitials, opponentName, opponentInitials, oppColor,
  roundIndex, botAnswered, answerSubmitted,
}: {
  playerScore: number; botScore: number;
  playerInitials: string;
  opponentName: string; opponentInitials: string; oppColor: string;
  roundIndex: number; botAnswered: boolean; answerSubmitted: boolean;
}) {
  const insets = useSafeAreaInsets();
  const playerLeading = playerScore > botScore;
  const tied = playerScore === botScore;

  return (
    <View style={{
      paddingTop: insets.top + 8,
      paddingHorizontal: 20,
      paddingBottom: 12,
      backgroundColor: "rgba(0,0,0,0.45)",
      borderBottomWidth: 1,
      borderBottomColor: "rgba(111,43,211,0.4)",
    }}>
      {/* Round label */}
      <Text style={{
        color: colors.sun,
        fontFamily: fonts.bodyBold,
        fontSize: 11,
        textAlign: "center",
        letterSpacing: 1.4,
        marginBottom: 10,
      }}>
        RUNDE {roundIndex + 1} / 3 • {ROUND_LABELS[roundIndex].toUpperCase()}
      </Text>

      {/* Player vs Opponent */}
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        {/* Player */}
        <View style={{ flex: 1, alignItems: "flex-start", gap: 4 }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            <View style={{
              width: 36, height: 36, borderRadius: 18,
              backgroundColor: colors.stageBerry,
              alignItems: "center", justifyContent: "center",
              borderWidth: playerLeading ? 2 : 1,
              borderColor: playerLeading ? colors.sun : colors.whiteSoft,
            }}>
              <Text style={{ color: colors.white, fontFamily: fonts.displayExtraBold, fontSize: playerInitials.length > 2 ? 10 : 14 }}>
                {playerInitials}
              </Text>
            </View>
            <View>
              <Text style={{ color: colors.white, fontFamily: fonts.bodyBold, fontSize: 14 }}>Du</Text>
              {answerSubmitted && (
                <Text style={{ color: colors.online, fontFamily: fonts.body, fontSize: 10 }}>
                  ✓ gelockt
                </Text>
              )}
            </View>
          </View>
        </View>

        {/* Scores */}
        <View style={{ alignItems: "center", paddingHorizontal: 16 }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            <View style={{ position: "relative" }}>
              <Text style={{
                color: playerLeading ? colors.sun : tied ? colors.white : colors.whiteSoft,
                fontFamily: fonts.displayExtraBold,
                fontSize: 34,
                textShadowColor: playerLeading ? colors.sun : "transparent",
                textShadowOffset: { width: 0, height: 0 },
                textShadowRadius: playerLeading ? 8 : 0,
              }}>
                {playerScore}
              </Text>
            </View>
            <Text style={{ color: "rgba(255,255,255,0.3)", fontFamily: fonts.displayExtraBold, fontSize: 20 }}>:</Text>
            <Text style={{
              color: !playerLeading && !tied ? colors.stageCoral : colors.whiteSoft,
              fontFamily: fonts.displayExtraBold,
              fontSize: 34,
            }}>
              {botScore}
            </Text>
          </View>
        </View>

        {/* Opponent */}
        <View style={{ flex: 1, alignItems: "flex-end", gap: 4 }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            <View>
              <Text style={{ color: colors.white, fontFamily: fonts.bodyBold, fontSize: 14, textAlign: "right" }}>
                {opponentName}
              </Text>
              {botAnswered && !answerSubmitted && (
                <Text style={{ color: oppColor, fontFamily: fonts.body, fontSize: 10, textAlign: "right" }}>
                  ✓ gelockt
                </Text>
              )}
            </View>
            <View style={{
              width: 36, height: 36, borderRadius: 18,
              backgroundColor: `${oppColor}22`,
              alignItems: "center", justifyContent: "center",
              borderWidth: !playerLeading && !tied ? 2 : 1,
              borderColor: !playerLeading && !tied ? oppColor : "rgba(255,255,255,0.3)",
            }}>
              <Text style={{ color: oppColor, fontFamily: fonts.displayExtraBold, fontSize: opponentInitials.length > 2 ? 10 : 14 }}>
                {opponentInitials}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

// ── Main screen ───────────────────────────────────────────────────────────────

export function RankedMatchScreen() {
  const { opponentId } = useLocalSearchParams<{ opponentId: string }>();
  const reducedMotion = useReducedMotion();
  const { rankedProfile } = useRanked();
  const { profile: authProfile } = useAuth();
  const playerInitials = authProfile?.avatarInitials ?? authProfile?.displayName?.slice(0, 2).toUpperCase() ?? "Du";
  const { data: rankedBots, loading: botsLoading, error: botsError, refresh: refreshBots } = useRankedBots();
  const { data: questionPool, loading: questionsLoading, error: questionsError, refresh: refreshQuestions } = useRankedQuestions();
  const opponent = rankedBots.find((bot) => bot.id === opponentId);
  const oppConfig = RANK_CONFIG[opponent?.tier ?? "bronze"];

  const [roundIndex, setRoundIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>("round_intro");
  const [timeLeft, setTimeLeft] = useState(ROUND_TIMERS[0]);
  const [roundResults, setRoundResults] = useState<MatchRoundResult[]>([]);
  const [playerScore, setPlayerScore] = useState(0);
  const [botScore, setBotScore] = useState(0);
  const [questions, setQuestions] = useState<MindClashQuestion[]>([]);
  const [questionSelectionError, setQuestionSelectionError] = useState<string | null>(null);
  const usedIds = useRef<string[]>([]);

  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [numberInput, setNumberInput] = useState("");
  const [bluffSelected, setBluffSelected] = useState<number | null>(null);
  const [answerSubmitted, setAnswerSubmitted] = useState(false);
  const [answerStartTime, setAnswerStartTime] = useState(Date.now());
  const [lastPoints, setLastPoints] = useState(0);
  const [showPointsPop, setShowPointsPop] = useState(false);

  const [botAnswered, setBotAnswered] = useState(false);
  const [botResult, setBotResult] = useState<{ correct: boolean; points: number } | null>(null);

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const clearTimer = () => { if (timerRef.current) clearTimeout(timerRef.current); };

  const currentQuestion = questions[roundIndex];
  const roundType = ROUND_TYPES[roundIndex];

  useEffect(() => {
    if (questionsLoading || questionsError) return;
    const timer = setTimeout(() => {
      const qs: MindClashQuestion[] = [];
      for (const type of ROUND_TYPES) {
        const remotePool = questionPool.filter((question) => question.roundType === type && !usedIds.current.includes(question.id));
        const q = remotePool[Math.floor(Math.random() * remotePool.length)];
        if (!q) {
          setQuestionSelectionError(`Für ${type} ist keine aktive Frage in Supabase vorhanden.`);
          setQuestions([]);
          return;
        }
        usedIds.current.push(q.id);
        qs.push(q);
      }
      setQuestionSelectionError(null);
      setQuestions(qs);
    }, 0);
    return () => clearTimeout(timer);
  }, [questionPool, questionsError, questionsLoading]);

  // Round intro → playing
  // NOTE: currentQuestion and opponent are in deps so the effect re-fires
  // once questions finish loading (phase/roundIndex alone don't change then).
  useEffect(() => {
    if (phase !== "round_intro" || !currentQuestion || !opponent) return;
    timerRef.current = setTimeout(() => {
      setPhase("playing");
      setTimeLeft(ROUND_TIMERS[roundIndex]);
      setAnswerStartTime(Date.now());
      setSelectedOption(null);
      setNumberInput("");
      setBluffSelected(null);
      setAnswerSubmitted(false);
      setBotAnswered(false);
      setBotResult(null);
      setShowPointsPop(false);
    }, 2000);
    return clearTimer;
  }, [phase, roundIndex, currentQuestion, opponent]);

  // Countdown
  useEffect(() => {
    if (phase !== "playing") return;
    if (timeLeft <= 0) { submitAnswer(null); return; }
    timerRef.current = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    return clearTimer;
  }, [phase, timeLeft]);

  // Bot
  useEffect(() => {
    if (phase !== "playing" || !currentQuestion) return;
    const bot = getBotResult(roundType, currentQuestion.correctNumber, opponent?.tier ?? "bronze");
    const delay = Math.min(bot.answerMs, ROUND_TIMERS[roundIndex] * 950);
    timerRef.current = setTimeout(() => {
      setBotAnswered(true);
      setBotResult(bot);
    }, delay);
    return clearTimer;
  }, [phase]);

  function submitAnswer(playerAnswer: number | string | null) {
    if (answerSubmitted) return;
    setAnswerSubmitted(true);
    clearTimer();

    const answerMs = Date.now() - answerStartTime;
    let playerPoints = 0;
    let playerCorrect = false;

    if (roundType === "speed_choice" && currentQuestion) {
      playerCorrect = playerAnswer === currentQuestion.correctOption;
      if (playerCorrect) {
        playerPoints = answerMs < 2000 ? 5 : answerMs < 5000 ? 4 : 3;
      }
    } else if (roundType === "close_guess" && currentQuestion) {
      const num = typeof playerAnswer === "string" ? parseInt(playerAnswer, 10) : 0;
      if (!isNaN(num) && playerAnswer !== null) {
        playerPoints = calcCloseGuessPoints(num, currentQuestion.correctNumber ?? 0);
        playerCorrect = playerPoints >= 3;
      }
    } else if (roundType === "bluff_tap" && currentQuestion) {
      playerCorrect = playerAnswer === currentQuestion.realStatementIndex;
      playerPoints = playerCorrect ? 3 : 0;
    }

    if (playerPoints > 0) {
      setLastPoints(playerPoints);
      setShowPointsPop(true);
      setTimeout(() => setShowPointsPop(false), 800);
    }

    const finalize = (bot: { correct: boolean; points: number }) => {
      const result: MatchRoundResult = {
        roundType, playerPoints, botPoints: bot.points,
        playerAnswerMs: answerMs, playerCorrect, botCorrect: bot.correct,
      };
      setRoundResults((prev) => [...prev, result]);
      setPlayerScore((s) => s + playerPoints);
      setBotScore((s) => s + bot.points);
      setTimeout(() => setPhase("round_result"), 700);
    };

    if (botResult) {
      finalize(botResult);
    } else {
      setTimeout(() => {
        const bot = getBotResult(roundType, currentQuestion?.correctNumber, opponent?.tier ?? "bronze");
        setBotResult(bot);
        finalize(bot);
      }, 900);
    }
  }

  function nextRound() {
    if (roundIndex >= 2) {
      finishMatch();
    } else {
      const nextIdx = roundIndex + 1;
      setRoundIndex(nextIdx);
      setPhase("round_intro");
      setTimeLeft(ROUND_TIMERS[nextIdx]);
    }
  }

  function finishMatch() {
    if (!opponent) return;
    const allRounds = roundResults;
    const totalPlayer = allRounds.reduce((s, r) => s + r.playerPoints, 0);
    const totalBot = allRounds.reduce((s, r) => s + r.botPoints, 0);
    const won = totalPlayer >= totalBot;
    const streakBonus = won && rankedProfile.winStreak >= 2 ? 5 : 0;
    const lpDelta = won
      ? 25 + Math.floor(Math.random() * 11) + streakBonus
      : -(15 + Math.floor(Math.random() * 11));

    const result: MatchResult = {
      submissionId: createSubmissionId(),
      rounds: allRounds,
      playerTotalPoints: totalPlayer,
      botTotalPoints: totalBot,
      won, lpDelta, streakBonus,
      isMvp: won && totalPlayer > totalBot + 2,
      opponent,
      newLp: Math.max(0, rankedProfile.lp + lpDelta),
      oldLp: rankedProfile.lp,
      oldTier: rankedProfile.tier,
      oldDivision: rankedProfile.division,
      rankUp: false,
    };
    router.replace({
      pathname: "/ranked/result" as never,
      params: { result: encodeURIComponent(JSON.stringify(result)) },
    });
  }

  const loadError = botsError ?? questionsError ?? questionSelectionError ?? (!botsLoading && !opponent ? "Der gewählte Gegner ist nicht mehr verfügbar." : null);
  if (botsLoading || questionsLoading || loadError || !currentQuestion || !opponent) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.stageGrapeDeep, justifyContent: "center", paddingHorizontal: 24 }}>
        <DataStatePanel
          title={botsLoading || questionsLoading ? "Match wird vorbereitet" : "Match kann nicht starten"}
          message={botsLoading || questionsLoading ? "Gegner und Fragen werden direkt aus Supabase geladen." : loadError ?? "Es fehlen Matchdaten."}
          loading={botsLoading || questionsLoading}
          onRetry={botsLoading || questionsLoading ? undefined : () => { void refreshBots(); void refreshQuestions(); }}
        />
        {!botsLoading && !questionsLoading ? (
          <Pressable onPress={() => router.replace("/ranked" as never)} style={{ alignItems: "center", padding: 18 }}>
            <Text style={{ color: colors.whiteSoft, fontFamily: fonts.bodySemiBold }}>Zurück zur Arena</Text>
          </Pressable>
        ) : null}
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#1A0E2E" }}>
      {/* Subtle arena glow top */}
      <View style={{
        position: "absolute", top: 0, left: 0, right: 0, height: 200,
        backgroundColor: "rgba(111,43,211,0.15)",
      }} pointerEvents="none" />

      {/* VS Header */}
      <VSHeader
        playerScore={playerScore}
        botScore={botScore}
        playerInitials={playerInitials}
        opponentName={opponent.name}
        opponentInitials={opponent.avatarEmoji}
        oppColor={oppConfig.color}
        roundIndex={roundIndex}
        botAnswered={botAnswered}
        answerSubmitted={answerSubmitted}
      />

      {/* Content */}
      <View style={{ flex: 1, paddingHorizontal: 20, paddingTop: 20, paddingBottom: 16 }}>

        {/* ── ROUND INTRO ── */}
        {phase === "round_intro" && (
          <Animated.View
            entering={reducedMotion ? undefined : FadeInDown.duration(300)}
            style={{ flex: 1, alignItems: "center", justifyContent: "center", gap: 20 }}
          >
            <Text style={{ fontSize: 52 }}>{ROUND_EMOJIS[roundIndex]}</Text>
            <View style={{ alignItems: "center", gap: 8 }}>
              <Text style={{ color: colors.whiteSoft, fontFamily: fonts.bodyBold, fontSize: 12, letterSpacing: 1.6 }}>
                RUNDE {roundIndex + 1} VON 3
              </Text>
              <Text style={{
                color: colors.white,
                fontFamily: fonts.displayExtraBold,
                fontSize: 36,
                textShadowColor: "rgba(168,85,247,0.5)",
                textShadowOffset: { width: 0, height: 0 },
                textShadowRadius: 16,
              }}>
                {ROUND_LABELS[roundIndex]}
              </Text>
              <Text style={{ color: colors.whiteSoft, fontFamily: fonts.body, fontSize: 15, textAlign: "center" }}>
                {ROUND_DESCS[roundIndex]}
              </Text>
            </View>
            {/* Round dots */}
            <View style={{ flexDirection: "row", gap: 8 }}>
              {[0, 1, 2].map((i) => (
                <View key={i} style={{
                  width: i === roundIndex ? 24 : 8,
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: i === roundIndex ? colors.sun : i < roundIndex ? colors.online : "rgba(255,255,255,0.2)",
                }} />
              ))}
            </View>
          </Animated.View>
        )}

        {/* ── PLAYING ── */}
        {phase === "playing" && (
          <Animated.View
            entering={reducedMotion ? undefined : FadeInDown.duration(250)}
            style={{ flex: 1, gap: 16 }}
          >
            {/* Timer */}
            <TimerBar seconds={timeLeft} max={ROUND_TIMERS[roundIndex]} />

            {/* Question battle-card */}
            <View style={{
              padding: 20,
              borderRadius: radii.card,
              backgroundColor: "rgba(255,255,255,0.06)",
              borderWidth: 1.5,
              borderColor: "rgba(111,43,211,0.5)",
            }}>
              <Text style={{ color: colors.whiteSoft, fontFamily: fonts.bodyBold, fontSize: 11, letterSpacing: 1.2, marginBottom: 10 }}>
                {ROUND_EMOJIS[roundIndex]} {ROUND_LABELS[roundIndex].toUpperCase()}
              </Text>
              <Text style={{
                color: colors.white,
                fontFamily: fonts.displayExtraBold,
                fontSize: 20,
                lineHeight: 28,
              }}>
                {currentQuestion.prompt}
              </Text>
              {roundType === "close_guess" && currentQuestion.hint && (
                <Text style={{ color: colors.whiteSoft, fontFamily: fonts.body, fontSize: 13, marginTop: 8 }}>
                  {currentQuestion.hint}
                </Text>
              )}
            </View>

            {/* ── Speed Choice ── */}
            {roundType === "speed_choice" && currentQuestion.options && (
              <View style={{ gap: 10, flex: 1 }}>
                {currentQuestion.options.map((opt, i) => {
                  const isSelected = selectedOption === i;
                  const showResult = answerSubmitted;
                  const isCorrect = i === currentQuestion.correctOption;
                  const isWrong = showResult && isSelected && !isCorrect;
                  const isRight = showResult && isCorrect;

                  return (
                    <View key={i} style={{ position: "relative" }}>
                      {isSelected && showResult && isCorrect && (
                        <PointsPop points={lastPoints} visible={showPointsPop} />
                      )}
                      <Pressable
                        onPress={() => {
                          if (answerSubmitted) return;
                          setSelectedOption(i);
                          submitAnswer(i);
                        }}
                        disabled={answerSubmitted}
                        style={({ pressed }) => ({
                          flexDirection: "row",
                          alignItems: "center",
                          gap: 12,
                          paddingVertical: 14,
                          paddingHorizontal: 16,
                          borderRadius: radii.control,
                          backgroundColor: isRight
                            ? "rgba(67,184,107,0.2)"
                            : isWrong
                            ? "rgba(240,68,110,0.2)"
                            : isSelected && !showResult
                            ? "rgba(111,43,211,0.4)"
                            : "rgba(255,255,255,0.06)",
                          borderWidth: isRight || isWrong || (isSelected && !showResult) ? 2 : 1.5,
                          borderColor: isRight
                            ? colors.online
                            : isWrong
                            ? colors.stageCoral
                            : isSelected && !showResult
                            ? colors.stageGrape
                            : "rgba(255,255,255,0.12)",
                          shadowColor: isRight ? colors.online : isSelected && !showResult ? colors.stageGrape : "transparent",
                          shadowOffset: { width: 0, height: 0 },
                          shadowOpacity: 0.5,
                          shadowRadius: 8,
                          opacity: pressed && !answerSubmitted ? 0.75 : showResult && !isCorrect && !isSelected ? 0.45 : 1,
                          transform: [{ scale: pressed && !answerSubmitted ? 0.98 : 1 }],
                        })}
                      >
                        <View style={{
                          width: 30, height: 30, borderRadius: 15,
                          backgroundColor: isRight ? colors.online : isWrong ? colors.stageCoral : isSelected && !showResult ? colors.stageGrape : "rgba(255,255,255,0.1)",
                          alignItems: "center", justifyContent: "center",
                        }}>
                          <Text style={{ color: colors.white, fontFamily: fonts.displayExtraBold, fontSize: 13 }}>
                            {isRight ? "✓" : isWrong ? "✗" : String.fromCharCode(65 + i)}
                          </Text>
                        </View>
                        <Text style={{
                          flex: 1,
                          color: colors.white,
                          fontFamily: isSelected ? fonts.bodyBold : fonts.bodySemiBold,
                          fontSize: 15,
                          lineHeight: 20,
                        }}>
                          {opt}
                        </Text>
                      </Pressable>
                    </View>
                  );
                })}
              </View>
            )}

            {/* ── Close Guess ── */}
            {roundType === "close_guess" && (
              <View style={{ gap: 14, flex: 1 }}>
                <View style={{
                  flexDirection: "row",
                  alignItems: "center",
                  borderRadius: radii.control,
                  backgroundColor: answerSubmitted ? "rgba(255,255,255,0.05)" : "rgba(111,43,211,0.2)",
                  borderWidth: 2,
                  borderColor: answerSubmitted ? colors.whiteFaint : colors.stageGrape,
                  paddingHorizontal: 20,
                  shadowColor: answerSubmitted ? "transparent" : colors.stageGrape,
                  shadowOffset: { width: 0, height: 0 },
                  shadowOpacity: 0.4,
                  shadowRadius: 10,
                }}>
                  <TextInput
                    keyboardType="numeric"
                    value={numberInput}
                    onChangeText={setNumberInput}
                    editable={!answerSubmitted}
                    placeholder="0"
                    placeholderTextColor="rgba(255,255,255,0.25)"
                    style={{
                      flex: 1,
                      color: colors.white,
                      fontFamily: fonts.displayExtraBold,
                      fontSize: 42,
                      paddingVertical: 16,
                    }}
                  />
                  <Text style={{ color: colors.whiteSoft, fontFamily: fonts.bodySemiBold, fontSize: 16 }}>
                    {currentQuestion.unit}
                  </Text>
                </View>

                {answerSubmitted ? (
                  <View style={{
                    padding: 16, borderRadius: radii.control,
                    backgroundColor: "rgba(255,216,77,0.1)",
                    borderWidth: 1, borderColor: "rgba(255,216,77,0.3)",
                    alignItems: "center",
                  }}>
                    <Text style={{ color: colors.whiteSoft, fontFamily: fonts.body, fontSize: 12 }}>Richtige Antwort</Text>
                    <Text style={{ color: colors.sun, fontFamily: fonts.displayExtraBold, fontSize: 28 }}>
                      {currentQuestion.correctNumber} {currentQuestion.unit}
                    </Text>
                    <Text style={{ color: lastPoints > 0 ? colors.online : colors.stageCoral, fontFamily: fonts.bodyBold, fontSize: 14, marginTop: 4 }}>
                      {lastPoints > 0 ? `+${lastPoints} Punkte` : "Zu weit daneben"}
                    </Text>
                  </View>
                ) : (
                  <Pressable
                    onPress={() => submitAnswer(numberInput)}
                    disabled={!numberInput}
                    style={({ pressed }) => ({
                      paddingVertical: 18,
                      borderRadius: radii.control,
                      backgroundColor: numberInput ? colors.sun : "rgba(255,255,255,0.08)",
                      alignItems: "center",
                      shadowColor: numberInput ? colors.sun : "transparent",
                      shadowOffset: { width: 0, height: 0 },
                      shadowOpacity: 0.5,
                      shadowRadius: 12,
                      opacity: pressed ? 0.8 : 1,
                      transform: [{ scale: pressed ? 0.98 : 1 }],
                    })}
                  >
                    <Text style={{
                      color: numberInput ? colors.ink : "rgba(255,255,255,0.3)",
                      fontFamily: fonts.displayExtraBold,
                      fontSize: 17,
                    }}>
                      {numberInput ? "Antwort senden →" : "Zahl eingeben…"}
                    </Text>
                  </Pressable>
                )}
              </View>
            )}

            {/* ── Bluff Tap ── */}
            {roundType === "bluff_tap" && currentQuestion.statements && (
              <View style={{ gap: 10, flex: 1 }}>
                {currentQuestion.statements.map((stmt, i) => {
                  const isSelected = bluffSelected === i;
                  const showResult = answerSubmitted;
                  const isReal = i === currentQuestion.realStatementIndex;
                  const isWrong = showResult && isSelected && !isReal;
                  const isRight = showResult && isReal;

                  return (
                    <Pressable
                      key={i}
                      onPress={() => {
                        if (answerSubmitted) return;
                        setBluffSelected(i);
                        submitAnswer(i);
                      }}
                      disabled={answerSubmitted}
                      style={({ pressed }) => ({
                        flexDirection: "row",
                        alignItems: "flex-start",
                        gap: 12,
                        padding: 16,
                        borderRadius: radii.control,
                        backgroundColor: isRight
                          ? "rgba(67,184,107,0.2)"
                          : isWrong
                          ? "rgba(240,68,110,0.18)"
                          : isSelected && !showResult
                          ? "rgba(111,43,211,0.35)"
                          : "rgba(255,255,255,0.06)",
                        borderWidth: 1.5,
                        borderColor: isRight
                          ? colors.online
                          : isWrong
                          ? colors.stageCoral
                          : isSelected && !showResult
                          ? colors.stageGrape
                          : "rgba(255,255,255,0.1)",
                        opacity: pressed && !answerSubmitted ? 0.75 : showResult && !isReal && !isSelected ? 0.4 : 1,
                        transform: [{ scale: pressed && !answerSubmitted ? 0.98 : 1 }],
                      })}
                    >
                      <View style={{
                        width: 26, height: 26, borderRadius: 13, marginTop: 1,
                        backgroundColor: isRight ? colors.online : isWrong ? colors.stageCoral : "rgba(255,255,255,0.12)",
                        alignItems: "center", justifyContent: "center", flexShrink: 0,
                      }}>
                        <Text style={{ color: colors.white, fontFamily: fonts.bodyBold, fontSize: 12 }}>
                          {isRight ? "✓" : isWrong ? "✗" : ["A", "B", "C"][i]}
                        </Text>
                      </View>
                      <Text style={{
                        flex: 1,
                        color: colors.white,
                        fontFamily: isSelected ? fonts.bodyBold : fonts.bodySemiBold,
                        fontSize: 14,
                        lineHeight: 21,
                      }}>
                        {stmt}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            )}
          </Animated.View>
        )}

        {/* ── ROUND RESULT ── */}
        {phase === "round_result" && (() => {
          const last = roundResults[roundResults.length - 1];
          if (!last) return null;
          const won = last.playerPoints > last.botPoints;
          const tied = last.playerPoints === last.botPoints;

          return (
            <Animated.View
              entering={reducedMotion ? undefined : FadeInUp.duration(350)}
              style={{ flex: 1, alignItems: "center", justifyContent: "center", gap: 24 }}
            >
              {/* Result icon */}
              <Animated.Text
                entering={reducedMotion ? undefined : ZoomIn.duration(280).springify().damping(22).stiffness(120)}
                style={{ fontSize: 64 }}
              >
                {last.playerCorrect || won ? "⚡" : "💨"}
              </Animated.Text>

              {/* Result text */}
              <View style={{ alignItems: "center", gap: 6 }}>
                <Text style={{
                  color: won ? colors.sun : tied ? colors.white : colors.stageCoral,
                  fontFamily: fonts.displayExtraBold,
                  fontSize: 32,
                  textShadowColor: won ? colors.sun : "transparent",
                  textShadowOffset: { width: 0, height: 0 },
                  textShadowRadius: won ? 12 : 0,
                }}>
                  {last.playerPoints > 0
                    ? `+${last.playerPoints} Punkte!`
                    : "Kein Punkt diese Runde"}
                </Text>
                <Text style={{ color: colors.whiteSoft, fontFamily: fonts.body, fontSize: 14 }}>
                  {last.playerCorrect
                    ? "Richtig! Gut gemacht."
                    : last.playerPoints > 0
                    ? "Nah dran – zählt!"
                    : `Richtig war: ${roundType === "close_guess" ? currentQuestion?.correctNumber + " " + (currentQuestion?.unit ?? "") : "Antwort B"}`}
                </Text>
              </View>

              {/* Score comparison */}
              <View style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 20,
                paddingHorizontal: 32,
                paddingVertical: 16,
                borderRadius: radii.card,
                backgroundColor: "rgba(0,0,0,0.3)",
                borderWidth: 1,
                borderColor: colors.whiteFaint,
              }}>
                <View style={{ alignItems: "center" }}>
                  <Text style={{ color: colors.whiteSoft, fontFamily: fonts.body, fontSize: 11 }}>Du</Text>
                  <Text style={{ color: colors.white, fontFamily: fonts.displayExtraBold, fontSize: 32 }}>
                    {playerScore}
                  </Text>
                </View>
                <Text style={{ color: "rgba(255,255,255,0.3)", fontFamily: fonts.displayExtraBold, fontSize: 22 }}>:</Text>
                <View style={{ alignItems: "center" }}>
                  <Text style={{ color: colors.whiteSoft, fontFamily: fonts.body, fontSize: 11 }}>{opponent.name}</Text>
                  <Text style={{ color: oppConfig.color, fontFamily: fonts.displayExtraBold, fontSize: 32 }}>
                    {botScore}
                  </Text>
                </View>
              </View>

              {/* Round dots progress */}
              <View style={{ flexDirection: "row", gap: 8, alignItems: "center" }}>
                {[0, 1, 2].map((i) => (
                  <View key={i} style={{
                    width: i === roundIndex ? 28 : 8,
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: i < roundIndex
                      ? colors.online
                      : i === roundIndex
                      ? (won ? colors.sun : colors.stageCoral)
                      : "rgba(255,255,255,0.15)",
                  }} />
                ))}
              </View>

              {/* Next button */}
              <Pressable
                onPress={nextRound}
                style={({ pressed }) => ({
                  paddingHorizontal: 40,
                  paddingVertical: 16,
                  borderRadius: radii.control,
                  backgroundColor: colors.sun,
                  shadowColor: colors.sun,
                  shadowOffset: { width: 0, height: 0 },
                  shadowOpacity: 0.5,
                  shadowRadius: 12,
                  opacity: pressed ? 0.85 : 1,
                  transform: [{ scale: pressed ? 0.97 : 1 }],
                })}
              >
                <Text style={{ color: colors.ink, fontFamily: fonts.displayExtraBold, fontSize: 17 }}>
                  {roundIndex >= 2 ? "Ergebnis ansehen →" : `Runde ${roundIndex + 2} starten →`}
                </Text>
              </Pressable>
            </Animated.View>
          );
        })()}
      </View>
    </View>
  );
}
