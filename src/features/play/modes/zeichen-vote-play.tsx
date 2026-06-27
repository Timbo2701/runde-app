/**
 * Zeichen-Vote Play Screen
 * Phase 1: DRAW — player draws on canvas
 * Phase 2: VOTE — both drawings shown anonymously, player votes
 *
 * MOCK: Bot drawings are hardcoded stroke arrays (see BOT_DRAWING_TEMPLATES).
 * TODO Multiplayer: replace with real remote player strokes from game state.
 */

import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useRef, useState } from "react";
import { PanResponder, Pressable, Text, View, useWindowDimensions } from "react-native";
import Animated, { FadeIn, FadeInDown, FadeInUp } from "react-native-reanimated";
import Svg, { Polyline } from "react-native-svg";

import { colors, fonts, radii, spacing } from "@/design/tokens";
import type { RoundQuestion } from "@/lib/game-types";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import type { DrawPoint, DrawStroke } from "@/types/drawing";
import { BrandButton } from "@/ui/primitives/brand-button";

const BOT_NAME = "Mika";

// ── Color palette ─────────────────────────────────────────────────────────────

const DRAW_COLORS: { id: string; value: string; label: string }[] = [
  { id: "dark",   value: "#1A0B2E", label: "Dunkel" },
  { id: "pink",   value: "#C52A87", label: "Pink"   },
  { id: "purple", value: "#6F2BD3", label: "Lila"   },
  { id: "yellow", value: "#E8A000", label: "Gelb"   },
  { id: "white",  value: "#F8F5FF", label: "Weiß"   },
];

const DRAW_SIZES: { id: string; value: number; label: string }[] = [
  { id: "sm", value: 3,  label: "S" },
  { id: "md", value: 6,  label: "M" },
  { id: "lg", value: 12, label: "L" },
];

// ── Mock bot drawing templates ────────────────────────────────────────────────
// MOCK: Hardcoded for single-player MVP.
// TODO Multiplayer: replace with actual strokes from remote player.

function circlePts(cx: number, cy: number, r: number, n = 20): DrawPoint[] {
  return Array.from({ length: n + 1 }, (_, i) => ({
    x: Math.round(cx + r * Math.cos((i / n) * 2 * Math.PI)),
    y: Math.round(cy + r * Math.sin((i / n) * 2 * Math.PI)),
  }));
}

function linePts(x1: number, y1: number, x2: number, y2: number, steps = 8): DrawPoint[] {
  return Array.from({ length: steps + 1 }, (_, i) => ({
    x: Math.round(x1 + ((x2 - x1) * i) / steps),
    y: Math.round(y1 + ((y2 - y1) * i) / steps),
  }));
}

// Canvas reference size for bot templates: 300 × 220
const BOT_DRAWING_TEMPLATES: DrawStroke[][] = [
  // Template 0 — stick figure
  [
    { id: "b0-head", color: "#1A0B2E", width: 5, points: circlePts(150, 55, 35) },
    { id: "b0-leye", color: "#1A0B2E", width: 8, points: [{x:135,y:48},{x:135,y:49}] },
    { id: "b0-reye", color: "#1A0B2E", width: 8, points: [{x:165,y:48},{x:165,y:49}] },
    { id: "b0-mouth", color: "#C52A87", width: 4, points: [{x:135,y:70},{x:145,y:78},{x:155,y:78},{x:165,y:70}] },
    { id: "b0-body", color: "#1A0B2E", width: 5, points: linePts(150,90,150,175) },
    { id: "b0-larm", color: "#1A0B2E", width: 5, points: linePts(150,120,105,148) },
    { id: "b0-rarm", color: "#1A0B2E", width: 5, points: linePts(150,120,195,148) },
    { id: "b0-lleg", color: "#1A0B2E", width: 5, points: linePts(150,175,120,215) },
    { id: "b0-rleg", color: "#1A0B2E", width: 5, points: linePts(150,175,180,215) },
  ],
  // Template 1 — simple cat face
  [
    { id: "b1-head", color: "#1A0B2E", width: 5, points: circlePts(150, 110, 70) },
    { id: "b1-lear", color: "#1A0B2E", width: 4, points: [{x:95,y:55},{x:80,y:20},{x:120,y:50}] },
    { id: "b1-rear", color: "#1A0B2E", width: 4, points: [{x:205,y:55},{x:220,y:20},{x:180,y:50}] },
    { id: "b1-leye", color: "#6F2BD3", width: 8, points: [{x:120,y:100},{x:121,y:101}] },
    { id: "b1-reye", color: "#6F2BD3", width: 8, points: [{x:180,y:100},{x:181,y:101}] },
    { id: "b1-nose", color: "#C52A87", width: 5, points: [{x:142,y:120},{x:150,y:128},{x:158,y:120}] },
    { id: "b1-wl1", color: "#1A0B2E", width: 3, points: linePts(80,118,130,122) },
    { id: "b1-wl2", color: "#1A0B2E", width: 3, points: linePts(80,130,130,130) },
    { id: "b1-wr1", color: "#1A0B2E", width: 3, points: linePts(220,118,170,122) },
    { id: "b1-wr2", color: "#1A0B2E", width: 3, points: linePts(220,130,170,130) },
  ],
  // Template 2 — house
  [
    { id: "b2-wall", color: "#1A0B2E", width: 5, points: [{x:65,y:140},{x:65,y:210},{x:235,y:210},{x:235,y:140},{x:65,y:140}] },
    { id: "b2-roof", color: "#C52A87", width: 5, points: [{x:45,y:140},{x:150,y:50},{x:255,y:140}] },
    { id: "b2-door", color: "#6F2BD3", width: 4, points: [{x:128,y:210},{x:128,y:170},{x:172,y:170},{x:172,y:210}] },
    { id: "b2-wndL", color: "#E8A000", width: 4, points: [{x:80,y:158},{x:80,y:185},{x:110,y:185},{x:110,y:158},{x:80,y:158}] },
    { id: "b2-wndR", color: "#E8A000", width: 4, points: [{x:190,y:158},{x:190,y:185},{x:220,y:185},{x:220,y:158},{x:190,y:158}] },
    { id: "b2-chimney", color: "#1A0B2E", width: 5, points: [{x:190,y:75},{x:190,y:110},{x:215,y:110},{x:215,y:90}] },
    { id: "b2-smoke", color: "#6F2BD3", width: 3, points: [{x:202,y:72},{x:198,y:60},{x:206,y:48},{x:200,y:36}] },
  ],
  // Template 3 — star burst scribble (artistic chaos)
  [
    { id: "b3-s1", color: "#C52A87", width: 4, points: linePts(150,110,150,20) },
    { id: "b3-s2", color: "#C52A87", width: 4, points: linePts(150,110,230,60) },
    { id: "b3-s3", color: "#C52A87", width: 4, points: linePts(150,110,220,185) },
    { id: "b3-s4", color: "#C52A87", width: 4, points: linePts(150,110,80,185) },
    { id: "b3-s5", color: "#C52A87", width: 4, points: linePts(150,110,70,60) },
    { id: "b3-s6", color: "#6F2BD3", width: 4, points: linePts(150,110,255,110) },
    { id: "b3-s7", color: "#6F2BD3", width: 4, points: linePts(150,110,45,110) },
    { id: "b3-s8", color: "#6F2BD3", width: 4, points: linePts(150,110,188,25) },
    { id: "b3-c1", color: "#E8A000", width: 3, points: circlePts(150,110,55) },
    { id: "b3-c2", color: "#E8A000", width: 2, points: circlePts(150,110,28) },
  ],
  // Template 4 — messy wave (ocean attempt)
  [
    { id: "b4-w1", color: "#6F2BD3", width: 6, points: [{x:10,y:90},{x:40,y:70},{x:70,y:90},{x:100,y:70},{x:130,y:90},{x:160,y:70},{x:190,y:90},{x:220,y:70},{x:250,y:90},{x:280,y:70},{x:300,y:90}] },
    { id: "b4-w2", color: "#6F2BD3", width: 6, points: [{x:10,y:120},{x:40,y:100},{x:70,y:120},{x:100,y:100},{x:130,y:120},{x:160,y:100},{x:190,y:120},{x:220,y:100},{x:250,y:120},{x:280,y:100},{x:300,y:120}] },
    { id: "b4-w3", color: "#1A0B2E", width: 6, points: [{x:10,y:150},{x:40,y:130},{x:70,y:150},{x:100,y:130},{x:130,y:150},{x:160,y:130},{x:190,y:150},{x:220,y:130},{x:250,y:150},{x:280,y:130},{x:300,y:150}] },
    { id: "b4-sun", color: "#E8A000", width: 5, points: circlePts(240,45,30) },
    { id: "b4-sunr1", color: "#E8A000", width: 3, points: linePts(240,8,240,2) },
    { id: "b4-sunr2", color: "#E8A000", width: 3, points: linePts(270,18,276,12) },
    { id: "b4-sunr3", color: "#E8A000", width: 3, points: linePts(277,48,285,48) },
    { id: "b4-boat", color: "#C52A87", width: 5, points: [{x:90,y:88},{x:130,y:88},{x:140,y:108},{x:80,y:108},{x:90,y:88}] },
    { id: "b4-mast", color: "#1A0B2E", width: 3, points: linePts(110,88,110,60) },
    { id: "b4-sail", color: "#F8F5FF", width: 2, points: [{x:110,y:62},{x:110,y:85},{x:135,y:85}] },
  ],
];

// ── Helpers ───────────────────────────────────────────────────────────────────

function ptsToSvg(pts: DrawPoint[]): string {
  return pts.map((p) => `${p.x},${p.y}`).join(" ");
}

function scaleStrokes(strokes: DrawStroke[], scaleX: number, scaleY: number): DrawStroke[] {
  return strokes.map((s) => ({
    ...s,
    points: s.points.map((p) => ({ x: p.x * scaleX, y: p.y * scaleY })),
    width: Math.round(s.width * Math.min(scaleX, scaleY)),
  }));
}

// AsyncStorage keys for drawing data (code + round scoped)
const drawingKey = (code: string, round: number) =>
  `@runde:drawing_${code}_${round}`;
const botDrawingKey = (code: string, round: number) =>
  `@runde:bot_drawing_${code}_${round}`;

// ── DrawingCanvas ─────────────────────────────────────────────────────────────

interface CanvasProps {
  strokes: DrawStroke[];
  currentStroke: DrawPoint[];
  currentColor: string;
  currentWidth: number;
  canvasWidth: number;
  canvasHeight: number;
  onTouchStart: (x: number, y: number) => void;
  onTouchMove: (x: number, y: number) => void;
  onTouchEnd: () => void;
  readonly?: boolean;
  scale?: number;
}

function DrawingCanvas({
  strokes,
  currentStroke,
  currentColor,
  currentWidth,
  canvasWidth,
  canvasHeight,
  onTouchStart,
  onTouchMove,
  onTouchEnd,
  readonly = false,
  scale = 1,
}: CanvasProps) {
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => !readonly,
      onMoveShouldSetPanResponder: () => !readonly,
      onPanResponderGrant: (evt) => {
        const { locationX, locationY } = evt.nativeEvent;
        onTouchStart(locationX, locationY);
      },
      onPanResponderMove: (evt) => {
        const { locationX, locationY } = evt.nativeEvent;
        onTouchMove(locationX, locationY);
      },
      onPanResponderRelease: () => onTouchEnd(),
      onPanResponderTerminate: () => onTouchEnd(),
    })
  ).current;

  const scaledStrokes = scale !== 1 ? scaleStrokes(strokes, scale, scale) : strokes;
  const scaledCurrent: DrawStroke | null =
    currentStroke.length > 0
      ? {
          id: "current",
          color: currentColor,
          width: currentWidth,
          points: scale !== 1 ? currentStroke.map((p) => ({ x: p.x * scale, y: p.y * scale })) : currentStroke,
        }
      : null;

  return (
    <View
      style={{
        width: canvasWidth,
        height: canvasHeight,
        borderRadius: radii.card,
        borderCurve: "continuous",
        overflow: "hidden",
        backgroundColor: "#FEF9F2",
        borderWidth: 2,
        borderColor: "rgba(197,42,135,0.35)",
        shadowColor: "#C52A87",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.18,
        shadowRadius: 12,
      }}
      {...(readonly ? {} : panResponder.panHandlers)}
    >
      <Svg
        width={canvasWidth}
        height={canvasHeight}
        style={{ position: "absolute", top: 0, left: 0 }}
      >
        {scaledStrokes.map((stroke) =>
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
        {scaledCurrent && scaledCurrent.points.length > 0 && (
          <Polyline
            points={ptsToSvg(scaledCurrent.points)}
            stroke={scaledCurrent.color}
            strokeWidth={scaledCurrent.width}
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}
      </Svg>
      {readonly && strokes.length === 0 && (
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
          <Text style={{ color: "rgba(111,43,211,0.4)", fontFamily: fonts.body, fontSize: 13 }}>
            Leere Leinwand
          </Text>
        </View>
      )}
    </View>
  );
}

// ── ColorButton ───────────────────────────────────────────────────────────────

function ColorButton({
  color,
  selected,
  onPress,
}: {
  color: { id: string; value: string; label: string };
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityLabel={color.label}
      style={({ pressed }) => ({
        width: 34,
        height: 34,
        borderRadius: 17,
        backgroundColor: color.value,
        borderWidth: selected ? 3 : 1.5,
        borderColor: selected ? colors.sun : "rgba(255,255,255,0.4)",
        transform: [{ scale: pressed ? 0.92 : selected ? 1.08 : 1 }],
        ...(color.value === "#F8F5FF" && {
          borderColor: selected ? colors.sun : "rgba(111,43,211,0.4)",
        }),
      })}
    />
  );
}

// ── SizeButton ────────────────────────────────────────────────────────────────

function SizeButton({
  size,
  selected,
  onPress,
}: {
  size: { id: string; value: number; label: string };
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityLabel={`Stiftgröße ${size.label}`}
      style={({ pressed }) => ({
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: selected ? "rgba(255,216,77,0.2)" : "rgba(255,255,255,0.08)",
        borderWidth: selected ? 2 : 1,
        borderColor: selected ? colors.sun : "rgba(255,255,255,0.2)",
        opacity: pressed ? 0.7 : 1,
      })}
    >
      <View
        style={{
          width: Math.min(size.value * 2.2, 26),
          height: Math.min(size.value * 2.2, 26),
          borderRadius: 13,
          backgroundColor: selected ? colors.sun : "rgba(255,255,255,0.6)",
        }}
      />
    </Pressable>
  );
}

// ── DrawingPreviewCard ────────────────────────────────────────────────────────
// Tapping the entire card selects it — no inner button.

function DrawingPreviewCard({
  label,
  strokes,
  isVoted,
  canVote,
  onVote,
  reducedMotion,
}: {
  label: string;
  strokes: DrawStroke[];
  isVoted: boolean;
  canVote: boolean;
  onVote: () => void;
  reducedMotion: boolean;
}) {
  const previewSize = 150;
  const scaleF = previewSize / 300;

  return (
    <Animated.View
      entering={reducedMotion ? undefined : FadeInUp.delay(label === "A" ? 0 : 140).duration(320)}
      style={{ flex: 1 }}
    >
      <Pressable
        onPress={canVote ? onVote : undefined}
        disabled={!canVote && !isVoted}
        style={({ pressed }) => ({
          borderRadius: radii.card,
          borderCurve: "continuous",
          borderWidth: 2.5,
          borderColor: isVoted ? colors.sun : "rgba(255,255,255,0.12)",
          backgroundColor: isVoted
            ? "rgba(255,216,77,0.1)"
            : "rgba(255,255,255,0.05)",
          overflow: "hidden",
          transform: [{ scale: pressed ? 0.97 : 1 }],
          opacity: pressed ? 0.9 : 1,
        })}
      >
        {/* A / B badge */}
        <View
          style={{
            position: "absolute",
            top: 8,
            left: 10,
            zIndex: 2,
            backgroundColor: isVoted ? colors.sun : "rgba(0,0,0,0.45)",
            borderRadius: radii.round,
            paddingHorizontal: 8,
            paddingVertical: 2,
          }}
        >
          <Text
            style={{
              color: isVoted ? colors.ink : colors.white,
              fontFamily: fonts.displayExtraBold,
              fontSize: 12,
              lineHeight: 18,
            }}
          >
            {label}
          </Text>
        </View>

        {/* Selected checkmark */}
        {isVoted && (
          <Animated.View
            entering={reducedMotion ? undefined : FadeIn.duration(180)}
            style={{
              position: "absolute",
              top: 8,
              right: 10,
              zIndex: 2,
              width: 24,
              height: 24,
              borderRadius: 12,
              backgroundColor: colors.sun,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={{ color: colors.ink, fontSize: 13, lineHeight: 18 }}>✓</Text>
          </Animated.View>
        )}

        {/* Canvas */}
        <View style={{ padding: 10, paddingTop: 36 }}>
          <DrawingCanvas
            strokes={scaleStrokes(strokes, scaleF, previewSize / 220)}
            currentStroke={[]}
            currentColor="#1A0B2E"
            currentWidth={4}
            canvasWidth={previewSize}
            canvasHeight={previewSize}
            onTouchStart={() => {}}
            onTouchMove={() => {}}
            onTouchEnd={() => {}}
            readonly
          />
        </View>

        {/* Bottom hint */}
        <View style={{ paddingHorizontal: 10, paddingBottom: 12, alignItems: "center" }}>
          <Text
            style={{
              color: isVoted ? colors.sun : "rgba(255,255,255,0.45)",
              fontFamily: fonts.bodySemiBold,
              fontSize: 12,
            }}
          >
            {isVoted ? "✓ Ausgewählt" : canVote ? "Antippen →" : ""}
          </Text>
        </View>
      </Pressable>
    </Animated.View>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────

interface Props {
  code: string;
  roundNumber: number;
  totalRounds: number;
  question: RoundQuestion;
  onResult: (playerVotedFor: string) => void;
}

type Phase = "draw" | "vote";

export function ZeichenVotePlay({ code, roundNumber, totalRounds, question, onResult }: Props) {
  const { width: screenWidth } = useWindowDimensions();
  const reducedMotion = useReducedMotion();

  const canvasWidth = Math.min(screenWidth - spacing.lg * 2, 360);
  const canvasHeight = Math.round(canvasWidth * 0.73);

  const [phase, setPhase] = useState<Phase>("draw");
  const [strokes, setStrokes] = useState<DrawStroke[]>([]);
  const [currentStroke, setCurrentStroke] = useState<DrawPoint[]>([]);
  const [activeColor, setActiveColor] = useState(DRAW_COLORS[0].value);
  const [activeSize, setActiveSize] = useState(DRAW_SIZES[1].value);
  const [normalisedStrokes, setNormalisedStrokes] = useState<DrawStroke[]>([]);
  const [playerVote, setPlayerVote] = useState<"player" | "bot" | null>(null);
  const [voteSubmitted, setVoteSubmitted] = useState(false);

  const strokeIdRef = useRef(0);
  // Refs mirror state so PanResponder callbacks always read current values
  const currentStrokeRef = useRef<DrawPoint[]>([]);
  const strokesRef = useRef<DrawStroke[]>([]);
  const activeColorRef = useRef(DRAW_COLORS[0].value);
  const activeSizeRef = useRef(DRAW_SIZES[1].value);
  const botTemplate = BOT_DRAWING_TEMPLATES[(roundNumber - 1) % BOT_DRAWING_TEMPLATES.length];

  // Shuffle A/B assignment once per round (so player isn't always A)
  const [playerIsA] = useState(() => roundNumber % 2 === 0);

  useEffect(() => {
    // Reset on round change
    setPhase("draw");
    setStrokes([]);
    strokesRef.current = [];
    setCurrentStroke([]);
    currentStrokeRef.current = [];
    setPlayerVote(null);
    setVoteSubmitted(false);
    strokeIdRef.current = 0;
  }, [roundNumber]);

  // Keep color/size refs in sync with state
  const handleSetActiveColor = (c: string) => {
    activeColorRef.current = c;
    setActiveColor(c);
  };
  const handleSetActiveSize = (s: number) => {
    activeSizeRef.current = s;
    setActiveSize(s);
  };

  // ── Touch handlers ──────────────────────────────────────────────────────────

  const handleTouchStart = (x: number, y: number) => {
    const pt = { x: Math.round(x), y: Math.round(y) };
    currentStrokeRef.current = [pt];
    setCurrentStroke([pt]);
  };

  const handleTouchMove = (x: number, y: number) => {
    const pt = { x: Math.round(x), y: Math.round(y) };
    currentStrokeRef.current = [...currentStrokeRef.current, pt];
    setCurrentStroke((prev) => [...prev, pt]);
  };

  const handleTouchEnd = () => {
    const pts = currentStrokeRef.current;
    if (pts.length === 0) return;
    const id = `s${++strokeIdRef.current}`;
    const newStroke: DrawStroke = { id, color: activeColorRef.current, width: activeSizeRef.current, points: pts };
    strokesRef.current = [...strokesRef.current, newStroke];
    setStrokes(strokesRef.current);
    currentStrokeRef.current = [];
    setCurrentStroke([]);
  };

  // ── Actions ─────────────────────────────────────────────────────────────────

  const handleUndo = () => {
    currentStrokeRef.current = [];
    setCurrentStroke([]);
    strokesRef.current = strokesRef.current.slice(0, -1);
    setStrokes(strokesRef.current);
  };

  const handleClear = () => {
    currentStrokeRef.current = [];
    setCurrentStroke([]);
    strokesRef.current = [];
    setStrokes([]);
  };

  const handleSubmitDrawing = async () => {
    // Persist strokes so result screen can read them
    const canvasRef = 300; // normalise to 300 reference width
    const scaleX = canvasRef / canvasWidth;
    const scaleY = canvasRef / canvasHeight;
    const normalised = scaleStrokes(strokesRef.current, scaleX, scaleY);
    setNormalisedStrokes(normalised);
    await AsyncStorage.setItem(drawingKey(code, roundNumber), JSON.stringify(normalised));
    await AsyncStorage.setItem(botDrawingKey(code, roundNumber), JSON.stringify(botTemplate));
    setPhase("vote");
  };

  const handleVote = (for_: "player" | "bot") => {
    if (voteSubmitted) return;
    setPlayerVote(for_);
  };

  const handleSubmitVote = () => {
    if (!playerVote || voteSubmitted) return;
    setVoteSubmitted(true);
    onResult(playerVote);
  };

  // ── Draw phase ──────────────────────────────────────────────────────────────

  if (phase === "draw") {
    const isEmpty = strokes.length === 0 && currentStroke.length === 0;

    return (
      <View style={{ flex: 1, gap: 14 }}>
        {/* Prompt */}
        <Animated.View
          entering={reducedMotion ? undefined : FadeInDown.duration(300)}
          style={{
            paddingHorizontal: spacing.lg,
            paddingVertical: spacing.md,
            borderRadius: radii.card,
            borderCurve: "continuous",
            backgroundColor: "rgba(197,42,135,0.18)",
            borderWidth: 1.5,
            borderColor: "rgba(197,42,135,0.45)",
            gap: 4,
          }}
        >
          <Text style={{ color: colors.stageBerry, fontFamily: fonts.bodyBold, fontSize: 11, letterSpacing: 1.4 }}>
            DEIN PROMPT 🎨
          </Text>
          <Text style={{ color: colors.white, fontFamily: fonts.displayExtraBold, fontSize: 20, lineHeight: 25 }}>
            {question.prompt}
          </Text>
        </Animated.View>

        {/* Canvas */}
        <Animated.View
          entering={reducedMotion ? undefined : FadeIn.delay(120).duration(300)}
          style={{ alignItems: "center" }}
        >
          <DrawingCanvas
            strokes={strokes}
            currentStroke={currentStroke}
            currentColor={activeColor}
            currentWidth={activeSize}
            canvasWidth={canvasWidth}
            canvasHeight={canvasHeight}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          />
          {isEmpty && (
            <View
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: canvasWidth,
                height: canvasHeight,
                alignItems: "center",
                justifyContent: "center",
                pointerEvents: "none",
              }}
            >
              <Text style={{ color: "rgba(111,43,211,0.35)", fontFamily: fonts.body, fontSize: 14 }}>
                Hier zeichnen ✏️
              </Text>
            </View>
          )}
        </Animated.View>

        {/* Toolbar */}
        <Animated.View
          entering={reducedMotion ? undefined : FadeInDown.delay(200).duration(280)}
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingHorizontal: spacing.xs,
            gap: 8,
          }}
        >
          {/* Colors */}
          <View style={{ flexDirection: "row", gap: 8, alignItems: "center" }}>
            {DRAW_COLORS.map((c) => (
              <ColorButton
                key={c.id}
                color={c}
                selected={activeColor === c.value}
                onPress={() => handleSetActiveColor(c.value)}
              />
            ))}
          </View>

          {/* Sizes */}
          <View style={{ flexDirection: "row", gap: 6, alignItems: "center" }}>
            {DRAW_SIZES.map((s) => (
              <SizeButton
                key={s.id}
                size={s}
                selected={activeSize === s.value}
                onPress={() => handleSetActiveSize(s.value)}
              />
            ))}
          </View>
        </Animated.View>

        {/* Undo / Clear */}
        <View style={{ flexDirection: "row", gap: 10 }}>
          <Pressable
            onPress={handleUndo}
            disabled={strokes.length === 0}
            style={({ pressed }) => ({
              flex: 1,
              paddingVertical: 10,
              alignItems: "center",
              borderRadius: radii.control,
              borderCurve: "continuous",
              backgroundColor: "rgba(255,255,255,0.08)",
              borderWidth: 1,
              borderColor: "rgba(255,255,255,0.15)",
              opacity: pressed || strokes.length === 0 ? 0.5 : 1,
            })}
          >
            <Text style={{ color: colors.white, fontFamily: fonts.bodySemiBold, fontSize: 14 }}>
              ↩ Undo
            </Text>
          </Pressable>

          <Pressable
            onPress={handleClear}
            disabled={isEmpty}
            style={({ pressed }) => ({
              flex: 1,
              paddingVertical: 10,
              alignItems: "center",
              borderRadius: radii.control,
              borderCurve: "continuous",
              backgroundColor: "rgba(255,255,255,0.08)",
              borderWidth: 1,
              borderColor: "rgba(255,255,255,0.15)",
              opacity: pressed || isEmpty ? 0.5 : 1,
            })}
          >
            <Text style={{ color: colors.white, fontFamily: fonts.bodySemiBold, fontSize: 14 }}>
              🗑 Löschen
            </Text>
          </Pressable>
        </View>

        {/* Submit */}
        <BrandButton
          label={isEmpty ? "Zuerst etwas zeichnen ✏️" : `Zeichnung abgeben →`}
          onPress={() => void handleSubmitDrawing()}
          tone={isEmpty ? "outline" : "sun"}
          disabled={isEmpty}
        />
      </View>
    );
  }

  // ── Vote phase ──────────────────────────────────────────────────────────────

  const drawingA = playerIsA ? normalisedStrokes : botTemplate;
  const drawingB = playerIsA ? botTemplate : normalisedStrokes;
  const aIsPlayer = playerIsA;
  const bIsPlayer = !playerIsA;

  return (
    <View style={{ flex: 1, gap: 20 }}>
      {/* Header */}
      <Animated.View
        entering={reducedMotion ? undefined : FadeInDown.duration(280)}
        style={{ alignItems: "center", gap: 6 }}
      >
        <Text style={{ color: colors.sun, fontFamily: fonts.bodyBold, fontSize: 11, letterSpacing: 1.5 }}>
          VOTING — RUNDE {roundNumber}
        </Text>
        <Text
          style={{
            color: colors.white,
            fontFamily: fonts.displayExtraBold,
            fontSize: 26,
            lineHeight: 30,
            textAlign: "center",
          }}
        >
          Wer hat das{"\n"}Meisterwerk verbrochen?
        </Text>
        <Text style={{ color: colors.whiteSoft, fontFamily: fonts.body, fontSize: 13 }}>
          Prompt: „{question.prompt}"
        </Text>
      </Animated.View>

      {/* Two drawings side by side */}
      <View style={{ flexDirection: "row", gap: 12 }}>
        <DrawingPreviewCard
          label="A"
          strokes={drawingA}
          isVoted={playerVote === (aIsPlayer ? "player" : "bot")}
          canVote={!voteSubmitted}
          onVote={() => handleVote(aIsPlayer ? "player" : "bot")}
          reducedMotion={reducedMotion}
        />
        <DrawingPreviewCard
          label="B"
          strokes={drawingB}
          isVoted={playerVote === (bIsPlayer ? "player" : "bot")}
          canVote={!voteSubmitted}
          onVote={() => handleVote(bIsPlayer ? "player" : "bot")}
          reducedMotion={reducedMotion}
        />
      </View>

      {/* Anonymous hint */}
      <Text
        style={{
          color: "rgba(255,255,255,0.38)",
          fontFamily: fonts.body,
          fontSize: 12,
          textAlign: "center",
        }}
      >
        🙈 Anonym — Reveal kommt nach der Abstimmung
      </Text>

      {/* Single CTA — disabled until a card is tapped */}
      <BrandButton
        label={
          voteSubmitted
            ? "Abgestimmt ✓"
            : playerVote
            ? `Für ${playerVote === "player" ? (playerIsA ? "A" : "B") : playerIsA ? "B" : "A"} abstimmen →`
            : "Zeichnung antippen & auswählen"
        }
        onPress={handleSubmitVote}
        tone="sun"
        disabled={!playerVote || voteSubmitted}
      />
    </View>
  );
}
