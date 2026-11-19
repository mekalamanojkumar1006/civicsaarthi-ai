import { useState, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  ShieldAlert,
  Info,
  Clock,
  History,
  Calculator,
  Loader2,
  Trash2,
  Database,
  ChevronDown,
  ChevronUp,
} from 'lucide-react'
import { CENTRAL_AND_STATE_SCHEMES } from '@/data/schemesData'
import { useApp } from '@/context/AppContext'
import { useAuth } from '@/context/AuthContext'
import { dbService } from '@/services/dbService'
import type { EligibilityAssessment } from '@/types/supabase'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { EmptyState } from '@/components/common/EmptyState'
import { useLanguage } from '@/context/LanguageContext'

const stepKeys: ('elStep1' | 'elStep2' | 'elStep3' | 'elStep4' | 'elStep5')[] = [
  'elStep1',
  'elStep2',
  'elStep3',
  'elStep4',
  'elStep5',
]

export default function EligibilityPage() {
  const [searchParams] = useSearchParams()
  const initialSchemeId = searchParams.get('schemeId') || CENTRAL_AND_STATE_SCHEMES[0].id
  const { profile, isDatabaseSynced } = useApp()
  const { user } = useAuth()
  const { t, isTelugu, isHindi, fontClass } = useLanguage()

  // Tabs: Calculator wizard or Assessment History
  const [activeTab, setActiveTab] = useState<'calculator' | 'history'>('calculator')

  // Wizard state
  const [currentStep, setCurrentStep] = useState(0)
  const [selectedSchemeId, setSelectedSchemeId] = useState(initialSchemeId)

  // Form State initialized with Profile
  const [formData, setFormData] = useState({
    age: profile.age,
    gender: profile.gender,
    state: profile.state,
    district: profile.district,
    category: profile.casteCategory,
    annualIncome: profile.annualIncome,
    landholdingAcres: profile.landholdingAcres,
    rationCardType: profile.rationCardType,
    isGovtEmployee: false,
    ownsCultivableLand: true,
    hasRooftopSpace: true,
    hasDomesticPowerConnection: true,
    hasBPLCard: true,
    enrolledInRecognizedInstitution: true,
    girlChildUnder10: true,
  })

  // Assessment History State
  const [assessmentHistory, setAssessmentHistory] = useState<EligibilityAssessment[]>([])
  const [isHistoryLoading, setIsHistoryLoading] = useState<boolean>(false)
  const [historyError, setHistoryError] = useState<string | null>(null)
  const [expandedAssessmentId, setExpandedAssessmentId] = useState<string | null>(null)

  // Saving state for current assessment
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error' | 'unauthenticated'>('idle')
  const [saveError, setSaveError] = useState<string | null>(null)

  // Watch for query param change
  useEffect(() => {
    const qId = searchParams.get('schemeId')
    if (qId && CENTRAL_AND_STATE_SCHEMES.some((s) => s.id === qId)) {
      setSelectedSchemeId(qId)
    }
  }, [searchParams])

  // Load user's assessment history from Supabase when authenticated
  const loadHistory = async () => {
    if (!user || !isDatabaseSynced) {
      setAssessmentHistory([])
      return
    }

    setIsHistoryLoading(true)
    setHistoryError(null)

    const res = await dbService.getAssessments(user.id)
    setIsHistoryLoading(false)

    if (res.success && res.data) {
      setAssessmentHistory(res.data)
    } else {
      setHistoryError(res.error || 'Failed to load assessment history.')
    }
  }

  useEffect(() => {
    if (activeTab === 'history') {
      loadHistory()
    }
  }, [activeTab, user, isDatabaseSynced])

  const scheme = CENTRAL_AND_STATE_SCHEMES.find((s) => s.id === selectedSchemeId) || CENTRAL_AND_STATE_SCHEMES[0]

  // Evaluation logic with localized messages
  const evaluateEligibility = () => {
    const met: string[] = []
    const notMet: string[] = []
    const warnings: string[] = []

    // Age Check
    if (scheme.eligibility.minAge && formData.age < scheme.eligibility.minAge) {
      notMet.push(
        isTelugu
          ? `వయస్సు నిబంధన: కనీస వయస్సు ${scheme.eligibility.minAge} సంవత్సరాలు ఉండాలి (మీ వయస్సు: ${formData.age} సం.).`
          : isHindi
          ? `आयु मानदंड: न्यूनतम आयु ${scheme.eligibility.minAge} वर्ष आवश्यक है (आपकी दर्ज आयु: ${formData.age} वर्ष)।`
          : `Minimum age required is ${scheme.eligibility.minAge} years (self-reported: ${formData.age} yrs).`
      )
    } else if (scheme.eligibility.maxAge && formData.age > scheme.eligibility.maxAge) {
      notMet.push(
        isTelugu
          ? `వయస్సు నిబంధన: గరిష్ట వయస్సు ${scheme.eligibility.maxAge} సంవత్సరాలు దాటకూడదు (మీ వయస్సు: ${formData.age} సం.).`
          : isHindi
          ? `आयु मानदंड: अधिकतम आयु सीमा ${scheme.eligibility.maxAge} वर्ष है (आपकी दर्ज आयु: ${formData.age} वर्ष)।`
          : `Maximum age ceiling is ${scheme.eligibility.maxAge} years (self-reported: ${formData.age} yrs).`
      )
    } else {
      met.push(
        isTelugu
          ? `వయస్సు అర్హత పరిధిలో ఉంది (${formData.age} సంవత్సరాలు).`
          : isHindi
          ? `दर्ज आयु (${formData.age} वर्ष) योजना के आयु मानदंड को पूरा करती है।`
          : `Self-reported age (${formData.age} years) satisfies age criteria.`
      )
    }

    // Gender Check
    if (scheme.eligibility.gender && scheme.eligibility.gender !== 'All') {
      if (formData.gender !== scheme.eligibility.gender) {
        notMet.push(
          isTelugu
            ? `ఈ పథకం కేవలం ${scheme.eligibility.gender === 'Female' ? 'మహిళలకు' : 'పురుషులకు'} మాత్రమే వర్తిస్తుంది.`
            : isHindi
            ? `यह योजना विशेष रूप से ${scheme.eligibility.gender === 'Female' ? 'महिला' : 'पुरुष'} आवेदकों के लिए है (दर्ज: ${formData.gender})।`
            : `Designated exclusively for ${scheme.eligibility.gender} applicants (self-reported: ${formData.gender}).`
        )
      } else {
        met.push(
          isTelugu
            ? `లింగ నిబంధన సరిపోయింది (${scheme.eligibility.gender === 'Female' ? 'మహిళ' : 'పురుషుడు'}).`
            : isHindi
            ? `लक्षित लिंग मानदंड संतुष्ट है (${formData.gender === 'Female' ? 'महिला' : formData.gender === 'Male' ? 'पुरुष' : formData.gender})।`
            : `Target gender condition satisfied (${formData.gender}).`
        )
      }
    }

    // Income Check
    if (scheme.eligibility.maxAnnualIncome) {
      if (formData.annualIncome > scheme.eligibility.maxAnnualIncome) {
        notMet.push(
          isTelugu
            ? `వార్షిక ఆదాయం ₹${scheme.eligibility.maxAnnualIncome.toLocaleString('en-IN')} పరిమితి కంటే ఎక్కువ (మీ ఆదాయం: ₹${formData.annualIncome.toLocaleString('en-IN')}).`
            : isHindi
            ? `वार्षिक आय ₹${scheme.eligibility.maxAnnualIncome.toLocaleString('en-IN')} की सीमा से अधिक है (आपकी आय: ₹${formData.annualIncome.toLocaleString('en-IN')})।`
            : `Income exceeds scheme threshold of ₹${scheme.eligibility.maxAnnualIncome.toLocaleString('en-IN')} (self-reported: ₹${formData.annualIncome.toLocaleString('en-IN')}).`
        )
      } else {
        met.push(
          isTelugu
            ? `కుటుంబ వార్షిక ఆదాయం (₹${formData.annualIncome.toLocaleString('en-IN')}) అనుమతించిన పరిమితిలో ఉంది.`
            : isHindi
            ? `परिवार की वार्षिक आय (₹${formData.annualIncome.toLocaleString('en-IN')}) योजना की निर्धारित सीमा के भीतर है।`
            : `Self-reported annual income (₹${formData.annualIncome.toLocaleString('en-IN')}) is within the scheme threshold.`
        )
      }
    }

    // Domicile / State
    if (scheme.eligibility.residenceRequired) {
      if (formData.state !== scheme.eligibility.residenceRequired) {
        notMet.push(
          isTelugu
            ? `నివాస అర్హత: ఈ పథకం ${scheme.eligibility.residenceRequired} నివాసితులకు మాత్రమే (మీ నివాసం: ${formData.state}).`
            : isHindi
            ? `निवास मानदंड: यह योजना केवल ${scheme.eligibility.residenceRequired} के निवासियों के लिए है (दर्ज: ${formData.state})।`
            : `Scheme guidelines require state residency in ${scheme.eligibility.residenceRequired} (self-reported: ${formData.state}).`
        )
      } else {
        met.push(
          isTelugu
            ? `రాష్ట్ర నివాస అర్హత సరిపోయింది (${scheme.eligibility.residenceRequired}).`
            : isHindi
            ? `राज्य निवास मानदंड संतुष्ट है (${scheme.eligibility.residenceRequired})।`
            : `Self-reported state domicile matches ${scheme.eligibility.residenceRequired}.`
        )
      }
    }

    // Scheme-specific logic
    if (scheme.id === 'pm-kisan') {
      if (formData.isGovtEmployee) {
        notMet.push(
          isTelugu
            ? 'ప్రభుత్వ ఉద్యోగి లేదా ఆదాయపు పన్ను చెల్లింపుదారుల మినహాయింపు వర్తిస్తుంది.'
            : isHindi
            ? 'सरकारी कर्मचारी या आयकर दाता अपवर्जन लागू होता है।'
            : 'Self-reported: Government employment / income tax paying exclusion reported.'
        )
      } else {
        met.push(
          isTelugu
            ? 'ప్రభుత్వ ఉద్యోగి మినహాయింపు వర్తించదు.'
            : isHindi
            ? 'सरकारी कर्मचारी अपवर्जन लागू नहीं होता।'
            : 'Self-reported: No government employee exclusion declared.'
        )
      }
      if (!formData.ownsCultivableLand) {
        notMet.push(
          isTelugu
            ? 'రైతు పేరిట రిజిస్టర్డ్ సాగు భూమి పట్టా లేదు.'
            : isHindi
            ? 'किसान के नाम पर पंजीकृत कृषि भूमि का पट्टा नहीं है।'
            : 'Self-reported: Does not hold cultivable agricultural land title.'
        )
      } else {
        met.push(
          isTelugu
            ? `సాగు భూమి పట్టా ఉంది (${formData.landholdingAcres} ఎకరాలు).`
            : isHindi
            ? `कृषि भूमि का पट्टा उपलब्ध है (${formData.landholdingAcres} एकड़ दर्ज)।`
            : `Self-reported: Owns cultivable agricultural land (${formData.landholdingAcres} acres indicated).`
        )
      }
    } else if (scheme.id === 'pm-surya-ghar') {
      if (!formData.hasRooftopSpace) {
        notMet.push(
          isTelugu
            ? 'సోలార్ ప్యానెల్స్ కొరకు తగిన నీడ లేని పైకప్పు స్థలం అందుబాటులో లేదు.'
            : isHindi
            ? 'सोलर पैनलों के लिए उपयुक्त छाया-मुक्त छत उपलब्ध नहीं है।'
            : 'Self-reported: Adequate unshaded rooftop space not available.'
        )
      } else {
        met.push(
          isTelugu
            ? 'సోలార్ ప్యానెల్స్ కొరకు అనువైన పైకప్పు స్థలం ఉంది.'
            : isHindi
            ? 'सोलर पैनलों के लिए उपयुक्त छाया-मुक्त छत उपलब्ध है।'
            : 'Self-reported: Has suitable unshaded rooftop space.'
        )
      }
      if (!formData.hasDomesticPowerConnection) {
        notMet.push(
          isTelugu
            ? 'గృహ వినియోగ విద్యుత్ కనెక్షన్ అందుబాటులో లేదు.'
            : isHindi
            ? 'घरेलू उपभोक्ता बिजली कनेक्शन उपलब्ध नहीं है।'
            : 'Self-reported: Active domestic consumer electricity connection not present.'
        )
      } else {
        met.push(
          isTelugu
            ? 'గృహ వినియోగ విద్యుత్ కనెక్షన్ ధ్రువీకరించబడింది.'
            : isHindi
            ? 'घरेलू उपभोक्ता बिजली कनेक्शन सत्यापित है।'
            : 'Self-reported: Active domestic consumer electricity connection verified.'
        )
      }
    } else if (scheme.id === 'kalyana-lakshmi') {
      if (formData.gender !== 'Female') {
        notMet.push(
          isTelugu
            ? 'ఈ ఆర్థిక సహాయం పెళ్లి కుమార్తెలకు మాత్రమే వర్తిస్తుంది.'
            : isHindi
            ? 'यह योजना केवल वधू/महिला आवेदकों के लिए है।'
            : 'Scheme assistance designated exclusively for brides / female applicants.'
        )
      }
      if (formData.category === 'General') {
        warnings.push(
          isTelugu
            ? 'ధ్రువీకరణ అవసరం: జనరల్ వర్గానికి ప్రత్యేక ఆర్థిక నిబంధనల పరిశీలన అవసరం.'
            : isHindi
            ? 'सत्यापन आवश्यक: सामान्य वर्ग के लिए विशेष आर्थिक मानदंडों का सत्यापन आवश्यक है।'
            : 'Verification needed: General category may require special economic criteria verification.'
        )
      } else {
        met.push(
          isTelugu
            ? `సామాజిక వర్గం (${formData.category}) లక్షిత వర్గాలలో ఉంది (SC/ST/BC/Minority/EWS).`
            : isHindi
            ? `सामाजिक वर्ग (${formData.category}) लक्षित कल्याणकारी समूहों (SC/ST/BC/अल्पसंख्यक/EWS) के अंतर्गत है।`
            : `Self-reported category (${formData.category}) aligns with targeted welfare groups (SC/ST/BC/Minority/EWS).`
        )
      }
    } else if (scheme.id === 'post-matric-scholarship') {
      if (!formData.enrolledInRecognizedInstitution) {
        notMet.push(
          isTelugu
            ? 'గుర్తింపు పొందిన పోస్ట్-మెట్రిక్ విద్యా సంస్థలో ప్రవేశం లేదు.'
            : isHindi
            ? 'मान्यता प्राप्त पोस्ट-मैट्रिक संस्थान में कोई सक्रिय प्रवेश नहीं है।'
            : 'Self-reported: Not actively enrolled in post-matric recognized institution.'
        )
      } else {
        met.push(
          isTelugu
            ? 'గుర్తింపు పొందిన పోస్ట్-మెట్రిక్ విద్యా సంస్థలో చదువుతున్నారు.'
            : isHindi
            ? 'मान्यता प्राप्त पोस्ट-10वीं शैक्षणिक संस्थान में अध्ययनरत हैं।'
            : 'Self-reported: Enrolled in recognized post-10th educational institution.'
        )
      }
    } else if (scheme.id === 'sukanya-samriddhi') {
      if (!formData.girlChildUnder10) {
        notMet.push(
          isTelugu
            ? 'బాలిక వయస్సు 10 సంవత్సరాల గరిష్ట పరిమితి కంటే ఎక్కువ.'
            : isHindi
            ? 'बालिका की आयु 10 वर्ष की अधिकतम खाता खोलने की सीमा से अधिक है।'
            : 'Self-reported: Girl child age exceeds the 10-year account opening threshold.'
        )
      } else {
        met.push(
          isTelugu
            ? 'బాలిక వయస్సు 10 సంవత్సరాల లోపు ఉంది.'
            : isHindi
            ? 'बालिका की आयु खाता खोलने के लिए 10 वर्ष से कम है।'
            : 'Self-reported: Girl child is below 10 years of age at account opening.'
        )
      }
    }

    const total = met.length + notMet.length
    const score = total > 0 ? Math.round((met.length / total) * 100) : 50

    let status: 'Likely Eligible (Self-Reported)' | 'Conditional / Additional Verification Required' | 'Requires Attention / Likely Ineligible'
    if (notMet.length === 0) {
      status = 'Likely Eligible (Self-Reported)'
    } else if (notMet.length <= 1) {
      status = 'Conditional / Additional Verification Required'
    } else {
      status = 'Requires Attention / Likely Ineligible'
    }

    return { met, notMet, warnings, score, status }
  }

  const assessment = evaluateEligibility()

  const persistAssessment = async () => {
    if (!user || !isDatabaseSynced) {
      setSaveStatus('unauthenticated')
      return
    }

    setSaveStatus('saving')
    setSaveError(null)

    const assessmentResult = {
      schemeTitle: scheme.title,
      schemeLevel: scheme.level,
      schemeCategory: scheme.category,
      benefitAmount: scheme.benefitAmount,
      status: assessment.status,
      score: assessment.score,
      met: assessment.met,
      notMet: assessment.notMet,
      warnings: assessment.warnings,
      isOfficialApproval: false,
      disclaimer: 'Preliminary computational estimate. Does NOT constitute official government sanction.',
      evaluatedAt: new Date().toISOString(),
    }

    const res = await dbService.recordAssessment(
      user.id,
      scheme.id,
      formData,
      assessmentResult
    )

    if (res.success && res.data) {
      setSaveStatus('saved')
      setAssessmentHistory((prev) => [res.data!, ...prev])
    } else {
      setSaveStatus('error')
      setSaveError(res.error || 'Failed to record assessment in database.')
    }
  }

  const handleAdvanceStep = () => {
    if (currentStep === stepKeys.length - 2) {
      setCurrentStep(stepKeys.length - 1)
      persistAssessment()
    } else {
      setCurrentStep((prev) => prev + 1)
    }
  }

  const handleDeleteAssessment = async (assessmentId: string) => {
    if (!user) return
    const res = await dbService.deleteAssessment(user.id, assessmentId)
    if (res.success) {
      setAssessmentHistory((prev) => prev.filter((a) => a.id !== assessmentId))
    }
  }

  const handleRetestScheme = (schemeId: string) => {
    setSelectedSchemeId(schemeId)
    setActiveTab('calculator')
    setCurrentStep(0)
    setSaveStatus('idle')
  }

  const statusLabel =
    assessment.status === 'Likely Eligible (Self-Reported)'
      ? t('elLikelyEligible')
      : assessment.status === 'Conditional / Additional Verification Required'
      ? t('elConditional')
      : t('elLikelyIneligible')

  return (
    <div className={`p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto space-y-6 animate-fade-in ${fontClass}`}>
      {/* ── HEADER & TAB BAR ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <Badge variant="secondary">
              {isTelugu ? 'ప్రాథమిక స్వీయ-అర్హత అంచనా' : isHindi ? 'प्रारंभिक स्व-पात्रता मूल्यांकन' : 'Preliminary Self-Assessment'}
            </Badge>
            {isDatabaseSynced ? (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                <Database className="w-3 h-3" /> {isTelugu ? 'డేటాబేస్ అనుసంధానమైంది' : isHindi ? 'डेटाबेस कनेक्टेड' : 'Supabase Connected'}
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                {isTelugu ? 'నమూనా లెక్కింపు' : isHindi ? 'डेमो सिमुलेशन' : 'Demo Simulation'}
              </span>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--color-primary)] tracking-tight">
            {t('navEligibility')}
          </h1>
          <p className="text-xs sm:text-sm text-[var(--color-muted-foreground)] mt-0.5">
            {t('subEligibility')}
          </p>
        </div>

        {/* Tab switchers */}
        <div className="flex items-center gap-1 p-1 bg-white border border-[var(--color-border)] rounded-xl shadow-xs self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setActiveTab('calculator')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'calculator'
                ? 'bg-[var(--color-primary)] text-white shadow-xs'
                : 'text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)]'
            }`}
          >
            <Calculator className="w-3.5 h-3.5" />
            <span>{t('elNewCheck')}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('history')
              if (user && isDatabaseSynced && assessmentHistory.length === 0) {
                loadHistory()
              }
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'history'
                ? 'bg-[var(--color-primary)] text-white shadow-xs'
                : 'text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)]'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>{t('elHistory')}</span>
            {assessmentHistory.length > 0 && (
              <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-white/20 text-white font-extrabold">
                {assessmentHistory.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* ── TAB 1: CALCULATOR WIZARD ── */}
      {activeTab === 'calculator' && (
        <div className="space-y-6">
          {/* Step Indicator */}
          <div className="card p-3 sm:p-4 bg-white shadow-xs">
            <div className="flex items-center justify-between gap-1 overflow-x-auto pb-1 scrollbar-none">
              {stepKeys.map((stepKey, idx) => {
                const label = t(stepKey)
                const isDone = idx < currentStep
                const isCurrent = idx === currentStep
                return (
                  <button
                    key={stepKey}
                    type="button"
                    onClick={() => idx <= currentStep && setCurrentStep(idx)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                      isCurrent
                        ? 'bg-[var(--color-primary)] text-white shadow-xs'
                        : isDone
                        ? 'text-[var(--color-secondary)] bg-[var(--color-secondary-50)] cursor-pointer'
                        : 'text-[var(--color-muted-foreground)] opacity-50 cursor-not-allowed'
                    }`}
                  >
                    {isDone ? <CheckCircle2 className="w-3.5 h-3.5" /> : <span>{idx + 1}</span>}
                    <span className="hidden sm:inline">{label}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Step Form Content */}
          <div className="card p-6 sm:p-8 bg-white shadow-sm space-y-6">
            {/* Step 1: Choose Scheme */}
            {currentStep === 0 && (
              <div className="space-y-5 animate-fade-in">
                <div>
                  <h2 className="text-lg font-bold text-[var(--color-primary)]">
                    {t('elChooseSchemeStep')}
                  </h2>
                  <p className="text-xs text-[var(--color-muted-foreground)] mt-0.5">
                    {t('elChooseSchemeDesc')}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-96 overflow-y-auto scrollbar-thin p-1">
                  {CENTRAL_AND_STATE_SCHEMES.map((item) => {
                    const itemTitle = isTelugu && item.titleTelugu ? item.titleTelugu : isHindi && item.titleHindi ? item.titleHindi : item.title
                    return (
                      <div
                        key={item.id}
                        onClick={() => setSelectedSchemeId(item.id)}
                        className={`p-4 rounded-xl border text-left cursor-pointer transition-all ${
                          selectedSchemeId === item.id
                            ? 'border-[var(--color-secondary)] bg-[var(--color-secondary-50)]/40 ring-2 ring-[var(--color-secondary)]/20 shadow-xs'
                            : 'border-[var(--color-border)] hover:border-[var(--color-secondary)] hover:bg-[var(--color-muted)]'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <Badge variant={item.level === 'Central' ? 'primary' : 'secondary'}>
                            {item.level === 'Central' ? t('cardCentralScheme') : t('cardStateScheme')}
                          </Badge>
                          <span className="text-[10px] font-bold text-[var(--color-success)]">{item.benefitAmount}</span>
                        </div>
                        <h3 className="font-bold text-xs sm:text-sm text-[var(--color-foreground)] leading-snug">
                          {itemTitle}
                        </h3>
                        <p className="text-[11px] text-[var(--color-muted-foreground)] mt-1 line-clamp-2">
                          {item.shortDescription}
                        </p>
                      </div>
                    )
                  })}
                </div>

                <div className="p-3.5 rounded-xl bg-[var(--color-primary-50)] border border-[var(--color-primary-100)] flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-[var(--color-primary)]">
                      {isTelugu ? 'ఎంచుకున్న పథకం:' : isHindi ? 'चयनित योजना:' : 'Selected:'} {isTelugu && scheme.titleTelugu ? scheme.titleTelugu : isHindi && scheme.titleHindi ? scheme.titleHindi : scheme.title}
                    </p>
                  </div>
                  <Badge variant="accent">{scheme.category}</Badge>
                </div>
              </div>
            )}

            {/* Step 2: Personal Details */}
            {currentStep === 1 && (
              <div className="space-y-5 animate-fade-in">
                <div>
                  <h2 className="text-lg font-bold text-[var(--color-primary)]">
                    {t('elPersonalStep')}
                  </h2>
                  <p className="text-xs text-[var(--color-muted-foreground)] mt-0.5">
                    {t('elPersonalDesc')}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-[var(--color-foreground)] block mb-1">
                      {t('elApplicantAge')}
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={120}
                      value={formData.age}
                      onChange={(e) => setFormData({ ...formData, age: Number(e.target.value) })}
                      className="input-base text-xs"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-[var(--color-foreground)] block mb-1">
                      {t('elGender')}
                    </label>
                    <select
                      value={formData.gender}
                      onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })}
                      className="input-base text-xs"
                    >
                      <option value="Male">{isTelugu ? 'పురుషుడు' : isHindi ? 'पुरुष' : 'Male'}</option>
                      <option value="Female">{isTelugu ? 'మహిళ' : isHindi ? 'महिला' : 'Female'}</option>
                      <option value="Transgender">{isTelugu ? 'ఇతర' : isHindi ? 'अन्य / ट्रांसजेंडर' : 'Transgender'}</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-[var(--color-foreground)] block mb-1">
                      {t('elStateDomicile')}
                    </label>
                    <input
                      type="text"
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      className="input-base text-xs"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-[var(--color-foreground)] block mb-1">
                      {t('elDistrict')}
                    </label>
                    <input
                      type="text"
                      value={formData.district}
                      onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                      className="input-base text-xs"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-xs font-bold text-[var(--color-foreground)] block mb-1">
                      {t('elSocialCategory')}
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                      className="input-base text-xs"
                    >
                      <option value="General">{isTelugu ? 'జనరల్ / ఓపెన్ కేటగిరీ' : isHindi ? 'सामान्य (General)' : 'General / Open Category'}</option>
                      <option value="OBC">{isTelugu ? 'ఓబీసీ' : isHindi ? 'अन्य पिछड़ा वर्ग (OBC)' : 'Other Backward Classes (OBC)'}</option>
                      <option value="BC">{isTelugu ? 'బీసీ (తెలంగాణ)' : isHindi ? 'पिछड़ा वर्ग (BC)' : 'Backward Classes (BC - Telangana)'}</option>
                      <option value="SC">{isTelugu ? 'ఎస్సీ' : isHindi ? 'अनुसूचित जाति (SC)' : 'Scheduled Castes (SC)'}</option>
                      <option value="ST">{isTelugu ? 'ఎస్టీ' : isHindi ? 'अनुसूचित जनजाति (ST)' : 'Scheduled Tribes (ST)'}</option>
                      <option value="EWS">{isTelugu ? 'ఈడబ్ల్యూఎస్ (ఆర్థికంగా బలహీన వర్గాలు)' : isHindi ? 'आर्थिक रूप से कमजोर वर्ग (EWS)' : 'Economically Weaker Section (EWS)'}</option>
                      <option value="Minority">{isTelugu ? 'మైనారిటీ' : isHindi ? 'अल्पसंख्यक वर्ग (Minority)' : 'Religious Minority'}</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Financial & Land */}
            {currentStep === 2 && (
              <div className="space-y-5 animate-fade-in">
                <div>
                  <h2 className="text-lg font-bold text-[var(--color-primary)]">
                    {t('elEconomicStep')}
                  </h2>
                  <p className="text-xs text-[var(--color-muted-foreground)] mt-0.5">
                    {t('elEconomicDesc')}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-[var(--color-foreground)] block mb-1">
                      {t('elAnnualIncome')}
                    </label>
                    <input
                      type="number"
                      step={10000}
                      value={formData.annualIncome}
                      onChange={(e) => setFormData({ ...formData, annualIncome: Number(e.target.value) })}
                      className="input-base text-xs"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-[var(--color-foreground)] block mb-1">
                      {t('elRationCard')}
                    </label>
                    <select
                      value={formData.rationCardType}
                      onChange={(e) => setFormData({ ...formData, rationCardType: e.target.value as any })}
                      className="input-base text-xs"
                    >
                      <option value="White">{isTelugu ? 'తెల్ల రేషన్ కార్డు (బీపీఎల్ / ఆహార భద్రత)' : isHindi ? 'सफेद राशन कार्ड (BPL / खाद्य सुरक्षा)' : 'White Card (BPL / Food Security)'}</option>
                      <option value="Pink">{isTelugu ? 'గులాబీ రేషన్ కార్డు (ఏపీఎల్)' : isHindi ? 'गुलाबी राशन कार्ड (APL)' : 'Pink Card (Above Poverty Line - APL)'}</option>
                      <option value="None">{isTelugu ? 'రేషన్ కార్డు లేదు' : isHindi ? 'राशन कार्ड नहीं है' : 'No Ration Card'}</option>
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-xs font-bold text-[var(--color-foreground)] block mb-1">
                      {t('elLandholding')}
                    </label>
                    <input
                      type="number"
                      step={0.5}
                      value={formData.landholdingAcres}
                      onChange={(e) => setFormData({ ...formData, landholdingAcres: Number(e.target.value) })}
                      className="input-base text-xs"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Scheme Specific Questions */}
            {currentStep === 3 && (
              <div className="space-y-5 animate-fade-in">
                <div>
                  <h2 className="text-lg font-bold text-[var(--color-primary)]">
                    {t('elSchemeSpecificStep')}
                  </h2>
                  <p className="text-xs text-[var(--color-muted-foreground)] mt-0.5">
                    {t('elSchemeSpecificDesc')}
                  </p>
                </div>

                <div className="space-y-3">
                  {scheme.id === 'pm-kisan' && (
                    <>
                      <label className="card p-4 flex items-start gap-3 cursor-pointer hover:bg-[var(--color-muted)] transition-colors">
                        <input
                          type="checkbox"
                          checked={formData.ownsCultivableLand}
                          onChange={(e) => setFormData({ ...formData, ownsCultivableLand: e.target.checked })}
                          className="mt-0.5 h-4 w-4 text-[var(--color-primary)] rounded"
                        />
                        <div className="text-xs">
                          <span className="font-bold text-[var(--color-foreground)] block">
                            {isTelugu ? 'వ్యవసాయ సాగు భూమి రిజిస్టర్డ్ పట్టా కలిగి ఉండటం' : isHindi ? 'आवेदक / परिवार के नाम पर कृषि भूमि का कानूनी पट्टा' : 'Holds Legal Agricultural Land Title in Applicant / Family Name'}
                          </span>
                          <span className="text-[var(--color-muted-foreground)] leading-relaxed">
                            {isTelugu ? 'నా పేరిట లేదా కుటుంబ సభ్యుల పేరిట వ్యవసాయ భూమి పట్టా లేదా 1-B రికార్డు ఉంది.' : isHindi ? 'मेरे या मेरे परिवार के नाम पर राजस्व रिकॉर्ड में पंजीकृत कृषि भूमि का पट्टा है।' : 'I or my family hold registered agricultural land in land revenue records (RoR/1-B/Pattadar).'}
                          </span>
                        </div>
                      </label>

                      <label className="card p-4 flex items-start gap-3 cursor-pointer hover:bg-[var(--color-muted)] transition-colors">
                        <input
                          type="checkbox"
                          checked={formData.isGovtEmployee}
                          onChange={(e) => setFormData({ ...formData, isGovtEmployee: e.target.checked })}
                          className="mt-0.5 h-4 w-4 text-[var(--color-primary)] rounded"
                        />
                        <div className="text-xs">
                          <span className="font-bold text-[var(--color-foreground)] block">
                            {isTelugu ? 'ప్రభుత్వ ఉద్యోగి / ఆదాయపు పన్ను చెల్లింపుదారుల మినహాయింపు' : isHindi ? 'सरकारी कर्मचारी / पेंशनभोगी / आयकर दाता अपवर्जन' : 'Government Employee / Regular Pensioner / Income Tax Payee Exclusion'}
                          </span>
                          <span className="text-[var(--color-muted-foreground)] leading-relaxed">
                            {isTelugu ? 'కుటుంబంలో ఎవరైనా రాజ్యాంగ పదవి కలిగి ఉంటే లేదా ఆదాయపు పన్ను చెల్లిస్తుంటే మాత్రమే టిక్ చేయండి.' : isHindi ? 'केवल तभी चेक करें यदि परिवार का कोई सदस्य संवैधानिक पद पर है या आयकर देता है।' : 'Check this box ONLY if any family member holds constitutional post or pays income tax.'}
                          </span>
                        </div>
                      </label>
                    </>
                  )}

                  {scheme.id === 'pm-surya-ghar' && (
                    <>
                      <label className="card p-4 flex items-start gap-3 cursor-pointer hover:bg-[var(--color-muted)] transition-colors">
                        <input
                          type="checkbox"
                          checked={formData.hasRooftopSpace}
                          onChange={(e) => setFormData({ ...formData, hasRooftopSpace: e.target.checked })}
                          className="mt-0.5 h-4 w-4 text-[var(--color-primary)] rounded"
                        />
                        <div className="text-xs">
                          <span className="font-bold text-[var(--color-foreground)] block">
                            {isTelugu ? 'సౌర ప్యానెల్స్ కొరకు నీడ లేని పక్కా పైకప్పు స్థలం' : isHindi ? 'सौर पैनलों के लिए छाया-रहित पक्की छत की पर्याप्त जगह' : 'Adequate Pucca / RCC Rooftop Space Available'}
                          </span>
                          <span className="text-[var(--color-muted-foreground)] leading-relaxed">
                            {isTelugu ? 'మా ఇంటి పైకప్పుపై కనీసం 100-300 చదరపు అడుగుల నీడ లేని ఖాళీ స్థలం ఉంది.' : isHindi ? 'मेरे घर की छत पर कम से कम 100-300 वर्ग फुट खुली धूप वाली जगह उपलब्ध है।' : 'My residential roof has at least 100-300 sq.ft of unshaded south/open facing space.'}
                          </span>
                        </div>
                      </label>

                      <label className="card p-4 flex items-start gap-3 cursor-pointer hover:bg-[var(--color-muted)] transition-colors">
                        <input
                          type="checkbox"
                          checked={formData.hasDomesticPowerConnection}
                          onChange={(e) => setFormData({ ...formData, hasDomesticPowerConnection: e.target.checked })}
                          className="mt-0.5 h-4 w-4 text-[var(--color-primary)] rounded"
                        />
                        <div className="text-xs">
                          <span className="font-bold text-[var(--color-foreground)] block">
                            {isTelugu ? 'క్రియాశీల గృహ వినియోగ విద్యుత్ మీటర్ కనెక్షన్' : isHindi ? 'सक्रिय घरेलू उपभोक्ता बिजली कनेक्शन' : 'Active Domestic Consumer Electricity Meter'}
                          </span>
                          <span className="text-[var(--color-muted-foreground)] leading-relaxed">
                            {isTelugu ? 'విద్యుత్ కనెక్షన్ నా పేరిట లేదా కుటుంబ సభ్యుల పేరిట నమోదై ఉంది.' : isHindi ? 'बिजली कनेक्शन मेरे या परिवार के सदस्य के नाम पर वैध रूप से सक्रिय है।' : "The power connection is in my or family member's name with zero illegal tapping."}
                          </span>
                        </div>
                      </label>
                    </>
                  )}

                  {scheme.id === 'post-matric-scholarship' && (
                    <label className="card p-4 flex items-start gap-3 cursor-pointer hover:bg-[var(--color-muted)] transition-colors">
                      <input
                        type="checkbox"
                        checked={formData.enrolledInRecognizedInstitution}
                        onChange={(e) => setFormData({ ...formData, enrolledInRecognizedInstitution: e.target.checked })}
                        className="mt-0.5 h-4 w-4 text-[var(--color-primary)] rounded"
                      />
                      <div className="text-xs">
                        <span className="font-bold text-[var(--color-foreground)] block">
                          {isTelugu ? 'గుర్తింపు పొందిన కాలేజీలో ప్రవేశం' : isHindi ? 'मान्यता प्राप्त कॉलेज में सक्रिय प्रवेश' : 'Enrolled in UGC / AICTE / State Recognized College'}
                        </span>
                        <span className="text-[var(--color-muted-foreground)] leading-relaxed">
                          {isTelugu ? 'పదవ తరగతి తదుపరి కాలేజీలో చెల్లుబాటు అయ్యే ప్రవేశ రశీదు మరియు హాజరు ఉంది.' : isHindi ? 'मेरे पास 10वीं के बाद किसी मान्यता प्राप्त कॉलेज में वैध प्रवेश रसीद और उपस्थिति रिकॉर्ड है।' : 'I have active admission receipt and attendance record in an affiliated post-10th college.'}
                        </span>
                      </div>
                    </label>
                  )}

                  {/* Universal question */}
                  <label className="card p-4 flex items-start gap-3 cursor-pointer hover:bg-[var(--color-muted)] transition-colors">
                    <input
                      type="checkbox"
                      checked={formData.hasBPLCard}
                      onChange={(e) => setFormData({ ...formData, hasBPLCard: e.target.checked })}
                      className="mt-0.5 h-4 w-4 text-[var(--color-primary)] rounded"
                    />
                    <div className="text-xs">
                      <span className="font-bold text-[var(--color-foreground)] block">
                        {isTelugu ? 'ఆధార్ అనుసంధానించబడిన బ్యాంక్ ఖాతా కలిగి ఉండటం' : isHindi ? 'आधार-लिंक्ड सक्रिय बैंक खाता' : 'Possess Active Aadhaar-Seeded Bank Account'}
                      </span>
                      <span className="text-[var(--color-muted-foreground)] leading-relaxed">
                        {isTelugu ? 'ప్రత్యక్ష నగదు బదిలీ (DBT) నిధులను స్వీకరించడానికి ఖాతా సిద్ధంగా ఉంది.' : isHindi ? 'डीबीटी (DBT) के माध्यम से वित्तीय लाभ प्राप्त करने के लिए बैंक खाता सक्रिय है।' : 'Account is active and ready to receive Direct Benefit Transfer (DBT) via PFMS.'}
                      </span>
                    </div>
                  </label>
                </div>
              </div>
            )}

            {/* Step 5: Assessment Results */}
            {currentStep === 4 && (
              <div className="space-y-6 animate-fade-in">
                {/* Result status banner */}
                <div
                  className={`p-6 rounded-2xl border text-left flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                    assessment.status === 'Likely Eligible (Self-Reported)'
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-950'
                      : assessment.status === 'Conditional / Additional Verification Required'
                      ? 'bg-amber-500/10 border-amber-500/30 text-amber-950'
                      : 'bg-red-500/10 border-red-500/30 text-red-950'
                  }`}
                >
                  <div className="flex items-start gap-3.5">
                    {assessment.status === 'Likely Eligible (Self-Reported)' ? (
                      <CheckCircle2 className="w-8 h-8 text-[var(--color-success)] shrink-0 mt-0.5" />
                    ) : assessment.status === 'Conditional / Additional Verification Required' ? (
                      <AlertTriangle className="w-8 h-8 text-amber-600 shrink-0 mt-0.5" />
                    ) : (
                      <XCircle className="w-8 h-8 text-[var(--color-danger)] shrink-0 mt-0.5" />
                    )}

                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg sm:text-xl font-extrabold tracking-tight">
                          {statusLabel}
                        </h3>
                        <span className="badge badge-primary font-bold text-xs">{assessment.score}% {t('cardMatch')}</span>
                      </div>
                      <p className="text-xs sm:text-sm mt-1 leading-relaxed opacity-90">
                        {isTelugu ? 'పథకం:' : isHindi ? 'लक्षित योजना:' : 'Scheme Target:'} <strong>{isTelugu && scheme.titleTelugu ? scheme.titleTelugu : isHindi && scheme.titleHindi ? scheme.titleHindi : scheme.title}</strong> ({scheme.benefitAmount})
                      </p>
                    </div>
                  </div>

                  <div className="shrink-0 flex items-center gap-2">
                    <Link
                      to={`/schemes/${scheme.id}`}
                      className="btn btn-sm btn-primary text-xs font-bold"
                    >
                      {t('btnViewDetails')}
                    </Link>
                  </div>
                </div>

                {/* Database Save Status Banner */}
                {saveStatus === 'saving' && (
                  <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 text-xs flex items-center gap-2">
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-600" />
                    <span>{isTelugu ? 'అర్హత రికార్డు మీ ప్రైవేట్ డేటాబేస్‌లో భద్రపరచబడుతోంది...' : isHindi ? 'मूल्यांकन रिकॉर्ड आपके निजी डेटाबेस में सुरक्षित किया जा रहा है...' : 'Saving assessment to your private Supabase citizen record...'}</span>
                  </div>
                )}
                {saveStatus === 'saved' && (
                  <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{t('elSaveSuccess')}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveTab('history')}
                      className="text-xs font-bold text-emerald-800 underline hover:text-emerald-950 cursor-pointer"
                    >
                      {t('elHistory')}
                    </button>
                  </div>
                )}
                {saveStatus === 'unauthenticated' && (
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-xs flex items-center justify-between gap-2">
                    <span>💡 {t('elSaveLocal')}</span>
                    <Link to="/login" className="font-bold text-[var(--color-primary)] hover:underline shrink-0">
                      {t('navSignIn')}
                    </Link>
                  </div>
                )}

                {/* Requirements Met Checklist */}
                {assessment.met.length > 0 && (
                  <div className="card p-5 space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--color-success)] flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" /> {t('elMetCriteria')} ({assessment.met.length})
                    </h4>
                    <ul className="space-y-2 text-xs text-[var(--color-foreground)]">
                      {assessment.met.map((item, i) => (
                        <li key={i} className="flex items-start gap-2 p-2 rounded-lg bg-[var(--color-success-bg)]/40">
                          <span className="text-[var(--color-success)] font-bold">✓</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Requirements Not Met Checklist */}
                {assessment.notMet.length > 0 && (
                  <div className="card p-5 space-y-3 border-red-200 bg-red-50/20">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--color-danger)] flex items-center gap-1.5">
                      <XCircle className="w-4 h-4" /> {t('elUnmetCriteria')} ({assessment.notMet.length})
                    </h4>
                    <ul className="space-y-2 text-xs text-red-900">
                      {assessment.notMet.map((item, i) => (
                        <li key={i} className="flex items-start gap-2 p-2 rounded-lg bg-red-100/50">
                          <span className="text-[var(--color-danger)] font-bold">✕</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Warnings / Verification Advisories */}
                {assessment.warnings.length > 0 && (
                  <div className="card p-5 space-y-3 border-amber-200 bg-amber-50/30">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-amber-700 flex items-center gap-1.5">
                      <Info className="w-4 h-4" /> {t('elWarnings')} ({assessment.warnings.length})
                    </h4>
                    <ul className="space-y-1.5 text-xs text-amber-900">
                      {assessment.warnings.map((item, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span>•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Transparent Legal Disclaimer */}
                <div className="p-4 rounded-xl bg-[var(--color-background)] border-2 border-dashed border-[var(--color-border)] text-xs text-[var(--color-muted-foreground)] space-y-1.5">
                  <div className="flex items-center gap-2 font-bold text-[var(--color-primary)]">
                    <ShieldAlert className="w-4 h-4 text-amber-600" />
                    <span>{isTelugu ? 'పౌర సూచన & న్యాయపరమైన ప్రకటన' : isHindi ? 'महत्वपूर्ण नागरिक सूचना एवं कानूनी अस्वीकरण' : 'Important Citizen Notice & Legal Disclaimer'}</span>
                  </div>
                  <p className="leading-relaxed">
                    {t('disclaimerPreliminary')}
                  </p>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between pt-6 border-t border-[var(--color-border-subtle)]">
              {currentStep > 0 ? (
                <Button
                  variant="outline"
                  size="md"
                  onClick={() => setCurrentStep((prev) => prev - 1)}
                  leftIcon={<ArrowLeft className="w-4 h-4" />}
                  className="text-xs font-semibold cursor-pointer"
                >
                  {t('btnBack')}
                </Button>
              ) : (
                <div />
              )}

              {currentStep < stepKeys.length - 1 ? (
                <Button
                  variant="primary"
                  size="md"
                  onClick={handleAdvanceStep}
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                  className="text-xs font-bold cursor-pointer"
                >
                  {currentStep === stepKeys.length - 2 ? t('btnCheckEligibility') : t('btnNext')}
                </Button>
              ) : (
                <Button
                  variant="secondary"
                  size="md"
                  onClick={() => {
                    setCurrentStep(0)
                    setSaveStatus('idle')
                  }}
                  leftIcon={<RotateCcw className="w-4 h-4" />}
                  className="text-xs font-bold cursor-pointer"
                >
                  {t('elNewCheck')}
                </Button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 2: ASSESSMENT HISTORY ── */}
      {activeTab === 'history' && (
        <div className="space-y-6">
          {!user ? (
            <div className="card p-8 text-center bg-white shadow-xs space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center mx-auto">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-[var(--color-primary)]">
                  {isTelugu ? 'అర్హత చరిత్ర కోసం సైన్ ఇన్ అవసరం' : isHindi ? 'मूल्यांकन इतिहास के लिए नागरिक साइन-इन आवश्यक' : 'Citizen Sign-In Required for Assessment History'}
                </h3>
                <p className="text-xs text-[var(--color-muted-foreground)] max-w-md mx-auto leading-relaxed">
                  {isTelugu
                    ? 'మీ అర్హత అంచనాల చరిత్ర సురక్షిత క్లౌడ్ డేటాబేస్‌లో భద్రపరచబడుతుంది. మీ రికార్డులను ఎప్పుడైనా చూడటానికి సైన్ ఇన్ చేయండి.'
                    : isHindi
                    ? 'आपका मूल्यांकन इतिहास PostgreSQL पंक्ति-स्तरीय सुरक्षा (RLS) के तहत निजी डेटाबेस में सुरक्षित रहता है। अपने सभी मूल्यांकन देखने के लिए साइन इन करें।'
                    : 'Assessment history is securely synchronized with your private Supabase profile under PostgreSQL Row Level Security. Sign in or create an account to view and preserve all your welfare eligibility evaluations.'}
                </p>
              </div>
              <div className="flex items-center justify-center gap-3 pt-2">
                <Link to="/login" className="btn btn-sm btn-primary text-xs font-bold">
                  {t('navSignIn')}
                </Link>
                <Link to="/register" className="btn btn-sm btn-outline text-xs font-bold">
                  {t('authSignUpBtn')}
                </Link>
              </div>
            </div>
          ) : isHistoryLoading ? (
            <div className="card p-12 text-center bg-white shadow-xs space-y-3">
              <Loader2 className="w-8 h-8 text-[var(--color-secondary)] animate-spin mx-auto" />
              <p className="text-xs text-[var(--color-muted-foreground)]">
                {isTelugu ? 'మీ భద్రపరిచిన అర్హత రికార్డులు లోడ్ అవుతున్నాయి...' : isHindi ? 'डेटाबेस से आपके सुरक्षित मूल्यांकन लोड हो रहे हैं...' : 'Retrieving your saved eligibility assessments from Supabase...'}
              </p>
            </div>
          ) : historyError ? (
            <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-900 text-xs flex items-center justify-between gap-3 shadow-xs">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
                <span>{historyError}</span>
              </div>
              <button
                type="button"
                onClick={loadHistory}
                className="btn btn-xs btn-outline border-red-300 text-red-800"
              >
                {t('btnRetry')}
              </button>
            </div>
          ) : assessmentHistory.length === 0 ? (
            <EmptyState
              icon={<History className="w-8 h-8 text-[var(--color-accent)]" />}
              title={t('elNoHistory')}
              description={isTelugu ? 'మీరు ఇంకా ఎటువంటి అర్హత అంచనాలు భద్రపరచలేదు. పథకాల అర్హతను పరిశీలించడానికి కాలిక్యులేటర్ ఉపయోగించండి.' : isHindi ? 'आपने अभी तक कोई पात्रता मूल्यांकन सुरक्षित नहीं किया है। 5,000+ योजनाओं में अपनी योग्यता जांचने के लिए कैलकुलेटर का उपयोग करें।' : 'You have not saved any eligibility evaluations yet. Use our calculator to evaluate your qualification against 5,000+ central and state schemes.'}
              actionLabel={t('elNewCheck')}
              onAction={() => setActiveTab('calculator')}
              actionIcon={<Calculator className="w-4 h-4" />}
            />
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-[var(--color-muted-foreground)]">
                <span>
                  {isTelugu ? `మొత్తం ${assessmentHistory.length} భద్రపరిచిన రికార్డులు ఉన్నాయి` : isHindi ? `आपके खाते के लिए कुल ${assessmentHistory.length} सुरक्षित मूल्यांकन` : `Showing ${assessmentHistory.length} saved assessment(s) for your account`}
                </span>
                <button
                  type="button"
                  onClick={loadHistory}
                  className="text-xs font-bold text-[var(--color-secondary)] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" /> {t('btnRefresh')}
                </button>
              </div>

              <div className="space-y-3">
                {assessmentHistory.map((item) => {
                  const res = (item.assessment_result || {}) as any
                  const isExpanded = expandedAssessmentId === item.id
                  const formattedDate = new Date(item.created_at).toLocaleString(isTelugu ? 'te-IN' : isHindi ? 'hi-IN' : 'en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })

                  const isEligible = res.status === 'Likely Eligible (Self-Reported)'
                  const isConditional = res.status === 'Conditional / Additional Verification Required'

                  const histStatusLabel = isEligible
                    ? t('elLikelyEligible')
                    : isConditional
                    ? t('elConditional')
                    : t('elLikelyIneligible')

                  return (
                    <div
                      key={item.id}
                      className="card p-5 bg-white shadow-xs border border-[var(--color-border)] space-y-3 transition-all"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="space-y-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="font-bold text-sm text-[var(--color-primary)]">
                              {res.schemeTitle || item.scheme_id}
                            </h3>
                            <Badge variant={res.schemeLevel === 'Central' ? 'primary' : 'secondary'}>
                              {res.schemeLevel === 'Central' ? t('cardCentralScheme') : t('cardStateScheme')}
                            </Badge>
                            {res.benefitAmount && (
                              <span className="text-[11px] font-bold text-emerald-700">
                                {res.benefitAmount}
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-[var(--color-muted-foreground)] flex items-center gap-1">
                            <Clock className="w-3 h-3" /> {formattedDate}
                          </p>
                        </div>

                        <div className="flex items-center gap-2 self-start sm:self-auto">
                          <Badge
                            variant={isEligible ? 'success' : isConditional ? 'warning' : 'danger'}
                            dot
                          >
                            {res.score || 0}% {t('cardMatch')}
                          </Badge>
                          <span className="text-xs font-bold text-[var(--color-foreground)]">
                            {histStatusLabel}
                          </span>
                        </div>
                      </div>

                      {/* Action Bar */}
                      <div className="flex items-center justify-between pt-2 border-t border-[var(--color-border-subtle)] text-xs">
                        <button
                          type="button"
                          onClick={() => setExpandedAssessmentId(isExpanded ? null : item.id)}
                          className="font-bold text-[var(--color-secondary)] hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          <span>{isExpanded ? (isTelugu ? 'నిబంధనలను దాచు' : isHindi ? 'नियम छुपाएं' : 'Hide Evaluated Rules') : (isTelugu ? 'పరిశీలించిన నిబంధనలు చూడండి' : isHindi ? 'मूल्यांकन किए गए नियम देखें' : 'View Evaluated Rules')}</span>
                          {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                        </button>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleRetestScheme(item.scheme_id)}
                            className="btn btn-xs btn-outline text-xs flex items-center gap-1 cursor-pointer"
                          >
                            <RotateCcw className="w-3 h-3" /> {t('btnRetest')}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteAssessment(item.id)}
                            className="p-1 rounded-lg text-red-600 hover:bg-red-50 border border-transparent hover:border-red-200 cursor-pointer"
                            title={t('btnDelete')}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Expandable Details */}
                      {isExpanded && (
                        <div className="pt-3 border-t border-slate-100 space-y-3 animate-fade-in text-xs">
                          {res.met && res.met.length > 0 && (
                            <div className="space-y-1">
                              <span className="font-bold text-emerald-800 flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3 text-emerald-600" /> {t('elMetCriteria')} ({res.met.length}):
                              </span>
                              <ul className="list-disc pl-5 text-[11px] text-slate-700 space-y-0.5">
                                {res.met.map((m: string, i: number) => (
                                  <li key={i}>{m}</li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {res.notMet && res.notMet.length > 0 && (
                            <div className="space-y-1">
                              <span className="font-bold text-red-800 flex items-center gap-1">
                                <XCircle className="w-3 h-3 text-red-600" /> {t('elUnmetCriteria')} ({res.notMet.length}):
                              </span>
                              <ul className="list-disc pl-5 text-[11px] text-red-700 space-y-0.5">
                                {res.notMet.map((nm: string, i: number) => (
                                  <li key={i}>{nm}</li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {res.warnings && res.warnings.length > 0 && (
                            <div className="space-y-1">
                              <span className="font-bold text-amber-800 flex items-center gap-1">
                                <Info className="w-3 h-3 text-amber-600" /> {t('elWarnings')} ({res.warnings.length}):
                              </span>
                              <ul className="list-disc pl-5 text-[11px] text-amber-800 space-y-0.5">
                                {res.warnings.map((w: string, i: number) => (
                                  <li key={i}>{w}</li>
                                ))}
                              </ul>
                            </div>
                          )}

                          <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-[10px] text-slate-600">
                            <strong>{isTelugu ? 'పౌర ప్రకటన:' : isHindi ? 'नागरिक अस्वीकरण:' : 'Citizen Disclaimer:'}</strong> {t('disclaimerPreliminary')}
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
