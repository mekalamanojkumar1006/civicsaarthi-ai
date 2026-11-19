-- CivicSaarthi AI - Migration 000005: Document Chunks, Vector Embeddings & Similarity Search
-- Enables pgvector extension, provisions public.document_chunks table, and enforces strict RLS.

-- 1. Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector WITH SCHEMA extensions;

-- 2. Create document_chunks table
CREATE TABLE IF NOT EXISTS public.document_chunks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_id UUID NOT NULL REFERENCES public.citizen_documents(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    page_number INTEGER NOT NULL DEFAULT 1,
    chunk_index INTEGER NOT NULL DEFAULT 0,
    content TEXT NOT NULL,
    embedding extensions.vector(768),
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT pg_catalog.now()
);

-- 3. Create indexes for foreign keys, user isolation, and cosine similarity
CREATE INDEX IF NOT EXISTS idx_document_chunks_document_id ON public.document_chunks(document_id);
CREATE INDEX IF NOT EXISTS idx_document_chunks_user_id ON public.document_chunks(user_id);
CREATE INDEX IF NOT EXISTS idx_document_chunks_embedding ON public.document_chunks USING ivfflat (embedding extensions.vector_cosine_ops) WITH (lists = 100);

-- 4. Enable Row Level Security
ALTER TABLE public.document_chunks ENABLE ROW LEVEL SECURITY;

-- 5. Row Level Security Policies
CREATE POLICY "Users can view own document chunks"
    ON public.document_chunks
    FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own document chunks"
    ON public.document_chunks
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own document chunks"
    ON public.document_chunks
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own document chunks"
    ON public.document_chunks
    FOR DELETE
    TO authenticated
    USING (auth.uid() = user_id);

-- 6. RPC Function for similarity search with user isolation
CREATE OR REPLACE FUNCTION public.match_document_chunks(
    query_embedding extensions.vector(768),
    match_threshold FLOAT DEFAULT 0.5,
    match_count INT DEFAULT 5,
    target_document_id UUID DEFAULT NULL
)
RETURNS TABLE (
    id UUID,
    document_id UUID,
    page_number INT,
    chunk_index INT,
    content TEXT,
    similarity FLOAT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
    RETURN QUERY
    SELECT
        dc.id,
        dc.document_id,
        dc.page_number,
        dc.chunk_index,
        dc.content,
        1 - (dc.embedding extensions.<=> query_embedding) AS similarity
    FROM public.document_chunks dc
    WHERE dc.user_id = auth.uid()
      AND (target_document_id IS NULL OR dc.document_id = target_document_id)
      AND (1 - (dc.embedding extensions.<=> query_embedding)) > match_threshold
    ORDER BY dc.embedding extensions.<=> query_embedding
    LIMIT match_count;
END;
$$;
