import { useState, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import {
  Plus,
  X,
  ExternalLink,
  CheckCircle2,
  Building2,
  ArrowRight,
} from 'lucide-react'
import { CENTRAL_AND_STATE_SCHEMES, DetailedScheme } from '@/data/schemesData'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { useLanguage } from '@/context/LanguageContext'

export default function ComparePage() {
  const { t, fontClass, language } = useLanguage()
  const isTelugu = language === 'te'
  const isHindi = language === 'hi'
  const [searchParams] = useSearchParams()
  const addParam = searchParams.get('add')

  // Selected scheme IDs to compare (up to 3)
  const [selectedIds, setSelectedIds] = useState<string[]>(['pm-kisan', 'ayushman-bharat'])
  const [isPickerOpen, setIsPickerOpen] = useState(false)

  // Handle auto-add from query param
  useEffect(() => {
    if (addParam && CENTRAL_AND_STATE_SCHEMES.some((s) => s.id === addParam)) {
      if (!selectedIds.includes(addParam)) {
        if (selectedIds.length >= 3) {
          setSelectedIds([selectedIds[0], selectedIds[1], addParam])
        } else {
          setSelectedIds([...selectedIds, addParam])
        }
      }
    }
  }, [addParam])

  const addScheme = (id: string) => {
    if (!selectedIds.includes(id) && selectedIds.length < 3) {
      setSelectedIds([...selectedIds, id])
    }
    setIsPickerOpen(false)
  }

  const removeScheme = (id: string) => {
    setSelectedIds((prev) => prev.filter((item) => item !== id))
  }

  const schemesToCompare: DetailedScheme[] = selectedIds
    .map((id) => CENTRAL_AND_STATE_SCHEMES.find((s) => s.id === id)!)
    .filter(Boolean)

  const availableToAdd = CENTRAL_AND_STATE_SCHEMES.filter((s) => !selectedIds.includes(s.id))

  return (
    <div className={`p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 animate-fade-in ${fontClass}`}>
      {/* ── HEADER ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <Badge variant="secondary" className="mb-1.5">
            {isTelugu ? 'ప్రత్యక్ష ముఖాముఖి విశ్లేషణ' : isHindi ? 'प्रत्यक्ष तुलनात्मक विश्लेषण' : 'Direct Side-by-Side Analysis'}
          </Badge>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--color-primary)] tracking-tight">
            {t('compareTitle')}
          </h1>
          <p className="text-xs sm:text-sm text-[var(--color-muted-foreground)] mt-0.5">
            {t('compareSubtitle')}
          </p>
        </div>

        {selectedIds.length < 3 && (
          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsPickerOpen(true)}
            leftIcon={<Plus className="w-4 h-4" />}
            className="text-xs font-bold"
          >
            {t('compareAddScheme')} ({selectedIds.length}/3)
          </Button>
        )}
      </div>

      {/* ── SCHEME SELECTION SLOTS ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {schemesToCompare.map((scheme) => (
          <div key={scheme.id} className="card p-4 bg-white shadow-xs relative group border-t-4 border-t-[var(--color-secondary)]">
            <button
              type="button"
              onClick={() => removeScheme(scheme.id)}
              className="absolute top-3 right-3 p-1 rounded-md text-[var(--color-muted-foreground)] hover:text-[var(--color-danger)] hover:bg-[var(--color-danger-bg)] transition-colors"
              title={isTelugu ? 'పథకాన్ని తీసివేయండి' : isHindi ? 'योजना हटाएं' : 'Remove scheme'}
            >
              <X className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-2 mb-1.5">
              <Badge variant={scheme.level === 'Central' ? 'primary' : 'secondary'}>
                {isTelugu ? (scheme.level === 'Central' ? 'కేంద్ర ప్రభుత్వం' : 'రాష్ట్ర ప్రభుత్వం') : isHindi ? (scheme.level === 'Central' ? 'केंद्र सरकार' : 'राज्य सरकार') : scheme.level}
              </Badge>
              <Badge variant="muted">{scheme.category}</Badge>
            </div>
            <h3 className="font-bold text-sm text-[var(--color-foreground)] leading-snug pr-6">
              {isTelugu ? (scheme.titleTelugu || scheme.title) : isHindi ? (scheme.titleHindi || scheme.title) : scheme.title}
            </h3>
            <p className="font-telugu text-[11px] text-[var(--color-muted-foreground)] mt-0.5 truncate">
              {isTelugu ? scheme.title : isHindi ? scheme.title : scheme.titleTelugu}
            </p>
            <p className="text-xs font-extrabold text-[var(--color-success)] mt-2">
              {scheme.benefitAmount}
            </p>
          </div>
        ))}

        {/* Empty Slot */}
        {selectedIds.length < 3 && (
          <div
            onClick={() => setIsPickerOpen(true)}
            className="card p-6 border-2 border-dashed border-[var(--color-border)] hover:border-[var(--color-secondary)] bg-white/50 flex flex-col items-center justify-center text-center cursor-pointer transition-colors group min-h-[120px]"
          >
            <div className="w-9 h-9 rounded-full bg-[var(--color-secondary-50)] text-[var(--color-secondary)] flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
              <Plus className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-[var(--color-primary)]">
              {isTelugu ? 'పోల్చడానికి పథకాన్ని జోడించండి' : isHindi ? 'तुलना के लिए योजना जोड़ें' : 'Add Scheme to Compare'}
            </span>
            <span className="text-[10px] text-[var(--color-muted-foreground)] mt-0.5">
              {isTelugu ? 'జాబితా నుండి ఎంచుకోండి' : isHindi ? 'सूची से चुनें' : 'Choose from directory'}
            </span>
          </div>
        )}
      </div>

      {/* ── COMPARISON MATRIX TABLE ── */}
      {schemesToCompare.length === 0 ? (
        <div className="card p-12 text-center text-xs text-[var(--color-muted-foreground)]">
          {isTelugu ? 'పోలికను ప్రారంభించడానికి పైన కనీసం ఒక పథకాన్ని ఎంచుకోండి.' : isHindi ? 'तुलना शुरू करने के लिए ऊपर कम से कम एक योजना चुनें।' : 'Select at least one scheme above to begin comparison.'}
        </div>
      ) : (
        <div className="card bg-white shadow-sm overflow-hidden">
          <div className="overflow-x-auto scrollbar-thin">
            <table className="w-full text-xs text-left border-collapse min-w-[650px]">
              <tbody>
                {/* Government Level */}
                <tr className="border-b border-[var(--color-border)]">
                  <td className="p-3.5 font-bold text-[var(--color-muted-foreground)] bg-[var(--color-surface-raised)] w-1/4">
                    {isTelugu ? 'ప్రభుత్వ పరిధి' : isHindi ? 'सरकारी क्षेत्राधिकार' : 'Government Jurisdiction'}
                  </td>
                  {schemesToCompare.map((s) => (
                    <td key={s.id} className="p-3.5 font-semibold text-[var(--color-foreground)]">
                      <Badge variant={s.level === 'Central' ? 'primary' : 'secondary'}>
                        {isTelugu ? (s.level === 'Central' ? 'కేంద్ర' : 'రాష్ట్ర') : isHindi ? (s.level === 'Central' ? 'केंद्रीय' : 'राज्य') : s.level} {isTelugu ? 'ప్రభుత్వం' : isHindi ? 'सरकार' : 'Government'} {s.state ? `(${s.state})` : ''}
                      </Badge>
                    </td>
                  ))}
                </tr>

                {/* Ministry */}
                <tr className="border-b border-[var(--color-border)]">
                  <td className="p-3.5 font-bold text-[var(--color-muted-foreground)] bg-[var(--color-surface-raised)]">
                    {t('schemeNodalAgency')}
                  </td>
                  {schemesToCompare.map((s) => (
                    <td key={s.id} className="p-3.5 text-[var(--color-foreground)]">
                      <span className="flex items-center gap-1.5 font-medium">
                        <Building2 className="w-3.5 h-3.5 text-[var(--color-secondary)] shrink-0" />
                        {s.ministry}
                      </span>
                    </td>
                  ))}
                </tr>

                {/* Primary Benefit */}
                <tr className="border-b border-[var(--color-border)] bg-emerald-50/20">
                  <td className="p-3.5 font-bold text-emerald-950 bg-emerald-100/30">
                    {t('compareFinancialBenefit')}
                  </td>
                  {schemesToCompare.map((s) => (
                    <td key={s.id} className="p-3.5 font-extrabold text-sm text-[var(--color-success)]">
                      {s.benefitAmount} ({s.benefitFrequency})
                    </td>
                  ))}
                </tr>

                {/* Income Criteria */}
                <tr className="border-b border-[var(--color-border)]">
                  <td className="p-3.5 font-bold text-[var(--color-muted-foreground)] bg-[var(--color-surface-raised)]">
                    {isTelugu ? 'గరిష్ట వార్షిక ఆదాయ పరిమితి' : isHindi ? 'अधिकतम वार्षिक आय सीमा' : 'Max Annual Income Ceiling'}
                  </td>
                  {schemesToCompare.map((s) => (
                    <td key={s.id} className="p-3.5 font-semibold text-[var(--color-foreground)]">
                      {s.eligibility.maxAnnualIncome
                        ? (isTelugu ? `₹${s.eligibility.maxAnnualIncome.toLocaleString('en-IN')} / ఏడాదికి` : isHindi ? `₹${s.eligibility.maxAnnualIncome.toLocaleString('en-IN')} / वर्ष` : `₹${s.eligibility.maxAnnualIncome.toLocaleString('en-IN')} / Year`)
                        : (isTelugu ? 'గరిష్ట ఆదాయ పరిమితి లేదు' : isHindi ? 'कोई अधिकतम आय सीमा नहीं' : 'No Maximum Income Ceiling')}
                    </td>
                  ))}
                </tr>

                {/* Target Beneficiaries */}
                <tr className="border-b border-[var(--color-border)]">
                  <td className="p-3.5 font-bold text-[var(--color-muted-foreground)] bg-[var(--color-surface-raised)]">
                    {isTelugu ? 'లక్షిత లబ్ధిదారులు' : isHindi ? 'लक्षित लाभार्थी' : 'Target Beneficiaries'}
                  </td>
                  {schemesToCompare.map((s) => (
                    <td key={s.id} className="p-3.5">
                      <div className="flex flex-wrap gap-1">
                        {s.beneficiaryType.map((b) => (
                          <span key={b} className="badge badge-muted text-[10px]">{b}</span>
                        ))}
                      </div>
                    </td>
                  ))}
                </tr>

                {/* Required Documents */}
                <tr className="border-b border-[var(--color-border)]">
                  <td className="p-3.5 font-bold text-[var(--color-muted-foreground)] bg-[var(--color-surface-raised)]">
                    {t('compareRequiredDocs')}
                  </td>
                  {schemesToCompare.map((s) => (
                    <td key={s.id} className="p-3.5 text-[var(--color-foreground)]">
                      <ul className="space-y-1 text-[11px]">
                        {s.requiredDocuments.map((d, dIdx) => (
                          <li key={dIdx} className="flex items-center gap-1.5">
                            <span className="text-[var(--color-secondary)] font-bold">•</span>
                            <span>{d.name}</span>
                          </li>
                        ))}
                      </ul>
                    </td>
                  ))}
                </tr>

                {/* Official Website */}
                <tr className="border-b border-[var(--color-border)]">
                  <td className="p-3.5 font-bold text-[var(--color-muted-foreground)] bg-[var(--color-surface-raised)]">
                    {t('compareOfficialPortal')}
                  </td>
                  {schemesToCompare.map((s) => (
                    <td key={s.id} className="p-3.5">
                      <a
                        href={s.officialPortalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-[var(--color-secondary)] hover:underline"
                      >
                        {s.officialPortalUrl.replace('https://', '')} <ExternalLink className="w-3 h-3" />
                      </a>
                    </td>
                  ))}
                </tr>

                {/* Action Buttons */}
                <tr>
                  <td className="p-3.5 font-bold text-[var(--color-muted-foreground)] bg-[var(--color-surface-raised)]">
                    {isTelugu ? 'ప్రత్యక్ష చర్యలు' : isHindi ? 'प्रत्यक्ष कार्रवाई' : 'Direct Actions'}
                  </td>
                  {schemesToCompare.map((s) => (
                    <td key={s.id} className="p-3.5">
                      <div className="flex flex-col gap-2">
                        <Link
                          to={`/eligibility?schemeId=${s.id}`}
                          className="btn btn-sm btn-primary text-xs font-bold justify-center"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" /> {t('btnCheckEligibility')}
                        </Link>
                        <Link
                          to={`/schemes/${s.id}`}
                          className="btn btn-sm btn-outline text-xs font-semibold justify-center"
                        >
                          {t('btnDetails')} <ArrowRight className="w-3 h-3 ml-1" />
                        </Link>
                      </div>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── SCHEME PICKER MODAL ── */}
      {isPickerOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="card p-6 bg-white shadow-2xl max-w-lg w-full max-h-[80vh] flex flex-col space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--color-border)]">
              <h3 className="font-bold text-sm text-[var(--color-primary)]">
                {isTelugu ? 'పోలికకు జోడించడానికి పథకాన్ని ఎంచుకోండి' : isHindi ? 'तुलना में जोड़ने के लिए योजना चुनें' : 'Select Scheme to Add to Comparison'}
              </h3>
              <button
                type="button"
                onClick={() => setIsPickerOpen(false)}
                className="p-1 rounded-md text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2 pr-1 scrollbar-thin">
              {availableToAdd.length === 0 ? (
                <p className="text-xs text-[var(--color-muted-foreground)] text-center py-6">
                  {isTelugu ? 'అందుబాటులో ఉన్న అన్ని పథకాలు పోలికకు జోడించబడ్డాయి.' : isHindi ? 'सभी उपलब्ध योजनाएँ तुलना में जोड़ दी गई हैं।' : 'All available schemes have been added to the comparison.'}
                </p>
              ) : (
                availableToAdd.map((s) => (
                  <div
                    key={s.id}
                    onClick={() => addScheme(s.id)}
                    className="p-3 rounded-xl border border-[var(--color-border)] hover:border-[var(--color-secondary)] hover:bg-[var(--color-muted)] transition-all cursor-pointer flex items-center justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <Badge variant={s.level === 'Central' ? 'primary' : 'secondary'}>
                          {isTelugu ? (s.level === 'Central' ? 'కేంద్రం' : 'రాష్ట్రం') : isHindi ? (s.level === 'Central' ? 'केंद्रीय' : 'राज्य') : s.level}
                        </Badge>
                        <span className="text-[10px] text-[var(--color-muted-foreground)]">{s.category}</span>
                      </div>
                      <p className="text-xs font-bold text-[var(--color-foreground)]">
                        {isTelugu ? (s.titleTelugu || s.title) : isHindi ? (s.titleHindi || s.title) : s.title}
                      </p>
                      <p className="text-[10px] text-[var(--color-success)] font-semibold mt-0.5">{s.benefitAmount}</p>
                    </div>
                    <Button variant="outline" size="sm" className="text-xs shrink-0">
                      {isTelugu ? 'జోడించు' : isHindi ? 'जोड़ें' : 'Add'}
                    </Button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
