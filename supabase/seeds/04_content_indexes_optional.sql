-- Optional Performance Indexes
-- Safe to run multiple times (CREATE INDEX IF NOT EXISTS)

CREATE INDEX IF NOT EXISTS idx_ranked_questions_type ON ranked_questions (type) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_ranked_questions_category ON ranked_questions (category) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_ranked_questions_difficulty ON ranked_questions (difficulty) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_profiles_is_bot ON profiles (is_bot) WHERE is_bot = true;
CREATE INDEX IF NOT EXISTS idx_ranked_profiles_rank_tier ON ranked_profiles (rank_tier);
CREATE INDEX IF NOT EXISTS idx_ranked_profiles_mmr ON ranked_profiles (mmr DESC);
CREATE INDEX IF NOT EXISTS idx_party_questions_mode ON party_questions (mode) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_party_questions_category ON party_questions (category) WHERE is_active = true;
