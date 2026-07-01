# Known Issues — Runde! (QA Audit 2026-07-01, updated same day)

Audited against live Supabase project `wiqdxzuewutnynjvvmop`. Each item below was
verified by reading actual source files and/or querying the real database —
nothing here is speculative.

## RESOLVED in this pass

### 1. Battle Pass XP display bug ("4000/1000 XP") — FIXED
- **Root cause**: `user_battle_pass_progress.xp` is the player's **lifetime
  cumulative** season XP (confirmed server-side in the `submit_ranked_match_result`
  Postgres function: `xp = xp + (win ? 240 : 80)`, `level = least(50, 1 +
  floor(xp / 1000))`). Both `src/features/ranked/ranked-pass-screen.tsx`
  (`{rankedProfile.battlePassXp} / 1000 XP`) and
  `src/features/ranked/components/battle-pass-teaser.tsx` (hardcoded
  `maxXp={1000}` prop passed from `ranked-home-screen.tsx`) rendered this
  cumulative value directly against a fixed `/ 1000` denominator instead of
  computing the remainder within the current level. A player with 5840 total
  XP (level 6, live DB row) saw "5840 / 1000 XP" instead of "840 / 1000 XP".
- **Fix**: new `src/lib/battle-pass-logic.ts` exports `calculateBattlePassLevel(totalXp,
  { maxLevel })`, mirroring the server formula exactly (`XP_PER_LEVEL = 1000`,
  `level = min(maxLevel, 1 + floor(totalXp / 1000))`, `currentLevelXp = totalXp %
  1000`, `progressPercent`, `isMaxLevel`). Three files were updated to route
  through it: `ranked-pass-screen.tsx` (header XP line + `RewardRow`
  `currentLevel` prop), `battle-pass-teaser.tsx` (now computes level/progress
  internally from raw `xp` instead of accepting a separate `level`/`maxXp`
  prop pair that could disagree with each other), and `ranked-home-screen.tsx`
  (updated the now-simpler `<BattlePassTeaser xp maxLevel rewards />` call site).
- **Verified**: live row `xp=5840` → `calculateBattlePassLevel` yields
  `level=6, currentLevelXp=840, xpForNextLevel=1000`, matching the DB's stored
  `level=6` for that user exactly.

### 1b. Shop screen — build-breaking JSX error — FIXED
- `src/features/shop/shop-screen.tsx` returned `<StageScreen>...</StageScreen>`
  followed by a sibling `<BottomNav />` with no wrapping element (same class of
  bug already fixed for `profile-screen.tsx` in commit `0757c63`). This is a
  TypeScript compile error (`TS2657: JSX expressions must have one parent
  element`), i.e. the Shop screen could not have built at all. Fixed by
  wrapping both in a `<>...</>` fragment, matching the existing pattern.

### 1c. `questions.ts` — missing `who_said_it` key in `ALL_QUESTIONS` — FIXED
- `src/data/questions.ts`'s `ALL_QUESTIONS: Record<GameModeType, RoundQuestion[]>`
  was missing the `who_said_it` party mode (added in commit `adfae67`), a
  TypeScript compile error (`TS2741`). Added `"who_said_it": []` with a comment
  noting that mode's questions come from the `party_questions` Supabase table
  via `fetchPartyQuestions`, not this static file.

### 2. Daily/weekly mission rewards were never actually credited — FIXED
- **Root cause**: `missions.reward_xp` was computed and shown in the UI, but no
  code path (client or Postgres function) ever added it to
  `user_battle_pass_progress.xp` when `user_missions.completed` flipped to
  `true`. Missions completed and showed a checkmark, but the promised XP
  never landed anywhere.
- **Fix** (migration `fix_mission_reward_claiming`): added `claimed boolean
  DEFAULT false` and `claimed_at timestamptz` to `user_missions`. Extended
  `submit_ranked_match_result` to, in the same transaction that marks missions
  completed, sum `reward_xp` for any mission that just became `completed=true
  AND claimed=false`, mark those rows `claimed=true`, and add the sum on top
  of the normal match XP credited to `user_battle_pass_progress.xp` (auto-claim
  design — no separate claim UI existed to pair a manual claim button with, so
  auto-crediting the moment a mission completes is the correct, safe behavior
  here rather than leaving XP unclaimed in limbo). The `claimed` guard makes
  this idempotent — replaying the same match submission (already deduped via
  `client_submission_id`) or any future logic touching this table can't double-pay.
- **Not fixed / out of scope**: `missions.reward_currency` exists as a column
  but there is no currency/wallet table anywhere in the schema to credit it to
  — the Shop is confirmed mock-only (see #5 below), so there is nothing for a
  currency reward to feed into yet. Left as-is; would need an actual wallet
  system, which is a new feature, not a bug fix.

## OPEN — needs follow-up

### 3. Security advisor findings (Supabase `get_advisors`, live check) — mostly FIXED
- ~~8 `SECURITY DEFINER` Postgres functions callable by `anon`~~ **FIXED**
  (migration `security_hardening_search_path_rpc_storage`): revoked `EXECUTE`
  from `anon` on `ensure_daily_missions`, `ensure_user_bootstrap`,
  `invite_to_room`, `submit_ranked_match_result`, `track_achievement_event`
  (kept for `authenticated`, since real logged-in users legitimately call
  these). `handle_new_user` / `handle_new_auth_user` are trigger-only
  functions (`RETURNS trigger`, fired by `on_auth_user_created` on
  `auth.users`) that were never meant to be reachable via
  `/rest/v1/rpc/...` at all — revoked `EXECUTE` from both `anon` and
  `authenticated` entirely. Verified directly via `pg_proc.proacl` /
  `aclexplode` (not just the advisor, which caches and lagged behind the
  fix at first read) — `anon` now has zero grants on any of these 7 functions.
- ~~3 functions with mutable `search_path`~~ **FIXED**: `ALTER FUNCTION ...
  SET search_path = public` applied to `handle_new_user`,
  `increment_session_score`, `invite_to_room` (the other 5 already had it
  pinned).
- ~~`avatars` bucket allows listing~~ **FIXED**: dropped the two duplicate
  broad `SELECT` policies on `storage.objects` for the `avatars` bucket.
  Public URL downloads (`getPublicUrl`) are unaffected — a public bucket
  serves objects directly without going through RLS at all — only
  enumeration/listing via the Storage API is now blocked.
- **Leaked-password protection — NOT fixed, needs a manual dashboard toggle.**
  This is an Auth *service* setting (HaveIBeenPwned check), not a database
  object — there is no SQL/migration path and no Supabase MCP tool exposes
  the Auth config API to flip it programmatically. **Action needed:** Supabase
  Dashboard → Authentication → Sign In / Providers → Password → enable
  "Leaked password protection". One click, ~30 seconds, no app-side impact.

### 4. Friends feature — untested at DB level
- `friendships` table exists (`requester_id`, `addressee_id`, `status` ∈
  {pending, accepted, blocked}) but has **0 rows** in production — the feature
  has apparently never been exercised end-to-end by a real user. Not verified
  further in this pass (client code lives in
  `src/features/friends/friends-screen.tsx`, which was mid-diff/uncommitted
  at audit time per `git status`). Recommend a manual add/accept/block
  smoke test before shipping any friends-dependent feature (e.g. party invites).

### 5. Shop remains a mock (by design, per task scope)
- Confirmed no purchase/payment wiring was touched or expected to be touched.
  `ranked-pass-screen.tsx` explicitly labels the premium track "Käufe sind
  aktuell Platzhalter – noch nicht verfügbar" (purchases are currently
  placeholders — not yet available). This is intentional per current product
  state, not a bug.

### 6. "Wer hat das gesagt?" — minimum-player guard is unreachable dead code
- **Found via live Playwright walkthrough** (2026-07-01): created a lobby
  with only 2 real/mock lobby members, selected "Wer hat das gesagt?", hit
  "Spiel starten" — the mode started directly into the write phase instead
  of showing the documented "Zu wenige Spieler" screen.
- **Root cause**: `who-said-it-play.tsx` builds `allPlayers` as `[myPlayer,
  ...MOCK_PLAYERS]` where `MOCK_PLAYERS` is a hardcoded 3-entry array (Alex,
  Mia, Jonas) — so `allPlayers.length` is always exactly 4, regardless of
  how many real people are actually in the room. The `if (allPlayers.length
  < 3)` guard a few lines later can therefore never be true; it's dead code.
  This matches the documented MOCK status in `docs/WHO_SAID_IT.md` (the mode
  doesn't read real room roster yet), but the guard existing at all implies
  it's supposed to protect against a real 1-2 person room, which it
  currently cannot do — a host with 2 real friends in a room will be told
  nothing and dropped straight into a "multiplayer" round played entirely
  against hardcoded bots.
- **Not fixed this pass**: the correct fix is wiring `allPlayers` from the
  actual room/lobby roster (whatever hook the other party modes use, e.g.
  `useRoom()`), which is the same "replace MOCK with Supabase Realtime" work
  already tracked as a known follow-up in `docs/WHO_SAID_IT.md` — not a
  small isolated bug fix, so left out of scope for this QA pass to avoid
  touching the mode's core data flow without dedicated testing time.
- **Verified working correctly in this pass**: write phase (identical visual
  weight for target vs. fake-writer role hint, own submission correctly
  disabled for voting), vote phase (own fake answer correctly greyed out/
  unselectable), reveal phase (real answer gold-highlighted, fake answers
  correctly attributed, own submission labelled), no console errors through
  the full write→vote→reveal loop.

## NOT AUDITED THIS PASS (scope/time)
Given the size of the app, the following areas were **not** independently
re-verified beyond what was already touched by recent commits (`d5988f1`,
`adfae67`, `0757c63` — animations/back buttons/avatar upload/friends UX, party
mode, profile-screen fragment fix): Auth/session edge cases, Achievements
trigger correctness (`track_achievement_event` RPC), Cosmetics equip flow,
full Party-mode question pool integrity, Leaderboard pagination/tie-breaking,
Settings persistence. These should get their own focused audit pass before a
production release, ideally one domain per session so each gets the same
DB-verified rigor applied to the Battle Pass bug above.
