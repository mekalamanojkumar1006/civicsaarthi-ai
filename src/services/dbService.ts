import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import type { Database, Profile, SavedScheme, EligibilityAssessment, CitizenDocument, Json } from '@/types/supabase'

export interface DbResult<T = void> {
  success: boolean
  data?: T
  error?: string
}

export interface DatabaseConnectionCheck {
  isConnected: boolean
  tablesExist: boolean
  status: 'connected' | 'schema_missing' | 'disconnected' | 'error'
  error?: string
  checkedAt: string
}

export const dbService = {
  /**
   * Check actual live Supabase database connection and table availability
   */
  async checkConnection(): Promise<DatabaseConnectionCheck> {
    const checkedAt = new Date().toISOString()
    if (!isSupabaseConfigured) {
      return {
        isConnected: false,
        tablesExist: false,
        status: 'disconnected',
        error: 'Supabase URL or Publishable Key is not configured.',
        checkedAt,
      }
    }

    try {
      // Query profiles table with limit 1 to verify table presence and read capability
      const { error } = await supabase.from('profiles').select('id').limit(1)

      if (error) {
        // PGRST205 indicates the PostgREST schema cache cannot find the table (table not created)
        if (error.code === 'PGRST205' || error.message.includes('Could not find the table')) {
          return {
            isConnected: true, // Instance reached and responded
            tablesExist: false,
            status: 'schema_missing',
            error: "PostgreSQL instance responded, but required table 'public.profiles' does not exist. Migrations have not been applied.",
            checkedAt,
          }
        }
        return {
          isConnected: false,
          tablesExist: false,
          status: 'error',
          error: error.message,
          checkedAt,
        }
      }

      return {
        isConnected: true,
        tablesExist: true,
        status: 'connected',
        checkedAt,
      }
    } catch (err: unknown) {
      return {
        isConnected: false,
        tablesExist: false,
        status: 'error',
        error: err instanceof Error ? err.message : 'Network error querying Supabase',
        checkedAt,
      }
    }
  },
  /**
   * Fetch profile for a user
   */
  async getProfile(userId: string): Promise<DbResult<Profile>> {
    if (!isSupabaseConfigured) {
      return { success: false, error: 'Supabase is not configured.' }
    }

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle()

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true, data: data || undefined }
  },

  /**
   * Update or create profile
   */
  async updateProfile(
    userId: string,
    updates: Partial<Database['public']['Tables']['profiles']['Update']>
  ): Promise<DbResult<Profile>> {
    if (!isSupabaseConfigured) {
      return { success: false, error: 'Supabase is not configured.' }
    }

    const { data, error } = await supabase
      .from('profiles')
      .upsert({
        id: userId,
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .select('*')
      .single()

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true, data }
  },

  /**
   * Fetch all saved schemes for authenticated user
   */
  async getSavedSchemes(userId: string): Promise<DbResult<SavedScheme[]>> {
    if (!isSupabaseConfigured) {
      return { success: false, error: 'Supabase is not configured.' }
    }

    const { data, error } = await supabase
      .from('saved_schemes')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true, data: data || [] }
  },

  /**
   * Save a scheme to user's saved list
   */
  async saveScheme(userId: string, schemeId: string): Promise<DbResult<SavedScheme>> {
    if (!isSupabaseConfigured) {
      return { success: false, error: 'Supabase is not configured.' }
    }

    const { data, error } = await supabase
      .from('saved_schemes')
      .insert({
        user_id: userId,
        scheme_id: schemeId,
      })
      .select('*')
      .single()

    if (error) {
      // Code 23505: PostgreSQL unique violation (already bookmarked). Treat as idempotent success.
      if (error.code === '23505') {
        return { success: true }
      }
      return { success: false, error: error.message }
    }

    return { success: true, data }
  },

  /**
   * Unsave a scheme
   */
  async unsaveScheme(userId: string, schemeId: string): Promise<DbResult> {
    if (!isSupabaseConfigured) {
      return { success: false, error: 'Supabase is not configured.' }
    }

    const { error } = await supabase
      .from('saved_schemes')
      .delete()
      .eq('user_id', userId)
      .eq('scheme_id', schemeId)

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true }
  },

  /**
   * Record an eligibility assessment result
   */
  async recordAssessment(
    userId: string,
    schemeId: string,
    assessmentData: Json,
    assessmentResult: Json
  ): Promise<DbResult<EligibilityAssessment>> {
    if (!isSupabaseConfigured) {
      return { success: false, error: 'Supabase is not configured.' }
    }

    const { data, error } = await supabase
      .from('eligibility_assessments')
      .insert({
        user_id: userId,
        scheme_id: schemeId,
        assessment_data: assessmentData,
        assessment_result: assessmentResult,
      })
      .select('*')
      .single()

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true, data }
  },

  /**
   * Fetch user's assessment history
   */
  async getAssessments(userId: string): Promise<DbResult<EligibilityAssessment[]>> {
    if (!isSupabaseConfigured) {
      return { success: false, error: 'Supabase is not configured.' }
    }

    const { data, error } = await supabase
      .from('eligibility_assessments')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true, data: data || [] }
  },

  /**
   * Delete an assessment record
   */
  async deleteAssessment(userId: string, assessmentId: string): Promise<DbResult> {
    if (!isSupabaseConfigured) {
      return { success: false, error: 'Supabase is not configured.' }
    }

    const { error } = await supabase
      .from('eligibility_assessments')
      .delete()
      .eq('user_id', userId)
      .eq('id', assessmentId)

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true }
  },

  /**
   * Record uploaded document metadata
   */
  async createDocumentMetadata(
    userId: string,
    metadata: {
      fileName: string
      storagePath: string
      documentType: string
      fileSize: number
    }
  ): Promise<DbResult<CitizenDocument>> {
    if (!isSupabaseConfigured) {
      return { success: false, error: 'Supabase is not configured.' }
    }

    const { data, error } = await supabase
      .from('citizen_documents')
      .insert({
        user_id: userId,
        file_name: metadata.fileName,
        storage_path: metadata.storagePath,
        document_type: metadata.documentType,
        file_size: metadata.fileSize,
      })
      .select('*')
      .single()

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true, data }
  },

  /**
   * Fetch citizen document records
   */
  async getDocuments(userId: string): Promise<DbResult<CitizenDocument[]>> {
    if (!isSupabaseConfigured) {
      return { success: false, error: 'Supabase is not configured.' }
    }

    const { data, error } = await supabase
      .from('citizen_documents')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true, data: data || [] }
  },

  /**
   * Delete a citizen document metadata record
   */
  async deleteDocumentMetadata(userId: string, documentId: string): Promise<DbResult> {
    if (!isSupabaseConfigured) {
      return { success: false, error: 'Supabase is not configured.' }
    }

    const { error } = await supabase
      .from('citizen_documents')
      .delete()
      .eq('user_id', userId)
      .eq('id', documentId)

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true }
  },
}
