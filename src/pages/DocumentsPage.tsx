import { useState, useEffect, useRef } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  RotateCcw,
  Building2,
  HelpCircle,
  Upload,
  FileText,
  Trash2,
  Eye,
  Loader2,
  Lock,
  File,
  Image,
  Database,
  ShieldCheck,
  Check,
} from 'lucide-react'
import { CENTRAL_AND_STATE_SCHEMES } from '@/data/schemesData'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { EmptyState } from '@/components/common/EmptyState'
import { useAuth } from '@/context/AuthContext'
import { useApp } from '@/context/AppContext'
import { dbService } from '@/services/dbService'
import {
  storageService,
  validateCitizenFile,
} from '@/services/storageService'
import type { CitizenDocument } from '@/types/supabase'
import { useLanguage } from '@/context/LanguageContext'

type DocStatus = 'available' | 'need_to_obtain' | 'missing'

interface DocItemState {
  name: string
  type: string
  description: string
  issuingAuthority: string
  isMandatory: boolean
  status: DocStatus
}

const DOCUMENT_CATEGORIES = [
  'Aadhaar / National Identity Card',
  'Income Certificate (MeeSeva / Tahsildar)',
  'Caste / Community Certificate',
  'Land Ownership Record (RoR 1-B / Pattadar)',
  'Electricity Consumer Bill (Domestic)',
  'Ration Card / Food Security Card',
  'Student ID / College Bonafide',
  'Bank Passbook / Cancelled Cheque',
  'Birth / Age Certificate',
  'Disability (SADAREM) Certificate',
  'Other Supporting Document',
]

const DOCUMENT_CATEGORIES_TELUGU: Record<string, string> = {
  'Aadhaar / National Identity Card': 'ఆధార్ కార్డు / జాతీయ గుర్తింపు కార్డు',
  'Income Certificate (MeeSeva / Tahsildar)': 'ఆదాయ ధృవీకరణ పత్రం (మీసేవ / తహశీల్దార్)',
  'Caste / Community Certificate': 'కుల ధృవీకరణ పత్రం',
  'Land Ownership Record (RoR 1-B / Pattadar)': 'భూ యాజమాన్య రికార్డు (RoR 1-B / పట్టాదారు పాస్‌బుక్)',
  'Electricity Consumer Bill (Domestic)': 'గృహ విద్యుత్ వినియోగ బిల్లు',
  'Ration Card / Food Security Card': 'రేషన్ కార్డు / ఆహార భద్రతా కార్డు',
  'Student ID / College Bonafide': 'విద్యార్థి గుర్తింపు కార్డు / బోనఫైడ్',
  'Bank Passbook / Cancelled Cheque': 'బ్యాంక్ పాస్‌బుక్ / రద్దయిన చెక్కు',
  'Birth / Age Certificate': 'పుట్టిన తేదీ / వయస్సు ధృవీకరణ పత్రం',
  'Disability (SADAREM) Certificate': 'సదరం వికలాంగత్వ ధృవీకరణ పత్రం',
  'Other Supporting Document': 'ఇతర ఆధార పత్రాలు',
}

const HOW_TO_OBTAIN_GUIDANCE: Record<string, string> = {
  'Aadhaar Card':
    'Visit any Aadhaar Seva Kendra or post office with address proof. Or download masked e-Aadhaar from myaadhaar.uidai.gov.in using registered mobile OTP.',
  'Land Ownership Document (Pattadar Passbook / RoR 1-B)':
    'Download digital signed 1-B / Pattadar copy from the Telangana Dharani portal (dharani.telangana.gov.in) or visit your Mandal Tahsildar office / MeeSeva center.',
  'Income Certificate':
    'Apply online at MeeSeva / e-District portal with salary slip / affidavit. Verification completed by Revenue Inspector within 7 working days.',
  'Caste Certificate':
    'Apply via MeeSeva portal with school TC, ancestral record, or parent caste certificate. Issued by Tahsildar.',
  'Electricity Bill':
    'Download latest computerized PDF bill from TGSPDCL / TSSPDCL web portal or consumer mobile app.',
  'Ration Card':
    'Download digital Food Security Card copy from Telangana Civil Supplies portal (epds.telangana.gov.in).',
}


const DOCUMENT_CATEGORIES_HINDI: Record<string, string> = {
  'Aadhaar / National Identity Card': 'आधार कार्ड / राष्ट्रीय पहचान पत्र',
  'Income Certificate (MeeSeva / Tahsildar)': 'आय प्रमाण पत्र (तहसीलदार / ई-डिस्ट्रिक्ट)',
  'Caste / Community Certificate': 'जाति प्रमाण पत्र',
  'Land Ownership Record (RoR 1-B / Pattadar)': 'भूमि स्वामित्व रिकॉर्ड (खतौनी / पट्टा पासबुक)',
  'Electricity Consumer Bill (Domestic)': 'घरेलू बिजली बिल',
  'Ration Card / Food Security Card': 'राशन कार्ड / खाद्य सुरक्षा कार्ड',
  'Student ID / College Bonafide': 'छात्र पहचान पत्र / कॉलेज बोनाफाइड',
  'Bank Passbook / Cancelled Cheque': 'बैंक पासबुक / रद्द किया गया चेक',
  'Birth / Age Certificate': 'जन्म / आयु प्रमाण पत्र',
  'Disability (SADAREM) Certificate': 'दिव्यांगता प्रमाण पत्र (UDID)',
  'Other Supporting Document': 'अन्य सहायक दस्तावेज़',
}

const HOW_TO_OBTAIN_GUIDANCE_HINDI: Record<string, string> = {
  'Aadhaar Card':
    'पते के प्रमाण के साथ नजदीकी आधार सेवा केंद्र या डाकघर जाएं। या पंजीकृत मोबाइल ओटीपी के साथ myaadhaar.uidai.gov.in से ई-आधार डाउनलोड करें।',
  'Land Ownership Document (Pattadar Passbook / RoR 1-B)':
    'राज्य के भूलेख/राजस्व पोर्टल से डिजिटल हस्ताक्षरित खतौनी/पट्टा प्रति डाउनलोड करें या तहसील कार्यालय जाएं।',
  'Income Certificate':
    'वेतन पर्ची या हलफनामे के साथ ई-डिस्ट्रिक्ट पोर्टल पर ऑनलाइन आवेदन करें। 7 कार्य दिवसों में राजस्व निरीक्षक द्वारा सत्यापन पूरा किया जाता है।',
  'Caste Certificate':
    'स्कूल टीसी, पैतृक रिकॉर्ड या माता-पिता के जाति प्रमाण पत्र के साथ ई-डिस्ट्रिक्ट पोर्टल से आवेदन करें।',
  'Electricity Bill':
    'विद्युत वितरण निगम (DISCOM) के आधिकारिक पोर्टल या उपभोक्ता मोबाइल ऐप से नवीनतम बिल डाउनलोड करें।',
  'Ration Card':
    'राज्य खाद्य एवं नागरिक आपूर्ति पोर्टल से डिजिटल राशन कार्ड डाउनलोड करें।',
}

const HOW_TO_OBTAIN_GUIDANCE_TELUGU: Record<string, string> = {
  'Aadhaar Card':
    'చిరునామా రుజువుతో సమీపంలోని ఆధార్ సేవా కేంద్రం లేదా పోస్టాఫీసును సందర్శించండి. లేదా myaadhaar.uidai.gov.in నుండి మొబైల్ ఓటీపీ ద్వారా ఈ-ఆధార్‌ను డౌన్‌లోడ్ చేసుకోండి.',
  'Land Ownership Document (Pattadar Passbook / RoR 1-B)':
    'తెలంగాణ ధరణి పోర్టల్ (dharani.telangana.gov.in) నుండి డిజిటల్ సంతకం చేసిన 1-B / పట్టాదారు కాపీని డౌన్‌లోడ్ చేసుకోండి లేదా మీ మండల తహశీల్దార్ కార్యాలయం / మీసేవ కేంద్రాన్ని సందర్శించండి.',
  'Income Certificate':
    'జీతం స్లిప్ లేదా అఫిడవిట్‌తో మీసేవ పోర్టల్‌లో ఆన్‌లైన్‌లో దరఖాస్తు చేసుకోండి. రెవెన్యూ ఇన్‌స్పెక్టర్ 7 పనిదినాల్లో ధృవీకరణ పూర్తి చేస్తారు.',
  'Caste Certificate':
    'పాఠశాల టీసీ, పూర్వీకుల రికార్డు లేదా తల్లిదండ్రుల కుల ధృవీకరణ పత్రంతో మీసేవ పోర్టల్ ద్వారా దరఖాస్తు చేసుకోండి. తహశీల్దార్ ద్వారా జారీ చేయబడుతుంది.',
  'Electricity Bill':
    'TGSPDCL / TSSPDCL వెబ్ పోర్టల్ లేదా వినియోగదారుల మొబైల్ యాప్ నుండి తాజా కంప్యూటరీకరించిన బిల్లును డౌన్‌లోడ్ చేసుకోండి.',
  'Ration Card':
    'తెలంగాణ పౌర సరఫరాల పోర్టల్ (epds.telangana.gov.in) నుండి డిజిటల్ ఆహార భద్రతా కార్డు కాపీని డౌన్‌లోడ్ చేసుకోండి.',
}

function formatBytes(bytes: number): string {
  if (!bytes || bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`
}

export default function DocumentsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const initialSchemeId = searchParams.get('schemeId') || CENTRAL_AND_STATE_SCHEMES[0].id
  const { user } = useAuth()
  const { isDatabaseSynced } = useApp()
  const { t, fontClass, language } = useLanguage()
  const isTelugu = language === 'te'
  const isHindi = language === 'hi'

  // Tabs: 'locker' (Uploads) or 'checklist' (Requirements checklist)
  const [activeTab, setActiveTab] = useState<'locker' | 'checklist'>('locker')

  // Document Locker State
  const [uploadedDocuments, setUploadedDocuments] = useState<CitizenDocument[]>([])
  const [isLockerLoading, setIsLockerLoading] = useState<boolean>(false)
  const [lockerError, setLockerError] = useState<string | null>(null)

  // Upload Form State
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string>(DOCUMENT_CATEGORIES[0])
  const [isUploading, setIsUploading] = useState<boolean>(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Document action loading (preview / delete)
  const [activeActionDocId, setActiveActionDocId] = useState<string | null>(null)

  // Scheme Checklist State
  const [selectedSchemeId, setSelectedSchemeId] = useState(initialSchemeId)
  const selectedScheme =
    CENTRAL_AND_STATE_SCHEMES.find((s) => s.id === selectedSchemeId) || CENTRAL_AND_STATE_SCHEMES[0]

  const [checklist, setChecklist] = useState<Record<string, DocItemState[]>>(() => {
    const map: Record<string, DocItemState[]> = {}
    CENTRAL_AND_STATE_SCHEMES.forEach((sc) => {
      map[sc.id] = sc.requiredDocuments.map((doc, idx) => ({
        ...doc,
        status: idx === 0 ? 'available' : idx === 1 ? 'need_to_obtain' : 'missing',
      }))
    })
    return map
  })

  // Load user's uploaded documents from Supabase
  const loadDocuments = async () => {
    if (!user || !isDatabaseSynced) {
      setUploadedDocuments([])
      return
    }

    setIsLockerLoading(true)
    setLockerError(null)

    const res = await dbService.getDocuments(user.id)
    setIsLockerLoading(false)

    if (res.success && res.data) {
      setUploadedDocuments(res.data)
    } else if (res.error) {
      setLockerError(res.error)
    }
  }

  useEffect(() => {
    if (user && isDatabaseSynced) {
      loadDocuments()
    } else {
      setUploadedDocuments([])
    }
  }, [user, isDatabaseSynced])

  // File selection & client-side validation
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    setUploadError(null)
    setUploadSuccess(null)

    if (!file) {
      setSelectedFile(null)
      return
    }

    const validation = validateCitizenFile(file)
    if (!validation.isValid) {
      setUploadError(validation.error || 'Invalid file format.')
      setSelectedFile(null)
      if (fileInputRef.current) fileInputRef.current.value = ''
      return
    }

    setSelectedFile(file)
  }

  // Upload handler
  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !isDatabaseSynced) {
      setUploadError('You must be signed in to upload citizen documents.')
      return
    }

    if (!selectedFile) {
      setUploadError('Please select a PDF, JPEG, or PNG document to upload.')
      return
    }

    setIsUploading(true)
    setUploadError(null)
    setUploadSuccess(null)

    const res = await storageService.uploadAndRecordDocument({
      userId: user.id,
      file: selectedFile,
      documentCategory: selectedCategory,
    })

    setIsUploading(false)

    if (res.success && res.data) {
      setUploadSuccess(`Document "${selectedFile.name}" securely stored in private locker.`)
      setSelectedFile(null)
      if (fileInputRef.current) fileInputRef.current.value = ''
      setUploadedDocuments((prev) => [res.data!, ...prev])
    } else {
      setUploadError(res.error || 'Failed to upload document. Please try again.')
    }
  }

  // Preview or download signed URL
  const handlePreviewDownload = async (doc: CitizenDocument) => {
    setActiveActionDocId(doc.id)
    const res = await storageService.createSignedUrl(doc.storage_path, 300)
    setActiveActionDocId(null)

    if (res.success && res.data?.signedUrl) {
      window.open(res.data.signedUrl, '_blank', 'noopener,noreferrer')
    } else {
      alert(`Could not open document: ${res.error || 'Permission error'}`)
    }
  }

  // Delete document handler
  const handleDeleteDocument = async (doc: CitizenDocument) => {
    if (!user) return
    const confirmed = window.confirm(
      `Are you sure you want to permanently delete "${doc.file_name}" from your citizen document locker?`
    )
    if (!confirmed) return

    setActiveActionDocId(doc.id)
    const res = await storageService.deleteDocumentAndMetadata({
      userId: user.id,
      documentId: doc.id,
      storagePath: doc.storage_path,
    })
    setActiveActionDocId(null)

    if (res.success) {
      setUploadedDocuments((prev) => prev.filter((d) => d.id !== doc.id))
    } else {
      alert(`Deletion failed: ${res.error || 'Unknown error'}`)
    }
  }

  // Checklist status helpers
  const currentDocs = checklist[selectedScheme.id] || []
  const setItemStatus = (docName: string, status: DocStatus) => {
    setChecklist((prev) => ({
      ...prev,
      [selectedScheme.id]: (prev[selectedScheme.id] || []).map((item) =>
        item.name === docName ? { ...item, status } : item
      ),
    }))
  }

  const resetCurrentChecklist = () => {
    setChecklist((prev) => ({
      ...prev,
      [selectedScheme.id]: selectedScheme.requiredDocuments.map((doc) => ({
        ...doc,
        status: 'missing',
      })),
    }))
  }

  const totalDocs = currentDocs.length
  const availableDocs = currentDocs.filter((d) => d.status === 'available').length
  const needToObtainDocs = currentDocs.filter((d) => d.status === 'need_to_obtain').length
  const missingDocs = currentDocs.filter((d) => d.status === 'missing').length
  const completionPercentage = totalDocs > 0 ? Math.round((availableDocs / totalDocs) * 100) : 0

  return (
    <div className={`p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto space-y-6 animate-fade-in ${fontClass}`}>
      {/* ── HEADER & TAB SELECTOR ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <Badge variant="primary">{t('navDocuments')}</Badge>
            {isDatabaseSynced ? (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                <Database className="w-3 h-3" /> {isTelugu ? 'ప్రైవేట్ నిల్వ క్రియాశీలంగా ఉంది' : isHindi ? 'निजी स्टोरेज सक्रिय' : 'Private Storage Active'}
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                {isTelugu ? 'స్థానిక ప్రివ్యూ మోడ్' : isHindi ? 'स्थानीय पूर्वावलोकन मोड' : 'Local Preview Mode'}
              </span>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--color-primary)] tracking-tight">
            {t('docLockerTitle')}
          </h1>
          <p className="text-xs sm:text-sm text-[var(--color-muted-foreground)] mt-0.5">
            {t('subDocuments')}
          </p>
        </div>

        {/* Tab switchers */}
        <div className="flex items-center gap-1 p-1 bg-white border border-[var(--color-border)] rounded-xl shadow-xs self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setActiveTab('locker')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'locker'
                ? 'bg-[var(--color-primary)] text-white shadow-xs'
                : 'text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)]'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>{t('docLockerTitle')}</span>
            {uploadedDocuments.length > 0 && (
              <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-white/20 text-white font-extrabold">
                {uploadedDocuments.length}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('checklist')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'checklist'
                ? 'bg-[var(--color-primary)] text-white shadow-xs'
                : 'text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)]'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>{t('docChecklistTitle')}</span>
          </button>
        </div>
      </div>

      {/* ── TAB 1: DOCUMENT LOCKER (Real Supabase Storage) ── */}
      {activeTab === 'locker' && (
        <div className="space-y-6">
          {/* Unauthenticated Banner */}
          {!user && (
            <div className="card p-6 bg-white shadow-xs border border-amber-200 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center mx-auto">
                <Lock className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-[var(--color-primary)]">
                  {isTelugu ? 'పత్రాల లాకర్ కోసం పౌరుల సైన్ ఇన్ అవసరం' : isHindi ? 'दस्तावेज़ लॉकर के लिए नागरिक साइन-इन आवश्यक' : 'Citizen Sign-In Required for Document Locker'}
                </h3>
                <p className="text-xs text-[var(--color-muted-foreground)] max-w-lg mx-auto leading-relaxed">
                  {isTelugu
                    ? 'పౌర పత్రాల లాకర్ మీ సున్నితమైన ప్రభుత్వ ధృవీకరణ పత్రాలను (ఆధార్, ఆదాయం, పట్టాదారు పాస్‌బుక్) ప్రైవేట్ మరియు ఎన్‌క్రిప్టెడ్ క్లౌడ్ స్టోరేజ్‌లో భద్రపరుస్తుంది. మీ ఫైళ్లను అప్‌లోడ్ చేయడానికి మరియు నిర్వహించడానికి సైన్ ఇన్ చేయండి.'
                    : 'The citizen document locker stores sensitive government certificates (Aadhaar, Income, Land Passbook) inside a private, encrypted Supabase Storage bucket isolated by PostgreSQL Row Level Security. Sign in to upload and manage your files.'}
                </p>
              </div>
              <div className="flex items-center justify-center gap-3 pt-1">
                <Link to="/login" className="btn btn-sm btn-primary text-xs font-bold">
                  {isTelugu ? 'లాకర్‌ను తెరవడానికి సైన్ ఇన్ చేయండి' : isHindi ? 'लॉकर खोलने के लिए साइन इन करें' : 'Sign In to Access Locker'}
                </Link>
                <Link to="/register" className="btn btn-sm btn-outline text-xs font-bold">
                  {isTelugu ? 'పౌర ఖాతాను సృష్టించండి' : isHindi ? 'नया नागरिक खाता बनाएं' : 'Create Citizen Account'}
                </Link>
              </div>
            </div>
          )}

          {/* Upload Component */}
          {user && (
            <form onSubmit={handleUpload} className="card p-6 bg-white shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[var(--color-border-subtle)] gap-2">
                <div>
                  <h3 className="text-sm font-bold text-[var(--color-primary)] flex items-center gap-2">
                    <Upload className="w-4 h-4 text-[var(--color-secondary)]" />
                    {isTelugu ? 'కొత్త పౌర పత్రాన్ని అప్‌లోడ్ చేయండి' : isHindi ? 'नया नागरिक दस्तावेज़ अपलोड करें' : 'Upload New Citizen Document'}
                  </h3>
                  <p className="text-[11px] text-[var(--color-muted-foreground)]">
                    {isTelugu ? (
                      <>అనుమతించబడినవి: <strong>PDF, JPEG, PNG</strong> • గరిష్ట పరిమాణం: <strong>15 MB</strong></>
                    ) : (
                      <>Accepted: <strong>PDF, JPEG, PNG</strong> • Maximum file size: <strong>15 MB</strong></>
                    )}
                  </p>
                </div>
                <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-semibold border border-emerald-200 self-start sm:self-auto flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> {isTelugu ? 'సురక్షిత డేటాబేస్ ఎన్‌క్రిప్షన్' : isHindi ? 'निजी RLS एन्क्रिप्टेड' : 'Private RLS Encrypted'}
                </span>
              </div>

              {/* Upload Success Alert */}
              {uploadSuccess && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center justify-between gap-2 shadow-xs">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{uploadSuccess}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setUploadSuccess(null)}
                    className="text-xs font-bold text-emerald-800 hover:underline"
                  >
                    {isTelugu ? 'తీసివేయి' : 'Dismiss'}
                  </button>
                </div>
              )}

              {/* Upload Error Alert */}
              {uploadError && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-900 text-xs flex items-center justify-between gap-2 shadow-xs">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
                    <span>{uploadError}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setUploadError(null)}
                    className="text-xs font-bold text-red-800 hover:underline"
                  >
                    {isTelugu ? 'తీసివేయి' : 'Dismiss'}
                  </button>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-[var(--color-foreground)] block mb-1">
                    {isTelugu ? 'పత్రం యొక్క వర్గం' : isHindi ? 'दस्तावेज़ की श्रेणी' : 'Document Category'}
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="input-base text-xs"
                    disabled={isUploading}
                  >
                    {DOCUMENT_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {isTelugu ? (DOCUMENT_CATEGORIES_TELUGU[cat] || cat) : isHindi ? (DOCUMENT_CATEGORIES_HINDI[cat] || cat) : cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-[var(--color-foreground)] block mb-1">
                    {isTelugu ? 'పత్రం ఫైల్‌ను ఎంచుకోండి' : isHindi ? 'दस्तावेज़ फ़ाइल चुनें' : 'Select Document File'}
                  </label>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"
                    onChange={handleFileChange}
                    className="input-base text-xs file:mr-2 file:py-1 file:px-2.5 file:rounded-md file:border-0 file:text-xs file:font-bold file:bg-[var(--color-primary-50)] file:text-[var(--color-primary)] hover:file:bg-[var(--color-primary-100)] cursor-pointer"
                    disabled={isUploading}
                  />
                </div>
              </div>

              {selectedFile && (
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 min-w-0">
                    <File className="w-4 h-4 text-[var(--color-secondary)] shrink-0" />
                    <span className="font-bold text-[var(--color-foreground)] truncate">
                      {selectedFile.name}
                    </span>
                    <span className="text-[var(--color-muted-foreground)] shrink-0">
                      ({formatBytes(selectedFile.size)})
                    </span>
                  </div>
                  <Badge variant="accent">{selectedFile.type.split('/')[1]?.toUpperCase() || 'FILE'}</Badge>
                </div>
              )}

              <div className="flex items-center justify-end pt-2">
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  disabled={!selectedFile || isUploading}
                  leftIcon={
                    isUploading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Upload className="w-4 h-4" />
                    )
                  }
                  className="text-xs font-bold"
                >
                  {isUploading
                    ? (isTelugu ? 'ఎన్‌క్రిప్ట్ చేసి అప్‌లోడ్ చేస్తోంది...' : isHindi ? 'एन्क्रिप्ट करके अपलोड हो रहा है...' : 'Encrypting & Uploading...')
                    : (isTelugu ? 'ప్రైవేట్ లాకర్‌కు అప్‌లోడ్ చేయండి' : isHindi ? 'निजी लॉकर में अपलोड करें' : 'Upload to Private Locker')}
                </Button>
              </div>
            </form>
          )}

          {/* Uploaded Documents List */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-[var(--color-primary)] flex items-center gap-2">
                <Lock className="w-4 h-4 text-[var(--color-secondary)]" />
                <span>{isTelugu ? 'నా భద్రపరచిన పత్రాలు' : isHindi ? 'मेरे सुरक्षित दस्तावेज़' : 'My Saved Documents'}</span>
                {uploadedDocuments.length > 0 && (
                  <span className="text-xs font-normal text-[var(--color-muted-foreground)]">
                    {isTelugu ? `(${uploadedDocuments.length} పత్రాలు)` : isHindi ? `(${uploadedDocuments.length} प्रमाण पत्र)` : `(${uploadedDocuments.length} certificate${uploadedDocuments.length !== 1 ? 's' : ''})`}
                  </span>
                )}
              </h3>

              {user && (
                <button
                  type="button"
                  onClick={loadDocuments}
                  className="text-xs font-bold text-[var(--color-secondary)] hover:underline flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" /> {isTelugu ? 'రిఫ్రెష్ చేయండి' : isHindi ? 'लॉकर रिफ्रेश करें' : 'Refresh Locker'}
                </button>
              )}
            </div>

            {isLockerLoading ? (
              <div className="card p-12 text-center bg-white shadow-xs space-y-3">
                <Loader2 className="w-8 h-8 text-[var(--color-secondary)] animate-spin mx-auto" />
                <p className="text-xs text-[var(--color-muted-foreground)]">
                  {isTelugu ? 'సురక్షిత నిల్వ నుండి మీ పత్రాలను లోడ్ చేస్తోంది...' : isHindi ? 'सुरक्षित स्टोरेज से आपके दस्तावेज़ लोड हो रहे हैं...' : 'Loading your documents from secure Supabase storage...'}
                </p>
              </div>
            ) : lockerError ? (
              <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-900 text-xs flex items-center justify-between gap-3 shadow-xs">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
                  <span>{lockerError}</span>
                </div>
                <button
                  type="button"
                  onClick={loadDocuments}
                  className="btn btn-xs btn-outline border-red-300 text-red-800"
                >
                  {isTelugu ? 'మళ్లీ ప్రయత్నించండి' : 'Retry Loading'}
                </button>
              </div>
            ) : uploadedDocuments.length === 0 ? (
              <EmptyState
                icon={<Lock className="w-8 h-8 text-[var(--color-accent)]" />}
                title={t('docEmpty')}
                description={t('docEmptyDesc')}
                actionLabel={user ? t('btnUpload') : (isTelugu ? 'లాకర్‌ను తెరవడానికి సైన్ ఇన్ చేయండి' : isHindi ? 'लॉकर खोलने के लिए साइन इन करें' : 'Sign In to Access Locker')}
                onAction={() => {
                  if (user && fileInputRef.current) {
                    fileInputRef.current.click()
                  } else {
                    window.location.href = '/login'
                  }
                }}
                actionIcon={<Upload className="w-4 h-4" />}
              />
            ) : (
              <div className="space-y-3">
                {uploadedDocuments.map((doc) => {
                  const isPdf = doc.file_name.toLowerCase().endsWith('.pdf')
                  const formattedDate = new Date(doc.created_at).toLocaleDateString(isTelugu ? 'te-IN' : isHindi ? 'hi-IN' : 'en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })
                  const isOperating = activeActionDocId === doc.id

                  return (
                    <div
                      key={doc.id}
                      className="card p-4 sm:p-5 bg-white shadow-xs hover:border-[var(--color-secondary)] transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="flex items-start gap-3 min-w-0">
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                            isPdf ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-blue-50 text-blue-600 border border-blue-200'
                          }`}
                        >
                          {isPdf ? <FileText className="w-5 h-5" /> : <Image className="w-5 h-5" />}
                        </div>

                        <div className="space-y-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <h4 className="font-bold text-xs sm:text-sm text-[var(--color-foreground)] truncate max-w-sm">
                              {doc.file_name}
                            </h4>
                            <span className="badge badge-muted text-[10px]">
                              {isTelugu ? (DOCUMENT_CATEGORIES_TELUGU[doc.document_type] || doc.document_type) : isHindi ? (DOCUMENT_CATEGORIES_HINDI[doc.document_type] || doc.document_type) : doc.document_type}
                            </span>
                          </div>
                          <p className="text-[11px] text-[var(--color-muted-foreground)] flex items-center gap-2">
                            <span>{formatBytes(doc.file_size)}</span>
                            <span>•</span>
                            <span>{isTelugu ? `అప్‌లోడ్ తేదీ ${formattedDate}` : isHindi ? `अपलोड तिथि ${formattedDate}` : `Uploaded on ${formattedDate}`}</span>
                            <span>•</span>
                            <span className="text-emerald-700 font-semibold flex items-center gap-0.5">
                              <ShieldCheck className="w-3 h-3" /> {isTelugu ? 'ప్రైవేట్' : isHindi ? 'निजी' : 'Private'}
                            </span>
                          </p>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handlePreviewDownload(doc)}
                          disabled={isOperating}
                          leftIcon={
                            isOperating ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <Eye className="w-3.5 h-3.5" />
                            )
                          }
                          className="text-xs"
                        >
                          {isTelugu ? 'చూడండి / డౌన్‌లోడ్' : isHindi ? 'देखें / डाउनलोड करें' : 'View / Download'}
                        </Button>

                        <button
                          type="button"
                          onClick={() => handleDeleteDocument(doc)}
                          disabled={isOperating}
                          className="p-2 rounded-lg text-red-600 hover:bg-red-50 border border-transparent hover:border-red-200 transition-colors"
                          title={isTelugu ? 'పత్రాన్ని తొలగించండి' : isHindi ? 'दस्तावेज़ हटाएं' : 'Delete document'}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* Security & Privacy Notice */}
          <div className="p-4 rounded-xl bg-[var(--color-background)] border-2 border-dashed border-[var(--color-border)] text-xs text-[var(--color-muted-foreground)] space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-[var(--color-primary)]">
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
              <span>{isTelugu ? 'ప్రభుత్వ ప్రామాణిక పౌర డేటా రక్షణ' : isHindi ? 'सरकारी मानक नागरिक डेटा सुरक्षा' : 'Government Standard Citizen Data Protection'}</span>
            </div>
            <p className="leading-relaxed">
              {isTelugu
                ? 'అన్ని పత్రాలు కేవలం అధీకృత వినియోగదారులకే పరిమితమైన ప్రైవేట్ స్టోరేజ్‌లో సురక్షితంగా భద్రపరచబడతాయి. పత్రాల ప్రివ్యూ మరియు డౌన్‌లోడ్ కోసం స్వల్పకాలిక రక్షిత లింకులు (5 నిమిషాల గడువు) ఉపయోగించబడతాయి. ఎటువంటి బహిరంగ లింకులు సృష్టించబడవు.'
                : 'All documents are stored inside a dedicated private Storage bucket restricted to authenticated access only. Access is protected by PostgreSQL Row Level Security (RLS) policies requiring your cryptographic JWT token. Document preview and download utilize short-lived signed URLs (5 minutes expiry). No public URLs are ever issued.'}
            </p>
          </div>
        </div>
      )}

      {/* ── TAB 2: REQUIREMENTS CHECKLIST (Preserved 100%) ── */}
      {activeTab === 'checklist' && (
        <div className="space-y-6">
          {/* Scheme Selector Card */}
          <div className="card p-5 bg-white shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-[var(--color-primary)] block">
                {isTelugu ? 'లక్షిత సంక్షేమ పథకాన్ని ఎంచుకోండి:' : isHindi ? 'लक्षित कल्याणकारी योजना चुनें:' : 'Select Target Welfare Scheme:'}
              </label>
              <Button
                variant="outline"
                size="sm"
                onClick={resetCurrentChecklist}
                leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
                className="text-xs"
              >
                {isTelugu ? 'జాబితాను రీసెట్ చేయండి' : isHindi ? 'चेकलिस्ट रीसेट करें' : 'Reset Checklist'}
              </Button>
            </div>
            <select
              value={selectedScheme.id}
              onChange={(e) => {
                setSelectedSchemeId(e.target.value)
                setSearchParams({ schemeId: e.target.value })
              }}
              className="input-base text-xs sm:text-sm h-11 font-semibold"
            >
              {CENTRAL_AND_STATE_SCHEMES.map((s) => (
                <option key={s.id} value={s.id}>
                  [{isTelugu ? (s.level === 'Central' ? 'కేంద్ర' : 'రాష్ట్ర') : isHindi ? (s.level === 'Central' ? 'केंद्रीय' : 'राज्य') : s.level}] {isTelugu ? (s.titleTelugu || s.title) : isHindi ? (s.titleHindi || s.title) : s.title} — {s.benefitAmount}
                </option>
              ))}
            </select>
            <p className="text-xs text-[var(--color-muted-foreground)] font-telugu">
              {(isTelugu ? selectedScheme.titleTelugu : isHindi ? selectedScheme.titleHindi : selectedScheme.title) || selectedScheme.title} • {isTelugu ? 'నోడల్ విభాగం' : isHindi ? 'नोडल विभाग' : 'Nodal Authority'}: {selectedScheme.ministry}
            </p>
          </div>

          {/* Completion Percentage Hero */}
          <div className="card p-6 bg-white shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-muted-foreground)]">
                  {isTelugu ? 'దరఖాస్తు సంసిద్ధత స్కోరు' : isHindi ? 'आवेदन तत्परता स्कोर' : 'Application Readiness Score'}
                </span>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-3xl font-extrabold text-[var(--color-primary)]">
                    {completionPercentage}% {isTelugu ? 'సిద్ధం' : isHindi ? 'तैयार' : 'Ready'}
                  </span>
                  <Badge variant={completionPercentage >= 80 ? 'success' : completionPercentage >= 50 ? 'warning' : 'danger'}>
                    {completionPercentage >= 80
                      ? (isTelugu ? 'దరఖాస్తుకు సిద్ధంగా ఉంది' : isHindi ? 'आवेदन के लिए तैयार' : 'Ready to Apply')
                      : (isTelugu ? 'చర్య అవసరం' : isHindi ? 'कार्रवाई आवश्यक' : 'Action Required')}
                  </Badge>
                </div>
              </div>

              {/* Quick Counter Badges */}
              <div className="flex items-center gap-3 text-xs">
                <span className="flex items-center gap-1 font-semibold text-[var(--color-success)]">
                  <CheckCircle2 className="w-4 h-4" /> {availableDocs} {isTelugu ? 'అందుబాటులో ఉంది' : isHindi ? 'उपलब्ध' : 'Available'}
                </span>
                <span className="flex items-center gap-1 font-semibold text-amber-600">
                  <AlertTriangle className="w-4 h-4" /> {needToObtainDocs} {isTelugu ? 'పొందవలసి ఉంది' : isHindi ? 'प्राप्त करना होगा' : 'Need to Get'}
                </span>
                <span className="flex items-center gap-1 font-semibold text-[var(--color-danger)]">
                  <XCircle className="w-4 h-4" /> {missingDocs} {isTelugu ? 'అందుబాటులో లేదు' : isHindi ? 'अनुपलब्ध' : 'Missing'}
                </span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-[var(--color-background)] rounded-full h-2.5 overflow-hidden border border-[var(--color-border)]">
              <div
                className="h-full rounded-full transition-all duration-500 bg-[var(--color-secondary)]"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
          </div>

          {/* Interactive Checklist Items */}
          <div className="space-y-4">
            <h2 className="text-base font-bold text-[var(--color-primary)] flex items-center justify-between">
              <span>{isTelugu ? `${selectedScheme.titleTelugu || selectedScheme.title} కోసం అధికారిక పత్రాలు` : isHindi ? `${selectedScheme.titleHindi || selectedScheme.title} के लिए आवश्यक दस्तावेज़` : `Official Documents for ${selectedScheme.title}`}</span>
              <span className="text-xs font-normal text-[var(--color-muted-foreground)]">
                {isTelugu ? `మొత్తం ${totalDocs} అవసరాలు` : isHindi ? `कुल ${totalDocs} आवश्यकताएँ` : `${totalDocs} total requirements`}
              </span>
            </h2>

            <div className="space-y-3">
              {currentDocs.map((item) => {
                const obtainGuide = isTelugu
                  ? (HOW_TO_OBTAIN_GUIDANCE_TELUGU[item.name] || 'స్థానిక మండల రెవెన్యూ కార్యాలయం / మీసేవ / సీఎస్‌సీ కేంద్రం ద్వారా దరఖాస్తు చేసుకోండి.')
                  : (HOW_TO_OBTAIN_GUIDANCE[item.name] || 'Apply through the local Mandal Revenue Office / MeeSeva / CSC Kiosk.')
                const matchingDocInLocker = uploadedDocuments.find((d) =>
                  d.document_type.toLowerCase().includes(item.name.toLowerCase().split(' ')[0]) ||
                  item.name.toLowerCase().includes(d.document_type.toLowerCase().split(' ')[0])
                )

                return (
                  <div
                    key={item.name}
                    className="card p-5 bg-white shadow-xs hover:border-[var(--color-secondary)] transition-all space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-sm text-[var(--color-foreground)]">
                            {item.name}
                          </h3>
                          {item.isMandatory && (
                            <span className="badge badge-danger text-[10px]">{isTelugu ? 'తప్పనిసరి' : isHindi ? 'अनिवार्य' : 'Mandatory'}</span>
                          )}
                          <span className="badge badge-muted text-[10px]">{item.type}</span>
                          {matchingDocInLocker && (
                            <span className="badge badge-success text-[10px] flex items-center gap-1">
                              <Check className="w-3 h-3" /> {isTelugu ? 'లాకర్‌లో ఉంది' : isHindi ? 'लॉकर में उपलब्ध' : 'In Locker'}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-[var(--color-muted-foreground)] leading-relaxed">
                          {item.description}
                        </p>
                        <p className="text-[11px] text-[var(--color-secondary)] font-semibold flex items-center gap-1">
                          <Building2 className="w-3 h-3" /> {isTelugu ? 'జారీ చేసే కార్యాలయం:' : isHindi ? 'जारीकर्ता कार्यालय:' : 'Issuing Office:'} {item.issuingAuthority}
                        </p>
                      </div>

                      {/* 3 Status Buttons */}
                      <div className="flex items-center rounded-xl border border-[var(--color-border)] p-1 bg-[var(--color-background)] gap-1 shrink-0">
                        <button
                          type="button"
                          onClick={() => setItemStatus(item.name, 'available')}
                          className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-colors flex items-center gap-1 ${
                            item.status === 'available'
                              ? 'bg-[var(--color-success)] text-white shadow-xs'
                              : 'text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)]'
                          }`}
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>{isTelugu ? 'అందుబాటులో ఉంది' : isHindi ? 'उपलब्ध' : 'Available'}</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setItemStatus(item.name, 'need_to_obtain')}
                          className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-colors flex items-center gap-1 ${
                            item.status === 'need_to_obtain'
                              ? 'bg-amber-500 text-white shadow-xs'
                              : 'text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)]'
                          }`}
                        >
                          <AlertTriangle className="w-3.5 h-3.5" />
                          <span>{isTelugu ? 'పొందవలసి ఉంది' : isHindi ? 'प्राप्त करना होगा' : 'Need to Get'}</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setItemStatus(item.name, 'missing')}
                          className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-colors flex items-center gap-1 ${
                            item.status === 'missing'
                              ? 'bg-[var(--color-danger)] text-white shadow-xs'
                              : 'text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)]'
                          }`}
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          <span>{isTelugu ? 'అందుబాటులో లేదు' : isHindi ? 'अनुपलब्ध' : 'Missing'}</span>
                        </button>
                      </div>
                    </div>

                    {/* Practical Guidance on Obtaining */}
                    <div className="pt-2.5 border-t border-[var(--color-border-subtle)] flex items-start gap-2 text-xs bg-[var(--color-surface-raised)] p-2.5 rounded-lg">
                      <HelpCircle className="w-3.5 h-3.5 text-[var(--color-secondary)] mt-0.5 shrink-0" />
                      <div className="text-[11px] text-[var(--color-muted-foreground)] leading-relaxed">
                        <strong className="text-[var(--color-primary)] font-semibold">{isTelugu ? 'ఎలా పొందాలి: ' : isHindi ? 'कैसे प्राप्त करें: ' : 'How to obtain: '}</strong>
                        {obtainGuide}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
