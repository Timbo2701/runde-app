import { describe, expect, it } from "vitest";

import schema from "../../supabase/schema.sql?raw";
import client from "../../src/lib/supabase.ts?raw";
import shop from "../../src/features/shop/shop-screen.tsx?raw";
import codemagic from "../../codemagic.yaml?raw";
import remoteHooks from "../../src/lib/supabase-hooks.ts?raw";
import rankedMatch from "../../src/features/ranked/ranked-match-screen.tsx?raw";

describe("Supabase contract", () => {
  it("contains every persistent product area and enables RLS", () => {
    for (const table of [
      "profiles",
      "player_settings",
      "player_stats",
      "ranked_profiles",
      "ranked_matches",
      "ranked_rounds",
      "ranked_questions",
      "achievements",
      "user_achievements",
      "missions",
      "user_missions",
      "battle_passes",
      "user_battle_pass_progress",
      "cosmetics",
      "user_cosmetics",
      "selected_cosmetics",
    ]) {
      expect(schema).toContain(`create table if not exists public.${table}`);
      expect(schema).toContain(`alter table public.${table} enable row level security`);
    }
  });

  it("bootstraps new users at the lowest rank and exposes a controlled result RPC", () => {
    expect(schema).toContain("rank_tier text not null default 'bronze'");
    expect(schema).toContain("division integer not null default 3");
    expect(schema).toContain("create or replace function public.ensure_user_bootstrap()");
    expect(schema).toContain("create or replace function public.submit_ranked_match_result");
    expect(schema).toContain("client_submission_id");
    expect(schema).toContain("ranked_matches_player_submission_idx");
    expect(schema).toContain("TODO anti-cheat");
  });

  it("uses only public Expo keys and keeps the shop explicitly non-IAP", () => {
    expect(client).toContain("EXPO_PUBLIC_SUPABASE_URL");
    expect(client).not.toMatch(/service_role|SUPABASE_SECRET_KEY/);
    expect(shop).toContain("Alle Preise sind Platzhalter");
    expect(shop).not.toMatch(/RevenueCat|StoreKit\./);
  });

  it("requires Supabase in Codemagic and never falls back to ranked demo data", () => {
    expect(codemagic).toContain("- supabase");
    expect(codemagic).toContain("Verify Supabase production environment");
    expect(codemagic).toContain("EXPO_PUBLIC_SUPABASE_URL:?");
    expect(remoteHooks).not.toMatch(/MOCK_|ranked-mock-data|ranked-questions|ranked-rewards/);
    expect(rankedMatch).not.toMatch(/getOpponentById|getRandomQuestion|ranked-mock-data/);
  });
});
