import type { Session, User } from "@supabase/supabase-js";

import { getSupabase, isSupabaseConfigured } from "@/lib/supabase";
import type { BattlePassReward, MatchResult, MindClashQuestion, RankedOpponent, RankedProfile } from "@/types/ranked";
import type {
  AchievementProgressRecord,
  BattlePassProgressRecord,
  CosmeticOwnershipRecord,
  MissionProgressRecord,
  PlayerSettingsRecord,
  PlayerStatsRecord,
  ProfileRecord,
} from "@/types/supabase";

type JsonObject = Record<string, unknown>;

const asObject = (value: unknown): JsonObject =>
  value && typeof value === "object" && !Array.isArray(value) ? (value as JsonObject) : {};
const asString = (value: unknown, fallback = "") => (typeof value === "string" ? value : fallback);
const asNumber = (value: unknown, fallback = 0) => (typeof value === "number" && Number.isFinite(value) ? value : fallback);
const asBoolean = (value: unknown, fallback = false) => (typeof value === "boolean" ? value : fallback);

export type AuthResult = { session: Session | null; user: User | null; message?: string };

export async function ensureUserBootstrap(): Promise<void> {
  if (!isSupabaseConfigured) return;
  const { error } = await getSupabase().rpc("ensure_user_bootstrap");
  if (error) throw error;
}

export async function fetchProfile(userId: string): Promise<ProfileRecord | null> {
  const { data, error } = await getSupabase().from("profiles").select("*").eq("id", userId).maybeSingle();
  if (error) throw error;
  if (!data) return null;
  const row = asObject(data);
  return {
    id: asString(row.id),
    username: asString(row.username),
    displayName: asString(row.display_name),
    avatarUrl: asString(row.avatar_url) || null,
    avatarInitials: asString(row.avatar_initials, "R"),
    onboardingCompleted: asBoolean(row.onboarding_completed),
    setupCompleted: asBoolean(row.setup_completed),
    isBot: asBoolean(row.is_bot),
  };
}

export async function updateProfileRecord(
  userId: string,
  update: Partial<{ username: string; displayName: string; avatarUrl: string | null; onboardingCompleted: boolean; setupCompleted: boolean }>
): Promise<ProfileRecord> {
  const values: JsonObject = { updated_at: new Date().toISOString() };
  if (update.username !== undefined) values.username = update.username;
  if (update.displayName !== undefined) values.display_name = update.displayName;
  if (update.avatarUrl !== undefined) values.avatar_url = update.avatarUrl;
  if (update.onboardingCompleted !== undefined) values.onboarding_completed = update.onboardingCompleted;
  if (update.setupCompleted !== undefined) values.setup_completed = update.setupCompleted;
  const { error } = await getSupabase().from("profiles").update(values).eq("id", userId);
  if (error) throw error;
  const profile = await fetchProfile(userId);
  if (!profile) throw new Error("Profil konnte nach dem Speichern nicht geladen werden.");
  return profile;
}

export async function fetchSettings(userId: string): Promise<PlayerSettingsRecord | null> {
  const { data, error } = await getSupabase().from("player_settings").select("*").eq("user_id", userId).maybeSingle();
  if (error) throw error;
  if (!data) return null;
  const row = asObject(data);
  return {
    musicEnabled: asBoolean(row.music_enabled, true),
    soundEnabled: asBoolean(row.sound_enabled, true),
    hapticsEnabled: asBoolean(row.haptics_enabled, true),
    animationsEnabled: asBoolean(row.animations_enabled, true),
  };
}

export async function updateSettingsRecord(userId: string, settings: PlayerSettingsRecord): Promise<void> {
  const { error } = await getSupabase().from("player_settings").upsert(
    {
      user_id: userId,
      music_enabled: settings.musicEnabled,
      sound_enabled: settings.soundEnabled,
      haptics_enabled: settings.hapticsEnabled,
      animations_enabled: settings.animationsEnabled,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id" }
  );
  if (error) throw error;
}

export async function fetchPlayerStats(userId: string): Promise<PlayerStatsRecord> {
  const { data, error } = await getSupabase()
    .from("player_stats")
    .select("rounds_played, wins, losses, favorite_mode, best_category")
    .eq("user_id", userId)
    .maybeSingle();
  if (error) throw error;
  if (!data) throw new Error("Spielstatistiken fehlen in der Datenbank.");
  const row = asObject(data);
  return {
    roundsPlayed: asNumber(row.rounds_played),
    wins: asNumber(row.wins),
    losses: asNumber(row.losses),
    favoriteMode: asString(row.favorite_mode) || null,
    bestCategory: asString(row.best_category) || null,
  };
}

export async function updatePlayerStatsRecord(userId: string, stats: Partial<PlayerStatsRecord>): Promise<void> {
  const values: JsonObject = { updated_at: new Date().toISOString() };
  if (stats.roundsPlayed !== undefined) values.rounds_played = Math.max(0, stats.roundsPlayed);
  if (stats.wins !== undefined) values.wins = Math.max(0, stats.wins);
  if (stats.losses !== undefined) values.losses = Math.max(0, stats.losses);
  if (stats.favoriteMode !== undefined) values.favorite_mode = stats.favoriteMode;
  if (stats.bestCategory !== undefined) values.best_category = stats.bestCategory;
  const { error } = await getSupabase().from("player_stats").update(values).eq("user_id", userId);
  if (error) throw error;
}

function mapRankedProfile(value: unknown): RankedProfile {
  const row = asObject(value);
  const season = asObject(row.seasons);
  return {
    tier: asString(row.rank_tier, "bronze") as RankedProfile["tier"],
    division: Math.min(3, Math.max(1, asNumber(row.division, 3))) as RankedProfile["division"],
    lp: asNumber(row.lp),
    seasonPoints: asNumber(row.season_points),
    wins: asNumber(row.wins),
    losses: asNumber(row.losses),
    winStreak: asNumber(row.win_streak),
    bestWinStreak: asNumber(row.best_win_streak),
    globalRank: asNumber(row.global_rank, 0),
    mmr: asNumber(row.mmr, 1000),
    seasonName: asString(season.title, "Aktuelle Season"),
    battlePassLevel: 1,
    battlePassXp: 0,
    dailyMissionsCompleted: 0,
    totalMissions: 0,
  };
}

export async function fetchRankedProfile(userId: string): Promise<RankedProfile | null> {
  const client = getSupabase();
  const { data, error } = await client
    .from("ranked_profiles")
    .select("*, seasons(title)")
    .eq("user_id", userId)
    .eq("seasons.is_active", true)
    .maybeSingle();
  if (error) throw error;
  if (!data) return null;
  const ranked = mapRankedProfile(data);
  const [pass, missions, leaderboard] = await Promise.all([
    fetchBattlePass(userId),
    fetchMissions(userId),
    fetchLeaderboard(userId),
  ]);
  return {
    ...ranked,
    globalRank: leaderboard.find((entry) => entry.isPlayer)?.rank ?? 0,
    battlePassLevel: pass?.level ?? 1,
    battlePassXp: pass?.xp ?? 0,
    dailyMissionsCompleted: missions.filter((mission) => mission.completed).length,
    totalMissions: missions.length,
  };
}

export async function fetchRankedBots(): Promise<RankedOpponent[]> {
  const { data, error } = await getSupabase()
    .from("ranked_profiles")
    .select("rank_tier, division, wins, losses, seasons!inner(is_active), profiles!inner(id, display_name, avatar_initials, is_bot)")
    .eq("profiles.is_bot", true)
    .eq("seasons.is_active", true);
  if (error) throw error;
  return (data ?? []).map((value) => {
    const row = asObject(value);
    const profile = asObject(row.profiles);
    const wins = asNumber(row.wins);
    const losses = asNumber(row.losses);
    return {
      id: asString(profile.id),
      name: asString(profile.display_name, "Runde Bot"),
      tier: asString(row.rank_tier, "bronze") as RankedOpponent["tier"],
      division: Math.min(3, Math.max(1, asNumber(row.division, 3))) as RankedOpponent["division"],
      winrate: wins + losses > 0 ? Math.round((wins / (wins + losses)) * 100) : 50,
      avatarEmoji: asString(profile.avatar_initials, "BOT"),
    };
  });
}

export async function fetchRankedQuestions(): Promise<MindClashQuestion[]> {
  const { data, error } = await getSupabase().from("ranked_questions").select("*").eq("is_active", true);
  if (error) throw error;
  return (data ?? []).map((value) => {
    const row = asObject(value);
    const options = Array.isArray(row.options) ? row.options.filter((item): item is string => typeof item === "string") : undefined;
    const answer = asObject(row.correct_answer);
    const type = asString(row.type, "speed_choice") as MindClashQuestion["roundType"];
    return {
      id: asString(row.id),
      roundType: type,
      prompt: asString(row.prompt),
      options,
      correctOption: type === "speed_choice" ? asNumber(answer.index) : undefined,
      correctNumber: type === "close_guess" ? asNumber(row.numeric_answer) : undefined,
      unit: asString(answer.unit) || undefined,
      hint: asString(answer.hint) || undefined,
      statements: type === "bluff_tap" ? options : undefined,
      realStatementIndex: type === "bluff_tap" ? asNumber(answer.index) : undefined,
    };
  });
}

export async function fetchLeaderboard(userId?: string): Promise<import("@/types/ranked").LeaderboardEntry[]> {
  const { data, error } = await getSupabase()
    .from("ranked_profiles")
    .select("user_id, rank_tier, division, lp, wins, losses, seasons!inner(is_active), profiles!inner(display_name, avatar_initials)")
    .eq("seasons.is_active", true)
    .order("lp", { ascending: false })
    .order("mmr", { ascending: false })
    .limit(100);
  if (error) throw error;
  return (data ?? []).map((value, index) => {
    const row = asObject(value);
    const profile = asObject(row.profiles);
    const wins = asNumber(row.wins);
    const losses = asNumber(row.losses);
    return {
      rank: index + 1,
      name: asString(profile.display_name, "Runde Spieler"),
      tier: asString(row.rank_tier, "bronze") as RankedProfile["tier"],
      division: Math.min(3, Math.max(1, asNumber(row.division, 3))) as RankedProfile["division"],
      lp: asNumber(row.lp),
      winrate: wins + losses > 0 ? Math.round((wins / (wins + losses)) * 100) : 0,
      avatarEmoji: asString(profile.avatar_initials, "R"),
      isPlayer: asString(row.user_id) === userId,
    };
  });
}

export async function fetchAchievements(userId: string): Promise<AchievementProgressRecord[]> {
  const { data, error } = await getSupabase()
    .from("user_achievements")
    .select("progress, unlocked, achievements!inner(id, slug, title, description, icon, category, target_value)")
    .eq("user_id", userId);
  if (error) throw error;
  return (data ?? []).map((value) => {
    const row = asObject(value);
    const achievement = asObject(row.achievements);
    return {
      id: asString(achievement.id),
      slug: asString(achievement.slug),
      title: asString(achievement.title),
      description: asString(achievement.description),
      icon: asString(achievement.icon, "🏆"),
      category: asString(achievement.category, "spielen"),
      targetValue: asNumber(achievement.target_value, 1),
      progress: asNumber(row.progress),
      unlocked: asBoolean(row.unlocked),
    };
  });
}

export async function trackAchievementEventRemote(event: JsonObject): Promise<string[]> {
  const { data, error } = await getSupabase().rpc("track_achievement_event", { p_event: event });
  if (error) throw error;
  return Array.isArray(data) ? data.filter((value): value is string => typeof value === "string") : [];
}

export async function fetchMissions(userId: string): Promise<MissionProgressRecord[]> {
  const periodKey = new Date().toISOString().slice(0, 10);
  await getSupabase().rpc("ensure_daily_missions", { p_period_key: periodKey });
  const { data, error } = await getSupabase()
    .from("user_missions")
    .select("progress, completed, missions!inner(id, slug, title, description, icon, target_value, reward_xp)")
    .eq("user_id", userId)
    .eq("period_key", periodKey);
  if (error) throw error;
  return (data ?? []).map((value) => {
    const row = asObject(value);
    const mission = asObject(row.missions);
    return {
      id: asString(mission.id),
      slug: asString(mission.slug),
      title: asString(mission.title),
      description: asString(mission.description),
      icon: asString(mission.icon, "⚔️"),
      targetValue: asNumber(mission.target_value, 1),
      progress: asNumber(row.progress),
      rewardXp: asNumber(mission.reward_xp),
      completed: asBoolean(row.completed),
    };
  });
}

export async function fetchBattlePass(userId: string): Promise<BattlePassProgressRecord | null> {
  const { data, error } = await getSupabase()
    .from("user_battle_pass_progress")
    .select("id, xp, level, premium_unlocked, battle_passes!inner(title, max_level, is_active)")
    .eq("user_id", userId)
    .eq("battle_passes.is_active", true)
    .maybeSingle();
  if (error) throw error;
  if (!data) return null;
  const row = asObject(data);
  const pass = asObject(row.battle_passes);
  return {
    id: asString(row.id),
    title: asString(pass.title, "Neon Pass"),
    maxLevel: asNumber(pass.max_level, 50),
    xp: asNumber(row.xp),
    level: asNumber(row.level, 1),
    premiumUnlocked: asBoolean(row.premium_unlocked),
  };
}

export async function fetchBattlePassRewards(userId?: string): Promise<BattlePassReward[]> {
  const { data, error } = await getSupabase()
    .from("battle_pass_rewards")
    .select("level, track, reward_type, title, icon, battle_passes!inner(is_active)")
    .eq("battle_passes.is_active", true)
    .order("level", { ascending: true });
  if (error) throw error;

  let claimedKeys = new Set<string>();
  if (userId) {
    const { data: claims, error: claimsError } = await getSupabase()
      .from("user_battle_pass_claims")
      .select("level, track")
      .eq("user_id", userId);
    if (claimsError) throw claimsError;
    claimedKeys = new Set((claims ?? []).map((c) => `${asNumber(asObject(c).level)}:${asString(asObject(c).track)}`));
  }

  const byLevel = new Map<number, BattlePassReward>();
  for (const value of data ?? []) {
    const row = asObject(value);
    const level = asNumber(row.level);
    const track = asString(row.track);
    const reward = {
      emoji: asString(row.icon, "✨"),
      label: asString(row.title),
      type: asString(row.reward_type),
      claimed: claimedKeys.has(`${level}:${track}`),
    };
    const current = byLevel.get(level) ?? {
      level,
      free: { emoji: "💬", label: `+${level * 50} Season XP`, type: "xp", claimed: claimedKeys.has(`${level}:free`) },
    };
    if (track === "premium") current.premium = reward;
    else current.free = reward;
    byLevel.set(level, current);
  }
  return [...byLevel.values()];
}

export async function claimBattlePassReward(level: number, track: "free" | "premium"): Promise<{ grantedCosmetic: boolean; rewardTitle: string }> {
  const { data, error } = await getSupabase().rpc("claim_battle_pass_reward", { p_level: level, p_track: track });
  if (error) throw error;
  const row = asObject(data);
  return { grantedCosmetic: asBoolean(row.granted_cosmetic), rewardTitle: asString(row.reward_title) };
}

export async function fetchCosmeticOwnership(userId: string): Promise<CosmeticOwnershipRecord> {
  const [ownedResult, selectedResult] = await Promise.all([
    getSupabase().from("user_cosmetics").select("cosmetics!inner(slug)").eq("user_id", userId).eq("unlocked", true),
    getSupabase().from("selected_cosmetics").select("*, avatar_frame:cosmetics!selected_cosmetics_avatar_frame_id_fkey(slug), selected_title:cosmetics!selected_cosmetics_title_id_fkey(slug), victory_fx:cosmetics!selected_cosmetics_victory_fx_id_fkey(slug), profile_background:cosmetics!selected_cosmetics_profile_background_id_fkey(slug), crown:cosmetics!selected_cosmetics_crown_id_fkey(slug)").eq("user_id", userId).maybeSingle(),
  ]);
  if (ownedResult.error) throw ownedResult.error;
  if (selectedResult.error) throw selectedResult.error;
  const selected = asObject(selectedResult.data);
  const slugOf = (value: unknown) => asString(asObject(value).slug) || null;
  return {
    ownedIds: (ownedResult.data ?? []).map((value) => asString(asObject(asObject(value).cosmetics).slug)).filter(Boolean),
    selectedBadge: slugOf(selected.avatar_frame),
    selectedTitle: slugOf(selected.selected_title),
    selectedWinnerEffect: slugOf(selected.victory_fx),
    selectedProfileBackground: slugOf(selected.profile_background),
    selectedCrown: slugOf(selected.crown),
  };
}

export async function grantCosmetics(userId: string, slugs: string[], source = "mock"): Promise<void> {
  if (slugs.length === 0) return;
  const { data, error } = await getSupabase().from("cosmetics").select("id, slug").in("slug", slugs);
  if (error) throw error;
  const rows = (data ?? []).map((value) => ({
    user_id: userId,
    cosmetic_id: asString(asObject(value).id),
    unlocked: true,
    source,
    unlocked_at: new Date().toISOString(),
  })).filter((value) => value.cosmetic_id);
  if (rows.length === 0) return;
  const result = await getSupabase().from("user_cosmetics").upsert(rows, { onConflict: "user_id,cosmetic_id" });
  if (result.error) throw result.error;
}

export async function saveSelectedCosmetics(
  userId: string,
  selected: { badge?: string | null; title?: string | null; winnerEffect?: string | null }
): Promise<void> {
  const slugs = [selected.badge, selected.title, selected.winnerEffect].filter((value): value is string => Boolean(value));
  const { data, error } = await getSupabase().from("cosmetics").select("id, slug").in("slug", slugs);
  if (error) throw error;
  const idBySlug = new Map((data ?? []).map((value) => {
    const row = asObject(value);
    return [asString(row.slug), asString(row.id)] as const;
  }));
  const { error: saveError } = await getSupabase().from("selected_cosmetics").upsert({
    user_id: userId,
    avatar_frame_id: selected.badge ? idBySlug.get(selected.badge) ?? null : null,
    title_id: selected.title ? idBySlug.get(selected.title) ?? null : null,
    victory_fx_id: selected.winnerEffect ? idBySlug.get(selected.winnerEffect) ?? null : null,
    updated_at: new Date().toISOString(),
  }, { onConflict: "user_id" });
  if (saveError) throw saveError;
}

// ── Friends ───────────────────────────────────────────────────────────────────

export type FriendRecord = {
  friendshipId: string;
  friendId: string;
  displayName: string;
  avatarInitials: string;
  isOnline: boolean;
  lastSeenAt: string | null;
  status: "accepted" | "pending";
  isRequester: boolean;
};

export type UserSearchResult = {
  id: string;
  displayName: string;
  avatarInitials: string;
  isBot?: boolean;
};

export async function fetchFriends(userId: string): Promise<FriendRecord[]> {
  // NOTE: embedding the same target table (profiles) twice via two different
  // FK hints in one select requires explicit aliases, otherwise PostgREST
  // rejects the query with 42712 "table name specified more than once".
  const { data, error } = await getSupabase()
    .from("friendships")
    .select("id, requester_id, addressee_id, status, addressee:profiles!friendships_addressee_id_fkey(id,display_name,avatar_initials,is_online,last_seen_at), requester:profiles!friendships_requester_id_fkey(id,display_name,avatar_initials,is_online,last_seen_at)")
    .or(`requester_id.eq.${userId},addressee_id.eq.${userId}`)
    .in("status", ["accepted", "pending"]);
  if (error) throw error;
  return (data ?? []).map((value) => {
    const row = asObject(value);
    const isRequester = asString(row.requester_id) === userId;
    const friendProfile = asObject(isRequester ? row.addressee : row.requester);
    return {
      friendshipId: asString(row.id),
      friendId: asString(friendProfile.id),
      displayName: asString(friendProfile.display_name, "Runde Spieler"),
      avatarInitials: asString(friendProfile.avatar_initials, "R"),
      isOnline: asBoolean(friendProfile.is_online),
      lastSeenAt: typeof friendProfile.last_seen_at === "string" ? friendProfile.last_seen_at : null,
      status: asString(row.status) as "accepted" | "pending",
      isRequester,
    };
  });
}

export async function searchUsers(query: string, currentUserId: string): Promise<UserSearchResult[]> {
  if (query.trim().length < 2) return [];
  const { data, error } = await getSupabase()
    .from("profiles")
    .select("id, display_name, avatar_initials, is_bot")
    .ilike("display_name", `%${query.trim()}%`)
    .neq("id", currentUserId)
    .limit(20);
  if (error) throw error;
  return (data ?? []).map((value) => {
    const row = asObject(value);
    return {
      id: asString(row.id),
      displayName: asString(row.display_name, "Runde Spieler"),
      avatarInitials: asString(row.avatar_initials, "R"),
      isBot: asBoolean(row.is_bot),
    };
  });
}

export async function uploadAvatar(userId: string, localUri: string): Promise<string> {
  const response = await fetch(localUri);
  const blob = await response.blob();
  const ext = localUri.split(".").pop()?.toLowerCase() ?? "jpg";
  const path = `${userId}/avatar.${ext}`;
  const { error } = await getSupabase()
    .storage
    .from("avatars")
    .upload(path, blob, { upsert: true, contentType: `image/${ext === "jpg" ? "jpeg" : ext}` });
  if (error) throw error;
  const { data } = getSupabase().storage.from("avatars").getPublicUrl(path);
  return data.publicUrl;
}

export async function sendFriendRequest(requesterId: string, addresseeId: string): Promise<void> {
  const { error } = await getSupabase()
    .from("friendships")
    .insert({ requester_id: requesterId, addressee_id: addresseeId, status: "pending" });
  if (error) throw error;
}

export async function respondFriendRequest(friendshipId: string, accept: boolean): Promise<void> {
  if (accept) {
    const { error } = await getSupabase()
      .from("friendships")
      .update({ status: "accepted", updated_at: new Date().toISOString() })
      .eq("id", friendshipId);
    if (error) throw error;
  } else {
    const { error } = await getSupabase()
      .from("friendships")
      .delete()
      .eq("id", friendshipId);
    if (error) throw error;
  }
}

// ── Party Questions ───────────────────────────────────────────────────────────

export type PartyQuestion = {
  id: string;
  mode: string;
  category: string | null;
  prompt: string;
  options: string[] | null;
  correctAnswer: Record<string, unknown> | null;
  numericAnswer: number | null;
  difficulty: number;
};

function mapPartyQuestion(value: unknown): PartyQuestion {
  const row = asObject(value);
  const rawOptions = row.options;
  const options = Array.isArray(rawOptions)
    ? rawOptions.filter((item): item is string => typeof item === "string")
    : null;
  return {
    id: asString(row.id),
    mode: asString(row.mode),
    category: asString(row.category) || null,
    prompt: asString(row.prompt),
    options: options && options.length > 0 ? options : null,
    correctAnswer: row.correct_answer && typeof row.correct_answer === "object" && !Array.isArray(row.correct_answer)
      ? (row.correct_answer as Record<string, unknown>)
      : null,
    numericAnswer: typeof row.numeric_answer === "number" ? row.numeric_answer : null,
    difficulty: asNumber(row.difficulty, 1),
  };
}

export async function fetchPartyQuestions(mode: string, limit = 20): Promise<PartyQuestion[]> {
  const { data, error } = await getSupabase()
    .from("party_questions")
    .select("*")
    .eq("mode", mode)
    .eq("is_active", true)
    .limit(50); // Fetch more, shuffle client-side
  if (error) throw error;
  // Shuffle and limit
  const shuffled = (data ?? []).sort(() => Math.random() - 0.5).slice(0, limit);
  return shuffled.map(mapPartyQuestion);
}

export async function removeFriend(friendshipId: string): Promise<void> {
  const { error } = await getSupabase().from("friendships").delete().eq("id", friendshipId);
  if (error) throw error;
}

export async function updateLastSeen(userId: string): Promise<void> {
  await getSupabase()
    .from("profiles")
    .update({ last_seen_at: new Date().toISOString(), is_online: true })
    .eq("id", userId);
}

export type RankedMatchSubmission = {
  profile: RankedProfile;
  lpDelta: number;
};

export async function submitRankedMatchResult(result: MatchResult): Promise<RankedMatchSubmission> {
  const { data, error } = await getSupabase().rpc("submit_ranked_match_result", {
    p_submission_id: result.submissionId,
    p_opponent_id: result.opponent.id,
    p_player_score: result.playerTotalPoints,
    p_opponent_score: result.botTotalPoints,
    p_rounds: result.rounds,
  });
  if (error) throw error;
  const payload = asObject(data);
  const profile = payload.ranked_profile;
  if (!profile) throw new Error("Ranked-Ergebnis wurde gespeichert, aber das Profil fehlt in der Antwort.");
  return {
    profile: mapRankedProfile(profile),
    lpDelta: asNumber(payload.lp_delta),
  };
}
