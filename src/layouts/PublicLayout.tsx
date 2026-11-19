import { Outlet, Link } from 'react-router-dom'
import { Landmark, ArrowRight, ShieldCheck, HeartHandshake } from 'lucide-react'
import { LanguageSwitcher } from '@/components/common/LanguageSwitcher'
import { ROUTES, APP_CONFIG } from '@/config/app.config'
import { useLanguage } from '@/context/LanguageContext'

export function PublicLayout() {
  const { t, fontClass } = useLanguage()

  return (
    <div className={`min-h-screen bg-[var(--color-background)] flex flex-col ${fontClass}`}>
      {/* ── Public Navbar ── */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[var(--color-border)] shadow-xs">
        <div className="container flex items-center justify-between h-16">
          {/* Brand */}
          <Link to={ROUTES.HOME} className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-[var(--color-primary)] text-white flex items-center justify-center shadow-xs transition-transform group-hover:scale-105">
              <Landmark className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-base tracking-tight text-[var(--color-primary)] leading-tight">
                {t('appName') || APP_CONFIG.name}
              </span>
              <span className="text-[10px] text-[var(--color-secondary)] uppercase font-bold tracking-wider leading-none">
                {t('govTechCitizenAi')}
              </span>
            </div>
          </Link>

          {/* Center Links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-[var(--color-foreground)]">
            <Link to={ROUTES.SCHEMES} className="hover:text-[var(--color-secondary)] transition-colors">
              {t('navSchemes')}
            </Link>
            <Link to={ROUTES.ELIGIBILITY} className="hover:text-[var(--color-secondary)] transition-colors">
              {t('navEligibility')}
            </Link>
            <Link to={ROUTES.ASSISTANT} className="hover:text-[var(--color-secondary)] transition-colors flex items-center gap-1 text-[var(--color-secondary)]">
              {t('navAssistant')}
            </Link>
            <Link to={ROUTES.DOCUMENT_ASSISTANT} className="hover:text-[var(--color-secondary)] transition-colors">
              {t('navDocumentAssistant')}
            </Link>
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            <LanguageSwitcher />
            <Link
              to={ROUTES.LOGIN}
              className="text-xs sm:text-sm font-bold text-[var(--color-primary)] hover:text-[var(--color-secondary)] px-3 py-1.5 transition-colors"
            >
              {t('navSignIn')}
            </Link>
            <Link
              to={ROUTES.REGISTER}
              className="btn btn-sm btn-primary text-xs shadow-sm hover:shadow-md"
            >
              <span>{t('navGetStarted')}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* Main Outlet */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* ── Public Footer ── */}
      <footer className="bg-[var(--color-primary)] text-white border-t border-white/10 mt-auto">
        <div className="container py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Brand column */}
            <div className="md:col-span-1 space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[var(--color-secondary)] flex items-center justify-center">
                  <Landmark className="w-4 h-4 text-white" />
                </div>
                <span className="font-extrabold text-lg text-white">{t('appName') || APP_CONFIG.name}</span>
              </div>
              <p className="text-xs text-white/70 leading-relaxed">
                {t('footerDesc')}
              </p>
              <div className="flex items-center gap-2 text-xs text-[var(--color-accent)] font-semibold pt-1">
                <ShieldCheck className="w-4 h-4" /> {t('footerOfficialAlignment')}
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-white/40 mb-3">{t('footerCitizensCol')}</h4>
              <ul className="space-y-2 text-xs text-white/70">
                <li><Link to={ROUTES.SCHEMES} className="hover:text-white transition-colors">{t('footerExploreAll')}</Link></li>
                <li><Link to={ROUTES.ELIGIBILITY} className="hover:text-white transition-colors">{t('footerCheckEligibility')}</Link></li>
                <li><Link to={ROUTES.DOCUMENT_ASSISTANT} className="hover:text-white transition-colors">{t('footerDocHelper')}</Link></li>
                <li><Link to={ROUTES.COMPARE} className="hover:text-white transition-colors">{t('footerCompareSchemes')}</Link></li>
              </ul>
            </div>

            {/* AI Services */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-white/40 mb-3">{t('footerAiCol')}</h4>
              <ul className="space-y-2 text-xs text-white/70">
                <li><Link to={ROUTES.ASSISTANT} className="hover:text-white transition-colors">{t('footerConversationalSaarthi')}</Link></li>
                <li><Link to={ROUTES.DOCUMENT_ASSISTANT} className="hover:text-white transition-colors">{t('footerPdfCircularReader')}</Link></li>
                <li><span className="text-white/40">{t('footerTeluguNlp')}</span></li>
                <li><span className="text-white/40">{t('footerVoiceAssistance')}</span></li>
              </ul>
            </div>

            {/* GovTech Transparency */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-white/40 mb-3">{t('footerTransparencyCol')}</h4>
              <p className="text-xs text-white/70 leading-relaxed mb-3">
                {t('footerTransparencyDesc')}
              </p>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/10 text-[11px] font-semibold text-white/90">
                <HeartHandshake className="w-3.5 h-3.5 text-[var(--color-accent)]" />
                {t('builtForBharat')}
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-white/50">
            <p>© {new Date().getFullYear()} {APP_CONFIG.name}. {t('footerCopyright')}</p>
            <div className="flex items-center gap-4">
              <span>{t('footerPrivacy')}</span>
              <span>{t('footerTerms')}</span>
              <span>{t('footerDataSecurity')}</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
