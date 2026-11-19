import { createClient, SupabaseClient } from '@supabase/supabase-js'

/**
 * Supabase Client for CivicSaarthi AI (Vite Architecture)
 *
 * Requirements:
 * 1. Reads public environment variables:
 *    - `VITE_SUPABASE_URL`: Project URL (e.g., https://your-project.supabase.co)
 *    - `VITE_SUPABASE_PUBLISHABLE_KEY`: Public anon/publishable key
 * 2. Validates configuration and provides meaningful, actionable errors when missing.
 * 3. Never exposes or accepts Supabase service-role keys in client code.
 * 4. Preserves Vite client single-page app architecture (NO Next.js files, NO SSR cookie helpers).
 */

const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL || '').trim()
const supabasePublishableKey = (
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  ''
).trim()

export interface SupabaseConfigValidation {
  isValid: boolean
  missingVars: string[]
  error: string | null
}

/**
 * Validates Supabase environment variables.
 * Returns detailed status and user-friendly error messages.
 */
export function validateSupabaseConfig(): SupabaseConfigValidation {
  const missingVars: string[] = []

  if (!supabaseUrl || supabaseUrl.includes('your-project-id')) {
    missingVars.push('VITE_SUPABASE_URL')
  }

  if (
    !supabasePublishableKey ||
    supabasePublishableKey.includes('your-supabase-publishable-key') ||
    supabasePublishableKey.includes('your-anon-key')
  ) {
    missingVars.push('VITE_SUPABASE_PUBLISHABLE_KEY')
  }

  if (missingVars.length > 0) {
    return {
      isValid: false,
      missingVars,
      error: `Missing required Supabase configuration: [${missingVars.join(
        ', '
      )}]. Please configure these variables in your .env.local file. See .env.example for template.`,
    }
  }

  if (!supabaseUrl.startsWith('https://')) {
    return {
      isValid: false,
      missingVars: ['VITE_SUPABASE_URL'],
      error: `Invalid VITE_SUPABASE_URL: "${supabaseUrl}". Supabase URL must begin with https://`,
    }
  }

  return {
    isValid: true,
    missingVars: [],
    error: null,
  }
}

const configValidation = validateSupabaseConfig()

export const isSupabaseConfigured: boolean = configValidation.isValid

export function getSupabaseConfigStatus() {
  return {
    isConfigured: isSupabaseConfigured,
    urlPresent: Boolean(supabaseUrl && !supabaseUrl.includes('your-project')),
    keyPresent: Boolean(
      supabasePublishableKey && !supabasePublishableKey.includes('your-supabase')
    ),
    message: isSupabaseConfigured
      ? 'Supabase client is configured and connected to project URL.'
      : (configValidation.error as string),
  }
}

// Ensure meaningful console warning in development if unconfigured
if (!isSupabaseConfigured && import.meta.env.DEV) {
  console.warn(
    `[CivicSaarthi AI] Supabase configuration warning: ${configValidation.error}`
  )
}

/**
 * Initialize the Supabase Client.
 * When environment variables are missing, a fallback dummy URL is used to prevent
 * Vite runtime import crashes, while guards (`isSupabaseConfigured`) warn the user.
 */
const safeUrl = isSupabaseConfigured
  ? supabaseUrl
  : 'https://placeholder-project.supabase.co'
const safeKey = isSupabaseConfigured
  ? supabasePublishableKey
  : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.dummy-publishable-key'

export const supabase: SupabaseClient = createClient(safeUrl, safeKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    flowType: 'pkce',
    storage: typeof window !== 'undefined' ? window.localStorage : undefined,
  },
})

/**
 * Returns the Supabase client if properly configured, or throws a meaningful error.
 */
export function getActiveSupabaseClient(): SupabaseClient {
  const validation = validateSupabaseConfig()
  if (!validation.isValid) {
    throw new Error(
      `[Supabase Client Error] Cannot access Supabase operations: ${validation.error}`
    )
  }
  return supabase
}
