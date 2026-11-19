-- ==============================================================================
-- CivicSaarthi AI – Stage 4.2 Citizen Profiles & Row Level Security
-- Migration: 20261119000004_citizen_profiles.sql
-- Description: Creates the public.profiles table, triggers for auto-creation
--              on user signup, timestamp updating, and strict Row Level Security (RLS).
-- ==============================================================================

-- 1. Helper Function: Automatic updated_at timestamp (Hardened)
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  NEW.updated_at = pg_catalog.now();
  RETURN NEW;
END;
$$;

-- 2. Create Profiles Table
-- Maps 1:1 with auth.users(id)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  phone TEXT,
  date_of_birth DATE,
  state TEXT,
  district TEXT,
  preferred_language TEXT DEFAULT 'en',
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Index on id for fast lookups (though primary key is already indexed)
CREATE INDEX IF NOT EXISTS idx_profiles_id ON public.profiles(id);

-- 3. Trigger for automatic updated_at updates
DROP TRIGGER IF EXISTS set_profiles_updated_at ON public.profiles;
CREATE TRIGGER set_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- 4. Trigger Function: Automatically create profile on citizen signup in auth.users (Hardened)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles AS current_profile (
    id,
    full_name,
    phone,
    state,
    district,
    preferred_language
  )
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'phone', ''),
    COALESCE(NEW.raw_user_meta_data->>'state', ''),
    COALESCE(NEW.raw_user_meta_data->>'district', ''),
    COALESCE(NEW.raw_user_meta_data->>'preferred_language', 'en')
  )
  ON CONFLICT (id) DO UPDATE SET
    full_name = CASE 
      WHEN EXCLUDED.full_name <> '' THEN EXCLUDED.full_name 
      ELSE current_profile.full_name 
    END,
    phone = CASE 
      WHEN EXCLUDED.phone <> '' THEN EXCLUDED.phone 
      ELSE current_profile.phone 
    END,
    state = CASE 
      WHEN EXCLUDED.state <> '' THEN EXCLUDED.state 
      ELSE current_profile.state 
    END,
    district = CASE 
      WHEN EXCLUDED.district <> '' THEN EXCLUDED.district 
      ELSE current_profile.district 
    END,
    preferred_language = COALESCE(EXCLUDED.preferred_language, current_profile.preferred_language),
    updated_at = pg_catalog.now();
  RETURN NEW;
END;
$$;

-- Bind trigger to auth.users after insert
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- 5. Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 6. RLS Policies: Ensure users can ONLY read and update their own profile
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;

CREATE POLICY "Users can view own profile"
  ON public.profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON public.profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);
