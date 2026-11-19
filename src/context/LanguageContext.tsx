import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { translations, TranslationKey, Language } from '@/locales/translations'

export type { Language }

export interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: TranslationKey) => string
  isTelugu: boolean
  isHindi: boolean
  isIndic: boolean
  fontClass: string
}

const STORAGE_KEY = 'civicsaarthi_language'

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved === 'te' || saved === 'hi') {
        return saved as Language
      }
      return 'en'
    } catch {
      return 'en'
    }
  })

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang)
    try {
      localStorage.setItem(STORAGE_KEY, lang)
    } catch {
      // ignore
    }
    document.documentElement.lang = lang
  }, [])

  useEffect(() => {
    document.documentElement.lang = language
  }, [language])

  const t = useCallback(
    (key: TranslationKey): string => {
      const dict = (translations as any)[language] || translations.en
      const val = dict?.[key]
      if (typeof val === 'string' && val.trim().length > 0) {
        return val
      }
      const fallback = (translations.en as any)?.[key]
      if (typeof fallback === 'string' && fallback.trim().length > 0) {
        return fallback
      }
      return String(key)
    },
    [language]
  )

  const isTelugu = language === 'te'
  const isHindi = language === 'hi'
  const isIndic = isTelugu || isHindi
  const fontClass = isTelugu ? 'font-telugu' : isHindi ? 'font-hindi' : ''

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t,
        isTelugu,
        isHindi,
        isIndic,
        fontClass,
      }}
    >
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}
