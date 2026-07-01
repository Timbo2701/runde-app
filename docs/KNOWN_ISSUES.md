# Known Issues — Runde! (QA Audit 2026-07-01)

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

## OPEN — needs follow-up

### 2. Daily/weekly mission rewards are never actually credited
- `missions.reward_xp` / `reward_currency` exist and are shown in the UI
  (`src/lib/supabase-hooks.ts:103`, mapped from `supabase-data.ts:292`), but
  no code path — client or the `submit_ranked_match_result` /
  `ensure_daily_missions` Postgres functions — ever adds `reward_xp` to
  `user_battle_pass_progress.xp` or any currency balance when
  `user_missions.completed` flips to `true`. Missions complete and show a
  checkmark, but the promised reward is not paid out anywhere.
- **Recommended fix**: add a `claimed` boolean (or `claimed_at` timestamp) to
  `user_missions`, and a new `SECURITY DEFINER` RPC `claim_mission_reward(mission_id)`
  that: verifies `completed = true` and `claimed = false` for the caller, credits
  `reward_xp` to the battle pass in the same transaction, then sets
  `claimed = true`. This needs a migration — not done in this pass to avoid an
  unreviewed schema change to a live production project without an explicit
  claim-flow UI to pair it with.
- **Risk if left as-is**: purely cosmetic missions (misleading players — "you
  earned +100 XP" that never lands). Not data-corrupting, but a trust issue.

### 3. Security advisor findings (Supabase `get_advisors`, live check)
- 8 `SECURITY DEFINER` Postgres functions (`ensure_daily_missions`,
  `ensure_user_bootstrap`, `handle_new_auth_user`, `handle_new_user`,
  `invite_to_room`, `submit_ranked_match_result`, `track_achievement_event`)
  are callable via `/rest/v1/rpc/...` by the `anon` role, several without a
  fixed `search_path`. `submit_ranked_match_result` and `ensure_daily_missions`
  being anon-callable is likely unintended — an unauthenticated client could
  attempt to call them (they do internally check `auth.uid() is null →
  raise exception`, so **not currently exploitable** for privilege escalation,
  but should be tightened with `REVOKE EXECUTE ... FROM anon` for defense in
  depth).
- `handle_new_user` mutable search_path plus `SECURITY DEFINER` is a
  standard Postgres injection risk pattern; should get `SET search_path = public`
  pinned.
- Storage bucket `avatars` is public and has 2 broad SELECT policies that
  allow **listing** all files, not just fetching by known URL — minor
  information-disclosure (avatar filenames/user IDs enumerable).
- Leaked-password protection (HaveIBeenPwned check) is disabled in Supabase
  Auth settings.
- **None of these are release-blocking for a casual party/quiz game**, but all
  four should be fixed before any wider marketing push, via
  `supabase migration new harden_security_definer_functions` doing
  `ALTER FUNCTION ... SET search_path = public` + selective `REVOKE EXECUTE FROM anon`
  on functions that don't need anon access, plus enabling leaked-password
  protection in the Auth dashboard.

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
