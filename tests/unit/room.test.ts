import { describe, expect, it } from "vitest";

import { getInitials, isRoomCodeReady, makeRoomCode, normalizeRoomCode } from "../../src/lib/room";

describe("room helpers", () => {
  it("normalizes room codes for fast mobile entry", () => {
    expect(normalizeRoomCode(" ab-c 12! ")).toBe("ABC12");
    expect(normalizeRoomCode("abcdefghi")).toBe("ABCDEF");
  });

  it("accepts only complete six character codes", () => {
    expect(isRoomCodeReady("AB12CD")).toBe(true);
    expect(isRoomCodeReady("AB12C")).toBe(false);
  });

  it("creates a deterministic six character code when random is injected", () => {
    expect(makeRoomCode(() => 0)).toBe("AAAAAA");
  });

  it("creates friendly initials", () => {
    expect(getInitials("Timo Kramer")).toBe("TK");
    expect(getInitials("Mika")).toBe("MI");
    expect(getInitials("   ")).toBe("?");
  });
});

