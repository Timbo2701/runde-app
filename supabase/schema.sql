-- Runde! Supabase schema
-- Run this complete file in the Supabase SQL Editor.
-- Idempotent for repeat runs: no application tables are dropped.

create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid unique references auth.users(id) on delete cascade,
  username text not null unique,
  display_name text not null,
  avatar_url text,
  avatar_initials text not null default 'R',
  onboarding_completed boolean not null default false,
  setup_completed boolean not null default false,
  is_bot boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.player_settings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references public.profiles(id) on delete cascade,
  music_enabled boolean not null default true,
  sound_enabled boolean not null default true,
  haptics_enabled boolean not null default true,
  animations_enabled boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.player_stats (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references public.profiles(id) on delete cascade,
  rounds_played integer not null default 0 check (rounds_played >= 0),
  wins integer not null default 0 check (wins >= 0),
  losses integer not null default 0 check (losses >= 0),
  favorite_mode text,
  best_category text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.seasons (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  is_active boolean not null default false,
  theme text not null default 'neon',
  created_at timestamptz not null default now()
);

create unique index if not exists seasons_one_active_idx on public.seasons (is_active) where is_active;

create table if not exists public.ranked_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  season_id uuid not null references public.seasons(id) on delete cascade,
  rank_tier text not null default 'bronze' check (rank_tier in ('bronze','silver','gold','neon','elite','legend')),
  division integer not null default 3 check (division between 1 and 3),
  lp integer not null default 0 check (lp between 0 and 599),
  mmr integer not null default 1000,
  wins integer not null default 0 check (wins >= 0),
  losses integer not null default 0 check (losses >= 0),
  win_streak integer not null default 0 check (win_streak >= 0),
  best_win_streak integer not null default 0 check (best_win_streak >= 0),
  season_points integer not null default 0 check (season_points >= 0),
  global_rank integer,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, season_id)
);

create index if not exists ranked_profiles_leaderboard_idx on public.ranked_profiles (season_id, lp desc, mmr desc);
create index if not exists ranked_profiles_user_idx on public.ranked_profiles (user_id);

create table if not exists public.ranked_questions (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  type text not null check (type in ('speed_choice','close_guess','bluff_tap')),
  prompt text not null,
  options jsonb,
  correct_answer jsonb not null default '{}'::jsonb,
  numeric_answer numeric,
  difficulty integer not null default 1 check (difficulty between 1 and 5),
  category text not null default 'allgemein',
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create index if not exists ranked_questions_active_type_idx on public.ranked_questions (is_active, type);

create table if not exists public.ranked_matches (
  id uuid primary key default gen_random_uuid(),
  season_id uuid not null references public.seasons(id),
  player_id uuid not null references public.profiles(id),
  opponent_id uuid not null references public.profiles(id),
  opponent_is_bot boolean not null default true,
  status text not null default 'finished' check (status in ('pending','active','finished','abandoned')),
  player_score integer not null default 0,
  opponent_score integer not null default 0,
  result text not null check (result in ('win','loss','draw')),
  lp_delta integer not null default 0,
  started_at timestamptz not null default now(),
  finished_at timestamptz,
  created_at timestamptz not null default now()
);

alter table public.ranked_matches add column if not exists client_submission_id uuid;

create index if not exists ranked_matches_player_created_idx on public.ranked_matches (player_id, created_at desc);
create unique index if not exists ranked_matches_player_submission_idx on public.ranked_matches (player_id, client_submission_id) where client_submission_id is not null;

create table if not exists public.ranked_rounds (
  id uuid primary key default gen_random_uuid(),
  match_id uuid not null references public.ranked_matches(id) on delete cascade,
  round_number integer not null check (round_number > 0),
  round_type text not null check (round_type in ('speed_choice','close_guess','bluff_tap')),
  question_id uuid references public.ranked_questions(id),
  player_answer jsonb,
  opponent_answer jsonb,
  correct_answer jsonb,
  player_points integer not null default 0,
  opponent_points integer not null default 0,
  player_response_ms integer,
  opponent_response_ms integer,
  created_at timestamptz not null default now(),
  unique (match_id, round_number)
);

create table if not exists public.achievements (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  description text not null,
  icon text not null default '🏆',
  category text not null,
  target_value integer not null default 1 check (target_value > 0),
  reward_type text,
  reward_ref text,
  created_at timestamptz not null default now()
);

create table if not exists public.user_achievements (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  achievement_id uuid not null references public.achievements(id) on delete cascade,
  progress integer not null default 0 check (progress >= 0),
  unlocked boolean not null default false,
  unlocked_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, achievement_id)
);

create table if not exists public.missions (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  description text not null,
  icon text not null default '⚔️',
  type text not null,
  target_value integer not null check (target_value > 0),
  reward_xp integer not null default 0 check (reward_xp >= 0),
  reward_currency integer,
  is_daily boolean not null default false,
  is_weekly boolean not null default false,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.user_missions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  mission_id uuid not null references public.missions(id) on delete cascade,
  progress integer not null default 0 check (progress >= 0),
  completed boolean not null default false,
  completed_at timestamptz,
  period_key text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, mission_id, period_key)
);

create table if not exists public.battle_passes (
  id uuid primary key default gen_random_uuid(),
  season_id uuid not null unique references public.seasons(id) on delete cascade,
  title text not null,
  max_level integer not null default 50 check (max_level > 0),
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.battle_pass_rewards (
  id uuid primary key default gen_random_uuid(),
  battle_pass_id uuid not null references public.battle_passes(id) on delete cascade,
  level integer not null check (level > 0),
  track text not null check (track in ('free','premium')),
  reward_type text not null,
  reward_ref text,
  title text not null,
  icon text not null default '✨',
  created_at timestamptz not null default now(),
  unique (battle_pass_id, level, track)
);

create table if not exists public.user_battle_pass_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  battle_pass_id uuid not null references public.battle_passes(id) on delete cascade,
  xp integer not null default 0 check (xp >= 0),
  level integer not null default 1 check (level > 0),
  premium_unlocked boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, battle_pass_id)
);

create table if not exists public.cosmetics (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  description text not null,
  category text not null check (category in ('avatar_frame','title','badge','victory_fx','profile_background','theme','crown')),
  rarity text not null default 'common' check (rarity in ('common','rare','epic','legendary')),
  icon text not null default '✨',
  is_shop_item boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.user_cosmetics (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  cosmetic_id uuid not null references public.cosmetics(id) on delete cascade,
  unlocked boolean not null default true,
  source text not null default 'starter',
  unlocked_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  unique (user_id, cosmetic_id)
);

create table if not exists public.selected_cosmetics (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references public.profiles(id) on delete cascade,
  avatar_frame_id uuid references public.cosmetics(id),
  title_id uuid references public.cosmetics(id),
  badge_id uuid references public.cosmetics(id),
  victory_fx_id uuid references public.cosmetics(id),
  profile_background_id uuid references public.cosmetics(id),
  crown_id uuid references public.cosmetics(id),
  updated_at timestamptz not null default now()
);

-- Seed current season first so account bootstrap always has a target.
insert into public.seasons (id, slug, title, starts_at, ends_at, is_active, theme)
values ('10000000-0000-4000-8000-000000000001', 'neon-season-1', 'Neon Season 1', '2026-01-01T00:00:00Z', '2027-01-01T00:00:00Z', true, 'neon')
on conflict (slug) do update set title = excluded.title, starts_at = excluded.starts_at, ends_at = excluded.ends_at, is_active = excluded.is_active, theme = excluded.theme;

insert into public.battle_passes (id, season_id, title, max_level, is_active)
values ('20000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000001', 'Neon Pass', 50, true)
on conflict (season_id) do update set title = excluded.title, max_level = excluded.max_level, is_active = excluded.is_active;

insert into public.achievements (slug,title,description,icon,category,target_value,reward_type,reward_ref) values
('first_round','Erste Runde gespielt','Spiele deine erste Runde.','🎮','spielen',1,null,null),
('first_ranked_match','Arena-Debüt','Spiele dein erstes Ranked Match.','⚔️','spielen',1,null,null),
('first_ranked_win','Erster Arena-Sieg','Gewinne dein erstes Ranked Match.','🏆','siegen',1,null,null),
('three_wins','Dreifach-Sieger','Gewinne drei Matches.','🏆','siegen',3,null,null),
('perfect_estimate','Volltreffer','Triff eine Schätzung exakt.','🎯','modus',1,'cosmetic','cosmetic_neon_frame'),
('bluff_master','Bluff-Meister','Fange mindestens eine Person mit deinem Bluff.','🃏','modus',1,'cosmetic','cosmetic_golden_crown'),
('quiz_head','Quiz-Kopf','Beantworte fünf Quizfragen in Folge korrekt.','⚡','modus',5,null,null),
('audience_darling','Publikumsliebling','Erhalte alle Stimmen in einer Klassiker-Runde.','🗳️','siegen',1,null,null),
('five_day_streak','5 Tage dabei','Spiele an fünf Tagen in Folge.','🔥','streak',5,null,null),
('chaos_legend','Chaos-Legende','Spiele vier unterschiedliche Party-Modi.','💥','spielen',4,'cosmetic','title_chaos')
on conflict (slug) do update set title=excluded.title, description=excluded.description, icon=excluded.icon, category=excluded.category, target_value=excluded.target_value, reward_type=excluded.reward_type, reward_ref=excluded.reward_ref;

insert into public.missions (slug,title,description,icon,type,target_value,reward_xp,is_daily,is_weekly,is_active) values
('play_1_ranked','Arena betreten','Spiele ein Ranked Match.','⚔️','ranked_matches',1,100,true,false,true),
('win_1_ranked','Ein Sieg','Gewinne ein Ranked Match.','🏆','ranked_wins',1,200,true,false,true),
('score_10','Punktesammler','Erziele zehn Punkte in Ranked.','⭐','ranked_points',10,150,true,false,true),
('play_3_ranked','Dreier-Serie','Spiele drei Ranked Matches.','🎮','ranked_matches',3,250,true,false,true),
('win_2_rounds','Rundenjäger','Gewinne zwei Runden in Ranked.','🎯','ranked_round_wins',2,200,true,false,true)
on conflict (slug) do update set title=excluded.title, description=excluded.description, icon=excluded.icon, type=excluded.type, target_value=excluded.target_value, reward_xp=excluded.reward_xp, is_daily=excluded.is_daily, is_weekly=excluded.is_weekly, is_active=excluded.is_active;

insert into public.cosmetics (slug,title,description,category,rarity,icon,is_shop_item) values
('badge_default','Standard-Rahmen','Der klassische Runde-Rahmen.','avatar_frame','common','⭕',false),
('cosmetic_neon_frame','Neon-Rahmen','Leuchtet bei Volltreffern.','avatar_frame','epic','💚',false),
('cosmetic_golden_crown','Goldene Krone','Für echte Bluff-Meister.','crown','legendary','👑',false),
('badge_star','Stern-Rahmen','Ein heller Profilrahmen.','avatar_frame','rare','⭐',true),
('badge_flame','Flammen-Rahmen','Ein warmer Profilrahmen.','avatar_frame','epic','🔥',true),
('title_none','Kein Titel','Zeigt keinen Titel an.','title','common','—',false),
('title_legend','Legende','Ein legendärer Spielertitel.','title','legendary','🏅',true),
('title_chaos','Chaos-König','Für vielseitige Party-Spieler.','title','epic','💥',false),
('effect_confetti','Konfetti','Der klassische Sieger-Effekt.','victory_fx','common','🎉',false),
('effect_fireworks','Feuerwerk','Großer Gewinner-Moment.','victory_fx','epic','🎆',true),
('effect_stars','Sternregen','Sterne beim Reveal.','victory_fx','rare','🌟',true),
('profile_neon','Neon-Profil','Dunkler Neon-Hintergrund.','profile_background','epic','🌌',true),
('theme_retro','Retro Theme','Arcade-Farben für die Runde.','theme','rare','84',true)
on conflict (slug) do update set title=excluded.title, description=excluded.description, category=excluded.category, rarity=excluded.rarity, icon=excluded.icon, is_shop_item=excluded.is_shop_item;

insert into public.battle_pass_rewards (battle_pass_id,level,track,reward_type,reward_ref,title,icon) values
('20000000-0000-4000-8000-000000000001',1,'free','title','title_none','Rookie','🎯'),
('20000000-0000-4000-8000-000000000001',1,'premium','victory_fx','effect_stars','Neon Trail','✨'),
('20000000-0000-4000-8000-000000000001',5,'free','avatar_frame','badge_default','Silber Rahmen','🖼️'),
('20000000-0000-4000-8000-000000000001',5,'premium','crown','cosmetic_golden_crown','Neon Krone','👑'),
('20000000-0000-4000-8000-000000000001',10,'free','xp',null,'750 Season XP','⭐'),
('20000000-0000-4000-8000-000000000001',10,'premium','avatar_frame','cosmetic_neon_frame','Blitz Rahmen','⚡'),
('20000000-0000-4000-8000-000000000001',20,'free','avatar_frame','badge_flame','Feuer Rahmen','🔥'),
('20000000-0000-4000-8000-000000000001',20,'premium','crown','cosmetic_golden_crown','Champion Krone','🏆'),
('20000000-0000-4000-8000-000000000001',50,'free','badge',null,'Season 1 Medaille','🎖️'),
('20000000-0000-4000-8000-000000000001',50,'premium','crown','cosmetic_golden_crown','Season 1 Krone','👑')
on conflict (battle_pass_id,level,track) do update set reward_type=excluded.reward_type,reward_ref=excluded.reward_ref,title=excluded.title,icon=excluded.icon;

insert into public.ranked_questions (slug,type,prompt,options,correct_answer,numeric_answer,difficulty,category) values
('sc1','speed_choice','Was ist schwerer?','["Ein Elefant","Ein ausgewachsener Blauwal","1.000 Backsteine","Ein Militärpanzer"]','{"index":1}',null,1,'allgemein'),
('sc2','speed_choice','Welche Stadt liegt am weitesten nördlich?','["Wien","Paris","London","Berlin"]','{"index":2}',null,1,'geografie'),
('sc3','speed_choice','Welches Tier lebt am längsten?','["Schildkröte","Elefant","Grönlandhai","Mensch"]','{"index":2}',null,2,'natur'),
('cg1','close_guess','Wie viele Minuten verbringt ein Mensch täglich durchschnittlich am Smartphone?',null,'{"unit":"Min","hint":"Etwa vier Stunden täglich"}',257,2,'alltag'),
('cg2','close_guess','Wie hoch ist der Eiffelturm in Metern?',null,'{"unit":"m","hint":"Inklusive Antenne"}',330,1,'wissen'),
('cg3','close_guess','Wie viele Knochen hat ein erwachsener Mensch?',null,'{"unit":"Knochen","hint":"Babys haben deutlich mehr"}',206,1,'natur'),
('bt1','bluff_tap','Welche Aussage ist wahr?','["Honig verdirbt praktisch nie","Haie schlafen niemals","Schmetterlinge leben im Schnitt drei Monate"]','{"index":0}',null,1,'wissen'),
('bt2','bluff_tap','Welche Aussage ist wahr?','["Schmetterlinge schmecken mit ihren Füßen","Alle Fische haben keine Augenlider","Menschen atmen täglich 5.000 Mal"]','{"index":0}',null,2,'natur'),
('bt3','bluff_tap','Welche Aussage ist wahr?','["Oktopusse haben blaues Blut und drei Herzen","Elefanten sind die einzigen nicht springenden Säugetiere","Der Bauchnabel ist steril"]','{"index":0}',null,2,'natur')
on conflict (slug) do update set type=excluded.type,prompt=excluded.prompt,options=excluded.options,correct_answer=excluded.correct_answer,numeric_answer=excluded.numeric_answer,difficulty=excluded.difficulty,category=excluded.category,is_active=true;

-- Bots are profiles without auth.users rows. Deterministic IDs keep this seed repeatable.
insert into public.profiles (id,username,display_name,avatar_initials,is_bot,onboarding_completed,setup_completed) values
('b0000000-0000-4000-8000-000000000001','neonfox','NeonFox','NF',true,true,true),
('b0000000-0000-4000-8000-000000000002','ayri','Ayri','AY',true,true,true),
('b0000000-0000-4000-8000-000000000003','kaito','Kaito','KA',true,true,true),
('b0000000-0000-4000-8000-000000000004','luma','Luma','LU',true,true,true),
('b0000000-0000-4000-8000-000000000005','zeno','Zeno','ZE',true,true,true),
('b0000000-0000-4000-8000-000000000006','roxy','Roxy','RO',true,true,true),
('b0000000-0000-4000-8000-000000000007','pixeltom','PixelTom','PT',true,true,true),
('b0000000-0000-4000-8000-000000000008','blitzmika','BlitzMika','BM',true,true,true),
('b0000000-0000-4000-8000-000000000009','ghostrank','GhostRank','GR',true,true,true),
('b0000000-0000-4000-8000-000000000010','novabot','NovaBot','NB',true,true,true),
('b0000000-0000-4000-8000-000000000011','drawking','DrawKing','DK',true,true,true),
('b0000000-0000-4000-8000-000000000012','quizbee','QuizBee','QB',true,true,true),
('b0000000-0000-4000-8000-000000000013','chaoskai','ChaosKai','CK',true,true,true),
('b0000000-0000-4000-8000-000000000014','lunarush','LunaRush','LR',true,true,true),
('b0000000-0000-4000-8000-000000000015','rankraptor','RankRaptor','RR',true,true,true)
on conflict (id) do update set username=excluded.username,display_name=excluded.display_name,avatar_initials=excluded.avatar_initials,is_bot=true;

insert into public.ranked_profiles (user_id,season_id,rank_tier,division,lp,mmr,wins,losses,win_streak,best_win_streak,season_points,global_rank)
select p.id,'10000000-0000-4000-8000-000000000001',
  (array['bronze','silver','silver','gold','gold','neon','silver','gold','elite','neon','gold','silver','elite','neon','legend'])[row_number() over(order by p.id)],
  ((row_number() over(order by p.id)-1)%3)+1,
  80 + (row_number() over(order by p.id)*29),
  950 + (row_number() over(order by p.id)*85),
  4 + row_number() over(order by p.id),
  2 + ((row_number() over(order by p.id))%7),
  (row_number() over(order by p.id))%4,
  2 + ((row_number() over(order by p.id))%6),
  250 + (row_number() over(order by p.id)*170),
  row_number() over(order by p.id)
from public.profiles p where p.is_bot
on conflict (user_id,season_id) do update set rank_tier=excluded.rank_tier,division=excluded.division,lp=excluded.lp,mmr=excluded.mmr,wins=excluded.wins,losses=excluded.losses,win_streak=excluded.win_streak,best_win_streak=excluded.best_win_streak,season_points=excluded.season_points,global_rank=excluded.global_rank;

create or replace function public.ensure_user_bootstrap()
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user uuid := auth.uid();
  v_season uuid;
  v_pass uuid;
  v_default_frame uuid;
  v_default_title uuid;
  v_default_fx uuid;
begin
  if v_user is null then raise exception 'authentication required'; end if;
  insert into public.profiles (id,auth_user_id,username,display_name,avatar_initials)
  select v_user,v_user,
    coalesce(nullif(raw_user_meta_data->>'username',''),'spieler') || '_' || substr(v_user::text,1,5),
    coalesce(nullif(raw_user_meta_data->>'display_name',''),split_part(email,'@',1),'Runde Spieler'),
    upper(substr(coalesce(nullif(raw_user_meta_data->>'display_name',''),split_part(email,'@',1),'R'),1,2))
  from auth.users where id=v_user
  on conflict (id) do nothing;

  insert into public.player_settings (user_id) values (v_user) on conflict (user_id) do nothing;
  insert into public.player_stats (user_id) values (v_user) on conflict (user_id) do nothing;
  select id into v_season from public.seasons where is_active order by starts_at desc limit 1;
  if v_season is not null then
    insert into public.ranked_profiles (user_id,season_id) values (v_user,v_season) on conflict (user_id,season_id) do nothing;
    select id into v_pass from public.battle_passes where season_id=v_season and is_active limit 1;
    if v_pass is not null then
      insert into public.user_battle_pass_progress (user_id,battle_pass_id) values (v_user,v_pass) on conflict (user_id,battle_pass_id) do nothing;
    end if;
  end if;
  insert into public.user_achievements (user_id,achievement_id)
    select v_user,id from public.achievements on conflict (user_id,achievement_id) do nothing;
  insert into public.selected_cosmetics (user_id) values (v_user) on conflict (user_id) do nothing;
  select id into v_default_frame from public.cosmetics where slug='badge_default';
  select id into v_default_title from public.cosmetics where slug='title_none';
  select id into v_default_fx from public.cosmetics where slug='effect_confetti';
  insert into public.user_cosmetics (user_id,cosmetic_id,source)
    select v_user,id,'starter' from public.cosmetics where slug in ('badge_default','title_none','effect_confetti')
    on conflict (user_id,cosmetic_id) do nothing;
  update public.selected_cosmetics set avatar_frame_id=v_default_frame,title_id=v_default_title,victory_fx_id=v_default_fx
    where user_id=v_user and avatar_frame_id is null and title_id is null and victory_fx_id is null;
end;
$$;

create or replace function public.handle_new_auth_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id,auth_user_id,username,display_name,avatar_initials)
  values (new.id,new.id,
    coalesce(nullif(new.raw_user_meta_data->>'username',''),'spieler') || '_' || substr(new.id::text,1,5),
    coalesce(nullif(new.raw_user_meta_data->>'display_name',''),split_part(new.email,'@',1),'Runde Spieler'),
    upper(substr(coalesce(nullif(new.raw_user_meta_data->>'display_name',''),split_part(new.email,'@',1),'R'),1,2)))
  on conflict (id) do nothing;
  insert into public.player_settings (user_id) values (new.id) on conflict (user_id) do nothing;
  insert into public.player_stats (user_id) values (new.id) on conflict (user_id) do nothing;
  insert into public.ranked_profiles (user_id,season_id) select new.id,id from public.seasons where is_active on conflict (user_id,season_id) do nothing;
  insert into public.user_achievements (user_id,achievement_id) select new.id,id from public.achievements on conflict (user_id,achievement_id) do nothing;
  insert into public.user_battle_pass_progress (user_id,battle_pass_id) select new.id,id from public.battle_passes where is_active on conflict (user_id,battle_pass_id) do nothing;
  insert into public.selected_cosmetics (user_id) values (new.id) on conflict (user_id) do nothing;
  insert into public.user_cosmetics (user_id,cosmetic_id,source) select new.id,id,'starter' from public.cosmetics where slug in ('badge_default','title_none','effect_confetti') on conflict (user_id,cosmetic_id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_auth_user();

create or replace function public.ensure_daily_missions(p_period_key text)
returns void
language sql
security definer
set search_path = public
as $$
  insert into public.user_missions (user_id,mission_id,period_key)
  select auth.uid(),id,p_period_key from public.missions where is_active and is_daily and auth.uid() is not null
  on conflict (user_id,mission_id,period_key) do nothing;
$$;

create or replace function public.track_achievement_event(p_event jsonb)
returns text[]
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user uuid := auth.uid();
  v_slug text;
  v_increment integer := 1;
  v_unlocked text[] := array[]::text[];
begin
  if v_user is null then raise exception 'authentication required'; end if;
  perform public.ensure_user_bootstrap();
  case p_event->>'type'
    when 'round_played' then v_slug := 'first_round';
    when 'round_won' then v_slug := 'three_wins';
    when 'quiz_correct' then v_slug := 'quiz_head';
    when 'schaetz_exact' then v_slug := 'perfect_estimate';
    when 'bluff_trap_caught' then if coalesce((p_event->>'votes')::integer,0)>0 then v_slug := 'bluff_master'; end if;
    when 'klassiker_all_votes' then v_slug := 'audience_darling';
    when 'day_played' then v_slug := 'five_day_streak';
    else v_slug := null;
  end case;
  if v_slug is null then return v_unlocked; end if;
  update public.user_achievements ua set
    progress=least(a.target_value,ua.progress+v_increment),
    unlocked=(ua.progress+v_increment)>=a.target_value,
    unlocked_at=case when not ua.unlocked and (ua.progress+v_increment)>=a.target_value then now() else ua.unlocked_at end,
    updated_at=now()
  from public.achievements a
  where ua.user_id=v_user and ua.achievement_id=a.id and a.slug=v_slug;
  if found then
    select array_agg(a.slug) into v_unlocked from public.user_achievements ua join public.achievements a on a.id=ua.achievement_id
      where ua.user_id=v_user and a.slug=v_slug and ua.unlocked;
  end if;
  return coalesce(v_unlocked,array[]::text[]);
end;
$$;

drop function if exists public.submit_ranked_match_result(uuid,integer,integer,jsonb);
create or replace function public.submit_ranked_match_result(
  p_submission_id uuid,
  p_opponent_id uuid,
  p_player_score integer,
  p_opponent_score integer,
  p_rounds jsonb
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user uuid := auth.uid();
  v_season uuid;
  v_profile public.ranked_profiles%rowtype;
  v_match uuid;
  v_won boolean;
  v_delta integer;
  v_new_streak integer;
  v_total_lp integer;
  v_tier_index integer;
  v_tiers text[] := array['bronze','silver','gold','neon','elite','legend'];
  v_round jsonb;
  v_round_number integer := 0;
  v_period text := to_char(now() at time zone 'utc','YYYY-MM-DD');
  v_round_wins integer := 0;
begin
  if v_user is null then raise exception 'authentication required'; end if;
  perform public.ensure_user_bootstrap();
  select id into v_season from public.seasons where is_active order by starts_at desc limit 1;
  select id,lp_delta into v_match,v_delta from public.ranked_matches where player_id=v_user and client_submission_id=p_submission_id;
  if found then
    select * into v_profile from public.ranked_profiles where user_id=v_user and season_id=v_season;
    return jsonb_build_object('match_id',v_match,'lp_delta',v_delta,'ranked_profile',to_jsonb(v_profile));
  end if;
  select * into v_profile from public.ranked_profiles where user_id=v_user and season_id=v_season for update;
  if not found then raise exception 'ranked profile missing'; end if;
  if not exists(select 1 from public.profiles where id=p_opponent_id and is_bot) then raise exception 'invalid ranked opponent'; end if;
  v_won := p_player_score >= p_opponent_score;
  v_delta := case when v_won then 25 + case when v_profile.win_streak>=2 then 5 else 0 end else -18 end;
  v_new_streak := case when v_won then v_profile.win_streak+1 else 0 end;
  v_tier_index := array_position(v_tiers,v_profile.rank_tier)-1;
  v_total_lp := greatest(0,least(3599,v_tier_index*600+v_profile.lp+v_delta));
  v_tier_index := least(5,floor(v_total_lp/600.0)::integer);

  insert into public.ranked_matches (season_id,player_id,opponent_id,opponent_is_bot,status,player_score,opponent_score,result,lp_delta,client_submission_id,finished_at)
  values (v_season,v_user,p_opponent_id,true,'finished',p_player_score,p_opponent_score,case when v_won then 'win' else 'loss' end,v_delta,p_submission_id,now())
  returning id into v_match;

  for v_round in select value from jsonb_array_elements(coalesce(p_rounds,'[]'::jsonb)) loop
    v_round_number := v_round_number+1;
    if coalesce((v_round->>'playerPoints')::integer,0)>coalesce((v_round->>'botPoints')::integer,0) then v_round_wins:=v_round_wins+1; end if;
    insert into public.ranked_rounds (match_id,round_number,round_type,player_points,opponent_points,player_response_ms)
    values (v_match,v_round_number,v_round->>'roundType',coalesce((v_round->>'playerPoints')::integer,0),coalesce((v_round->>'botPoints')::integer,0),coalesce((v_round->>'playerAnswerMs')::integer,0));
  end loop;

  update public.ranked_profiles set
    rank_tier=v_tiers[v_tier_index+1],
    lp=v_total_lp-(v_tier_index*600),
    division=case when (v_total_lp-(v_tier_index*600))>=400 then 1 when (v_total_lp-(v_tier_index*600))>=200 then 2 else 3 end,
    mmr=greatest(0,mmr+case when v_won then 20 else -15 end),
    wins=wins+case when v_won then 1 else 0 end,
    losses=losses+case when v_won then 0 else 1 end,
    win_streak=v_new_streak,
    best_win_streak=greatest(best_win_streak,v_new_streak),
    season_points=season_points+case when v_won then 150 else 50 end,
    updated_at=now()
  where id=v_profile.id returning * into v_profile;

  update public.player_stats set rounds_played=rounds_played+1,wins=wins+case when v_won then 1 else 0 end,losses=losses+case when v_won then 0 else 1 end,updated_at=now() where user_id=v_user;
  perform public.ensure_daily_missions(v_period);
  update public.user_missions um set progress=least(m.target_value,um.progress+case m.type when 'ranked_matches' then 1 when 'ranked_wins' then case when v_won then 1 else 0 end when 'ranked_points' then p_player_score when 'ranked_round_wins' then v_round_wins else 0 end),updated_at=now()
    from public.missions m where um.user_id=v_user and um.mission_id=m.id and um.period_key=v_period;
  update public.user_missions um set completed=um.progress>=m.target_value,completed_at=case when um.progress>=m.target_value then coalesce(um.completed_at,now()) else null end from public.missions m where um.mission_id=m.id and um.user_id=v_user and um.period_key=v_period;
  update public.user_battle_pass_progress set xp=xp+case when v_won then 240 else 80 end,level=least(50,1+floor((xp+case when v_won then 240 else 80 end)/1000.0)::integer),updated_at=now() where user_id=v_user;
  update public.user_achievements ua set progress=1,unlocked=true,unlocked_at=coalesce(unlocked_at,now()),updated_at=now() from public.achievements a where ua.user_id=v_user and ua.achievement_id=a.id and a.slug='first_ranked_match';
  if v_won then update public.user_achievements ua set progress=least(a.target_value,ua.progress+1),unlocked=(ua.progress+1)>=a.target_value,unlocked_at=case when (ua.progress+1)>=a.target_value then coalesce(ua.unlocked_at,now()) else ua.unlocked_at end,updated_at=now() from public.achievements a where ua.user_id=v_user and ua.achievement_id=a.id and a.slug in ('first_ranked_win','three_wins'); end if;

  -- TODO production hardening: validate every answer and timer server-side.
  -- TODO anti-cheat: sign match sessions and reject replayed/client-forged rounds.
  return jsonb_build_object('match_id',v_match,'lp_delta',v_delta,'ranked_profile',to_jsonb(v_profile));
end;
$$;

-- RLS: public catalogs/leaderboard are readable; private progress is owner-only.
alter table public.profiles enable row level security;
alter table public.player_settings enable row level security;
alter table public.player_stats enable row level security;
alter table public.seasons enable row level security;
alter table public.ranked_profiles enable row level security;
alter table public.ranked_matches enable row level security;
alter table public.ranked_rounds enable row level security;
alter table public.ranked_questions enable row level security;
alter table public.achievements enable row level security;
alter table public.user_achievements enable row level security;
alter table public.missions enable row level security;
alter table public.user_missions enable row level security;
alter table public.battle_passes enable row level security;
alter table public.battle_pass_rewards enable row level security;
alter table public.user_battle_pass_progress enable row level security;
alter table public.cosmetics enable row level security;
alter table public.user_cosmetics enable row level security;
alter table public.selected_cosmetics enable row level security;

drop policy if exists "profiles public read" on public.profiles;
create policy "profiles public read" on public.profiles for select to anon,authenticated using (true);
drop policy if exists "profiles owner update" on public.profiles;
create policy "profiles owner update" on public.profiles for update to authenticated using ((select auth.uid())=id) with check ((select auth.uid())=id and not is_bot);

drop policy if exists "settings owner all" on public.player_settings;
create policy "settings owner all" on public.player_settings for all to authenticated using ((select auth.uid())=user_id) with check ((select auth.uid())=user_id);
drop policy if exists "stats owner read" on public.player_stats;
create policy "stats owner read" on public.player_stats for select to authenticated using ((select auth.uid())=user_id);
drop policy if exists "stats owner update" on public.player_stats;
create policy "stats owner update" on public.player_stats for update to authenticated using ((select auth.uid())=user_id) with check ((select auth.uid())=user_id);

drop policy if exists "seasons public read" on public.seasons;
create policy "seasons public read" on public.seasons for select to anon,authenticated using (true);
drop policy if exists "ranked profiles public read" on public.ranked_profiles;
create policy "ranked profiles public read" on public.ranked_profiles for select to anon,authenticated using (true);
drop policy if exists "ranked matches owner read" on public.ranked_matches;
create policy "ranked matches owner read" on public.ranked_matches for select to authenticated using ((select auth.uid())=player_id);
drop policy if exists "ranked rounds owner read" on public.ranked_rounds;
create policy "ranked rounds owner read" on public.ranked_rounds for select to authenticated using (exists(select 1 from public.ranked_matches m where m.id=match_id and m.player_id=(select auth.uid())));
drop policy if exists "ranked questions public read" on public.ranked_questions;
create policy "ranked questions public read" on public.ranked_questions for select to anon,authenticated using (is_active);

drop policy if exists "achievements public read" on public.achievements;
create policy "achievements public read" on public.achievements for select to anon,authenticated using (true);
drop policy if exists "user achievements owner read" on public.user_achievements;
create policy "user achievements owner read" on public.user_achievements for select to authenticated using ((select auth.uid())=user_id);
drop policy if exists "missions public read" on public.missions;
create policy "missions public read" on public.missions for select to anon,authenticated using (is_active);
drop policy if exists "user missions owner read" on public.user_missions;
create policy "user missions owner read" on public.user_missions for select to authenticated using ((select auth.uid())=user_id);

drop policy if exists "battle passes public read" on public.battle_passes;
create policy "battle passes public read" on public.battle_passes for select to anon,authenticated using (true);
drop policy if exists "battle rewards public read" on public.battle_pass_rewards;
create policy "battle rewards public read" on public.battle_pass_rewards for select to anon,authenticated using (true);
drop policy if exists "battle progress owner read" on public.user_battle_pass_progress;
create policy "battle progress owner read" on public.user_battle_pass_progress for select to authenticated using ((select auth.uid())=user_id);

drop policy if exists "cosmetics public read" on public.cosmetics;
create policy "cosmetics public read" on public.cosmetics for select to anon,authenticated using (true);
drop policy if exists "user cosmetics owner read" on public.user_cosmetics;
create policy "user cosmetics owner read" on public.user_cosmetics for select to authenticated using ((select auth.uid())=user_id);
drop policy if exists "user cosmetics owner insert mock" on public.user_cosmetics;
create policy "user cosmetics owner insert mock" on public.user_cosmetics for insert to authenticated with check ((select auth.uid())=user_id and source in ('mock','achievement','starter'));
drop policy if exists "user cosmetics owner update mock" on public.user_cosmetics;
create policy "user cosmetics owner update mock" on public.user_cosmetics for update to authenticated using ((select auth.uid())=user_id) with check ((select auth.uid())=user_id and source in ('mock','achievement','starter'));
drop policy if exists "selected cosmetics owner all" on public.selected_cosmetics;
create policy "selected cosmetics owner all" on public.selected_cosmetics for all to authenticated using ((select auth.uid())=user_id) with check ((select auth.uid())=user_id);

grant execute on function public.ensure_user_bootstrap() to authenticated;
grant execute on function public.ensure_daily_missions(text) to authenticated;
grant execute on function public.track_achievement_event(jsonb) to authenticated;
grant execute on function public.submit_ranked_match_result(uuid,uuid,integer,integer,jsonb) to authenticated;
