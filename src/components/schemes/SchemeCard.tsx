import { Bookmark, CheckCircle, ArrowRight, Building2, Sparkles } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { Badge } from '@/components/ui/Badge'
import { cn } from '@/lib/utils'
import { useApp } from '@/context/AppContext'
import { useLanguage } from '@/context/LanguageContext'

export interface SchemeCardData {
  id: string
  title: string
  titleTelugu?: string
  titleHindi?: string
  description: string
  descriptionTelugu?: string
  descriptionHindi?: string
  ministry?: string
  level: 'Central' | 'State'
  state?: string
  category: string
  benefitAmount?: string
  eligibilityScore?: number
  isSaved?: boolean
  tags?: string[]
}

interface SchemeCardProps {
  scheme: SchemeCardData
  onToggleSave?: (id: string) => void
  showScore?: boolean
  layout?: 'grid' | 'list'
  className?: string
}

export function SchemeCard({
  scheme,
  onToggleSave,
  showScore = true,
  layout = 'grid',
  className,
}: SchemeCardProps) {
  const navigate = useNavigate()
  const { isSchemeSaved, toggleSaveScheme } = useApp()
  const { t, isTelugu, isHindi, fontClass } = useLanguage()
  const saved = scheme.isSaved !== undefined ? scheme.isSaved : isSchemeSaved(scheme.id)

  const handleBookmark = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (onToggleSave) {
      onToggleSave(scheme.id)
    } else {
      toggleSaveScheme(scheme.id)
    }
  }

  // Display localized title as primary when in Telugu or Hindi mode
  const displayTitle = isTelugu && scheme.titleTelugu
    ? scheme.titleTelugu
    : isHindi && scheme.titleHindi
    ? scheme.titleHindi
    : scheme.title

  const displaySecondaryTitle = isTelugu && scheme.titleTelugu
    ? scheme.title
    : isHindi && scheme.titleHindi
    ? scheme.title
    : scheme.titleTelugu

  const displayDescription = isTelugu && scheme.descriptionTelugu
    ? scheme.descriptionTelugu
    : isHindi && scheme.descriptionHindi
    ? scheme.descriptionHindi
    : scheme.description

  const levelLabel = scheme.level === 'Central' ? t('cardCentralScheme') : t('cardStateScheme')

  if (layout === 'list') {
    return (
      <div
        onClick={() => navigate(`/schemes/${scheme.id}`)}
        className={cn(
          'card-interactive p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 group relative',
          fontClass,
          className
        )}
      >
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-1.5 mb-2">
            <Badge variant={scheme.level === 'Central' ? 'primary' : 'secondary'}>
              {levelLabel}
            </Badge>
            {scheme.state && <Badge variant="muted">{scheme.state}</Badge>}
            <Badge variant="muted">{scheme.category}</Badge>
            {showScore && scheme.eligibilityScore !== undefined && (
              <Badge variant="success" dot>
                {scheme.eligibilityScore}% {t('cardMatch')}
              </Badge>
            )}
          </div>

          <h3 className="font-bold text-base text-[var(--color-primary)] group-hover:text-[var(--color-secondary)] transition-colors leading-snug">
            {displayTitle}
          </h3>
          {displaySecondaryTitle && (
            <p className="text-xs text-[var(--color-muted-foreground)] mt-0.5">
              {displaySecondaryTitle}
            </p>
          )}

          {scheme.ministry && (
            <p className="flex items-center gap-1.5 text-xs text-[var(--color-muted-foreground)] mt-1 truncate">
              <Building2 className="w-3.5 h-3.5 shrink-0" />
              <span>{scheme.ministry}</span>
            </p>
          )}

          <p className="text-xs text-[var(--color-foreground)]/80 mt-1.5 line-clamp-2 leading-relaxed">
            {displayDescription}
          </p>
        </div>

        <div className="sm:border-l sm:border-[var(--color-border-subtle)] sm:pl-6 sm:text-right flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-3 shrink-0">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-[var(--color-muted-foreground)] block">
              {t('cardBenefit')}
            </span>
            <span className="text-sm sm:text-base font-extrabold text-[var(--color-success)] whitespace-nowrap">
              {scheme.benefitAmount || t('cardFinancialSupport')}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleBookmark}
              className={cn(
                'p-2 rounded-lg border border-transparent hover:border-[var(--color-border)] hover:bg-[var(--color-muted)] transition-all cursor-pointer',
                saved
                  ? 'text-[var(--color-accent)]'
                  : 'text-[var(--color-muted-foreground)] hover:text-[var(--color-accent)]'
              )}
              title={saved ? t('btnRemove') : t('cardSaveScheme')}
            >
              <Bookmark className={cn('w-4 h-4', saved && 'fill-[var(--color-accent)] text-[var(--color-accent)]')} />
            </button>

            <Link
              to={`/eligibility?schemeId=${scheme.id}`}
              onClick={(e) => e.stopPropagation()}
              className="btn btn-sm btn-outline text-xs px-2.5"
            >
              <CheckCircle className="w-3.5 h-3.5" />
              <span>{t('btnCheckEligibility')}</span>
            </Link>

            <Link
              to={`/schemes/${scheme.id}`}
              onClick={(e) => e.stopPropagation()}
              className="btn btn-sm btn-primary text-xs px-2.5"
            >
              <span>{t('btnViewDetails')}</span>
              <ArrowRight className="w-3 h-3 ml-0.5" />
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      onClick={() => navigate(`/schemes/${scheme.id}`)}
      className={cn('card-interactive p-4 sm:p-5 flex flex-col justify-between group relative cursor-pointer', fontClass, className)}
    >
      <div>
        {/* Top Badges & Bookmark */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex flex-wrap items-center gap-1.5">
            <Badge variant={scheme.level === 'Central' ? 'primary' : 'secondary'}>
              {levelLabel}
            </Badge>
            {scheme.state && <Badge variant="muted">{scheme.state}</Badge>}
            <Badge variant="muted">{scheme.category}</Badge>
            {showScore && scheme.eligibilityScore !== undefined && (
              <Badge variant="success" dot>
                {scheme.eligibilityScore}% {t('cardMatch')}
              </Badge>
            )}
          </div>
          <button
            type="button"
            onClick={handleBookmark}
            className={cn(
              'p-1.5 rounded-lg border border-transparent hover:border-[var(--color-border)] hover:bg-[var(--color-muted)] transition-all cursor-pointer',
              saved
                ? 'text-[var(--color-accent)]'
                : 'text-[var(--color-muted-foreground)] hover:text-[var(--color-accent)]'
            )}
            title={saved ? t('btnRemove') : t('cardSaveScheme')}
            aria-label={saved ? t('btnRemove') : t('cardSaveScheme')}
          >
            <Bookmark className={cn('w-4 h-4', saved && 'fill-[var(--color-accent)] text-[var(--color-accent)]')} />
          </button>
        </div>

        {/* Title */}
        <Link
          to={`/schemes/${scheme.id}`}
          onClick={(e) => e.stopPropagation()}
          className="block group-hover:text-[var(--color-secondary)] transition-colors"
        >
          <h3 className="font-bold text-base text-[var(--color-primary)] leading-snug">
            {displayTitle}
          </h3>
          {displaySecondaryTitle && (
            <p className="text-xs text-[var(--color-muted-foreground)] mt-0.5">
              {displaySecondaryTitle}
            </p>
          )}
        </Link>

        {/* Ministry */}
        {scheme.ministry && (
          <p className="flex items-center gap-1.5 text-xs text-[var(--color-muted-foreground)] mt-1.5">
            <Building2 className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">{scheme.ministry}</span>
          </p>
        )}

        {/* Description */}
        <p className="text-xs text-[var(--color-foreground)]/80 mt-2.5 line-clamp-2 leading-relaxed">
          {displayDescription}
        </p>
      </div>

      {/* Footer Details & Action */}
      <div className="mt-4 pt-3.5 border-t border-[var(--color-border-subtle)] space-y-3">
        <div className="flex items-center justify-between gap-2">
          <span className="text-[10px] uppercase font-bold tracking-wider text-[var(--color-muted-foreground)] shrink-0">
            {t('cardBenefit')}
          </span>
          <span className="text-xs sm:text-sm font-extrabold text-[var(--color-success)] text-right">
            {scheme.benefitAmount || (
              <span className="inline-flex items-center gap-1 text-[11px] text-[var(--color-secondary)] font-semibold">
                <Sparkles className="w-3 h-3" /> {t('cardSubsidyAid')}
              </span>
            )}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Link
            to={`/eligibility?schemeId=${scheme.id}`}
            className="btn btn-sm btn-outline text-xs px-2.5 py-1.5 justify-center w-full min-w-0"
            onClick={(e) => e.stopPropagation()}
          >
            <CheckCircle className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">{t('btnCheckEligibility')}</span>
          </Link>
          <Link
            to={`/schemes/${scheme.id}`}
            className="btn btn-sm btn-primary text-xs px-2.5 py-1.5 justify-center w-full min-w-0"
            onClick={(e) => e.stopPropagation()}
          >
            <span className="truncate">{t('btnViewDetails')}</span>
            <ArrowRight className="w-3 h-3 ml-0.5 shrink-0" />
          </Link>
        </div>
      </div>
    </div>
  )
}
