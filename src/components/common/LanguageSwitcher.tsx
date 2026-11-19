import { useState, useRef, useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { Globe, ChevronDown, Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useLanguage } from '@/context/LanguageContext'
import { Language } from '@/locales/translations'

export interface LanguageOption {
  code: string
  label: string
  nativeLabel: string
  fontClass: string
  isAvailable: boolean
}

/**
 * 5 Required Language Options:
 * 1. English – Available
 * 2. Telugu (తెలుగు) – Available
 * 3. Hindi (हिन्दी) – Available
 * 4. Tamil (தமிழ்) – Coming Soon
 * 5. Kannada (ಕನ್ನಡ) – Coming Soon
 */
const languages: LanguageOption[] = [
  { code: 'en', label: 'English', nativeLabel: 'English', fontClass: '', isAvailable: true },
  { code: 'te', label: 'Telugu', nativeLabel: 'తెలుగు', fontClass: 'font-telugu', isAvailable: true },
  { code: 'hi', label: 'Hindi', nativeLabel: 'हिन्दी', fontClass: 'font-hindi', isAvailable: true },
  { code: 'ta', label: 'Tamil', nativeLabel: 'தமிழ்', fontClass: '', isAvailable: false },
  { code: 'kn', label: 'Kannada', nativeLabel: 'ಕನ್ನಡ', fontClass: 'font-kannada', isAvailable: false },
]

interface LanguageSwitcherProps {
  className?: string
  variant?: 'light' | 'dark'
}

export function LanguageSwitcher({ className, variant = 'light' }: LanguageSwitcherProps) {
  const { language, setLanguage, fontClass } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)

  const triggerRef = useRef<HTMLButtonElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  const [position, setPosition] = useState<{ top: number; right: number }>({
    top: 0,
    right: 0,
  })

  const updatePosition = useCallback(() => {
    if (!triggerRef.current) return
    const rect = triggerRef.current.getBoundingClientRect()
    const viewportWidth = window.innerWidth
    const top = rect.bottom + 8

    // Desired menu width: ~224px (w-56)
    const menuWidth = 224
    const idealRight = viewportWidth - rect.right

    // Clamping: ensure dropdown has at least 12px margin from viewport edges
    const maxRight = Math.max(12, viewportWidth - menuWidth - 12)
    const clampedRight = Math.min(Math.max(12, idealRight), maxRight)

    setPosition({
      top,
      right: clampedRight,
    })
  }, [])

  useEffect(() => {
    if (!isOpen) return

    updatePosition()

    function handleScroll() {
      updatePosition()
    }

    function handleResize() {
      updatePosition()
    }

    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node
      if (
        triggerRef.current &&
        !triggerRef.current.contains(target) &&
        menuRef.current &&
        !menuRef.current.contains(target)
      ) {
        setIsOpen(false)
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false)
      }
    }

    window.addEventListener('scroll', handleScroll, true)
    window.addEventListener('resize', handleResize)
    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('scroll', handleScroll, true)
      window.removeEventListener('resize', handleResize)
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, updatePosition])

  const currentOption = languages.find((l) => l.code === language) || languages[0]

  const handleSelectLanguage = (lang: LanguageOption) => {
    // Only permit switching to active and fully supported languages
    if (!lang.isAvailable) {
      return
    }

    setLanguage(lang.code as Language)
    setIsOpen(false)
  }

  return (
    <div className="relative inline-block">
      {/* Trigger Button */}
      <button
        ref={triggerRef}
        type="button"
        onClick={() => {
          updatePosition()
          setIsOpen((prev) => !prev)
        }}
        className={cn(
          'inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all border cursor-pointer select-none',
          variant === 'dark'
            ? 'bg-white/10 text-white border-white/20 hover:bg-white/20'
            : 'bg-white text-[var(--color-foreground)] border-[var(--color-border)] hover:bg-[var(--color-muted)] hover:border-[var(--color-secondary)]',
          className
        )}
        aria-label="Select language"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <Globe className="w-3.5 h-3.5 text-[var(--color-secondary)] shrink-0" />
        <span className={cn('truncate max-w-[80px]', fontClass)}>
          {currentOption.nativeLabel}
        </span>
        <ChevronDown
          className={cn(
            'w-3 h-3 text-[var(--color-muted-foreground)] transition-transform duration-200 shrink-0',
            isOpen && 'rotate-180'
          )}
        />
      </button>

      {/* Floating Dropdown Menu via Portal */}
      {isOpen &&
        createPortal(
          <div
            ref={menuRef}
            style={{
              top: `${position.top}px`,
              right: `${position.right}px`,
            }}
            className="fixed w-56 rounded-2xl bg-white border border-[var(--color-border)] shadow-2xl z-[100] py-1.5 animate-scale-in"
          >
            {/* Header info */}
            <div className="px-3 py-2 border-b border-[var(--color-border)] flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-muted-foreground)]">
                Select Language
              </span>
              <span className="text-[10px] font-semibold text-[var(--color-secondary)]">
                5 Languages
              </span>
            </div>

            {/* Language list */}
            <div className="py-1">
              {languages.map((lang) => {
                const isSelected = language === lang.code

                if (!lang.isAvailable) {
                  return (
                    <div
                      key={lang.code}
                      role="button"
                      tabIndex={-1}
                      aria-disabled="true"
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                      }}
                      className="w-full flex items-center justify-between px-3 py-2 text-xs opacity-50 cursor-not-allowed select-none bg-slate-50/50"
                      title={`${lang.label} support is coming soon.`}
                    >
                      <div className="flex flex-col text-left">
                        <span className={cn('font-semibold text-slate-700', lang.fontClass)}>
                          {lang.nativeLabel}
                        </span>
                        <span className="text-[10px] text-slate-400">{lang.label}</span>
                      </div>
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-500 border border-slate-200 uppercase tracking-tight">
                        Coming Soon
                      </span>
                    </div>
                  )
                }

                return (
                  <button
                    key={lang.code}
                    type="button"
                    onClick={() => handleSelectLanguage(lang)}
                    className={cn(
                      'w-full flex items-center justify-between px-3 py-2 text-xs transition-colors text-left cursor-pointer',
                      isSelected
                        ? 'bg-[var(--color-secondary-50)] text-[var(--color-secondary-900)] font-bold'
                        : 'text-[var(--color-foreground)] hover:bg-[var(--color-muted)]'
                    )}
                  >
                    <div className="flex flex-col">
                      <span className={cn('text-xs font-semibold', lang.fontClass)}>
                        {lang.nativeLabel}
                      </span>
                      <span className="text-[10px] text-[var(--color-muted-foreground)]">
                        {lang.label}
                      </span>
                    </div>
                    {isSelected && (
                      <Check className="w-4 h-4 text-[var(--color-secondary)] shrink-0" />
                    )}
                  </button>
                )
              })}
            </div>
          </div>,
          document.body
        )}
    </div>
  )
}
