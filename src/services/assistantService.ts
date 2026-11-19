/**
 * Assistant Service for CivicSaarthi AI.
 *
 * Integrates with Supabase Edge Function 'chat-assistant' (powered by Google Gemini API).
 * When the backend Edge Function or GEMINI_API_KEY secret is unavailable, it gracefully
 * falls back to the local domain knowledge engine without interrupting citizen workflows.
 */

import { supabase, isSupabaseConfigured } from '@/lib/supabase'

export interface Citation {
  title: string
  sourceName: string
  sourceUrl: string
  clauseReference?: string
  isDemoCitation?: boolean
}

export interface AssistantMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  contentTelugu?: string
  timestamp: string
  citations?: Citation[]
  isLiveAi?: boolean
}

export interface AssistantSession {
  id: string
  title: string
  createdAt: string
  language: 'en' | 'te' | 'hi'
  messages: AssistantMessage[]
}

export interface AssistantResponse {
  text: string
  citations: Citation[]
  isLiveAi: boolean
  isDemoFallback: boolean
  error?: string
}

// Pre-configured authoritative knowledge snippets for demonstration & offline fallback
const LOCAL_KNOWLEDGE_BASE: Record<
  string,
  { en: string; te: string; hi: string; kn: string; citations: Citation[] }
> = {
  farmer: {
    en: 'Under the PM Kisan Samman Nidhi scheme, eligible landholding farmer families receive ₹6,000 per year in three equal instalments of ₹2,000 deposited directly into their Aadhaar-seeded bank accounts via DBT (subject to e-KYC and state land record validation). In Telangana, the state investment support initiative provides seasonal assistance for agricultural inputs as per notified state guidelines.',
    te: 'పీఎం కిసాన్ సమ్మాన్ నిధి పథకం కింద అర్హులైన రైతు కుటుంబాలకు ఏటా ₹6,000 మూడు విడతల్లో నేరుగా వారి ఆధార్ అనుసంధాన బ్యాంక్ ఖాతాల్లో జమ చేయబడుతుంది (ఈ-కేవైసీ మరియు భూమి రికార్డుల ధృవీకరణకు లోబడి). అలాగే తెలంగాణలో రాష్ట్ర వ్యవసాయ పెట్టుబడి సహాయం ద్వారా అర్హులైన రైతులకు మార్గదర్శకాల ప్రకారం సహాయం అందుతుంది.',
    hi: 'पीएम किसान सम्मान निधि योजना के तहत पात्र भूमिधारक किसान परिवारों को ₹6,000 प्रति वर्ष तीन समान किस्तों में (प्रत्येक ₹2,000) डीबीटी के माध्यम से सीधे उनके आधार-लिंक्ड बैंक खातों में प्रदान किए जाते हैं (ई-केवाईसी और राज्य भूमि रिकॉर्ड सत्यापन के अधीन)। राज्य स्तर पर कृषि निवेश सहायता भी उपलब्ध कराई जाती है।',
    kn: 'ಪಿಎಂ ಕಿಸಾನ್ ಸಮ್ಮಾನ್ ನಿಧಿ ಯೋಜನೆಯಡಿಯಲ್ಲಿ ಅರ್ಹ ಭೂಹಿಡುವಳಿದಾರ ರೈತ ಕುಟುಂಬಗಳಿಗೆ ವರ್ಷಕ್ಕೆ ₹6,000 ಮೊತ್ತವನ್ನು ಮೂರು ಸಮಾನ ಕಂತುಗಳಲ್ಲಿ (ಪ್ರತಿ ಕಂತಿಗೆ ₹2,000) ಡಿಬಿಟಿ ಮೂಲಕ ನೇರವಾಗಿ ಅವರ ಆಧಾರ್ ಜೋಡಿತ ಬ್ಯಾಂಕ್ ಖಾತೆಗಳಿಗೆ ಜಮೆ ಮಾಡಲಾಗುತ್ತದೆ (ಇ-ಕೆವೈಸಿ ಮತ್ತು ಭೂ ದಾಖಲೆ ಪರಿಶೀಲನೆಗೆ ಒಳಪಟ್ಟು).',
    citations: [
      {
        title: 'PM-KISAN National Portal',
        sourceName: 'Ministry of Agriculture & Farmers Welfare, GoI',
        sourceUrl: 'https://pmkisan.gov.in',
        clauseReference: 'Official Guidelines • Direct Benefit Transfer',
        isDemoCitation: false,
      },
      {
        title: 'Rythu Bandhu / Rythu Bharosa State Portal',
        sourceName: 'Department of Agriculture, Govt of Telangana',
        sourceUrl: 'https://rythubandhu.telangana.gov.in',
        clauseReference: 'State Agriculture Support Portal',
        isDemoCitation: false,
      },
    ],
  },
  solar: {
    en: 'Under the PM Surya Ghar: Muft Bijli Yojana, residential households can claim direct central capital subsidies: ₹30,000 for 1 kW, ₹60,000 for 2 kW, and up to ₹78,000 for 3 kW and higher systems. Benefit release requires technical feasibility approval from your local DISCOM, plant installation by an empaneled vendor, and net-meter commissioning.',
    te: 'పీఎం సూర్య ఘర్: ఉచిత విద్యుత్ యోజన కింద గృహ వినియోగదారులకు 1 kW కి ₹30,000, 2 kW కి ₹60,000 మరియు 3 kW లేదా అంతకంటే ఎక్కువ సామర్థ్యానికి గరిష్టంగా ₹78,000 సబ్సిడీ అందుతుంది. స్థానిక డిస్కం తనిఖీ, అనుమతి మరియు నెట్-మీటర్ ఏర్పాటు తర్వాత ఈ సబ్సిడీ బ్యాంకులో జమ చేయబడుతుంది.',
    hi: 'पीएम सूर्य घर: मुफ्त बिजली योजना के तहत आवासीय उपभोक्ताओं को 1 किलोवाट के लिए ₹30,000, 2 किलोवाट के लिए ₹60,000 और 3 किलोवाट या उससे अधिक के लिए ₹78,000 तक की केंद्रीय सब्सिडी मिलती है। स्थानीय डिस्कॉम निरीक्षण और नेट-मीटर स्थापना के बाद यह सब्सिडी बैंक खाते में जमा की जाती है।',
    kn: 'ಪಿಎಂ ಸೂರ್ಯ ಘರ್: ಉಚಿತ ವಿದ್ಯುತ್ ಯೋಜನೆಯಡಿಯಲ್ಲಿ ವಸತಿ ಗ್ರಾಹಕರಿಗೆ 1 kW ಗೆ ₹30,000, 2 kW ಗೆ ₹60,000 ಮತ್ತು 3 kW ಅಥವಾ ಹೆಚ್ಚಿನ ಸಾಮರ್ಥ್ಯಕ್ಕೆ ಗರಿಷ್ಠ ₹78,000 ಸಬ್ಸಿಡಿ ದೊರೆಯುತ್ತದೆ. ಸ್ಥಳೀಯ ಎಸ್ಕಾಂ ಪರಿಶೀಲನೆ ಮತ್ತು ನೆಟ್-ಮೀಟರ್ ಅಳವಡಿಕೆಯ ನಂತರ ಸಬ್ಸಿಡಿ ಹಣ ಬ್ಯಾಂಕ್ ಖಾತೆಗೆ ಬಿಡುಗಡೆಯಾಗುತ್ತದೆ.',
    citations: [
      {
        title: 'PM Surya Ghar National Portal',
        sourceName: 'Ministry of New & Renewable Energy (MNRE)',
        sourceUrl: 'https://pmsuryaghar.gov.in',
        clauseReference: 'Operational Guidelines • CFA Disbursal',
        isDemoCitation: false,
      },
    ],
  },
  health: {
    en: 'Ayushman Bharat PM-JAY provides health cover up to ₹5 lakh per family per year for secondary and tertiary care hospitalization across empaneled public and private hospitals in India. Coverage is subject to eligibility identified under SECC 2011 deprivation criteria or state NFSA food security ration card lists.',
    te: 'ఆయుష్మాన్ భారత్ పీఎం-జేఏవై ద్వారా దేశవ్యాప్తంగా గుర్తింపు పొందిన ఆసుపత్రులలో అర్హులైన పేద కుటుంబాలకు ఏడాదికి ₹5 లక్షల వరకు నగదు రహిత చికిత్స అందుతుంది. సామాజిక-ఆర్థిక సర్వే (SECC) లేదా రాష్ట్ర ఆహార భద్రతా రేషన్ కార్డుల ఆధారంగా లబ్ధిదారులను ఎంపిక చేస్తారు.',
    hi: 'आयुष्मान भारत पीएम-जेएवाई योजना के तहत पात्र परिवारों को प्रति वर्ष ₹5 लाख तक का कैशलेस स्वास्थ्य बीमा माध्यमिक और तृतीयक देखभाल के लिए देश भर के सूचीबद्ध सरकारी और निजी अस्पतालों में मिलता है। सामाजिक-आर्थिक जाति जनगणना (SECC) या राज्य खाद्य सुरक्षा राशन कार्ड के आधार पर पात्रता निर्धारित होती है।',
    kn: 'ಆಯುಷ್ಮಾನ್ ಭಾರತ್ ಪಿಎಂ-ಜೆಎವೈ ಅಡಿಯಲ್ಲಿ ಅರ್ಹ ಕುಟುಂಬಗಳಿಗೆ ದೇಶದ ನೋಂದಾಯಿತ ಆಸ್ಪತ್ರೆಗಳಲ್ಲಿ ದ್ವಿತೀಯ ಮತ್ತು ತೃತೀಯ ಹಂತದ ಚಿಕಿತ್ಸೆಗಾಗಿ ಪ್ರತಿ ಕುಟುಂಬಕ್ಕೆ ವರ್ಷಕ್ಕೆ ₹5 ಲಕ್ಷದವರೆಗೆ ನಗದು ರಹಿತ ಚಿಕಿತ್ಸಾ ಸೌಲಭ್ಯ ಲಭ್ಯವಿದೆ.',
    citations: [
      {
        title: 'National Health Authority (NHA) PM-JAY Guidelines',
        sourceName: 'National Health Authority (NHA)',
        sourceUrl: 'https://nha.gov.in',
        clauseReference: 'National Hospital Empanelment Guidelines',
        isDemoCitation: false,
      },
    ],
  },
  scholarship: {
    en: 'Post-Matric Scholarships in Telangana and Central Schemes provide tuition reimbursement and maintenance allowances to students belonging to SC, ST, BC, and EBC categories whose family annual income meets the notified thresholds (e.g., up to ₹2 Lakh for rural and ₹2.5 Lakh for urban in Telangana ePASS). Applications require online registration via the ePASS portal, caste certificate, income certificate, and SSC memo.',
    te: 'తెలంగాణ ఈపాస్ (ePASS) మరియు కేంద్ర పోస్ట్-మెట్రిక్ స్కాలర్‌షిప్‌ల ద్వారా ఎస్సీ, ఎస్టీ, బీసీ, ఈబీసీ వర్గాలకు చెందిన విద్యార్థులకు ట్యూషన్ ఫీజు రీయింబర్స్‌మెంట్ మరియు నిర్వహణ భత్యం లభిస్తుంది. దీని కోసం కుటుంబ వార్షిక ఆదాయ పరిమితి నిబంధనలకు లోబడి ఉండాలి. ఆధార్, కుల ధ్రువీకరణ, ఆదాయ ధ్రువీకరణ పత్రాలతో ఈపాస్ పోర్టల్‌లో దరఖాస్తు చేసుకోవాలి.',
    hi: 'पोस्ट-मैट्रिक छात्रवृत्ति और केंद्रीय योजनाओं के तहत एससी, एसटी, ओबीसी और ईडब्ल्यूएस श्रेणियों के पात्र छात्रों को ट्यूशन फीस प्रतिपूर्ति और रखरखाव भत्ता दिया जाता है। नेशनल स्कॉलरशिप पोर्टल (NSP) या राज्य ई-पास पोर्टल के माध्यम से ऑनलाइन आवेदन किया जा सकता है।',
    kn: 'ಮೆಟ್ರಿಕ್ ನಂತರದ ವಿದ್ಯಾರ್ಥಿವೇತನ ಮತ್ತು ಕೇಂದ್ರ ಯೋಜನೆಗಳ ಮೂಲಕ ಎಸ್‌ಸಿ, ಎಸ್‌ಟಿ, ಒಬಿಸಿ ವರ್ಗಗಳ ಅರ್ಹ ವಿದ್ಯಾರ್ಥಿಗಳಿಗೆ ಬೋಧನಾ ಶುಲ್ಕ ಮರುಪಾವತಿ ಮತ್ತು ನಿರ್ವಹಣಾ ಭತ್ಯೆ ನೀಡಲಾಗುತ್ತದೆ. ಇ-ಪಾಸ್ ಅಥವಾ ರಾಷ್ಟ್ರೀಯ ವಿದ್ಯಾರ್ಥಿವೇತನ ಪೋರ್ಟಲ್ ಮೂಲಕ ಅರ್ಜಿ ಸಲ್ಲಿಸಬಹುದು.',
    citations: [
      {
        title: 'Telangana ePASS Electronic Payment & Application System',
        sourceName: 'Government of Telangana Welfare Departments',
        sourceUrl: 'https://telanganaepass.cgg.gov.in',
        clauseReference: 'Post-Matric Scholarship Guidelines',
        isDemoCitation: false,
      },
      {
        title: 'National Scholarship Portal (NSP)',
        sourceName: 'Ministry of Electronics and Information Technology (MeitY)',
        sourceUrl: 'https://scholarships.gov.in',
        clauseReference: 'Central Sector & Centrally Sponsored Schemes',
        isDemoCitation: false,
      },
    ],
  },
}

/**
 * Sends prompt to the secure Supabase Edge Function, falling back to rule-based engine if unavailable.
 */
export async function askAssistant(
  prompt: string,
  language: 'en' | 'te' | 'hi' = 'en',
  context?: string,
  history?: Array<{ role: 'user' | 'assistant'; content: string }>
): Promise<AssistantResponse> {
  // If Supabase is configured, attempt backend Edge Function execution first
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase.functions.invoke('chat-assistant', {
        body: {
          prompt,
          language,
          context,
          history,
        },
      })

      if (!error && data && data.success && data.text) {
        return {
          text: data.text,
          citations: data.citations || [],
          isLiveAi: Boolean(data.isLiveAi),
          isDemoFallback: false,
        }
      }

      // If Edge Function responded with demo fallback advice (e.g. key missing in backend)
      if (data && data.isDemoFallback) {
        console.info('Supabase Edge Function returned demo fallback notice:', data.error)
      }
    } catch (edgeErr) {
      console.warn('Edge function invoke exception, proceeding with localized fallback:', edgeErr)
    }
  }

  // --- LOCALIZED DOMAIN KNOWLEDGE FALLBACK ENGINE ---
  await new Promise((resolve) => setTimeout(resolve, 350))

  const lower = prompt.toLowerCase()
  const langKey = (['en', 'te', 'hi', 'kn'].includes(language) ? language : 'en') as 'en' | 'te' | 'hi' | 'kn'

  if (
    lower.includes('farm') ||
    lower.includes('kisan') ||
    lower.includes('किसान') ||
    lower.includes('ಕಿಸಾನ್') ||
    lower.includes('రైతు') ||
    lower.includes('భూమి')
  ) {
    const data = LOCAL_KNOWLEDGE_BASE.farmer
    return {
      text: data[langKey] || data.en,
      citations: data.citations,
      isLiveAi: false,
      isDemoFallback: true,
    }
  }

  if (
    lower.includes('solar') ||
    lower.includes('bijli') ||
    lower.includes('सूर्य') ||
    lower.includes('ಸೂರ್ಯ') ||
    lower.includes('విద్యుత్') ||
    lower.includes('current')
  ) {
    const data = LOCAL_KNOWLEDGE_BASE.solar
    return {
      text: data[langKey] || data.en,
      citations: data.citations,
      isLiveAi: false,
      isDemoFallback: true,
    }
  }

  if (
    lower.includes('health') ||
    lower.includes('ayushman') ||
    lower.includes('आयुष्मान') ||
    lower.includes('ಆಯುಷ್ಮಾನ್') ||
    lower.includes('ఆరోగ్య') ||
    lower.includes('hospital')
  ) {
    const data = LOCAL_KNOWLEDGE_BASE.health
    return {
      text: data[langKey] || data.en,
      citations: data.citations,
      isLiveAi: false,
      isDemoFallback: true,
    }
  }

  if (
    lower.includes('scholarship') ||
    lower.includes('epass') ||
    lower.includes('छात्रवृत्ति') ||
    lower.includes('ವಿದ್ಯಾರ್ಥಿವೇತನ') ||
    lower.includes('student') ||
    lower.includes('విద్యా') ||
    lower.includes('ఫీజు')
  ) {
    const data = LOCAL_KNOWLEDGE_BASE.scholarship
    return {
      text: data[langKey] || data.en,
      citations: data.citations,
      isLiveAi: false,
      isDemoFallback: true,
    }
  }

  // Default fallback guidance per language
  if (language === 'te') {
    return {
      text: 'గమనిక: ప్రభుత్వ సంక్షేమ పథకాల నిబంధనల ప్రకారం లబ్ధిదారుల ఎంపిక జరుగుతుంది. మీరు అడిగిన అంశంపై సమగ్ర వివరాల కోసం స్కీమ్ డైరెక్టరీ లేదా అర్హత నిర్ధారణ టూల్ (Eligibility Checker) ను ఉపయోగించవచ్చు. లైవ్ AI బ్యాకెండ్ కనెక్ట్ కానప్పుడు ఈ ప్రామాణిక నిబంధనల మార్గదర్శకత్వం అందించబడుతుంది.',
      citations: [
        {
          title: 'myScheme Citizen Portal',
          sourceName: 'Ministry of Electronics & IT (MeitY)',
          sourceUrl: 'https://myscheme.gov.in',
          clauseReference: 'National Schemes Reference Hub',
          isDemoCitation: false,
        },
      ],
      isLiveAi: false,
      isDemoFallback: true,
    }
  }

  if (language === 'hi') {
    return {
      text: 'सूचना: सरकारी कल्याणकारी योजनाओं के दिशा-निर्देशों के अनुसार लाभार्थियों की पात्रता आय, अधिवास और सामाजिक-आर्थिक श्रेणी पर निर्भर करती है। विस्तृत और आधिकारिक जानकारी के लिए योजना निर्देशिका देखें या पात्रता जांच टूल का उपयोग करें। जब लाइव एआई बैकएंड कनेक्ट नहीं होता है, तो यह प्रमाणित नियम-आधारित मार्गदर्शन प्रदान किया जाता है।',
      citations: [
        {
          title: 'myScheme Citizen Portal',
          sourceName: 'Ministry of Electronics & IT (MeitY)',
          sourceUrl: 'https://myscheme.gov.in',
          clauseReference: 'National Schemes Reference Hub',
          isDemoCitation: false,
        },
      ],
      isLiveAi: false,
      isDemoFallback: true,
    }
  }

  if (language === 'kn') {
    return {
      text: 'ಸೂಚನೆ: ಸರ್ಕಾರದ ಕಲ್ಯಾಣ ಯೋಜನೆಗಳ ನಿಯಮಾವಳಿಗಳ ಪ್ರಕಾರ ಅರ್ಹತೆಯನ್ನು ನಿರ್ಧರಿಸಲಾಗುತ್ತದೆ (ಆದಾಯ, ವಾಸಸ್ಥಳ ಮತ್ತು ವರ್ಗದ ಆಧಾರದ ಮೇಲೆ). ವಿವರವಾದ ಅಧಿಕೃತ ಮಾಹಿತಿಗಾಗಿ ಯೋಜನೆ ಡೈರೆಕ್ಟರಿ ಅಥವಾ ಅರ್ಹತಾ ಪರಿಶೀಲನಾ ಟೂಲ್ ಅನ್ನು ಬಳಸಬಹುದು. ಲೈವ್ ಎಐ ಲಭ್ಯವಿಲ್ಲದಿದ್ದಾಗ ಈ ಅಧಿಕೃತ ನಿಯಮಗಳ ಮಾರ್ಗದರ್ಶನ ನೀಡಲಾಗುತ್ತದೆ.',
      citations: [
        {
          title: 'myScheme Citizen Portal',
          sourceName: 'Ministry of Electronics & IT (MeitY)',
          sourceUrl: 'https://myscheme.gov.in',
          clauseReference: 'National Schemes Reference Hub',
          isDemoCitation: false,
        },
      ],
      isLiveAi: false,
      isDemoFallback: true,
    }
  }

  return {
    text: 'Notice: Based on public welfare guidelines, citizen eligibility depends on notified criteria such as income, residential domicile, and beneficiary category. For authoritative scheme-specific criteria, refer to the Scheme Directory or complete an individual preliminary estimate in the Eligibility Checker. When the backend AI function is in preview mode, verified knowledge templates are provided.',
    citations: [
      {
        title: 'myScheme Citizen Open Data Portal',
        sourceName: 'Government of India',
        sourceUrl: 'https://myscheme.gov.in',
        clauseReference: 'National Welfare Registry',
        isDemoCitation: false,
      },
    ],
    isLiveAi: false,
    isDemoFallback: true,
  }
}
