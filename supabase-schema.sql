-- Golf Live - Supabase Schema
-- Run this in the Supabase SQL Editor

CREATE TABLE competitions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL DEFAULT 'Championnat de France',
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  team_name TEXT NOT NULL,
  opponent_name TEXT NOT NULL,
  admin_pin TEXT NOT NULL DEFAULT '1234',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE matches (
  id SERIAL PRIMARY KEY,
  competition_id UUID REFERENCES competitions(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('double', 'simple')),
  position INT NOT NULL,
  player_name TEXT NOT NULL DEFAULT '',
  opponent_name TEXT NOT NULL DEFAULT '',
  score INT DEFAULT 0,
  thru INT DEFAULT 0,
  status TEXT DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'finished')),
  result TEXT DEFAULT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_matches_competition ON matches(competition_id);
CREATE INDEX idx_competitions_code ON competitions(code);

ALTER PUBLICATION supabase_realtime ADD TABLE matches;
ALTER PUBLICATION supabase_realtime ADD TABLE competitions;

ALTER TABLE competitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all operations" ON competitions FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations" ON matches FOR ALL USING (true) WITH CHECK (true);
