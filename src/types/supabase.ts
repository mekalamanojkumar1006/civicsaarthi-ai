/**
 * Database definitions for CivicSaarthi AI Supabase Schema.
 * Mirrors the PostgreSQL tables defined in supabase/migrations/.
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          full_name: string | null
          phone: string | null
          date_of_birth: string | null
          state: string | null
          district: string | null
          preferred_language: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          full_name?: string | null
          phone?: string | null
          date_of_birth?: string | null
          state?: string | null
          district?: string | null
          preferred_language?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          full_name?: string | null
          phone?: string | null
          date_of_birth?: string | null
          state?: string | null
          district?: string | null
          preferred_language?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'profiles_id_fkey'
            columns: ['id']
            referencedRelation: 'users'
            referencedColumns: ['id']
          }
        ]
      }
      saved_schemes: {
        Row: {
          id: string
          user_id: string
          scheme_id: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          scheme_id: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          scheme_id?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'saved_schemes_user_id_fkey'
            columns: ['user_id']
            referencedRelation: 'users'
            referencedColumns: ['id']
          }
        ]
      }
      eligibility_assessments: {
        Row: {
          id: string
          user_id: string
          scheme_id: string
          assessment_data: Json
          assessment_result: Json
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          scheme_id: string
          assessment_data?: Json
          assessment_result?: Json
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          scheme_id?: string
          assessment_data?: Json
          assessment_result?: Json
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'eligibility_assessments_user_id_fkey'
            columns: ['user_id']
            referencedRelation: 'users'
            referencedColumns: ['id']
          }
        ]
      }
      citizen_documents: {
        Row: {
          id: string
          user_id: string
          file_name: string
          storage_path: string
          document_type: string
          file_size: number
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          file_name: string
          storage_path: string
          document_type: string
          file_size: number
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          file_name?: string
          storage_path?: string
          document_type?: string
          file_size?: number
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'citizen_documents_user_id_fkey'
            columns: ['user_id']
            referencedRelation: 'users'
            referencedColumns: ['id']
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type Profile = Database['public']['Tables']['profiles']['Row']
export type SavedScheme = Database['public']['Tables']['saved_schemes']['Row']
export type EligibilityAssessment = Database['public']['Tables']['eligibility_assessments']['Row']
export type CitizenDocument = Database['public']['Tables']['citizen_documents']['Row']
