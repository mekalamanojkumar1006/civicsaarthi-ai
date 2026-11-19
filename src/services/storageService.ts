import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import { dbService } from '@/services/dbService'
import type { CitizenDocument } from '@/types/supabase'

export const CITIZEN_DOCUMENTS_BUCKET = 'citizen-documents'
export const MAX_FILE_SIZE_BYTES = 15 * 1024 * 1024 // 15 MB limit
export const ALLOWED_MIME_TYPES = ['application/pdf', 'image/jpeg', 'image/png']
export const ALLOWED_EXTENSIONS = ['.pdf', '.jpg', '.jpeg', '.png']

export interface FileValidationResult {
  isValid: boolean
  error?: string
}

export interface StorageOperationResult<T = void> {
  success: boolean
  data?: T
  error?: string
}

/**
 * Validates citizen document file attributes:
 * - Maximum size 15 MB
 * - Permitted MIME types (application/pdf, image/jpeg, image/png)
 * - Permitted file extensions (.pdf, .jpg, .jpeg, .png)
 */
export function validateCitizenFile(file: File): FileValidationResult {
  if (!file) {
    return { isValid: false, error: 'No file selected for upload.' }
  }

  if (file.size === 0) {
    return {
      isValid: false,
      error: 'The selected file is empty (0 bytes). Please select a valid document.',
    }
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    const sizeMb = (file.size / (1024 * 1024)).toFixed(1)
    return {
      isValid: false,
      error: `File size (${sizeMb} MB) exceeds the maximum allowed limit of 15 MB.`,
    }
  }

  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    return {
      isValid: false,
      error: `Unsupported file type: "${file.type || 'unknown'}". Only PDF, JPEG, and PNG files are accepted.`,
    }
  }

  const dotIdx = file.name.lastIndexOf('.')
  if (dotIdx === -1) {
    return {
      isValid: false,
      error: 'File is missing an extension. Only .pdf, .jpg, .jpeg, and .png are permitted.',
    }
  }

  const ext = file.name.slice(dotIdx).toLowerCase()
  if (!ALLOWED_EXTENSIONS.includes(ext)) {
    return {
      isValid: false,
      error: `Unsupported file extension: "${ext}". Permitted extensions are .pdf, .jpg, .jpeg, and .png.`,
    }
  }

  return { isValid: true }
}

/**
 * Storage Service for CivicSaarthi AI.
 * Handles authenticated interactions with the private 'citizen-documents' bucket.
 * All paths strictly follow the user-isolated format: `${userId}/${unique_filename}`.
 */
export const storageService = {
  /**
   * Generates a collision-resistant, isolated storage path for an authenticated citizen:
   * Format: <user_id>/<timestamp>_<random>_<clean_filename>
   */
  getIsolatedPath(userId: string, fileName: string): string {
    const cleanFileName = fileName.replace(/[^a-zA-Z0-9._-]/g, '_')
    const timestamp = Date.now()
    const randomSuffix = Math.random().toString(36).substring(2, 8)
    return `${userId}/${timestamp}_${randomSuffix}_${cleanFileName}`
  },

  /**
   * Upload a citizen document into the private user folder and record metadata in PostgreSQL.
   * If metadata creation fails, the uploaded Storage object is automatically purged to prevent orphans.
   */
  async uploadAndRecordDocument({
    userId,
    file,
    documentCategory,
  }: {
    userId: string
    file: File
    documentCategory: string
  }): Promise<StorageOperationResult<CitizenDocument>> {
    if (!isSupabaseConfigured) {
      return {
        success: false,
        error: 'Supabase storage is not configured. Verify project credentials in .env.local.',
      }
    }

    const validation = validateCitizenFile(file)
    if (!validation.isValid) {
      return { success: false, error: validation.error }
    }

    const storagePath = this.getIsolatedPath(userId, file.name)

    // 1. Upload to Supabase Storage bucket
    const { error: uploadError } = await supabase.storage
      .from(CITIZEN_DOCUMENTS_BUCKET)
      .upload(storagePath, file, {
        cacheControl: '3600',
        upsert: false,
      })

    if (uploadError) {
      return {
        success: false,
        error: uploadError.message,
      }
    }

    // 2. Insert metadata record in public.citizen_documents
    const metaRes = await dbService.createDocumentMetadata(userId, {
      fileName: file.name,
      storagePath,
      documentType: documentCategory || file.type,
      fileSize: file.size,
    })

    if (!metaRes.success || !metaRes.data) {
      // Safe cleanup: Delete the uploaded Storage object to prevent orphaned storage blobs
      console.warn('[StorageService] Metadata insert failed, cleaning up orphaned file:', storagePath)
      await supabase.storage.from(CITIZEN_DOCUMENTS_BUCKET).remove([storagePath])
      return {
        success: false,
        error: metaRes.error || 'Failed to save document metadata in database.',
      }
    }

    return {
      success: true,
      data: metaRes.data,
    }
  },

  /**
   * Create a temporary, short-lived signed URL to view or download a private citizen document.
   * Never uses public URLs.
   * Default expiration: 300 seconds (5 minutes).
   */
  async createSignedUrl(
    storagePath: string,
    expiresInSeconds: number = 300
  ): Promise<StorageOperationResult<{ signedUrl: string }>> {
    if (!isSupabaseConfigured) {
      return {
        success: false,
        error: 'Supabase storage is not configured.',
      }
    }

    const { data, error } = await supabase.storage
      .from(CITIZEN_DOCUMENTS_BUCKET)
      .createSignedUrl(storagePath, expiresInSeconds)

    if (error || !data?.signedUrl) {
      return {
        success: false,
        error: error?.message || 'Failed to create signed URL for document preview.',
      }
    }

    return {
      success: true,
      data: { signedUrl: data.signedUrl },
    }
  },

  /**
   * Delete a document: safely removes both database metadata and Storage file.
   */
  async deleteDocumentAndMetadata({
    userId,
    documentId,
    storagePath,
  }: {
    userId: string
    documentId: string
    storagePath: string
  }): Promise<StorageOperationResult> {
    if (!isSupabaseConfigured) {
      return {
        success: false,
        error: 'Supabase storage is not configured.',
      }
    }

    // 1. Delete database metadata record
    const metaRes = await dbService.deleteDocumentMetadata(userId, documentId)
    if (!metaRes.success) {
      return {
        success: false,
        error: metaRes.error || 'Failed to delete document metadata from database.',
      }
    }

    // 2. Delete file from Storage bucket
    const { error: storageError } = await supabase.storage
      .from(CITIZEN_DOCUMENTS_BUCKET)
      .remove([storagePath])

    if (storageError) {
      console.warn('[StorageService] Storage file removal warning:', storageError.message)
    }

    return { success: true }
  },

  /**
   * Direct removal of a storage file by path.
   */
  async deleteDocument(storagePath: string): Promise<StorageOperationResult> {
    if (!isSupabaseConfigured) {
      return {
        success: false,
        error: 'Supabase storage is not configured.',
      }
    }

    const { error } = await supabase.storage
      .from(CITIZEN_DOCUMENTS_BUCKET)
      .remove([storagePath])

    if (error) {
      return {
        success: false,
        error: error.message,
      }
    }

    return { success: true }
  },
}
