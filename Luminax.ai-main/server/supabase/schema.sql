-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  username TEXT UNIQUE,
  email TEXT,
  bio TEXT,
  xp INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1,
  streak INTEGER DEFAULT 0,
  last_study_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create study_sessions table
CREATE TABLE IF NOT EXISTS study_sessions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  subject TEXT NOT NULL,
  duration_min INTEGER NOT NULL DEFAULT 0,
  notes TEXT,
  xp_earned INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create community_posts table
CREATE TABLE IF NOT EXISTS community_posts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  likes INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create quiz_results table
CREATE TABLE IF NOT EXISTS quiz_results (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  quiz_id TEXT NOT NULL,
  topic TEXT NOT NULL,
  score INTEGER NOT NULL,
  total_questions INTEGER NOT NULL,
  xp_earned INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create achievements table
CREATE TABLE IF NOT EXISTS achievements (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  achievement_type TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  xp_reward INTEGER DEFAULT 0,
  earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create daily_quests table
CREATE TABLE IF NOT EXISTS daily_quests (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  quest_type TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  target_value INTEGER NOT NULL,
  current_value INTEGER DEFAULT 0,
  xp_reward INTEGER DEFAULT 0,
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '1 day')
);

-- Create communities table
CREATE TABLE IF NOT EXISTS communities (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  member_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create community_members table
CREATE TABLE IF NOT EXISTS community_members (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  community_id UUID REFERENCES communities(id) ON DELETE CASCADE,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, community_id)
);

-- Function to increment XP
CREATE OR REPLACE FUNCTION increment_xp(p_user_id UUID, p_amount INTEGER)
RETURNS VOID AS $$
DECLARE
  current_xp INTEGER;
  new_level INTEGER;
BEGIN
  -- Update XP
  UPDATE profiles 
  SET xp = xp + p_amount,
      updated_at = NOW()
  WHERE id = p_user_id
  RETURNING xp INTO current_xp;
  
  -- Calculate new level (every 1000 XP = 1 level)
  new_level := (current_xp / 1000) + 1;
  
  -- Update level if changed
  UPDATE profiles 
  SET level = new_level
  WHERE id = p_user_id AND level < new_level;
END;
$$ LANGUAGE plpgsql;

-- Function to update study streak
CREATE OR REPLACE FUNCTION update_study_streak(p_user_id UUID)
RETURNS VOID AS $$
DECLARE
  last_study_date DATE;
  current_date DATE := CURRENT_DATE;
BEGIN
  SELECT last_study_date INTO last_study_date FROM profiles WHERE id = p_user_id;
  
  -- If first study or consecutive day, increment streak
  IF last_study_date IS NULL OR last_study_date = current_date - INTERVAL '1 day' THEN
    UPDATE profiles 
    SET streak = streak + 1,
        last_study_date = current_date,
        updated_at = NOW()
    WHERE id = p_user_id;
  -- If more than 1 day gap, reset streak
  ELSIF last_study_date < current_date - INTERVAL '1 day' THEN
    UPDATE profiles 
    SET streak = 1,
        last_study_date = current_date,
        updated_at = NOW()
    WHERE id = p_user_id;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Function to create daily quest
CREATE OR REPLACE FUNCTION create_daily_quest(p_user_id UUID, p_quest_type TEXT, p_title TEXT, p_description TEXT, p_target_value INTEGER, p_xp_reward INTEGER)
RETURNS UUID AS $$
DECLARE
  quest_id UUID;
BEGIN
  INSERT INTO daily_quests (user_id, quest_type, title, description, target_value, xp_reward)
  VALUES (p_user_id, p_quest_type, p_title, p_description, p_target_value, p_xp_reward)
  RETURNING id INTO quest_id;
  
  RETURN quest_id;
END;
$$ LANGUAGE plpgsql;

-- Row Level Security (RLS) Policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE study_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_quests ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_members ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view all profiles" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Study sessions policies
CREATE POLICY "Users can view own study sessions" ON study_sessions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own study sessions" ON study_sessions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own study sessions" ON study_sessions FOR UPDATE USING (auth.uid() = user_id);

-- Community posts policies
CREATE POLICY "Users can view all community posts" ON community_posts FOR SELECT USING (true);
CREATE POLICY "Users can insert own community posts" ON community_posts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own community posts" ON community_posts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own community posts" ON community_posts FOR DELETE USING (auth.uid() = user_id);

-- Quiz results policies
CREATE POLICY "Users can view own quiz results" ON quiz_results FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own quiz results" ON quiz_results FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Achievements policies
CREATE POLICY "Users can view own achievements" ON achievements FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own achievements" ON achievements FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Daily quests policies
CREATE POLICY "Users can view own daily quests" ON daily_quests FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own daily quests" ON daily_quests FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own daily quests" ON daily_quests FOR UPDATE USING (auth.uid() = user_id);

-- Community members policies
CREATE POLICY "Users can view community members" ON community_members FOR SELECT USING (true);
CREATE POLICY "Users can insert own community membership" ON community_members FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own community membership" ON community_members FOR DELETE USING (auth.uid() = user_id);

-- Communities policies
CREATE POLICY "Users can view all communities" ON communities FOR SELECT USING (true);

-- Insert default communities
INSERT INTO communities (name, description) VALUES 
  ('JEE Legends', 'For JEE aspirants'),
  ('Class 10 Champions', 'Class 10 students'),
  ('UPSC Titans', 'UPSC aspirants'),
  ('Class 8 Warriors', 'Class 8 students')
ON CONFLICT (name) DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_xp ON profiles(xp DESC);
CREATE INDEX IF NOT EXISTS idx_study_sessions_user_id ON study_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_study_sessions_created_at ON study_sessions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_community_posts_created_at ON community_posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_quiz_results_user_id ON quiz_results(user_id);
CREATE INDEX IF NOT EXISTS idx_daily_quests_user_id ON daily_quests(user_id);
CREATE INDEX IF NOT EXISTS idx_community_members_user_id ON community_members(user_id);
CREATE INDEX IF NOT EXISTS idx_community_members_community_id ON community_members(community_id);