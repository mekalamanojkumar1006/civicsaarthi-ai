import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Sparkles,
  Bookmark,
  CheckCircle2,
  FileCheck2,
  Bot,
  Search,
  Clock,
  ChevronRight,
  TrendingUp,
  FileText,
  UserCheck,
  Building2,
  GraduationCap,
  HeartPulse,
  Briefcase,
  HelpCircle,
  Loader2,
} from 'lucide-react'
import { ROUTES } from '@/config/app.config'
import { Badge } from '@/components/ui/Badge'
import { StatCard } from '@/components/common/StatCard'
import { SchemeCard, SchemeCardData } from '@/components/schemes/SchemeCard'
import { useApp } from '@/context/AppContext'
import { useAuth } from '@/context/AuthContext'
import { useLanguage } from '@/context/LanguageContext'
import { dbService } from '@/services/dbService'
import type { EligibilityAssessment } from '@/types/supabase'
import { cn } from '@/lib/utils'

const sampleRecommendedSchemes: SchemeCardData[] = [
  {
    id: 'pm-surya-ghar',
    title: 'PM Surya Ghar: Muft Bijli Yojana',
    titleTelugu: 'పీఎం సూర్య ఘర్: ఉచిత విద్యుత్ యోజన',
    titleHindi: 'पीएम सूर्य घर: मुफ्त बिजली योजना',
    description: 'Subsidies up to ₹78,000 for installing rooftop solar panels, providing up to 300 units of free electricity every month.',
    ministry: 'Ministry of New and Renewable Energy',
    level: 'Central',
    category: 'Energy & Housing',
    benefitAmount: '₹78,000 Subsidy',
    eligibilityScore: 98,
    isSaved: false,
  },
  {
    id: 'kalyana-lakshmi',
    title: 'Kalyana Lakshmi / Shaadi Mubarak',
    titleTelugu: 'కళ్యాణ లక్ష్మి / షాదీ ముబారక్ పథకం',
    titleHindi: 'कल्याणा लक्ष्मी / शादी मुबारक योजना',
    description: 'Financial assistance of ₹1,00,116 to brides from economically weaker sections, SC/ST, BC, and minority communities.',
    ministry: 'BC & Minority Welfare Dept, Telangana',
    level: 'State',
    category: 'Women & Family',
    benefitAmount: '₹1,00,116 One-Time',
    eligibilityScore: 95,
    isSaved: true,
  },
  {
    id: 'pm-mudra',
    title: 'Pradhan Mantri MUDRA Yojana (PMMY)',
    titleTelugu: 'ప్రధాన మంత్రి ముద్రా యోజన',
    titleHindi: 'प्रधानमंत्री मुद्रा योजना (PMMY)',
    description: 'Collateral-free business loans up to ₹20 Lakh under Shishu, Kishor, and Tarun categories for non-corporate micro enterprises.',
    ministry: 'Ministry of Finance, GoI',
    level: 'Central',
    category: 'Employment & MSME',
    benefitAmount: 'Up to ₹20,00,000',
    eligibilityScore: 89,
    isSaved: false,
  },
]

const recentAssessments = [
  {
    id: '1',
    schemeNameEn: 'PM Awas Yojana (Gramin)',
    schemeNameTe: 'పీఎం ఆవాస్ యోజన (గ్రామీణ్)',
    schemeNameHi: 'पीएम आवास योजना (ग्रामीण)',
    dateEn: 'Sample simulation',
    dateTe: 'నమూనా లెక్కింపు',
    dateHi: 'नमूना सिमुलेशन',
    statusKey: 'elLikelyEligible' as const,
    matchScore: 96,
    badgeVariant: 'success' as const,
  },
  {
    id: '2',
    schemeNameEn: 'Post-Matric Scholarship Scheme',
    schemeNameTe: 'పోస్ట్-మెట్రిక్ స్కాలర్‌షిప్ పథకం',
    schemeNameHi: 'पोस्ट-मैट्रिक छात्रवृत्ति योजना',
    dateEn: 'Sample simulation',
    dateTe: 'నమూనా లెక్కింపు',
    dateHi: 'नमूना सिमुलेशन',
    statusKey: 'elLikelyEligible' as const,
    matchScore: 91,
    badgeVariant: 'info' as const,
  },
  {
    id: '3',
    schemeNameEn: 'Stand-Up India Scheme',
    schemeNameTe: 'స్టాండ్-అప్ ఇండియా పథకం',
    schemeNameHi: 'स्टैंड-अप इंडिया योजना',
    dateEn: '14 Nov 2026',
    dateTe: '14 నవంబర్ 2026',
    dateHi: '14 नवंबर 2026',
    statusKey: 'elConditional' as const,
    matchScore: 78,
    badgeVariant: 'warning' as const,
  },
]

const recentChats = [
  {
    id: 'chat-1',
    titleEn: 'Documents needed for Rythu Bharosa in Warangal',
    titleTe: 'వరంగల్‌లో రైతు భరోసాకు అవసరమైన పత్రాలు',
    titleHi: 'वारंगल में रैतु भरोसा के लिए आवश्यक दस्तावेज़',
    timestampEn: '2 hours ago',
    timestampTe: '2 గంటల క్రితం',
    timestampHi: '2 घंटे पहले',
    messagesCount: 4,
  },
  {
    id: 'chat-2',
    titleEn: 'Difference between PM-JAY and Aarogyasri coverage',
    titleTe: 'పీఎం-జేఏవై మరియు ఆరోగ్యశ్రీ సేవల మధ్య తేడాలు',
    titleHi: 'पीएम-जय और आरोग्यश्री के कवरेज में अंतर',
    timestampEn: 'Yesterday',
    timestampTe: 'నిన్న',
    timestampHi: 'कल',
    messagesCount: 6,
  },
  {
    id: 'chat-3',
    titleEn: 'Income certificate validity rules in Telangana',
    titleTe: 'తెలంగాణలో ఆదాయ ధ్రువీకరణ పత్రం చెల్లుబాటు నిబంధనలు',
    titleHi: 'तेलंगाना में आय प्रमाण पत्र की वैधता के नियम',
    timestampEn: '3 days ago',
    timestampTe: '3 రోజుల క్రితం',
    timestampHi: '3 दिन पहले',
    messagesCount: 3,
  },
]

const categoryShortcutItems = [
  { labelEn: 'Agriculture & Irrigation', labelTe: 'వ్యవసాయం & సాగునీరు', labelHi: 'कृषि एवं सिंचाई', icon: Building2, val: 'Agriculture' },
  { labelEn: 'Higher Education & Scholarships', labelTe: 'ఉన్నత విద్య & స్కాలర్‌షిప్‌లు', labelHi: 'उच्च शिक्षा एवं छात्रवृत्ति', icon: GraduationCap, val: 'Education' },
  { labelEn: 'Arogyasri & Health Insurance', labelTe: 'ఆరోగ్యశ్రీ & ఆరోగ్య బీమా', labelHi: 'आरोग्यश्री एवं स्वास्थ्य बीमा', icon: HeartPulse, val: 'Health' },
  { labelEn: 'Self-Help Groups (SHG)', labelTe: 'స్వయం సహాయక సంఘాలు (డ్వాక్రా)', labelHi: 'स्वयं सहायता समूह (एसएचजी)', icon: Briefcase, val: 'Women & Child' },
  { labelEn: 'Senior Citizen Pensions', labelTe: 'వృద్ధాప్య పెన్షన్లు', labelHi: 'वरिष्ठ नागरिक पेंशन', icon: HelpCircle, val: 'Social Welfare' },
]

export default function DashboardPage() {
  const { profile, savedSchemes, profileCompletionPercentage, isDatabaseSynced, databaseSyncStatus } = useApp()
  const { user } = useAuth()
  const { t, isTelugu, isHindi, fontClass } = useLanguage()

  const [liveAssessments, setLiveAssessments] = useState<EligibilityAssessment[]>([])
  const [isAssessmentsLoading, setIsAssessmentsLoading] = useState<boolean>(false)

  useEffect(() => {
    let isMounted = true
    if (user && isDatabaseSynced) {
      setIsAssessmentsLoading(true)
      dbService.getAssessments(user.id).then((res) => {
        if (!isMounted) return
        setIsAssessmentsLoading(false)
        if (res.success && res.data) {
          setLiveAssessments(res.data)
        }
      })
    } else {
      setLiveAssessments([])
    }
    return () => {
      isMounted = false
    }
  }, [user, isDatabaseSynced])

  return (
    <div className={cn('p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto animate-fade-in', fontClass)}>
      {/* ── PERSONALIZED GREETING & PROFILE COMPLETION HERO ── */}
      <div className="card gradient-brand text-white p-6 sm:p-8 relative overflow-hidden shadow-lg">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial from-[var(--color-secondary)]/30 to-transparent pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center gap-2">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 text-xs text-[var(--color-accent)] font-semibold">
                <Sparkles className="w-3.5 h-3.5" />{' '}
                {isTelugu ? 'పౌర సంక్షేమ కేంద్రం' : isHindi ? 'नागरिक कल्याण केंद्र' : 'Citizen Hub'}
              </div>
              {profile.isDemoProfile ? (
                <span className="badge badge-warning text-[10px]">
                  {isTelugu ? 'నమూనా ప్రొఫైల్' : isHindi ? 'डेमो प्रोफाइल सक्रिय' : 'Demo Profile Active'}
                </span>
              ) : isDatabaseSynced ? (
                <span className="badge badge-success text-[10px]">
                  {isTelugu ? 'డేటాబేస్ సమన్వయం' : isHindi ? 'सुपाबेस डेटाबेस समन्वयित' : 'Supabase Database Synced'}
                </span>
              ) : (
                <span className="badge badge-warning text-[10px]">
                  {isTelugu ? 'లోకల్ డేటా మోడ్' : isHindi ? 'स्थानीय डेटा मोड' : 'Local Data Mode'}
                </span>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white leading-tight">
              {t('dashGreeting')}, {profile.fullName || (isTelugu ? 'పౌరుడు' : isHindi ? 'नागरिक' : 'Citizen')} 👋
            </h1>
            <p className="text-xs sm:text-sm text-white/80 leading-relaxed">
              {t('subDashboard')}
            </p>
            <p className="text-xs text-white/70">
              {profile.fullName
                ? `${profile.state || (isTelugu ? 'భారతదేశం' : isHindi ? 'भारत' : 'India')} • ${profile.district || (isTelugu ? 'జిల్లా' : isHindi ? 'ज़िला' : 'District')} • ${profile.occupation || (isTelugu ? 'పౌరుడు' : isHindi ? 'नागरिक' : 'Citizen')}`
                : (isTelugu
                    ? 'నమూనా డ్యాష్‌బోర్డ్ • అర్హతలను పరిశీలించడానికి ప్రొఫైల్ వివరాలను నమోదు చేయండి'
                    : isHindi
                    ? 'डेमो डैशबोर्ड • योग्यता जांचने के लिए प्रोफाइल विवरण भरें'
                    : 'Demonstration Dashboard • Setup profile or load demo data to check simulated eligibility')}
            </p>
          </div>

          {/* Profile Completion Box */}
          <div className="card bg-white/10 backdrop-blur-md border border-white/20 p-4 sm:p-5 rounded-2xl w-full lg:w-80 shrink-0">
            <div className="flex items-center justify-between text-xs font-bold text-white mb-2">
              <span className="flex items-center gap-1.5">
                <UserCheck className="w-4 h-4 text-[var(--color-accent)]" /> {t('profileCompleteness')}
              </span>
              <span className="text-[var(--color-accent)]">{profileCompletionPercentage}%</span>
            </div>

            {/* Progress bar */}
            <div className="w-full bg-black/20 rounded-full h-2 overflow-hidden mb-3">
              <div
                className="bg-[var(--color-accent)] h-full rounded-full transition-all duration-500"
                style={{ width: `${profileCompletionPercentage}%` }}
              />
            </div>

            <p className="text-[11px] text-white/75 leading-tight mb-3">
              {profileCompletionPercentage < 100
                ? (isTelugu
                    ? 'మరిన్ని పథకాల అర్హత కోసం మీ విద్య మరియు భూమి వివరాలను జోడించండి.'
                    : isHindi
                    ? 'अधिक लक्षित योजनाओं की पात्रता के लिए भूमि व शिक्षा विवरण जोड़ें।'
                    : 'Update your landholding or education to unlock additional targeted schemes.')
                : (isTelugu
                    ? 'అన్ని వివరాలు పూర్తి చేయబడ్డాయి మరియు ధ్రువీకరించబడ్డాయి!'
                    : isHindi
                    ? 'सभी जनसांख्यिकीय विवरण पूरे और सत्यापित हैं!'
                    : 'All demographic parameters completed and verified!')}
            </p>

            <Link
              to={ROUTES.PROFILE}
              className="btn btn-sm btn-accent w-full text-xs font-bold shadow-xs"
            >
              {t('navProfile')}
            </Link>
          </div>
        </div>
      </div>

      {/* ── STATS ROW ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label={t('dashMatchedSchemes')}
          value="14"
          subtext={t('dashUpdatedToday')}
          trend={{ value: t('dashNewBadge'), isPositive: true }}
          icon={<CheckCircle2 className="w-5 h-5" />}
          accentColor="secondary"
        />
        <StatCard
          label={t('dashSavedCount')}
          value={savedSchemes.length}
          subtext={t('dashSavedPortal')}
          icon={<Bookmark className="w-5 h-5" />}
          accentColor="accent"
        />
        <StatCard
          label={t('dashDocsReady')}
          value="5 / 7"
          subtext={t('dashDocsVerified')}
          trend={{ value: t('dashDocsComplete'), isPositive: true }}
          icon={<FileCheck2 className="w-5 h-5" />}
          accentColor="success"
        />
        <StatCard
          label={t('dashEstBenefit')}
          value="₹84,000"
          subtext={t('dashBenefitSub')}
          icon={<TrendingUp className="w-5 h-5" />}
          accentColor="primary"
        />
      </div>

      {/* ── QUICK ACTIONS ROW ── */}
      <div className="card p-5">
        <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--color-muted-foreground)] mb-3">
          {t('dashQuickActions')}
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Link
            to={ROUTES.ELIGIBILITY}
            className="p-3.5 rounded-xl border border-[var(--color-border)] hover:border-[var(--color-secondary)] hover:bg-[var(--color-muted)] transition-all flex items-center gap-3 group"
          >
            <div className="w-9 h-9 rounded-lg bg-[var(--color-secondary-50)] text-[var(--color-secondary)] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-[var(--color-foreground)] leading-tight truncate">{t('navEligibility')}</p>
              <p className="text-[10px] text-[var(--color-muted-foreground)] truncate mt-0.5">{t('dashQuickTest')}</p>
            </div>
          </Link>

          <Link
            to={ROUTES.ASSISTANT}
            className="p-3.5 rounded-xl border border-[var(--color-border)] hover:border-[var(--color-secondary)] hover:bg-[var(--color-muted)] transition-all flex items-center gap-3 group"
          >
            <div className="w-9 h-9 rounded-lg bg-[var(--color-accent-50)] text-[var(--color-accent-800)] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <Bot className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-[var(--color-foreground)] leading-tight truncate">{t('navAssistant')}</p>
              <p className="text-[10px] text-[var(--color-muted-foreground)] truncate mt-0.5">{t('dashAiChat')}</p>
            </div>
          </Link>

          <Link
            to={ROUTES.DOCUMENT_ASSISTANT}
            className="p-3.5 rounded-xl border border-[var(--color-border)] hover:border-[var(--color-secondary)] hover:bg-[var(--color-muted)] transition-all flex items-center gap-3 group"
          >
            <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <FileText className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-[var(--color-foreground)] leading-tight truncate">{t('navDocumentAssistant')}</p>
              <p className="text-[10px] text-[var(--color-muted-foreground)] truncate mt-0.5">{t('dashPdfAi')}</p>
            </div>
          </Link>

          <Link
            to={ROUTES.COMPARE}
            className="p-3.5 rounded-xl border border-[var(--color-border)] hover:border-[var(--color-secondary)] hover:bg-[var(--color-muted)] transition-all flex items-center gap-3 group"
          >
            <div className="w-9 h-9 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <Search className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-[var(--color-foreground)] leading-tight truncate">{t('navCompare')}</p>
              <p className="text-[10px] text-[var(--color-muted-foreground)] truncate mt-0.5">{t('dashSideBySide')}</p>
            </div>
          </Link>
        </div>
      </div>

      {/* ── RECOMMENDED SCHEMES SECTION ── */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-[var(--color-primary)]">
              {profile.fullName ? `${t('dashTopSchemes')} (${profile.fullName})` : t('dashTopSchemes')}
            </h2>
            <p className="text-xs text-[var(--color-muted-foreground)]">
              {t('dashExploreDesc')}
            </p>
          </div>
          <Link
            to={ROUTES.SCHEMES}
            className="text-xs font-bold text-[var(--color-secondary)] hover:underline inline-flex items-center gap-1"
          >
            {t('navSchemes')} <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {sampleRecommendedSchemes.map((scheme) => (
            <SchemeCard key={scheme.id} scheme={scheme} />
          ))}
        </div>
      </div>

      {/* ── TWO COLUMN LOWER SECTION (Assessments & Recent Chats) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Recent Eligibility Assessments */}
        <div className="card p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[var(--color-border-subtle)]">
            <h3 className="font-bold text-sm text-[var(--color-primary)] flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[var(--color-secondary)]" />
              {t('dashRecentAssessments')}
            </h3>
            <Link to={ROUTES.ELIGIBILITY} className="text-xs font-semibold text-[var(--color-secondary)] hover:underline">
              {t('elNewCheck')}
            </Link>
          </div>

          <div className="space-y-3">
            {isAssessmentsLoading ? (
              <div className="p-6 text-center text-xs text-[var(--color-muted-foreground)] flex items-center justify-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-[var(--color-secondary)]" />
                <span>
                  {isTelugu
                    ? 'ఫలితాలు లోడ్ అవుతున్నాయి...'
                    : isHindi
                    ? 'सहेजे गए मूल्यांकन लोड हो रहे हैं...'
                    : 'Loading your saved evaluations...'}
                </span>
              </div>
            ) : liveAssessments.length > 0 ? (
              liveAssessments.slice(0, 3).map((item) => {
                const res = (item.assessment_result || {}) as any
                const formattedDate = new Date(item.created_at).toLocaleDateString(
                  isTelugu ? 'te-IN' : isHindi ? 'hi-IN' : 'en-IN',
                  {
                    day: 'numeric',
                    month: 'short',
                  }
                )
                const isEligible = res.status === 'Likely Eligible (Self-Reported)'
                const isConditional = res.status === 'Conditional / Additional Verification Required'

                const statusLabel = isEligible
                  ? t('elLikelyEligible')
                  : isConditional
                  ? t('elConditional')
                  : t('elLikelyIneligible')

                return (
                  <Link
                    key={item.id}
                    to={ROUTES.ELIGIBILITY}
                    className="p-3 rounded-xl border border-[var(--color-border)] hover:bg-[var(--color-muted)] transition-colors flex items-center justify-between gap-3 block group"
                  >
                    <div>
                      <p className="text-xs font-bold text-[var(--color-foreground)] leading-tight group-hover:text-[var(--color-primary)]">
                        {res.schemeTitle || item.scheme_id}
                      </p>
                      <p className="text-[11px] text-[var(--color-muted-foreground)] flex items-center gap-1 mt-0.5">
                        <Clock className="w-3 h-3" /> {formattedDate}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <Badge
                        variant={isEligible ? 'success' : isConditional ? 'warning' : 'danger'}
                        dot
                      >
                        {res.score || 0}% {t('cardMatch')}
                      </Badge>
                      <span className="text-[10px] text-[var(--color-muted-foreground)] block mt-0.5 font-medium truncate max-w-[130px]">
                        {statusLabel}
                      </span>
                    </div>
                  </Link>
                )
              })
            ) : (
              recentAssessments.map((item) => {
                const schemeName = isTelugu ? item.schemeNameTe : isHindi ? item.schemeNameHi : item.schemeNameEn
                const date = isTelugu ? item.dateTe : isHindi ? item.dateHi : item.dateEn
                const status = t(item.statusKey)
                return (
                  <div
                    key={item.id}
                    className="p-3 rounded-xl border border-[var(--color-border)] hover:bg-[var(--color-muted)] transition-colors flex items-center justify-between gap-3"
                  >
                    <div>
                      <p className="text-xs font-bold text-[var(--color-foreground)] leading-tight">
                        {schemeName}
                      </p>
                      <p className="text-[11px] text-[var(--color-muted-foreground)] flex items-center gap-1 mt-0.5">
                        <Clock className="w-3 h-3" /> {date}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <Badge variant={item.badgeVariant} dot>
                        {item.matchScore}% {t('cardMatch')}
                      </Badge>
                      <span className="text-[10px] text-[var(--color-muted-foreground)] block mt-0.5 font-medium">
                        {status}
                      </span>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>

        {/* Right: Recent Conversations with AI */}
        <div className="card p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[var(--color-border-subtle)]">
            <h3 className="font-bold text-sm text-[var(--color-primary)] flex items-center gap-2">
              <Bot className="w-4 h-4 text-[var(--color-secondary)]" />
              {t('dashRecentChatsTitle')}
            </h3>
            <Link to={ROUTES.ASSISTANT} className="text-xs font-semibold text-[var(--color-secondary)] hover:underline">
              {t('dashOpenChat')}
            </Link>
          </div>

          <div className="space-y-3">
            {recentChats.map((chat) => {
              const title = isTelugu ? chat.titleTe : isHindi ? chat.titleHi : chat.titleEn
              const timestamp = isTelugu ? chat.timestampTe : isHindi ? chat.timestampHi : chat.timestampEn
              return (
                <Link
                  key={chat.id}
                  to={ROUTES.ASSISTANT}
                  className="p-3 rounded-xl border border-[var(--color-border)] hover:border-[var(--color-secondary)] hover:bg-[var(--color-muted)] transition-colors flex items-center justify-between gap-3 block group"
                >
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-[var(--color-foreground)] truncate group-hover:text-[var(--color-secondary)] transition-colors">
                      {title}
                    </p>
                    <p className="text-[11px] text-[var(--color-muted-foreground)] flex items-center gap-1 mt-0.5">
                      <Clock className="w-3 h-3" /> {timestamp} • {chat.messagesCount} {t('dashAnswersSuffix')}
                    </p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[var(--color-muted-foreground)] group-hover:translate-x-0.5 transition-transform shrink-0" />
                </Link>
              )
            })}
          </div>
        </div>
      </div>

      {/* ── SCHEME CATEGORY SHORTCUTS ── */}
      <div className="card p-5 bg-[var(--color-surface)]">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--color-muted-foreground)]">
            {t('dashExploreCategories')}
          </h3>
          <Link to={ROUTES.SCHEMES} className="text-xs font-semibold text-[var(--color-secondary)] hover:underline">
            {t('dashAllCategoriesArrow')}
          </Link>
        </div>
        <div className="flex flex-wrap gap-2">
          {categoryShortcutItems.map((cat) => {
            const Icon = cat.icon
            const label = isTelugu ? cat.labelTe : isHindi ? cat.labelHi : cat.labelEn
            return (
              <Link
                key={cat.val}
                to={`${ROUTES.SCHEMES}?category=${encodeURIComponent(cat.val)}`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] hover:border-[var(--color-secondary)] hover:bg-white text-xs font-semibold text-[var(--color-foreground)] transition-all"
              >
                <Icon className="w-3.5 h-3.5 text-[var(--color-secondary)]" />
                <span>{label}</span>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}
