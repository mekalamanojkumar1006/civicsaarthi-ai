const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const transFile = path.join(root, 'src', 'locales', 'translations.ts');
const transContent = fs.readFileSync(transFile, 'utf8');

const hindiTranslations = {
  // Brand & App
  appName: 'सिविक सारथी एआई',
  tagline: 'नागरिक कल्याण एवं सरकारी योजना इंटेलिजेंस प्लेटफॉर्म',
  officialPortalDisclaimer: 'आधिकारिक पोर्टल संदर्भ • केवल प्रारंभिक सूचनात्मक मार्गदर्शन',
  builtForBharat: 'भारत के नागरिकों के लिए समर्पित',
  govTechCitizenAi: 'गवटेक सिटिजन एआई',

  // Navigation Items
  navDashboard: 'डैशबोर्ड',
  navSchemes: 'योजनाएं खोजें',
  navEligibility: 'पात्रता जांच',
  navAssistant: 'एआई सहायक',
  navDocumentAssistant: 'पीडीएफ सहायक',
  navDocuments: 'आवश्यक दस्तावेज़',
  navCompare: 'योजनाओं की तुलना',
  navSaved: 'सहेजी गई योजनाएं',
  navProfile: 'नागरिक प्रोफाइल',
  navSettings: 'सेटिंग्स',
  navAccount: 'खाता',
  navCitizenServices: 'नागरिक सेवाएं',
  navLogout: 'साइन आउट',
  navSignIn: 'साइन इन',
  navGetStarted: 'शुरू करें',

  // Subtitles
  subDashboard: 'आपकी पात्र योजनाओं और गतिविधियों का संक्षिप्त विवरण',
  subSchemes: '5,000+ से अधिक केंद्रीय और राज्य कल्याणकारी योजनाओं को खोजें',
  subEligibility: 'योजनाओं के लिए अपनी योग्यता स्थिति का मूल्यांकन करें',
  subAssistant: 'सिविक सारथी से अंग्रेजी, तेलुगु या हिंदी में संवाद करें',
  subDocumentAssistant: 'आधिकारिक परिपत्रों और अपलोड किए गए पीडीएफ का विश्लेषण करें',
  subDocuments: 'अपने नागरिक आवेदन दस्तावेजों को सत्यापित और प्रबंधित करें',
  subCompare: 'लाभों और पात्रता मानदंडों की साथ-साथ तुलना करें',
  subSaved: 'त्वरित पहुँच के लिए आपकी बुकमार्क की गई योजनाएं',
  subProfile: 'नागरिक पहचान और जनसांख्यिकीय विवरण',

  // Common Actions & Buttons
  btnSearch: 'खोजें',
  btnFilter: 'फ़िल्टर',
  btnApply: 'आधिकारिक पोर्टल पर आवेदन करें',
  btnCheckEligibility: 'पात्रता जांचें',
  btnSave: 'योजना सहेजें',
  btnSaved: 'सहेजा गया',
  btnRemove: 'हटाएं',
  btnUpload: 'दस्तावेज़ अपलोड करें',
  btnDownload: 'डाउनलोड',
  btnPreview: 'पूर्वावलोकन',
  btnDelete: 'हटाएं',
  btnCancel: 'रद्द करें',
  btnSubmit: 'जमा करें',
  btnBack: 'पीछे जाएं',
  btnNext: 'आगे बढ़ें',
  btnReset: 'रीसेट करें',
  btnRetry: 'पुनः प्रयास करें',
  btnRefresh: 'रिफ्रेश करें',
  btnClose: 'बंद करें',
  btnViewDetails: 'विवरण देखें',
  btnLoadDemo: 'डेमो प्रोफाइल लोड करें',
  btnClearAll: 'सभी हटाएं',
  btnRetest: 'पुनः पात्रता जांचें',
  btnSaveAssessment: 'मूल्यांकन सहेजें',

  // Common Labels
  labelSearchPlaceholder: 'योजनाएं, सब्सिडी या दस्तावेज़ खोजें...',
  labelLanguage: 'भाषा',
  labelCategory: 'श्रेणी',
  labelState: 'राज्य',
  labelBeneficiary: 'लाभार्थी प्रकार',
  labelStatus: 'स्थिति',
  labelEligibilityScore: 'तैयारी स्कोर',
  labelOfficialUrl: 'आधिकारिक मंत्रालय वेबसाइट',
  labelRequiredDocuments: 'आवश्यक दस्तावेज़',
  labelAllCategories: 'सभी श्रेणियां',
  labelAllStates: 'सभी राज्य',
  labelAllLevels: 'सभी स्तर (केंद्रीय एवं राज्य)',
  labelCentral: 'केंद्र सरकार',
  labelStateGovt: 'राज्य सरकार',
  labelSortBy: 'क्रमबद्ध करें',
  labelMatchScore: 'अनुकूलता स्कोर',
  labelAlphabetical: 'वर्णमाला अनुसार',

  // Categories
  catAgriculture: 'कृषि एवं किसानी',
  catHealth: 'स्वास्थ्य एवं चिकित्सा',
  catEducation: 'शिक्षा एवं छात्रवृत्ति',
  catHousing: 'आवास एवं ऊर्जा',
  catSocialWelfare: 'सामाजिक कल्याण एवं पेंशन',
  catWomenChild: 'महिला एवं बाल विकास',
  catFinance: 'वित्त एवं व्यवसाय',
  catEnergy: 'सौर एवं नवीकरणीय ऊर्जा',
  catEmployment: 'रोजगार एवं कौशल विकास',

  // Public Navbar & Footer
  footerDesc: 'भारतीय नागरिकों को अपनी स्थानीय भाषाओं में केंद्रीय और राज्य कल्याणकारी योजनाओं की पारदर्शी एआई खोज से सशक्त बनाना।',
  footerOfficialAlignment: 'आधिकारिक डेटा अनुकूलन',
  footerCitizensCol: 'नागरिक सेवाएं',
  footerExploreAll: 'सभी योजनाएं देखें',
  footerCheckEligibility: 'पात्रता जांचें',
  footerDocHelper: 'दस्तावेज़ सहायक',
  footerCompareSchemes: 'योजनाओं की तुलना करें',
  footerAiCol: 'एआई क्षमताएं',
  footerConversationalSaarthi: 'संवादात्मक सारथी',
  footerPdfCircularReader: 'पीडीएफ और परिपत्र विश्लेषक',
  footerTeluguNlp: 'बहुभाषी एनएलपी इंजन',
  footerVoiceAssistance: 'वॉइस सहायता (शीघ्र आ रहा है)',
  footerTransparencyCol: 'पारदर्शिता',
  footerTransparencyDesc: 'सिविक सारथी एआई एक स्वतंत्र नागरिक-सहायता उपकरण है। किसी एक मंत्रालय से संबद्ध नहीं है। हमेशा myScheme.gov.in जैसे आधिकारिक पोर्टलों पर सत्यापन करें।',
  footerCopyright: 'ओपन गवटेक आर्किटेक्चर।',
  footerPrivacy: 'गोपनीयता नीति',
  footerTerms: 'सेवा की शर्तें',
  footerDataSecurity: 'डेटा सुरक्षा',

  // Landing Page (HomePage)
  heroBadgeText: 'डिजिटल इंडिया के लिए सिविक एआई',
  heroBadgeTe: 'भारत सरकार की योजनाओं का मंच',
  heroHeading: 'सरकारी सेवाएं हुईं सरल',
  heroHeadingHighlight: 'हर नागरिक के लिए।',
  heroSubtitle: 'सरकारी योजनाओं की खोज करें, अपनी पात्रता समझें और एआई-संचालित सहायता से सार्वजनिक सेवाओं का लाभ उठाएं।',
  heroSearchPlaceholder: "योजनाएं खोजें: 'किसान सब्सिडी', 'विद्यार्थी छात्रवृत्ति', 'आवास योजना'...",
  heroBtnExplore: 'योजनाएं खोजें',
  heroBtnAskAi: 'एआई सहायक से पूछें',
  heroBtnCheck1Min: '1 मिनट में पात्रता जांचें',
  heroStatSchemesCount: '5,000+',
  heroStatSchemesLabel: 'केंद्रीय एवं राज्य योजनाएं',
  heroStatStatesCount: '28 राज्य',
  heroStatStatesLabel: 'देशव्यापी कवरेज',
  heroStatLangCount: 'हिंदी +',
  heroStatLangLabel: 'स्थानीय भाषा समर्थन',
  heroStatFreeCount: '100% निःशुल्क',
  heroStatFreeLabel: 'सार्वजनिक नागरिक सेवा',
  homeCatBadge: 'वर्गीकृत सूची',
  homeCatTitle: 'नागरिक श्रेणी अनुसार ब्राउज़ करें',
  homeCatSubtitle: 'अपने विशिष्ट जनसांख्यिकीय और व्यावसायिक समूह के लिए बनाई गई सार्वजनिक पहल खोजें।',
  homeCatViewAll: 'सभी 24 श्रेणियां देखें',
  homeFeaturedBadge: 'उच्च प्रभाव',
  homeFeaturedTitle: 'प्रमुख कल्याणकारी योजनाएं',
  homeFeaturedSubtitle: 'पर्याप्त वित्तीय और स्वास्थ्य लाभों वाले प्रमुख केंद्रीय और राज्य कार्यक्रम।',
  homeFeaturedBrowseAll: 'संपूर्ण निर्देशिका देखें',
  homeHowItWorksBadge: 'सरल 3-चरणीय प्रक्रिया',
  homeHowItWorksTitle: 'सिविक सारथी आपके लिए कैसे काम करता है',
  homeHowItWorksSubtitle: 'कोई कागजी उलझन नहीं। कोई छूटी हुई समय-सीमा नहीं। हम जटिल नीतिगत पीडीएफ को सरल चरणों में बदलते हैं।',
  homeStep1Title: 'अपनी प्रोफाइल बताएं',
  homeStep1Desc: 'सरल शब्दों में अपनी आयु, स्थान, आय स्तर और व्यवसाय दर्ज करें या हमारी त्वरित 1 मिनट की प्रश्नावली पूरी करें।',
  homeStep2Title: 'एआई उपयुक्त योजनाओं से मिलाता है',
  homeStep2Desc: 'हमारा इंजन हजारों केंद्रीय और राज्य कल्याणकारी दिशानिर्देशों का विश्लेषण करके उन कार्यक्रमों की सटीक पहचान करता है जिनके लिए आप पात्र हैं।',
  homeStep3Title: 'दस्तावेज़ सत्यापित करें और आवेदन करें',
  homeStep3Desc: 'आवश्यक प्रमाणपत्रों (आधार, आय, जाति) की सटीक चेकलिस्ट और सीधे आधिकारिक पोर्टल सबमिशन लिंक प्राप्त करें।',
  homeTeluguSupportBadge: 'प्रथम श्रेणी बहुभाषी समर्थन',
  homeTeluguHeading: 'अपनी मातृभाषा में सरकारी योजनाओं की जानकारी प्राप्त करें।',
  homeTeluguDesc: 'सिविक सारथी के माध्यम से आप हिंदी या तेलुगु में आसानी से पूछ सकते हैं या टाइप कर सकते हैं और आपके लिए लागू होने वाली योजनाओं की जानकारी ले सकते हैं।',
  homeTeluguBtnAsk: 'हिंदी में पूछें (Ask in Hindi)',
  homeTeluguBtnTelangana: 'राज्य योजनाएं (State Schemes)',
  homeTrustTitle: 'नागरिक गोपनीयता एवं पारदर्शिता प्रतिबद्धता',
  homeTrustDesc: 'सिविक सारथी एआई केवल एक सहायक इंटरफेस के रूप में कार्य करता है। हम संवेदनशील नागरिक दस्तावेज़ या बैंक विवरण संग्रहीत नहीं करते हैं। सभी योजना नियम केंद्रीय मंत्रालयों और राज्य कल्याण विभागों द्वारा प्रकाशित सार्वजनिक दिशानिर्देशों से संकलित हैं। हमेशा आधिकारिक पोर्टलों पर शर्तों का सत्यापन करें।',
  homeTrustPoint1: 'कोई बिचौलिया शुल्क नहीं',
  homeTrustPoint2: 'सीधे आधिकारिक पोर्टल',
  homeTrustPoint3: 'खुले सार्वजनिक मानक',

  // Authentication (Login & Register)
  authWelcomeBack: 'वापसी पर स्वागत है',
  authSignInSubtitle: 'अपने सिविक सारथी नागरिक पोर्टल में साइन इन करें',
  authEmailLabel: 'ईमेल पता',
  authPasswordLabel: 'पासवर्ड',
  authFullNameLabel: 'पूरा नाम',
  authPhoneLabel: 'मोबाइल नंबर',
  authStateLabel: 'राज्य',
  authDistrictLabel: 'ज़िला',
  authDobLabel: 'जन्म तिथि',
  authSignInBtn: 'साइन इन करें',
  authSignUpBtn: 'खाता बनाएं',
  authGoogleSignIn: 'गूगल के साथ जारी रखें',
  authOrDivider: 'या ईमेल से जारी रखें',
  authNoAccount: 'खाता नहीं है?',
  authHaveAccount: 'पहले से खाता है?',
  authAgreeTerms: 'मैं सेवा की शर्तों और गोपनीयता नीति से सहमत हूँ',
  authLoggingIn: 'साइन इन हो रहा है...',
  authCreatingAccount: 'खाता बनाया जा रहा है...',
  authSuccessSignIn: 'साइन इन सफल! डैशबोर्ड पर भेजा जा रहा है...',
  authSuccessSignUp: 'खाता सफलतापूर्वक पंजीकृत हुआ! आगे बढ़ रहे हैं...',

  // Dashboard specific
  dashGreeting: 'वापसी पर स्वागत है',
  dashActiveProfile: 'सक्रिय नागरिक प्रोफाइल',
  dashMatchedSchemes: 'अनुकूल योजनाएं',
  dashSavedCount: 'सहेजी गई योजनाएं',
  dashDocsReady: 'तैयार दस्तावेज़',
  dashRecentAssessments: 'हालिया पात्रता मूल्यांकन',
  dashTopSchemes: 'आपके लिए अनुशंसित पहल',
  dashQuickActions: 'त्वरित नागरिक क्रियाएं',
  dashExploreDesc: 'अपनी जनसांख्यिकीय प्रोफाइल के अनुरूप कल्याणकारी योजनाओं को ब्राउज़ और खोजें',
  dashVerifyEligibility: 'मिनटों में अपनी प्रारंभिक योग्यता का मूल्यांकन करें',
  dashNoAssessments: 'अभी तक कोई मूल्यांकन रिकॉर्ड नहीं है। परिणाम देखने के लिए अपनी पहली पात्रता जांच करें।',
  dashEstBenefit: 'अनुमानित वार्षिक लाभ',
  dashBenefitSub: 'पात्रता के आधार पर',
  dashUpdatedToday: 'आज अपडेट किया गया',
  dashNewBadge: '+3 नई',
  dashSavedPortal: 'आपके पोर्टल में सहेजी गई',
  dashDocsVerified: 'आधार, आय सत्यापित',
  dashDocsComplete: '71% पूर्ण',
  dashRecentChatsTitle: 'हालिया सारथी एआई चर्चाएं',
  dashOpenChat: 'चैट खोलें',
  dashAnswersSuffix: 'उत्तर',
  dashExploreCategories: 'श्रेणी निर्देशिकाएं देखें',
  dashAllCategoriesArrow: 'सभी श्रेणियां →',
  dashQuickTest: 'त्वरित परीक्षण',
  dashAiChat: 'एआई चैट',
  dashPdfAi: 'पीडीएफ एआई',
  dashSideBySide: 'तुलना',

  // Scheme Explorer specific
  schemesFound: 'योजनाएं उपलब्ध',
  schemesFilterDesc: 'सत्यापित केंद्रीय और राज्य पहल आधिकारिक पोर्टल लिंक के साथ प्रदर्शित',
  schemesNoMatch: 'आपके मानदंडों से मेल खाने वाली कोई योजना नहीं मिली',
  schemesNoMatchDesc: 'अपनी खोज, राज्य या श्रेणी फ़िल्टर समायोजित करने का प्रयास करें।',
  schemesClearFilters: 'सभी फ़िल्टर रीसेट करें',
  schemesSortRelevance: 'क्रम: मानक प्रासंगिकता',
  schemesSortMatchScore: 'क्रम: उच्चतम अनुकूलता स्कोर',
  schemesSortNewest: 'क्रम: नई शुरू की गई',
  schemesShowingCount: 'प्रदर्शित',
  schemesCountSuffix: 'योजनाएं',
  schemesGovtLevel: 'सरकारी स्तर',
  schemesLevelAll: 'सभी',
  schemesLevelCentral: 'केंद्रीय',
  schemesLevelState: 'राज्य',
  schemesLocationState: 'स्थान / राज्य',
  schemesBeneficiaryFocus: 'लाभार्थी वर्ग',
  schemesActiveFilters: 'सक्रिय फ़िल्टर:',
  schemesResetAll: 'सभी रीसेट करें',
  schemesFiltersMobile: 'फ़िल्टर',
  schemesGridView: 'ग्रिड दृश्य',
  schemesListView: 'सूची दृश्य',

  // Scheme Card & Detail specific
  cardCentralScheme: 'केंद्रीय योजना',
  cardStateScheme: 'राज्य योजना',
  cardMatch: 'अनुकूलता',
  cardBenefit: 'लाभ',
  cardFinancialSupport: 'वित्तीय सहायता',
  cardSubsidyAid: 'सब्सिडी एवं अनुदान',
  cardSaveScheme: 'योजना सहेजें',
  cardSavedScheme: 'सहेजा गया',
  detailBreadcrumbBack: 'योजनाओं पर वापस जाएं',
  detailShare: 'साझा करें',
  detailLinkCopied: 'लिंक कॉपी किया गया',
  detailMinistry: 'मंत्रालय / विभाग',
  detailPrimaryBenefit: 'प्राथमिक लाभ',
  detailSourceStatus: 'स्रोत स्थिति',
  detailVerified: 'सत्यापित',
  detailCoreObjectives: 'मुख्य उद्देश्य',
  detailBenefitGuarantee: 'लाभ गारंटी',
  detailEligibilityConditions: 'पात्रता शर्तें',
  detailMinAge: 'न्यूनतम आयु',
  detailMaxAge: 'अधिकतम आयु',
  detailTargetGender: 'लक्षित लिंग',
  detailIncomeCeiling: 'आय सीमा',
  detailDomicile: 'आवश्यक निवास',
  detailSpecificTerms: 'विशिष्ट शर्तें',
  detailVerifyCompatibility: 'मेरी प्रोफाइल अनुकूलता जांचें',
  detailRequiredDocs: 'आवश्यक दस्तावेज़',
  detailIssuingAuthority: 'जारीकर्ता प्राधिकरण',
  detailOpenReadinessChecklist: 'दस्तावेज़ तत्परता चेकलिस्ट खोलें',
  detailSourceVerification: 'स्रोत एवं सत्यापन विवरण',
  detailSource: 'स्रोत',
  detailType: 'प्रकार',
  detailHelpline: 'हेल्पलाइन',
  detailOfficialSubmissionLink: 'आधिकारिक आवेदन लिंक',
  schemeOverview: 'योजना अवलोकन एवं उद्देश्य',
  schemeKeyBenefits: 'प्रमुख वित्तीय एवं कल्याणकारी लाभ',
  schemeEligibilityCriteria: 'कौन पात्र है?',
  schemeMandatoryDocs: 'अनिवार्य आवेदन दस्तावेज़',
  schemeHowToApply: 'चरण-दर-चरण आवेदन प्रक्रिया',
  schemeNodalAgency: 'नोडल मंत्रालय / विभाग',
  schemeLaunchYear: 'प्रारंभ वर्ष',
  schemeHelpline: 'नागरिक हेल्पलाइन',

  // Eligibility Checker specific
  elStep1: 'बुनियादी जनसांख्यिकी',
  elStep2: 'स्थान एवं निवास',
  elStep3: 'आय एवं व्यवसाय',
  elStep4: 'योजना-विशिष्ट प्रश्न',
  elStep5: 'पात्रता मूल्यांकन',
  elChooseSchemeStep: 'चरण 1: मूल्यांकन के लिए योजना चुनें',
  elChooseSchemeDesc: 'हमारे सत्यापित केंद्रीय और राज्य कल्याणकारी कार्यक्रमों की सूची में से चुनें।',
  elPersonalStep: 'चरण 2: नागरिक व्यक्तिगत विवरण',
  elPersonalDesc: 'आपकी प्रोफाइल से पूर्व-भरा गया। आप इस सिमुलेशन के लिए इन मानों को बदल सकते हैं।',
  elEconomicStep: 'चरण 3: आर्थिक एवं भूमि स्वामित्व स्थिति',
  elEconomicDesc: 'आय सीमा और संपत्ति मानदंड सीधे सब्सिडी सीमाओं को निर्धारित करते हैं।',
  elSchemeSpecificStep: 'चरण 4: योजना-विशिष्ट शर्तें',
  elSchemeSpecificDesc: 'आधिकारिक राजपत्र से निकाले गए विशेष नीतिगत आवश्यकताएं।',
  elResultsStep: 'चरण 5: मूल्यांकन एवं सिफारिशें',
  elApplicantAge: 'आवेदक की आयु (वर्ष)',
  elGender: 'लिंग',
  elStateDomicile: 'निवास का राज्य',
  elDistrict: 'ज़िला',
  elSocialCategory: 'सामाजिक श्रेणी',
  elAnnualIncome: 'वार्षिक पारिवारिक आय (₹)',
  elRationCard: 'राशन कार्ड का प्रकार',
  elLandholding: 'खेती योग्य भूमि (एकड़)',
  elGovtEmployee: 'क्या परिवार का कोई सदस्य सरकारी कर्मचारी या आयकर दाता है?',
  elOwnsLand: 'क्या आपके पास पंजीकृत कृषि भूमि का मालिकाना हक है?',
  elRooftopSpace: 'क्या आपके पास सोलर पैनल के लिए छाया-रहित छत की जगह है?',
  elPowerConnection: 'क्या आपके पास सक्रिय घरेलू बिजली उपभोक्ता कनेक्शन है?',
  elEnrolledInstitution: 'क्या मान्यता प्राप्त पोस्ट-मैट्रिक शिक्षण संस्थान में नामांकित हैं?',
  elGirlChildUnder10: 'क्या खाता खोलते समय बालिका की आयु 10 वर्ष से कम है?',
  elRunAssessment: 'पात्रता मूल्यांकन चलाएं',
  elPreviousStep: 'पिछला चरण',
  elNextStep: 'अगला चरण',
  elSaveSuccess: 'मूल्यांकन सुपाबेस डेटाबेस में सुरक्षित सहेजा गया',
  elSaveLocal: 'सिमुलेशन स्थानीय सत्र में सहेजा गया',
  elRetestEvaluation: 'पुनः मूल्यांकन करें',
  elViewDocuments: 'आवश्यक दस्तावेज़ देखें',
  elApplyOfficial: 'आधिकारिक पोर्टल पर आवेदन करें',
  elLikelyEligible: 'संभावित रूप से पात्र (स्व-रिपोर्टेड)',
  elConditional: 'सशर्त / अतिरिक्त सत्यापन आवश्यक',
  elLikelyIneligible: 'ध्यान देने की आवश्यकता / संभवतः अपात्र',
  elMetCriteria: 'संतुष्ट पात्रता मानदंड',
  elUnmetCriteria: 'असंतुष्ट पात्रता मानदंड',
  elWarnings: 'महत्वपूर्ण परामर्श',
  elHistory: 'मूल्यांकन इतिहास',
  elNewCheck: 'नया मूल्यांकन शुरू करें',
  elNoHistory: 'कोई पूर्व मूल्यांकन रिकॉर्ड नहीं मिला।',

  // Saved Schemes specific
  savedTitle: 'मेरी सहेजी गई योजनाएं',
  savedSubtitle: 'त्वरित ट्रैकिंग और आवेदन के लिए आपके द्वारा पिन किए गए कार्यक्रम',
  savedEmpty: 'अभी तक कोई योजना सहेजी नहीं गई',
  savedEmptyDesc: 'योजना निर्देशिका ब्राउज़ करें और योजनाओं को सहेजने के लिए बुकमार्क आइकन पर क्लिक करें।',
  savedSyncStatus: 'लाइव डेटाबेस से समन्वयित',

  // Documents Page specific
  docLockerTitle: 'नागरिक दस्तावेज़ लॉकर',
  docChecklistTitle: 'आवश्यकता चेकलिस्ट',
  docUploadBox: 'अपलोड करने के लिए फ़ाइलें यहाँ क्लिक करें या खींचें (PDF, JPEG, PNG, अधिकतम 15MB)',
  docEmpty: 'अभी तक कोई दस्तावेज़ अपलोड नहीं किया गया',
  docEmptyDesc: 'आवेदन की तैयारी ट्रैक करने के लिए पहचान और आय प्रमाण पत्र अपलोड करें।',
  docReadiness: 'आवेदन तत्परता स्कोर',
  docEncrypted: 'सुपाबेस निजी स्टोरेज नीतियों और उपयोगकर्ता स्वामित्व अलगाव के साथ सुरक्षित।',
  docLockerTab: 'दस्तावेज़ लॉकर',
  docChecklistTab: 'आवश्यकता चेकलिस्ट',
  docUploadNew: 'नया दस्तावेज़ अपलोड करें',
  docSelectCategory: 'दस्तावेज़ श्रेणी चुनें',
  docChooseFile: 'फ़ाइल चुनें',
  docDragDrop: 'अपनी फ़ाइल यहाँ खींचें या ब्राउज़ करने के लिए क्लिक करें',
  docAllowedFormats: 'समर्थित प्रारूप: PDF, JPEG, PNG (अधिकतम 15 MB)',
  docUploading: 'सुरक्षित रूप से अपलोड हो रहा है...',
  docUploadedSuccess: 'दस्तावेज़ सफलतापूर्वक अपलोड किया गया!',
  docTableColName: 'दस्तावेज़ का नाम',
  docTableColCategory: 'श्रेणी',
  docTableColSize: 'आकार',
  docTableColDate: 'अपलोड तिथि',
  docTableColActions: 'क्रियाएं',
  docActionView: 'देखें',
  docActionDelete: 'हटाएं',
  docStatusAvailable: 'उपलब्ध',
  docStatusNeedObtain: 'प्राप्त करना बाकी',
  docStatusMissing: 'अनुपलब्ध',
  docMandatory: 'अनिवार्य',
  docOptional: 'वैकल्पिक',
  docHowToObtain: 'कैसे प्राप्त करें',

  // Profile Page specific
  profileTitle: 'नागरिक प्रोफाइल एवं जनसांख्यिकी',
  profileSubtitle: 'अपनी पहचान, निवास और सामाजिक-आर्थिक विवरण प्रबंधित करें',
  profileCompleteness: 'प्रोफाइल पूर्णता',
  profilePersonal: 'व्यक्तिगत जानकारी',
  profileDomicile: 'स्थायी निवास विवरण',
  profileEconomic: 'सामाजिक-आर्थिक पृष्ठभूमि',
  profileUpdatedSuccess: 'प्रोफाइल सफलतापूर्वक अपडेट की गई!',
  profileLoadDemo: 'डेमो प्रोफाइल लोड करें',
  profileReset: 'रीसेट करें',
  profileSave: 'प्रोफाइल अपडेट करें',
  profileIdentityBadge: 'नागरिक पहचान केंद्र',

  // Compare Page specific
  compareTitle: 'कल्याणकारी योजनाओं की तुलना',
  compareSubtitle: 'लाभों, मानदंडों और दस्तावेज़ीकरण का सीधा साथ-साथ विश्लेषण',
  compareAddScheme: 'योजना जोड़ें',
  compareSelectScheme: 'तुलना के लिए योजना चुनें',
  compareRemove: 'हटाएं',
  compareFinancialBenefit: 'वित्तीय एवं कल्याणकारी लाभ',
  compareEligibilityCriteria: 'पात्रता मानदंड',
  compareRequiredDocs: 'अनिवार्य दस्तावेज़',
  compareNodalAgency: 'नोडल प्राधिकरण',
  compareOfficialPortal: 'आधिकारिक पोर्टल',

  // Assistant Chat specific
  chatTitle: 'सिविक सारथी एआई सहायक',
  chatSubtitle: 'जेमिनी एआई बैकएंड एवं ज्ञान इंजन',
  chatHistory: 'वार्तालाप इतिहास',
  chatNewChat: 'नई बातचीत',
  chatOfficialAdvisory: 'आधिकारिक परामर्श',
  chatAdvisoryText: 'सिविक सारथी एआई केंद्रीय और राज्य कल्याणकारी योजनाओं के लिए प्रारंभिक मार्गदर्शन प्रदान करता है। सभी उत्तरों में आधिकारिक सरकारी पोर्टल लिंक शामिल हैं।',
  chatPlaceholder: 'किसी भी केंद्रीय या राज्य योजना, सब्सिडी या प्रमाणपत्र के बारे में पूछें...',
  chatSearching: 'मंत्रालय के दिशानिर्देशों और परिपत्रों की खोज की जा रही है...',
  chatCopy: 'कॉपी करें',
  chatCopied: 'कॉपी हो गया',
  chatSourceRefs: 'आधिकारिक स्रोत संदर्भ',

  // Notifications & User Profile Menu
  notifTitle: 'सूचनाएं',
  notifNew: 'नई',
  notifMarkAllRead: 'सभी को पढ़ा हुआ चिह्नित करें',
  notifEmpty: 'वर्तमान में कोई सूचना नहीं है',
  userMenuProfile: 'नागरिक प्रोफाइल',
  userMenuSaved: 'सहेजी गई योजनाएं',
  userMenuSettings: 'सुरक्षा एवं सेटिंग्स',
  userMenuSignOut: 'खाते से साइन आउट करें',
  userMenuExitSession: 'सत्र समाप्त करें',

  // Disclaimers
  disclaimerPreliminary: 'प्रारंभिक सूचनात्मक अनुमान मात्र। आधिकारिक स्वीकृति और धनराशि जारी करना केवल संबंधित सरकारी विभाग द्वारा वैधानिक सत्यापन के बाद ही किया जाता है।',
  disclaimerPrivateDocs: 'अपलोड किए गए नागरिक दस्तावेज़ सुपाबेस रो लेवल सिक्योरिटी के तहत सुरक्षित हैं और कभी भी सार्वजनिक यूआरएल के माध्यम से सुलभ नहीं होते हैं।',
};

// Verify keys parity with English
const enMatch = transContent.match(/en:\s*\{([\s\S]*?)\},\s*te:/);
const enRegex = /^\s*([a-zA-Z0-9_]+)\s*:/gm;
const enKeys = [];
let em;
while ((em = enRegex.exec(enMatch[1])) !== null) {
  enKeys.push(em[1]);
}

const hiKeys = Object.keys(hindiTranslations);
const missingInHi = enKeys.filter(k => !hindiTranslations[k]);
const extraInHi = hiKeys.filter(k => !enKeys.includes(k));

console.log('En keys count:', enKeys.length);
console.log('Hi keys count:', hiKeys.length);
console.log('Missing in Hi:', missingInHi);
console.log('Extra in Hi:', extraInHi);

if (missingInHi.length > 0 || extraInHi.length > 0) {
  console.error('Parity check failed!');
  process.exit(1);
}

console.log('100% key parity verified between English and Hindi!');

// Format Hindi block
let hiFormatted = '  hi: {\n';
for (const [k, v] of Object.entries(hindiTranslations)) {
  const escaped = v.replace(/'/g, "\\'");
  hiFormatted += `    ${k}: '${escaped}',\n`;
}
hiFormatted += '  },\n';

// Replace in translations.ts:
// Change export type Language = 'en' | 'te' to export type Language = 'en' | 'te' | 'hi'
let newTrans = transContent.replace(
  "export type Language = 'en' | 'te'",
  "export type Language = 'en' | 'te' | 'hi'"
);

// Append hi block after te block before "as const"
const teEndRegex = /(te:\s*\{[\s\S]*?\n  \},)/;
if (!newTrans.match(teEndRegex)) {
  console.error('Could not match te block end!');
  process.exit(1);
}

newTrans = newTrans.replace(teEndRegex, `$1\n\n${hiFormatted}`);

fs.writeFileSync(transFile, newTrans);
console.log('Successfully wrote translations.ts with full Hindi support!');
