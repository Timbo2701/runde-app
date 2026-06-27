/**
 * Zeichen-Vote Result Screen
 * Reveals who drew what, shows votes and points.
 *
 * MOCK: Reads strokes from AsyncStorage (keyed by code+round).
 * Bot player is always "Mika" with a mock drawing.
 * TODO Multiplayer: replace AsyncStorage read with real game state.
 */

import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";
import Animated, { FadeIn, FadeInDown, ZoomIn } from "react-native-reanimated";
import Svg, { Polyline } from "react-native-svg";

import { colors, fonts, radii, spacing } from "@/design/tokens";
import { useTrackEvent } from "@/lib/use-achievements";
import { useProfile } from "@/lib/profile-context";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import type { DrawStroke } from "@/types/drawing";
import { AchievementToast } from "@/ui/primitives/achievement-toast";
import { BrandButton } from "@/ui/primitives/brand-button";

// MOCK: Bot is a single local opponent. TODO Multiplayer: use real player name from game state.
const BOT_NAME = "Mika";
const CANVAS_REF = 300; // normalised reference width stored in AsyncStorage

// ── AsyncStorage keys (must match zeichen-vote-play.tsx) ─────────────────────

const drawingKey = (code: string, round: number) =>
  `@runde:drawing_${code}_${round}`;
const botDrawingKey = (code: string, round: number) =>
  `@runde:bot_drawing_${code}_${round}`;

// ── Helpers ───────────────────────────────────────────────────────────────────

function ptsToSvg(pts: { x: number; y: number }[]): string {
  return pts.map((p) => `${p.x},${p.y}`).join(" ");
}

function scaleStrokes(
  strokes: DrawStroke[],
  targetW: number,
  targetH: number
): DrawStroke[] {
  const sx = targetW / CANVAS_REF;
  const sy = targetH / CANVAS_REF;
  return strokes.map((s) => ({
    ...s,
    points: s.points.map((p) => ({ x: p.x * sx, y: p.y * sy })),
    width: Math.max(1, Math.round(s.width * Math.min(sx, sy))),
  }));
}

// ── DrawingCard ───────────────────────────────────────────────────────────────

function DrawingCard({
  strokes,
  label,
  author,
  votes,
  points,
  isWinner,
  rank,
  revealed,
  size = 150,
  reducedMotion,
  delay = 0,
}: {
  strokes: DrawStroke[];
  label: string;
  author: string;
  votes: number;
  points: number;
  isWinner: boolean;
  rank: number;
  revealed: boolean;
  size?: number;
  reducedMotion: boolean;
  delay?: number;
}) {
  const scaled = scaleStrokes(strokes, size, size);

  const rankEmoji = rank === 1 ? "🥇" : rank === 2 ? "🥈" : "🥉";
  const titleLabels = ["Zeichenlegende", "Meisterwerk?", "Picasso vom Dienst", "Chaos-Zeichner", "Talent optional", "Kunstverbrechen"];
  const titleLabel = titleLabels[Math.abs(author.charCodeAt(0) - 65) % titleLabels.length];

  return (
    <Animated.View
      entering={reducedMotion ? undefined : FadeInDown.delay(delay).duration(320)}
      style={{
        borderRadius: radii.card,
        borderCurve: "continuous",
        borderWidth: isWinner ? 2 : 1,
        borderColor: isWinner ? colors.sun : "rgba(255,255,255,0.15)",
        backgroundColor: isWinner ? "rgba(255,216,77,0.08)" : "rgba(255,255,255,0.05)",
        overflow: "hidden",
      }}
    >
      {/* Winner crown */}
      {isWinner && (
        <Animated.View
          entering={reducedMotion ? undefined : ZoomIn.delay(delay + 200).duration(380).springify().damping(10)}
          style={{
            position: "absolute",
            top: 10,
            right: 10,
            zIndex: 1,
            backgroundColor: colors.sun,
            borderRadius: radii.round,
            paddingHorizontal: 8,
            paddingVertical: 3,
          }}
        >
          <Text style={{ color: colors.ink, fontFamily: fonts.bodyBold, fontSize: 11 }}>
            GEWINNER
          </Text>
        </Animated.View>
      )}

      {/* 1 — Drawing canvas (hero) */}
      <View
        style={{
          backgroundColor: "#FEF9F2",
          borderBottomWidth: 1,
          borderBottomColor: isWinner ? "rgba(255,216,77,0.3)" : "rgba(255,255,255,0.08)",
          alignItems: "center",
          paddingVertical: 14,
          paddingHorizontal: 14,
        }}
      >
        <Svg width={size} height={size}>
          {scaled.map((stroke) =>
            stroke.points.length > 0 ? (
              <Polyline
                key={stroke.id}
                points={ptsToSvg(stroke.points)}
                stroke={stroke.color}
                strokeWidth={stroke.width}
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            ) : null
          )}
        </Svg>
      </View>

      {/* 2 — Info block */}
      <View style={{ padding: spacing.md, gap: 10 }}>
        {/* Rank emoji + author */}
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <Text style={{ fontSize: 20 }}>{rankEmoji}</Text>
          <View style={{ flex: 1 }}>
            {revealed ? (
              <>
                <Text style={{ color: colors.white, fontFamily: fonts.bodyBold, fontSize: 15, lineHeight: 19 }}>
                  {author}
                </Text>
                <Text style={{ color: colors.whiteSoft, fontFamily: fonts.body, fontSize: 11 }}>
                  {titleLabel}
                </Text>
              </>
            ) : (
              <Text style={{ color: "rgba(255,255,255,0.4)", fontFamily: fonts.body, fontSize: 13 }}>
                Zeichner: ???
              </Text>
            )}
          </View>
        </View>

        {/* 3 — Votes */}
        <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
          {Array.from({ length: Math.max(votes, 0) }).map((_, i) => (
            <View
              key={i}
              style={{
                width: 22,
                height: 22,
                borderRadius: 11,
                backgroundColor: isWinner ? "rgba(255,216,77,0.25)" : "rgba(255,255,255,0.12)",
                alignItems: "center",
                justifyContent: "center",
                borderWidth: 1,
                borderColor: isWinner ? "rgba(255,216,77,0.5)" : "rgba(255,255,255,0.2)",
              }}
            >
              <Text style={{ fontSize: 11, lineHeight: 15 }}>👍</Text>
            </View>
          ))}
          <Text style={{ color: "rgba(255,255,255,0.45)", fontFamily: fonts.body, fontSize: 12, marginLeft: 2 }}>
            {votes} Stimme{votes !== 1 ? "n" : ""}
          </Text>
        </View>

        {/* 4 — Points chip */}
        <View
          style={{
            alignSelf: "flex-start",
            paddingHorizontal: 12,
            paddingVertical: 5,
            borderRadius: radii.round,
            backgroundColor: isWinner ? "rgba(255,216,77,0.2)" : "rgba(255,255,255,0.08)",
            borderWidth: 1.5,
            borderColor: isWinner ? "rgba(255,216,77,0.55)" : "rgba(255,255,255,0.14)",
          }}
        >
          <Text
            style={{
              color: isWinner ? colors.sun : colors.whiteSoft,
              fontFamily: fonts.mono,
              fontSize: 14,
              fontWeight: "700",
            }}
          >
            +{points} Pkt
          </Text>
        </View>
      </View>
    </Animated.View>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

interface Props {
  params: Record<string, string | undefined>;
  onNext: () => void;
  isLastRound: boolean;
  roundNumber: number;
  totalRounds: number;
  code: string;
}

export function ZeichenVoteResult({
  params,
  onNext,
  isLastRound,
  roundNumber,
  totalRounds,
  code,
}: Props) {
  const { name: profileName } = useProfile();
  const myName = profileName || "Du";
  const reducedMotion = useReducedMotion();

  const playerVotedFor = params.playerVotedFor ?? "bot";
  // Bot always votes for the player (nice bot)
  const botVotedFor: string = "player";

  const [playerStrokes, setPlayerStrokes] = useState<DrawStroke[]>([]);
  const [botStrokes, setBotStrokes] = useState<DrawStroke[]>([]);
  const [strokesLoaded, setStrokesLoaded] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [toastDismissed, setToastDismissed] = useState(false);

  // Load drawings from AsyncStorage
  useEffect(() => {
    const load = async () => {
      const [playerRaw, botRaw] = await Promise.all([
        AsyncStorage.getItem(drawingKey(code, roundNumber)),
        AsyncStorage.getItem(botDrawingKey(code, roundNumber)),
      ]);
      if (playerRaw) setPlayerStrokes(JSON.parse(playerRaw) as DrawStroke[]);
      if (botRaw) setBotStrokes(JSON.parse(botRaw) as DrawStroke[]);
      setStrokesLoaded(true);
    };
    void load();
  }, [code, roundNumber]);

  // Tally votes
  const playerVotes =
    (playerVotedFor === "player" ? 1 : 0) + (botVotedFor === "player" ? 1 : 0);
  const botVotes =
    (playerVotedFor === "bot" ? 1 : 0) + (botVotedFor === "bot" ? 1 : 0);

  // Scoring: rank-based (most votes wins)
  // Platz 1: +3, Platz 2: +2, Tie: both +2
  const isTie = playerVotes === botVotes;
  const playerWins = playerVotes > botVotes;

  const playerPoints = isTie ? 2 : playerWins ? 3 : 1;
  const botPoints = isTie ? 2 : playerWins ? 1 : 3;

  const playerRank = isTie ? 1 : playerWins ? 1 : 2;
  const botRank = isTie ? 1 : playerWins ? 2 : 1;

  // Achievement: track drawing_legend (3 consecutive wins — tracked via round_won)
  const newlyUnlocked = useTrackEvent(
    playerWins && !isTie ? { type: "round_won", mode: "zeichen-vote", totalWins: 1 } : null
  );

  // Auto-reveal after short delay
  useEffect(() => {
    if (!strokesLoaded) return;
    const t = setTimeout(() => setRevealed(true), reducedMotion ? 100 : 900);
    return () => clearTimeout(t);
  }, [strokesLoaded, reducedMotion]);

  if (!strokesLoaded) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Text style={{ color: colors.whiteSoft, fontFamily: fonts.body, fontSize: 14 }}>
          Zeichnungen laden…
        </Text>
      </View>
    );
  }

  const resultLabel = isTie
    ? "Gleichstand! 🤝"
    : playerWins
    ? "Du gewinnst! 🎨"
    : `${BOT_NAME} gewinnt! 🃏`;

  const resultColor = isTie
    ? colors.whiteSoft
    : playerWins
    ? colors.sun
    : "rgba(255,255,255,0.85)";

  const cardSize = 160;

  // Sort so winner appears first
  const cards = [
    {
      id: "player",
      strokes: playerStrokes,
      author: myName,
      votes: playerVotes,
      points: playerPoints,
      rank: playerRank,
      isWinner: playerWins || isTie,
    },
    {
      id: "bot",
      strokes: botStrokes,
      author: BOT_NAME,
      votes: botVotes,
      points: botPoints,
      rank: botRank,
      isWinner: !playerWins || isTie,
    },
  ].sort((a, b) => a.rank - b.rank || (a.id === "player" ? -1 : 1));

  return (
    <View style={{ flex: 1, gap: 20 }}>
      {!toastDismissed && newlyUnlocked.length > 0 && (
        <AchievementToast
          unlockedIds={newlyUnlocked}
          onDismiss={() => setToastDismissed(true)}
        />
      )}

      {/* Header */}
      <Animated.View
        entering={reducedMotion ? undefined : FadeInDown.duration(300)}
        style={{ alignItems: "center", gap: 8 }}
      >
        <Animated.View
          entering={reducedMotion ? undefined : ZoomIn.delay(80).duration(360).springify().damping(10)}
          style={{
            width: 56,
            height: 56,
            borderRadius: 28,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "rgba(255,216,77,0.15)",
            borderWidth: 2,
            borderColor: "rgba(255,216,77,0.4)",
          }}
        >
          <Text style={{ fontSize: 28, lineHeight: 34 }}>🎨</Text>
        </Animated.View>

        <Text style={{ color: colors.sun, fontFamily: fonts.bodyBold, fontSize: 11, letterSpacing: 1.5 }}>
          ERGEBNIS · RUNDE {roundNumber}
        </Text>
        <Text
          style={{
            color: resultColor,
            fontFamily: fonts.displayExtraBold,
            fontSize: 30,
            lineHeight: 34,
            textAlign: "center",
          }}
        >
          {resultLabel}
        </Text>

        {!revealed && (
          <Animated.Text
            entering={reducedMotion ? undefined : FadeIn.duration(200)}
            style={{
              color: "rgba(255,255,255,0.45)",
              fontFamily: fonts.body,
              fontSize: 12,
            }}
          >
            Lüften wir den Vorhang…
          </Animated.Text>
        )}
      </Animated.View>

      {/* Drawing cards */}
      <View style={{ gap: 12 }}>
        {cards.map((card, i) => (
          <DrawingCard
            key={card.id}
            strokes={card.strokes}
            label={card.rank === 1 ? "🥇 Platz 1" : "🥈 Platz 2"}
            author={card.author}
            votes={card.votes}
            points={card.points}
            isWinner={card.isWinner}
            rank={card.rank}
            revealed={revealed}
            size={cardSize}
            reducedMotion={reducedMotion}
            delay={i * 140}
          />
        ))}
      </View>

      {/* Next round */}
      <Animated.View entering={reducedMotion ? undefined : FadeIn.delay(600).duration(280)}>
        <BrandButton
          label={isLastRound ? "Gesamtergebnis 🏆" : `Runde ${roundNumber + 1} →`}
          onPress={onNext}
          tone="sun"
        />
      </Animated.View>
    </View>
  );
}
