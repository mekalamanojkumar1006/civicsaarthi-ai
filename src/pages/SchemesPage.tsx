import { useState, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  Filter,
  LayoutGrid,
  List,
  RotateCcw,
  AlertCircle,
} from 'lucide-react'
import { CENTRAL_AND_STATE_SCHEMES } from '@/data/schemesData'
import { SchemeCard } from '@/components/schemes/SchemeCard'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { SearchInput } from '@/components/common/SearchInput'
import { EmptyState } from '@/components/common/EmptyState'
import { useLanguage } from '@/context/LanguageContext'

const categoryList = [
  { val: 'All', labelEn: 'All', labelTe: 'అన్నీ', labelHi: 'सभी' },
  { val: 'Agriculture', labelEn: 'Agriculture', labelTe: 'వ్యవసాయం', labelHi: 'कृषि' },
  { val: 'Health', labelEn: 'Health', labelTe: 'ఆరోగ్యం', labelHi: 'स्वास्थ्य' },
  { val: 'Housing', labelEn: 'Housing', labelTe: 'గృహ నిర్మాణం', labelHi: 'आवास' },
  { val: 'Education', labelEn: 'Education', labelTe: 'విద్య', labelHi: 'शिक्षा' },
  { val: 'Energy', labelEn: 'Energy', labelTe: 'సౌర శక్తి', labelHi: 'सौर ऊर्जा' },
  { val: 'Finance', labelEn: 'Finance', labelTe: 'ఆర్థికం', labelHi: 'वित्त' },
  { val: 'Women & Child', labelEn: 'Women & Child', labelTe: 'మహిళా & శిశు', labelHi: 'महिला एवं बाल' },
  { val: 'Employment', labelEn: 'Employment', labelTe: 'ఉపాధి', labelHi: 'रोजगार' },
]

const statesList = [
  { val: 'All India', labelEn: 'All India', labelTe: 'భారతదేశం మొత్తం', labelHi: 'संपूर्ण भारत' },
  { val: 'Telangana', labelEn: 'Telangana', labelTe: 'తెలంగాణ', labelHi: 'तेलंगाना' },
  { val: 'Andhra Pradesh', labelEn: 'Andhra Pradesh', labelTe: 'ఆంధ్రప్రదేశ్', labelHi: 'आंध्र प्रदेश' },
  { val: 'Karnataka', labelEn: 'Karnataka', labelTe: 'కర్ణాటక', labelHi: 'कर्नाटक' },
  { val: 'Maharashtra', labelEn: 'Maharashtra', labelTe: 'మహారాష్ట్ర', labelHi: 'महाराष्ट्र' },
  { val: 'Tamil Nadu', labelEn: 'Tamil Nadu', labelTe: 'తమిళనాడు', labelHi: 'तमिलनाडु' },
]

const beneficiaryTypes = [
  { val: 'All Beneficiaries', labelEn: 'All Beneficiaries', labelTe: 'అన్ని వర్గాల వారు', labelHi: 'सभी लाभार्थी' },
  { val: 'Farmers', labelEn: 'Farmers', labelTe: 'రైతులు', labelHi: 'किसान' },
  { val: 'Women', labelEn: 'Women', labelTe: 'మహిళలు', labelHi: 'महिलाएं' },
  { val: 'Students', labelEn: 'Students', labelTe: 'విద్యార్థులు', labelHi: 'विद्यार्थी' },
  { val: 'Small Business', labelEn: 'Small Business', labelTe: 'చిన్న వ్యాపారులు', labelHi: 'लघु उद्यमी' },
  { val: 'Low Income', labelEn: 'Low Income', labelTe: 'తక్కువ ఆదాయ వర్గాలు', labelHi: 'कम आय वर्ग' },
  { val: 'Senior Citizens', labelEn: 'Senior Citizens', labelTe: 'వృద్ధులు', labelHi: 'वरिष्ठ नागरिक' },
]

export default function SchemesPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const { t, isTelugu, isHindi, fontClass } = useLanguage()

  // State from URL query or default
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '')
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'All')
  const [selectedLevel, setSelectedLevel] = useState<'All' | 'Central' | 'State'>('All')
  const [selectedState, setSelectedState] = useState('All India')
  const [selectedBeneficiary, setSelectedBeneficiary] = useState('All Beneficiaries')
  const [sortBy, setSortBy] = useState<'relevance' | 'matchScore' | 'newest'>('relevance')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [showFiltersMobile, setShowFiltersMobile] = useState(false)

  // Filtered and sorted schemes
  const filteredSchemes = useMemo(() => {
    return CENTRAL_AND_STATE_SCHEMES.filter((scheme) => {
      // Search term
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase()
        const matchTitle = scheme.title.toLowerCase().includes(query)
        const matchTelugu = scheme.titleTelugu?.toLowerCase().includes(query)
        const matchHindi = scheme.titleHindi?.toLowerCase().includes(query)
        const matchDesc = scheme.shortDescription.toLowerCase().includes(query)
        const matchMinistry = scheme.ministry.toLowerCase().includes(query)
        if (!matchTitle && !matchTelugu && !matchHindi && !matchDesc && !matchMinistry) {
          return false
        }
      }

      // Category
      if (selectedCategory !== 'All' && scheme.category !== selectedCategory) {
        return false
      }

      // Government Level
      if (selectedLevel !== 'All' && scheme.level !== selectedLevel) {
        return false
      }

      // State Filter
      if (selectedState !== 'All India') {
        if (scheme.level === 'State' && scheme.state !== selectedState) {
          return false
        }
      }

      // Beneficiary Type
      if (selectedBeneficiary !== 'All Beneficiaries') {
        const hasBeneficiary = scheme.beneficiaryType.some((b) => b === selectedBeneficiary)
        if (!hasBeneficiary) return false
      }

      return true
    }).sort((a, b) => {
      if (sortBy === 'matchScore') {
        return b.matchScoreDefault - a.matchScoreDefault
      }
      if (sortBy === 'newest') {
        return b.launchYear - a.launchYear
      }
      return 0
    })
  }, [searchQuery, selectedCategory, selectedLevel, selectedState, selectedBeneficiary, sortBy])

  const resetFilters = () => {
    setSearchQuery('')
    setSelectedCategory('All')
    setSelectedLevel('All')
    setSelectedState('All India')
    setSelectedBeneficiary('All Beneficiaries')
    setSortBy('relevance')
    setSearchParams({})
  }

  const activeFilterCount =
    (selectedCategory !== 'All' ? 1 : 0) +
    (selectedLevel !== 'All' ? 1 : 0) +
    (selectedState !== 'All India' ? 1 : 0) +
    (selectedBeneficiary !== 'All Beneficiaries' ? 1 : 0) +
    (searchQuery.trim() ? 1 : 0)

  return (
    <div className={`p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 animate-fade-in ${fontClass}`}>
      {/* ── DEMO NOTICE BANNER ── */}
      <div className="flex items-center justify-between px-3.5 py-2 rounded-xl bg-amber-500/10 border border-amber-500/25 text-amber-900 text-xs font-semibold">
        <span className="flex items-center gap-1.5">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
          <span>{isTelugu ? 'సంక్షేమ పథకాల డైరెక్టరీ: ధ్రువీకరించబడిన ప్రముఖ కేంద్ర మరియు రాష్ట్ర సంక్షేమ పథకాలు.' : isHindi ? 'कल्याणकारी योजनाएं: सत्यापित प्रमुख केंद्रीय एवं राज्य कल्याणकारी योजनाएं।' : 'Stage 3.1 Directory: Showing 10 curated central & state welfare records in demonstration mode.'}</span>
        </span>
        <span className="badge badge-warning text-[10px] hidden sm:inline-flex">{isTelugu ? 'అధికారిక జాబితా' : isHindi ? 'आधिकारिक सूची' : 'Demonstration Catalog'}</span>
      </div>

      {/* ── HEADER ── */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--color-primary)] tracking-tight">
            {t('navSchemes')}
          </h1>
          <p className="text-xs sm:text-sm text-[var(--color-muted-foreground)] mt-1">
            {t('subSchemes')}
          </p>
        </div>

        {/* View mode & total count */}
        <div className="flex items-center gap-3">
          <div className="text-xs text-[var(--color-muted-foreground)] font-medium">
            {t('schemesShowingCount')} <strong className="text-[var(--color-foreground)]">{filteredSchemes.length}</strong> {t('schemesCountSuffix')}
          </div>

          <div className="flex items-center rounded-xl border border-[var(--color-border)] p-0.5 bg-white shadow-xs">
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                viewMode === 'grid'
                  ? 'bg-[var(--color-primary)] text-white'
                  : 'text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)]'
              }`}
              title={t('schemesGridView')}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                viewMode === 'list'
                  ? 'bg-[var(--color-primary)] text-white'
                  : 'text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)]'
              }`}
              title={t('schemesListView')}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* ── SEARCH & PRIMARY FILTER TOOLBAR ── */}
      <div className="card p-4 space-y-4 shadow-sm bg-white">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <SearchInput
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onClear={() => setSearchQuery('')}
              placeholder={t('labelSearchPlaceholder')}
            />
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="md"
              onClick={() => setShowFiltersMobile(!showFiltersMobile)}
              className="sm:hidden text-xs font-semibold flex-1"
              leftIcon={<Filter className="w-3.5 h-3.5" />}
            >
              {t('schemesFiltersMobile')} {activeFilterCount > 0 && `(${activeFilterCount})`}
            </Button>

            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="input-base text-xs h-10 w-auto font-semibold px-3 cursor-pointer"
            >
              <option value="relevance">{t('schemesSortRelevance')}</option>
              <option value="matchScore">{t('schemesSortMatchScore')}</option>
              <option value="newest">{t('schemesSortNewest')}</option>
            </select>
          </div>
        </div>

        {/* ── CATEGORY PILLS ── */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {categoryList.map((cat) => {
            const label = isTelugu ? cat.labelTe : isHindi ? cat.labelHi : cat.labelEn
            return (
              <button
                key={cat.val}
                type="button"
                onClick={() => setSelectedCategory(cat.val)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all border cursor-pointer ${
                  selectedCategory === cat.val
                    ? 'bg-[var(--color-primary)] text-white border-[var(--color-primary)] shadow-xs'
                    : 'bg-white text-[var(--color-foreground)] border-[var(--color-border)] hover:border-[var(--color-secondary)] hover:bg-[var(--color-muted)]'
                }`}
              >
                {label}
              </button>
            )
          })}
        </div>

        {/* ── EXTENDED FILTER BAR (Govt Level, State, Beneficiary) ── */}
        <div
          className={`grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-[var(--color-border-subtle)] ${
            showFiltersMobile ? 'block' : 'hidden sm:grid'
          }`}
        >
          {/* Government Level Toggle */}
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-muted-foreground)] block mb-1">
              {t('schemesGovtLevel')}
            </label>
            <div className="grid grid-cols-3 gap-1 p-0.5 rounded-lg bg-[var(--color-background)] border border-[var(--color-border)] text-xs font-semibold">
              {(
                [
                  { val: 'All', labelEn: 'All', labelTe: 'అన్నీ', labelHi: 'सभी' },
                  { val: 'Central', labelEn: 'Central', labelTe: 'కేంద్ర', labelHi: 'केंद्रीय' },
                  { val: 'State', labelEn: 'State', labelTe: 'రాష్ట్ర', labelHi: 'राज्य' },
                ] as const
              ).map((lvl) => (
                <button
                  key={lvl.val}
                  type="button"
                  onClick={() => setSelectedLevel(lvl.val as any)}
                  className={`py-1 rounded-md text-center transition-colors cursor-pointer ${
                    selectedLevel === lvl.val
                      ? 'bg-white text-[var(--color-primary)] shadow-xs font-bold'
                      : 'text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)]'
                  }`}
                >
                  {isTelugu ? lvl.labelTe : isHindi ? lvl.labelHi : lvl.labelEn}
                </button>
              ))}
            </div>
          </div>

          {/* State Filter */}
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-muted-foreground)] block mb-1">
              {t('schemesLocationState')}
            </label>
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="input-base text-xs h-8 px-2 font-medium cursor-pointer"
            >
              {statesList.map((st) => (
                <option key={st.val} value={st.val}>
                  {isTelugu ? st.labelTe : isHindi ? st.labelHi : st.labelEn}
                </option>
              ))}
            </select>
          </div>

          {/* Beneficiary Filter */}
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-muted-foreground)] block mb-1">
              {t('schemesBeneficiaryFocus')}
            </label>
            <select
              value={selectedBeneficiary}
              onChange={(e) => setSelectedBeneficiary(e.target.value)}
              className="input-base text-xs h-8 px-2 font-medium cursor-pointer"
            >
              {beneficiaryTypes.map((ben) => (
                <option key={ben.val} value={ben.val}>
                  {isTelugu ? ben.labelTe : isHindi ? ben.labelHi : ben.labelEn}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Active Filter Badges & Reset */}
        {activeFilterCount > 0 && (
          <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[var(--color-border-subtle)]">
            <div className="flex flex-wrap items-center gap-1.5 text-xs">
              <span className="text-[11px] text-[var(--color-muted-foreground)]">{t('schemesActiveFilters')}</span>
              {selectedCategory !== 'All' && <Badge variant="secondary">{selectedCategory}</Badge>}
              {selectedLevel !== 'All' && <Badge variant="primary">{selectedLevel}</Badge>}
              {selectedState !== 'All India' && <Badge variant="muted">{selectedState}</Badge>}
              {selectedBeneficiary !== 'All Beneficiaries' && <Badge variant="accent">{selectedBeneficiary}</Badge>}
              {searchQuery && <Badge variant="info">"{searchQuery}"</Badge>}
            </div>

            <button
              type="button"
              onClick={resetFilters}
              className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--color-danger)] hover:underline cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{t('schemesResetAll')}</span>
            </button>
          </div>
        )}
      </div>

      {/* ── SCHEMES RESULTS ── */}
      {filteredSchemes.length === 0 ? (
        <EmptyState
          title={t('schemesNoMatch')}
          description={t('schemesNoMatchDesc')}
          actionLabel={t('schemesClearFilters')}
          onAction={resetFilters}
          actionIcon={<RotateCcw className="w-4 h-4" />}
        />
      ) : (
        <div
          className={
            viewMode === 'grid'
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
              : 'space-y-4'
          }
        >
          {filteredSchemes.map((scheme) => (
            <SchemeCard
              key={scheme.id}
              layout={viewMode}
              scheme={{
                id: scheme.id,
                title: scheme.title,
                titleTelugu: scheme.titleTelugu,
                description: scheme.shortDescription,
                ministry: scheme.ministry,
                level: scheme.level,
                state: scheme.state,
                category: scheme.category,
                benefitAmount: scheme.benefitAmount,
                eligibilityScore: scheme.matchScoreDefault,
              }}
            />
          ))}
        </div>
      )}
    </div>
  )
}
