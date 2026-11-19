import { useState, useRef, useEffect } from 'react'
import {
  Upload,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Send,
  Bot,
  User,
  Brain,
  CheckCircle2,
  FileSearch,
  Loader2,
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { extractTextFromBlob } from '@/services/pdfExtractionService'
import { chunkDocumentPages, searchDocumentChunks, DocumentChunk } from '@/services/semanticSearchService'
import { askAssistant } from '@/services/assistantService'
import { useLanguage, type Language } from '@/context/LanguageContext'

interface SampleDocument {
  id: string
  title: string
  titleTelugu: string
  filename: string
  ministry: string
  totalPages: number
  fileSize: string
  pages: {
    pageNumber: number
    gazetteHeading: string
    subheading: string
    content: string[]
    tableData?: { headers: string[]; rows: string[][] }
  }[]
  presetQuestions: { en: string; te: string; answerEn: string; answerTe: string; page: number; clause: string }[]
}

const SAMPLE_DOCS: SampleDocument[] = [
  {
    id: 'pm-surya-ghar-circular',
    title: 'PM Surya Ghar Operational Guidelines (Sample Excerpt)',
    titleTelugu: 'పీఎం సూర్య ఘర్ మార్గదర్శకాలు (నమూనా ప్రతి)',
    filename: 'Sample_MNRE_Surya_Ghar_Excerpt.pdf',
    ministry: 'Ministry of New & Renewable Energy, GoI',
    totalPages: 4,
    fileSize: '1.4 MB',
    pages: [
      {
        pageNumber: 1,
        gazetteHeading: 'THE GAZETTE OF INDIA : EXTRAORDINARY [PART I—SEC. 1]',
        subheading: 'MINISTRY OF NEW AND RENEWABLE ENERGY NOTIFICATION (No. 32/65/2023-Rooftop)',
        content: [
          '1. SHORT TITLE AND COMMENCEMENT: These guidelines shall be called the Operational Guidelines for Implementation of PM Surya Ghar: Muft Bijli Yojana for the residential sector.',
          '2. OBJECTIVE AND TARGET: The scheme aims to increase the share of solar rooftop capacity in residential households with an allocated financial outlay of ₹75,021 Crore up to FY 2026-27.',
          '3. CENTRAL FINANCIAL ASSISTANCE (CFA) PATTERN: Direct capital subsidy shall be credited to the verified bank account of the beneficiary residential consumer after inspection and net-meter installation.',
        ],
        tableData: {
          headers: ['Rooftop Capacity', 'Applicable CFA (Subsidy)', 'Target Monthly Generation'],
          rows: [
            ['Up to 1 kW', '₹30,000 flat', 'Approx. 100-120 Units'],
            ['2 kW Capacity', '₹60,000 flat', 'Approx. 200-240 Units'],
            ['3 kW and above', '₹78,000 maximum', '300+ Units (Free Power Tier)'],
          ],
        },
      },
      {
        pageNumber: 2,
        gazetteHeading: 'NOTIFICATION No. 32/65/2023-Rooftop — CLAUSE 4: ELIGIBILITY & DISCOM DUTIES',
        subheading: 'Clause 4.1: Technical Feasibility & Distribution Companies (DISCOMs)',
        content: [
          '4.1 Citizen Eligibility: Any Indian citizen having a residential electricity connection in their name or immediate family name with unshaded rooftop space is eligible.',
          '4.2 Technical Feasibility: The State DISCOM shall process the online application within 15 working days from submission on the National Portal.',
          '4.3 Vendor Selection: Beneficiaries are free to choose any vendor empaneled with the respective DISCOM who complies with DCR (Domestic Content Requirement) solar cell standards.',
        ],
      },
      {
        pageNumber: 3,
        gazetteHeading: 'NOTIFICATION No. 32/65/2023-Rooftop — CLAUSE 5: COMMISSIONING & SUBSIDY',
        subheading: 'Clause 5.2: Disbursal of Subsidy through PFMS',
        content: [
          '5.1 Inspection: Within 7 days of plant installation, the DISCOM official will inspect the system, test bidirectional net-metering, and generate the online Commissioning Certificate.',
          '5.2 Direct Benefit Transfer: REC Limited as the National Programme Implementation Agency shall disburse the applicable CFA directly to the beneficiary’s bank account within 30 days of certificate upload.',
          '5.3 Concessional Loan Facility: Eligible consumers can avail of collateral-free bank loans at low interest rates (~7% p.a.) through the Jan Samarth national portal.',
        ],
      },
      {
        pageNumber: 4,
        gazetteHeading: 'NOTIFICATION No. 32/65/2023-Rooftop — CLAUSE 8: GRIEVANCE REDRESSAL',
        subheading: 'Clause 8.1: Citizen Support & Helpline',
        content: [
          '8.1 National Helpline: Beneficiaries experiencing delay in inspection or meter provisioning may register grievances at toll-free number 15555 or on pmsuryaghar.gov.in.',
          '8.2 Dispute Resolution: Grievances must be resolved by the Superintending Engineer (Operations) of the concerned electricity circle within 21 working days.',
        ],
      },
    ],
    presetQuestions: [
      {
        en: 'What is the maximum subsidy for a 3kW residential system?',
        te: '3kW సోలార్ సిస్టమ్‌కు గరిష్ట సబ్సిడీ ఎంత లభిస్తుంది?',
        answerEn:
          'According to Clause 3 (Table 1, Page 1) of the notification, the Central Financial Assistance (CFA) provides a maximum subsidy of ₹78,000 for residential systems of 3 kW capacity and above.',
        answerTe:
          'నోటిఫికేషన్ పేజీ 1 లోని క్లాజ్ 3 ప్రకారం, 3 kW లేదా అంతకంటే ఎక్కువ సామర్థ్యం గల గృహ సోలార్ ప్లాంట్లకు గరిష్టంగా ₹78,000 వరకు కేంద్ర ప్రభుత్వ సబ్సిడీ లభిస్తుంది.',
        page: 1,
        clause: 'Clause 3, Page 1 (CFA Pattern Table)',
      },
      {
        en: 'How long does it take to receive the subsidy after installation?',
        te: 'ఇన్‌స్టాలేషన్ పూర్తయిన ఎన్ని రోజులకు సబ్సిడీ అందుతుంది?',
        answerEn:
          'As per Clause 5.2 on Page 3, the direct subsidy is disbursed through PFMS directly into the citizen’s bank account within 30 days of the Commissioning Certificate upload by the DISCOM.',
        answerTe:
          'పేజీ 3 లోని క్లాజ్ 5.2 ప్రకారం, డిస్కం కమిషనింగ్ సర్టిఫికేట్ అప్‌లోడ్ చేసిన 30 రోజుల్లోగా సబ్సిడీ సొమ్ము నేరుగా పౌరుడి బ్యాంకు ఖాతాలో జమ చేయబడుతుంది.',
        page: 3,
        clause: 'Clause 5.2, Page 3 (Disbursal of Subsidy)',
      },
      {
        en: 'What is the official helpline for inspection delays?',
        te: 'డిస్కం తనిఖీలలో ఆలస్యం జరిగితే ఫిర్యాదు చేయడానికి హెల్ప్‌లైన్ ఏది?',
        answerEn:
          'According to Clause 8.1 on Page 4, citizens can call the National Toll-Free Helpline at 15555 or log into pmsuryaghar.gov.in to register complaints, which must be resolved within 21 days.',
        answerTe:
          'పేజీ 4 లోని క్లాజ్ 8.1 ప్రకారం, పౌరులు జాతీయ టోల్-ఫ్రీ నంబర్ 15555 కు కాల్ చేసి లేదా వెబ్‌సైట్ ద్వారా ఫిర్యాదు చేయవచ్చు.',
        page: 4,
        clause: 'Clause 8.1, Page 4 (Grievance Redressal)',
      },
    ],
  },
  {
    id: 'pm-kisan-circular',
    title: 'PM-KISAN Operating Procedures (Sample Excerpt)',
    titleTelugu: 'పీఎం-కిసాన్ నిబంధనలు (నమూనా ప్రతి)',
    filename: 'Sample_Agriculture_PM_Kisan_Excerpt.pdf',
    ministry: 'Ministry of Agriculture & Farmers Welfare, GoI',
    totalPages: 3,
    fileSize: '1.1 MB',
    pages: [
      {
        pageNumber: 1,
        gazetteHeading: 'DEPARTMENT OF AGRICULTURE & FARMERS WELFARE — CIRCULAR 1-1/2024-Credit',
        subheading: 'Operational Guidelines for Verification and e-KYC Mandate',
        content: [
          '1. ELIGIBILITY CRITERIA: A farmer family is defined as a family consisting of husband, wife, and minor children owning cultivable land as per land records of the respective State/UT.',
          '2. EXCLUSION CRITERIA: Institutional landholders, serving or retired officers/employees of state/central government, doctors, engineers, lawyers, and income tax payees are strictly excluded.',
        ],
      },
      {
        pageNumber: 2,
        gazetteHeading: 'CIRCULAR 1-1/2024-Credit — CLAUSE 3: MANDATORY ADHAR SEEDING',
        subheading: 'NPCI Aadhaar Payment Bridge System (ABPS)',
        content: [
          '3.1 Aadhaar Seeding: All future 4-monthly instalments of ₹2,000 each shall solely be disbursed via Aadhaar-based Payment Bridge System (ABPS).',
          '3.2 Land Seeding Requirement: State revenue departments must complete electronic linkage between Dharani / MeeSeva / Land records and PM-KISAN portal IDs.',
        ],
      },
      {
        pageNumber: 3,
        gazetteHeading: 'CIRCULAR 1-1/2024-Credit — CLAUSE 6: GRIEVANCES & HELPLINE',
        subheading: 'Beneficiary Farmer Grievance Redressal',
        content: [
          '6.1 Farmer Corner: Farmers can check payment status, update land details, and perform biometric e-KYC via PM-KISAN mobile app or at local CSC kiosks.',
          '6.2 Helpline: Dedicated national farmer support desk active at 155261.',
        ],
      },
    ],
    presetQuestions: [
      {
        en: 'Who is excluded from PM-KISAN benefits?',
        te: 'పీఎం కిసాన్ పథకానికి ఎవరు అర్హులు కారు?',
        answerEn:
          'As per Exclusion Criteria in Para 2 (Page 1), institutional landholders, government employees, professionals (doctors, engineers, lawyers), and income tax payees cannot claim PM-KISAN.',
        answerTe:
          'పేజీ 1 లోని క్లాజ్ 2 ప్రకారం, ప్రభుత్వ ఉద్యోగులు, ఆదాయపు పన్ను చెల్లించేవారు, మరియు సంస్థాగత భూ యజమానులు పీఎం కిసాన్ పథకానికి అనర్హులు.',
        page: 1,
        clause: 'Para 2, Page 1 (Exclusion Criteria)',
      },
    ],
  },
]

function getSampleDocumentChunks(doc: SampleDocument): DocumentChunk[] {
  const pages = doc.pages.map((p) => ({
    pageNumber: p.pageNumber,
    text: p.content.join('\n') + (p.tableData ? '\n' + p.tableData.rows.map((r) => r.join(' | ')).join('\n') : ''),
  }))
  return chunkDocumentPages(doc.id, pages)
}

export default function DocumentAssistantPage() {
  const { language, t, isTelugu, isHindi, fontClass } = useLanguage()
  const [selectedDocId, setSelectedDocId] = useState<SampleDocument>(SAMPLE_DOCS[0])
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [zoomLevel, setZoomLevel] = useState<number>(100)
  const [mobileTab, setMobileTab] = useState<'doc' | 'chat'>('doc')
  const [chatLanguage, setChatLanguage] = useState<Language>(language)

  useEffect(() => {
    setChatLanguage(language)
  }, [language])

  // Document chunking and semantic search state
  const [documentChunks, setDocumentChunks] = useState<DocumentChunk[]>(() =>
    getSampleDocumentChunks(SAMPLE_DOCS[0])
  )
  const [isProcessingPdf, setIsProcessingPdf] = useState(false)

  // Upload custom simulation
  const [uploadedFile, setUploadedFile] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Update chunks when active document changes
  useEffect(() => {
    setDocumentChunks(getSampleDocumentChunks(selectedDocId))
  }, [selectedDocId])

  // Chat messages
  const [messages, setMessages] = useState<
    { role: 'user' | 'assistant'; content: string; page?: number; clause?: string; timestamp: string }[]
  >([
    {
      role: 'assistant',
      content:
        'Namaste! Welcome to CivicSaarthi Document AI. The left panel shows official scheme circulars and gazette notifications. You can upload any citizen PDF document or ask questions about the displayed guidelines. Answers are grounded in document clauses with exact page references.',
      timestamp: 'Just now',
    },
  ])
  const [inputText, setInputText] = useState('')
  const [isAnswering, setIsAnswering] = useState(false)

  const activePageData =
    selectedDocId.pages.find((p) => p.pageNumber === currentPage) || selectedDocId.pages[0]

  const handleZoom = (delta: number) => {
    setZoomLevel((prev) => Math.min(Math.max(prev + delta, 70), 160))
  }

  const handleCustomUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.name.toLowerCase().endsWith('.pdf')) {
      alert('Please upload a valid PDF document.')
      return
    }

    setUploadedFile(file.name)
    setIsProcessingPdf(true)
    setMobileTab('chat')

    setMessages((prev) => [
      ...prev,
      {
        role: 'assistant',
        content: `Analyzing "${file.name}"... Parsing PDF pages and extracting text content.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ])

    try {
      const result = await extractTextFromBlob(file)
      setIsProcessingPdf(false)

      if (!result.success) {
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content: `Failed to process "${file.name}": ${result.error || 'Unknown error'}.`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ])
        return
      }

      if (result.isScannedOnly) {
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content: `Notice: "${file.name}" appears to be a scanned image-only PDF with ${result.totalPages} pages. No machine-readable text was detected. Optical Character Recognition (OCR) is required to index scanned documents.`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ])
      }

      // Build custom SampleDocument to render in viewer
      const newDoc: SampleDocument = {
        id: `custom-${Date.now()}`,
        title: file.name.replace(/\.[^/.]+$/, ''),
        titleTelugu: file.name.replace(/\.[^/.]+$/, ''),
        filename: file.name,
        ministry: 'Citizen Uploaded Document',
        totalPages: result.totalPages || 1,
        fileSize: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        pages: result.pages.map((p) => ({
          pageNumber: p.pageNumber,
          gazetteHeading: `UPLOADED DOCUMENT : ${file.name.toUpperCase()}`,
          subheading: `Page ${p.pageNumber} Extracted Content (${p.wordCount} words)`,
          content: p.text.split(/(?<=\.)\s+/).filter(Boolean),
        })),
        presetQuestions: [],
      }

      setSelectedDocId(newDoc)
      setCurrentPage(1)

      // Index chunks for semantic search
      const chunks = chunkDocumentPages(
        newDoc.id,
        result.pages.map((p) => ({ pageNumber: p.pageNumber, text: p.text }))
      )
      setDocumentChunks(chunks)

      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: `Successfully parsed "${file.name}" (${result.totalPages} pages, ${chunks.length} semantic chunks indexed). You can now ask questions about any clause, provision, or rule in this document.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ])
    } catch (err: unknown) {
      setIsProcessingPdf(false)
      const msg = err instanceof Error ? err.message : 'Error extracting PDF'
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: `Error extracting text from PDF: ${msg}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ])
    }
  }

  const handleSendQuery = async (customQuery?: string) => {
    const query = customQuery || inputText
    if (!query.trim() || isAnswering) return

    const userMsg = {
      role: 'user' as const,
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }
    setMessages((prev) => [...prev, userMsg])
    setInputText('')
    setIsAnswering(true)

    try {
      // 1. Semantic search across document chunks
      const searchResults = await searchDocumentChunks(query, documentChunks, 3)

      let pageRef = currentPage
      let clauseRef = `Page ${currentPage}`
      let contextSnippet = ''

      if (searchResults.length > 0 && searchResults[0].similarity > 0.08) {
        const topResult = searchResults[0]
        pageRef = topResult.pageNumber
        clauseRef = `${selectedDocId.title} • Page ${topResult.pageNumber}`
        setCurrentPage(topResult.pageNumber) // Jump to matching page!

        contextSnippet = searchResults
          .map((r) => `[Document: ${selectedDocId.title}, Page ${r.pageNumber}]:\n${r.chunk.content}`)
          .join('\n\n')
      }

      // 2. Query assistant with grounded document context
      const response = await askAssistant(
        query,
        chatLanguage,
        contextSnippet || `[Document: ${selectedDocId.title}, Page ${currentPage}]:\n${activePageData.content.join(' ')}`
      )

      let finalReply = response.text
      if (searchResults.length === 0 || (searchResults[0].similarity < 0.08 && !contextSnippet)) {
        finalReply =
          chatLanguage === 'te'
            ? `పరిశీలించిన పత్రం "${selectedDocId.titleTelugu}" లో ఈ ప్రశ్నకు సంబంధించిన ప్రత్యక్ష సమాచారం లభించలేదు. అధికారిక మార్గదర్శకాల కోసం సంబంధిత శాఖను సంప్రదించగలరు.`
            : chatLanguage === 'hi'
            ? `दस्तावेज़ "${selectedDocId.title}" में इस प्रश्न से संबंधित कोई प्रत्यक्ष जानकारी नहीं मिली। आधिकारिक स्पष्टीकरण के लिए कृपया संबंधित मंत्रालय पोर्टल देखें।`
            : `The document "${selectedDocId.title}" does not contain specific information regarding "${query}". For authoritative clarification, please consult the issuing ministry portal.`
      }

      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: finalReply,
          page: pageRef,
          clause: clauseRef,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ])
    } catch (err: unknown) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'An error occurred while analyzing the document clauses. Please try again.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ])
    } finally {
      setIsAnswering(false)
    }
  }

  return (
    <div className={`flex flex-col h-[calc(100vh-64px)] overflow-hidden bg-[var(--color-background)] ${fontClass}`}>
      {/* ── TOP CONTROL & NOTICE BAR ── */}
      <div className="h-12 px-4 sm:px-6 bg-white border-b border-[var(--color-border)] flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <FileSearch className="w-4 h-4 text-[var(--color-secondary)]" />
          <span className="font-bold text-xs text-[var(--color-primary)]">
            {isTelugu ? 'పీడీఎఫ్ పత్ర విశ్లేషణ' : isHindi ? 'पीडीएफ दस्तावेज़ सहायक' : 'PDF Circular Assistant'}
          </span>
          <span className="badge badge-accent text-[10px] hidden sm:inline-flex">{isTelugu ? 'స్ప్లిట్ స్క్రీన్' : isHindi ? 'स्प्लिट-स्क्रीन' : 'Split-Screen'}</span>
        </div>

        {/* Circular Selector */}
        <div className="flex items-center gap-2">
          <select
            value={selectedDocId.id}
            onChange={(e) => {
              const doc = SAMPLE_DOCS.find((d) => d.id === e.target.value) || SAMPLE_DOCS[0]
              setSelectedDocId(doc)
              setCurrentPage(1)
            }}
            className="input-base text-xs h-8 px-2 font-semibold max-w-[200px] sm:max-w-xs truncate cursor-pointer"
          >
            {SAMPLE_DOCS.map((doc) => (
              <option key={doc.id} value={doc.id}>
                {isTelugu && doc.titleTelugu ? doc.titleTelugu : doc.title}
              </option>
            ))}
          </select>

          <Button
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            leftIcon={<Upload className="w-3.5 h-3.5" />}
            className="text-xs h-8 cursor-pointer"
          >
            <span className="hidden sm:inline">{t('btnUpload')}</span>
          </Button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleCustomUpload}
            accept=".pdf"
            className="hidden"
          />
        </div>

        {/* Mobile Tab Switcher */}
        <div className="flex lg:hidden rounded-lg border border-[var(--color-border)] p-0.5 bg-[var(--color-background)]">
          <button
            type="button"
            onClick={() => setMobileTab('doc')}
            className={`px-2 py-0.5 text-xs font-semibold rounded-md ${
              mobileTab === 'doc' ? 'bg-white text-[var(--color-primary)] shadow-xs' : 'text-[var(--color-muted-foreground)]'
            }`}
          >
            {isTelugu ? 'పత్రం' : isHindi ? 'दस्तावेज़' : 'Document'}
          </button>
          <button
            type="button"
            onClick={() => setMobileTab('chat')}
            className={`px-2 py-0.5 text-xs font-semibold rounded-md ${
              mobileTab === 'chat' ? 'bg-white text-[var(--color-primary)] shadow-xs' : 'text-[var(--color-muted-foreground)]'
            }`}
          >
            {isTelugu ? 'ఏఐ విశ్లేషణ' : isHindi ? 'एआई विश्लेषण' : 'AI Analysis'}
          </button>
        </div>
      </div>

      {/* ── SPLIT-SCREEN WORKSPACE ── */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-[var(--color-border)] overflow-hidden">
        {/* ══════════════════════════════════════════════════════════════════
            LEFT PANEL: PDF DOCUMENT VIEWER
            ══════════════════════════════════════════════════════════════════ */}
        <div
          className={`flex flex-col bg-slate-100/90 overflow-hidden ${
            mobileTab === 'doc' ? 'flex' : 'hidden lg:flex'
          }`}
        >
          {/* PDF Viewer Toolbar */}
          <div className="h-11 px-4 bg-slate-800 text-white flex items-center justify-between text-xs shrink-0 select-none">
            {/* Page Navigation */}
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                disabled={currentPage <= 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="p-1 rounded hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent"
                title="Previous page"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="font-mono text-[11px] px-1">
                Page {currentPage} of {selectedDocId.totalPages}
              </span>
              <button
                type="button"
                disabled={currentPage >= selectedDocId.totalPages}
                onClick={() => setCurrentPage((p) => Math.min(selectedDocId.totalPages, p + 1))}
                className="p-1 rounded hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent"
                title="Next page"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Document Info */}
            <span className="hidden sm:inline font-mono text-[10px] text-slate-400 truncate max-w-xs">
              {uploadedFile || selectedDocId.filename} ({selectedDocId.fileSize})
            </span>

            {/* Zoom Controls */}
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => handleZoom(-10)}
                className="p-1 rounded hover:bg-white/10"
                title="Zoom Out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="font-mono text-[11px] w-10 text-center">{zoomLevel}%</span>
              <button
                type="button"
                onClick={() => handleZoom(10)}
                className="p-1 rounded hover:bg-white/10"
                title="Zoom In"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setZoomLevel(100)}
                className="p-1 rounded hover:bg-white/10 ml-1 text-slate-400 hover:text-white"
                title="Reset Zoom"
              >
                <RotateCcw className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* PDF Page Canvas */}
          <div className="flex-1 overflow-auto p-4 sm:p-6 flex justify-center scrollbar-thin">
            <div
              style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center' }}
              className="w-full max-w-2xl bg-white shadow-2xl rounded-sm border border-slate-300 p-8 sm:p-12 min-h-[700px] text-slate-800 transition-transform duration-150 flex flex-col justify-between"
            >
              <div>
                {/* Document Status Banner */}
                <div className="mb-4 py-1.5 px-3 bg-blue-50 border border-blue-200 text-blue-900 text-[10px] font-sans font-semibold tracking-wide text-center rounded flex items-center justify-center gap-1.5">
                  <FileSearch className="w-3.5 h-3.5 text-blue-600" />
                  <span>{uploadedFile ? `Custom Uploaded Citizen Document: ${uploadedFile}` : 'Official Gazette Reference Document • RAG Grounded Index'}</span>
                </div>

                {/* Official National Emblem / Gazette Header */}
                <div className="border-b-2 border-black pb-4 text-center space-y-1 mb-6">
                  <div className="flex justify-center mb-1">
                    <div className="w-8 h-8 rounded-full border-2 border-black flex items-center justify-center font-serif text-xs font-bold">
                      सत्य
                    </div>
                  </div>
                  <h3 className="font-serif text-xs sm:text-sm font-bold tracking-widest uppercase">
                    {activePageData.gazetteHeading}
                  </h3>
                  <p className="font-mono text-[10px] text-slate-600">
                    PUBLISHED BY AUTHORITY • GOVERNMENT OF INDIA
                  </p>
                </div>

                {/* Subheading */}
                <h4 className="font-sans font-bold text-xs uppercase tracking-wider text-slate-900 mb-4 pb-1 border-b border-slate-200">
                  {activePageData.subheading}
                </h4>

                {/* Paragraphs */}
                <div className="space-y-3.5 text-xs font-serif leading-relaxed text-justify text-slate-800">
                  {activePageData.content.map((p, pIdx) => (
                    <p key={pIdx} className="leading-relaxed">
                      {p}
                    </p>
                  ))}
                </div>

                {/* Table if present */}
                {activePageData.tableData && (
                  <div className="mt-6 border border-slate-400 overflow-hidden text-xs">
                    <table className="w-full text-left font-sans">
                      <thead className="bg-slate-100 border-b border-slate-400">
                        <tr>
                          {activePageData.tableData.headers.map((h, hIdx) => (
                            <th key={hIdx} className="p-2 font-bold text-slate-900 border-r last:border-r-0 border-slate-300">
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {activePageData.tableData.rows.map((row, rIdx) => (
                          <tr key={rIdx} className="border-b last:border-b-0 border-slate-200 hover:bg-amber-50/50">
                            {row.map((cell, cIdx) => (
                              <td key={cIdx} className="p-2 border-r last:border-r-0 border-slate-200">
                                {cell}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Page Footer stamp */}
              <div className="mt-12 pt-4 border-t border-slate-300 flex items-center justify-between font-mono text-[10px] text-slate-400">
                <span>CIRCULAR REF: MNRE/ROOFTOP/2024</span>
                <span>Page {currentPage} of {selectedDocId.totalPages}</span>
              </div>
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════════════
            RIGHT PANEL: AI CONVERSATION & ANALYSIS
            ══════════════════════════════════════════════════════════════════ */}
        <div
          className={`flex flex-col bg-white overflow-hidden ${
            mobileTab === 'chat' ? 'flex' : 'hidden lg:flex'
          }`}
        >
          {/* Header */}
          <div className="h-11 px-4 sm:px-6 border-b border-[var(--color-border)] flex items-center justify-between bg-white shrink-0">
            <div className="flex items-center gap-2">
              <Bot className="w-4 h-4 text-[var(--color-primary)]" />
              <span className="text-xs font-bold text-[var(--color-primary)]">
                Document Query Assistant
              </span>
            </div>

            {/* Language Toggle */}
            <div className="flex items-center rounded-lg border border-[var(--color-border)] p-0.5 bg-[var(--color-background)]">
              {(
                [
                  { code: 'en' as const, label: 'English', cls: '' },
                  { code: 'te' as const, label: 'తెలుగు', cls: 'font-telugu' },
                ] as const
              ).map((langItem) => (
                <button
                  key={langItem.code}
                  type="button"
                  onClick={() => setChatLanguage(langItem.code)}
                  className={`px-2.5 py-0.5 text-[11px] font-semibold rounded-md transition-colors cursor-pointer ${langItem.cls} ${
                    chatLanguage === langItem.code
                      ? 'bg-white text-[var(--color-primary)] shadow-xs font-bold'
                      : 'text-[var(--color-muted-foreground)]'
                  }`}
                >
                  {langItem.label}
                </button>
              ))}
            </div>
          </div>

          {/* Conversation Thread */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 scrollbar-thin bg-[var(--color-background)]">
            {/* Grounding Status Notice */}
            <div className="p-3.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-950 text-xs flex items-start gap-2.5">
              <Brain className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <div className="leading-relaxed">
                <strong>Retrieval-Augmented Assistant:</strong> Answers are retrieved and grounded directly from document clauses. Exact page numbers and provisions are cited below each answer. Click any citation to jump directly to the relevant document page.
              </div>
            </div>

            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex gap-2.5 max-w-xl ${m.role === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
              >
                <div
                  className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 mt-0.5 text-xs ${
                    m.role === 'user' ? 'bg-[var(--color-secondary)] text-white' : 'bg-[var(--color-primary)] text-white'
                  }`}
                >
                  {m.role === 'user' ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
                </div>

                <div
                  className={`card p-3.5 text-xs leading-relaxed ${
                    m.role === 'user'
                      ? 'bg-[var(--color-primary)] text-white border-[var(--color-primary)]'
                      : 'bg-white text-[var(--color-foreground)]'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{m.content}</p>

                  {/* Document Citation Card */}
                  {m.clause && (
                    <div
                      onClick={() => m.page && setCurrentPage(m.page)}
                      className="mt-2.5 pt-2 border-t border-[var(--color-border-subtle)] flex items-center justify-between text-[11px] font-semibold text-[var(--color-secondary)] cursor-pointer hover:underline"
                    >
                      <span className="flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[var(--color-success)]" />
                        Jump to Sample Excerpt: {m.clause}
                      </span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </div>
                  )}

                  <span className="text-[9px] opacity-60 block mt-1.5">{m.timestamp}</span>
                </div>
              </div>
            ))}

            {isAnswering && (
              <div className="flex gap-2.5 max-w-xl mr-auto animate-fade-in">
                <div className="w-6 h-6 rounded-lg bg-[var(--color-primary)] text-white flex items-center justify-center shrink-0">
                  <Bot className="w-3.5 h-3.5" />
                </div>
                <div className="card p-3 bg-white text-xs text-[var(--color-muted-foreground)] flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[var(--color-secondary)] animate-ping" />
                  <span>Extracting verified clause text from circular...</span>
                </div>
              </div>
            )}
          </div>

          {/* Suggested Circular Questions & Input */}
          <div className="p-3 sm:p-4 border-t border-[var(--color-border)] bg-white space-y-2.5 shrink-0">
            {/* Presets */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {selectedDocId.presetQuestions.map((q, qIdx) => {
                const text = chatLanguage === 'te' ? q.te : q.en
                return (
                  <button
                    key={qIdx}
                    type="button"
                    onClick={() => handleSendQuery(text)}
                    className="px-2.5 py-1 rounded-full border border-[var(--color-border)] bg-[var(--color-background)] hover:border-[var(--color-secondary)] hover:bg-white text-[10px] font-semibold text-[var(--color-foreground)] whitespace-nowrap transition-colors"
                  >
                    {text}
                  </button>
                )
              })}
            </div>

            {/* Input Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault()
                handleSendQuery()
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={
                  chatLanguage === 'te'
                    ? 'ఈ పత్రం గురించి ఏదైనా అడగండి...'
                    : 'Ask about clauses, subsidy percentages, timelines in this document...'
                }
                className="input-base text-xs h-10 flex-1 rounded-xl"
              />
              <Button
                type="submit"
                variant="primary"
                size="md"
                disabled={!inputText.trim() || isAnswering}
                className="h-10 px-3.5 rounded-xl"
              >
                <Send className="w-4 h-4" />
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
