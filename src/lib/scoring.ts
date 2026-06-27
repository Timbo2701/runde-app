export interface RoundScoreEvent {
  playerId: string;
  playerName: string;
  points: number;
  reason: string;
  badge?: string;
}

export interface RoundScoreResult {
  winnerId: string | null;
  winnerName: string | null;
  isTie: boolean;
  events: RoundScoreEvent[];
}

export interface SchaetzRoundScoreResult extends RoundScoreResult {
  ranked: Array<{
    playerId: string;
    playerName: string;
    guess: number;
    deviation: number;
    rank: number;
    points: number;
    badge?: string;
  }>;
}

// Klassiker: winner=3pts, tie=1pt each, others=1pt
export function calculateKlassikerScore(
  players: Array<{ id: string; name: string }>,
  votes: Record<string, number> // playerId → vote count
): RoundScoreResult {
  const sorted = [...players].sort((a, b) => (votes[b.id] ?? 0) - (votes[a.id] ?? 0));
  const topVotes = votes[sorted[0]?.id] ?? 0;
  const isTie = sorted.length > 1 && (votes[sorted[1]?.id] ?? 0) === topVotes;

  const events: RoundScoreEvent[] = players.map((p) => {
    const isWinner = !isTie && p.id === sorted[0]?.id;
    const points = isWinner ? 3 : 1;
    return {
      playerId: p.id,
      playerName: p.name,
      points,
      reason: isWinner ? "Rundensieg" : "Teilnahme",
      badge: isWinner ? "Rundenkönig" : undefined,
    };
  });

  return {
    winnerId: isTie ? null : sorted[0]?.id ?? null,
    winnerName: isTie ? null : sorted[0]?.name ?? null,
    isTie,
    events,
  };
}

// Schätzrunde: 1st=3pts, 2nd=2pts, 3rd=1pt, exact=+1 bonus
export function calculateSchaetzScore(
  guesses: Array<{ playerId: string; playerName: string; guess: number }>,
  correctAnswer: number
): SchaetzRoundScoreResult {
  const withDeviation = guesses.map((g) => ({
    ...g,
    deviation: Math.abs(g.guess - correctAnswer),
  }));
  withDeviation.sort((a, b) => a.deviation - b.deviation);

  const rankPoints = [3, 2, 1];
  const ranked = withDeviation.map((g, i) => {
    const basePoints = rankPoints[i] ?? 0;
    const exactHit = g.deviation === 0;
    const nearHit = correctAnswer !== 0 && g.deviation / Math.abs(correctAnswer) < 0.1;
    const bonusPoints = exactHit ? 1 : 0;
    const points = basePoints + bonusPoints;
    const badge = i === 0 ? "Beste Schätzung" : nearHit ? "Fast richtig" : undefined;
    return { ...g, rank: i + 1, points, badge };
  });

  const winner = ranked[0];
  const isTie = ranked.length > 1 && ranked[0].deviation === ranked[1].deviation;

  const events: RoundScoreEvent[] = ranked.map((r) => ({
    playerId: r.playerId,
    playerName: r.playerName,
    points: r.points,
    reason: r.rank === 1 ? "Nächste Schätzung" : `Platz ${r.rank}`,
    badge: r.badge,
  }));

  return {
    winnerId: isTie ? null : winner?.playerId ?? null,
    winnerName: isTie ? null : winner?.playerName ?? null,
    isTie,
    events,
    ranked,
  };
}

// Quiz: correct=2pts, wrong=0pts
export function calculateQuizScore(
  answers: Array<{ playerId: string; playerName: string; answer: string }>,
  correctAnswer: string
): RoundScoreResult {
  const events: RoundScoreEvent[] = answers.map((a) => {
    const isCorrect = a.answer === correctAnswer;
    return {
      playerId: a.playerId,
      playerName: a.playerName,
      points: isCorrect ? 2 : 0,
      reason: isCorrect ? "Richtige Antwort" : "Falsche Antwort",
      badge: isCorrect ? "Quiz-Kopf" : undefined,
    };
  });

  const winners = events.filter((e) => e.points === 2);
  const isTie = winners.length > 1;

  return {
    winnerId: isTie ? null : winners[0]?.playerId ?? null,
    winnerName: isTie ? null : winners[0]?.playerName ?? null,
    isTie,
    events,
  };
}

// Bluff: correct answer chosen=2pts, each vote on your fake=+1pt
export function calculateBluffScore(
  playerAnswers: Array<{
    playerId: string;
    playerName: string;
    fakeAnswer: string;
    vote: string; // the answer they voted for
  }>,
  correctAnswer: string
): RoundScoreResult {
  // Count votes per answer
  const votesPerAnswer: Record<string, number> = {};
  for (const p of playerAnswers) {
    votesPerAnswer[p.vote] = (votesPerAnswer[p.vote] ?? 0) + 1;
  }

  const events: RoundScoreEvent[] = playerAnswers.map((p) => {
    const votedCorrect = p.vote === correctAnswer;
    const votesOnFake = votesPerAnswer[p.fakeAnswer] ?? 0;
    // Don't count own vote on own fake
    const otherVotesOnFake = playerAnswers.filter(
      (other) => other.playerId !== p.playerId && other.vote === p.fakeAnswer
    ).length;
    const points = (votedCorrect ? 2 : 0) + otherVotesOnFake;
    const badge =
      otherVotesOnFake >= 2
        ? "Bluff-Meister"
        : votedCorrect
        ? "Quiz-Kopf"
        : otherVotesOnFake === 1
        ? "Publikumsliebling"
        : "Chaos-Spieler";
    return {
      playerId: p.playerId,
      playerName: p.playerName,
      points,
      reason: votedCorrect
        ? `Echte Antwort erkannt (+2) + ${otherVotesOnFake} Stimmen auf Falle (+${otherVotesOnFake})`
        : `${otherVotesOnFake} Stimmen auf Falle (+${otherVotesOnFake})`,
      badge,
    };
  });

  const sorted = [...events].sort((a, b) => b.points - a.points);
  const isTie = sorted.length > 1 && sorted[0].points === sorted[1].points;

  return {
    winnerId: isTie ? null : sorted[0]?.playerId ?? null,
    winnerName: isTie ? null : sorted[0]?.playerName ?? null,
    isTie,
    events,
  };
}

// Final ranking across all rounds
export function calculateFinalRanking(
  allRoundEvents: RoundScoreEvent[][]
): Array<{ playerId: string; playerName: string; totalPoints: number; rank: number }> {
  const totals: Record<string, { playerName: string; totalPoints: number }> = {};

  for (const roundEvents of allRoundEvents) {
    for (const event of roundEvents) {
      if (!totals[event.playerId]) {
        totals[event.playerId] = { playerName: event.playerName, totalPoints: 0 };
      }
      totals[event.playerId].totalPoints += event.points;
    }
  }

  return Object.entries(totals)
    .map(([playerId, data]) => ({ playerId, ...data }))
    .sort((a, b) => b.totalPoints - a.totalPoints)
    .map((entry, i) => ({ ...entry, rank: i + 1 }));
}
