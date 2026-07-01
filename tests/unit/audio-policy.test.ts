import { describe, expect, it } from "vitest";

import { getAudioTrack, isResultTrack } from "../../src/services/audio-policy";

describe("audio policy", () => {
  it("assigns looping background tracks only to their route groups", () => {
    expect(getAudioTrack({ pathname: "/lobby" })).toBe("lobby");
    expect(getAudioTrack({ pathname: "/ranked" })).toBe("ranked");
    expect(getAudioTrack({ pathname: "/ranked/queue" })).toBe("ranked");
    expect(getAudioTrack({ pathname: "/" })).toBeNull();
  });

  it("uses the ranked match outcome on the result route", () => {
    const win = encodeURIComponent(JSON.stringify({ won: true }));
    const loss = encodeURIComponent(JSON.stringify({ won: false }));

    expect(getAudioTrack({ pathname: "/ranked/result", rankedResult: win })).toBe("winner");
    expect(getAudioTrack({ pathname: "/ranked/result", rankedResult: loss })).toBe("loser");
  });

  it("uses the local party score on the final route", () => {
    expect(getAudioTrack({ pathname: "/final", playerWins: "3", botWins: "2" })).toBe("winner");
    expect(getAudioTrack({ pathname: "/final", playerWins: "1", botWins: "4" })).toBe("loser");
  });

  it("classifies only outcome sounds as time-limited", () => {
    expect(isResultTrack("winner")).toBe(true);
    expect(isResultTrack("loser")).toBe(true);
    expect(isResultTrack("lobby")).toBe(false);
    expect(isResultTrack("ranked")).toBe(false);
  });
});
