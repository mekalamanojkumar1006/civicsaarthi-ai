import React, { createContext, useContext, useState, useEffect } from 'react'
import { CENTRAL_AND_STATE_SCHEMES, DetailedScheme } from '@/data/schemesData'
import { useAuth } from '@/context/AuthContext'
import { dbService } from '@/services/dbService'
import { isSupabaseConfigured } from '@/lib/supabase'

export interface CitizenProfileData {
  fullName: string
  email: string
  phone: string
  age: number
  gender: 'Male' | 'Female' | 'Other'
  state: string
  district: string
  occupation: string
  education: string
  annualIncome: number
  casteCategory: string
  landholdingAcres: number
  hasRationCard: boolean
  rationCardType: 'White' | 'Pink' | 'None'
  hasDisability: boolean
  preferredLanguage: string
  isDemoProfile?: boolean
  isDatabaseSynced?: boolean
}

export const EMPTY_CITIZEN_PROFILE: CitizenProfileData = {
  fullName: '',
  email: '',
  phone: '',
  age: 0,
  gender: 'Male',
  state: '',
  district: '',
  occupation: '',
  education: '',
  annualIncome: 0,
  casteCategory: '',
  landholdingAcres: 0,
  hasRationCard: false,
  rationCardType: 'None',
  hasDisability: false,
  preferredLanguage: 'English / తెలుగు',
  isDemoProfile: false,
  isDatabaseSynced: false,
}

export const SAMPLE_DEMO_PROFILE: CitizenProfileData = {
  fullName: 'Sample Citizen (Demonstration Profile)',
  email: 'demo.citizen@example.local',
  phone: '+91 90000 00000',
  age: 42,
  gender: 'Male',
  state: 'Telangana',
  district: 'Warangal',
  occupation: 'Small Farmer & Artisan',
  education: 'Secondary (Class 10)',
  annualIncome: 140000,
  casteCategory: 'BC',
  landholdingAcres: 2.5,
  hasRationCard: true,
  rationCardType: 'White',
  hasDisability: false,
  preferredLanguage: 'English / తెలుగు',
  isDemoProfile: true,
  isDatabaseSynced: false,
}

export type DatabaseSyncStatus = 'connected' | 'schema_missing' | 'disconnected' | 'error'

interface AppContextType {
  savedSchemeIds: string[]
  toggleSaveScheme: (schemeId: string) => Promise<void>
  isSchemeSaved: (schemeId: string) => boolean
  savedSchemes: DetailedScheme[]
  isSavedSchemesLoading: boolean
  savedSchemesError: string | null
  refreshSavedSchemes: () => Promise<void>
  profile: CitizenProfileData
  updateProfile: (data: Partial<CitizenProfileData>) => Promise<void>
  loadDemoProfile: () => void
  resetProfile: () => void
  profileCompletionPercentage: number
  isDatabaseSynced: boolean
  databaseSyncStatus: DatabaseSyncStatus
  databaseError?: string
}

const AppContext = createContext<AppContextType | undefined>(undefined)

const STORAGE_KEY_SAVED = 'civicsaarthi_saved_schemes'
const STORAGE_KEY_PROFILE = 'civicsaarthi_user_profile'

export function AppProvider({ children }: { children: React.ReactNode }) {
  const { user, profile: authProfile } = useAuth()

  // Saved schemes state
  const [savedSchemeIds, setSavedSchemeIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_SAVED)
      return stored ? JSON.parse(stored) : []
    } catch {
      return []
    }
  })
  const [isSavedSchemesLoading, setIsSavedSchemesLoading] = useState<boolean>(false)
  const [savedSchemesError, setSavedSchemesError] = useState<string | null>(null)

  // Profile state initialized with clean empty profile (or saved in localStorage)
  const [profile, setProfile] = useState<CitizenProfileData>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_PROFILE)
      if (stored) {
        const parsed = JSON.parse(stored)
        return { ...EMPTY_CITIZEN_PROFILE, ...parsed }
      }
      return EMPTY_CITIZEN_PROFILE
    } catch {
      return EMPTY_CITIZEN_PROFILE
    }
  })

  const [isDatabaseSynced, setIsDatabaseSynced] = useState<boolean>(false)
  const [databaseSyncStatus, setDatabaseSyncStatus] = useState<DatabaseSyncStatus>('disconnected')
  const [databaseError, setDatabaseError] = useState<string | undefined>()

  // Sync profile & saved schemes with Supabase when authenticated AND real database query succeeds
  useEffect(() => {
    let isMounted = true

    if (user && isSupabaseConfigured) {
      dbService.checkConnection().then((check) => {
        if (!isMounted) return

        setDatabaseSyncStatus(check.status)
        setDatabaseError(check.error)

        if (check.status === 'connected' && check.tablesExist) {
          setIsDatabaseSynced(true)

          // Sync profile from Supabase
          if (authProfile) {
            setProfile((prev) => ({
              ...prev,
              fullName: authProfile.full_name || prev.fullName || '',
              phone: authProfile.phone || prev.phone || '',
              state: authProfile.state || prev.state || '',
              district: authProfile.district || prev.district || '',
              preferredLanguage: authProfile.preferred_language || prev.preferredLanguage,
              email: user.email || prev.email,
              isDemoProfile: false,
              isDatabaseSynced: true,
            }))
          }

          // Fetch saved schemes directly from Supabase for this authenticated user
          setIsSavedSchemesLoading(true)
          setSavedSchemesError(null)
          dbService.getSavedSchemes(user.id).then((result) => {
            if (!isMounted) return
            setIsSavedSchemesLoading(false)
            if (result.success && result.data) {
              const remoteIds = result.data.map((item) => item.scheme_id)
              setSavedSchemeIds(remoteIds)
            } else if (result.error) {
              setSavedSchemesError(result.error)
            }
          })
        } else {
          // Real database connection query failed or schema missing
          setIsDatabaseSynced(false)
          // Keep profile populated locally, mark database synced as false
          setProfile((prev) => ({
            ...prev,
            email: user.email || prev.email,
            isDatabaseSynced: false,
          }))
        }
      })
    } else {
      setIsDatabaseSynced(false)
      setDatabaseSyncStatus('disconnected')
      setDatabaseError(undefined)
      // When unauthenticated, restore saved schemes from local guest storage
      try {
        const stored = localStorage.getItem(STORAGE_KEY_SAVED)
        setSavedSchemeIds(stored ? JSON.parse(stored) : [])
      } catch {
        setSavedSchemeIds([])
      }
    }

    return () => {
      isMounted = false
    }
  }, [user, authProfile])

  // Persist guest bookmarks locally ONLY when unauthenticated
  useEffect(() => {
    if (!user) {
      try {
        localStorage.setItem(STORAGE_KEY_SAVED, JSON.stringify(savedSchemeIds))
      } catch {
        // ignore
      }
    }
  }, [savedSchemeIds, user])

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_PROFILE, JSON.stringify(profile))
    } catch {
      // ignore
    }
  }, [profile])

  // Explicit refresh saved schemes from Supabase
  const refreshSavedSchemes = async () => {
    if (user && isSupabaseConfigured && databaseSyncStatus === 'connected') {
      setIsSavedSchemesLoading(true)
      setSavedSchemesError(null)
      const res = await dbService.getSavedSchemes(user.id)
      setIsSavedSchemesLoading(false)
      if (res.success && res.data) {
        setSavedSchemeIds(res.data.map((item) => item.scheme_id))
      } else if (res.error) {
        setSavedSchemesError(res.error)
      }
    }
  }

  // Toggle save scheme (with Supabase sync if logged in)
  const toggleSaveScheme = async (schemeId: string) => {
    const isCurrentlySaved = savedSchemeIds.includes(schemeId)
    setSavedSchemesError(null)

    // Optimistic UI update
    setSavedSchemeIds((prev) =>
      isCurrentlySaved ? prev.filter((id) => id !== schemeId) : [...prev, schemeId]
    )

    // Sync to Supabase if authenticated and database tables are verified
    if (user && isSupabaseConfigured && databaseSyncStatus === 'connected') {
      if (isCurrentlySaved) {
        const res = await dbService.unsaveScheme(user.id, schemeId)
        if (!res.success) {
          // Rollback optimistic update on error
          setSavedSchemeIds((prev) => [...prev, schemeId])
          setSavedSchemesError(res.error || 'Failed to remove scheme from saved list.')
        }
      } else {
        const res = await dbService.saveScheme(user.id, schemeId)
        if (!res.success) {
          // Rollback optimistic update on error
          setSavedSchemeIds((prev) => prev.filter((id) => id !== schemeId))
          setSavedSchemesError(res.error || 'Failed to save scheme to database.')
        }
      }
    }
  }

  const isSchemeSaved = (schemeId: string) => savedSchemeIds.includes(schemeId)

  const savedSchemes = CENTRAL_AND_STATE_SCHEMES.filter((s) => savedSchemeIds.includes(s.id))

  // Update profile (with Supabase sync if connected)
  const updateProfile = async (data: Partial<CitizenProfileData>) => {
    const isDemo = data.isDemoProfile ?? false
    let remoteSuccess = false

    // Only attempt live PostgreSQL update if tables were confirmed to exist
    if (user && isSupabaseConfigured && !isDemo && databaseSyncStatus === 'connected') {
      const res = await dbService.updateProfile(user.id, {
        full_name: data.fullName,
        phone: data.phone,
        state: data.state,
        district: data.district,
        preferred_language: data.preferredLanguage,
      })
      remoteSuccess = res.success
    }

    setProfile((prev) => ({
      ...prev,
      ...data,
      isDemoProfile: isDemo,
      isDatabaseSynced: remoteSuccess,
    }))
  }

  const loadDemoProfile = () => {
    setProfile(SAMPLE_DEMO_PROFILE)
    setIsDatabaseSynced(false)
  }

  const resetProfile = () => {
    setProfile(EMPTY_CITIZEN_PROFILE)
    setIsDatabaseSynced(false)
  }

  // Calculate profile completeness score
  const calculateCompletion = (): number => {
    let score = 0
    if (profile.fullName) score += 10
    if (profile.email) score += 10
    if (profile.phone) score += 10
    if (profile.age > 0) score += 10
    if (profile.state && profile.district) score += 15
    if (profile.occupation) score += 15
    if (profile.annualIncome > 0) score += 15
    if (profile.casteCategory) score += 15
    return Math.min(score, 100)
  }

  return (
    <AppContext.Provider
      value={{
        savedSchemeIds,
        toggleSaveScheme,
        isSchemeSaved,
        savedSchemes,
        isSavedSchemesLoading,
        savedSchemesError,
        refreshSavedSchemes,
        profile,
        updateProfile,
        loadDemoProfile,
        resetProfile,
        profileCompletionPercentage: calculateCompletion(),
        isDatabaseSynced,
        databaseSyncStatus,
        databaseError,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp must be used within an AppProvider')
  }
  return context
}
