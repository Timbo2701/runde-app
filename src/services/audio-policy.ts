export type AudioTrack = "lobby" | "ranked" | "winner" | "loser";

type AudioRouteInput = {
  pathname: string;
  rankedResult?: string;
  playerWins?: string;
  botWins?: string;
};

function getRankedOutcome(result: string | undefined): boolean | null {
  if (!result) return null;

  try {
    const parsed: unknown = JSON.parse(decodeURIComponent(result));
    if (typeof parsed !== "object" || parsed === null || !("won" in parsed)) return null;
    return typeof parsed.won === "boolean" ? parsed.won : null;
  } catch {
    return null;
  }
}

export function getAudioTrack({ pathname, rankedResult, playerWins, botWins }: AudioRouteInput): AudioTrack | null {
  if (pathname === "/ranked/result") {
    const won = getRankedOutcome(rankedResult);
    return won === null ? null : won ? "winner" : "loser";
  }

  if (pathname === "/final") {
    const playerScore = Number.parseInt(playerWins ?? "", 10);
    const botScore = Number.parseInt(botWins ?? "", 10);
    if (!Number.isFinite(playerScore) || !Number.isFinite(botScore)) return null;
    return playerScore > botScore ? "winner" : "loser";
  }

  if (pathname === "/lobby") return "lobby";
  if (pathname === "/ranked" || pathname.startsWith("/ranked/")) return "ranked";
  return null;
}

export function isResultTrack(track: AudioTrack): boolean {
  return track === "winner" || track === "loser";
}
