import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Search,
  ArrowRight,
  Bot,
  CheckCircle2,
  Building2,
  GraduationCap,
  HeartPulse,
  Home,
  Briefcase,
  Baby,
  Brain,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react'
import { ROUTES } from '@/config/app.config'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { SchemeCard, SchemeCardData } from '@/components/schemes/SchemeCard'
import { useLanguage } from '@/context/LanguageContext'

const categoryItems = [
  {
    nameEn: 'Agriculture & Farmers',
    nameTe: 'వ్యవసాయం & రైతు సంక్షేమం',
    nameHi: 'कृषि एवं किसान कल्याण',
    icon: Building2,
    countEn: '840+ Schemes',
    countTe: '840+ పథకాలు',
    countHi: '840+ योजनाएं',
    color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    filterVal: 'Agriculture',
  },
  {
    nameEn: 'Education & Learning',
    nameTe: 'విద్య & స్కాలర్‌షిప్‌లు',
    nameHi: 'शिक्षा एवं छात्रवृत्ति',
    icon: GraduationCap,
    countEn: '620+ Schemes',
    countTe: '620+ పథకాలు',
    countHi: '620+ योजनाएं',
    color: 'bg-blue-50 text-blue-700 border-blue-200',
    filterVal: 'Education',
  },
  {
    nameEn: 'Health & Wellness',
    nameTe: 'ఆరోగ్యం & వైద్య సహాయం',
    nameHi: 'स्वास्थ्य एवं चिकित्सा',
    icon: HeartPulse,
    countEn: '410+ Schemes',
    countTe: '410+ పథకాలు',
    countHi: '410+ योजनाएं',
    color: 'bg-rose-50 text-rose-700 border-rose-200',
    filterVal: 'Health',
  },
  {
    nameEn: 'Housing & Shelter',
    nameTe: 'గృహ నిర్మాణం & సౌర శక్తి',
    nameHi: 'आवास एवं सौर ऊर्जा',
    icon: Home,
    countEn: '290+ Schemes',
    countTe: '290+ పథకాలు',
    countHi: '290+ योजनाएं',
    color: 'bg-amber-50 text-amber-700 border-amber-200',
    filterVal: 'Housing',
  },
  {
    nameEn: 'Employment & Skills',
    nameTe: 'ఉపాధి & నైపుణ్యాభివృద్ధి',
    nameHi: 'रोजगार एवं कौशल विकास',
    icon: Briefcase,
    countEn: '530+ Schemes',
    countTe: '530+ పథకాలు',
    countHi: '530+ योजनाएं',
    color: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    filterVal: 'Employment',
  },
  {
    nameEn: 'Women & Child',
    nameTe: 'మహిళా & శిశు అభివృద్ధి',
    nameHi: 'महिला एवं बाल विकास',
    icon: Baby,
    countEn: '380+ Schemes',
    countTe: '380+ పథకాలు',
    countHi: '380+ योजनाएं',
    color: 'bg-purple-50 text-purple-700 border-purple-200',
    filterVal: 'Women & Child',
  },
]

const sampleFeaturedSchemes: SchemeCardData[] = [
  {
    id: 'pm-kisan',
    title: 'PM Kisan Samman Nidhi Yojana',
    titleTelugu: 'ప్రధాన మంత్రి కిసాన్ సమ్మాన్ నిధి యోజన',
    titleHindi: 'पीएम किसान सम्मान निधि योजना',
    description: 'Direct income support of ₹6,000 per year in three equal instalments to all landholding farmer families across India.',
    ministry: 'Ministry of Agriculture & Farmers Welfare',
    level: 'Central',
    category: 'Agriculture',
    benefitAmount: '₹6,000 / Year',
    eligibilityScore: 98,
    isSaved: false,
  },
  {
    id: 'ayushman-bharat',
    title: 'Ayushman Bharat PM-JAY',
    titleTelugu: 'ఆయుష్మాన్ భారత్ ప్రధాన్ మంత్రి జన్ ఆరోగ్య యోజన',
    titleHindi: 'आयुष्मान भारत - प्रधानमंत्री जन आरोग्य योजना (पीएम-जय)',
    description: 'Cashless access to healthcare services providing health cover up to ₹5 lakh per family per year for secondary & tertiary hospitalization.',
    ministry: 'National Health Authority (NHA)',
    level: 'Central',
    category: 'Health',
    benefitAmount: '₹5,00,000 / Year',
    eligibilityScore: 94,
    isSaved: true,
  },
  {
    id: 'rythu-bandhu',
    title: 'Rythu Bharosa / Rythu Bandhu',
    titleTelugu: 'రైతు బంధు పథకం - తెలంగాణ ప్రభుత్వం',
    titleHindi: 'रैतु भरोसा / रैतु बंधु योजना (तेलंगाना)',
    description: 'Investment support scheme for agriculture and horticulture crops by way of grant of ₹10,000 per acre per year for two seasons.',
    ministry: 'Department of Agriculture, Telangana',
    level: 'State',
    category: 'Agriculture',
    benefitAmount: '₹10,000 / Acre',
    eligibilityScore: 91,
    isSaved: false,
  },
]

export default function HomePage() {
  const navigate = useNavigate()
  const { t, isTelugu, isHindi, fontClass } = useLanguage()
  const [heroSearch, setHeroSearch] = useState('')

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    navigate(`${ROUTES.SCHEMES}?search=${encodeURIComponent(heroSearch)}`)
  }

  const steps = [
    {
      step: '01',
      title: t('homeStep1Title'),
      desc: t('homeStep1Desc'),
    },
    {
      step: '02',
      title: t('homeStep2Title'),
      desc: t('homeStep2Desc'),
    },
    {
      step: '03',
      title: t('homeStep3Title'),
      desc: t('homeStep3Desc'),
    },
  ]

  return (
    <div className={`flex flex-col min-h-screen ${fontClass}`}>
      {/* ── HERO SECTION ── */}
      <section className="relative overflow-hidden gradient-hero text-white py-16 sm:py-24">
        {/* Subtle patterned overlay */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

        <div className="container relative z-10 text-center max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-md text-xs font-semibold mb-6 animate-fade-in">
            <span className="flex h-2 w-2 rounded-full bg-[var(--color-accent)] animate-pulse" />
            <span className="text-white/90">{t('heroBadgeText')}</span>
            <span className="text-white/50">•</span>
            <span className="text-[var(--color-accent)] font-telugu">{t('heroBadgeTe')}</span>
          </div>

          {/* Heading */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.15] text-balance mb-6 animate-fade-up">
            {t('heroHeading')}{' '}
            <span className="text-[var(--color-accent)]">{t('heroHeadingHighlight')}</span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-xl text-white/80 max-w-2xl mx-auto leading-relaxed mb-10 text-pretty delay-75 animate-fade-up">
            {t('heroSubtitle')}
          </p>

          {/* Main Search Field */}
          <form
            onSubmit={handleSearchSubmit}
            className="card p-2 sm:p-2.5 max-w-2xl mx-auto shadow-2xl bg-white text-left flex flex-col sm:flex-row gap-2 border-2 border-white/20 delay-150 animate-fade-up"
          >
            <div className="relative flex-1 flex items-center">
              <Search className="w-5 h-5 text-[var(--color-muted-foreground)] ml-3 shrink-0" />
              <input
                type="text"
                value={heroSearch}
                onChange={(e) => setHeroSearch(e.target.value)}
                placeholder={t('heroSearchPlaceholder')}
                className="w-full px-3 py-2 text-sm text-[var(--color-foreground)] outline-none placeholder:text-[var(--color-muted-foreground)]"
              />
            </div>
            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="sm:w-auto w-full text-xs sm:text-sm font-bold"
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              {t('heroBtnExplore')}
            </Button>
          </form>

          {/* Secondary CTA buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mt-6 delay-225 animate-fade-up">
            <Button
              variant="secondary"
              size="md"
              onClick={() => navigate(ROUTES.ASSISTANT)}
              leftIcon={<Bot className="w-4 h-4 text-white" />}
              className="text-xs sm:text-sm shadow-md"
            >
              {t('heroBtnAskAi')}
            </Button>
            <Button
              variant="outline"
              size="md"
              onClick={() => navigate(ROUTES.ELIGIBILITY)}
              className="text-xs sm:text-sm bg-white/10 text-white border-white/30 hover:bg-white/20"
              leftIcon={<CheckCircle2 className="w-4 h-4 text-[var(--color-accent)]" />}
            >
              {t('heroBtnCheck1Min')}
            </Button>
          </div>

          {/* Micro stats banner */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto mt-14 pt-8 border-t border-white/15 text-left">
            <div>
              <p className="text-2xl sm:text-3xl font-extrabold text-[var(--color-accent)]">{t('heroStatSchemesCount')}</p>
              <p className="text-xs text-white/70">{t('heroStatSchemesLabel')}</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-extrabold text-white">{t('heroStatStatesCount')}</p>
              <p className="text-xs text-white/70">{t('heroStatStatesLabel')}</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-extrabold text-[var(--color-accent)]">{t('heroStatLangCount')}</p>
              <p className="text-xs text-white/70 font-telugu">{t('heroStatLangLabel')}</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-extrabold text-white">{t('heroStatFreeCount')}</p>
              <p className="text-xs text-white/70">{t('heroStatFreeLabel')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── SCHEME CATEGORIES SECTION ── */}
      <section className="section-padding bg-[var(--color-background)]">
        <div className="container">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <Badge variant="secondary" className="mb-2">{t('homeCatBadge')}</Badge>
              <h2 className="text-2xl sm:text-3xl font-bold text-[var(--color-primary)]">
                {t('homeCatTitle')}
              </h2>
              <p className="text-xs sm:text-sm text-[var(--color-muted-foreground)] mt-1">
                {t('homeCatSubtitle')}
              </p>
            </div>
            <Link
              to={ROUTES.SCHEMES}
              className="text-xs sm:text-sm font-bold text-[var(--color-secondary)] hover:underline inline-flex items-center gap-1 shrink-0"
            >
              {t('homeCatViewAll')} <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {categoryItems.map((cat) => {
              const Icon = cat.icon
              const catName = isTelugu ? cat.nameTe : isHindi ? cat.nameHi : cat.nameEn
              const catCount = isTelugu ? cat.countTe : isHindi ? cat.countHi : cat.countEn
              return (
                <Link
                  key={cat.filterVal}
                  to={`${ROUTES.SCHEMES}?category=${encodeURIComponent(cat.filterVal)}`}
                  className="card-interactive p-5 flex items-start gap-4"
                >
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border ${cat.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-sm text-[var(--color-foreground)] leading-snug">
                      {catName}
                    </h3>
                    <p className="text-xs text-[var(--color-muted-foreground)] mt-1">{catCount}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[var(--color-muted-foreground)] mt-1" />
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── FEATURED POPULAR SCHEMES ── */}
      <section className="section-padding bg-white border-y border-[var(--color-border)]">
        <div className="container">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <Badge variant="primary" className="mb-2">{t('homeFeaturedBadge')}</Badge>
              <h2 className="text-2xl sm:text-3xl font-bold text-[var(--color-primary)]">
                {t('homeFeaturedTitle')}
              </h2>
              <p className="text-xs sm:text-sm text-[var(--color-muted-foreground)] mt-1">
                {t('homeFeaturedSubtitle')}
              </p>
            </div>
            <Link
              to={ROUTES.SCHEMES}
              className="btn btn-sm btn-outline text-xs"
            >
              {t('homeFeaturedBrowseAll')}
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {sampleFeaturedSchemes.map((scheme) => (
              <SchemeCard key={scheme.id} scheme={scheme} />
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="section-padding bg-[var(--color-background)]">
        <div className="container text-center max-w-4xl mx-auto">
          <Badge variant="accent" className="mb-2">{t('homeHowItWorksBadge')}</Badge>
          <h2 className="text-2xl sm:text-3xl font-bold text-[var(--color-primary)] mb-3">
            {t('homeHowItWorksTitle')}
          </h2>
          <p className="text-xs sm:text-sm text-[var(--color-muted-foreground)] max-w-xl mx-auto mb-12">
            {t('homeHowItWorksSubtitle')}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            {steps.map((st) => (
              <div key={st.step} className="card p-6 relative">
                <span className="text-3xl font-black text-[var(--color-secondary)]/20 absolute top-4 right-4 font-mono">
                  {st.step}
                </span>
                <div className="w-10 h-10 rounded-xl bg-[var(--color-primary-50)] text-[var(--color-primary-800)] font-bold text-sm flex items-center justify-center mb-4">
                  {st.step}
                </div>
                <h3 className="font-bold text-base text-[var(--color-primary)] mb-2">
                  {st.title}
                </h3>
                <p className="text-xs text-[var(--color-muted-foreground)] leading-relaxed">
                  {st.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── MULTILINGUAL FOCUS (TELUGU & BHARAT) ── */}
      <section className="section-padding bg-[var(--color-primary)] text-white relative overflow-hidden">
        <div className="container relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold mb-4 text-[var(--color-accent)]">
                <Brain className="w-3.5 h-3.5" /> {t('homeTeluguSupportBadge')}
              </div>
              <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight mb-4 leading-tight font-telugu">
                {t('homeTeluguHeading')}
              </h2>
              <p className="text-xs sm:text-sm text-white/80 leading-relaxed mb-6 font-telugu">
                {t('homeTeluguDesc')}
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <Button
                  variant="accent"
                  size="md"
                  onClick={() => navigate(ROUTES.ASSISTANT)}
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                  className="font-bold text-xs sm:text-sm"
                >
                  {t('homeTeluguBtnAsk')}
                </Button>
                <Link
                  to={ROUTES.SCHEMES}
                  className="btn btn-md btn-outline text-white border-white/30 hover:bg-white/10 text-xs sm:text-sm"
                >
                  {t('homeTeluguBtnTelangana')}
                </Link>
              </div>
            </div>

            {/* Mock chat bubble preview */}
            <div className="card bg-white text-[var(--color-foreground)] p-6 shadow-2xl max-w-md mx-auto w-full">
              <div className="flex items-center gap-3 pb-4 border-b border-[var(--color-border)] mb-4">
                <div className="w-8 h-8 rounded-lg bg-[var(--color-secondary)] flex items-center justify-center text-white">
                  <Bot className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-[var(--color-primary)]">CivicSaarthi AI Assistant</p>
                  <p className="text-[10px] text-[var(--color-success)] font-semibold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-success)]" />{' '}
                    {isTelugu ? 'తెలుగు మరియు ఇంగ్లీషులో సిద్ధంగా ఉంది' : isHindi ? 'हिंदी एवं अंग्रेजी में उपलब्ध' : 'Ready in English, Telugu & Hindi'}
                  </p>
                </div>
              </div>
              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-xl bg-[var(--color-muted)] text-[var(--color-foreground)] max-w-[85%]">
                  {isTelugu
                    ? '"నేను రైతుని, నా దగ్గర 2 ఎకరాల భూమి ఉంది. నాకు ఏమైనా సాయం అందుతుందా?"'
                    : isHindi
                    ? '"मैं एक किसान हूँ, मेरे पास 2 एकड़ जमीन है। क्या मुझे कोई सहायता मिल सकती है?"'
                    : '"I am a farmer with 2 acres of land in Telangana. Am I eligible for direct farm income support?"'}
                </div>
                <div className="p-3 rounded-xl bg-[var(--color-secondary-50)] text-[var(--color-secondary-900)] border border-[var(--color-secondary-100)] max-w-[90%] ml-auto">
                  {isTelugu
                    ? '"నమస్కారం! అవును, మీకు ప్రధాన మంత్రి కిసాన్ సమ్మాన్ నిధి (ఏటా ₹6,000) మరియు రైతు భరోసా పథకం వర్తిస్తాయి..."'
                    : isHindi
                    ? '"नमस्ते! हाँ, आप प्रधानमंत्री किसान सम्मान निधि योजना (वार्षिक ₹6,000) और राज्य कृषि सहायता के लिए पात्र हैं..."'
                    : '"Yes! You are likely eligible for PM-KISAN (₹6,000/year) and state crop investment aid. Here are your verified guidelines..."'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── TRUST & TRANSPARENCY ── */}
      <section className="section-padding bg-white border-b border-[var(--color-border)]">
        <div className="container max-w-4xl mx-auto">
          <div className="card p-6 sm:p-8 bg-[var(--color-background)] border-2 border-[var(--color-secondary)]/20">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[var(--color-secondary-50)] text-[var(--color-secondary)] flex items-center justify-center shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-base sm:text-lg text-[var(--color-primary)] mb-1">
                  {t('homeTrustTitle')}
                </h3>
                <p className="text-xs text-[var(--color-muted-foreground)] leading-relaxed mb-4">
                  {t('homeTrustDesc')}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-[var(--color-border)] text-xs font-semibold text-[var(--color-foreground)]">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[var(--color-success)]" /> {t('homeTrustPoint1')}
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[var(--color-success)]" /> {t('homeTrustPoint2')}
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[var(--color-success)]" /> {t('homeTrustPoint3')}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
