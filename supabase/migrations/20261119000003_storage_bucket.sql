-- ==============================================================================
-- CivicSaarthi AI – Storage Bucket & Security Policies
-- Migration: 20261119000003_storage_bucket.sql
-- Description: Private storage bucket 'citizen-documents' with strict user-folder
--              isolation policies. Path format: <auth_user_id>/<filename>
-- ==============================================================================

-- 1. Create Private Storage Bucket
-- 'public' is strictly false to ensure documents cannot be accessed via unauthenticated public URLs.
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

-- 2. Storage RLS Policies for 'citizen-documents' bucket
-- Storage objects table: storage.objects
-- Folder isolation logic: (storage.foldername(name))[1] must match the authenticated user's ID.

DROP POLICY IF EXISTS "Authenticated users can read own documents" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload own documents" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update own documents" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete own documents" ON storage.objects;

-- Read policy: users can only download/view files in their own folder
CREATE POLICY "Authenticated users can read own documents"
  ON storage.objects
  FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'citizen-documents'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- Upload policy: users can only upload files where the first folder segment is their own auth.uid()
CREATE POLICY "Authenticated users can upload own documents"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'citizen-documents'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- Update policy: users can only modify/replace files in their own folder
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

-- Delete policy: users can only delete files in their own folder
CREATE POLICY "Authenticated users can delete own documents"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'citizen-documents'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );
