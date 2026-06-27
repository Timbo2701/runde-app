import type { GameModeType, RoundQuestion } from "@/lib/game-types";

const KLASSIKER_QUESTIONS: RoundQuestion[] = [
  {
    id: "k-01",
    modeType: "klassiker",
    roundType: "voting",
    prompt: "Wer bringt die Gruppe am schnellsten zum Lachen?",
    category: "freundschaft",
  },
  {
    id: "k-02",
    modeType: "klassiker",
    roundType: "voting",
    prompt: "Wer würde als Erstes in einem Horrorfilm sterben?",
    category: "chaos",
  },
  {
    id: "k-03",
    modeType: "klassiker",
    roundType: "voting",
    prompt: "Wer hat das chaotischste Zimmer?",
    category: "alltag",
  },
  {
    id: "k-04",
    modeType: "klassiker",
    roundType: "voting",
    prompt: "Wer ist am schlechtesten im Lügen?",
    category: "freundschaft",
  },
  {
    id: "k-05",
    modeType: "klassiker",
    roundType: "voting",
    prompt: "Wer würde einen fremden Hund einfach mitnehmen?",
    category: "chaos",
  },
  {
    id: "k-06",
    modeType: "klassiker",
    roundType: "voting",
    prompt: "Wer ist heimlich am meisten auf seinem Handy, wenn alle zusammen sind?",
    category: "alltag",
  },
  {
    id: "k-07",
    modeType: "klassiker",
    roundType: "voting",
    prompt: "Wer würde am ehesten eine Schnapsidee wirklich umsetzen?",
    category: "chaos",
  },
  {
    id: "k-08",
    modeType: "klassiker",
    roundType: "voting",
    prompt: "Wer hat die schlechteste Orientierung?",
    category: "alltag",
  },
  {
    id: "k-09",
    modeType: "klassiker",
    roundType: "voting",
    prompt: "Wer würde im Urlaub als Erstes krank werden?",
    category: "alltag",
  },
  {
    id: "k-10",
    modeType: "klassiker",
    roundType: "voting",
    prompt: "Wer gibt am meisten Geld für Unsinn aus?",
    category: "alltag",
  },
  {
    id: "k-11",
    modeType: "klassiker",
    roundType: "voting",
    prompt: "Wer würde am ehesten in einer Reality-Show mitmachen?",
    category: "hot-takes",
  },
  {
    id: "k-12",
    modeType: "klassiker",
    roundType: "voting",
    prompt: "Wer schläft am längsten?",
    category: "alltag",
  },
  {
    id: "k-13",
    modeType: "klassiker",
    roundType: "voting",
    prompt: "Wer würde als Erstes alles hinwerfen und ins Ausland ziehen?",
    category: "hot-takes",
  },
  {
    id: "k-14",
    modeType: "klassiker",
    roundType: "voting",
    prompt: "Wer hat die wildesten Träume und erzählt sie auch noch beim Frühstück?",
    category: "freundschaft",
  },
  {
    id: "k-15",
    modeType: "klassiker",
    roundType: "voting",
    prompt: "Wer wäre am ehesten Kultanführer?",
    category: "chaos",
  },
];

const SCHAETZ_QUESTIONS: RoundQuestion[] = [
  {
    id: "s-01",
    modeType: "schaetzrunde",
    roundType: "estimate",
    prompt: "Wie viele WhatsApp-Nachrichten schickt der durchschnittliche Deutsche pro Tag?",
    correctAnswer: "52",
    category: "schätzen",
  },
  {
    id: "s-02",
    modeType: "schaetzrunde",
    roundType: "estimate",
    prompt: "Wie alt (in Jahren) war der älteste jemals lebende Mensch?",
    correctAnswer: "122",
    category: "schätzen",
  },
  {
    id: "s-03",
    modeType: "schaetzrunde",
    roundType: "estimate",
    prompt: "Wie viele Kilometer liegt der Mond von der Erde entfernt (ungefähr)?",
    correctAnswer: "384400",
    category: "wissen",
  },
];

const QUIZ_QUESTIONS: RoundQuestion[] = [
  {
    id: "q-01",
    modeType: "blitz-quiz",
    roundType: "multiple-choice",
    prompt: "Welche Stadt ist die Hauptstadt von Australien?",
    options: ["Sydney", "Melbourne", "Canberra", "Brisbane"],
    correctAnswer: "Canberra",
    category: "wissen",
  },
  {
    id: "q-02",
    modeType: "blitz-quiz",
    roundType: "multiple-choice",
    prompt: "Wie viele Seiten hat ein Würfel?",
    options: ["4", "6", "8", "12"],
    correctAnswer: "6",
    category: "wissen",
  },
];

const ALL_QUESTIONS: Record<GameModeType, RoundQuestion[]> = {
  "klassiker": KLASSIKER_QUESTIONS,
  "schaetzrunde": SCHAETZ_QUESTIONS,
  "blitz-quiz": QUIZ_QUESTIONS,
  "bluff": [],
  "zeichen-vote": [],
  "reihenfolge": [],
};

export function getQuestionsForMode(mode: GameModeType): RoundQuestion[] {
  return ALL_QUESTIONS[mode] ?? KLASSIKER_QUESTIONS;
}

export function getQuestion(mode: GameModeType, roundIndex: number): RoundQuestion {
  const questions = getQuestionsForMode(mode);
  return questions[roundIndex % questions.length];
}
