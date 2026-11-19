/**
 * CivicSaarthi AI - Semantic Search & Document Chunking Service
 *
 * Implements sliding-window document chunking with page number preservation,
 * vector embedding generation (via Supabase Edge Function 'embed-chunks' / text-embedding-004),
 * and cosine similarity retrieval for RAG question answering.
 */

import { supabase, isSupabaseConfigured } from '@/lib/supabase'

export interface DocumentChunk {
  id?: string
  documentId: string
  userId?: string
  pageNumber: number
  chunkIndex: number
  content: string
  embedding?: number[]
}

export interface ChunkSearchResult {
  chunk: DocumentChunk
  similarity: number
  pageNumber: number
  clauseSnippet?: string
}

export interface ChunkingOptions {
  chunkSize?: number // default 600 characters
  chunkOverlap?: number // default 120 characters
}

/**
 * Splits extracted pages into overlapping chunks while preserving document ID and page numbers.
 */
export function chunkDocumentPages(
  documentId: string,
  pages: Array<{ pageNumber: number; text: string }>,
  options: ChunkingOptions = {}
): DocumentChunk[] {
  const chunkSize = options.chunkSize || 600
  const chunkOverlap = options.chunkOverlap || 120
  const chunks: DocumentChunk[] = []
  let globalChunkIndex = 0

  for (const page of pages) {
    const text = page.text.trim()
    if (!text) continue

    // If page text is smaller than chunk size, treat entire page as a single chunk
    if (text.length <= chunkSize) {
      chunks.push({
        documentId,
        pageNumber: page.pageNumber,
        chunkIndex: globalChunkIndex++,
        content: text,
      })
      continue
    }

    let start = 0
    while (start < text.length) {
      let end = start + chunkSize

      // Try to break at a natural sentence boundary (period, newline, or space)
      if (end < text.length) {
        const nextBreak = text.slice(start, end + 50).lastIndexOf('. ')
        if (nextBreak > chunkSize * 0.7) {
          end = start + nextBreak + 1
        }
      }

      const chunkContent = text.slice(start, end).trim()
      if (chunkContent.length > 20) {
        chunks.push({
          documentId,
          pageNumber: page.pageNumber,
          chunkIndex: globalChunkIndex++,
          content: chunkContent,
        })
      }

      start = end - chunkOverlap
      if (start >= text.length - 20) break
    }
  }

  return chunks
}

/**
 * Calculates cosine similarity between two vector arrays.
 */
export function cosineSimilarity(vecA: number[], vecB: number[]): number {
  if (!vecA || !vecB || vecA.length !== vecB.length) return 0
  let dotProduct = 0
  let normA = 0
  let normB = 0
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i]
    normA += vecA[i] * vecA[i]
    normB += vecB[i] * vecB[i]
  }
  if (normA === 0 || normB === 0) return 0
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB))
}

/**
 * Computes deterministic token frequency embeddings (768-d hashed vector)
 * used for client-side semantic matching when backend API is in offline/demo mode.
 */
export function computeFallbackEmbedding(text: string, dimensions = 768): number[] {
  const vector = new Array(dimensions).fill(0)
  const words = text.toLowerCase().replace(/[^\w\s]/g, '').split(/\s+/)

  for (const word of words) {
    if (!word) continue
    // Simple 32-bit FNV-1a hash
    let hash = 2166136261
    for (let i = 0; i < word.length; i++) {
      hash ^= word.charCodeAt(i)
      hash = Math.imul(hash, 16777619)
    }
    const idx = Math.abs(hash) % dimensions
    vector[idx] += 1
  }

  // Normalize
  const norm = Math.sqrt(vector.reduce((sum, val) => sum + val * val, 0))
  if (norm > 0) {
    for (let i = 0; i < dimensions; i++) {
      vector[i] /= norm
    }
  }
  return vector
}

/**
 * Generates vector embeddings for a list of text strings.
 * Attempts Supabase Edge Function 'embed-chunks' first, falling back to deterministic local embeddings.
 */
export async function getEmbeddings(texts: string[]): Promise<number[][]> {
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase.functions.invoke('embed-chunks', {
        body: { texts },
      })
      if (!error && data && data.success && Array.isArray(data.embeddings)) {
        return data.embeddings
      }
    } catch {
      // Fallback
    }
  }

  return texts.map((t) => computeFallbackEmbedding(t))
}

/**
 * Searches chunks for the best match to a user query.
 */
export async function searchDocumentChunks(
  query: string,
  chunks: DocumentChunk[],
  topK = 3
): Promise<ChunkSearchResult[]> {
  if (!chunks || chunks.length === 0) return []

  // Compute query embedding
  const queryEmbeddings = await getEmbeddings([query])
  const queryVec = queryEmbeddings[0]

  // Ensure chunks have embeddings
  const results: ChunkSearchResult[] = []
  for (const chunk of chunks) {
    if (!chunk.embedding || chunk.embedding.length === 0) {
      chunk.embedding = computeFallbackEmbedding(chunk.content)
    }
    const similarity = cosineSimilarity(queryVec, chunk.embedding)
    results.push({
      chunk,
      similarity,
      pageNumber: chunk.pageNumber,
      clauseSnippet: chunk.content.slice(0, 140) + '...',
    })
  }

  // Sort descending by similarity
  results.sort((a, b) => b.similarity - a.similarity)
  return results.slice(0, topK)
}
