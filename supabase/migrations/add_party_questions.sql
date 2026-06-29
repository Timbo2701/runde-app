-- Migration: add_party_questions
-- Creates the party_questions table for all 5 party game modes.
-- Safe to run multiple times (IF NOT EXISTS).

CREATE TABLE IF NOT EXISTS party_questions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  mode text NOT NULL,
  category text,
  prompt text NOT NULL,
  options jsonb,
  correct_answer jsonb,
  numeric_answer numeric,
  difficulty integer DEFAULT 1,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE party_questions ENABLE ROW LEVEL SECURITY;

-- Allow public read access (questions are not sensitive data)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'party_questions'
      AND policyname = 'Party questions are publicly readable'
  ) THEN
    CREATE POLICY "Party questions are publicly readable"
      ON party_questions FOR SELECT USING (true);
  END IF;
END
$$;

CREATE INDEX IF NOT EXISTS idx_party_questions_mode ON party_questions (mode) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_party_questions_category ON party_questions (category) WHERE is_active = true;
