const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'src', 'pages', 'DocumentsPage.tsx');
let code = fs.readFileSync(filePath, 'utf8');

const HINDI_DICTS = `
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
`;

// Insert Hindi dicts after DOCUMENT_CATEGORIES_TELUGU
code = code.replace(
  "const HOW_TO_OBTAIN_GUIDANCE_TELUGU: Record<string, string> = {",
  HINDI_DICTS + "\nconst HOW_TO_OBTAIN_GUIDANCE_TELUGU: Record<string, string> = {"
);

// Add isHindi
code = code.replace(
  "const isTelugu = language === 'te'",
  "const isTelugu = language === 'te'\n  const isHindi = language === 'hi'"
);

// Update badge
code = code.replace(
  "<Database className=\"w-3 h-3\" /> {isTelugu ? 'ప్రైవేట్ నిల్వ క్రియాశీలంగా ఉంది' : 'Private Storage Active'}",
  "<Database className=\"w-3 h-3\" /> {isTelugu ? 'ప్రైవేట్ నిల్వ క్రియాశీలంగా ఉంది' : isHindi ? 'निजी स्टोरेज सक्रिय' : 'Private Storage Active'}"
);

code = code.replace(
  "{isTelugu ? 'స్థానిక ప్రివ్యూ మోడ్' : 'Local Preview Mode'}",
  "{isTelugu ? 'స్థానిక ప్రివ్యూ మోడ్' : isHindi ? 'स्थानीय पूर्वावलोकन मोड' : 'Local Preview Mode'}"
);

// Sign in required for locker
code = code.replace(
  "{isTelugu ? 'పత్రాల లాకర్ కోసం పౌరుల సైన్ ఇన్ అవసరం' : 'Citizen Sign-In Required for Document Locker'}",
  "{isTelugu ? 'పత్రాల లాకర్ కోసం పౌరుల సైన్ ఇన్ అవసరం' : isHindi ? 'दस्तावेज़ लॉकर के लिए नागरिक साइन-इन आवश्यक' : 'Citizen Sign-In Required for Document Locker'}"
);

code = code.replace(
  `                  {isTelugu
                    ? 'మీ పౌర ధృవీకరణ పత్రాలు సురక్షితమైన Supabase Storage బకెట్‌లో గుప్తీకరించబడి భద్రపరచబడతాయి. మీ పత్రాలను నిల్వ చేయడానికి మరియు నిర్వహించడానికి సైన్ ఇన్ చేయండి.'
                    : 'Your citizen certificates are securely encrypted and stored in an isolated Supabase Storage bucket with PostgreSQL Row Level Security. Sign in or register to preserve and manage your documents.'}`,
  `                  {isTelugu
                    ? 'మీ పౌర ధృవీకరణ పత్రాలు సురక్షితమైన Supabase Storage బకెట్‌లో గుప్తీకరించబడి భద్రపరచబడతాయి. మీ పత్రాలను నిల్వ చేయడానికి మరియు నిర్వహించడానికి సైన్ ఇన్ చేయండి.'
                    : isHindi
                    ? 'आपके नागरिक प्रमाण पत्र PostgreSQL पंक्ति-स्तरीय सुरक्षा (RLS) के साथ एक पृथक निजी स्टोरेज बकेट में सुरक्षित और एन्क्रिप्टेड संग्रहीत होते हैं। अपने दस्तावेज़ों को प्रबंधित करने के लिए साइन इन करें।'
                    : 'Your citizen certificates are securely encrypted and stored in an isolated Supabase Storage bucket with PostgreSQL Row Level Security. Sign in or register to preserve and manage your documents.'}`
);

code = code.replace(
  "{isTelugu ? 'లాకర్‌ను తెరవడానికి సైన్ ఇన్ చేయండి' : 'Sign In to Access Locker'}",
  "{isTelugu ? 'లాకర్‌ను తెరవడానికి సైన్ ఇన్ చేయండి' : isHindi ? 'लॉकर खोलने के लिए साइन इन करें' : 'Sign In to Access Locker'}"
);

code = code.replace(
  "{isTelugu ? 'పౌర ఖాతాను సృష్టించండి' : 'Create Citizen Account'}",
  "{isTelugu ? 'పౌర ఖాతాను సృష్టించండి' : isHindi ? 'नया नागरिक खाता बनाएं' : 'Create Citizen Account'}"
);

// Upload form titles
code = code.replace(
  "{isTelugu ? 'కొత్త పౌర పత్రాన్ని అప్‌లోడ్ చేయండి' : 'Upload New Citizen Document'}",
  "{isTelugu ? 'కొత్త పౌర పత్రాన్ని అప్‌లోడ్ చేయండి' : isHindi ? 'नया नागरिक दस्तावेज़ अपलोड करें' : 'Upload New Citizen Document'}"
);

code = code.replace(
  `                    {isTelugu ? (
                      <>ఫైల్ పరిమాణం గరిష్టంగా 15 MB. అనుమతించిన ఫార్మాట్‌లు: <strong>PDF, JPEG, PNG</strong>.</>
                    ) : (
                      <>Files up to 15 MB supported. Allowed formats: <strong>PDF, JPEG, PNG</strong>.</>
                    )}`,
  `                    {isTelugu ? (
                      <>ఫైల్ పరిమాణం గరిష్టంగా 15 MB. అనుమతించిన ఫార్మాట్‌లు: <strong>PDF, JPEG, PNG</strong>.</>
                    ) : isHindi ? (
                      <>अधिकतम 15 MB तक की फ़ाइलें समर्थित हैं। स्वीकृत प्रारूप: <strong>PDF, JPEG, PNG</strong>।</>
                    ) : (
                      <>Files up to 15 MB supported. Allowed formats: <strong>PDF, JPEG, PNG</strong>.</>
                    )}`
);

code = code.replace(
  "<ShieldCheck className=\"w-3 h-3\" /> {isTelugu ? 'సురక్షిత డేటాబేస్ ఎన్‌క్రిప్షన్' : 'Private RLS Encrypted'}",
  "<ShieldCheck className=\"w-3 h-3\" /> {isTelugu ? 'సురక్షిత డేటాబేస్ ఎన్‌క్రిప్షన్' : isHindi ? 'निजी RLS एन्क्रिप्टेड' : 'Private RLS Encrypted'}"
);

code = code.replace(
  "{isTelugu ? 'పత్రం యొక్క వర్గం' : 'Document Category'}",
  "{isTelugu ? 'పత్రం యొక్క వర్గం' : isHindi ? 'दस्तावेज़ की श्रेणी' : 'Document Category'}"
);

code = code.replace(
  "{isTelugu ? (DOCUMENT_CATEGORIES_TELUGU[cat] || cat) : cat}",
  "{isTelugu ? (DOCUMENT_CATEGORIES_TELUGU[cat] || cat) : isHindi ? (DOCUMENT_CATEGORIES_HINDI[cat] || cat) : cat}"
);

code = code.replace(
  "{isTelugu ? 'పత్రం ఫైల్‌ను ఎంచుకోండి' : 'Select Document File'}",
  "{isTelugu ? 'పత్రం ఫైల్‌ను ఎంచుకోండి' : isHindi ? 'दस्तावेज़ फ़ाइल चुनें' : 'Select Document File'}"
);

code = code.replace(
  `                    ? (isTelugu ? 'ఎన్‌క్రిప్ట్ చేసి అప్‌లోడ్ చేస్తోంది...' : 'Encrypting & Uploading...')
                    : (isTelugu ? 'ప్రైవేట్ లాకర్‌కు అప్‌లోడ్ చేయండి' : 'Upload to Private Locker')`,
  `                    ? (isTelugu ? 'ఎన్‌క్రిప్ట్ చేసి అప్‌లోడ్ చేస్తోంది...' : isHindi ? 'एन्क्रिप्ट करके अपलोड हो रहा है...' : 'Encrypting & Uploading...')
                    : (isTelugu ? 'ప్రైవేట్ లాకర్‌కు అప్‌లోడ్ చేయండి' : isHindi ? 'निजी लॉकर में अपलोड करें' : 'Upload to Private Locker')`
);

code = code.replace(
  "<span>{isTelugu ? 'నా భద్రపరచిన పత్రాలు' : 'My Saved Documents'}</span>",
  "<span>{isTelugu ? 'నా భద్రపరచిన పత్రాలు' : isHindi ? 'मेरे सुरक्षित दस्तावेज़' : 'My Saved Documents'}</span>"
);

code = code.replace(
  "{isTelugu ? `(${uploadedDocuments.length} పత్రాలు)` : `(${uploadedDocuments.length} certificate${uploadedDocuments.length !== 1 ? 's' : ''})`}",
  "{isTelugu ? `(${uploadedDocuments.length} పత్రాలు)` : isHindi ? `(${uploadedDocuments.length} प्रमाण पत्र)` : `(${uploadedDocuments.length} certificate${uploadedDocuments.length !== 1 ? 's' : ''})`}"
);

code = code.replace(
  "<RotateCcw className=\"w-3 h-3\" /> {isTelugu ? 'రిఫ్రెష్ చేయండి' : 'Refresh Locker'}",
  "<RotateCcw className=\"w-3 h-3\" /> {isTelugu ? 'రిఫ్రెష్ చేయండి' : isHindi ? 'लॉकर रिफ्रेश करें' : 'Refresh Locker'}"
);

code = code.replace(
  "{isTelugu ? 'సురక్షిత నిల్వ నుండి మీ పత్రాలను లోడ్ చేస్తోంది...' : 'Loading your documents from secure Supabase storage...'}",
  "{isTelugu ? 'సురక్షిత నిల్వ నుండి మీ పత్రాలను లోడ్ చేస్తోంది...' : isHindi ? 'सुरक्षित स्टोरेज से आपके दस्तावेज़ लोड हो रहे हैं...' : 'Loading your documents from secure Supabase storage...'}"
);

code = code.replace(
  "actionLabel={user ? t('btnUpload') : (isTelugu ? 'లాకర్‌ను తెరవడానికి సైన్ ఇన్ చేయండి' : 'Sign In to Access Locker')}",
  "actionLabel={user ? t('btnUpload') : (isTelugu ? 'లాకర్‌ను తెరవడానికి సైన్ ఇన్ చేయండి' : isHindi ? 'लॉकर खोलने के लिए साइन इन करें' : 'Sign In to Access Locker')}"
);

code = code.replace(
  "const formattedDate = new Date(doc.created_at).toLocaleDateString(isTelugu ? 'te-IN' : 'en-IN', {",
  "const formattedDate = new Date(doc.created_at).toLocaleDateString(isTelugu ? 'te-IN' : isHindi ? 'hi-IN' : 'en-IN', {"
);

code = code.replace(
  "{isTelugu ? (DOCUMENT_CATEGORIES_TELUGU[doc.document_type] || doc.document_type) : doc.document_type}",
  "{isTelugu ? (DOCUMENT_CATEGORIES_TELUGU[doc.document_type] || doc.document_type) : isHindi ? (DOCUMENT_CATEGORIES_HINDI[doc.document_type] || doc.document_type) : doc.document_type}"
);

code = code.replace(
  "<span>{isTelugu ? `అప్‌లోడ్ తేదీ ${formattedDate}` : `Uploaded on ${formattedDate}`}</span>",
  "<span>{isTelugu ? `అప్‌లోడ్ తేదీ ${formattedDate}` : isHindi ? `अपलोड तिथि ${formattedDate}` : `Uploaded on ${formattedDate}`}</span>"
);

code = code.replace(
  "<ShieldCheck className=\"w-3 h-3\" /> {isTelugu ? 'ప్రైవేట్' : 'Private'}",
  "<ShieldCheck className=\"w-3 h-3\" /> {isTelugu ? 'ప్రైవేట్' : isHindi ? 'निजी' : 'Private'}"
);

code = code.replace(
  "{isTelugu ? 'చూడండి / డౌన్‌లోడ్' : 'View / Download'}",
  "{isTelugu ? 'చూడండి / డౌన్‌లోడ్' : isHindi ? 'देखें / डाउनलोड करें' : 'View / Download'}"
);

code = code.replace(
  "title={isTelugu ? 'పత్రాన్ని తొలగించండి' : 'Delete document'}",
  "title={isTelugu ? 'పత్రాన్ని తొలగించండి' : isHindi ? 'दस्तावेज़ हटाएं' : 'Delete document'}"
);

code = code.replace(
  "<span>{isTelugu ? 'ప్రభుత్వ ప్రామాణిక పౌర డేటా రక్షణ' : 'Government Standard Citizen Data Protection'}</span>",
  "<span>{isTelugu ? 'ప్రభుత్వ ప్రామాణిక పౌర డేటా రక్షణ' : isHindi ? 'सरकारी मानक नागरिक डेटा सुरक्षा' : 'Government Standard Citizen Data Protection'}</span>"
);

code = code.replace(
  `              {isTelugu
                ? 'మీ పత్రాలు భారతదేశ ఇన్ఫర్మేషన్ టెక్నాలజీ చట్టం మరియు డిజిటల్ పర్సనల్ డేటా ప్రొటెక్షన్ (DPDP) చట్టం మార్గదర్శకాలకు అనుగుణంగా ఎండ్-టు-ఎండ్ గుప్తీకరించబడతాయి. ఎట్టి పరిస్థితుల్లోనూ మీ అనుమతి లేకుండా పత్రాలు ఇతరులకు బహిర్గతం చేయబడవు.'
                : 'All uploaded documents are stored in private Supabase Storage partitions with PostgreSQL Row Level Security (RLS) enforcement. Only your authenticated session can generate time-limited signed URLs to access documents.'}`,
  `              {isTelugu
                ? 'మీ పత్రాలు భారతదేశ ఇన్ఫర్మేషన్ టెక్నాలజీ చట్టం మరియు డిజిటల్ పర్సనల్ డేటా ప్రొటెక్షన్ (DPDP) చట్టం మార్గదర్శకాలకు అనుగుణంగా ఎండ్-టు-ఎండ్ గుప్తీకరించబడతాయి. ఎట్టి పరిస్థితుల్లోనూ మీ అనుమతి లేకుండా పత్రాలు ఇతరులకు బహిర్గతం చేయబడవు.'
                : isHindi
                ? 'सभी अपलोड किए गए दस्तावेज़ PostgreSQL पंक्ति-स्तरीय सुरक्षा (RLS) के साथ निजी स्टोरेज विभाजन में सुरक्षित हैं। केवल आपका प्रमाणित सत्र ही दस्तावेज़ों तक पहुँचने के लिए समय-सीमित हस्ताक्षरित URL उत्पन्न कर सकता है।'
                : 'All uploaded documents are stored in private Supabase Storage partitions with PostgreSQL Row Level Security (RLS) enforcement. Only your authenticated session can generate time-limited signed URLs to access documents.'}`
);

// Checklist Scheme selector
code = code.replace(
  "{isTelugu ? 'లక్షిత సంక్షేమ పథకాన్ని ఎంచుకోండి:' : 'Select Target Welfare Scheme:'}",
  "{isTelugu ? 'లక్షిత సంక్షేమ పథకాన్ని ఎంచుకోండి:' : isHindi ? 'लक्षित कल्याणकारी योजना चुनें:' : 'Select Target Welfare Scheme:'}"
);

code = code.replace(
  "{isTelugu ? 'జాబితాను రీసెట్ చేయండి' : 'Reset Checklist'}",
  "{isTelugu ? 'జాబితాను రీసెట్ చేయండి' : isHindi ? 'चेकलिस्ट रीसेट करें' : 'Reset Checklist'}"
);

code = code.replace(
  "[{isTelugu ? (s.level === 'Central' ? 'కేంద్ర' : 'రాష్ట్ర') : s.level}] {isTelugu ? s.titleTelugu : s.title} — {s.benefitAmount}",
  "[{isTelugu ? (s.level === 'Central' ? 'కేంద్ర' : 'రాష్ట్ర') : isHindi ? (s.level === 'Central' ? 'केंद्रीय' : 'राज्य') : s.level}] {isTelugu ? (s.titleTelugu || s.title) : isHindi ? (s.titleHindi || s.title) : s.title} — {s.benefitAmount}"
);

code = code.replace(
  "{selectedScheme.titleTelugu} • {isTelugu ? 'నోడల్ విభాగం' : 'Nodal Authority'}: {selectedScheme.ministry}",
  "{(isTelugu ? selectedScheme.titleTelugu : isHindi ? selectedScheme.titleHindi : selectedScheme.title) || selectedScheme.title} • {isTelugu ? 'నోడల్ విభాగం' : isHindi ? 'नोडल विभाग' : 'Nodal Authority'}: {selectedScheme.ministry}"
);

code = code.replace(
  "{isTelugu ? 'దరఖాస్తు సంసిద్ధత స్కోరు' : 'Application Readiness Score'}",
  "{isTelugu ? 'దరఖాస్తు సంసిద్ధత స్కోరు' : isHindi ? 'आवेदन तत्परता स्कोर' : 'Application Readiness Score'}"
);

code = code.replace(
  "{completionPercentage}% {isTelugu ? 'సిద్ధం' : 'Ready'}",
  "{completionPercentage}% {isTelugu ? 'సిద్ధం' : isHindi ? 'तैयार' : 'Ready'}"
);

code = code.replace(
  `                      ? (isTelugu ? 'దరఖాస్తుకు సిద్ధంగా ఉంది' : 'Ready to Apply')
                      : (isTelugu ? 'చర్య అవసరం' : 'Action Required')`,
  `                      ? (isTelugu ? 'దరఖాస్తుకు సిద్ధంగా ఉంది' : isHindi ? 'आवेदन के लिए तैयार' : 'Ready to Apply')
                      : (isTelugu ? 'చర్య అవసరం' : isHindi ? 'कार्रवाई आवश्यक' : 'Action Required')`
);

code = code.replace(
  "<CheckCircle2 className=\"w-4 h-4\" /> {availableDocs} {isTelugu ? 'అందుబాటులో ఉంది' : 'Available'}",
  "<CheckCircle2 className=\"w-4 h-4\" /> {availableDocs} {isTelugu ? 'అందుబాటులో ఉంది' : isHindi ? 'उपलब्ध' : 'Available'}"
);

code = code.replace(
  "<AlertTriangle className=\"w-4 h-4\" /> {needToObtainDocs} {isTelugu ? 'పొందవలసి ఉంది' : 'Need to Get'}",
  "<AlertTriangle className=\"w-4 h-4\" /> {needToObtainDocs} {isTelugu ? 'పొందవలసి ఉంది' : isHindi ? 'प्राप्त करना होगा' : 'Need to Get'}"
);

code = code.replace(
  "<XCircle className=\"w-4 h-4\" /> {missingDocs} {isTelugu ? 'అందుబాటులో లేదు' : 'Missing'}",
  "<XCircle className=\"w-4 h-4\" /> {missingDocs} {isTelugu ? 'అందుబాటులో లేదు' : isHindi ? 'अनुपलब्ध' : 'Missing'}"
);

code = code.replace(
  "<span>{isTelugu ? `${selectedScheme.titleTelugu} కోసం అధికారిక పత్రాలు` : `Official Documents for ${selectedScheme.title}`}</span>",
  "<span>{isTelugu ? `${selectedScheme.titleTelugu || selectedScheme.title} కోసం అధికారిక పత్రాలు` : isHindi ? `${selectedScheme.titleHindi || selectedScheme.title} के लिए आवश्यक दस्तावेज़` : `Official Documents for ${selectedScheme.title}`}</span>"
);

code = code.replace(
  "{isTelugu ? `మొత్తం ${totalDocs} అవసరాలు` : `${totalDocs} total requirements`}",
  "{isTelugu ? `మొత్తం ${totalDocs} అవసరాలు` : isHindi ? `कुल ${totalDocs} आवश्यकताएँ` : `${totalDocs} total requirements`}"
);

code = code.replace(
  `                const obtainGuide = isTelugu
                  ? (HOW_TO_OBTAIN_GUIDANCE_TELUGU[item.name] || HOW_TO_OBTAIN_GUIDANCE[item.name])
                  : HOW_TO_OBTAIN_GUIDANCE[item.name]`,
  `                const obtainGuide = isTelugu
                  ? (HOW_TO_OBTAIN_GUIDANCE_TELUGU[item.name] || HOW_TO_OBTAIN_GUIDANCE[item.name])
                  : isHindi
                  ? (HOW_TO_OBTAIN_GUIDANCE_HINDI[item.name] || HOW_TO_OBTAIN_GUIDANCE[item.name])
                  : HOW_TO_OBTAIN_GUIDANCE[item.name]`
);

code = code.replace(
  "<span className=\"badge badge-danger text-[10px]\">{isTelugu ? 'తప్పనిసరి' : 'Mandatory'}</span>",
  "<span className=\"badge badge-danger text-[10px]\">{isTelugu ? 'తప్పనిసరి' : isHindi ? 'अनिवार्य' : 'Mandatory'}</span>"
);

code = code.replace(
  "<Check className=\"w-3 h-3\" /> {isTelugu ? 'లాకర్‌లో ఉంది' : 'In Locker'}",
  "<Check className=\"w-3 h-3\" /> {isTelugu ? 'లాకర్‌లో ఉంది' : isHindi ? 'लॉकर में उपलब्ध' : 'In Locker'}"
);

code = code.replace(
  "<Building2 className=\"w-3 h-3\" /> {isTelugu ? 'జారీ చేసే కార్యాలయం:' : 'Issuing Office:'} {item.issuingAuthority}",
  "<Building2 className=\"w-3 h-3\" /> {isTelugu ? 'జారీ చేసే కార్యాలయం:' : isHindi ? 'जारीकर्ता कार्यालय:' : 'Issuing Office:'} {item.issuingAuthority}"
);

code = code.replace(
  "<span>{isTelugu ? 'అందుబాటులో ఉంది' : 'Available'}</span>",
  "<span>{isTelugu ? 'అందుబాటులో ఉంది' : isHindi ? 'उपलब्ध' : 'Available'}</span>"
);

code = code.replace(
  "<span>{isTelugu ? 'పొందవలసి ఉంది' : 'Need to Get'}</span>",
  "<span>{isTelugu ? 'పొందవలసి ఉంది' : isHindi ? 'प्राप्त करना होगा' : 'Need to Get'}</span>"
);

code = code.replace(
  "<span>{isTelugu ? 'అందుబాటులో లేదు' : 'Missing'}</span>",
  "<span>{isTelugu ? 'అందుబాటులో లేదు' : isHindi ? 'अनुपलब्ध' : 'Missing'}</span>"
);

code = code.replace(
  "<strong className=\"text-[var(--color-primary)] font-semibold\">{isTelugu ? 'ఎలా పొందాలి: ' : 'How to obtain: '}</strong>",
  "<strong className=\"text-[var(--color-primary)] font-semibold\">{isTelugu ? 'ఎలా పొందాలి: ' : isHindi ? 'कैसे प्राप्त करें: ' : 'How to obtain: '}</strong>"
);

fs.writeFileSync(filePath, code, 'utf8');
console.log('Successfully updated DocumentsPage.tsx with Hindi translations');
