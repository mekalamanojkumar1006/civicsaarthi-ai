const fs = require('fs');
const path = require('path');

// 1. UPDATE ComparePage.tsx
const comparePath = path.join(__dirname, '..', 'src', 'pages', 'ComparePage.tsx');
let compareCode = fs.readFileSync(comparePath, 'utf8');

compareCode = compareCode.replace(
  "const isTelugu = language === 'te'",
  "const isTelugu = language === 'te'\n  const isHindi = language === 'hi'"
);

compareCode = compareCode.replace(
  "{isTelugu ? 'ప్రత్యక్ష ముఖాముఖి విశ్లేషణ' : 'Direct Side-by-Side Analysis'}",
  "{isTelugu ? 'ప్రత్యక్ష ముఖాముఖి విశ్లేషణ' : isHindi ? 'प्रत्यक्ष तुलनात्मक विश्लेषण' : 'Direct Side-by-Side Analysis'}"
);

compareCode = compareCode.replace(
  "title={isTelugu ? 'పథకాన్ని తీసివేయండి' : 'Remove scheme'}",
  "title={isTelugu ? 'పథకాన్ని తీసివేయండి' : isHindi ? 'योजना हटाएं' : 'Remove scheme'}"
);

compareCode = compareCode.replace(
  "{isTelugu ? (scheme.level === 'Central' ? 'కేంద్ర ప్రభుత్వం' : 'రాష్ట్ర ప్రభుత్వం') : scheme.level}",
  "{isTelugu ? (scheme.level === 'Central' ? 'కేంద్ర ప్రభుత్వం' : 'రాష్ట్ర ప్రభుత్వం') : isHindi ? (scheme.level === 'Central' ? 'केंद्र सरकार' : 'राज्य सरकार') : scheme.level}"
);

compareCode = compareCode.replace(
  "{isTelugu ? scheme.titleTelugu : scheme.title}",
  "{isTelugu ? (scheme.titleTelugu || scheme.title) : isHindi ? (scheme.titleHindi || scheme.title) : scheme.title}"
);

compareCode = compareCode.replace(
  "{isTelugu ? scheme.title : scheme.titleTelugu}",
  "{isTelugu ? scheme.title : isHindi ? scheme.title : scheme.titleTelugu}"
);

compareCode = compareCode.replace(
  "{isTelugu ? 'పోల్చడానికి పథకాన్ని జోడించండి' : 'Add Scheme to Compare'}",
  "{isTelugu ? 'పోల్చడానికి పథకాన్ని జోడించండి' : isHindi ? 'तुलना के लिए योजना जोड़ें' : 'Add Scheme to Compare'}"
);

compareCode = compareCode.replace(
  "{isTelugu ? 'జాబితా నుండి ఎంచుకోండి' : 'Choose from directory'}",
  "{isTelugu ? 'జాబితా నుండి ఎంచుకోండి' : isHindi ? 'सूची से चुनें' : 'Choose from directory'}"
);

compareCode = compareCode.replace(
  "{isTelugu ? 'పోలికను ప్రారంభించడానికి పైన కనీసం ఒక పథకాన్ని ఎంచుకోండి.' : 'Select at least one scheme above to begin comparison.'}",
  "{isTelugu ? 'పోలికను ప్రారంభించడానికి పైన కనీసం ఒక పథకాన్ని ఎంచుకోండి.' : isHindi ? 'तुलना शुरू करने के लिए ऊपर कम से कम एक योजना चुनें।' : 'Select at least one scheme above to begin comparison.'}"
);

compareCode = compareCode.replace(
  "{isTelugu ? 'ప్రభుత్వ పరిధి' : 'Government Jurisdiction'}",
  "{isTelugu ? 'ప్రభుత్వ పరిధి' : isHindi ? 'सरकारी क्षेत्राधिकार' : 'Government Jurisdiction'}"
);

compareCode = compareCode.replace(
  "{isTelugu ? (s.level === 'Central' ? 'కేంద్ర' : 'రాష్ట్ర') : s.level} {isTelugu ? 'ప్రభుత్వం' : 'Government'} {s.state ? `(${s.state})` : ''}",
  "{isTelugu ? (s.level === 'Central' ? 'కేంద్ర' : 'రాష్ట్ర') : isHindi ? (s.level === 'Central' ? 'केंद्रीय' : 'राज्य') : s.level} {isTelugu ? 'ప్రభుత్వం' : isHindi ? 'सरकार' : 'Government'} {s.state ? `(${s.state})` : ''}"
);

compareCode = compareCode.replace(
  "{isTelugu ? 'గరిష్ట వార్షిక ఆదాయ పరిమితి' : 'Max Annual Income Ceiling'}",
  "{isTelugu ? 'గరిష్ట వార్షిక ఆదాయ పరిమితి' : isHindi ? 'अधिकतम वार्षिक आय सीमा' : 'Max Annual Income Ceiling'}"
);

compareCode = compareCode.replace(
  `? (isTelugu ? \`₹\${s.eligibility.maxAnnualIncome.toLocaleString('en-IN')} / ఏడాదికి\` : \`₹\${s.eligibility.maxAnnualIncome.toLocaleString('en-IN')} / Year\`)
                        : (isTelugu ? 'గరిష్ట ఆదాయ పరిమితి లేదు' : 'No Maximum Income Ceiling')`,
  `? (isTelugu ? \`₹\${s.eligibility.maxAnnualIncome.toLocaleString('en-IN')} / ఏడాదికి\` : isHindi ? \`₹\${s.eligibility.maxAnnualIncome.toLocaleString('en-IN')} / वर्ष\` : \`₹\${s.eligibility.maxAnnualIncome.toLocaleString('en-IN')} / Year\`)
                        : (isTelugu ? 'గరిష్ట ఆదాయ పరిమితి లేదు' : isHindi ? 'कोई अधिकतम आय सीमा नहीं' : 'No Maximum Income Ceiling')`
);

compareCode = compareCode.replace(
  "{isTelugu ? 'లక్షిత లబ్ధిదారులు' : 'Target Beneficiaries'}",
  "{isTelugu ? 'లక్షిత లబ్ధిదారులు' : isHindi ? 'लक्षित लाभार्थी' : 'Target Beneficiaries'}"
);

compareCode = compareCode.replace(
  "{isTelugu ? 'ప్రత్యక్ష చర్యలు' : 'Direct Actions'}",
  "{isTelugu ? 'ప్రత్యక్ష చర్యలు' : isHindi ? 'प्रत्यक्ष कार्रवाई' : 'Direct Actions'}"
);

compareCode = compareCode.replace(
  "{isTelugu ? 'పోలికకు జోడించడానికి పథకాన్ని ఎంచుకోండి' : 'Select Scheme to Add to Comparison'}",
  "{isTelugu ? 'పోలికకు జోడించడానికి పథకాన్ని ఎంచుకోండి' : isHindi ? 'तुलना में जोड़ने के लिए योजना चुनें' : 'Select Scheme to Add to Comparison'}"
);

compareCode = compareCode.replace(
  "{isTelugu ? 'అందుబాటులో ఉన్న అన్ని పథకాలు పోలికకు జోడించబడ్డాయి.' : 'All available schemes have been added to the comparison.'}",
  "{isTelugu ? 'అందుబాటులో ఉన్న అన్ని పథకాలు పోలికకు జోడించబడ్డాయి.' : isHindi ? 'सभी उपलब्ध योजनाएँ तुलना में जोड़ दी गई हैं।' : 'All available schemes have been added to the comparison.'}"
);

compareCode = compareCode.replace(
  "{isTelugu ? (s.level === 'Central' ? 'కేంద్రం' : 'రాష్ట్రం') : s.level}",
  "{isTelugu ? (s.level === 'Central' ? 'కేంద్రం' : 'రాష్ట్రం') : isHindi ? (s.level === 'Central' ? 'केंद्रीय' : 'राज्य') : s.level}"
);

compareCode = compareCode.replace(
  "{isTelugu ? s.titleTelugu : s.title}",
  "{isTelugu ? (s.titleTelugu || s.title) : isHindi ? (s.titleHindi || s.title) : s.title}"
);

compareCode = compareCode.replace(
  "{isTelugu ? 'జోడించు' : 'Add'}",
  "{isTelugu ? 'జోడించు' : isHindi ? 'जोड़ें' : 'Add'}"
);

fs.writeFileSync(comparePath, compareCode, 'utf8');
console.log('Updated ComparePage.tsx');

// 2. UPDATE SavedPage.tsx
const savedPath = path.join(__dirname, '..', 'src', 'pages', 'SavedPage.tsx');
let savedCode = fs.readFileSync(savedPath, 'utf8');

savedCode = savedCode.replace(
  "const isTelugu = language === 'te'",
  "const isTelugu = language === 'te'\n  const isHindi = language === 'hi'"
);

savedCode = savedCode.replace(
  "{isTelugu ? 'పౌర బుక్‌మార్క్‌లు' : 'Citizen Bookmarks'}",
  "{isTelugu ? 'పౌర బుక్‌మార్క్‌లు' : isHindi ? 'नागरिक बुकमार्क' : 'Citizen Bookmarks'}"
);

savedCode = savedCode.replace(
  "<Database className=\"w-3 h-3\" /> {isTelugu ? 'డేటాబేస్ సమకాలీకరించబడింది' : 'Supabase Synced'}",
  "<Database className=\"w-3 h-3\" /> {isTelugu ? 'డేటాబేస్ సమకాలీకరించబడింది' : isHindi ? 'डेटाबेस सिंक्रनाइज़्ड' : 'Supabase Synced'}"
);

savedCode = savedCode.replace(
  "{isTelugu ? 'స్థానిక నిల్వ మోడ్' : 'Local Storage Mode'}",
  "{isTelugu ? 'స్థానిక నిల్వ మోడ్' : isHindi ? 'स्थानीय स्टोरेज मोड' : 'Local Storage Mode'}"
);

savedCode = savedCode.replace(
  "<RotateCcw className=\"w-3 h-3\" /> {isTelugu ? 'మళ్లీ ప్రయత్నించండి' : 'Retry'}",
  "<RotateCcw className=\"w-3 h-3\" /> {isTelugu ? 'మళ్లీ ప్రయత్నించండి' : isHindi ? 'पुनः प्रयास करें' : 'Retry'}"
);

savedCode = savedCode.replace(
  "placeholder={isTelugu ? 'భద్రపరిచిన పథకాలలో శోధించండి...' : 'Search within your saved schemes...'}",
  "placeholder={isTelugu ? 'భద్రపరిచిన పథకాలలో శోధించండి...' : isHindi ? 'सुरक्षित योजनाओं में खोजें...' : 'Search within your saved schemes...'}"
);

savedCode = savedCode.replace(
  "{isTelugu ? 'డేటాబేస్ నుండి మీ భద్రపరిచిన పథకాలను పొందుతోంది...' : 'Retrieving your saved schemes from Supabase database...'}",
  "{isTelugu ? 'డేటాబేస్ నుండి మీ భద్రపరిచిన పథకాలను పొందుతోంది...' : isHindi ? 'डेटाबेस से आपकी सुरक्षित योजनाएँ लोड हो रही हैं...' : 'Retrieving your saved schemes from Supabase database...'}"
);

savedCode = savedCode.replace(
  "title={isTelugu ? 'మీ శోధనకు సరిపోలిన పథకాలు ఏవీ లేవు' : 'No saved schemes matched your search'}",
  "title={isTelugu ? 'మీ శోధనకు సరిపోలిన పథకాలు ఏవీ లేవు' : isHindi ? 'आपकी खोज से मेल खाती कोई योजना नहीं मिली' : 'No saved schemes matched your search'}"
);

savedCode = savedCode.replace(
  `description={
            isTelugu
              ? \`"\${searchQuery}" శోధనకు ఎటువంటి భద్రపరిచిన పథకాలు లభించలేదు. శోధన పదాన్ని మార్చి ప్రయత్నించండి.\`
              : \`No saved schemes match "\${searchQuery}". Try a different keyword.\`
          }`,
  `description={
            isTelugu
              ? \`"\${searchQuery}" శోధనకు ఎటువంటి భద్రపరిచిన పథకాలు లభించలేదు. శోధన పదాన్ని మార్చి ప్రయత్నించండి.\`
              : isHindi
              ? \`"\${searchQuery}" से मेल खाती कोई सुरक्षित योजना नहीं मिली। कृपया कोई अन्य शब्द खोजें।\`
              : \`No saved schemes match "\${searchQuery}". Try a different keyword.\`
          }`
);

fs.writeFileSync(savedPath, savedCode, 'utf8');
console.log('Updated SavedPage.tsx');

// 3. UPDATE ProfilePage.tsx
const profilePath = path.join(__dirname, '..', 'src', 'pages', 'ProfilePage.tsx');
let profileCode = fs.readFileSync(profilePath, 'utf8');

profileCode = profileCode.replace(
  "const isTelugu = language === 'te'",
  "const isTelugu = language === 'te'\n  const isHindi = language === 'hi'"
);

// Occupation options
profileCode = profileCode.replace(
  `<option value="Farmer">{isTelugu ? 'రైతు / వ్యవసాయ సాగుదారు' : 'Farmer / Agriculture Cultivator'}</option>
                <option value="Daily Wage Laborer">{isTelugu ? 'రోజువారీ కూలీ / శ్రామికుడు' : 'Daily Wage Manual Laborer'}</option>
                <option value="Self-Employed">{isTelugu ? 'స్వయం ఉపాధి / చేతివృత్తులు / వ్యాపారి' : 'Self-Employed / Artisan / Shopkeeper'}</option>
                <option value="Private Employee">{isTelugu ? 'ప్రైవేట్ ఉద్యోగి' : 'Private Sector Employee'}</option>
                <option value="Government Employee">{isTelugu ? 'ప్రభుత్వ ఉద్యోగి' : 'Government Employee'}</option>
                <option value="Student">{isTelugu ? 'విద్యార్థి' : 'Student (Post-Secondary)'}</option>
                <option value="Homemaker">{isTelugu ? 'గృహిణి' : 'Homemaker'}</option>`,
  `<option value="Farmer">{isTelugu ? 'రైతు / వ్యవసాయ సాగుదారు' : isHindi ? 'किसान / कृषि काश्तकार' : 'Farmer / Agriculture Cultivator'}</option>
                <option value="Daily Wage Laborer">{isTelugu ? 'రోజువారీ కూలీ / శ్రామికుడు' : isHindi ? 'दिहाड़ी मजदूर / श्रमिक' : 'Daily Wage Manual Laborer'}</option>
                <option value="Self-Employed">{isTelugu ? 'స్వయం ఉపాధి / చేతివృత్తులు / వ్యాపారి' : isHindi ? 'स्वरोजगार / कारीगर / दुकानदार' : 'Self-Employed / Artisan / Shopkeeper'}</option>
                <option value="Private Employee">{isTelugu ? 'ప్రైవేట్ ఉద్యోగి' : isHindi ? 'निजी क्षेत्र कर्मचारी' : 'Private Sector Employee'}</option>
                <option value="Government Employee">{isTelugu ? 'ప్రభుత్వ ఉద్యోగి' : isHindi ? 'सरकारी कर्मचारी' : 'Government Employee'}</option>
                <option value="Student">{isTelugu ? 'విద్యార్థి' : isHindi ? 'विद्यार्थी / छात्र' : 'Student (Post-Secondary)'}</option>
                <option value="Homemaker">{isTelugu ? 'గృహిణి' : isHindi ? 'गृहिणी' : 'Homemaker'}</option>`
);

// Education options
profileCode = profileCode.replace(
  `<option value="Primary (Class 1-5)">{isTelugu ? 'ప్రాథమిక (1-5 తరగతులు)' : 'Primary (Class 1-5)'}</option>
                <option value="Secondary (Class 10)">{isTelugu ? 'ద్వితీయ (10వ తరగతి - ఎస్‌ఎస్‌సీ)' : 'Secondary (Class 10 - SSC)'}</option>
                <option value="Higher Secondary (10+2)">{isTelugu ? 'హైయర్ సెకండరీ (ఇంటర్మీడియట్)' : 'Higher Secondary (Intermediate)'}</option>
                <option value="Diploma / Polytechnic">{isTelugu ? 'డిప్లొమా / పాలిటెక్నిక్' : 'Diploma / Polytechnic'}</option>
                <option value="Graduate (Degree)">{isTelugu ? 'గ్రాడ్యుయేట్ (డిగ్రీ)' : 'Graduate (Degree)'}</option>
                <option value="Post Graduate">{isTelugu ? 'పోస్ట్ గ్రాడ్యుయేట్ / వృత్తివిద్యా' : 'Post Graduate / Professional'}</option>`,
  `<option value="Primary (Class 1-5)">{isTelugu ? 'ప్రాథమిక (1-5 తరగతులు)' : isHindi ? 'प्राथमिक (कक्षा 1-5)' : 'Primary (Class 1-5)'}</option>
                <option value="Secondary (Class 10)">{isTelugu ? 'ద్వితీయ (10వ తరగతి - ఎస్‌ఎస్‌సీ)' : isHindi ? 'माध्यमिक (कक्षा 10 - मैट्रिक)' : 'Secondary (Class 10 - SSC)'}</option>
                <option value="Higher Secondary (10+2)">{isTelugu ? 'హైయర్ సెకండరీ (ఇంటర్మీడియట్)' : isHindi ? 'उच्च माध्यमिक (10+2 / इंटरमीडिएट)' : 'Higher Secondary (Intermediate)'}</option>
                <option value="Diploma / Polytechnic">{isTelugu ? 'డిప్లొమా / పాలిటెక్నిక్' : isHindi ? 'डिप्लोमा / पॉलिटेक्निक' : 'Diploma / Polytechnic'}</option>
                <option value="Graduate (Degree)">{isTelugu ? 'గ్రాడ్యుయేట్ (డిగ్రీ)' : isHindi ? 'स्नातक (डिग्री)' : 'Graduate (Degree)'}</option>
                <option value="Post Graduate">{isTelugu ? 'పోస్ట్ గ్రాడ్యుయేట్ / వృత్తివిద్యా' : isHindi ? 'स्नातकोत्तर / व्यावसायिक' : 'Post Graduate / Professional'}</option>`
);

// Caste Category options
profileCode = profileCode.replace(
  `<option value="General">{isTelugu ? 'జనరల్ / అన్‌రిజర్వ్‌డ్ (ఓసీ)' : 'General / Unreserved (UR)'}</option>
                <option value="BC">{isTelugu ? 'వెనుకబడిన తరగతులు (బీసీ)' : 'Backward Classes (BC)'}</option>
                <option value="SC">{isTelugu ? 'షెడ్యూల్డ్ కులాలు (ఎస్సీ)' : 'Scheduled Castes (SC)'}</option>
                <option value="ST">{isTelugu ? 'షెడ్యూల్డ్ తెగలు (ఎస్టీ)' : 'Scheduled Tribes (ST)'}</option>
                <option value="EWS">{isTelugu ? 'ఆర్థికంగా బలహీన వర్గాలు (ఈడబ్ల్యూఎస్)' : 'Economically Weaker Section (EWS)'}</option>
                <option value="Minority">{isTelugu ? 'మత మైనారిటీ' : 'Religious Minority'}</option>`,
  `<option value="General">{isTelugu ? 'జనరల్ / అన్‌రిజర్వ్‌డ్ (ఓసీ)' : isHindi ? 'सामान्य (General / UR)' : 'General / Unreserved (UR)'}</option>
                <option value="BC">{isTelugu ? 'వెనుకబడిన తరగతులు (బీసీ)' : isHindi ? 'अन्य पिछड़ा वर्ग (OBC / BC)' : 'Backward Classes (BC)'}</option>
                <option value="SC">{isTelugu ? 'షెడ్యూల్డ్ కులాలు (ఎస్సీ)' : isHindi ? 'अनुसूचित जाति (SC)' : 'Scheduled Castes (SC)'}</option>
                <option value="ST">{isTelugu ? 'షెడ్యూల్డ్ తెగలు (ఎస్టీ)' : isHindi ? 'अनुसूचित जनजाति (ST)' : 'Scheduled Tribes (ST)'}</option>
                <option value="EWS">{isTelugu ? 'ఆర్థికంగా బలహీన వర్గాలు (ఈడబ్ల్యూఎస్)' : isHindi ? 'आर्थिक रूप से कमजोर वर्ग (EWS)' : 'Economically Weaker Section (EWS)'}</option>
                <option value="Minority">{isTelugu ? 'మత మైనారిటీ' : isHindi ? 'धार्मिक अल्पसंख्यक' : 'Religious Minority'}</option>`
);

// Ration Card options
profileCode = profileCode.replace(
  `<option value="White">{isTelugu ? 'తెల్ల ఆహార భద్రతా కార్డు (బీపీఎల్)' : 'White Food Security Card (BPL)'}</option>
                <option value="Pink">{isTelugu ? 'పింక్ కార్డు (ఏపీఎల్)' : 'Pink Card (Above Poverty Line - APL)'}</option>
                <option value="None">{isTelugu ? 'రేషన్ కార్డు లేదు' : 'No Ration Card'}</option>`,
  `<option value="White">{isTelugu ? 'తెల్ల ఆహార భద్రతా కార్డు (బీపీఎల్)' : isHindi ? 'सफेद राशन कार्ड (BPL)' : 'White Food Security Card (BPL)'}</option>
                <option value="Pink">{isTelugu ? 'పింక్ కార్డు (ఏపీఎల్)' : isHindi ? 'गुलाबी राशन कार्ड (APL)' : 'Pink Card (Above Poverty Line - APL)'}</option>
                <option value="None">{isTelugu ? 'రేషన్ కార్డు లేదు' : isHindi ? 'राशन कार्ड नहीं है' : 'No Ration Card'}</option>`
);

fs.writeFileSync(profilePath, profileCode, 'utf8');
console.log('Updated ProfilePage.tsx');
