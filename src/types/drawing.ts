export type DrawPoint = {
  x: number;
  y: number;
};

export type DrawStroke = {
  id: string;
  color: string;
  width: number;
  points: DrawPoint[];
};

export type DrawingSubmission = {
  id: string;
  /** "player" or bot name */
  playerId: string;
  promptId: string;
  strokes: DrawStroke[];
  createdAt: string;
  /** Set after voting */
  voteCount: number;
};
