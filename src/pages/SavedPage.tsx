import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  Bookmark,
  Trash2,
  CheckCircle2,
  ArrowRight,
  Building2,
  Loader2,
  AlertCircle,
  RotateCcw,
  Database,
} from 'lucide-react'
import { useApp } from '@/context/AppContext'
import { useLanguage } from '@/context/LanguageContext'
import { Badge } from '@/components/ui/Badge'
import { SearchInput } from '@/components/common/SearchInput'
import { EmptyState } from '@/components/common/EmptyState'
import { ROUTES } from '@/config/app.config'
import { cn } from '@/lib/utils'

export default function SavedPage() {
  const {
    savedSchemes,
    toggleSaveScheme,
    isSavedSchemesLoading,
    savedSchemesError,
    refreshSavedSchemes,
    isDatabaseSynced,
  } = useApp()
  const { t, fontClass, language } = useLanguage()
  const isTelugu = language === 'te'
  const isHindi = language === 'hi'
  const [searchQuery, setSearchQuery] = useState('')

  const filteredSaved = useMemo(() => {
    if (!searchQuery.trim()) return savedSchemes
    const q = searchQuery.toLowerCase()
    return savedSchemes.filter(
      (s) =>
        s.title.toLowerCase().includes(q) ||
        s.titleTelugu?.toLowerCase().includes(q) ||
        s.category.toLowerCase().includes(q) ||
        s.ministry.toLowerCase().includes(q)
    )
  }, [savedSchemes, searchQuery])

  return (
    <div className={`p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 animate-fade-in ${fontClass}`}>
      {/* ── HEADER ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <Badge variant="accent">
              {isTelugu ? 'పౌర బుక్‌మార్క్‌లు' : isHindi ? 'नागरिक बुकमार्क' : 'Citizen Bookmarks'}
            </Badge>
            {isDatabaseSynced ? (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                <Database className="w-3 h-3" /> {isTelugu ? 'డేటాబేస్ సమకాలీకరించబడింది' : isHindi ? 'डेटाबेस सिंक्रनाइज़्ड' : 'Supabase Synced'}
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                {isTelugu ? 'స్థానిక నిల్వ మోడ్' : isHindi ? 'स्थानीय स्टोरेज मोड' : 'Local Storage Mode'}
              </span>
            )}
          </div>
          <h1 className={cn('text-2xl sm:text-3xl font-extrabold text-[var(--color-primary)] tracking-tight', fontClass)}>
            {t('savedTitle')}
          </h1>
          <p className={cn('text-xs sm:text-sm text-[var(--color-muted-foreground)] mt-0.5', fontClass)}>
            {t('savedSubtitle')} ({savedSchemes.length})
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {savedSchemes.length > 0 && (
            <Link to={ROUTES.SCHEMES} className={cn('btn btn-sm btn-outline text-xs', fontClass)}>
              {t('navSchemes')}
            </Link>
          )}
        </div>
      </div>

      {/* ── ERROR ALERT WITH RETRY ── */}
      {savedSchemesError && (
        <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-900 text-xs flex items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{savedSchemesError}</span>
          </div>
          <button
            type="button"
            onClick={refreshSavedSchemes}
            className="btn btn-xs btn-outline border-red-300 text-red-800 hover:bg-red-100 flex items-center gap-1"
          >
            <RotateCcw className="w-3 h-3" /> {isTelugu ? 'మళ్లీ ప్రయత్నించండి' : isHindi ? 'पुनः प्रयास करें' : 'Retry'}
          </button>
        </div>
      )}

      {/* ── SEARCH BAR (IF SAVED > 0) ── */}
      {savedSchemes.length > 0 && (
        <div className="card p-3 bg-white shadow-xs">
          <SearchInput
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onClear={() => setSearchQuery('')}
            placeholder={isTelugu ? 'భద్రపరిచిన పథకాలలో శోధించండి...' : isHindi ? 'सुरक्षित योजनाओं में खोजें...' : 'Search within your saved schemes...'}
          />
        </div>
      )}

      {/* ── LOADING STATE ── */}
      {isSavedSchemesLoading ? (
        <div className="card p-12 text-center bg-white shadow-xs space-y-3">
          <Loader2 className="w-8 h-8 text-[var(--color-secondary)] animate-spin mx-auto" />
          <p className="text-xs text-[var(--color-muted-foreground)]">
            {isTelugu ? 'డేటాబేస్ నుండి మీ భద్రపరచిన పథకాలను పొందుతోంది...' : isHindi ? 'डेटाबेस से आपकी सुरक्षित योजनाएँ लोड हो रही हैं...' : 'Retrieving your saved schemes from Supabase database...'}
          </p>
        </div>
      ) : savedSchemes.length === 0 ? (
        <EmptyState
          icon={<Bookmark className="w-7 h-7 text-[var(--color-accent)]" />}
          title={t('savedEmpty')}
          description={t('savedEmptyDesc')}
          actionLabel={t('navSchemes')}
          onAction={() => (window.location.href = ROUTES.SCHEMES)}
          actionIcon={<ArrowRight className="w-4 h-4" />}
        />
      ) : filteredSaved.length === 0 ? (
        <EmptyState
          title={isTelugu ? 'మీ శోధనకు సరిపోలిన పథకాలు ఏవీ లేవు' : isHindi ? 'आपकी खोज से मेल खाती कोई योजना नहीं मिली' : 'No saved schemes matched your search'}
          description={
            isTelugu
              ? `"${searchQuery}" కోసం ఎటువంటి ఫలితాలు కనుగొనబడలేదు. వేరొక పదాన్ని ప్రయత్నించండి లేదా శోధనను తొలగించండి.`
              : isHindi
              ? `"${searchQuery}" के लिए कोई सुरक्षित योजना नहीं मिली। कृपया भिन्न शब्द खोजें।`
              : `No results found for "${searchQuery}". Try a different term or clear the search.`
          }
          actionLabel={isTelugu ? 'శోధనను తొలగించండి' : isHindi ? 'खोज हटाएं' : 'Clear Search'}
          onAction={() => setSearchQuery('')}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSaved.map((scheme) => (
            <div
              key={scheme.id}
              className="card-interactive p-5 flex flex-col justify-between bg-white group relative shadow-xs"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <Badge variant={scheme.level === 'Central' ? 'primary' : 'secondary'}>
                      {isTelugu ? (scheme.level === 'Central' ? 'కేంద్ర పథకం' : 'రాష్ట్ర పథకం') : isHindi ? (scheme.level === 'Central' ? 'केंद्रीय योजना' : 'राज्य योजना') : `${scheme.level} Scheme`}
                    </Badge>
                    <Badge variant="muted">{scheme.category}</Badge>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      toggleSaveScheme(scheme.id)
                    }}
                    className="p-1.5 rounded-lg border border-transparent hover:border-[var(--color-border)] hover:bg-[var(--color-danger-bg)] text-[var(--color-danger)] transition-colors"
                    title={isTelugu ? 'భద్రపరిచిన వాటి నుండి తొలగించండి' : isHindi ? 'सुरक्षित योजनाओं से हटाएं' : 'Remove from saved'}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <Link to={`/schemes/${scheme.id}`} className="block group-hover:text-[var(--color-secondary)] transition-colors">
                  <h3 className="font-bold text-base text-[var(--color-primary)] leading-snug">
                    {isTelugu ? (scheme.titleTelugu || scheme.title) : isHindi ? (scheme.titleHindi || scheme.title) : scheme.title}
                  </h3>
                </Link>

                <p className="flex items-center gap-1.5 text-xs text-[var(--color-muted-foreground)] mt-1.5 truncate">
                  <Building2 className="w-3.5 h-3.5 shrink-0" />
                  <span>{scheme.ministry}</span>
                </p>

                <p className="text-xs text-[var(--color-foreground)]/80 mt-2.5 line-clamp-2 leading-relaxed">
                  {scheme.shortDescription}
                </p>
              </div>

              <div className="mt-4 pt-3.5 border-t border-[var(--color-border-subtle)] flex items-center justify-between gap-3">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-[var(--color-muted-foreground)] block">
                    {isTelugu ? 'ప్రయోజనం' : isHindi ? 'लाभ' : 'Benefit'}
                  </span>
                  <span className="text-xs sm:text-sm font-extrabold text-[var(--color-success)]">
                    {scheme.benefitAmount}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    to={`/eligibility?schemeId=${scheme.id}`}
                    className="btn btn-sm btn-outline text-xs px-2.5"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{isTelugu ? 'అర్హత చూడండి' : isHindi ? 'पात्रता जांचें' : 'Check'}</span>
                  </Link>

                  <Link
                    to={`/schemes/${scheme.id}`}
                    className="btn btn-sm btn-primary text-xs px-2.5"
                  >
                    <span>{isTelugu ? 'వివరాలు' : isHindi ? 'विवरण' : 'Details'}</span>
                    <ArrowRight className="w-3 h-3 ml-0.5" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
