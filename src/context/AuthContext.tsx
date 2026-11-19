import React, { createContext, useContext, useEffect, useState } from 'react'
import type { User, Session } from '@supabase/supabase-js'
import { supabase, isSupabaseConfigured, getSupabaseConfigStatus } from '@/lib/supabase'
import type { Profile } from '@/types/supabase'

export interface SignUpData {
  email: string
  password: string
  fullName: string
  phone?: string
  dateOfBirth?: string
  state?: string
  district?: string
  preferredLanguage?: string
}

export interface SignInData {
  email: string
  password: string
}

export interface AuthContextType {
  user: User | null
  session: Session | null
  profile: Profile | null
  isLoading: boolean
  isConfigured: boolean
  configMessage: string
  signIn: (data: SignInData) => Promise<{ success: boolean; error?: string }>
  signInWithGoogle: (redirectTo?: string) => Promise<{ success: boolean; error?: string }>
  signUp: (data: SignUpData) => Promise<{ success: boolean; error?: string; requiresEmailConfirmation?: boolean }>
  signOut: () => Promise<{ success: boolean; error?: string }>
  updateProfile: (updates: Partial<Profile>) => Promise<{ success: boolean; data?: Profile; error?: string }>
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)

  const configStatus = getSupabaseConfigStatus()

  // Fetch citizen profile from public.profiles table
  const fetchProfile = async (userId: string) => {
    if (!isSupabaseConfigured) return
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle()

      if (error) {
        console.warn('Could not fetch user profile from Supabase:', error.message)
        return
      }

      if (data) {
        setProfile(data)
      }
    } catch (err) {
      console.warn('Profile fetch exception:', err)
    }
  }

  // Initialize session and auth state listener
  useEffect(() => {
    if (!isSupabaseConfigured) {
      setIsLoading(false)
      return
    }

    let isMounted = true

    // 1. Retrieve initial active session
    supabase.auth
      .getSession()
      .then(({ data: { session: initialSession }, error }) => {
        if (!isMounted) return
        if (error) {
          console.warn('Error reading initial session:', error.message)
        }
        setSession(initialSession)
        setUser(initialSession?.user ?? null)
        if (initialSession?.user) {
          fetchProfile(initialSession.user.id)
        }
        setIsLoading(false)
      })
      .catch((err) => {
        if (!isMounted) return
        console.warn('Failed to retrieve session:', err)
        setIsLoading(false)
      })

    // 2. Listen to auth state transitions (SIGNED_IN, SIGNED_OUT, TOKEN_REFRESHED, USER_UPDATED)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      if (!isMounted) return

      if (event === 'SIGNED_OUT' || !newSession) {
        setSession(null)
        setUser(null)
        setProfile(null)
      } else {
        setSession(newSession)
        setUser(newSession.user)
        if (newSession.user) {
          await fetchProfile(newSession.user.id)
        }
      }
      setIsLoading(false)
    })

    return () => {
      isMounted = false
      subscription.unsubscribe()
    }
  }, [])

  // Sign In with email and password
  const signIn = async ({ email, password }: SignInData) => {
    if (!isSupabaseConfigured) {
      return {
        success: false,
        error: 'Supabase backend is not configured. Please add valid VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY to .env.local.',
      }
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      })

      if (error) {
        let friendlyMessage = error.message
        if (error.message.toLowerCase().includes('invalid login credentials')) {
          friendlyMessage = 'Invalid email or password. Please verify your credentials and try again.'
        } else if (error.message.toLowerCase().includes('email not confirmed')) {
          friendlyMessage = 'Email address not yet confirmed. Please check your inbox for the verification email.'
        }
        return {
          success: false,
          error: friendlyMessage,
        }
      }

      setUser(data.user)
      setSession(data.session)
      if (data.user) {
        await fetchProfile(data.user.id)
      }

      return { success: true }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'An unexpected error occurred during sign in.'
      return { success: false, error: message }
    }
  }

  // Sign In with Google OAuth
  const signInWithGoogle = async (redirectTo?: string) => {
    if (!isSupabaseConfigured) {
      return {
        success: false,
        error: 'Supabase backend is not configured. Please add valid VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY to .env.local.',
      }
    }

    try {
      const redirectUrl = redirectTo || `${window.location.origin}/dashboard`
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      })

      if (error) {
        return { success: false, error: error.message }
      }

      return { success: true }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to initiate Google authentication.'
      return { success: false, error: message }
    }
  }

  // Sign Up with email, password and profile metadata
  const signUp = async ({
    email,
    password,
    fullName,
    phone,
    dateOfBirth,
    state,
    district,
    preferredLanguage = 'en',
  }: SignUpData) => {
    if (!isSupabaseConfigured) {
      return {
        success: false,
        error: 'Supabase backend is not configured. Please add valid VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY to .env.local.',
      }
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            full_name: fullName.trim(),
            phone: phone?.trim() || '',
            date_of_birth: dateOfBirth || null,
            state: state?.trim() || '',
            district: district?.trim() || '',
            preferred_language: preferredLanguage,
          },
        },
      })

      if (error) {
        return {
          success: false,
          error: error.message,
        }
      }

      // Check if email confirmation is required by project settings
      const requiresEmailConfirmation = Boolean(data.user && !data.session)

      if (data.user) {
        setUser(data.user)
        setSession(data.session)

        // Ensure profile is created even if database triggers are deferred
        if (data.session) {
          try {
            await supabase.from('profiles').upsert({
              id: data.user.id,
              full_name: fullName.trim(),
              phone: phone?.trim() || null,
              date_of_birth: dateOfBirth || null,
              state: state?.trim() || null,
              district: district?.trim() || null,
              preferred_language: preferredLanguage,
            })
          } catch (upsertErr) {
            console.warn('Profile fallback upsert notice:', upsertErr)
          }

          await fetchProfile(data.user.id)
        }
      }

      return {
        success: true,
        requiresEmailConfirmation,
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'An unexpected error occurred during sign up.'
      return { success: false, error: message }
    }
  }

  // Sign Out
  const signOut = async () => {
    if (!isSupabaseConfigured) {
      setUser(null)
      setSession(null)
      setProfile(null)
      return { success: true }
    }

    try {
      const { error } = await supabase.auth.signOut()
      if (error) {
        return { success: false, error: error.message }
      }
      setUser(null)
      setSession(null)
      setProfile(null)
      return { success: true }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'An unexpected error occurred during sign out.'
      return { success: false, error: message }
    }
  }

  // Update Profile
  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user || !isSupabaseConfigured) {
      return { success: false, error: 'User is not authenticated with Supabase.' }
    }

    try {
      const { data, error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .select('*')
        .single()

      if (error) {
        return { success: false, error: error.message }
      }

      setProfile(data)
      return { success: true, data }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to update profile.'
      return { success: false, error: message }
    }
  }

  const refreshProfile = async () => {
    if (user) {
      await fetchProfile(user.id)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        isLoading,
        isConfigured: isSupabaseConfigured,
        configMessage: configStatus.message,
        signIn,
        signInWithGoogle,
        signUp,
        signOut,
        updateProfile,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
