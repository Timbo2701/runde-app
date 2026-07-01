# Final QA Checklist — Runde! (2026-07-01)

Source of truth for this checklist: live Supabase project `wiqdxzuewutnynjvvmop`
(schema introspected via `list_tables`/`execute_sql`) cross-checked against
`src/` on branch `master`. See `docs/KNOWN_ISSUES.md` for full detail on every
item marked ISSUE, and `docs/RELEASE_READINESS.md` for the go/no-go summary.

## Ranked / Battle Pass
- [x] `battle_passes` / `battle_pass_rewards` schema reviewed (1 active pass,
      "Neon Pass", max_level 50, 10 reward rows across 5 milestone levels ×
      free/premium track).
- [x] Server XP formula extracted from `submit_ranked_match_result`:
      `xp += win ? 240 : 80`, `level = min(50, 1 + floor(xp / 1000))`.
- [x] Client-side level/progress math (`src/lib/battle-pass-logic.ts`)
      verified to reproduce the server formula bit-for-bit using a real DB
      row (xp=5840 → level=6, matches stored level).
- [x] `ranked-pass-screen.tsx` FIXED to use `calculateBattlePassLevel`
      instead of raw `xp / 1000`.
- [x] `battle-pass-teaser.tsx` (ranked home screen widget) already used the
      shared helper correctly — no change needed.
- [ ] ISSUE: mission `reward_xp` is never credited to the battle pass (see
      Known Issues #2). Not fixed this pass — needs a migration + claim flow.

## Daily/Weekly Missions
- [x] `missions` table reviewed: 5 active daily missions, sane targets/XP
      rewards (100–250 XP).
- [x] `ensure_daily_missions(period_key)` RPC confirmed to use
      `to_char(now() at time zone 'utc','YYYY-MM-DD')` as period key — proper
      daily reset boundary, no bug found here.
- [x] Progress capping confirmed via `least(m.target_value, um.progress + ...)`
      in `submit_ranked_match_result` — no overflow past target possible.
- [x] Completion idempotency confirmed: `on conflict (user_id, mission_id,
      period_key) do nothing` on insert, `coalesce(um.completed_at, now())`
      on completion — no double-award timestamp bug found.
- [ ] ISSUE: reward payout gap (see above / Known Issues #2).

## Ranked Matches / MMR / Leaderboard
- [x] `ranked_matches`, `ranked_rounds`, `ranked_profiles` schema reviewed.
- [x] LP/tier math in `submit_ranked_match_result` spot-checked (tier bands of
      600 LP each across 6 tiers, division thresholds at 200/400 LP) — looks
      internally consistent, not exhaustively simulated across all edge
      tiers/promotions in this pass.
- [x] `client_submission_id` dedupe check present (`if found then return
      existing match` before re-processing) — protects against duplicate
      submits from retries.
- [ ] NOT AUDITED: leaderboard pagination/tie-break ordering beyond the
      `order by lp desc, mmr desc limit 100` clause read in
      `fetchLeaderboard` (`src/services/supabase-data.ts:216`).

## Security (Supabase advisors, live)
- [x] Ran `get_advisors(type=security)` against production project.
- [x] Documented all 8 SECURITY DEFINER/anon-exposure warnings, the public
      avatars-bucket listing warning, and the disabled leaked-password
      protection — see Known Issues #3.
- [ ] NOT FIXED: none of the security advisor items were remediated this pass
      (all require either a migration or a dashboard toggle, out of scope for
      a pure client-side bug-fix pass; flagged for follow-up).

## Friends / Party / Cosmetics / Achievements / Settings / Profile
- [x] Schema reviewed for all (`friendships`, `party_questions`, `cosmetics`,
      `user_cosmetics`, `selected_cosmetics`, `achievements`,
      `user_achievements`, `player_settings`).
- [ ] NOT DEEPLY AUDITED beyond schema read — see Known Issues "NOT AUDITED
      THIS PASS" for the explicit list of what still needs a dedicated
      review session.

## Shop
- [x] Confirmed intentionally mock/placeholder — no purchase code touched,
      per task instructions.

## Regression check for this session's change
- [x] `ranked-pass-screen.tsx` diff reviewed line-by-line: only the XP/level
      display logic changed, no changes to data fetching, navigation, or
      reward-track rendering (`fullRewards.map(...)` untouched).
- [ ] Not run: automated test suite / `npm run typecheck` / on-device manual
      smoke test of the Ranked Pass screen (no test runner or emulator
      available in this environment for this pass — recommend running
      `npm run typecheck` and opening `/ranked/pass` on a device/simulator
      before merging to confirm the visual fix).
