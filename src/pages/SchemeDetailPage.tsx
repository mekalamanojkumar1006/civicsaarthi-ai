import { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  Bookmark,
  CheckCircle2,
  ExternalLink,
  GitCompare,
  Building2,
  Phone,
  ShieldCheck,
  AlertTriangle,
  FileText,
  Clock,
  Sparkles,
  Share2,
  Check,
  Landmark,
} from 'lucide-react'
import { CENTRAL_AND_STATE_SCHEMES } from '@/data/schemesData'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { useApp } from '@/context/AppContext'
import { useLanguage } from '@/context/LanguageContext'

export default function SchemeDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { isSchemeSaved, toggleSaveScheme } = useApp()
  const { t, isTelugu, isHindi, fontClass } = useLanguage()
  const [copiedLink, setCopiedLink] = useState(false)

  const scheme = CENTRAL_AND_STATE_SCHEMES.find((s) => s.id === id) || CENTRAL_AND_STATE_SCHEMES[0]
  const isSaved = isSchemeSaved(scheme.id)

  const handleCopyShare = () => {
    navigator.clipboard.writeText(window.location.href)
    setCopiedLink(true)
    setTimeout(() => setCopiedLink(false), 2000)
  }

  const primaryTitle = isTelugu && scheme.titleTelugu
    ? scheme.titleTelugu
    : isHindi && scheme.titleHindi
    ? scheme.titleHindi
    : scheme.title
  const secondaryTitle = isTelugu && scheme.titleTelugu
    ? scheme.title
    : isHindi && scheme.titleHindi
    ? scheme.title
    : scheme.titleTelugu
  const levelLabel = scheme.level === 'Central' ? t('cardCentralScheme') : t('cardStateScheme')

  return (
    <div className={`p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto space-y-6 animate-fade-in ${fontClass}`}>
      {/* ── BREADCRUMB & BACK BUTTON ── */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--color-muted-foreground)] hover:text-[var(--color-primary)] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t('btnBack')}</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleCopyShare}
            className="btn btn-sm btn-ghost text-xs text-[var(--color-muted-foreground)] cursor-pointer"
          >
            {copiedLink ? <Check className="w-3.5 h-3.5 text-[var(--color-success)]" /> : <Share2 className="w-3.5 h-3.5" />}
            <span>{copiedLink ? t('detailLinkCopied') : t('detailShare')}</span>
          </button>
        </div>
      </div>

      {/* ── DEMO NOTICE BANNER ── */}
      <div className="flex items-center gap-2 p-3 rounded-xl bg-amber-500/10 border border-amber-500/25 text-amber-900 text-xs font-medium">
        <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
        <span>
          {isTelugu ? (
            <>
              <strong>అధికారిక నిబంధనలు:</strong> పథకం నిబంధనలు మరియు ప్రయోజనాలు అధికారిక మార్గదర్శకాల ఆధారంగా సంకలనం చేయబడ్డాయి. దరఖాస్తు చేయడానికి ముందు అధికారిక పోర్టల్‌లో సరిచూసుకోండి.
            </>
          ) : isHindi ? (
            <>
              <strong>आधिकारिक दिशानिर्देश:</strong> योजना के नियम और लाभ आधिकारिक सरकारी दिशानिर्देशों के आधार पर संकलित किए गए हैं। आवेदन करने से पहले नीचे दिए गए आधिकारिक पोर्टल पर सत्यापन अवश्य करें।
            </>
          ) : (
            <>
              <strong>Demonstration Record:</strong> Scheme rules and benefits are compiled for demonstration from public ministry guidelines and portals. Prior to applying, always cross-verify with the official ministry portal linked below.
            </>
          )}
        </span>
      </div>

      {/* ── SCHEME HEADER CARD ── */}
      <div className="card p-6 sm:p-8 relative overflow-hidden bg-white shadow-md">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <Badge variant={scheme.level === 'Central' ? 'primary' : 'secondary'}>
            {levelLabel}
          </Badge>
          {scheme.state && <Badge variant="muted">{scheme.state}</Badge>}
          <Badge variant="muted">{scheme.category}</Badge>
          <Badge variant="warning" dot>
            {scheme.verificationStatus}
          </Badge>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--color-primary)] tracking-tight">
          {primaryTitle}
        </h1>
        {secondaryTitle && (
          <p className="text-base text-[var(--color-muted-foreground)] mt-1 font-medium">
            {secondaryTitle}
          </p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-6 pt-6 border-t border-[var(--color-border-subtle)] text-xs">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-muted-foreground)] block">
              {t('detailMinistry')}
            </span>
            <span className="font-semibold text-[var(--color-foreground)] flex items-center gap-1.5 mt-0.5">
              <Building2 className="w-3.5 h-3.5 text-[var(--color-secondary)] shrink-0" />
              {scheme.ministry}
            </span>
          </div>

          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-muted-foreground)] block">
              {t('detailPrimaryBenefit')}
            </span>
            <span className="font-extrabold text-sm text-[var(--color-success)] mt-0.5 block">
              {scheme.benefitAmount} ({scheme.benefitFrequency})
            </span>
          </div>

          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-muted-foreground)] block">
              {t('detailSourceStatus')}
            </span>
            <span className="font-medium text-[var(--color-muted-foreground)] flex items-center gap-1 mt-0.5">
              <Clock className="w-3.5 h-3.5 text-[var(--color-secondary)]" />
              {scheme.sourceMetadata.lastVerifiedDate ? `${t('detailVerified')}: ${scheme.sourceMetadata.lastVerifiedDate}` : t('detailSourceStatus')}
            </span>
          </div>
        </div>

        {/* Action Toolbar */}
        <div className="flex flex-wrap items-center gap-3 mt-6 pt-6 border-t border-[var(--color-border-subtle)]">
          <Link
            to={`/eligibility?schemeId=${scheme.id}`}
            className="btn btn-primary text-xs sm:text-sm font-bold shadow-sm"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{t('btnCheckEligibility')}</span>
          </Link>

          <Button
            variant="outline"
            size="md"
            onClick={() => toggleSaveScheme(scheme.id)}
            leftIcon={<Bookmark className={isSaved ? 'fill-[var(--color-accent)] text-[var(--color-accent)]' : ''} />}
            className="text-xs sm:text-sm font-semibold cursor-pointer"
          >
            <span>{isSaved ? t('btnSaved') : t('btnSave')}</span>
          </Button>

          <Link
            to={`/compare?add=${scheme.id}`}
            className="btn btn-outline text-xs sm:text-sm font-semibold"
          >
            <GitCompare className="w-4 h-4" />
            <span>{t('navCompare')}</span>
          </Link>

          <a
            href={scheme.officialPortalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-secondary text-xs sm:text-sm font-bold ml-auto"
          >
            <span>{t('btnApply')}</span>
            <ExternalLink className="w-3.5 h-3.5 ml-1" />
          </a>
        </div>
      </div>

      {/* ── MAIN CONTENT GRID ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Details, Objectives, Benefits, Process */}
        <div className="lg:col-span-2 space-y-6">
          {/* Description & Objectives */}
          <div className="card p-6 space-y-4">
            <h2 className="text-base font-bold text-[var(--color-primary)] flex items-center gap-2">
              <Landmark className="w-5 h-5 text-[var(--color-secondary)]" />
              {t('schemeOverview')}
            </h2>
            <p className="text-sm text-[var(--color-foreground)]/90 leading-relaxed">
              {scheme.detailedDescription}
            </p>

            <div className="mt-4 pt-4 border-t border-[var(--color-border-subtle)]">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--color-muted-foreground)] mb-2.5">
                {t('detailCoreObjectives')}
              </h3>
              <ul className="space-y-2 text-xs sm:text-sm text-[var(--color-foreground)]/90">
                {scheme.objectives.map((obj, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[var(--color-secondary)] shrink-0 mt-0.5" />
                    <span>{obj}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Benefits Structure */}
          <div className="card p-6 space-y-4">
            <h2 className="text-base font-bold text-[var(--color-primary)] flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[var(--color-accent)]" />
              {t('schemeKeyBenefits')}
            </h2>
            <div className="p-3.5 rounded-xl bg-[var(--color-success-bg)]/50 border border-[var(--color-success-border)] text-xs text-emerald-900 font-semibold">
              {t('detailBenefitGuarantee')}: {scheme.benefitAmount} ({scheme.benefitFrequency})
            </div>
            <ul className="space-y-2 text-xs sm:text-sm text-[var(--color-foreground)]/90">
              {scheme.benefitsList.map((b, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-success)] mt-2 shrink-0" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Application Process */}
          <div className="card p-6 space-y-4">
            <h2 className="text-base font-bold text-[var(--color-primary)] flex items-center gap-2">
              <FileText className="w-5 h-5 text-[var(--color-secondary)]" />
              {t('schemeHowToApply')}
            </h2>
            <div className="space-y-4 relative before:absolute before:left-3.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-[var(--color-border)]">
              {scheme.applicationProcess.map((step) => (
                <div key={step.stepNumber} className="relative flex items-start gap-4 pl-8">
                  <div className="absolute left-1.5 top-0 w-5 h-5 rounded-full bg-[var(--color-primary)] text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                    {step.stepNumber}
                  </div>
                  <div>
                    <h3 className="text-xs sm:text-sm font-bold text-[var(--color-foreground)]">
                      {step.title}
                    </h3>
                    <p className="text-xs text-[var(--color-muted-foreground)] mt-0.5 leading-relaxed">
                      {step.description}
                    </p>
                    {step.portalUrl && (
                      <a
                        href={step.portalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-[var(--color-secondary)] hover:underline mt-1"
                      >
                        {t('detailOfficialSubmissionLink')} <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Col: Eligibility & Documents Requirements */}
        <div className="space-y-6">
          {/* Eligibility Checklist */}
          <div className="card p-5 space-y-4">
            <h3 className="text-sm font-bold text-[var(--color-primary)] pb-2 border-b border-[var(--color-border-subtle)]">
              {t('detailEligibilityConditions')}
            </h3>
            <div className="space-y-2.5 text-xs">
              {scheme.eligibility.minAge && (
                <div className="flex justify-between py-1 border-b border-[var(--color-border-subtle)]">
                  <span className="text-[var(--color-muted-foreground)]">{t('detailMinAge')}:</span>
                  <span className="font-semibold text-[var(--color-foreground)]">{scheme.eligibility.minAge} {isTelugu ? 'సంవత్సరాలు' : isHindi ? 'वर्ष' : 'Years'}</span>
                </div>
              )}
              {scheme.eligibility.maxAge && (
                <div className="flex justify-between py-1 border-b border-[var(--color-border-subtle)]">
                  <span className="text-[var(--color-muted-foreground)]">{t('detailMaxAge')}:</span>
                  <span className="font-semibold text-[var(--color-foreground)]">{scheme.eligibility.maxAge} {isTelugu ? 'సంవత్సరాలు' : isHindi ? 'वर्ष' : 'Years'}</span>
                </div>
              )}
              {scheme.eligibility.gender && scheme.eligibility.gender !== 'All' && (
                <div className="flex justify-between py-1 border-b border-[var(--color-border-subtle)]">
                  <span className="text-[var(--color-muted-foreground)]">{t('detailTargetGender')}:</span>
                  <span className="font-semibold text-[var(--color-foreground)]">{scheme.eligibility.gender} {isTelugu ? 'మాత్రమే' : isHindi ? 'केवल' : 'Only'}</span>
                </div>
              )}
              {scheme.eligibility.maxAnnualIncome && (
                <div className="flex justify-between py-1 border-b border-[var(--color-border-subtle)]">
                  <span className="text-[var(--color-muted-foreground)]">{t('detailIncomeCeiling')}:</span>
                  <span className="font-semibold text-[var(--color-foreground)]">₹{scheme.eligibility.maxAnnualIncome.toLocaleString('en-IN')} / {isTelugu ? 'సంవత్సరానికి' : isHindi ? 'प्रति वर्ष' : 'Year'}</span>
                </div>
              )}
              {scheme.eligibility.residenceRequired && (
                <div className="flex justify-between py-1 border-b border-[var(--color-border-subtle)]">
                  <span className="text-[var(--color-muted-foreground)]">{t('detailDomicile')}:</span>
                  <span className="font-semibold text-[var(--color-foreground)]">{scheme.eligibility.residenceRequired}</span>
                </div>
              )}

              <div className="pt-2">
                <span className="font-bold text-[var(--color-foreground)] block mb-1.5">{t('detailSpecificTerms')}:</span>
                <ul className="space-y-1.5 text-[11px] text-[var(--color-muted-foreground)] leading-relaxed">
                  {scheme.eligibility.specificConditions.map((cond, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-[var(--color-secondary)] font-bold">•</span>
                      <span>{cond}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <Link
              to={`/eligibility?schemeId=${scheme.id}`}
              className="btn btn-sm btn-primary w-full text-xs font-bold mt-2"
            >
              {t('detailVerifyCompatibility')}
            </Link>
          </div>

          {/* Required Documents List */}
          <div className="card p-5 space-y-4">
            <h3 className="text-sm font-bold text-[var(--color-primary)] pb-2 border-b border-[var(--color-border-subtle)]">
              {t('detailRequiredDocs')}
            </h3>
            <div className="space-y-3">
              {scheme.requiredDocuments.map((doc, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-[var(--color-background)] border border-[var(--color-border)] text-xs">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-[var(--color-foreground)] leading-tight">{doc.name}</span>
                    <span className="badge badge-muted text-[10px]">{doc.type}</span>
                  </div>
                  <p className="text-[11px] text-[var(--color-muted-foreground)] leading-snug">
                    {doc.description}
                  </p>
                  <p className="text-[10px] text-[var(--color-secondary)] mt-1.5 font-semibold">
                    {t('detailIssuingAuthority')}: {doc.issuingAuthority}
                  </p>
                </div>
              ))}
            </div>

            <Link
              to={`/documents?schemeId=${scheme.id}`}
              className="btn btn-sm btn-outline w-full text-xs font-semibold"
            >
              {t('detailOpenReadinessChecklist')}
            </Link>
          </div>

          {/* Official Source & Transparency Card */}
          <div className="card p-5 bg-[var(--color-primary-50)] border border-[var(--color-primary-100)] space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-[var(--color-primary)]">
              <ShieldCheck className="w-4 h-4 text-[var(--color-secondary)]" />
              {t('detailSourceVerification')}
            </div>
            
            <div className="space-y-1.5 text-xs">
              <p className="text-[11px] text-[var(--color-foreground)] leading-snug">
                <strong>{t('detailSource')}:</strong> {scheme.sourceMetadata.sourceTitle}
              </p>
              <p className="text-[11px] text-[var(--color-muted-foreground)]">
                <strong>{t('detailType')}:</strong> {scheme.sourceMetadata.sourceType}
              </p>
              <p className="text-[11px] text-[var(--color-muted-foreground)]">
                <strong>{t('labelStatus')}:</strong> <span className="text-amber-800 font-semibold">{scheme.verificationStatus}</span>
              </p>
            </div>

            {scheme.helplineNumber && (
              <p className="text-xs text-[var(--color-foreground)] flex items-center gap-1.5 pt-1 border-t border-[var(--color-border-subtle)]">
                <Phone className="w-3.5 h-3.5 text-[var(--color-secondary)]" />
                {t('detailHelpline')}: <strong className="font-mono">{scheme.helplineNumber}</strong>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
