import { useState } from 'react'
import { Menu, Search, Sparkles } from 'lucide-react'
import { LanguageSwitcher } from '@/components/common/LanguageSwitcher'
import { NotificationMenu } from '@/components/common/NotificationMenu'
import { UserProfileMenu } from '@/components/common/UserProfileMenu'
import { useLocation } from 'react-router-dom'
import { ROUTES } from '@/config/app.config'
import { useLanguage } from '@/context/LanguageContext'
import { TranslationKey } from '@/locales/translations'

interface TopNavbarProps {
  onOpenMobileMenu: () => void
}

const pageTitleKeys: Record<string, { titleKey: TranslationKey; subKey?: TranslationKey }> = {
  [ROUTES.DASHBOARD]: { titleKey: 'navDashboard', subKey: 'subDashboard' },
  [ROUTES.SCHEMES]: { titleKey: 'navSchemes', subKey: 'subSchemes' },
  [ROUTES.ELIGIBILITY]: { titleKey: 'navEligibility', subKey: 'subEligibility' },
  [ROUTES.ASSISTANT]: { titleKey: 'navAssistant', subKey: 'subAssistant' },
  [ROUTES.DOCUMENT_ASSISTANT]: { titleKey: 'navDocumentAssistant', subKey: 'subDocumentAssistant' },
  [ROUTES.DOCUMENTS]: { titleKey: 'navDocuments', subKey: 'subDocuments' },
  [ROUTES.COMPARE]: { titleKey: 'navCompare', subKey: 'subCompare' },
  [ROUTES.SAVED]: { titleKey: 'navSaved', subKey: 'subSaved' },
  [ROUTES.PROFILE]: { titleKey: 'navProfile', subKey: 'subProfile' },
}

export function TopNavbar({ onOpenMobileMenu }: TopNavbarProps) {
  const location = useLocation()
  const { t, fontClass, isTelugu, isHindi } = useLanguage()
  const [searchQuery, setSearchQuery] = useState('')

  const itemDef = pageTitleKeys[location.pathname]
  const title = itemDef ? t(itemDef.titleKey) : 'CivicSaarthi AI'
  const subtitle = itemDef?.subKey ? t(itemDef.subKey) : undefined

  return (
    <header className="sticky top-0 z-30 h-16 bg-white border-b border-[var(--color-border)] shadow-xs flex items-center justify-between px-3 sm:px-6 max-w-full">
      {/* Left: Hamburger & Page Title */}
      <div className="flex items-center gap-2 sm:gap-3 min-w-0 shrink-0">
        <button
          type="button"
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2 rounded-xl text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)] hover:bg-[var(--color-muted)] transition-colors shrink-0"
          aria-label="Open sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="hidden sm:block min-w-0">
          <h2 className={`text-sm sm:text-base font-bold text-[var(--color-primary)] leading-tight truncate ${fontClass}`}>
            {title}
          </h2>
          {subtitle && (
            <p className={`text-[11px] text-[var(--color-muted-foreground)] leading-none mt-0.5 truncate hidden lg:block ${fontClass}`}>
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {/* Middle: Global Search */}
      <div className="flex-1 min-w-0 max-w-md mx-2 sm:mx-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-muted-foreground)] pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('labelSearchPlaceholder')}
            className={`input-base input-sm pl-9 pr-3 w-full bg-[var(--color-background)] focus:bg-white text-xs rounded-xl ${fontClass}`}
          />
          <div className="hidden xl:flex absolute right-2.5 top-1/2 -translate-y-1/2 items-center gap-0.5 text-[10px] font-mono text-[var(--color-muted-foreground)] bg-white px-1.5 py-0.5 rounded border border-[var(--color-border)]">
            <Sparkles className="w-2.5 h-2.5 text-[var(--color-secondary)]" /> {isTelugu ? 'ఏఐ శోధన' : isHindi ? 'एआई खोज' : 'AI Search'}
          </div>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
        <LanguageSwitcher />
        <NotificationMenu />
        <div className="divider-v h-6 my-auto hidden sm:block" />
        <UserProfileMenu />
      </div>
    </header>
  )
}
