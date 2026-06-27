import type { GameModeType, RoundQuestion } from "@/lib/game-types";

export const ZEICHEN_PROMPTS: RoundQuestion[] = [
  {
    id: "z-01",
    modeType: "zeichen-vote" as GameModeType,
    roundType: "drawing",
    prompt: "Zeichne dich nach 3 Energy Drinks",
    category: "chaos",
  },
  {
    id: "z-02",
    modeType: "zeichen-vote" as GameModeType,
    roundType: "drawing",
    prompt: "Zeichne den peinlichsten Moment beim ersten Date",
    category: "freundschaft",
  },
  {
    id: "z-03",
    modeType: "zeichen-vote" as GameModeType,
    roundType: "drawing",
    prompt: "Zeichne die Gruppe um 3 Uhr morgens",
    category: "chaos",
  },
  {
    id: "z-04",
    modeType: "zeichen-vote" as GameModeType,
    roundType: "drawing",
    prompt: "Zeichne einen Hund, der Montag hasst",
    category: "alltag",
  },
  {
    id: "z-05",
    modeType: "zeichen-vote" as GameModeType,
    roundType: "drawing",
    prompt: "Zeichne dein Gesicht, wenn jemand 'Wir müssen reden' sagt",
    category: "freundschaft",
  },
  {
    id: "z-06",
    modeType: "zeichen-vote" as GameModeType,
    roundType: "drawing",
    prompt: "Zeichne einen Montag als Monster",
    category: "alltag",
  },
  {
    id: "z-07",
    modeType: "zeichen-vote" as GameModeType,
    roundType: "drawing",
    prompt: "Zeichne den Moment, wenn die Rechnung kommt",
    category: "chaos",
  },
  {
    id: "z-08",
    modeType: "zeichen-vote" as GameModeType,
    roundType: "drawing",
    prompt: "Zeichne dich auf einer Diät vs. nachts um 2 Uhr",
    category: "alltag",
  },
  {
    id: "z-09",
    modeType: "zeichen-vote" as GameModeType,
    roundType: "drawing",
    prompt: "Zeichne wie ein Katzen-Chef aussieht",
    category: "chaos",
  },
  {
    id: "z-10",
    modeType: "zeichen-vote" as GameModeType,
    roundType: "drawing",
    prompt: "Zeichne das perfekte Versteck vor Verantwortung",
    category: "alltag",
  },
];
