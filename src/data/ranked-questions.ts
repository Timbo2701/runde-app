import type { MindClashQuestion } from "@/types/ranked";

export const SPEED_CHOICE_QUESTIONS: MindClashQuestion[] = [
  {
    id: "sc1",
    roundType: "speed_choice",
    prompt: "Was ist schwerer?",
    options: ["Ein Elefant", "Ein ausgewachsener Blauwal", "1.000 Backsteine", "Ein Militärpanzer"],
    correctOption: 1,
  },
  {
    id: "sc2",
    roundType: "speed_choice",
    prompt: "Welche Stadt liegt am weitesten nördlich?",
    options: ["Wien", "Paris", "London", "Berlin"],
    correctOption: 2,
  },
  {
    id: "sc3",
    roundType: "speed_choice",
    prompt: "Was gibt es öfter auf der Erde?",
    options: ["Stühle", "Bäume", "Autos", "Brillen"],
    correctOption: 1,
  },
  {
    id: "sc4",
    roundType: "speed_choice",
    prompt: "Welches Tier lebt am längsten?",
    options: ["Schildkröte", "Elefant", "Grönlandhai", "Mensch"],
    correctOption: 2,
  },
  {
    id: "sc5",
    roundType: "speed_choice",
    prompt: "Was verbraucht mehr Energie?",
    options: ["Ein Haarfön (10 Min)", "Eine Glühbirne (10 Std)", "Ein Laptop (8 Std)", "Ein Ventilator (8 Std)"],
    correctOption: 0,
  },
];

export const CLOSE_GUESS_QUESTIONS: MindClashQuestion[] = [
  {
    id: "cg1",
    roundType: "close_guess",
    prompt: "Wie viele Minuten verbringt ein Mensch täglich durchschnittlich am Smartphone?",
    correctNumber: 257,
    unit: "Min",
    hint: "Tipp: etwa 4 Stunden täglich...",
  },
  {
    id: "cg2",
    roundType: "close_guess",
    prompt: "Wie hoch ist der Eiffelturm in Metern?",
    correctNumber: 330,
    unit: "m",
    hint: "Tipp: inklusive Antenne",
  },
  {
    id: "cg3",
    roundType: "close_guess",
    prompt: "Wie viele Knochen hat ein erwachsener Mensch?",
    correctNumber: 206,
    unit: "Knochen",
    hint: "Tipp: Babys haben deutlich mehr",
  },
  {
    id: "cg4",
    roundType: "close_guess",
    prompt: "Wie viel Prozent der Erdoberfläche ist mit Wasser bedeckt?",
    correctNumber: 71,
    unit: "%",
    hint: "Tipp: Mehr als die Hälfte...",
  },
  {
    id: "cg5",
    roundType: "close_guess",
    prompt: "Wie schnell kann ein Gepard maximal rennen (km/h)?",
    correctNumber: 120,
    unit: "km/h",
    hint: "Tipp: Schnellstes Landtier",
  },
];

export const BLUFF_TAP_QUESTIONS: MindClashQuestion[] = [
  {
    id: "bt1",
    roundType: "bluff_tap",
    prompt: "Welche Aussage ist wahr?",
    statements: [
      "Honig verdirbt nie – in 3.000 Jahre alten Gräbern war er noch essbar",
      "Haie sind die einzigen Tiere, die niemals schlafen",
      "Schmetterlinge leben durchschnittlich 3 Monate",
    ],
    realStatementIndex: 0,
  },
  {
    id: "bt2",
    roundType: "bluff_tap",
    prompt: "Welche Aussage ist wahr?",
    statements: [
      "Schmetterlinge schmecken mit ihren Füßen",
      "Alle Fische können nicht blinzeln, weil sie keine Augenlider haben",
      "Ein Mensch atmet täglich durchschnittlich 5.000 Mal",
    ],
    realStatementIndex: 0,
  },
  {
    id: "bt3",
    roundType: "bluff_tap",
    prompt: "Welche Aussage ist wahr?",
    statements: [
      "Oktopusse haben blaues Blut und drei Herzen",
      "Elefanten sind die einzigen Säugetiere, die nicht springen können",
      "Der Nabel eines Menschen ist von Geburt an steril",
    ],
    realStatementIndex: 0,
  },
  {
    id: "bt4",
    roundType: "bluff_tap",
    prompt: "Welche Aussage ist wahr?",
    statements: [
      "Wombat-Kot ist würfelförmig",
      "Die Große Mauer Chinas ist mit bloßem Auge aus dem Weltall sichtbar",
      "Menschen nutzen tatsächlich nur 10 % ihres Gehirns",
    ],
    realStatementIndex: 0,
  },
  {
    id: "bt5",
    roundType: "bluff_tap",
    prompt: "Welche Aussage ist wahr?",
    statements: [
      "Ein Blitz schlägt nie zweimal an dieselbe Stelle",
      "Glühwürmchen können ihre Leuchtkraft mithilfe einer chemischen Reaktion selbst steuern",
      "Eisbären haben schwarze Augen, aber weiße Haut unter dem Fell",
    ],
    realStatementIndex: 1,
  },
];

export function getRandomQuestion(type: "speed_choice" | "close_guess" | "bluff_tap", usedIds: string[]): MindClashQuestion {
  const pool = type === "speed_choice"
    ? SPEED_CHOICE_QUESTIONS
    : type === "close_guess"
    ? CLOSE_GUESS_QUESTIONS
    : BLUFF_TAP_QUESTIONS;
  const available = pool.filter((q) => !usedIds.includes(q.id));
  const list = available.length > 0 ? available : pool;
  return list[Math.floor(Math.random() * list.length)];
}
