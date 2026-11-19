import { Outlet, Link } from 'react-router-dom'
import { Landmark } from 'lucide-react'
import { APP_CONFIG } from '@/config/app.config'
import { LanguageSwitcher } from '@/components/common/LanguageSwitcher'
import { useLanguage } from '@/context/LanguageContext'

/**
 * AuthLayout — minimal centered layout used for Login and Register pages.
 * Keeps the brand and language switcher visible without the full application shell.
 */
export function AuthLayout() {
  const { t, fontClass } = useLanguage()

  return (
    <div className={`min-h-screen bg-background flex flex-col ${fontClass}`}>
      {/* Minimal header with Language Selector */}
      <header className="h-16 flex items-center justify-between px-6 border-b border-border bg-white">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <Landmark className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-primary text-base tracking-tight">
            {t('appName') || APP_CONFIG.name}
          </span>
        </Link>
        <LanguageSwitcher />
      </header>

      {/* Centered auth form */}
      <main className="flex-1 flex items-center justify-center px-4 py-8 sm:py-12">
        <div className="w-full max-w-lg">
          <Outlet />
        </div>
      </main>

      {/* Footer */}
      <footer className="h-12 flex items-center justify-center text-xs text-muted-foreground border-t border-border">
        © {new Date().getFullYear()} {APP_CONFIG.name}. {t('footerCopyright')}
      </footer>
    </div>
  )
}
