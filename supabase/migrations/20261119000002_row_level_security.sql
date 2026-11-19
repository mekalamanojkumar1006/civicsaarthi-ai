-- ==============================================================================
-- CivicSaarthi AI – Row Level Security (RLS) Policies
-- Migration: 20261119000002_row_level_security.sql
-- Description: Strict user-isolation policies across all public tables.
-- ==============================================================================

-- ── 1. Enable RLS on All User-Owned Tables ────────────────────────────────────
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_schemes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.eligibility_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.citizen_documents ENABLE ROW LEVEL SECURITY;

-- ── 2. Policies: profiles ─────────────────────────────────────────────────────
-- Drop existing policies if any to ensure clean idempotency
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

-- ── 3. Policies: saved_schemes ────────────────────────────────────────────────
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

-- ── 4. Policies: eligibility_assessments ──────────────────────────────────────
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

-- ── 5. Policies: citizen_documents ────────────────────────────────────────────
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
