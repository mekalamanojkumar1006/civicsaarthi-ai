const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'src', 'pages', 'ProfilePage.tsx');
let code = fs.readFileSync(filePath, 'utf8');

// Banner 1: Supabase Connected
code = code.replace(
  `                {isTelugu ? (
                  <><strong>సుపాబేస్ డేటాబేస్ అనుసంధానించబడింది:</strong> <code className="font-mono bg-emerald-100 px-1.5 py-0.5 rounded text-emerald-900">{user.email}</code> గా ప్రామాణీకరించబడింది. రో లెవల్ సెక్యూరిటీ క్రింద పోస్ట్‌గ్రేస్‌క్యూఎల్ <code className="font-mono bg-emerald-100 px-1.5 py-0.5 rounded text-emerald-900">profiles</code> పట్టికతో పౌర వివరాలు సమకాలీకరించబడ్డాయి.</>
                ) : (
                  <><strong>Supabase Database Connected:</strong> Authenticated as <code className="font-mono bg-emerald-100 px-1.5 py-0.5 rounded text-emerald-900">{user.email}</code>. Demographics verified and synced with PostgreSQL <code className="font-mono bg-emerald-100 px-1.5 py-0.5 rounded text-emerald-900">profiles</code> table under Row Level Security.</>
                )}`,
  `                {isTelugu ? (
                  <><strong>సుపాబేస్ డేటాబేస్ అనుసంధానించబడింది:</strong> <code className="font-mono bg-emerald-100 px-1.5 py-0.5 rounded text-emerald-900">{user.email}</code> గా ప్రామాణీకరించబడింది. రో లెవల్ సెక్యూరిటీ క్రింద పోస్ట్‌గ్రేస్‌క్యూఎల్ <code className="font-mono bg-emerald-100 px-1.5 py-0.5 rounded text-emerald-900">profiles</code> పట్టికతో పౌర వివరాలు సమకాలీకరించబడ్డాయి.</>
                ) : isHindi ? (
                  <><strong>सुपाबेस डेटाबेस कनेक्टेड:</strong> <code className="font-mono bg-emerald-100 px-1.5 py-0.5 rounded text-emerald-900">{user.email}</code> के रूप में प्रमाणित। रो लेवल सिक्योरिटी (RLS) के तहत पोस्टग्रेएसक्यूएल <code className="font-mono bg-emerald-100 px-1.5 py-0.5 rounded text-emerald-900">profiles</code> तालिका के साथ नागरिक विवरण समन्वयित।</>
                ) : (
                  <><strong>Supabase Database Connected:</strong> Authenticated as <code className="font-mono bg-emerald-100 px-1.5 py-0.5 rounded text-emerald-900">{user.email}</code>. Demographics verified and synced with PostgreSQL <code className="font-mono bg-emerald-100 px-1.5 py-0.5 rounded text-emerald-900">profiles</code> table under Row Level Security.</>
                )}`
);

code = code.replace(
  "<Badge variant=\"success\" className=\"shrink-0\">{isTelugu ? 'ప్రత్యక్ష డేటాబేస్ సమకాలీకరణ' : 'Live Database Synced'}</Badge>",
  "<Badge variant=\"success\" className=\"shrink-0\">{isTelugu ? 'ప్రత్యక్ష డేటాబేస్ సమకాలీకరణ' : isHindi ? 'लाइव डेटाबेस सिंक' : 'Live Database Synced'}</Badge>"
);

// Banner 2: Schema pending
code = code.replace(
  `                {isTelugu ? (
                  <><strong>సుపాబేస్ ఉనికి గుర్తించబడింది:</strong> <code className="font-mono bg-amber-100 px-1.5 py-0.5 rounded text-amber-900">{user.email}</code> గా లాగిన్ అయ్యారు. రిమోట్ టేబుల్ ఇంకా సిద్ధం కాలేదు. డేటా ప్రస్తుతం <strong>localStorage</strong> లో భద్రపరచబడుతుంది.</>
                ) : (
                  <><strong>Supabase Instance Reached (Schema Pending):</strong> Authenticated as <code className="font-mono bg-amber-100 px-1.5 py-0.5 rounded text-amber-900">{user.email}</code>. Remote table <code className="font-mono bg-amber-100 px-1 py-0.5 rounded">public.profiles</code> is not yet created in PostgreSQL. Data is currently persisted in <strong>localStorage</strong>. Execute database migrations in Supabase SQL Editor to enable PostgreSQL RLS persistence.</>
                )}`,
  `                {isTelugu ? (
                  <><strong>సుపాబేస్ ఉనికి గుర్తించబడింది:</strong> <code className="font-mono bg-amber-100 px-1.5 py-0.5 rounded text-amber-900">{user.email}</code> గా లాగిన్ అయ్యారు. రిమోట్ టేబుల్ ఇంకా సిద్ధం కాలేదు. డేటా ప్రస్తుతం <strong>localStorage</strong> లో భద్రపరచబడుతుంది.</>
                ) : isHindi ? (
                  <><strong>सुपाबेस इंस्टेंस सक्रिय (स्कीमा लंबित):</strong> <code className="font-mono bg-amber-100 px-1.5 py-0.5 rounded text-amber-900">{user.email}</code> के रूप में लॉगिन। डेटा वर्तमान में <strong>localStorage</strong> में सुरक्षित है।</>
                ) : (
                  <><strong>Supabase Instance Reached (Schema Pending):</strong> Authenticated as <code className="font-mono bg-amber-100 px-1.5 py-0.5 rounded text-amber-900">{user.email}</code>. Remote table <code className="font-mono bg-amber-100 px-1 py-0.5 rounded">public.profiles</code> is not yet created in PostgreSQL. Data is currently persisted in <strong>localStorage</strong>. Execute database migrations in Supabase SQL Editor to enable PostgreSQL RLS persistence.</>
                )}`
);

code = code.replace(
  "<span className=\"badge badge-warning text-[10px] shrink-0\">{isTelugu ? 'స్థానిక నిల్వ క్రియాశీలం' : 'Local Storage Active'}</span>",
  "<span className=\"badge badge-warning text-[10px] shrink-0\">{isTelugu ? 'స్థానిక నిల్వ క్రియాశీలం' : isHindi ? 'लोकल स्टोरेज सक्रिय' : 'Local Storage Active'}</span>"
);

// Banner 3: Local Demo
code = code.replace(
  `              {isTelugu ? (
                <><strong>స్థానిక డెమో వాతావరణం:</strong> ప్రొఫైల్ మార్పులు స్థానిక బ్రౌజర్ నిల్వలో సురక్షితంగా సేవ్ చేయబడతాయి.</>
              ) : (
                <><strong>Local Demonstration Environment:</strong> Supabase credentials are pending in <code className="font-mono bg-blue-100 px-1.5 py-0.5 rounded text-blue-900">.env.local</code>. Profile edits are stored safely in local browser storage.</>
              )}`,
  `              {isTelugu ? (
                <><strong>స్థానిక డెమో వాతావరణం:</strong> ప్రొఫైల్ మార్పులు స్థానిక బ్రౌజర్ నిల్వలో సురక్షితంగా సేవ్ చేయబడతాయి.</>
              ) : isHindi ? (
                <><strong>स्थानीय डेमो वातावरण:</strong> प्रोफ़ाइल परिवर्तन स्थानीय ब्राउज़र स्टोरेज में सुरक्षित रूप से सहेजे जाते हैं।</>
              ) : (
                <><strong>Local Demonstration Environment:</strong> Supabase credentials are pending in <code className="font-mono bg-blue-100 px-1.5 py-0.5 rounded text-blue-900">.env.local</code>. Profile edits are stored safely in local browser storage.</>
              )}`
);

// Demo Profile active
code = code.replace(
  `              {isTelugu ? (
                <><strong>నమూనా ప్రొఫైల్ క్రియాశీలంగా ఉంది:</strong> ఈ ప్రొఫైల్ పథకాల అర్హతను పరీక్షించడానికి నమూనా పౌర విలువలను కలిగి ఉంది. ఏ నిజమైన ప్రభుత్వ ఖాతా లింక్ చేయబడలేదు.</>
              ) : (
                <><strong>Demonstration Profile Active:</strong> This profile contains sample citizen values for testing simulated scheme eligibility. No real government account or database is linked.</>
              )}`,
  `              {isTelugu ? (
                <><strong>నమూనా ప్రొఫైల్ క్రియాశీలంగా ఉంది:</strong> ఈ ప్రొఫైల్ పథకాల అర్హతను పరీక్షించడానికి నమూనా పౌర విలువలను కలిగి ఉంది. ఏ నిజమైన ప్రభుత్వ ఖాతా లింక్ చేయబడలేదు.</>
              ) : isHindi ? (
                <><strong>डेमो प्रोफ़ाइल सक्रिय:</strong> इस प्रोफ़ाइल में पात्रता परीक्षण के लिए नमूना नागरिक मान शामिल हैं। कोई वास्तविक सरकारी खाता लिंक नहीं है।</>
              ) : (
                <><strong>Demonstration Profile Active:</strong> This profile contains sample citizen values for testing simulated scheme eligibility. No real government account or database is linked.</>
              )}`
);

code = code.replace(
  "{isTelugu ? 'నమూనా డేటాను తొలగించండి' : 'Clear Sample Data'}",
  "{isTelugu ? 'నమూనా డేటాను తొలగించండి' : isHindi ? 'नमूना डेटा हटाएं' : 'Clear Sample Data'}"
);

code = code.replace(
  `{profileCompletionPercentage === 100
                  ? (isTelugu ? 'పూర్తిగా ధృవీకరించబడింది' : 'Fully Verified')
                  : (isTelugu ? 'మంచి పురోగతి' : 'Good Progress')}`,
  `{profileCompletionPercentage === 100
                  ? (isTelugu ? 'పూర్తిగా ధృవీకరించబడింది' : isHindi ? 'पूर्णतः सत्यापित' : 'Fully Verified')
                  : (isTelugu ? 'మంచి పురోగతి' : isHindi ? 'उत्तम प्रगति' : 'Good Progress')}`
);

// Form Fields
code = code.replace(
  "{isTelugu ? 'పూర్తి పేరు (ఆధార్ ప్రకారం)' : 'Full Name (as in Aadhaar)'}",
  "{isTelugu ? 'పూర్తి పేరు (ఆధార్ ప్రకారం)' : isHindi ? 'पूरा नाम (आधार के अनुसार)' : 'Full Name (as in Aadhaar)'}"
);

code = code.replace(
  "{isTelugu ? 'ఈమెయిల్ చిరునామా' : 'Email Address'}",
  "{isTelugu ? 'ఈమెయిల్ చిరునామా' : isHindi ? 'ईमेल पता' : 'Email Address'}"
);

code = code.replace(
  "{isTelugu ? 'మొబైల్ నంబర్ (ఎస్ఎంఎస్ & ఓటీపీ కోసం)' : 'Mobile Number (for SMS & OTP)'}",
  "{isTelugu ? 'మొబైల్ నంబర్ (ఎస్ఎంఎస్ & ఓటీపీ కోసం)' : isHindi ? 'मोबाइल नंबर (एसएमएस और ओटीपी के लिए)' : 'Mobile Number (for SMS & OTP)'}"
);

code = code.replace(
  "{isTelugu ? 'వయస్సు' : 'Age'}",
  "{isTelugu ? 'వయస్సు' : isHindi ? 'आयु' : 'Age'}"
);

code = code.replace(
  "{isTelugu ? 'లింగం' : 'Gender'}",
  "{isTelugu ? 'లింగం' : isHindi ? 'लिंग' : 'Gender'}"
);

code = code.replace(
  `<option value="Male">{isTelugu ? 'పురుషుడు (Male)' : 'Male'}</option>
                <option value="Female">{isTelugu ? 'స్త్రీ (Female)' : 'Female'}</option>
                <option value="Other">{isTelugu ? 'ఇతర (Other)' : 'Other'}</option>`,
  `<option value="Male">{isTelugu ? 'పురుషుడు (Male)' : isHindi ? 'पुरुष (Male)' : 'Male'}</option>
                <option value="Female">{isTelugu ? 'స్త్రీ (Female)' : isHindi ? 'महिला (Female)' : 'Female'}</option>
                <option value="Other">{isTelugu ? 'ఇతర (Other)' : isHindi ? 'अन्य (Other)' : 'Other'}</option>`
);

code = code.replace(
  "{isTelugu ? 'ప్రాధాన్యత ఇంటర్‌ఫేస్ భాష' : 'Preferred Interface Language'}",
  "{isTelugu ? 'ప్రాధాన్యత ఇంటర్‌ఫేస్ భాష' : isHindi ? 'पसंदीदा इंटरफ़ेस भाषा' : 'Preferred Interface Language'}"
);

code = code.replace(
  "{isTelugu ? 'నివాస రాష్ట్రం' : 'State of Residence'}",
  "{isTelugu ? 'నివాస రాష్ట్రం' : isHindi ? 'निवास का राज्य' : 'State of Residence'}"
);

code = code.replace(
  `<option value="Telangana">{isTelugu ? 'తెలంగాణ (Telangana)' : 'Telangana'}</option>
                <option value="Andhra Pradesh">{isTelugu ? 'ఆంధ్రప్రదేశ్ (Andhra Pradesh)' : 'Andhra Pradesh'}</option>
                <option value="Karnataka">{isTelugu ? 'కర్ణాటక (Karnataka)' : 'Karnataka'}</option>
                <option value="Maharashtra">{isTelugu ? 'మహారాష్ట్ర (Maharashtra)' : 'Maharashtra'}</option>
                <option value="Tamil Nadu">{isTelugu ? 'తమిళనాడు (Tamil Nadu)' : 'Tamil Nadu'}</option>
                <option value="Delhi">{isTelugu ? 'ఢిల్లీ (Delhi)' : 'Delhi'}</option>`,
  `<option value="Telangana">{isTelugu ? 'తెలంగాణ (Telangana)' : isHindi ? 'तेलंगाना (Telangana)' : 'Telangana'}</option>
                <option value="Andhra Pradesh">{isTelugu ? 'ఆంధ్రప్రదేశ్ (Andhra Pradesh)' : isHindi ? 'आंध्र प्रदेश (Andhra Pradesh)' : 'Andhra Pradesh'}</option>
                <option value="Karnataka">{isTelugu ? 'కర్ణాటక (Karnataka)' : isHindi ? 'कर्नाटक (Karnataka)' : 'Karnataka'}</option>
                <option value="Maharashtra">{isTelugu ? 'మహారాష్ట్ర (Maharashtra)' : isHindi ? 'महाराष्ट्र (Maharashtra)' : 'Maharashtra'}</option>
                <option value="Tamil Nadu">{isTelugu ? 'తమిళనాడు (Tamil Nadu)' : isHindi ? 'तमिलनाडु (Tamil Nadu)' : 'Tamil Nadu'}</option>
                <option value="Delhi">{isTelugu ? 'ఢిల్లీ (Delhi)' : isHindi ? 'दिल्ली (Delhi)' : 'Delhi'}</option>`
);

code = code.replace(
  "{isTelugu ? 'జిల్లా / మండలం' : 'District / Mandal'}",
  "{isTelugu ? 'జిల్లా / మండలం' : isHindi ? 'ज़िला / मंडल' : 'District / Mandal'}"
);

code = code.replace(
  "{isTelugu ? 'ప్రధాన వృత్తి' : 'Primary Occupation'}",
  "{isTelugu ? 'ప్రధాన వృత్తి' : isHindi ? 'मुख्य व्यवसाय' : 'Primary Occupation'}"
);

code = code.replace(
  "{isTelugu ? 'పూర్తయిన అత్యున్నత విద్య' : 'Highest Education Completed'}",
  "{isTelugu ? 'పూర్తయిన అత్యున్నత విద్య' : isHindi ? 'उच्चतम पूर्ण शिक्षा' : 'Highest Education Completed'}"
);

code = code.replace(
  "{isTelugu ? 'సామాజిక / కుల వర్గం' : 'Social / Caste Category'}",
  "{isTelugu ? 'సామాజిక / కుల వర్గం' : isHindi ? 'सामाजिक / जाति वर्ग' : 'Social / Caste Category'}"
);

code = code.replace(
  "{isTelugu ? 'వార్షిక కుటుంబ ఆదాయం (₹లలో)' : 'Annual Family Income (in ₹)'}",
  "{isTelugu ? 'వార్షిక కుటుంబ ఆదాయం (₹లలో)' : isHindi ? 'वार्षिक पारिवारिक आय (₹ में)' : 'Annual Family Income (in ₹)'}"
);

code = code.replace(
  "{isTelugu ? 'సాగు భూమి (ఎకరాలలో)' : 'Cultivable Landholding (Acres)'}",
  "{isTelugu ? 'సాగు భూమి (ఎకరాలలో)' : isHindi ? 'कृषि भूमि (एकड़ में)' : 'Cultivable Landholding (Acres)'}"
);

code = code.replace(
  "{isTelugu ? 'రేషన్ కార్డు వర్గం' : 'Ration Card Category'}",
  "{isTelugu ? 'రేషన్ కార్డు వర్గం' : isHindi ? 'राशन कार्ड श्रेणी' : 'Ration Card Category'}"
);

fs.writeFileSync(filePath, code, 'utf8');
console.log('Successfully updated all remaining strings in ProfilePage.tsx');
