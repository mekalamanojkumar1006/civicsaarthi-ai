import { useState, useRef, useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { Link, useNavigate } from 'react-router-dom'
import { User, Settings, LogOut, ChevronDown, ShieldCheck, Bookmark, Database } from 'lucide-react'
import { ROUTES } from '@/config/app.config'
import { useApp } from '@/context/AppContext'
import { useAuth } from '@/context/AuthContext'
import { useLanguage } from '@/context/LanguageContext'

export function UserProfileMenu() {
  const [isOpen, setIsOpen] = useState(false)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()
  const { profile, isDatabaseSynced } = useApp()
  const { user, signOut, isConfigured } = useAuth()
  const { t, isTelugu, fontClass } = useLanguage()

  const [position, setPosition] = useState<{ top: number; right: number }>({
    top: 0,
    right: 0,
  })

  const initials =
    profile.fullName
      .split(' ')
      .map((n) => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase() || 'CS'

  const updatePosition = useCallback(() => {
    if (!triggerRef.current) return
    const rect = triggerRef.current.getBoundingClientRect()
    const viewportWidth = window.innerWidth
    const top = rect.bottom + 8
    const menuWidth = 240
    const idealRight = viewportWidth - rect.right
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

  const handleSignOut = async () => {
    setIsOpen(false)
    await signOut()
    navigate(ROUTES.LOGIN)
  }

  return (
    <div className={`relative inline-block ${fontClass}`}>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => {
          updatePosition()
          setIsOpen((prev) => !prev)
        }}
        className="flex items-center gap-2 p-1 pl-1.5 pr-2.5 rounded-full hover:bg-[var(--color-muted)] transition-colors border border-transparent hover:border-[var(--color-border)] cursor-pointer"
        aria-label="User Profile"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <div className="w-7 h-7 rounded-full bg-[var(--color-primary)] text-white font-bold text-xs flex items-center justify-center">
          {initials}
        </div>
        <div className="hidden md:flex flex-col text-left">
          <span className="text-xs font-bold text-[var(--color-foreground)] leading-tight max-w-[100px] truncate">
            {profile.fullName || (isTelugu ? 'పౌర వినియోగదారుడు' : 'Citizen User')}
          </span>
          <span className="text-[10px] text-[var(--color-muted-foreground)] leading-none truncate max-w-[100px]">
            {user?.email || (profile.isDemoProfile ? (isTelugu ? 'నమూనా ప్రొఫైల్' : 'Demo Profile') : (isTelugu ? 'పౌరుడు' : 'Citizen'))}
          </span>
        </div>
        <ChevronDown className="w-3.5 h-3.5 text-[var(--color-muted-foreground)]" />
      </button>

      {isOpen &&
        createPortal(
          <div
            ref={menuRef}
            style={{
              top: `${position.top}px`,
              right: `${position.right}px`,
            }}
            className="fixed w-60 max-w-[calc(100vw-24px)] rounded-2xl bg-white border border-[var(--color-border)] shadow-2xl z-[100] py-1.5 animate-scale-in"
          >
            {/* User Preview */}
            <div className="px-4 py-2.5 border-b border-[var(--color-border)]">
              <p className="text-xs font-bold text-[var(--color-foreground)] truncate">
                {profile.fullName || (isTelugu ? 'పౌర వినియోగదారుడు' : 'Citizen User')}
              </p>
              <p className="text-[11px] text-[var(--color-muted-foreground)] truncate">
                {user?.email || profile.email || 'citizen@civicsaarthi.local'}
              </p>
              <div className="flex items-center gap-1.5 mt-1.5">
                {user && isConfigured ? (
                  isDatabaseSynced ? (
                    <span className="inline-flex items-center gap-1 text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded font-semibold border border-emerald-200">
                      <Database className="w-2.5 h-2.5" /> {isTelugu ? 'డేటాబేస్ అనుసంధానించబడింది' : 'Supabase Database Synced'}
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[10px] text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded font-semibold border border-amber-200">
                      <Database className="w-2.5 h-2.5" /> {isTelugu ? 'లోకల్ సెషన్' : 'Local Session'}
                    </span>
                  )
                ) : profile.isDemoProfile ? (
                  <span className="inline-flex items-center gap-1 text-[10px] text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded font-semibold border border-amber-200">
                    <ShieldCheck className="w-2.5 h-2.5" /> {isTelugu ? 'నమూనా ప్రొఫైల్' : 'Demo Profile'}
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[10px] text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded font-semibold border border-blue-200">
                    <ShieldCheck className="w-2.5 h-2.5" /> {isTelugu ? 'లోకల్ సెషన్' : 'Local Session'}
                  </span>
                )}
              </div>
            </div>

            <div className="py-1">
              <Link
                to={ROUTES.PROFILE}
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-[var(--color-foreground)] hover:bg-[var(--color-muted)] transition-colors"
              >
                <User className="w-4 h-4 text-[var(--color-muted-foreground)]" />
                <span>{t('userMenuProfile')}</span>
              </Link>

              <Link
                to={ROUTES.SAVED}
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-[var(--color-foreground)] hover:bg-[var(--color-muted)] transition-colors"
              >
                <Bookmark className="w-4 h-4 text-[var(--color-muted-foreground)]" />
                <span>{t('userMenuSaved')}</span>
              </Link>

              <Link
                to={ROUTES.PROFILE}
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-[var(--color-foreground)] hover:bg-[var(--color-muted)] transition-colors"
              >
                <Settings className="w-4 h-4 text-[var(--color-muted-foreground)]" />
                <span>{t('userMenuSettings')}</span>
              </Link>
            </div>

            <div className="border-t border-[var(--color-border)] pt-1">
              <button
                type="button"
                onClick={handleSignOut}
                className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-[var(--color-danger)] hover:bg-[var(--color-danger-bg)] transition-colors text-left cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>{user ? t('userMenuSignOut') : t('userMenuExitSession')}</span>
              </button>
            </div>
          </div>,
          document.body
        )}
    </div>
  )
}
