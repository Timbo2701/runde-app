# Release Readiness — Runde! (2026-07-01)

## Verdict: NOT YET RELEASE-READY (but the reported bug is fixed)

The specific bug the user reported — Battle Pass showing malformed XP like
"4000/1000" — is **fixed and verified against live production data**. That
alone does not clear the app for release; several other items surfaced during
this audit need attention first (below).

## What's fixed and safe to ship as-is
- **Routenbasierte Musik und Ergebnis-Sounds**: Lobby- und Ranked-Musik laufen exklusiv und wiederholen sich. Gewinner-/Verlierer-Sounds stoppen nach acht Sekunden; Profil-Einstellungen greifen ohne Neustart.
- **Party-Startscreen**: Der Profil-Button oben rechts wurde entfernt. Die Profilnavigation bleibt ueber die untere Navigation erreichbar.
- **Codemagic**: Der iOS-Workflow erzeugt eine signierte App-Store-IPA und uebergibt erfolgreiche Builds an TestFlight. Dafuer muessen in Codemagic die iOS-Zertifikate/Provisioning Profiles und eine App-Store-Connect-Integration fuer `com.runde.app` hinterlegt sein.
- **Battle Pass XP/level display** (`src/features/ranked/ranked-pass-screen.tsx`):
  now computes level and in-level progress via `calculateBattlePassLevel()`
  (`src/lib/battle-pass-logic.ts`), which mirrors the server's formula
  exactly. Verified against two real production rows (xp=240→level=1,
  xp=5840→level=6), both matching the DB's stored `level` column.
- This was a pure display-layer fix — no schema change, no RPC change, no
  risk to existing player data. Safe to deploy independently.

## Blocking or near-blocking for a "final" release
1. **Mission rewards are not paid out** (Known Issues #2). Every mission in
   the game currently promises XP that never lands in the player's battle
   pass. This is a player-trust issue that will generate support tickets and
   negative reviews ("I completed the mission but got no XP") the moment
   players notice their battle pass level isn't moving from missions alone.
   Needs a migration (`claimed` flag + claim RPC) before wide release.
2. **Security advisories on 8 SECURITY DEFINER functions** callable by `anon`,
   several without a pinned `search_path`. Current functions defensively
   check `auth.uid() is null` internally so this is not an active
   vulnerability today, but it's fragile — any future edit to one of these
   functions that forgets that check becomes an open door. Recommend
   hardening before a public launch, not urgent for an internal/TestFlight
   build.
3. **Leaked-password protection disabled** in Supabase Auth — a one-click
   fix in the Supabase dashboard, no code change needed. Should be turned on
   before any public signup flow goes live.

## Not blocking, but should be tracked
- Public `avatars` storage bucket allows listing (not just fetching) —
  minor information disclosure, low severity for a casual game.
- Friends feature (`friendships` table) has zero production rows — appears
  unexercised by real users; worth a manual smoke test (send/accept/block)
  before promoting it in-app.
- Large parts of the app (Achievements RPC correctness, Cosmetics equip
  flow, full Party-mode content QA, Leaderboard tie-breaking, Settings
  persistence, Auth edge cases) were schema-reviewed but not deep-audited in
  this pass — see `docs/KNOWN_ISSUES.md` "NOT AUDITED THIS PASS" for the
  explicit list. Recommend one focused QA session per domain before calling
  the app fully release-ready, using this session's Battle Pass fix as the
  template (read real code, query real DB, verify math against real rows,
  fix, document).

## Suggested next steps, in priority order
1. Design and ship the mission-claim migration (Known Issues #2).
2. Run `npm run typecheck` and manually verify the Ranked Pass screen on a
   simulator/device to close out the one item in
   `docs/FINAL_QA_CHECKLIST.md` that wasn't runnable in this environment.
3. Harden the 8 flagged Postgres functions + enable leaked-password
   protection (quick wins, no user-facing risk).
4. Schedule dedicated audit passes for Achievements, Cosmetics, Party modes,
   Leaderboard, Friends, and Settings.

## Files changed this session
- `src/lib/battle-pass-logic.ts` — new shared utility, `calculateBattlePassLevel()`.
- `src/features/ranked/ranked-pass-screen.tsx` — battle pass XP/level display
  fix (routed through `calculateBattlePassLevel`).
- `src/features/ranked/components/battle-pass-teaser.tsx` — same fix, plus
  simplified props (no longer accepts a separate `level`/`maxXp` that could
  drift out of sync with `xp`).
- `src/features/ranked/ranked-home-screen.tsx` — updated `<BattlePassTeaser>`
  call site for the simplified props.
- `src/features/shop/shop-screen.tsx` — fixed a build-breaking JSX error
  (`StageScreen` + `BottomNav` not wrapped in a fragment, same bug class
  already fixed for `profile-screen.tsx` in `0757c63`).
- `src/data/questions.ts` — added missing `who_said_it` key to `ALL_QUESTIONS`
  (compile error; that mode's questions live in Supabase, not this file).
- `docs/KNOWN_ISSUES.md` — new, this audit's findings.
- `docs/FINAL_QA_CHECKLIST.md` — new, this audit's checklist.
- `docs/RELEASE_READINESS.md` — new, this file.

## Tables/functions inspected (read-only, no data mutated)
`battle_passes`, `battle_pass_rewards`, `user_battle_pass_progress`,
`missions`, `user_missions`, `ranked_profiles`, `ranked_matches`,
`ranked_rounds`, `friendships`, `cosmetics`, `user_cosmetics`,
`selected_cosmetics`, `achievements`, `user_achievements`, `seasons`,
`party_questions`, plus Postgres functions `submit_ranked_match_result`,
`ensure_daily_missions`, `ensure_user_bootstrap`, `handle_new_auth_user`.
No `DROP`/`TRUNCATE`/unscoped `DELETE` were executed — all database access
this session was `SELECT`-only via `execute_sql` and `list_tables`/`get_advisors`.
