import { useState, useEffect } from 'react'
import {
  User,
  MapPin,
  Briefcase,
  Check,
  Save,
  RotateCcw,
  Sparkles,
  AlertTriangle,
  Database,
  ShieldAlert,
} from 'lucide-react'
import { useApp, EMPTY_CITIZEN_PROFILE, SAMPLE_DEMO_PROFILE } from '@/context/AppContext'
import { useAuth } from '@/context/AuthContext'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { useLanguage } from '@/context/LanguageContext'

export default function ProfilePage() {
  const { profile, updateProfile, loadDemoProfile, resetProfile, profileCompletionPercentage, isDatabaseSynced } = useApp()
  const { user, isConfigured } = useAuth()
  const { t, fontClass, language } = useLanguage()
  const isTelugu = language === 'te'
  const isHindi = language === 'hi'

  // Local draft state
  const [formData, setFormData] = useState({ ...profile })
  const [isSavedAlert, setIsSavedAlert] = useState(false)

  useEffect(() => {
    setFormData({ ...profile })
  }, [profile])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await updateProfile(formData)
    setIsSavedAlert(true)
    setTimeout(() => setIsSavedAlert(false), 3000)
  }

  const handleLoadDemo = () => {
    loadDemoProfile()
    setFormData({ ...SAMPLE_DEMO_PROFILE })
  }

  const handleReset = () => {
    resetProfile()
    setFormData({ ...EMPTY_CITIZEN_PROFILE })
  }

  return (
    <div className={`p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto space-y-6 animate-fade-in ${fontClass}`}>
      {/* ── HEADER ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <Badge variant="primary" className="mb-1.5">{t('profileIdentityBadge')}</Badge>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--color-primary)] tracking-tight">
            {t('profileTitle')}
          </h1>
          <p className="text-xs sm:text-sm text-[var(--color-muted-foreground)] mt-0.5">
            {t('profileSubtitle')}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleLoadDemo}
            leftIcon={<Sparkles className="w-3.5 h-3.5 text-amber-500" />}
            className="text-xs"
          >
            {t('profileLoadDemo')}
          </Button>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleReset}
            leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
            className="text-xs"
          >
            {t('profileReset')}
          </Button>
        </div>

        {isSavedAlert && (
          <div className="p-2.5 px-4 rounded-xl bg-[var(--color-success-bg)] border border-[var(--color-success-border)] text-[var(--color-success)] text-xs font-bold flex items-center gap-1.5 animate-scale-in">
            <Check className="w-4 h-4" /> {t('profileUpdatedSuccess')}
          </div>
        )}
      </div>

      {/* ── SUPABASE AUTHENTICATION & SYNC STATUS ── */}
      {user && isConfigured ? (
        isDatabaseSynced ? (
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-950 text-xs flex items-center justify-between gap-3 shadow-xs">
            <div className="flex items-center gap-2.5">
              <Database className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="leading-relaxed">
                {isTelugu ? (
                  <><strong>సుపాబేస్ డేటాబేస్ అనుసంధానించబడింది:</strong> <code className="font-mono bg-emerald-100 px-1.5 py-0.5 rounded text-emerald-900">{user.email}</code> గా ప్రామాణీకరించబడింది. రో లెవల్ సెక్యూరిటీ క్రింద పోస్ట్‌గ్రేస్‌క్యూఎల్ <code className="font-mono bg-emerald-100 px-1.5 py-0.5 rounded text-emerald-900">profiles</code> పట్టికతో పౌర వివరాలు సమకాలీకరించబడ్డాయి.</>
                ) : isHindi ? (
                  <><strong>सुपाबेस डेटाबेस कनेक्टेड:</strong> <code className="font-mono bg-emerald-100 px-1.5 py-0.5 rounded text-emerald-900">{user.email}</code> के रूप में प्रमाणित। रो लेवल सिक्योरिटी (RLS) के तहत पोस्टग्रेएसक्यूएल <code className="font-mono bg-emerald-100 px-1.5 py-0.5 rounded text-emerald-900">profiles</code> तालिका के साथ नागरिक विवरण समन्वयित।</>
                ) : (
                  <><strong>Supabase Database Connected:</strong> Authenticated as <code className="font-mono bg-emerald-100 px-1.5 py-0.5 rounded text-emerald-900">{user.email}</code>. Demographics verified and synced with PostgreSQL <code className="font-mono bg-emerald-100 px-1.5 py-0.5 rounded text-emerald-900">profiles</code> table under Row Level Security.</>
                )}
              </span>
            </div>
            <Badge variant="success" className="shrink-0">{isTelugu ? 'ప్రత్యక్ష డేటాబేస్ సమకాలీకరణ' : isHindi ? 'लाइव डेटाबेस सिंक' : 'Live Database Synced'}</Badge>
          </div>
        ) : (
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/25 text-amber-950 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
            <div className="flex items-center gap-2.5">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
              <span className="leading-relaxed">
                {isTelugu ? (
                  <><strong>సుపాబేస్ ఉనికి గుర్తించబడింది:</strong> <code className="font-mono bg-amber-100 px-1.5 py-0.5 rounded text-amber-900">{user.email}</code> గా లాగిన్ అయ్యారు. రిమోట్ టేబుల్ ఇంకా సిద్ధం కాలేదు. డేటా ప్రస్తుతం <strong>localStorage</strong> లో భద్రపరచబడుతుంది.</>
                ) : isHindi ? (
                  <><strong>सुपाबेस इंस्टेंस सक्रिय (स्कीमा लंबित):</strong> <code className="font-mono bg-amber-100 px-1.5 py-0.5 rounded text-amber-900">{user.email}</code> के रूप में लॉगिन। डेटा वर्तमान में <strong>localStorage</strong> में सुरक्षित है।</>
                ) : (
                  <><strong>Supabase Instance Reached (Schema Pending):</strong> Authenticated as <code className="font-mono bg-amber-100 px-1.5 py-0.5 rounded text-amber-900">{user.email}</code>. Remote table <code className="font-mono bg-amber-100 px-1 py-0.5 rounded">public.profiles</code> is not yet created in PostgreSQL. Data is currently persisted in <strong>localStorage</strong>. Execute database migrations in Supabase SQL Editor to enable PostgreSQL RLS persistence.</>
                )}
              </span>
            </div>
            <span className="badge badge-warning text-[10px] shrink-0">{isTelugu ? 'స్థానిక నిల్వ క్రియాశీలం' : isHindi ? 'लोकल स्टोरेज सक्रिय' : 'Local Storage Active'}</span>
          </div>
        )
      ) : !isConfigured ? (
        <div className="p-3.5 rounded-2xl bg-blue-500/10 border border-blue-500/25 text-blue-950 text-xs flex items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-2.5">
            <ShieldAlert className="w-4 h-4 text-blue-600 shrink-0" />
            <span className="leading-relaxed">
              {isTelugu ? (
                <><strong>స్థానిక డెమో వాతావరణం:</strong> ప్రొఫైల్ మార్పులు స్థానిక బ్రౌజర్ నిల్వలో సురక్షితంగా సేవ్ చేయబడతాయి.</>
              ) : isHindi ? (
                <><strong>स्थानीय डेमो वातावरण:</strong> प्रोफ़ाइल परिवर्तन स्थानीय ब्राउज़र स्टोरेज में सुरक्षित रूप से सहेजे जाते हैं।</>
              ) : (
                <><strong>Local Demonstration Environment:</strong> Supabase credentials are pending in <code className="font-mono bg-blue-100 px-1.5 py-0.5 rounded text-blue-900">.env.local</code>. Profile edits are stored safely in local browser storage.</>
              )}
            </span>
          </div>
        </div>
      ) : null}

      {/* ── DEMO PROFILE NOTICE BANNER ── */}
      {formData.isDemoProfile && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/25 text-amber-950 text-xs flex items-start sm:items-center justify-between gap-3 shadow-xs">
          <div className="flex items-start sm:items-center gap-2.5">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5 sm:mt-0" />
            <span className="leading-relaxed">
              {isTelugu ? (
                <><strong>నమూనా ప్రొఫైల్ క్రియాశీలంగా ఉంది:</strong> ఈ ప్రొఫైల్ పథకాల అర్హతను పరీక్షించడానికి నమూనా పౌర విలువలను కలిగి ఉంది. ఏ నిజమైన ప్రభుత్వ ఖాతా లింక్ చేయబడలేదు.</>
              ) : isHindi ? (
                <><strong>डेमो प्रोफ़ाइल सक्रिय:</strong> इस प्रोफ़ाइल में पात्रता परीक्षण के लिए नमूना नागरिक मान शामिल हैं। कोई वास्तविक सरकारी खाता लिंक नहीं है।</>
              ) : (
                <><strong>Demonstration Profile Active:</strong> This profile contains sample citizen values for testing simulated scheme eligibility. No real government account or database is linked.</>
              )}
            </span>
          </div>
          <button
            type="button"
            onClick={handleReset}
            className="text-xs font-bold text-amber-900 underline hover:text-amber-700 shrink-0"
          >
            {isTelugu ? 'నమూనా డేటాను తొలగించండి' : isHindi ? 'नमूना डेटा हटाएं' : 'Clear Sample Data'}
          </button>
        </div>
      )}

      {/* ── PROFILE COMPLETION HERO ── */}
      <div className="card p-6 bg-white shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-[var(--color-primary)] text-white text-base font-extrabold flex items-center justify-center shadow-xs">
              {formData.fullName
                .split(' ')
                .map((n) => n[0])
                .join('')
                .slice(0, 2)
                .toUpperCase() || 'CS'}
            </div>
            <div>
              <h2 className="text-base font-bold text-[var(--color-foreground)]">
                {formData.fullName}
              </h2>
              <p className="text-xs text-[var(--color-muted-foreground)]">
                {formData.state} • {formData.district} • {formData.occupation}
              </p>
            </div>
          </div>

          <div className="text-right">
            <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-muted-foreground)] block">
              {t('profileCompleteness')}
            </span>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-2xl font-extrabold text-[var(--color-primary)]">
                {profileCompletionPercentage}%
              </span>
              <span className="badge badge-accent text-xs">
                {profileCompletionPercentage === 100
                  ? (isTelugu ? 'పూర్తిగా ధృవీకరించబడింది' : isHindi ? 'पूर्णतः सत्यापित' : 'Fully Verified')
                  : (isTelugu ? 'మంచి పురోగతి' : isHindi ? 'उत्तम प्रगति' : 'Good Progress')}
              </span>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-[var(--color-background)] rounded-full h-2.5 overflow-hidden border border-[var(--color-border)]">
          <div
            className="h-full rounded-full transition-all duration-500 bg-[var(--color-accent)]"
            style={{ width: `${profileCompletionPercentage}%` }}
          />
        </div>
      </div>

      {/* ── EDITABLE FORM ── */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1: Personal Details */}
        <div className="card p-6 bg-white shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-[var(--color-primary)] pb-2 border-b border-[var(--color-border-subtle)] flex items-center gap-2">
            <User className="w-4 h-4 text-[var(--color-secondary)]" /> {t('profilePersonal')}
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-[var(--color-foreground)] block mb-1">
                {isTelugu ? 'పూర్తి పేరు (ఆధార్ ప్రకారం)' : isHindi ? 'पूरा नाम (आधार के अनुसार)' : 'Full Name (as in Aadhaar)'}
              </label>
              <input
                type="text"
                required
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="input-base text-xs"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-[var(--color-foreground)] block mb-1">
                {isTelugu ? 'ఈమెయిల్ చిరునామా' : isHindi ? 'ईमेल पता' : 'Email Address'}
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="input-base text-xs"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-[var(--color-foreground)] block mb-1">
                {isTelugu ? 'మొబైల్ నంబర్ (ఎస్ఎంఎస్ & ఓటీపీ కోసం)' : isHindi ? 'मोबाइल नंबर (एसएमएस और ओटीपी के लिए)' : 'Mobile Number (for SMS & OTP)'}
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="input-base text-xs"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-[var(--color-foreground)] block mb-1">
                {isTelugu ? 'వయస్సు' : isHindi ? 'आयु' : 'Age'}
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
                {isTelugu ? 'లింగం' : isHindi ? 'लिंग' : 'Gender'}
              </label>
              <select
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })}
                className="input-base text-xs"
              >
                <option value="Male">{isTelugu ? 'పురుషుడు (Male)' : isHindi ? 'पुरुष (Male)' : 'Male'}</option>
                <option value="Female">{isTelugu ? 'స్త్రీ (Female)' : isHindi ? 'महिला (Female)' : 'Female'}</option>
                <option value="Other">{isTelugu ? 'ఇతర (Other)' : isHindi ? 'अन्य (Other)' : 'Other'}</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-[var(--color-foreground)] block mb-1">
                {isTelugu ? 'ప్రాధాన్యత ఇంటర్‌ఫేస్ భాష' : isHindi ? 'पसंदीदा इंटरफ़ेस भाषा' : 'Preferred Interface Language'}
              </label>
              <select
                value={formData.preferredLanguage}
                onChange={(e) => setFormData({ ...formData, preferredLanguage: e.target.value })}
                className="input-base text-xs"
              >
                <option value="English">English</option>
                <option value="Telugu">తెలుగు (Telugu)</option>
                <option value="English / తెలుగు">English / తెలుగు (Bilingual)</option>
                <option value="Hindi">हिन्दी (Hindi)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 2: Domicile & Location */}
        <div className="card p-6 bg-white shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-[var(--color-primary)] pb-2 border-b border-[var(--color-border-subtle)] flex items-center gap-2">
            <MapPin className="w-4 h-4 text-[var(--color-secondary)]" /> {t('profileDomicile')}
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-[var(--color-foreground)] block mb-1">
                {isTelugu ? 'నివాస రాష్ట్రం' : isHindi ? 'निवास का राज्य' : 'State of Residence'}
              </label>
              <select
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                className="input-base text-xs"
              >
                <option value="Telangana">{isTelugu ? 'తెలంగాణ (Telangana)' : isHindi ? 'तेलंगाना (Telangana)' : 'Telangana'}</option>
                <option value="Andhra Pradesh">{isTelugu ? 'ఆంధ్రప్రదేశ్ (Andhra Pradesh)' : isHindi ? 'आंध्र प्रदेश (Andhra Pradesh)' : 'Andhra Pradesh'}</option>
                <option value="Karnataka">{isTelugu ? 'కర్ణాటక (Karnataka)' : isHindi ? 'कर्नाटक (Karnataka)' : 'Karnataka'}</option>
                <option value="Maharashtra">{isTelugu ? 'మహారాష్ట్ర (Maharashtra)' : isHindi ? 'महाराष्ट्र (Maharashtra)' : 'Maharashtra'}</option>
                <option value="Tamil Nadu">{isTelugu ? 'తమిళనాడు (Tamil Nadu)' : isHindi ? 'तमिलनाडु (Tamil Nadu)' : 'Tamil Nadu'}</option>
                <option value="Delhi">{isTelugu ? 'ఢిల్లీ (Delhi)' : isHindi ? 'दिल्ली (Delhi)' : 'Delhi'}</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-[var(--color-foreground)] block mb-1">
                {isTelugu ? 'జిల్లా / మండలం' : isHindi ? 'ज़िला / मंडल' : 'District / Mandal'}
              </label>
              <input
                type="text"
                value={formData.district}
                onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                className="input-base text-xs"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Socio-Economic Profile */}
        <div className="card p-6 bg-white shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-[var(--color-primary)] pb-2 border-b border-[var(--color-border-subtle)] flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-[var(--color-secondary)]" /> {t('profileEconomic')}
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-[var(--color-foreground)] block mb-1">
                {isTelugu ? 'ప్రధాన వృత్తి' : isHindi ? 'मुख्य व्यवसाय' : 'Primary Occupation'}
              </label>
              <select
                value={formData.occupation}
                onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
                className="input-base text-xs"
              >
                <option value="Farmer">{isTelugu ? 'రైతు / వ్యవసాయ సాగుదారు' : isHindi ? 'किसान / कृषि काश्तकार' : 'Farmer / Agriculture Cultivator'}</option>
                <option value="Daily Wage Laborer">{isTelugu ? 'రోజువారీ కూలీ / శ్రామికుడు' : isHindi ? 'दिहाड़ी मजदूर / श्रमिक' : 'Daily Wage Manual Laborer'}</option>
                <option value="Self-Employed">{isTelugu ? 'స్వయం ఉపాధి / చేతివృత్తులు / వ్యాపారి' : isHindi ? 'स्वरोजगार / कारीगर / दुकानदार' : 'Self-Employed / Artisan / Shopkeeper'}</option>
                <option value="Private Employee">{isTelugu ? 'ప్రైవేట్ ఉద్యోగి' : isHindi ? 'निजी क्षेत्र कर्मचारी' : 'Private Sector Employee'}</option>
                <option value="Government Employee">{isTelugu ? 'ప్రభుత్వ ఉద్యోగి' : isHindi ? 'सरकारी कर्मचारी' : 'Government Employee'}</option>
                <option value="Student">{isTelugu ? 'విద్యార్థి' : isHindi ? 'विद्यार्थी / छात्र' : 'Student (Post-Secondary)'}</option>
                <option value="Homemaker">{isTelugu ? 'గృహిణి' : isHindi ? 'गृहिणी' : 'Homemaker'}</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-[var(--color-foreground)] block mb-1">
                {isTelugu ? 'పూర్తయిన అత్యున్నత విద్య' : isHindi ? 'उच्चतम पूर्ण शिक्षा' : 'Highest Education Completed'}
              </label>
              <select
                value={formData.education}
                onChange={(e) => setFormData({ ...formData, education: e.target.value })}
                className="input-base text-xs"
              >
                <option value="Primary (Class 1-5)">{isTelugu ? 'ప్రాథమిక (1-5 తరగతులు)' : isHindi ? 'प्राथमिक (कक्षा 1-5)' : 'Primary (Class 1-5)'}</option>
                <option value="Secondary (Class 10)">{isTelugu ? 'ద్వితీయ (10వ తరగతి - ఎస్‌ఎస్‌సీ)' : isHindi ? 'माध्यमिक (कक्षा 10 - मैट्रिक)' : 'Secondary (Class 10 - SSC)'}</option>
                <option value="Higher Secondary (10+2)">{isTelugu ? 'హైయర్ సెకండరీ (ఇంటర్మీడియట్)' : isHindi ? 'उच्च माध्यमिक (10+2 / इंटरमीडिएट)' : 'Higher Secondary (Intermediate)'}</option>
                <option value="Diploma / Polytechnic">{isTelugu ? 'డిప్లొమా / పాలిటెక్నిక్' : isHindi ? 'डिप्लोमा / पॉलिटेक्निक' : 'Diploma / Polytechnic'}</option>
                <option value="Graduate (Degree)">{isTelugu ? 'గ్రాడ్యుయేట్ (డిగ్రీ)' : isHindi ? 'स्नातक (डिग्री)' : 'Graduate (Degree)'}</option>
                <option value="Post Graduate">{isTelugu ? 'పోస్ట్ గ్రాడ్యుయేట్ / వృత్తివిద్యా' : isHindi ? 'स्नातकोत्तर / व्यावसायिक' : 'Post Graduate / Professional'}</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-[var(--color-foreground)] block mb-1">
                {isTelugu ? 'సామాజిక / కుల వర్గం' : isHindi ? 'सामाजिक / जाति वर्ग' : 'Social / Caste Category'}
              </label>
              <select
                value={formData.casteCategory}
                onChange={(e) => setFormData({ ...formData, casteCategory: e.target.value })}
                className="input-base text-xs"
              >
                <option value="General">{isTelugu ? 'జనరల్ / అన్‌రిజర్వ్‌డ్ (ఓసీ)' : isHindi ? 'सामान्य (General / UR)' : 'General / Unreserved (UR)'}</option>
                <option value="BC">{isTelugu ? 'వెనుకబడిన తరగతులు (బీసీ)' : isHindi ? 'अन्य पिछड़ा वर्ग (OBC / BC)' : 'Backward Classes (BC)'}</option>
                <option value="SC">{isTelugu ? 'షెడ్యూల్డ్ కులాలు (ఎస్సీ)' : isHindi ? 'अनुसूचित जाति (SC)' : 'Scheduled Castes (SC)'}</option>
                <option value="ST">{isTelugu ? 'షెడ్యూల్డ్ తెగలు (ఎస్టీ)' : isHindi ? 'अनुसूचित जनजाति (ST)' : 'Scheduled Tribes (ST)'}</option>
                <option value="EWS">{isTelugu ? 'ఆర్థికంగా బలహీన వర్గాలు (ఈడబ్ల్యూఎస్)' : isHindi ? 'आर्थिक रूप से कमजोर वर्ग (EWS)' : 'Economically Weaker Section (EWS)'}</option>
                <option value="Minority">{isTelugu ? 'మత మైనారిటీ' : isHindi ? 'धार्मिक अल्पसंख्यक' : 'Religious Minority'}</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-[var(--color-foreground)] block mb-1">
                {isTelugu ? 'వార్షిక కుటుంబ ఆదాయం (₹లలో)' : isHindi ? 'वार्षिक पारिवारिक आय (₹ में)' : 'Annual Family Income (in ₹)'}
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
                {isTelugu ? 'సాగు భూమి (ఎకరాలలో)' : isHindi ? 'कृषि भूमि (एकड़ में)' : 'Cultivable Landholding (Acres)'}
              </label>
              <input
                type="number"
                step={0.5}
                value={formData.landholdingAcres}
                onChange={(e) => setFormData({ ...formData, landholdingAcres: Number(e.target.value) })}
                className="input-base text-xs"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-[var(--color-foreground)] block mb-1">
                {isTelugu ? 'రేషన్ కార్డు వర్గం' : isHindi ? 'राशन कार्ड श्रेणी' : 'Ration Card Category'}
              </label>
              <select
                value={formData.rationCardType}
                onChange={(e) => setFormData({ ...formData, rationCardType: e.target.value as any })}
                className="input-base text-xs"
              >
                <option value="White">{isTelugu ? 'తెల్ల ఆహార భద్రతా కార్డు (బీపీఎల్)' : isHindi ? 'सफेद राशन कार्ड (BPL)' : 'White Food Security Card (BPL)'}</option>
                <option value="Pink">{isTelugu ? 'పింక్ కార్డు (ఏపీఎల్)' : isHindi ? 'गुलाबी राशन कार्ड (APL)' : 'Pink Card (Above Poverty Line - APL)'}</option>
                <option value="None">{isTelugu ? 'రేషన్ కార్డు లేదు' : isHindi ? 'राशन कार्ड नहीं है' : 'No Ration Card'}</option>
              </select>
            </div>
          </div>
        </div>

        {/* Save Bar */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            leftIcon={<Save className="w-4 h-4" />}
            className="text-xs sm:text-sm font-bold shadow-sm"
          >
            {t('profileSave')}
          </Button>
        </div>
      </form>
    </div>
  )
}
