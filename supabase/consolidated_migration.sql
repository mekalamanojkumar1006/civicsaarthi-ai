-- ==============================================================================
-- CivicSaarthi AI – Consolidated Production Database Migration
-- Version: 1.0.2 (Standard COALESCE Expressions, Target Table Alias & Security Hardening)
-- Target: Supabase PostgreSQL (Execute in Supabase Dashboard SQL Editor)
-- Description:
--   1. Functions: handle_updated_at(), handle_new_user() (Hardened with search_path = '')
--   2. Tables: profiles, saved_schemes, eligibility_assessments, citizen_documents
--   3. Indexes: Performance indexes on primary/foreign keys and lookup columns
--   4. Triggers: Timestamp updates and automatic citizen profile provisioning on signup
--   5. Row Level Security (RLS): Enabled on all public tables
--   6. RLS Policies: Strict user isolation enforcing auth.uid()
--   7. Storage: Private 'citizen-documents' bucket with path convention <auth_user_id>/<filename>
-- ==============================================================================

-- ── 1. HELPER FUNCTIONS ───────────────────────────────────────────────────────

-- Function: Automatic updated_at timestamp maintenance (Hardened)
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

-- ── 2. TABLES CREATION ────────────────────────────────────────────────────────

-- Table: public.profiles (Citizen Profiles linked 1:1 with auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  phone TEXT,
  date_of_birth DATE,
  state TEXT,
  district TEXT,
  preferred_language TEXT DEFAULT 'en',
  created_at TIMESTAMPTZ DEFAULT pg_catalog.now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT pg_catalog.now() NOT NULL
);

-- Table: public.saved_schemes (Citizen-bookmarked welfare schemes)
CREATE TABLE IF NOT EXISTS public.saved_schemes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  scheme_id TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT pg_catalog.now() NOT NULL,
  CONSTRAINT saved_schemes_user_scheme_unique UNIQUE (user_id, scheme_id)
);

-- Table: public.eligibility_assessments (Recorded scheme qualification assessments)
CREATE TABLE IF NOT EXISTS public.eligibility_assessments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  scheme_id TEXT NOT NULL,
  assessment_data JSONB NOT NULL DEFAULT '{}'::jsonb,
  assessment_result JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT pg_catalog.now() NOT NULL
);

-- Table: public.citizen_documents (Metadata for citizen files stored in Supabase Storage)
CREATE TABLE IF NOT EXISTS public.citizen_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  storage_path TEXT NOT NULL,
  document_type TEXT NOT NULL,
  file_size BIGINT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT pg_catalog.now() NOT NULL
);

-- ── 3. PERFORMANCE INDEXES ────────────────────────────────────────────────────

CREATE INDEX IF NOT EXISTS idx_profiles_id ON public.profiles(id);
CREATE INDEX IF NOT EXISTS idx_saved_schemes_user_id ON public.saved_schemes(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_schemes_scheme_id ON public.saved_schemes(scheme_id);
CREATE INDEX IF NOT EXISTS idx_eligibility_assessments_user_id ON public.eligibility_assessments(user_id);
CREATE INDEX IF NOT EXISTS idx_citizen_documents_user_id ON public.citizen_documents(user_id);

-- ── 4. TRIGGERS & AUTO-PROVISIONING ──────────────────────────────────────────

-- Trigger: Automatically update updated_at on public.profiles
DROP TRIGGER IF EXISTS set_profiles_updated_at ON public.profiles;
CREATE TRIGGER set_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Function: Automatically create or update citizen profile on auth.users signup (Hardened)
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

-- Trigger: Bind handle_new_user() to auth.users after insert
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ── 5. ROW LEVEL SECURITY (RLS) ENABLEMENT ────────────────────────────────────

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_schemes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.eligibility_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.citizen_documents ENABLE ROW LEVEL SECURITY;

-- ── 6. ROW LEVEL SECURITY (RLS) POLICIES ──────────────────────────────────────

-- 6A. Policies: public.profiles
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

-- 6B. Policies: public.saved_schemes
DROP POLICY IF EXISTS "Users can view own saved schemes" ON public.saved_schemes;
DROP POLICY IF EXISTS "Users can insert own saved schemes" ON public.saved_schemes;
DROP POLICY IF EXISTS "Users can delete own saved schemes" ON public.saved_schemes;

CREATE POLICY "Users can view own saved schemes"
  ON public.saved_schemes
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own saved schemes"
  ON public.saved_schemes
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own saved schemes"
  ON public.saved_schemes
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- 6C. Policies: public.eligibility_assessments
DROP POLICY IF EXISTS "Users can view own assessments" ON public.eligibility_assessments;
DROP POLICY IF EXISTS "Users can insert own assessments" ON public.eligibility_assessments;
DROP POLICY IF EXISTS "Users can delete own assessments" ON public.eligibility_assessments;

CREATE POLICY "Users can view own assessments"
  ON public.eligibility_assessments
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own assessments"
  ON public.eligibility_assessments
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own assessments"
  ON public.eligibility_assessments
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- 6D. Policies: public.citizen_documents
DROP POLICY IF EXISTS "Users can view own documents" ON public.citizen_documents;
DROP POLICY IF EXISTS "Users can insert own documents" ON public.citizen_documents;
DROP POLICY IF EXISTS "Users can update own documents" ON public.citizen_documents;
DROP POLICY IF EXISTS "Users can delete own documents" ON public.citizen_documents;

CREATE POLICY "Users can view own documents"
  ON public.citizen_documents
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own documents"
  ON public.citizen_documents
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own documents"
  ON public.citizen_documents
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own documents"
  ON public.citizen_documents
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- ── 7. STORAGE BUCKET & OBJECT SECURITY POLICIES ──────────────────────────────

-- Create private 'citizen-documents' storage bucket
-- Bucket Name: citizen-documents
-- Object Path Convention: <auth_user_id>/<filename>
-- Access: Strictly private; access requires valid authenticated user JWT matching folder name
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'citizen-documents',
  'citizen-documents',
  false,
  15728640, -- 15MB file size limit
  ARRAY['application/pdf', 'image/jpeg', 'image/png']
)
ON CONFLICT (id) DO UPDATE SET
  public = false,
  file_size_limit = 15728640,
  allowed_mime_types = ARRAY['application/pdf', 'image/jpeg', 'image/png'];

-- Storage RLS policies for storage.objects
-- Strictly enforces folder isolation: object path must be <auth_user_id>/<filename>
-- (storage.foldername(name))[1] evaluates to the top-level folder name and must match auth.uid()::text
DROP POLICY IF EXISTS "Authenticated users can read own documents" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload own documents" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update own documents" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete own documents" ON storage.objects;

-- Storage Read Policy: user can only download/view files in their own <auth_user_id>/ folder
CREATE POLICY "Authenticated users can read own documents"
  ON storage.objects
  FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'citizen-documents'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- Storage Upload Policy: user can only upload files into their own <auth_user_id>/ folder
CREATE POLICY "Authenticated users can upload own documents"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'citizen-documents'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- Storage Update Policy: user can only modify files in their own <auth_user_id>/ folder
CREATE POLICY "Authenticated users can update own documents"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'citizen-documents'
    AND (storage.foldername(name))[1] = auth.uid()::text
  )
  WITH CHECK (
    bucket_id = 'citizen-documents'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- Storage Delete Policy: user can only delete files in their own <auth_user_id>/ folder
CREATE POLICY "Authenticated users can delete own documents"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'citizen-documents'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );
