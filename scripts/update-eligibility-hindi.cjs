const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'src', 'pages', 'EligibilityPage.tsx');
let code = fs.readFileSync(filePath, 'utf8');

// 1. Update useLanguage hook
code = code.replace(
  "const { t, isTelugu, fontClass } = useLanguage()",
  "const { t, isTelugu, isHindi, fontClass } = useLanguage()"
);

// 2. Update evaluateEligibility() strings
// Age check
code = code.replace(
  `      notMet.push(
        isTelugu
          ? \`వయస్సు నిబంధన: కనీస వయస్సు \${scheme.eligibility.minAge} సంవత్సరాలు ఉండాలి (మీ వయస్సు: \${formData.age} సం.).\`
          : \`Minimum age required is \${scheme.eligibility.minAge} years (self-reported: \${formData.age} yrs).\`
      )`,
  `      notMet.push(
        isTelugu
          ? \`వయస్సు నిబంధన: కనీస వయస్సు \${scheme.eligibility.minAge} సంవత్సరాలు ఉండాలి (మీ వయస్సు: \${formData.age} సం.).\`
          : isHindi
          ? \`आयु मानदंड: न्यूनतम आयु \${scheme.eligibility.minAge} वर्ष आवश्यक है (आपकी दर्ज आयु: \${formData.age} वर्ष)।\`
          : \`Minimum age required is \${scheme.eligibility.minAge} years (self-reported: \${formData.age} yrs).\`
      )`
);

code = code.replace(
  `      notMet.push(
        isTelugu
          ? \`వయస్సు నిబంధన: గరిష్ట వయస్సు \${scheme.eligibility.maxAge} సంవత్సరాలు దాటకూడదు (మీ వయస్సు: \${formData.age} సం.).\`
          : \`Maximum age ceiling is \${scheme.eligibility.maxAge} years (self-reported: \${formData.age} yrs).\`
      )`,
  `      notMet.push(
        isTelugu
          ? \`వయస్సు నిబంధన: గరిష్ట వయస్సు \${scheme.eligibility.maxAge} సంవత్సరాలు దాటకూడదు (మీ వయస్సు: \${formData.age} సం.).\`
          : isHindi
          ? \`आयु मानदंड: अधिकतम आयु सीमा \${scheme.eligibility.maxAge} वर्ष है (आपकी दर्ज आयु: \${formData.age} वर्ष)।\`
          : \`Maximum age ceiling is \${scheme.eligibility.maxAge} years (self-reported: \${formData.age} yrs).\`
      )`
);

code = code.replace(
  `      met.push(
        isTelugu
          ? \`వయస్సు అర్హత పరిధిలో ఉంది (\${formData.age} సంవత్సరాలు).\`
          : \`Self-reported age (\${formData.age} years) satisfies age criteria.\`
      )`,
  `      met.push(
        isTelugu
          ? \`వయస్సు అర్హత పరిధిలో ఉంది (\${formData.age} సంవత్సరాలు).\`
          : isHindi
          ? \`दर्ज आयु (\${formData.age} वर्ष) योजना के आयु मानदंड को पूरा करती है।\`
          : \`Self-reported age (\${formData.age} years) satisfies age criteria.\`
      )`
);

// Gender check
code = code.replace(
  `        notMet.push(
          isTelugu
            ? \`ఈ పథకం కేవలం \${scheme.eligibility.gender === 'Female' ? 'మహిళలకు' : 'పురుషులకు'} మాత్రమే వర్తిస్తుంది.\`
            : \`Designated exclusively for \${scheme.eligibility.gender} applicants (self-reported: \${formData.gender}).\`
        )`,
  `        notMet.push(
          isTelugu
            ? \`ఈ పథకం కేవలం \${scheme.eligibility.gender === 'Female' ? 'మహిళలకు' : 'పురుషులకు'} మాత్రమే వర్తిస్తుంది.\`
            : isHindi
            ? \`यह योजना विशेष रूप से \${scheme.eligibility.gender === 'Female' ? 'महिला' : 'पुरुष'} आवेदकों के लिए है (दर्ज: \${formData.gender})।\`
            : \`Designated exclusively for \${scheme.eligibility.gender} applicants (self-reported: \${formData.gender}).\`
        )`
);

code = code.replace(
  `        met.push(
          isTelugu
            ? \`లింగ నిబంధన సరిపోయింది (\${scheme.eligibility.gender === 'Female' ? 'మహిళ' : 'పురుషుడు'}).\`
            : \`Target gender condition satisfied (\${formData.gender}).\`
        )`,
  `        met.push(
          isTelugu
            ? \`లింగ నిబంధన సరిపోయింది (\${scheme.eligibility.gender === 'Female' ? 'మహిళ' : 'పురుషుడు'}).\`
            : isHindi
            ? \`लक्षित लिंग मानदंड संतुष्ट है (\${formData.gender === 'Female' ? 'महिला' : formData.gender === 'Male' ? 'पुरुष' : formData.gender})।\`
            : \`Target gender condition satisfied (\${formData.gender}).\`
        )`
);

// Income check
code = code.replace(
  `        notMet.push(
          isTelugu
            ? \`వార్షిక ఆదాయం ₹\${scheme.eligibility.maxAnnualIncome.toLocaleString('en-IN')} పరిమితి కంటే ఎక్కువ (మీ ఆదాయం: ₹\${formData.annualIncome.toLocaleString('en-IN')}).\`
            : \`Income exceeds scheme threshold of ₹\${scheme.eligibility.maxAnnualIncome.toLocaleString('en-IN')} (self-reported: ₹\${formData.annualIncome.toLocaleString('en-IN')}).\`
        )`,
  `        notMet.push(
          isTelugu
            ? \`వార్షిక ఆదాయం ₹\${scheme.eligibility.maxAnnualIncome.toLocaleString('en-IN')} పరిమితి కంటే ఎక్కువ (మీ ఆదాయం: ₹\${formData.annualIncome.toLocaleString('en-IN')}).\`
            : isHindi
            ? \`वार्षिक आय ₹\${scheme.eligibility.maxAnnualIncome.toLocaleString('en-IN')} की सीमा से अधिक है (आपकी आय: ₹\${formData.annualIncome.toLocaleString('en-IN')})।\`
            : \`Income exceeds scheme threshold of ₹\${scheme.eligibility.maxAnnualIncome.toLocaleString('en-IN')} (self-reported: ₹\${formData.annualIncome.toLocaleString('en-IN')}).\`
        )`
);

code = code.replace(
  `        met.push(
          isTelugu
            ? \`కుటుంబ వార్షిక ఆదాయం (₹\${formData.annualIncome.toLocaleString('en-IN')}) అనుమతించిన పరిమితిలో ఉంది.\`
            : \`Self-reported annual income (₹\${formData.annualIncome.toLocaleString('en-IN')}) is within the scheme threshold.\`
        )`,
  `        met.push(
          isTelugu
            ? \`కుటుంబ వార్షిక ఆదాయం (₹\${formData.annualIncome.toLocaleString('en-IN')}) అనుమతించిన పరిమితిలో ఉంది.\`
            : isHindi
            ? \`परिवार की वार्षिक आय (₹\${formData.annualIncome.toLocaleString('en-IN')}) योजना की निर्धारित सीमा के भीतर है।\`
            : \`Self-reported annual income (₹\${formData.annualIncome.toLocaleString('en-IN')}) is within the scheme threshold.\`
        )`
);

// Domicile / State
code = code.replace(
  `        notMet.push(
          isTelugu
            ? \`నివాస అర్హత: ఈ పథకం \${scheme.eligibility.residenceRequired} నివాసితులకు మాత్రమే (మీ నివాసం: \${formData.state}).\`
            : \`Scheme guidelines require state residency in \${scheme.eligibility.residenceRequired} (self-reported: \${formData.state}).\`
        )`,
  `        notMet.push(
          isTelugu
            ? \`నివాస అర్హత: ఈ పథకం \${scheme.eligibility.residenceRequired} నివాసితులకు మాత్రమే (మీ నివాసం: \${formData.state}).\`
            : isHindi
            ? \`निवास मानदंड: यह योजना केवल \${scheme.eligibility.residenceRequired} के निवासियों के लिए है (दर्ज: \${formData.state})।\`
            : \`Scheme guidelines require state residency in \${scheme.eligibility.residenceRequired} (self-reported: \${formData.state}).\`
        )`
);

code = code.replace(
  `        met.push(
          isTelugu
            ? \`రాష్ట్ర నివాస అర్హత సరిపోయింది (\${scheme.eligibility.residenceRequired}).\`
            : \`Self-reported state domicile matches \${scheme.eligibility.residenceRequired}.\`
        )`,
  `        met.push(
          isTelugu
            ? \`రాష్ట్ర నివాస అర్హత సరిపోయింది (\${scheme.eligibility.residenceRequired}).\`
            : isHindi
            ? \`राज्य निवास मानदंड संतुष्ट है (\${scheme.eligibility.residenceRequired})।\`
            : \`Self-reported state domicile matches \${scheme.eligibility.residenceRequired}.\`
        )`
);

// PM Kisan
code = code.replace(
  `        notMet.push(
          isTelugu
            ? 'ప్రభుత్వ ఉద్యోగి లేదా ఆదాయపు పన్ను చెల్లింపుదారుల మినహాయింపు వర్తిస్తుంది.'
            : 'Self-reported: Government employment / income tax paying exclusion reported.'
        )`,
  `        notMet.push(
          isTelugu
            ? 'ప్రభుత్వ ఉద్యోగి లేదా ఆదాయపు పన్ను చెల్లింపుదారుల మినహాయింపు వర్తిస్తుంది.'
            : isHindi
            ? 'सरकारी कर्मचारी या आयकर दाता अपवर्जन लागू होता है।'
            : 'Self-reported: Government employment / income tax paying exclusion reported.'
        )`
);

code = code.replace(
  `        met.push(
          isTelugu
            ? 'ప్రభుత్వ ఉద్యోగి మినహాయింపు వర్తించదు.'
            : 'Self-reported: No government employee exclusion declared.'
        )`,
  `        met.push(
          isTelugu
            ? 'ప్రభుత్వ ఉద్యోగి మినహాయింపు వర్తించదు.'
            : isHindi
            ? 'सरकारी कर्मचारी अपवर्जन लागू नहीं होता।'
            : 'Self-reported: No government employee exclusion declared.'
        )`
);

code = code.replace(
  `        notMet.push(
          isTelugu
            ? 'రైతు పేరిట రిజిస్టర్డ్ సాగు భూమి పట్టా లేదు.'
            : 'Self-reported: Does not hold cultivable agricultural land title.'
        )`,
  `        notMet.push(
          isTelugu
            ? 'రైతు పేరిట రిజిస్టర్డ్ సాగు భూమి పట్టా లేదు.'
            : isHindi
            ? 'किसान के नाम पर पंजीकृत कृषि भूमि का पट्टा नहीं है।'
            : 'Self-reported: Does not hold cultivable agricultural land title.'
        )`
);

code = code.replace(
  `        met.push(
          isTelugu
            ? \`సాగు భూమి పట్టా ఉంది (\${formData.landholdingAcres} ఎకరాలు).\`
            : \`Self-reported: Owns cultivable agricultural land (\${formData.landholdingAcres} acres indicated).\`
        )`,
  `        met.push(
          isTelugu
            ? \`సాగు భూమి పట్టా ఉంది (\${formData.landholdingAcres} ఎకరాలు).\`
            : isHindi
            ? \`कृषि भूमि का पट्टा उपलब्ध है (\${formData.landholdingAcres} एकड़ दर्ज)।\`
            : \`Self-reported: Owns cultivable agricultural land (\${formData.landholdingAcres} acres indicated).\`
        )`
);

// PM Surya Ghar
code = code.replace(
  `        notMet.push(
          isTelugu
            ? 'సోలార్ ప్యానెల్స్ కొరకు తగిన నీడ లేని పైకప్పు స్థలం అందుబాటులో లేదు.'
            : 'Self-reported: Adequate unshaded rooftop space not available.'
        )`,
  `        notMet.push(
          isTelugu
            ? 'సోలార్ ప్యానెల్స్ కొరకు తగిన నీడ లేని పైకప్పు స్థలం అందుబాటులో లేదు.'
            : isHindi
            ? 'सोलर पैनलों के लिए उपयुक्त छाया-मुक्त छत उपलब्ध नहीं है।'
            : 'Self-reported: Adequate unshaded rooftop space not available.'
        )`
);

code = code.replace(
  `        met.push(
          isTelugu
            ? 'సోలార్ ప్యానెల్స్ కొరకు అనువైన పైకప్పు స్థలం ఉంది.'
            : 'Self-reported: Has suitable unshaded rooftop space.'
        )`,
  `        met.push(
          isTelugu
            ? 'సోలార్ ప్యానెల్స్ కొరకు అనువైన పైకప్పు స్థలం ఉంది.'
            : isHindi
            ? 'सोलर पैनलों के लिए उपयुक्त छाया-मुक्त छत उपलब्ध है।'
            : 'Self-reported: Has suitable unshaded rooftop space.'
        )`
);

code = code.replace(
  `        notMet.push(
          isTelugu
            ? 'గృహ వినియోగ విద్యుత్ కనెక్షన్ అందుబాటులో లేదు.'
            : 'Self-reported: Active domestic consumer electricity connection not present.'
        )`,
  `        notMet.push(
          isTelugu
            ? 'గృహ వినియోగ విద్యుత్ కనెక్షన్ అందుబాటులో లేదు.'
            : isHindi
            ? 'घरेलू उपभोक्ता बिजली कनेक्शन उपलब्ध नहीं है।'
            : 'Self-reported: Active domestic consumer electricity connection not present.'
        )`
);

code = code.replace(
  `        met.push(
          isTelugu
            ? 'గృహ వినియోగ విద్యుత్ కనెక్షన్ ధ్రువీకరించబడింది.'
            : 'Self-reported: Active domestic consumer electricity connection verified.'
        )`,
  `        met.push(
          isTelugu
            ? 'గృహ వినియోగ విద్యుత్ కనెక్షన్ ధ్రువీకరించబడింది.'
            : isHindi
            ? 'घरेलू उपभोक्ता बिजली कनेक्शन सत्यापित है।'
            : 'Self-reported: Active domestic consumer electricity connection verified.'
        )`
);

// Kalyana Lakshmi
code = code.replace(
  `        notMet.push(
          isTelugu
            ? 'ఈ ఆర్థిక సహాయం పెళ్లి కుమార్తెలకు మాత్రమే వర్తిస్తుంది.'
            : 'Scheme assistance designated exclusively for brides / female applicants.'
        )`,
  `        notMet.push(
          isTelugu
            ? 'ఈ ఆర్థిక సహాయం పెళ్లి కుమార్తెలకు మాత్రమే వర్తిస్తుంది.'
            : isHindi
            ? 'यह योजना केवल वधू/महिला आवेदकों के लिए है।'
            : 'Scheme assistance designated exclusively for brides / female applicants.'
        )`
);

code = code.replace(
  `        warnings.push(
          isTelugu
            ? 'ధ్రువీకరణ అవసరం: జనరల్ వర్గానికి ప్రత్యేక ఆర్థిక నిబంధనల పరిశీలన అవసరం.'
            : 'Verification needed: General category may require special economic criteria verification.'
        )`,
  `        warnings.push(
          isTelugu
            ? 'ధ్రువీకరణ అవసరం: జనరల్ వర్గానికి ప్రత్యేక ఆర్థిక నిబంధనల పరిశీలన అవసరం.'
            : isHindi
            ? 'सत्यापन आवश्यक: सामान्य वर्ग के लिए विशेष आर्थिक मानदंडों का सत्यापन आवश्यक है।'
            : 'Verification needed: General category may require special economic criteria verification.'
        )`
);

code = code.replace(
  `        met.push(
          isTelugu
            ? \`సామాజిక వర్గం (\${formData.category}) లక్షిత వర్గాలలో ఉంది (SC/ST/BC/Minority/EWS).\`
            : \`Self-reported category (\${formData.category}) aligns with targeted welfare groups (SC/ST/BC/Minority/EWS).\`
        )`,
  `        met.push(
          isTelugu
            ? \`సామాజిక వర్గం (\${formData.category}) లక్షిత వర్గాలలో ఉంది (SC/ST/BC/Minority/EWS).\`
            : isHindi
            ? \`सामाजिक वर्ग (\${formData.category}) लक्षित कल्याणकारी समूहों (SC/ST/BC/अल्पसंख्यक/EWS) के अंतर्गत है।\`
            : \`Self-reported category (\${formData.category}) aligns with targeted welfare groups (SC/ST/BC/Minority/EWS).\`
        )`
);

// Post Matric
code = code.replace(
  `        notMet.push(
          isTelugu
            ? 'గుర్తింపు పొందిన పోస్ట్-మెట్రిక్ విద్యా సంస్థలో ప్రవేశం లేదు.'
            : 'Self-reported: Not actively enrolled in post-matric recognized institution.'
        )`,
  `        notMet.push(
          isTelugu
            ? 'గుర్తింపు పొందిన పోస్ట్-మెట్రిక్ విద్యా సంస్థలో ప్రవేశం లేదు.'
            : isHindi
            ? 'मान्यता प्राप्त पोस्ट-मैट्रिक संस्थान में कोई सक्रिय प्रवेश नहीं है।'
            : 'Self-reported: Not actively enrolled in post-matric recognized institution.'
        )`
);

code = code.replace(
  `        met.push(
          isTelugu
            ? 'గుర్తింపు పొందిన పోస్ట్-మెట్రిక్ విద్యా సంస్థలో చదువుతున్నారు.'
            : 'Self-reported: Enrolled in recognized post-10th educational institution.'
        )`,
  `        met.push(
          isTelugu
            ? 'గుర్తింపు పొందిన పోస్ట్-మెట్రిక్ విద్యా సంస్థలో చదువుతున్నారు.'
            : isHindi
            ? 'मान्यता प्राप्त पोस्ट-10वीं शैक्षणिक संस्थान में अध्ययनरत हैं।'
            : 'Self-reported: Enrolled in recognized post-10th educational institution.'
        )`
);

// Sukanya Samriddhi
code = code.replace(
  `        notMet.push(
          isTelugu
            ? 'బాలిక వయస్సు 10 సంవత్సరాల గరిష్ట పరిమితి కంటే ఎక్కువ.'
            : 'Self-reported: Girl child age exceeds the 10-year account opening threshold.'
        )`,
  `        notMet.push(
          isTelugu
            ? 'బాలిక వయస్సు 10 సంవత్సరాల గరిష్ట పరిమితి కంటే ఎక్కువ.'
            : isHindi
            ? 'बालिका की आयु 10 वर्ष की अधिकतम खाता खोलने की सीमा से अधिक है।'
            : 'Self-reported: Girl child age exceeds the 10-year account opening threshold.'
        )`
);

code = code.replace(
  `        met.push(
          isTelugu
            ? 'బాలిక వయస్సు 10 సంవత్సరాల లోపు ఉంది.'
            : 'Self-reported: Girl child is below 10 years of age at account opening.'
        )`,
  `        met.push(
          isTelugu
            ? 'బాలిక వయస్సు 10 సంవత్సరాల లోపు ఉంది.'
            : isHindi
            ? 'बालिका की आयु खाता खोलने के लिए 10 वर्ष से कम है।'
            : 'Self-reported: Girl child is below 10 years of age at account opening.'
        )`
);

// Header badges
code = code.replace(
  "{isTelugu ? 'ప్రాథమిక స్వీయ-అర్హత అంచనా' : 'Preliminary Self-Assessment'}",
  "{isTelugu ? 'ప్రాథమిక స్వీయ-అర్హత అంచనా' : isHindi ? 'प्रारंभिक स्व-पात्रता मूल्यांकन' : 'Preliminary Self-Assessment'}"
);

code = code.replace(
  "<Database className=\"w-3 h-3\" /> {isTelugu ? 'డేటాబేస్ అనుసంధానమైంది' : 'Supabase Connected'}",
  "<Database className=\"w-3 h-3\" /> {isTelugu ? 'డేటాబేస్ అనుసంధానమైంది' : isHindi ? 'डेटाबेस कनेक्टेड' : 'Supabase Connected'}"
);

code = code.replace(
  "{isTelugu ? 'నమూనా లెక్కింపు' : 'Demo Simulation'}",
  "{isTelugu ? 'నమూనా లెక్కింపు' : isHindi ? 'डेमो सिमुलेशन' : 'Demo Simulation'}"
);

// Step 1: Scheme itemTitle & selection
code = code.replace(
  "const itemTitle = isTelugu && item.titleTelugu ? item.titleTelugu : item.title",
  "const itemTitle = isTelugu && item.titleTelugu ? item.titleTelugu : isHindi && item.titleHindi ? item.titleHindi : item.title"
);

code = code.replace(
  `                    <p className="text-xs font-bold text-[var(--color-primary)]">
                      {isTelugu ? 'ఎంచుకున్న పథకం:' : 'Selected:'} {isTelugu && scheme.titleTelugu ? scheme.titleTelugu : scheme.title}
                    </p>
                    {isTelugu && scheme.titleTelugu && (
                      <p className="text-[11px] text-[var(--color-muted-foreground)]">{scheme.title}</p>
                    )}`,
  `                    <p className="text-xs font-bold text-[var(--color-primary)]">
                      {isTelugu ? 'ఎంచుకున్న పథకం:' : isHindi ? 'चयनित योजना:' : 'Selected:'} {isTelugu && scheme.titleTelugu ? scheme.titleTelugu : isHindi && scheme.titleHindi ? scheme.titleHindi : scheme.title}
                    </p>
                    {(isTelugu && scheme.titleTelugu || isHindi && scheme.titleHindi) && (
                      <p className="text-[11px] text-[var(--color-muted-foreground)]">{scheme.title}</p>
                    )}`
);

// Step 2: Gender options
code = code.replace(
  `<option value="Male">{isTelugu ? 'పురుషుడు' : 'Male'}</option>
                      <option value="Female">{isTelugu ? 'మహిళ' : 'Female'}</option>
                      <option value="Transgender">{isTelugu ? 'ఇతర' : 'Transgender'}</option>`,
  `<option value="Male">{isTelugu ? 'పురుషుడు' : isHindi ? 'पुरुष' : 'Male'}</option>
                      <option value="Female">{isTelugu ? 'మహిళ' : isHindi ? 'महिला' : 'Female'}</option>
                      <option value="Transgender">{isTelugu ? 'ఇతర' : isHindi ? 'अन्य / ट्रांसजेंडर' : 'Transgender'}</option>`
);

// Step 2: Category options
code = code.replace(
  `<option value="General">{isTelugu ? 'జనరల్ / ఓపెన్ కేటగిరీ' : 'General / Open Category'}</option>
                      <option value="OBC">{isTelugu ? 'ఓబీసీ' : 'Other Backward Classes (OBC)'}</option>
                      <option value="BC">{isTelugu ? 'బీసీ (తెలంగాణ)' : 'Backward Classes (BC - Telangana)'}</option>
                      <option value="SC">{isTelugu ? 'ఎస్సీ' : 'Scheduled Castes (SC)'}</option>
                      <option value="ST">{isTelugu ? 'ఎస్టీ' : 'Scheduled Tribes (ST)'}</option>
                      <option value="EWS">{isTelugu ? 'ఈడబ్ల్యూఎస్ (ఆర్థికంగా బలహీన వర్గాలు)' : 'Economically Weaker Section (EWS)'}</option>
                      <option value="Minority">{isTelugu ? 'మైనారిటీ' : 'Religious Minority'}</option>`,
  `<option value="General">{isTelugu ? 'జనరల్ / ఓపెన్ కేటగిరీ' : isHindi ? 'सामान्य (General)' : 'General / Open Category'}</option>
                      <option value="OBC">{isTelugu ? 'ఓబీసీ' : isHindi ? 'अन्य पिछड़ा वर्ग (OBC)' : 'Other Backward Classes (OBC)'}</option>
                      <option value="BC">{isTelugu ? 'బీసీ (తెలంగాణ)' : isHindi ? 'पिछड़ा वर्ग (BC)' : 'Backward Classes (BC - Telangana)'}</option>
                      <option value="SC">{isTelugu ? 'ఎస్సీ' : isHindi ? 'अनुसूचित जाति (SC)' : 'Scheduled Castes (SC)'}</option>
                      <option value="ST">{isTelugu ? 'ఎస్టీ' : isHindi ? 'अनुसूचित जनजाति (ST)' : 'Scheduled Tribes (ST)'}</option>
                      <option value="EWS">{isTelugu ? 'ఈడబ్ల్యూఎస్ (ఆర్థికంగా బలహీన వర్గాలు)' : isHindi ? 'आर्थिक रूप से कमजोर वर्ग (EWS)' : 'Economically Weaker Section (EWS)'}</option>
                      <option value="Minority">{isTelugu ? 'మైనారిటీ' : isHindi ? 'अल्पसंख्यक वर्ग (Minority)' : 'Religious Minority'}</option>`
);

// Step 3: Ration card options
code = code.replace(
  `<option value="White">{isTelugu ? 'తెల్ల రేషన్ కార్డు (బీపీఎల్ / ఆహార భద్రత)' : 'White Card (BPL / Food Security)'}</option>
                      <option value="Pink">{isTelugu ? 'గులాబీ రేషన్ కార్డు (ఏపీఎల్)' : 'Pink Card (Above Poverty Line - APL)'}</option>
                      <option value="None">{isTelugu ? 'రేషన్ కార్డు లేదు' : 'No Ration Card'}</option>`,
  `<option value="White">{isTelugu ? 'తెల్ల రేషన్ కార్డు (బీపీఎల్ / ఆహార భద్రత)' : isHindi ? 'सफेद राशन कार्ड (BPL / खाद्य सुरक्षा)' : 'White Card (BPL / Food Security)'}</option>
                      <option value="Pink">{isTelugu ? 'గులాబీ రేషన్ కార్డు (ఏపీఎల్)' : isHindi ? 'गुलाबी राशन कार्ड (APL)' : 'Pink Card (Above Poverty Line - APL)'}</option>
                      <option value="None">{isTelugu ? 'రేషన్ కార్డు లేదు' : isHindi ? 'राशन कार्ड नहीं है' : 'No Ration Card'}</option>`
);

// Step 4: PM Kisan Checkboxes
code = code.replace(
  `                          <span className="font-bold text-[var(--color-foreground)] block">
                            {isTelugu ? 'వ్యవసాయ సాగు భూమి రిజిస్టర్డ్ పట్టా కలిగి ఉండటం' : 'Holds Legal Agricultural Land Title in Applicant / Family Name'}
                          </span>
                          <span className="text-[var(--color-muted-foreground)] leading-relaxed">
                            {isTelugu ? 'నా పేరిట లేదా కుటుంబ సభ్యుల పేరిట వ్యవసాయ భూమి పట్టా లేదా 1-B రికార్డు ఉంది.' : 'I or my family hold registered agricultural land in land revenue records (RoR/1-B/Pattadar).'}
                          </span>`,
  `                          <span className="font-bold text-[var(--color-foreground)] block">
                            {isTelugu ? 'వ్యవసాయ సాగు భూమి రిజిస్టర్డ్ పట్టా కలిగి ఉండటం' : isHindi ? 'आवेदक / परिवार के नाम पर कृषि भूमि का कानूनी पट्टा' : 'Holds Legal Agricultural Land Title in Applicant / Family Name'}
                          </span>
                          <span className="text-[var(--color-muted-foreground)] leading-relaxed">
                            {isTelugu ? 'నా పేరిట లేదా కుటుంబ సభ్యుల పేరిట వ్యవసాయ భూమి పట్టా లేదా 1-B రికార్డు ఉంది.' : isHindi ? 'मेरे या मेरे परिवार के नाम पर राजस्व रिकॉर्ड में पंजीकृत कृषि भूमि का पट्टा है।' : 'I or my family hold registered agricultural land in land revenue records (RoR/1-B/Pattadar).'}
                          </span>`
);

code = code.replace(
  `                          <span className="font-bold text-[var(--color-foreground)] block">
                            {isTelugu ? 'ప్రభుత్వ ఉద్యోగి / ఆదాయపు పన్ను చెల్లింపుదారుల మినహాయింపు' : 'Government Employee / Regular Pensioner / Income Tax Payee Exclusion'}
                          </span>
                          <span className="text-[var(--color-muted-foreground)] leading-relaxed">
                            {isTelugu ? 'కుటుంబంలో ఎవరైనా రాజ్యాంగ పదవి కలిగి ఉంటే లేదా ఆదాయపు పన్ను చెల్లిస్తుంటే మాత్రమే టిక్ చేయండి.' : 'Check this box ONLY if any family member holds constitutional post or pays income tax.'}
                          </span>`,
  `                          <span className="font-bold text-[var(--color-foreground)] block">
                            {isTelugu ? 'ప్రభుత్వ ఉద్యోగి / ఆదాయపు పన్ను చెల్లింపుదారుల మినహాయింపు' : isHindi ? 'सरकारी कर्मचारी / पेंशनभोगी / आयकर दाता अपवर्जन' : 'Government Employee / Regular Pensioner / Income Tax Payee Exclusion'}
                          </span>
                          <span className="text-[var(--color-muted-foreground)] leading-relaxed">
                            {isTelugu ? 'కుటుంబంలో ఎవరైనా రాజ్యాంగ పదవి కలిగి ఉంటే లేదా ఆదాయపు పన్ను చెల్లిస్తుంటే మాత్రమే టిక్ చేయండి.' : isHindi ? 'केवल तभी चेक करें यदि परिवार का कोई सदस्य संवैधानिक पद पर है या आयकर देता है।' : 'Check this box ONLY if any family member holds constitutional post or pays income tax.'}
                          </span>`
);

// PM Surya Ghar Checkboxes
code = code.replace(
  `                          <span className="font-bold text-[var(--color-foreground)] block">
                            {isTelugu ? 'సౌర ప్యానెల్స్ కొరకు నీడ లేని పక్కా పైకప్పు స్థలం' : 'Adequate Pucca / RCC Rooftop Space Available'}
                          </span>
                          <span className="text-[var(--color-muted-foreground)] leading-relaxed">
                            {isTelugu ? 'మా ఇంటి పైకప్పుపై కనీసం 100-300 చదరపు అడుగుల నీడ లేని ఖాళీ స్థలం ఉంది.' : 'My residential roof has at least 100-300 sq.ft of unshaded south/open facing space.'}
                          </span>`,
  `                          <span className="font-bold text-[var(--color-foreground)] block">
                            {isTelugu ? 'సౌర ప్యానెల్స్ కొరకు నీడ లేని పక్కా పైకప్పు స్థలం' : isHindi ? 'सौर पैनलों के लिए छाया-रहित पक्की छत की पर्याप्त जगह' : 'Adequate Pucca / RCC Rooftop Space Available'}
                          </span>
                          <span className="text-[var(--color-muted-foreground)] leading-relaxed">
                            {isTelugu ? 'మా ఇంటి పైకప్పుపై కనీసం 100-300 చదరపు అడుగుల నీడ లేని ఖాళీ స్థలం ఉంది.' : isHindi ? 'मेरे घर की छत पर कम से कम 100-300 वर्ग फुट खुली धूप वाली जगह उपलब्ध है।' : 'My residential roof has at least 100-300 sq.ft of unshaded south/open facing space.'}
                          </span>`
);

code = code.replace(
  `                          <span className="font-bold text-[var(--color-foreground)] block">
                            {isTelugu ? 'క్రియాశీల గృహ వినియోగ విద్యుత్ మీటర్ కనెక్షన్' : 'Active Domestic Consumer Electricity Meter'}
                          </span>
                          <span className="text-[var(--color-muted-foreground)] leading-relaxed">
                            {isTelugu ? 'విద్యుత్ కనెక్షన్ నా పేరిట లేదా కుటుంబ సభ్యుల పేరిట నమోదై ఉంది.' : "The power connection is in my or family member's name with zero illegal tapping."}
                          </span>`,
  `                          <span className="font-bold text-[var(--color-foreground)] block">
                            {isTelugu ? 'క్రియాశీల గృహ వినియోగ విద్యుత్ మీటర్ కనెక్షన్' : isHindi ? 'सक्रिय घरेलू उपभोक्ता बिजली कनेक्शन' : 'Active Domestic Consumer Electricity Meter'}
                          </span>
                          <span className="text-[var(--color-muted-foreground)] leading-relaxed">
                            {isTelugu ? 'విద్యుత్ కనెక్షన్ నా పేరిట లేదా కుటుంబ సభ్యుల పేరిట నమోదై ఉంది.' : isHindi ? 'बिजली कनेक्शन मेरे या परिवार के सदस्य के नाम पर वैध रूप से सक्रिय है।' : "The power connection is in my or family member's name with zero illegal tapping."}
                          </span>`
);

// Post Matric & Aadhaar Checkboxes
code = code.replace(
  `                        <span className="font-bold text-[var(--color-foreground)] block">
                          {isTelugu ? 'గుర్తింపు పొందిన కాలేజీలో ప్రవేశం' : 'Enrolled in UGC / AICTE / State Recognized College'}
                        </span>
                        <span className="text-[var(--color-muted-foreground)] leading-relaxed">
                          {isTelugu ? 'పదవ తరగతి తదుపరి కాలేజీలో చెల్లుబాటు అయ్యే ప్రవేశ రశీదు మరియు హాజరు ఉంది.' : 'I have active admission receipt and attendance record in an affiliated post-10th college.'}
                        </span>`,
  `                        <span className="font-bold text-[var(--color-foreground)] block">
                          {isTelugu ? 'గుర్తింపు పొందిన కాలేజీలో ప్రవేశం' : isHindi ? 'मान्यता प्राप्त कॉलेज में सक्रिय प्रवेश' : 'Enrolled in UGC / AICTE / State Recognized College'}
                        </span>
                        <span className="text-[var(--color-muted-foreground)] leading-relaxed">
                          {isTelugu ? 'పదవ తరగతి తదుపరి కాలేజీలో చెల్లుబాటు అయ్యే ప్రవేశ రశీదు మరియు హాజరు ఉంది.' : isHindi ? 'मेरे पास 10वीं के बाद किसी मान्यता प्राप्त कॉलेज में वैध प्रवेश रसीद और उपस्थिति रिकॉर्ड है।' : 'I have active admission receipt and attendance record in an affiliated post-10th college.'}
                        </span>`
);

code = code.replace(
  `                      <span className="font-bold text-[var(--color-foreground)] block">
                        {isTelugu ? 'ఆధార్ అనుసంధానించబడిన బ్యాంక్ ఖాతా కలిగి ఉండటం' : 'Possess Active Aadhaar-Seeded Bank Account'}
                      </span>
                      <span className="text-[var(--color-muted-foreground)] leading-relaxed">
                        {isTelugu ? 'ప్రత్యక్ష నగదు బదిలీ (DBT) నిధులను స్వీకరించడానికి ఖాతా సిద్ధంగా ఉంది.' : 'Account is active and ready to receive Direct Benefit Transfer (DBT) via PFMS.'}
                      </span>`,
  `                      <span className="font-bold text-[var(--color-foreground)] block">
                        {isTelugu ? 'ఆధార్ అనుసంధానించబడిన బ్యాంక్ ఖాతా కలిగి ఉండటం' : isHindi ? 'आधार-लिंक्ड सक्रिय बैंक खाता' : 'Possess Active Aadhaar-Seeded Bank Account'}
                      </span>
                      <span className="text-[var(--color-muted-foreground)] leading-relaxed">
                        {isTelugu ? 'ప్రత్యక్ష నగదు బదిలీ (DBT) నిధులను స్వీకరించడానికి ఖాతా సిద్ధంగా ఉంది.' : isHindi ? 'डीबीटी (DBT) के माध्यम से वित्तीय लाभ प्राप्त करने के लिए बैंक खाता सक्रिय है।' : 'Account is active and ready to receive Direct Benefit Transfer (DBT) via PFMS.'}
                      </span>`
);

// Step 5: Scheme target label & saving banner
code = code.replace(
  `{isTelugu ? 'పథకం:' : 'Scheme Target:'} <strong>{isTelugu && scheme.titleTelugu ? scheme.titleTelugu : scheme.title}</strong>`,
  `{isTelugu ? 'పథకం:' : isHindi ? 'लक्षित योजना:' : 'Scheme Target:'} <strong>{isTelugu && scheme.titleTelugu ? scheme.titleTelugu : isHindi && scheme.titleHindi ? scheme.titleHindi : scheme.title}</strong>`
);

code = code.replace(
  "<span>{isTelugu ? 'అర్హత రికార్డు మీ ప్రైవేట్ డేటాబేస్‌లో భద్రపరచబడుతోంది...' : 'Saving assessment to your private Supabase citizen record...'}</span>",
  "<span>{isTelugu ? 'అర్హత రికార్డు మీ ప్రైవేట్ డేటాబేస్‌లో భద్రపరచబడుతోంది...' : isHindi ? 'मूल्यांकन रिकॉर्ड आपके निजी डेटाबेस में सुरक्षित किया जा रहा है...' : 'Saving assessment to your private Supabase citizen record...'}</span>"
);

code = code.replace(
  "<span>{isTelugu ? 'పౌర సూచన & న్యాయపరమైన ప్రకటన' : 'Important Citizen Notice & Legal Disclaimer'}</span>",
  "<span>{isTelugu ? 'పౌర సూచన & న్యాయపరమైన ప్రకటన' : isHindi ? 'महत्वपूर्ण नागरिक सूचना एवं कानूनी अस्वीकरण' : 'Important Citizen Notice & Legal Disclaimer'}</span>"
);

// History Tab translations
code = code.replace(
  "{isTelugu ? 'అర్హత చరిత్ర కోసం సైన్ ఇన్ అవసరం' : 'Citizen Sign-In Required for Assessment History'}",
  "{isTelugu ? 'అర్హత చరిత్ర కోసం సైన్ ఇన్ అవసరం' : isHindi ? 'मूल्यांकन इतिहास के लिए नागरिक साइन-इन आवश्यक' : 'Citizen Sign-In Required for Assessment History'}"
);

code = code.replace(
  `                  {isTelugu
                    ? 'మీ అర్హత అంచనాల చరిత్ర సురక్షిత క్లౌడ్ డేటాబేస్‌లో భద్రపరచబడుతుంది. మీ రికార్డులను ఎప్పుడైనా చూడటానికి సైన్ ఇన్ చేయండి.'
                    : 'Assessment history is securely synchronized with your private Supabase profile under PostgreSQL Row Level Security. Sign in or create an account to view and preserve all your welfare eligibility evaluations.'}`,
  `                  {isTelugu
                    ? 'మీ అర్హత అంచనాల చరిత్ర సురక్షిత క్లౌడ్ డేటాబేస్‌లో భద్రపరచబడుతుంది. మీ రికార్డులను ఎప్పుడైనా చూడటానికి సైన్ ఇన్ చేయండి.'
                    : isHindi
                    ? 'आपका मूल्यांकन इतिहास PostgreSQL पंक्ति-स्तरीय सुरक्षा (RLS) के तहत निजी डेटाबेस में सुरक्षित रहता है। अपने सभी मूल्यांकन देखने के लिए साइन इन करें।'
                    : 'Assessment history is securely synchronized with your private Supabase profile under PostgreSQL Row Level Security. Sign in or create an account to view and preserve all your welfare eligibility evaluations.'}`
);

code = code.replace(
  "{isTelugu ? 'మీ భద్రపరిచిన అర్హత రికార్డులు లోడ్ అవుతున్నాయి...' : 'Retrieving your saved eligibility assessments from Supabase...'}",
  "{isTelugu ? 'మీ భద్రపరిచిన అర్హత రికార్డులు లోడ్ అవుతున్నాయి...' : isHindi ? 'डेटाबेस से आपके सुरक्षित मूल्यांकन लोड हो रहे हैं...' : 'Retrieving your saved eligibility assessments from Supabase...'}"
);

code = code.replace(
  "description={isTelugu ? 'మీరు ఇంకా ఎటువంటి అర్హత అంచనాలు భద్రపరచలేదు. పథకాల అర్హతను పరిశీలించడానికి కాలిక్యులేటర్ ఉపయోగించండి.' : 'You have not saved any eligibility evaluations yet. Use our calculator to evaluate your qualification against 5,000+ central and state schemes.'}",
  "description={isTelugu ? 'మీరు ఇంకా ఎటువంటి అర్హత అంచనాలు భద్రపరచలేదు. పథకాల అర్హతను పరిశీలించడానికి కాలిక్యులేటర్ ఉపయోగించండి.' : isHindi ? 'आपने अभी तक कोई पात्रता मूल्यांकन सुरक्षित नहीं किया है। 5,000+ योजनाओं में अपनी योग्यता जांचने के लिए कैलकुलेटर का उपयोग करें।' : 'You have not saved any eligibility evaluations yet. Use our calculator to evaluate your qualification against 5,000+ central and state schemes.'}"
);

code = code.replace(
  "{isTelugu ? `మొత్తం ${assessmentHistory.length} భద్రపరిచిన రికార్డులు ఉన్నాయి` : `Showing ${assessmentHistory.length} saved assessment(s) for your account`}",
  "{isTelugu ? `మొత్తం ${assessmentHistory.length} భద్రపరిచిన రికార్డులు ఉన్నాయి` : isHindi ? `आपके खाते के लिए कुल ${assessmentHistory.length} सुरक्षित मूल्यांकन` : `Showing ${assessmentHistory.length} saved assessment(s) for your account`}"
);

code = code.replace(
  "const formattedDate = new Date(item.created_at).toLocaleString(isTelugu ? 'te-IN' : 'en-IN', {",
  "const formattedDate = new Date(item.created_at).toLocaleString(isTelugu ? 'te-IN' : isHindi ? 'hi-IN' : 'en-IN', {"
);

code = code.replace(
  "<span>{isExpanded ? (isTelugu ? 'నిబంధనలను దాచు' : 'Hide Evaluated Rules') : (isTelugu ? 'పరిశీలించిన నిబంధనలు చూడండి' : 'View Evaluated Rules')}</span>",
  "<span>{isExpanded ? (isTelugu ? 'నిబంధనలను దాచు' : isHindi ? 'नियम छुपाएं' : 'Hide Evaluated Rules') : (isTelugu ? 'పరిశీలించిన నిబంధనలు చూడండి' : isHindi ? 'मूल्यांकन किए गए नियम देखें' : 'View Evaluated Rules')}</span>"
);

code = code.replace(
  "<strong>{isTelugu ? 'పౌర ప్రకటన:' : 'Citizen Disclaimer:'}</strong> {t('disclaimerPreliminary')}",
  "<strong>{isTelugu ? 'పౌర ప్రకటన:' : isHindi ? 'नागरिक अस्वीकरण:' : 'Citizen Disclaimer:'}</strong> {t('disclaimerPreliminary')}"
);

fs.writeFileSync(filePath, code, 'utf8');
console.log('Successfully updated EligibilityPage.tsx with complete Hindi translations.');
