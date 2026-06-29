-- Ranked Bots Seed – 60 Bots (10 pro Liga)
-- Jeder Bot: INSERT in profiles + INSERT in ranked_profiles
-- ON CONFLICT DO UPDATE damit bestehende Bots aktualisiert werden
-- UUIDs: Format b00000XX-0000-4000-8000-000000000XXX

-- ════════════════════════════════════════════════════════════
-- BRONZE (IDs b0000001 – b0000010)
-- accuracy ~45-60%, winrate ~38-47%
-- ════════════════════════════════════════════════════════════

INSERT INTO profiles (id,username,display_name,avatar_initials,is_bot,onboarding_completed,setup_completed)
VALUES ('b0000001-0000-4000-8000-000000000001','rookiefox_bot','RookieFox','RF',true,true,true)
ON CONFLICT (id) DO UPDATE SET display_name=EXCLUDED.display_name,avatar_initials=EXCLUDED.avatar_initials,is_bot=true;

INSERT INTO profiles (id,username,display_name,avatar_initials,is_bot,onboarding_completed,setup_completed)
VALUES ('b0000002-0000-4000-8000-000000000002','tinymika_bot','TinyMika','TM',true,true,true)
ON CONFLICT (id) DO UPDATE SET display_name=EXCLUDED.display_name,avatar_initials=EXCLUDED.avatar_initials,is_bot=true;

INSERT INTO profiles (id,username,display_name,avatar_initials,is_bot,onboarding_completed,setup_completed)
VALUES ('b0000003-0000-4000-8000-000000000003','softkai_bot','SoftKai','SK',true,true,true)
ON CONFLICT (id) DO UPDATE SET display_name=EXCLUDED.display_name,avatar_initials=EXCLUDED.avatar_initials,is_bot=true;

INSERT INTO profiles (id,username,display_name,avatar_initials,is_bot,onboarding_completed,setup_completed)
VALUES ('b0000004-0000-4000-8000-000000000004','startluma_bot','StartLuma','SL',true,true,true)
ON CONFLICT (id) DO UPDATE SET display_name=EXCLUDED.display_name,avatar_initials=EXCLUDED.avatar_initials,is_bot=true;

INSERT INTO profiles (id,username,display_name,avatar_initials,is_bot,onboarding_completed,setup_completed)
VALUES ('b0000005-0000-4000-8000-000000000005','bronzebee_bot','BronzeBee','BB',true,true,true)
ON CONFLICT (id) DO UPDATE SET display_name=EXCLUDED.display_name,avatar_initials=EXCLUDED.avatar_initials,is_bot=true;

INSERT INTO profiles (id,username,display_name,avatar_initials,is_bot,onboarding_completed,setup_completed)
VALUES ('b0000006-0000-4000-8000-000000000006','lowpixel_bot','LowPixel','LP',true,true,true)
ON CONFLICT (id) DO UPDATE SET display_name=EXCLUDED.display_name,avatar_initials=EXCLUDED.avatar_initials,is_bot=true;

INSERT INTO profiles (id,username,display_name,avatar_initials,is_bot,onboarding_completed,setup_completed)
VALUES ('b0000007-0000-4000-8000-000000000007','miniroxy_bot','MiniRoxy','MR',true,true,true)
ON CONFLICT (id) DO UPDATE SET display_name=EXCLUDED.display_name,avatar_initials=EXCLUDED.avatar_initials,is_bot=true;

INSERT INTO profiles (id,username,display_name,avatar_initials,is_bot,onboarding_completed,setup_completed)
VALUES ('b0000008-0000-4000-8000-000000000008','botnico_bot','BotNico','BN',true,true,true)
ON CONFLICT (id) DO UPDATE SET display_name=EXCLUDED.display_name,avatar_initials=EXCLUDED.avatar_initials,is_bot=true;

INSERT INTO profiles (id,username,display_name,avatar_initials,is_bot,onboarding_completed,setup_completed)
VALUES ('b0000009-0000-4000-8000-000000000009','lazyzeno_bot','LazyZeno','LZ',true,true,true)
ON CONFLICT (id) DO UPDATE SET display_name=EXCLUDED.display_name,avatar_initials=EXCLUDED.avatar_initials,is_bot=true;

INSERT INTO profiles (id,username,display_name,avatar_initials,is_bot,onboarding_completed,setup_completed)
VALUES ('b0000010-0000-4000-8000-000000000010','firsttry_bot','FirstTry','FT',true,true,true)
ON CONFLICT (id) DO UPDATE SET display_name=EXCLUDED.display_name,avatar_initials=EXCLUDED.avatar_initials,is_bot=true;

-- Bronze ranked_profiles
INSERT INTO ranked_profiles (user_id,season_id,rank_tier,division,lp,mmr,wins,losses,win_streak,best_win_streak,season_points)
SELECT 'b0000001-0000-4000-8000-000000000001',id,'bronze',3,45,920,18,42,0,2,360 FROM seasons WHERE is_active=true
ON CONFLICT (user_id,season_id) DO UPDATE SET rank_tier=EXCLUDED.rank_tier,division=EXCLUDED.division,lp=EXCLUDED.lp,mmr=EXCLUDED.mmr,wins=EXCLUDED.wins,losses=EXCLUDED.losses;

INSERT INTO ranked_profiles (user_id,season_id,rank_tier,division,lp,mmr,wins,losses,win_streak,best_win_streak,season_points)
SELECT 'b0000002-0000-4000-8000-000000000002',id,'bronze',3,80,950,22,39,1,3,440 FROM seasons WHERE is_active=true
ON CONFLICT (user_id,season_id) DO UPDATE SET rank_tier=EXCLUDED.rank_tier,division=EXCLUDED.division,lp=EXCLUDED.lp,mmr=EXCLUDED.mmr,wins=EXCLUDED.wins,losses=EXCLUDED.losses;

INSERT INTO ranked_profiles (user_id,season_id,rank_tier,division,lp,mmr,wins,losses,win_streak,best_win_streak,season_points)
SELECT 'b0000003-0000-4000-8000-000000000003',id,'bronze',2,210,980,25,45,0,2,500 FROM seasons WHERE is_active=true
ON CONFLICT (user_id,season_id) DO UPDATE SET rank_tier=EXCLUDED.rank_tier,division=EXCLUDED.division,lp=EXCLUDED.lp,mmr=EXCLUDED.mmr,wins=EXCLUDED.wins,losses=EXCLUDED.losses;

INSERT INTO ranked_profiles (user_id,season_id,rank_tier,division,lp,mmr,wins,losses,win_streak,best_win_streak,season_points)
SELECT 'b0000004-0000-4000-8000-000000000004',id,'bronze',2,250,990,30,52,0,3,600 FROM seasons WHERE is_active=true
ON CONFLICT (user_id,season_id) DO UPDATE SET rank_tier=EXCLUDED.rank_tier,division=EXCLUDED.division,lp=EXCLUDED.lp,mmr=EXCLUDED.mmr,wins=EXCLUDED.wins,losses=EXCLUDED.losses;

INSERT INTO ranked_profiles (user_id,season_id,rank_tier,division,lp,mmr,wins,losses,win_streak,best_win_streak,season_points)
SELECT 'b0000005-0000-4000-8000-000000000005',id,'bronze',1,420,1010,28,48,0,2,560 FROM seasons WHERE is_active=true
ON CONFLICT (user_id,season_id) DO UPDATE SET rank_tier=EXCLUDED.rank_tier,division=EXCLUDED.division,lp=EXCLUDED.lp,mmr=EXCLUDED.mmr,wins=EXCLUDED.wins,losses=EXCLUDED.losses;

INSERT INTO ranked_profiles (user_id,season_id,rank_tier,division,lp,mmr,wins,losses,win_streak,best_win_streak,season_points)
SELECT 'b0000006-0000-4000-8000-000000000006',id,'bronze',3,30,900,15,38,0,1,300 FROM seasons WHERE is_active=true
ON CONFLICT (user_id,season_id) DO UPDATE SET rank_tier=EXCLUDED.rank_tier,division=EXCLUDED.division,lp=EXCLUDED.lp,mmr=EXCLUDED.mmr,wins=EXCLUDED.wins,losses=EXCLUDED.losses;

INSERT INTO ranked_profiles (user_id,season_id,rank_tier,division,lp,mmr,wins,losses,win_streak,best_win_streak,season_points)
SELECT 'b0000007-0000-4000-8000-000000000007',id,'bronze',1,450,1030,32,50,1,3,640 FROM seasons WHERE is_active=true
ON CONFLICT (user_id,season_id) DO UPDATE SET rank_tier=EXCLUDED.rank_tier,division=EXCLUDED.division,lp=EXCLUDED.lp,mmr=EXCLUDED.mmr,wins=EXCLUDED.wins,losses=EXCLUDED.losses;

INSERT INTO ranked_profiles (user_id,season_id,rank_tier,division,lp,mmr,wins,losses,win_streak,best_win_streak,season_points)
SELECT 'b0000008-0000-4000-8000-000000000008',id,'bronze',2,330,1005,27,44,0,2,540 FROM seasons WHERE is_active=true
ON CONFLICT (user_id,season_id) DO UPDATE SET rank_tier=EXCLUDED.rank_tier,division=EXCLUDED.division,lp=EXCLUDED.lp,mmr=EXCLUDED.mmr,wins=EXCLUDED.wins,losses=EXCLUDED.losses;

INSERT INTO ranked_profiles (user_id,season_id,rank_tier,division,lp,mmr,wins,losses,win_streak,best_win_streak,season_points)
SELECT 'b0000009-0000-4000-8000-000000000009',id,'bronze',3,120,960,20,40,0,1,400 FROM seasons WHERE is_active=true
ON CONFLICT (user_id,season_id) DO UPDATE SET rank_tier=EXCLUDED.rank_tier,division=EXCLUDED.division,lp=EXCLUDED.lp,mmr=EXCLUDED.mmr,wins=EXCLUDED.wins,losses=EXCLUDED.losses;

INSERT INTO ranked_profiles (user_id,season_id,rank_tier,division,lp,mmr,wins,losses,win_streak,best_win_streak,season_points)
SELECT 'b0000010-0000-4000-8000-000000000010',id,'bronze',1,560,1050,35,55,0,4,700 FROM seasons WHERE is_active=true
ON CONFLICT (user_id,season_id) DO UPDATE SET rank_tier=EXCLUDED.rank_tier,division=EXCLUDED.division,lp=EXCLUDED.lp,mmr=EXCLUDED.mmr,wins=EXCLUDED.wins,losses=EXCLUDED.losses;

-- ════════════════════════════════════════════════════════════
-- SILVER (IDs b0000011 – b0000020)
-- accuracy ~55-68%, winrate ~46-53%
-- ════════════════════════════════════════════════════════════

INSERT INTO profiles (id,username,display_name,avatar_initials,is_bot,onboarding_completed,setup_completed)
VALUES ('b0000011-0000-4000-8000-000000000011','neonfox_bot','NeonFox','NF',true,true,true)
ON CONFLICT (id) DO UPDATE SET display_name=EXCLUDED.display_name,avatar_initials=EXCLUDED.avatar_initials,is_bot=true;

INSERT INTO profiles (id,username,display_name,avatar_initials,is_bot,onboarding_completed,setup_completed)
VALUES ('b0000012-0000-4000-8000-000000000012','ayri_bot','Ayri','AY',true,true,true)
ON CONFLICT (id) DO UPDATE SET display_name=EXCLUDED.display_name,avatar_initials=EXCLUDED.avatar_initials,is_bot=true;

INSERT INTO profiles (id,username,display_name,avatar_initials,is_bot,onboarding_completed,setup_completed)
VALUES ('b0000013-0000-4000-8000-000000000013','kaito_bot','Kaito','KA',true,true,true)
ON CONFLICT (id) DO UPDATE SET display_name=EXCLUDED.display_name,avatar_initials=EXCLUDED.avatar_initials,is_bot=true;

INSERT INTO profiles (id,username,display_name,avatar_initials,is_bot,onboarding_completed,setup_completed)
VALUES ('b0000014-0000-4000-8000-000000000014','luma_bot','Luma','LU',true,true,true)
ON CONFLICT (id) DO UPDATE SET display_name=EXCLUDED.display_name,avatar_initials=EXCLUDED.avatar_initials,is_bot=true;

INSERT INTO profiles (id,username,display_name,avatar_initials,is_bot,onboarding_completed,setup_completed)
VALUES ('b0000015-0000-4000-8000-000000000015','roxyrush_bot','RoxyRush','RR',true,true,true)
ON CONFLICT (id) DO UPDATE SET display_name=EXCLUDED.display_name,avatar_initials=EXCLUDED.avatar_initials,is_bot=true;

INSERT INTO profiles (id,username,display_name,avatar_initials,is_bot,onboarding_completed,setup_completed)
VALUES ('b0000016-0000-4000-8000-000000000016','silvertom_bot','SilverTom','ST',true,true,true)
ON CONFLICT (id) DO UPDATE SET display_name=EXCLUDED.display_name,avatar_initials=EXCLUDED.avatar_initials,is_bot=true;

INSERT INTO profiles (id,username,display_name,avatar_initials,is_bot,onboarding_completed,setup_completed)
VALUES ('b0000017-0000-4000-8000-000000000017','quickbee_bot','QuickBee','QB',true,true,true)
ON CONFLICT (id) DO UPDATE SET display_name=EXCLUDED.display_name,avatar_initials=EXCLUDED.avatar_initials,is_bot=true;

INSERT INTO profiles (id,username,display_name,avatar_initials,is_bot,onboarding_completed,setup_completed)
VALUES ('b0000018-0000-4000-8000-000000000018','novalite_bot','NovaLite','NL',true,true,true)
ON CONFLICT (id) DO UPDATE SET display_name=EXCLUDED.display_name,avatar_initials=EXCLUDED.avatar_initials,is_bot=true;

INSERT INTO profiles (id,username,display_name,avatar_initials,is_bot,onboarding_completed,setup_completed)
VALUES ('b0000019-0000-4000-8000-000000000019','pixelmika_bot','PixelMika','PM',true,true,true)
ON CONFLICT (id) DO UPDATE SET display_name=EXCLUDED.display_name,avatar_initials=EXCLUDED.avatar_initials,is_bot=true;

INSERT INTO profiles (id,username,display_name,avatar_initials,is_bot,onboarding_completed,setup_completed)
VALUES ('b0000020-0000-4000-8000-000000000020','chillzeno_bot','ChillZeno','CZ',true,true,true)
ON CONFLICT (id) DO UPDATE SET display_name=EXCLUDED.display_name,avatar_initials=EXCLUDED.avatar_initials,is_bot=true;

-- Silver ranked_profiles
INSERT INTO ranked_profiles (user_id,season_id,rank_tier,division,lp,mmr,wins,losses,win_streak,best_win_streak,season_points)
SELECT 'b0000011-0000-4000-8000-000000000011',id,'silver',3,620,1070,48,55,0,3,960 FROM seasons WHERE is_active=true
ON CONFLICT (user_id,season_id) DO UPDATE SET rank_tier=EXCLUDED.rank_tier,division=EXCLUDED.division,lp=EXCLUDED.lp,mmr=EXCLUDED.mmr,wins=EXCLUDED.wins,losses=EXCLUDED.losses;

INSERT INTO ranked_profiles (user_id,season_id,rank_tier,division,lp,mmr,wins,losses,win_streak,best_win_streak,season_points)
SELECT 'b0000012-0000-4000-8000-000000000012',id,'silver',3,680,1090,55,60,1,4,1100 FROM seasons WHERE is_active=true
ON CONFLICT (user_id,season_id) DO UPDATE SET rank_tier=EXCLUDED.rank_tier,division=EXCLUDED.division,lp=EXCLUDED.lp,mmr=EXCLUDED.mmr,wins=EXCLUDED.wins,losses=EXCLUDED.losses;

INSERT INTO ranked_profiles (user_id,season_id,rank_tier,division,lp,mmr,wins,losses,win_streak,best_win_streak,season_points)
SELECT 'b0000013-0000-4000-8000-000000000013',id,'silver',2,820,1110,62,65,0,3,1240 FROM seasons WHERE is_active=true
ON CONFLICT (user_id,season_id) DO UPDATE SET rank_tier=EXCLUDED.rank_tier,division=EXCLUDED.division,lp=EXCLUDED.lp,mmr=EXCLUDED.mmr,wins=EXCLUDED.wins,losses=EXCLUDED.losses;

INSERT INTO ranked_profiles (user_id,season_id,rank_tier,division,lp,mmr,wins,losses,win_streak,best_win_streak,season_points)
SELECT 'b0000014-0000-4000-8000-000000000014',id,'silver',2,880,1130,70,72,2,5,1400 FROM seasons WHERE is_active=true
ON CONFLICT (user_id,season_id) DO UPDATE SET rank_tier=EXCLUDED.rank_tier,division=EXCLUDED.division,lp=EXCLUDED.lp,mmr=EXCLUDED.mmr,wins=EXCLUDED.wins,losses=EXCLUDED.losses;

INSERT INTO ranked_profiles (user_id,season_id,rank_tier,division,lp,mmr,wins,losses,win_streak,best_win_streak,season_points)
SELECT 'b0000015-0000-4000-8000-000000000015',id,'silver',1,1020,1150,75,78,0,4,1500 FROM seasons WHERE is_active=true
ON CONFLICT (user_id,season_id) DO UPDATE SET rank_tier=EXCLUDED.rank_tier,division=EXCLUDED.division,lp=EXCLUDED.lp,mmr=EXCLUDED.mmr,wins=EXCLUDED.wins,losses=EXCLUDED.losses;

INSERT INTO ranked_profiles (user_id,season_id,rank_tier,division,lp,mmr,wins,losses,win_streak,best_win_streak,season_points)
SELECT 'b0000016-0000-4000-8000-000000000016',id,'silver',3,640,1075,50,58,0,2,1000 FROM seasons WHERE is_active=true
ON CONFLICT (user_id,season_id) DO UPDATE SET rank_tier=EXCLUDED.rank_tier,division=EXCLUDED.division,lp=EXCLUDED.lp,mmr=EXCLUDED.mmr,wins=EXCLUDED.wins,losses=EXCLUDED.losses;

INSERT INTO ranked_profiles (user_id,season_id,rank_tier,division,lp,mmr,wins,losses,win_streak,best_win_streak,season_points)
SELECT 'b0000017-0000-4000-8000-000000000017',id,'silver',1,1080,1170,80,82,1,5,1600 FROM seasons WHERE is_active=true
ON CONFLICT (user_id,season_id) DO UPDATE SET rank_tier=EXCLUDED.rank_tier,division=EXCLUDED.division,lp=EXCLUDED.lp,mmr=EXCLUDED.mmr,wins=EXCLUDED.wins,losses=EXCLUDED.losses;

INSERT INTO ranked_profiles (user_id,season_id,rank_tier,division,lp,mmr,wins,losses,win_streak,best_win_streak,season_points)
SELECT 'b0000018-0000-4000-8000-000000000018',id,'silver',2,760,1100,58,68,0,3,1160 FROM seasons WHERE is_active=true
ON CONFLICT (user_id,season_id) DO UPDATE SET rank_tier=EXCLUDED.rank_tier,division=EXCLUDED.division,lp=EXCLUDED.lp,mmr=EXCLUDED.mmr,wins=EXCLUDED.wins,losses=EXCLUDED.losses;

INSERT INTO ranked_profiles (user_id,season_id,rank_tier,division,lp,mmr,wins,losses,win_streak,best_win_streak,season_points)
SELECT 'b0000019-0000-4000-8000-000000000019',id,'silver',1,1140,1200,90,90,0,6,1800 FROM seasons WHERE is_active=true
ON CONFLICT (user_id,season_id) DO UPDATE SET rank_tier=EXCLUDED.rank_tier,division=EXCLUDED.division,lp=EXCLUDED.lp,mmr=EXCLUDED.mmr,wins=EXCLUDED.wins,losses=EXCLUDED.losses;

INSERT INTO ranked_profiles (user_id,season_id,rank_tier,division,lp,mmr,wins,losses,win_streak,best_win_streak,season_points)
SELECT 'b0000020-0000-4000-8000-000000000020',id,'silver',3,700,1095,52,62,0,3,1040 FROM seasons WHERE is_active=true
ON CONFLICT (user_id,season_id) DO UPDATE SET rank_tier=EXCLUDED.rank_tier,division=EXCLUDED.division,lp=EXCLUDED.lp,mmr=EXCLUDED.mmr,wins=EXCLUDED.wins,losses=EXCLUDED.losses;

-- ════════════════════════════════════════════════════════════
-- GOLD (IDs b0000021 – b0000030)
-- accuracy ~65-75%, winrate ~50-57%
-- ════════════════════════════════════════════════════════════

INSERT INTO profiles (id,username,display_name,avatar_initials,is_bot,onboarding_completed,setup_completed)
VALUES ('b0000021-0000-4000-8000-000000000021','goldraptor_bot','GoldRaptor','GR',true,true,true)
ON CONFLICT (id) DO UPDATE SET display_name=EXCLUDED.display_name,avatar_initials=EXCLUDED.avatar_initials,is_bot=true;

INSERT INTO profiles (id,username,display_name,avatar_initials,is_bot,onboarding_completed,setup_completed)
VALUES ('b0000022-0000-4000-8000-000000000022','blitzmika_bot','BlitzMika','BM',true,true,true)
ON CONFLICT (id) DO UPDATE SET display_name=EXCLUDED.display_name,avatar_initials=EXCLUDED.avatar_initials,is_bot=true;

INSERT INTO profiles (id,username,display_name,avatar_initials,is_bot,onboarding_completed,setup_completed)
VALUES ('b0000023-0000-4000-8000-000000000023','ghostrank_bot','GhostRank','GK',true,true,true)
ON CONFLICT (id) DO UPDATE SET display_name=EXCLUDED.display_name,avatar_initials=EXCLUDED.avatar_initials,is_bot=true;

INSERT INTO profiles (id,username,display_name,avatar_initials,is_bot,onboarding_completed,setup_completed)
VALUES ('b0000024-0000-4000-8000-000000000024','lunarush_bot','LunaRush','LR',true,true,true)
ON CONFLICT (id) DO UPDATE SET display_name=EXCLUDED.display_name,avatar_initials=EXCLUDED.avatar_initials,is_bot=true;

INSERT INTO profiles (id,username,display_name,avatar_initials,is_bot,onboarding_completed,setup_completed)
VALUES ('b0000025-0000-4000-8000-000000000025','quizbee_bot','QuizBee','QZ',true,true,true)
ON CONFLICT (id) DO UPDATE SET display_name=EXCLUDED.display_name,avatar_initials=EXCLUDED.avatar_initials,is_bot=true;

INSERT INTO profiles (id,username,display_name,avatar_initials,is_bot,onboarding_completed,setup_completed)
VALUES ('b0000026-0000-4000-8000-000000000026','drawking_bot','DrawKing','DK',true,true,true)
ON CONFLICT (id) DO UPDATE SET display_name=EXCLUDED.display_name,avatar_initials=EXCLUDED.avatar_initials,is_bot=true;

INSERT INTO profiles (id,username,display_name,avatar_initials,is_bot,onboarding_completed,setup_completed)
VALUES ('b0000027-0000-4000-8000-000000000027','chaoskai_bot','ChaosKai','CK',true,true,true)
ON CONFLICT (id) DO UPDATE SET display_name=EXCLUDED.display_name,avatar_initials=EXCLUDED.avatar_initials,is_bot=true;

INSERT INTO profiles (id,username,display_name,avatar_initials,is_bot,onboarding_completed,setup_completed)
VALUES ('b0000028-0000-4000-8000-000000000028','tapnova_bot','TapNova','TN',true,true,true)
ON CONFLICT (id) DO UPDATE SET display_name=EXCLUDED.display_name,avatar_initials=EXCLUDED.avatar_initials,is_bot=true;

INSERT INTO profiles (id,username,display_name,avatar_initials,is_bot,onboarding_completed,setup_completed)
VALUES ('b0000029-0000-4000-8000-000000000029','rankroxy_bot','RankRoxy','RX',true,true,true)
ON CONFLICT (id) DO UPDATE SET display_name=EXCLUDED.display_name,avatar_initials=EXCLUDED.avatar_initials,is_bot=true;

INSERT INTO profiles (id,username,display_name,avatar_initials,is_bot,onboarding_completed,setup_completed)
VALUES ('b0000030-0000-4000-8000-000000000030','zenoprime_bot','ZenoPrime','ZP',true,true,true)
ON CONFLICT (id) DO UPDATE SET display_name=EXCLUDED.display_name,avatar_initials=EXCLUDED.avatar_initials,is_bot=true;

-- Gold ranked_profiles
INSERT INTO ranked_profiles (user_id,season_id,rank_tier,division,lp,mmr,wins,losses,win_streak,best_win_streak,season_points)
SELECT 'b0000021-0000-4000-8000-000000000021',id,'gold',3,1220,1270,95,90,0,4,1900 FROM seasons WHERE is_active=true
ON CONFLICT (user_id,season_id) DO UPDATE SET rank_tier=EXCLUDED.rank_tier,division=EXCLUDED.division,lp=EXCLUDED.lp,mmr=EXCLUDED.mmr,wins=EXCLUDED.wins,losses=EXCLUDED.losses;

INSERT INTO ranked_profiles (user_id,season_id,rank_tier,division,lp,mmr,wins,losses,win_streak,best_win_streak,season_points)
SELECT 'b0000022-0000-4000-8000-000000000022',id,'gold',3,1260,1280,100,95,1,5,2000 FROM seasons WHERE is_active=true
ON CONFLICT (user_id,season_id) DO UPDATE SET rank_tier=EXCLUDED.rank_tier,division=EXCLUDED.division,lp=EXCLUDED.lp,mmr=EXCLUDED.mmr,wins=EXCLUDED.wins,losses=EXCLUDED.losses;

INSERT INTO ranked_profiles (user_id,season_id,rank_tier,division,lp,mmr,wins,losses,win_streak,best_win_streak,season_points)
SELECT 'b0000023-0000-4000-8000-000000000023',id,'gold',2,1350,1300,108,100,0,5,2160 FROM seasons WHERE is_active=true
ON CONFLICT (user_id,season_id) DO UPDATE SET rank_tier=EXCLUDED.rank_tier,division=EXCLUDED.division,lp=EXCLUDED.lp,mmr=EXCLUDED.mmr,wins=EXCLUDED.wins,losses=EXCLUDED.losses;

INSERT INTO ranked_profiles (user_id,season_id,rank_tier,division,lp,mmr,wins,losses,win_streak,best_win_streak,season_points)
SELECT 'b0000024-0000-4000-8000-000000000024',id,'gold',2,1380,1320,115,105,2,6,2300 FROM seasons WHERE is_active=true
ON CONFLICT (user_id,season_id) DO UPDATE SET rank_tier=EXCLUDED.rank_tier,division=EXCLUDED.division,lp=EXCLUDED.lp,mmr=EXCLUDED.mmr,wins=EXCLUDED.wins,losses=EXCLUDED.losses;

INSERT INTO ranked_profiles (user_id,season_id,rank_tier,division,lp,mmr,wins,losses,win_streak,best_win_streak,season_points)
SELECT 'b0000025-0000-4000-8000-000000000025',id,'gold',1,1450,1360,122,112,0,5,2440 FROM seasons WHERE is_active=true
ON CONFLICT (user_id,season_id) DO UPDATE SET rank_tier=EXCLUDED.rank_tier,division=EXCLUDED.division,lp=EXCLUDED.lp,mmr=EXCLUDED.mmr,wins=EXCLUDED.wins,losses=EXCLUDED.losses;

INSERT INTO ranked_profiles (user_id,season_id,rank_tier,division,lp,mmr,wins,losses,win_streak,best_win_streak,season_points)
SELECT 'b0000026-0000-4000-8000-000000000026',id,'gold',3,1240,1275,98,92,0,4,1960 FROM seasons WHERE is_active=true
ON CONFLICT (user_id,season_id) DO UPDATE SET rank_tier=EXCLUDED.rank_tier,division=EXCLUDED.division,lp=EXCLUDED.lp,mmr=EXCLUDED.mmr,wins=EXCLUDED.wins,losses=EXCLUDED.losses;

INSERT INTO ranked_profiles (user_id,season_id,rank_tier,division,lp,mmr,wins,losses,win_streak,best_win_streak,season_points)
SELECT 'b0000027-0000-4000-8000-000000000027',id,'gold',1,1490,1380,128,118,1,7,2560 FROM seasons WHERE is_active=true
ON CONFLICT (user_id,season_id) DO UPDATE SET rank_tier=EXCLUDED.rank_tier,division=EXCLUDED.division,lp=EXCLUDED.lp,mmr=EXCLUDED.mmr,wins=EXCLUDED.wins,losses=EXCLUDED.losses;

INSERT INTO ranked_profiles (user_id,season_id,rank_tier,division,lp,mmr,wins,losses,win_streak,best_win_streak,season_points)
SELECT 'b0000028-0000-4000-8000-000000000028',id,'gold',2,1310,1290,105,98,0,4,2100 FROM seasons WHERE is_active=true
ON CONFLICT (user_id,season_id) DO UPDATE SET rank_tier=EXCLUDED.rank_tier,division=EXCLUDED.division,lp=EXCLUDED.lp,mmr=EXCLUDED.mmr,wins=EXCLUDED.wins,losses=EXCLUDED.losses;

INSERT INTO ranked_profiles (user_id,season_id,rank_tier,division,lp,mmr,wins,losses,win_streak,best_win_streak,season_points)
SELECT 'b0000029-0000-4000-8000-000000000029',id,'gold',1,1420,1340,118,108,0,5,2360 FROM seasons WHERE is_active=true
ON CONFLICT (user_id,season_id) DO UPDATE SET rank_tier=EXCLUDED.rank_tier,division=EXCLUDED.division,lp=EXCLUDED.lp,mmr=EXCLUDED.mmr,wins=EXCLUDED.wins,losses=EXCLUDED.losses;

INSERT INTO ranked_profiles (user_id,season_id,rank_tier,division,lp,mmr,wins,losses,win_streak,best_win_streak,season_points)
SELECT 'b0000030-0000-4000-8000-000000000030',id,'gold',1,1540,1400,135,122,3,8,2700 FROM seasons WHERE is_active=true
ON CONFLICT (user_id,season_id) DO UPDATE SET rank_tier=EXCLUDED.rank_tier,division=EXCLUDED.division,lp=EXCLUDED.lp,mmr=EXCLUDED.mmr,wins=EXCLUDED.wins,losses=EXCLUDED.losses;

-- ════════════════════════════════════════════════════════════
-- NEON (IDs b0000031 – b0000040)
-- accuracy ~72-82%, winrate ~55-62%
-- ════════════════════════════════════════════════════════════

INSERT INTO profiles (id,username,display_name,avatar_initials,is_bot,onboarding_completed,setup_completed)
VALUES ('b0000031-0000-4000-8000-000000000031','neonviper_bot','NeonViper','NV',true,true,true)
ON CONFLICT (id) DO UPDATE SET display_name=EXCLUDED.display_name,avatar_initials=EXCLUDED.avatar_initials,is_bot=true;

INSERT INTO profiles (id,username,display_name,avatar_initials,is_bot,onboarding_completed,setup_completed)
VALUES ('b0000032-0000-4000-8000-000000000032','pulsefox_bot','PulseFox','PF',true,true,true)
ON CONFLICT (id) DO UPDATE SET display_name=EXCLUDED.display_name,avatar_initials=EXCLUDED.avatar_initials,is_bot=true;

INSERT INTO profiles (id,username,display_name,avatar_initials,is_bot,onboarding_completed,setup_completed)
VALUES ('b0000033-0000-4000-8000-000000000033','arenakai_bot','ArenaKai','AK',true,true,true)
ON CONFLICT (id) DO UPDATE SET display_name=EXCLUDED.display_name,avatar_initials=EXCLUDED.avatar_initials,is_bot=true;

INSERT INTO profiles (id,username,display_name,avatar_initials,is_bot,onboarding_completed,setup_completed)
VALUES ('b0000034-0000-4000-8000-000000000034','lumastrike_bot','LumaStrike','LS',true,true,true)
ON CONFLICT (id) DO UPDATE SET display_name=EXCLUDED.display_name,avatar_initials=EXCLUDED.avatar_initials,is_bot=true;

INSERT INTO profiles (id,username,display_name,avatar_initials,is_bot,onboarding_completed,setup_completed)
VALUES ('b0000035-0000-4000-8000-000000000035','roxyneon_bot','RoxyNeon','RN',true,true,true)
ON CONFLICT (id) DO UPDATE SET display_name=EXCLUDED.display_name,avatar_initials=EXCLUDED.avatar_initials,is_bot=true;

INSERT INTO profiles (id,username,display_name,avatar_initials,is_bot,onboarding_completed,setup_completed)
VALUES ('b0000036-0000-4000-8000-000000000036','metamika_bot','MetaMika','MM',true,true,true)
ON CONFLICT (id) DO UPDATE SET display_name=EXCLUDED.display_name,avatar_initials=EXCLUDED.avatar_initials,is_bot=true;

INSERT INTO profiles (id,username,display_name,avatar_initials,is_bot,onboarding_completed,setup_completed)
VALUES ('b0000037-0000-4000-8000-000000000037','glitchbee_bot','GlitchBee','GB',true,true,true)
ON CONFLICT (id) DO UPDATE SET display_name=EXCLUDED.display_name,avatar_initials=EXCLUDED.avatar_initials,is_bot=true;

INSERT INTO profiles (id,username,display_name,avatar_initials,is_bot,onboarding_completed,setup_completed)
VALUES ('b0000038-0000-4000-8000-000000000038','novarush_bot','NovaRush','NR',true,true,true)
ON CONFLICT (id) DO UPDATE SET display_name=EXCLUDED.display_name,avatar_initials=EXCLUDED.avatar_initials,is_bot=true;

INSERT INTO profiles (id,username,display_name,avatar_initials,is_bot,onboarding_completed,setup_completed)
VALUES ('b0000039-0000-4000-8000-000000000039','pixelghost_bot','PixelGhost','PG',true,true,true)
ON CONFLICT (id) DO UPDATE SET display_name=EXCLUDED.display_name,avatar_initials=EXCLUDED.avatar_initials,is_bot=true;

INSERT INTO profiles (id,username,display_name,avatar_initials,is_bot,onboarding_completed,setup_completed)
VALUES ('b0000040-0000-4000-8000-000000000040','zenovolt_bot','ZenoVolt','ZV',true,true,true)
ON CONFLICT (id) DO UPDATE SET display_name=EXCLUDED.display_name,avatar_initials=EXCLUDED.avatar_initials,is_bot=true;

-- Neon ranked_profiles
INSERT INTO ranked_profiles (user_id,season_id,rank_tier,division,lp,mmr,wins,losses,win_streak,best_win_streak,season_points)
SELECT 'b0000031-0000-4000-8000-000000000031',id,'neon',3,1820,1520,145,110,0,5,2900 FROM seasons WHERE is_active=true
ON CONFLICT (user_id,season_id) DO UPDATE SET rank_tier=EXCLUDED.rank_tier,division=EXCLUDED.division,lp=EXCLUDED.lp,mmr=EXCLUDED.mmr,wins=EXCLUDED.wins,losses=EXCLUDED.losses;

INSERT INTO ranked_profiles (user_id,season_id,rank_tier,division,lp,mmr,wins,losses,win_streak,best_win_streak,season_points)
SELECT 'b0000032-0000-4000-8000-000000000032',id,'neon',3,1860,1540,152,115,2,6,3040 FROM seasons WHERE is_active=true
ON CONFLICT (user_id,season_id) DO UPDATE SET rank_tier=EXCLUDED.rank_tier,division=EXCLUDED.division,lp=EXCLUDED.lp,mmr=EXCLUDED.mmr,wins=EXCLUDED.wins,losses=EXCLUDED.losses;

INSERT INTO ranked_profiles (user_id,season_id,rank_tier,division,lp,mmr,wins,losses,win_streak,best_win_streak,season_points)
SELECT 'b0000033-0000-4000-8000-000000000033',id,'neon',2,1950,1570,160,118,0,6,3200 FROM seasons WHERE is_active=true
ON CONFLICT (user_id,season_id) DO UPDATE SET rank_tier=EXCLUDED.rank_tier,division=EXCLUDED.division,lp=EXCLUDED.lp,mmr=EXCLUDED.mmr,wins=EXCLUDED.wins,losses=EXCLUDED.losses;

INSERT INTO ranked_profiles (user_id,season_id,rank_tier,division,lp,mmr,wins,losses,win_streak,best_win_streak,season_points)
SELECT 'b0000034-0000-4000-8000-000000000034',id,'neon',2,1980,1590,168,122,1,7,3360 FROM seasons WHERE is_active=true
ON CONFLICT (user_id,season_id) DO UPDATE SET rank_tier=EXCLUDED.rank_tier,division=EXCLUDED.division,lp=EXCLUDED.lp,mmr=EXCLUDED.mmr,wins=EXCLUDED.wins,losses=EXCLUDED.losses;

INSERT INTO ranked_profiles (user_id,season_id,rank_tier,division,lp,mmr,wins,losses,win_streak,best_win_streak,season_points)
SELECT 'b0000035-0000-4000-8000-000000000035',id,'neon',1,2060,1620,175,128,0,7,3500 FROM seasons WHERE is_active=true
ON CONFLICT (user_id,season_id) DO UPDATE SET rank_tier=EXCLUDED.rank_tier,division=EXCLUDED.division,lp=EXCLUDED.lp,mmr=EXCLUDED.mmr,wins=EXCLUDED.wins,losses=EXCLUDED.losses;

INSERT INTO ranked_profiles (user_id,season_id,rank_tier,division,lp,mmr,wins,losses,win_streak,best_win_streak,season_points)
SELECT 'b0000036-0000-4000-8000-000000000036',id,'neon',3,1840,1530,148,112,0,5,2960 FROM seasons WHERE is_active=true
ON CONFLICT (user_id,season_id) DO UPDATE SET rank_tier=EXCLUDED.rank_tier,division=EXCLUDED.division,lp=EXCLUDED.lp,mmr=EXCLUDED.mmr,wins=EXCLUDED.wins,losses=EXCLUDED.losses;

INSERT INTO ranked_profiles (user_id,season_id,rank_tier,division,lp,mmr,wins,losses,win_streak,best_win_streak,season_points)
SELECT 'b0000037-0000-4000-8000-000000000037',id,'neon',1,2080,1640,180,132,3,9,3600 FROM seasons WHERE is_active=true
ON CONFLICT (user_id,season_id) DO UPDATE SET rank_tier=EXCLUDED.rank_tier,division=EXCLUDED.division,lp=EXCLUDED.lp,mmr=EXCLUDED.mmr,wins=EXCLUDED.wins,losses=EXCLUDED.losses;

INSERT INTO ranked_profiles (user_id,season_id,rank_tier,division,lp,mmr,wins,losses,win_streak,best_win_streak,season_points)
SELECT 'b0000038-0000-4000-8000-000000000038',id,'neon',2,1920,1560,155,120,0,5,3100 FROM seasons WHERE is_active=true
ON CONFLICT (user_id,season_id) DO UPDATE SET rank_tier=EXCLUDED.rank_tier,division=EXCLUDED.division,lp=EXCLUDED.lp,mmr=EXCLUDED.mmr,wins=EXCLUDED.wins,losses=EXCLUDED.losses;

INSERT INTO ranked_profiles (user_id,season_id,rank_tier,division,lp,mmr,wins,losses,win_streak,best_win_streak,season_points)
SELECT 'b0000039-0000-4000-8000-000000000039',id,'neon',1,2120,1660,188,135,1,8,3760 FROM seasons WHERE is_active=true
ON CONFLICT (user_id,season_id) DO UPDATE SET rank_tier=EXCLUDED.rank_tier,division=EXCLUDED.division,lp=EXCLUDED.lp,mmr=EXCLUDED.mmr,wins=EXCLUDED.wins,losses=EXCLUDED.losses;

INSERT INTO ranked_profiles (user_id,season_id,rank_tier,division,lp,mmr,wins,losses,win_streak,best_win_streak,season_points)
SELECT 'b0000040-0000-4000-8000-000000000040',id,'neon',1,2140,1680,195,138,0,9,3900 FROM seasons WHERE is_active=true
ON CONFLICT (user_id,season_id) DO UPDATE SET rank_tier=EXCLUDED.rank_tier,division=EXCLUDED.division,lp=EXCLUDED.lp,mmr=EXCLUDED.mmr,wins=EXCLUDED.wins,losses=EXCLUDED.losses;

-- ════════════════════════════════════════════════════════════
-- ELITE (IDs b0000041 – b0000050)
-- accuracy ~80-88%, winrate ~60-68%
-- ════════════════════════════════════════════════════════════

INSERT INTO profiles (id,username,display_name,avatar_initials,is_bot,onboarding_completed,setup_completed)
VALUES ('b0000041-0000-4000-8000-000000000041','eliteraptor_bot','EliteRaptor','ER',true,true,true)
ON CONFLICT (id) DO UPDATE SET display_name=EXCLUDED.display_name,avatar_initials=EXCLUDED.avatar_initials,is_bot=true;

INSERT INTO profiles (id,username,display_name,avatar_initials,is_bot,onboarding_completed,setup_completed)
VALUES ('b0000042-0000-4000-8000-000000000042','crownkai_bot','CrownKai','CW',true,true,true)
ON CONFLICT (id) DO UPDATE SET display_name=EXCLUDED.display_name,avatar_initials=EXCLUDED.avatar_initials,is_bot=true;

INSERT INTO profiles (id,username,display_name,avatar_initials,is_bot,onboarding_completed,setup_completed)
VALUES ('b0000043-0000-4000-8000-000000000043','finalmika_bot','FinalMika','FM',true,true,true)
ON CONFLICT (id) DO UPDATE SET display_name=EXCLUDED.display_name,avatar_initials=EXCLUDED.avatar_initials,is_bot=true;

INSERT INTO profiles (id,username,display_name,avatar_initials,is_bot,onboarding_completed,setup_completed)
VALUES ('b0000044-0000-4000-8000-000000000044','ghostelite_bot','GhostElite','GE',true,true,true)
ON CONFLICT (id) DO UPDATE SET display_name=EXCLUDED.display_name,avatar_initials=EXCLUDED.avatar_initials,is_bot=true;

INSERT INTO profiles (id,username,display_name,avatar_initials,is_bot,onboarding_completed,setup_completed)
VALUES ('b0000045-0000-4000-8000-000000000045','lunaclutch_bot','LunaClutch','LC',true,true,true)
ON CONFLICT (id) DO UPDATE SET display_name=EXCLUDED.display_name,avatar_initials=EXCLUDED.avatar_initials,is_bot=true;

INSERT INTO profiles (id,username,display_name,avatar_initials,is_bot,onboarding_completed,setup_completed)
VALUES ('b0000046-0000-4000-8000-000000000046','novalegend_bot','NovaLegend','NX',true,true,true)
ON CONFLICT (id) DO UPDATE SET display_name=EXCLUDED.display_name,avatar_initials=EXCLUDED.avatar_initials,is_bot=true;

INSERT INTO profiles (id,username,display_name,avatar_initials,is_bot,onboarding_completed,setup_completed)
VALUES ('b0000047-0000-4000-8000-000000000047','reflexbee_bot','ReflexBee','RB',true,true,true)
ON CONFLICT (id) DO UPDATE SET display_name=EXCLUDED.display_name,avatar_initials=EXCLUDED.avatar_initials,is_bot=true;

INSERT INTO profiles (id,username,display_name,avatar_initials,is_bot,onboarding_completed,setup_completed)
VALUES ('b0000048-0000-4000-8000-000000000048','drawviper_bot','DrawViper','DV',true,true,true)
ON CONFLICT (id) DO UPDATE SET display_name=EXCLUDED.display_name,avatar_initials=EXCLUDED.avatar_initials,is_bot=true;

INSERT INTO profiles (id,username,display_name,avatar_initials,is_bot,onboarding_completed,setup_completed)
VALUES ('b0000049-0000-4000-8000-000000000049','chaosprime_bot','ChaosPrime','CP',true,true,true)
ON CONFLICT (id) DO UPDATE SET display_name=EXCLUDED.display_name,avatar_initials=EXCLUDED.avatar_initials,is_bot=true;

INSERT INTO profiles (id,username,display_name,avatar_initials,is_bot,onboarding_completed,setup_completed)
VALUES ('b0000050-0000-4000-8000-000000000050','tapmaster_bot','TapMaster','TX',true,true,true)
ON CONFLICT (id) DO UPDATE SET display_name=EXCLUDED.display_name,avatar_initials=EXCLUDED.avatar_initials,is_bot=true;

-- Elite ranked_profiles
INSERT INTO ranked_profiles (user_id,season_id,rank_tier,division,lp,mmr,wins,losses,win_streak,best_win_streak,season_points)
SELECT 'b0000041-0000-4000-8000-000000000041',id,'elite',3,2420,1770,195,122,0,6,3900 FROM seasons WHERE is_active=true
ON CONFLICT (user_id,season_id) DO UPDATE SET rank_tier=EXCLUDED.rank_tier,division=EXCLUDED.division,lp=EXCLUDED.lp,mmr=EXCLUDED.mmr,wins=EXCLUDED.wins,losses=EXCLUDED.losses;

INSERT INTO ranked_profiles (user_id,season_id,rank_tier,division,lp,mmr,wins,losses,win_streak,best_win_streak,season_points)
SELECT 'b0000042-0000-4000-8000-000000000042',id,'elite',3,2460,1790,202,128,1,7,4040 FROM seasons WHERE is_active=true
ON CONFLICT (user_id,season_id) DO UPDATE SET rank_tier=EXCLUDED.rank_tier,division=EXCLUDED.division,lp=EXCLUDED.lp,mmr=EXCLUDED.mmr,wins=EXCLUDED.wins,losses=EXCLUDED.losses;

INSERT INTO ranked_profiles (user_id,season_id,rank_tier,division,lp,mmr,wins,losses,win_streak,best_win_streak,season_points)
SELECT 'b0000043-0000-4000-8000-000000000043',id,'elite',2,2550,1820,210,132,0,7,4200 FROM seasons WHERE is_active=true
ON CONFLICT (user_id,season_id) DO UPDATE SET rank_tier=EXCLUDED.rank_tier,division=EXCLUDED.division,lp=EXCLUDED.lp,mmr=EXCLUDED.mmr,wins=EXCLUDED.wins,losses=EXCLUDED.losses;

INSERT INTO ranked_profiles (user_id,season_id,rank_tier,division,lp,mmr,wins,losses,win_streak,best_win_streak,season_points)
SELECT 'b0000044-0000-4000-8000-000000000044',id,'elite',2,2580,1840,218,135,2,8,4360 FROM seasons WHERE is_active=true
ON CONFLICT (user_id,season_id) DO UPDATE SET rank_tier=EXCLUDED.rank_tier,division=EXCLUDED.division,lp=EXCLUDED.lp,mmr=EXCLUDED.mmr,wins=EXCLUDED.wins,losses=EXCLUDED.losses;

INSERT INTO ranked_profiles (user_id,season_id,rank_tier,division,lp,mmr,wins,losses,win_streak,best_win_streak,season_points)
SELECT 'b0000045-0000-4000-8000-000000000045',id,'elite',1,2660,1880,225,140,0,8,4500 FROM seasons WHERE is_active=true
ON CONFLICT (user_id,season_id) DO UPDATE SET rank_tier=EXCLUDED.rank_tier,division=EXCLUDED.division,lp=EXCLUDED.lp,mmr=EXCLUDED.mmr,wins=EXCLUDED.wins,losses=EXCLUDED.losses;

INSERT INTO ranked_profiles (user_id,season_id,rank_tier,division,lp,mmr,wins,losses,win_streak,best_win_streak,season_points)
SELECT 'b0000046-0000-4000-8000-000000000046',id,'elite',3,2440,1780,198,125,0,6,3960 FROM seasons WHERE is_active=true
ON CONFLICT (user_id,season_id) DO UPDATE SET rank_tier=EXCLUDED.rank_tier,division=EXCLUDED.division,lp=EXCLUDED.lp,mmr=EXCLUDED.mmr,wins=EXCLUDED.wins,losses=EXCLUDED.losses;

INSERT INTO ranked_profiles (user_id,season_id,rank_tier,division,lp,mmr,wins,losses,win_streak,best_win_streak,season_points)
SELECT 'b0000047-0000-4000-8000-000000000047',id,'elite',1,2700,1900,232,142,1,9,4640 FROM seasons WHERE is_active=true
ON CONFLICT (user_id,season_id) DO UPDATE SET rank_tier=EXCLUDED.rank_tier,division=EXCLUDED.division,lp=EXCLUDED.lp,mmr=EXCLUDED.mmr,wins=EXCLUDED.wins,losses=EXCLUDED.losses;

INSERT INTO ranked_profiles (user_id,season_id,rank_tier,division,lp,mmr,wins,losses,win_streak,best_win_streak,season_points)
SELECT 'b0000048-0000-4000-8000-000000000048',id,'elite',2,2510,1810,205,130,0,6,4100 FROM seasons WHERE is_active=true
ON CONFLICT (user_id,season_id) DO UPDATE SET rank_tier=EXCLUDED.rank_tier,division=EXCLUDED.division,lp=EXCLUDED.lp,mmr=EXCLUDED.mmr,wins=EXCLUDED.wins,losses=EXCLUDED.losses;

INSERT INTO ranked_profiles (user_id,season_id,rank_tier,division,lp,mmr,wins,losses,win_streak,best_win_streak,season_points)
SELECT 'b0000049-0000-4000-8000-000000000049',id,'elite',1,2720,1920,240,148,0,10,4800 FROM seasons WHERE is_active=true
ON CONFLICT (user_id,season_id) DO UPDATE SET rank_tier=EXCLUDED.rank_tier,division=EXCLUDED.division,lp=EXCLUDED.lp,mmr=EXCLUDED.mmr,wins=EXCLUDED.wins,losses=EXCLUDED.losses;

INSERT INTO ranked_profiles (user_id,season_id,rank_tier,division,lp,mmr,wins,losses,win_streak,best_win_streak,season_points)
SELECT 'b0000050-0000-4000-8000-000000000050',id,'elite',1,2750,1950,248,152,3,11,4960 FROM seasons WHERE is_active=true
ON CONFLICT (user_id,season_id) DO UPDATE SET rank_tier=EXCLUDED.rank_tier,division=EXCLUDED.division,lp=EXCLUDED.lp,mmr=EXCLUDED.mmr,wins=EXCLUDED.wins,losses=EXCLUDED.losses;

-- ════════════════════════════════════════════════════════════
-- LEGEND (IDs b0000051 – b0000060)
-- accuracy ~86-94%, winrate ~65-75%
-- ════════════════════════════════════════════════════════════

INSERT INTO profiles (id,username,display_name,avatar_initials,is_bot,onboarding_completed,setup_completed)
VALUES ('b0000051-0000-4000-8000-000000000051','legendfox_bot','LegendFox','LF',true,true,true)
ON CONFLICT (id) DO UPDATE SET display_name=EXCLUDED.display_name,avatar_initials=EXCLUDED.avatar_initials,is_bot=true;

INSERT INTO profiles (id,username,display_name,avatar_initials,is_bot,onboarding_completed,setup_completed)
VALUES ('b0000052-0000-4000-8000-000000000052','apexmika_bot','ApexMika','AM',true,true,true)
ON CONFLICT (id) DO UPDATE SET display_name=EXCLUDED.display_name,avatar_initials=EXCLUDED.avatar_initials,is_bot=true;

INSERT INTO profiles (id,username,display_name,avatar_initials,is_bot,onboarding_completed,setup_completed)
VALUES ('b0000053-0000-4000-8000-000000000053','crownroxy_bot','CrownRoxy','CR',true,true,true)
ON CONFLICT (id) DO UPDATE SET display_name=EXCLUDED.display_name,avatar_initials=EXCLUDED.avatar_initials,is_bot=true;

INSERT INTO profiles (id,username,display_name,avatar_initials,is_bot,onboarding_completed,setup_completed)
VALUES ('b0000054-0000-4000-8000-000000000054','mythickai_bot','MythicKai','MK',true,true,true)
ON CONFLICT (id) DO UPDATE SET display_name=EXCLUDED.display_name,avatar_initials=EXCLUDED.avatar_initials,is_bot=true;

INSERT INTO profiles (id,username,display_name,avatar_initials,is_bot,onboarding_completed,setup_completed)
VALUES ('b0000055-0000-4000-8000-000000000055','novagod_bot','NovaGod','NG',true,true,true)
ON CONFLICT (id) DO UPDATE SET display_name=EXCLUDED.display_name,avatar_initials=EXCLUDED.avatar_initials,is_bot=true;

INSERT INTO profiles (id,username,display_name,avatar_initials,is_bot,onboarding_completed,setup_completed)
VALUES ('b0000056-0000-4000-8000-000000000056','ghostlegend_bot','GhostLegend','GL',true,true,true)
ON CONFLICT (id) DO UPDATE SET display_name=EXCLUDED.display_name,avatar_initials=EXCLUDED.avatar_initials,is_bot=true;

INSERT INTO profiles (id,username,display_name,avatar_initials,is_bot,onboarding_completed,setup_completed)
VALUES ('b0000057-0000-4000-8000-000000000057','lumaapex_bot','LumaApex','LA',true,true,true)
ON CONFLICT (id) DO UPDATE SET display_name=EXCLUDED.display_name,avatar_initials=EXCLUDED.avatar_initials,is_bot=true;

INSERT INTO profiles (id,username,display_name,avatar_initials,is_bot,onboarding_completed,setup_completed)
VALUES ('b0000058-0000-4000-8000-000000000058','zenoking_bot','ZenoKing','ZK',true,true,true)
ON CONFLICT (id) DO UPDATE SET display_name=EXCLUDED.display_name,avatar_initials=EXCLUDED.avatar_initials,is_bot=true;

INSERT INTO profiles (id,username,display_name,avatar_initials,is_bot,onboarding_completed,setup_completed)
VALUES ('b0000059-0000-4000-8000-000000000059','pixelmyth_bot','PixelMyth','PX',true,true,true)
ON CONFLICT (id) DO UPDATE SET display_name=EXCLUDED.display_name,avatar_initials=EXCLUDED.avatar_initials,is_bot=true;

INSERT INTO profiles (id,username,display_name,avatar_initials,is_bot,onboarding_completed,setup_completed)
VALUES ('b0000060-0000-4000-8000-000000000060','finalboss_bot','FinalBoss','FB',true,true,true)
ON CONFLICT (id) DO UPDATE SET display_name=EXCLUDED.display_name,avatar_initials=EXCLUDED.avatar_initials,is_bot=true;

-- Legend ranked_profiles (LP 3000+ = legend tier, tier_index 5 × 600 = 3000 base)
INSERT INTO ranked_profiles (user_id,season_id,rank_tier,division,lp,mmr,wins,losses,win_streak,best_win_streak,season_points)
SELECT 'b0000051-0000-4000-8000-000000000051',id,'legend',1,3020,2080,280,150,0,8,5600 FROM seasons WHERE is_active=true
ON CONFLICT (user_id,season_id) DO UPDATE SET rank_tier=EXCLUDED.rank_tier,division=EXCLUDED.division,lp=EXCLUDED.lp,mmr=EXCLUDED.mmr,wins=EXCLUDED.wins,losses=EXCLUDED.losses;

INSERT INTO ranked_profiles (user_id,season_id,rank_tier,division,lp,mmr,wins,losses,win_streak,best_win_streak,season_points)
SELECT 'b0000052-0000-4000-8000-000000000052',id,'legend',1,3060,2100,288,155,1,9,5760 FROM seasons WHERE is_active=true
ON CONFLICT (user_id,season_id) DO UPDATE SET rank_tier=EXCLUDED.rank_tier,division=EXCLUDED.division,lp=EXCLUDED.lp,mmr=EXCLUDED.mmr,wins=EXCLUDED.wins,losses=EXCLUDED.losses;

INSERT INTO ranked_profiles (user_id,season_id,rank_tier,division,lp,mmr,wins,losses,win_streak,best_win_streak,season_points)
SELECT 'b0000053-0000-4000-8000-000000000053',id,'legend',1,3100,2130,295,158,0,9,5900 FROM seasons WHERE is_active=true
ON CONFLICT (user_id,season_id) DO UPDATE SET rank_tier=EXCLUDED.rank_tier,division=EXCLUDED.division,lp=EXCLUDED.lp,mmr=EXCLUDED.mmr,wins=EXCLUDED.wins,losses=EXCLUDED.losses;

INSERT INTO ranked_profiles (user_id,season_id,rank_tier,division,lp,mmr,wins,losses,win_streak,best_win_streak,season_points)
SELECT 'b0000054-0000-4000-8000-000000000054',id,'legend',1,3150,2160,305,162,2,10,6100 FROM seasons WHERE is_active=true
ON CONFLICT (user_id,season_id) DO UPDATE SET rank_tier=EXCLUDED.rank_tier,division=EXCLUDED.division,lp=EXCLUDED.lp,mmr=EXCLUDED.mmr,wins=EXCLUDED.wins,losses=EXCLUDED.losses;

INSERT INTO ranked_profiles (user_id,season_id,rank_tier,division,lp,mmr,wins,losses,win_streak,best_win_streak,season_points)
SELECT 'b0000055-0000-4000-8000-000000000055',id,'legend',1,3220,2200,318,168,0,11,6360 FROM seasons WHERE is_active=true
ON CONFLICT (user_id,season_id) DO UPDATE SET rank_tier=EXCLUDED.rank_tier,division=EXCLUDED.division,lp=EXCLUDED.lp,mmr=EXCLUDED.mmr,wins=EXCLUDED.wins,losses=EXCLUDED.losses;

INSERT INTO ranked_profiles (user_id,season_id,rank_tier,division,lp,mmr,wins,losses,win_streak,best_win_streak,season_points)
SELECT 'b0000056-0000-4000-8000-000000000056',id,'legend',1,3040,2090,282,152,0,8,5640 FROM seasons WHERE is_active=true
ON CONFLICT (user_id,season_id) DO UPDATE SET rank_tier=EXCLUDED.rank_tier,division=EXCLUDED.division,lp=EXCLUDED.lp,mmr=EXCLUDED.mmr,wins=EXCLUDED.wins,losses=EXCLUDED.losses;

INSERT INTO ranked_profiles (user_id,season_id,rank_tier,division,lp,mmr,wins,losses,win_streak,best_win_streak,season_points)
SELECT 'b0000057-0000-4000-8000-000000000057',id,'legend',1,3280,2240,328,172,4,13,6560 FROM seasons WHERE is_active=true
ON CONFLICT (user_id,season_id) DO UPDATE SET rank_tier=EXCLUDED.rank_tier,division=EXCLUDED.division,lp=EXCLUDED.lp,mmr=EXCLUDED.mmr,wins=EXCLUDED.wins,losses=EXCLUDED.losses;

INSERT INTO ranked_profiles (user_id,season_id,rank_tier,division,lp,mmr,wins,losses,win_streak,best_win_streak,season_points)
SELECT 'b0000058-0000-4000-8000-000000000058',id,'legend',1,3350,2280,340,178,1,12,6800 FROM seasons WHERE is_active=true
ON CONFLICT (user_id,season_id) DO UPDATE SET rank_tier=EXCLUDED.rank_tier,division=EXCLUDED.division,lp=EXCLUDED.lp,mmr=EXCLUDED.mmr,wins=EXCLUDED.wins,losses=EXCLUDED.losses;

INSERT INTO ranked_profiles (user_id,season_id,rank_tier,division,lp,mmr,wins,losses,win_streak,best_win_streak,season_points)
SELECT 'b0000059-0000-4000-8000-000000000059',id,'legend',1,3430,2350,355,182,0,14,7100 FROM seasons WHERE is_active=true
ON CONFLICT (user_id,season_id) DO UPDATE SET rank_tier=EXCLUDED.rank_tier,division=EXCLUDED.division,lp=EXCLUDED.lp,mmr=EXCLUDED.mmr,wins=EXCLUDED.wins,losses=EXCLUDED.losses;

INSERT INTO ranked_profiles (user_id,season_id,rank_tier,division,lp,mmr,wins,losses,win_streak,best_win_streak,season_points)
SELECT 'b0000060-0000-4000-8000-000000000060',id,'legend',1,3599,2500,380,188,5,18,7600 FROM seasons WHERE is_active=true
ON CONFLICT (user_id,season_id) DO UPDATE SET rank_tier=EXCLUDED.rank_tier,division=EXCLUDED.division,lp=EXCLUDED.lp,mmr=EXCLUDED.mmr,wins=EXCLUDED.wins,losses=EXCLUDED.losses;
