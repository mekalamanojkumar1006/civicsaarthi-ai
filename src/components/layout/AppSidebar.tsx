import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  Search,
  CheckSquare,
  Bot,
  FileSearch,
  FolderLock,
  GitCompare,
  Bookmark,
  User,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Landmark,
  X,
  Brain,
} from 'lucide-react'
import { ROUTES, APP_CONFIG } from '@/config/app.config'
import { cn } from '@/lib/utils'
import { useAuth } from '@/context/AuthContext'
import { useLanguage } from '@/context/LanguageContext'

interface AppSidebarProps {
  isCollapsed: boolean
  setIsCollapsed: (value: boolean | ((prev: boolean) => boolean)) => void
  mobileOpen: boolean
  setMobileOpen: (value: boolean) => void
}

const mainNavItems = [
  { key: 'navDashboard', label: 'Dashboard', to: ROUTES.DASHBOARD, icon: LayoutDashboard },
  { key: 'navSchemes', label: 'Explore Schemes', to: ROUTES.SCHEMES, icon: Search },
  { key: 'navEligibility', label: 'Eligibility Checker', to: ROUTES.ELIGIBILITY, icon: CheckSquare },
  { key: 'navAssistant', label: 'AI Assistant', to: ROUTES.ASSISTANT, icon: Bot, isHighlight: true },
  { key: 'navDocumentAssistant', label: 'PDF Assistant', to: ROUTES.DOCUMENT_ASSISTANT, icon: FileSearch },
  { key: 'navDocuments', label: 'Required Documents', to: ROUTES.DOCUMENTS, icon: FolderLock },
  { key: 'navCompare', label: 'Compare Schemes', to: ROUTES.COMPARE, icon: GitCompare },
  { key: 'navSaved', label: 'Saved Schemes', to: ROUTES.SAVED, icon: Bookmark },
]

export function AppSidebar({
  isCollapsed,
  setIsCollapsed,
  mobileOpen,
  setMobileOpen,
}: AppSidebarProps) {
  const location = useLocation()
  const navigate = useNavigate()
  const { signOut } = useAuth()
  const { t, fontClass } = useLanguage()

  const isActive = (to: string) => location.pathname === to

  const sidebarContent = (
    <div className="flex flex-col h-full bg-[var(--color-primary)] text-white select-none">
      {/* Brand Header */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-white/10 shrink-0">
        <Link
          to={ROUTES.HOME}
          className="flex items-center gap-2.5 overflow-hidden group"
          onClick={() => setMobileOpen(false)}
        >
          <div className="w-9 h-9 rounded-xl bg-[var(--color-secondary)] flex items-center justify-center shrink-0 shadow-sm transition-transform group-hover:scale-105">
            <Landmark className="w-5 h-5 text-white" />
          </div>
          {(!isCollapsed || mobileOpen) && (
            <div className="flex flex-col min-w-0">
              <span className="font-extrabold text-base tracking-tight text-white leading-tight">
                {APP_CONFIG.name}
              </span>
              <span className="text-[10px] text-white/60 uppercase tracking-widest font-bold">
                Citizen Portal
              </span>
            </div>
          )}
        </Link>

        {/* Mobile close button */}
        <button
          type="button"
          onClick={() => setMobileOpen(false)}
          className="lg:hidden p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10"
          aria-label="Close menu"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Desktop collapse toggle */}
        <button
          type="button"
          onClick={() => setIsCollapsed((prev) => !prev)}
          className="hidden lg:flex w-7 h-7 rounded-lg items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-colors"
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Navigation List */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1 scrollbar-thin">
        {(!isCollapsed || mobileOpen) && (
          <p className="px-3 pb-1.5 text-[10px] font-bold uppercase tracking-wider text-white/40">
            {t('navCitizenServices')}
          </p>
        )}

        {mainNavItems.map((item) => {
          const Icon = item.icon
          const active = isActive(item.to)
          const itemLabel = t(item.key as any)
          return (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setMobileOpen(false)}
              className={cn(
                'nav-item group relative',
                active && 'active',
                isCollapsed && !mobileOpen && 'justify-center px-2'
              )}
              title={isCollapsed ? itemLabel : undefined}
            >
              <Icon
                className={cn(
                  'w-5 h-5 shrink-0 transition-transform group-hover:scale-110',
                  active ? 'text-[var(--color-accent)]' : 'text-white/70',
                  item.isHighlight && !active && 'text-[var(--color-secondary-300)]'
                )}
              />
              {(!isCollapsed || mobileOpen) && (
                <span className={cn('flex-1 truncate', fontClass && `${fontClass} text-[13px]`)}>{itemLabel}</span>
              )}
              {(!isCollapsed || mobileOpen) && item.isHighlight && (
                <span className="badge badge-accent text-[9px] py-0 px-1 font-bold">
                  <Brain className="w-2.5 h-2.5 mr-0.5" /> AI
                </span>
              )}
              {active && (
                <span className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-[var(--color-accent)] rounded-r-full" />
              )}
            </Link>
          )
        })}
      </div>

      {/* Bottom Section */}
      <div className="p-3 border-t border-white/10 shrink-0 space-y-1">
        {(!isCollapsed || mobileOpen) && (
          <p className="px-3 pb-1 text-[10px] font-bold uppercase tracking-wider text-white/40">
            {t('navAccount')}
          </p>
        )}

        <Link
          to={ROUTES.PROFILE}
          onClick={() => setMobileOpen(false)}
          className={cn(
            'nav-item',
            isActive(ROUTES.PROFILE) && 'active',
            isCollapsed && !mobileOpen && 'justify-center px-2'
          )}
          title={isCollapsed ? t('navProfile') : undefined}
        >
          <User className="w-5 h-5 shrink-0 text-white/70" />
          {(!isCollapsed || mobileOpen) && (
            <span className={cn('flex-1 truncate', fontClass && `${fontClass} text-[13px]`)}>
              {t('navProfile')}
            </span>
          )}
        </Link>

        <Link
          to={ROUTES.PROFILE}
          onClick={() => setMobileOpen(false)}
          className={cn(
            'nav-item',
            isCollapsed && !mobileOpen && 'justify-center px-2'
          )}
          title={isCollapsed ? t('navSettings') : undefined}
        >
          <Settings className="w-5 h-5 shrink-0 text-white/70" />
          {(!isCollapsed || mobileOpen) && <span className={cn('flex-1 truncate', fontClass && `${fontClass} text-[13px]`)}>{t('navSettings')}</span>}
        </Link>

        <button
          type="button"
          onClick={async () => {
            setMobileOpen(false)
            await signOut()
            navigate(ROUTES.LOGIN)
          }}
          className={cn(
            'nav-item w-full text-left text-red-300 hover:text-red-200 hover:bg-red-500/10 cursor-pointer',
            isCollapsed && !mobileOpen && 'justify-center px-2'
          )}
          title={isCollapsed ? t('navLogout') : undefined}
        >
          <LogOut className="w-5 h-5 shrink-0" />
          {(!isCollapsed || mobileOpen) && <span className={cn('flex-1 truncate', fontClass && `${fontClass} text-[13px]`)}>{t('navLogout')}</span>}
        </button>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          'hidden lg:flex flex-col fixed inset-y-0 left-0 z-30 transition-all duration-300 ease-in-out border-r border-[var(--color-border)] shadow-md',
          isCollapsed ? 'w-[72px]' : 'w-[264px]'
        )}
      >
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-xs animate-fade-in"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile Drawer Panel */}
      <div
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-72 max-w-[85vw] lg:hidden transition-transform duration-300 ease-in-out shadow-2xl',
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {sidebarContent}
      </div>
    </>
  )
}
