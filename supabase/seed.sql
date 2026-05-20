-- ============================================================
-- AthLead Seed Data
-- Run AFTER schema.sql
-- ============================================================

-- ── Coaches ──────────────────────────────────────────────────

-- Iowa Wrestling
INSERT INTO coaches (school_id, sport_id, name, title, years_at_school) VALUES
  ('iowa', 'wrestling', 'Tom Brands', 'Head Coach', 18),
  ('iowa', 'wrestling', 'Terry Brands', 'Associate Head Coach', 18),
  ('iowa', 'wrestling', 'Ryan Morningstar', 'Assistant Coach', 8)
ON CONFLICT DO NOTHING;

-- Iowa Track & Field
INSERT INTO coaches (school_id, sport_id, name, title, years_at_school) VALUES
  ('iowa', 'mens-track', 'Joey Woody', 'Head Coach', 14),
  ('iowa', 'womens-track', 'Joey Woody', 'Head Coach', 14)
ON CONFLICT DO NOTHING;

-- Iowa Football
INSERT INTO coaches (school_id, sport_id, name, title, years_at_school) VALUES
  ('iowa', 'football', 'Kirk Ferentz', 'Head Coach', 26),
  ('iowa', 'football', 'Brian Ferentz', 'Offensive Coordinator', 12),
  ('iowa', 'football', 'Phil Parker', 'Defensive Coordinator', 13)
ON CONFLICT DO NOTHING;

-- Michigan Football
INSERT INTO coaches (school_id, sport_id, name, title, years_at_school) VALUES
  ('michigan', 'football', 'Sherrone Moore', 'Head Coach', 2),
  ('michigan', 'football', 'Kirk Campbell', 'Offensive Coordinator', 2)
ON CONFLICT DO NOTHING;

-- Ohio State Football
INSERT INTO coaches (school_id, sport_id, name, title, years_at_school) VALUES
  ('ohio-state', 'football', 'Ryan Day', 'Head Coach', 6),
  ('ohio-state', 'football', 'Chip Kelly', 'Offensive Coordinator', 1)
ON CONFLICT DO NOTHING;

-- Oregon Track & Field
INSERT INTO coaches (school_id, sport_id, name, title, years_at_school) VALUES
  ('oregon', 'mens-track', 'Robert Johnson', 'Head Coach', 10),
  ('oregon', 'womens-track', 'Robert Johnson', 'Head Coach', 10)
ON CONFLICT DO NOTHING;

-- Penn State Wrestling
INSERT INTO coaches (school_id, sport_id, name, title, years_at_school) VALUES
  ('penn-state', 'wrestling', 'Cael Sanderson', 'Head Coach', 15),
  ('penn-state', 'wrestling', 'Cody Sanderson', 'Associate Head Coach', 12)
ON CONFLICT DO NOTHING;

-- Nebraska Volleyball
INSERT INTO coaches (school_id, sport_id, name, title, years_at_school) VALUES
  ('nebraska', 'volleyball', 'John Cook', 'Head Coach', 25),
  ('nebraska', 'volleyball', 'Kayla Banwarth', 'Associate Head Coach', 4)
ON CONFLICT DO NOTHING;

-- Wisconsin Men's Basketball
INSERT INTO coaches (school_id, sport_id, name, title, years_at_school) VALUES
  ('wisconsin', 'mens-basketball', 'Greg Gard', 'Head Coach', 9),
  ('wisconsin', 'mens-basketball', 'Howard Moore', 'Associate Head Coach', 8)
ON CONFLICT DO NOTHING;

-- Purdue Men's Basketball
INSERT INTO coaches (school_id, sport_id, name, title, years_at_school) VALUES
  ('purdue', 'mens-basketball', 'Matt Painter', 'Head Coach', 20),
  ('purdue', 'mens-basketball', 'Brandon Brantley', 'Associate Head Coach', 5)
ON CONFLICT DO NOTHING;


-- ── Sample Reviews (uses a placeholder UUID for author_id) ───
-- NOTE: These are demo reviews. In production, author_id must reference a real auth.users row.
-- To add real seed reviews, sign up a test user first and use their UUID below.

-- Uncomment and replace <YOUR_USER_UUID> after creating a test account:
/*
INSERT INTO reviews (
  school_id, sport_id, author_id, author_name,
  rating_coaching, rating_culture, rating_facilities,
  rating_development, rating_nil, rating_overall,
  review_text, is_verified
) VALUES
  (
    'iowa', 'wrestling',
    '<YOUR_USER_UUID>',
    'Former Hawkeye',
    5.0, 4.5, 4.0, 5.0, 3.0, 4.5,
    'Tom Brands pushes you to your absolute limit. The culture is winning-first but it breeds champions. Facilities got a big upgrade in 2023. NIL is behind some other programs but improving.',
    true
  ),
  (
    'penn-state', 'wrestling',
    '<YOUR_USER_UUID>',
    'PSU Wrestler',
    5.0, 5.0, 5.0, 5.0, 4.0, 5.0,
    'Cael has built the gold standard in college wrestling. The brotherhood here is unreal and the facilities are second to none. If you want to be the best, there is no better place.',
    true
  ),
  (
    'michigan', 'football',
    '<YOUR_USER_UUID>',
    'Michigan OL',
    4.0, 4.5, 4.5, 4.0, 4.0, 4.2,
    'Great facilities and incredible fan support. The Big House atmosphere on game day is unlike anything else in college football. Coaching transition has been smooth.',
    false
  );
*/
