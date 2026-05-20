-- ============================================================
-- AthLead Database Schema
-- Run in Supabase SQL Editor
-- ============================================================

-- ── coaches ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS coaches (
  id           UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  school_id    TEXT NOT NULL,
  sport_id     TEXT NOT NULL,
  name         TEXT NOT NULL,
  title        TEXT NOT NULL,
  bio          TEXT,
  photo_url    TEXT,
  years_at_school INTEGER,
  created_at   TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_coaches_school_sport ON coaches (school_id, sport_id);

ALTER TABLE coaches ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read coaches"
  ON coaches FOR SELECT USING (true);

CREATE POLICY "Authenticated can insert coaches"
  ON coaches FOR INSERT TO authenticated WITH CHECK (true);


-- ── reviews ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS reviews (
  id                UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  school_id         TEXT NOT NULL,
  sport_id          TEXT NOT NULL,
  author_id         UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  author_name       TEXT,
  rating_coaching   NUMERIC(3,1) NOT NULL CHECK (rating_coaching BETWEEN 1 AND 5),
  rating_culture    NUMERIC(3,1) NOT NULL CHECK (rating_culture BETWEEN 1 AND 5),
  rating_facilities NUMERIC(3,1) NOT NULL CHECK (rating_facilities BETWEEN 1 AND 5),
  rating_development NUMERIC(3,1) NOT NULL CHECK (rating_development BETWEEN 1 AND 5),
  rating_nil        NUMERIC(3,1) NOT NULL CHECK (rating_nil BETWEEN 1 AND 5),
  rating_overall    NUMERIC(3,1) NOT NULL CHECK (rating_overall BETWEEN 1 AND 5),
  review_text       TEXT NOT NULL,
  is_verified       BOOLEAN DEFAULT false,
  created_at        TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_reviews_school_sport ON reviews (school_id, sport_id);
CREATE INDEX IF NOT EXISTS idx_reviews_author ON reviews (author_id);
CREATE INDEX IF NOT EXISTS idx_reviews_created ON reviews (created_at DESC);

ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read reviews"
  ON reviews FOR SELECT USING (true);

CREATE POLICY "Authenticated can insert own reviews"
  ON reviews FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Authors can update own reviews"
  ON reviews FOR UPDATE TO authenticated
  USING (auth.uid() = author_id);

CREATE POLICY "Authors can delete own reviews"
  ON reviews FOR DELETE TO authenticated
  USING (auth.uid() = author_id);


-- ── roster_athletes ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS roster_athletes (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  school_slug   TEXT NOT NULL,
  school_name   TEXT NOT NULL,
  sport_slug    TEXT NOT NULL,
  sport_name    TEXT NOT NULL,
  first_name    TEXT NOT NULL,
  last_name     TEXT NOT NULL,
  full_name     TEXT NOT NULL,
  jersey_number TEXT,
  position      TEXT,
  year_class    TEXT,
  roster_url    TEXT NOT NULL,
  scraped_at    TIMESTAMPTZ DEFAULT now(),
  season        TEXT NOT NULL DEFAULT '2025-26',

  UNIQUE (school_slug, sport_slug, first_name, last_name, season)
);

CREATE INDEX IF NOT EXISTS idx_roster_school_sport ON roster_athletes (school_slug, sport_slug);
CREATE INDEX IF NOT EXISTS idx_roster_name_lookup ON roster_athletes (LOWER(last_name), LOWER(first_name));
CREATE INDEX IF NOT EXISTS idx_roster_season ON roster_athletes (season);

ALTER TABLE roster_athletes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read roster athletes"
  ON roster_athletes FOR SELECT USING (true);

CREATE POLICY "Service role can manage roster athletes"
  ON roster_athletes FOR ALL USING (auth.role() = 'service_role');


-- ── program_stats (materialized view) ────────────────────────
CREATE OR REPLACE VIEW program_stats AS
SELECT
  school_id,
  sport_id,
  COUNT(*)                            AS review_count,
  ROUND(AVG(rating_coaching), 2)      AS avg_coaching,
  ROUND(AVG(rating_culture), 2)       AS avg_culture,
  ROUND(AVG(rating_facilities), 2)    AS avg_facilities,
  ROUND(AVG(rating_development), 2)   AS avg_development,
  ROUND(AVG(rating_nil), 2)           AS avg_nil,
  ROUND(AVG(rating_overall), 2)       AS avg_overall
FROM reviews
GROUP BY school_id, sport_id;
