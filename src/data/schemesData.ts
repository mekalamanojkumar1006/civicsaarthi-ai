/**
 * Centralized Government Scheme Data for CivicSaarthi AI.
 *
 * IMPORTANT DATA INTEGRITY & DEMONSTRATION NOTICE:
 * All records here are structured for prototype/demonstration purposes based on
 * publicly available information from Central Ministry portals (e.g. myScheme.gov.in)
 * and State Government websites.
 *
 * Current Status: Demonstration Record.
 * These records are NOT fetched dynamically from live government databases or official Gazette APIs.
 * Final eligibility, sanction, and subsidy disbursal can only be granted by the designated
 * government departments and competent authorities.
 */

export interface SchemeSourceMetadata {
  sourceTitle: string
  sourceUrl: string
  sourceType: 'Official Ministry Portal' | 'Statutory Operational Guidelines' | 'State Government Portal' | 'Public Informational Framework'
  lastVerifiedDate?: string
  verificationStatus: 'Demonstration Record' | 'Official Portal Reference' | 'Requires Verification'
  requiresPeriodicUpdate: boolean
  periodicUpdateNotice?: string
}

export interface DetailedScheme {
  id: string
  title: string
  titleTelugu: string
  titleHindi?: string
  category: 'Agriculture' | 'Health' | 'Housing' | 'Education' | 'Energy' | 'Finance' | 'Women & Child' | 'Employment'
  level: 'Central' | 'State'
  state?: string
  ministry: string
  nodalAgency?: string
  launchYear: number
  beneficiaryType: ('Farmers' | 'Women' | 'Students' | 'Small Business' | 'Low Income' | 'Senior Citizens' | 'Youth')[]
  shortDescription: string
  detailedDescription: string
  objectives: string[]
  benefitAmount: string
  benefitFrequency: 'Annual' | 'Monthly' | 'One-Time' | 'Revolving' | 'Insurance Cover'
  benefitsList: string[]
  eligibility: {
    minAge?: number
    maxAge?: number
    gender?: 'All' | 'Female' | 'Male'
    maxAnnualIncome?: number
    casteCategories?: string[]
    occupation?: string[]
    landholdingLimit?: string
    residenceRequired?: string
    specificConditions: string[]
  }
  requiredDocuments: {
    name: string
    type: 'Identity' | 'Income' | 'Land' | 'Education' | 'Banking' | 'Caste' | 'Other'
    description: string
    isMandatory: boolean
    issuingAuthority: string
  }[]
  applicationProcess: {
    stepNumber: number
    title: string
    description: string
    portalUrl?: string
  }[]
  officialPortalUrl: string
  helplineNumber?: string
  verificationStatus: 'Demonstration Record' | 'Official Portal Reference' | 'Requires Verification'
  sourceMetadata: SchemeSourceMetadata
  lastAuditDate: string
  matchScoreDefault: number
}

export const CENTRAL_AND_STATE_SCHEMES: DetailedScheme[] = [
  {
    id: 'pm-kisan',
    title: 'PM Kisan Samman Nidhi Yojana',
    titleTelugu: 'ప్రధాన మంత్రి కిసాన్ సమ్మాన్ నిధి యోజన',
    titleHindi: 'पीएम किसान सम्मान निधि योजना',
    category: 'Agriculture',
    level: 'Central',
    ministry: 'Ministry of Agriculture & Farmers Welfare',
    nodalAgency: 'Department of Agriculture & Farmers Welfare, GoI',
    launchYear: 2019,
    beneficiaryType: ['Farmers', 'Low Income'],
    shortDescription: 'Income support of ₹6,000 per year in three equal instalments of ₹2,000 to eligible landholding farmer families.',
    detailedDescription: 'The Pradhan Mantri Kisan Samman Nidhi (PM-KISAN) is a Central Sector scheme with 100% funding from the Government of India. It aims to supplement the financial needs of landholding farmers in procuring various agricultural inputs to ensure proper crop health and appropriate yields, commensurate with the anticipated farm income.',
    objectives: [
      'Augment the income of all eligible landholding farmer families across India.',
      'Address liquidity constraints in procuring seeds, fertilizers, and equipment.',
      'Protect farmers from falling into the trap of non-institutional moneylenders.'
    ],
    benefitAmount: '₹6,000 / Year',
    benefitFrequency: 'Annual',
    benefitsList: [
      '₹6,000 transferred directly into Aadhaar-seeded, NPCI-linked bank accounts via DBT.',
      'Disbursed in three equal four-monthly instalments of ₹2,000 each (subject to state verification and e-KYC).',
      'Direct government transfer with zero intermediary commission or fees.'
    ],
    eligibility: {
      minAge: 18,
      gender: 'All',
      occupation: ['Farmer', 'Small & Marginal Cultivator'],
      specificConditions: [
        'Family must hold cultivable agricultural land registered in state land revenue records.',
        'Excludes institutional landholders and families where any member is a serving or retired government officer/employee.',
        'Excludes income tax payees of the last assessment year and professionals (doctors, engineers, lawyers, CAs).'
      ]
    },
    requiredDocuments: [
      {
        name: 'Aadhaar Card',
        type: 'Identity',
        description: 'Mandatory Aadhaar identity document linked with active mobile number for e-KYC.',
        isMandatory: true,
        issuingAuthority: 'UIDAI'
      },
      {
        name: 'Land Record (Pattadar Passbook / RoR-1B / Mutation Extract)',
        type: 'Land',
        description: 'Official land record proving ownership of cultivable land in applicant name.',
        isMandatory: true,
        issuingAuthority: 'State Revenue Department / MeeSeva / Land Records Portal'
      },
      {
        name: 'Aadhaar-Seeded Bank Passbook / NPCI Mapping',
        type: 'Banking',
        description: 'Active savings bank account linked to NPCI mapper for Direct Benefit Transfer.',
        isMandatory: true,
        issuingAuthority: 'Commercial / Regional Rural Bank'
      }
    ],
    applicationProcess: [
      {
        stepNumber: 1,
        title: 'Online Registration or CSC Visit',
        description: 'Apply on pmkisan.gov.in under Farmers Corner or visit a registered Common Service Centre (CSC).',
        portalUrl: 'https://pmkisan.gov.in'
      },
      {
        stepNumber: 2,
        title: 'Aadhaar Authentication & Land Record Entry',
        description: 'Submit 12-digit Aadhaar number, state, district, sub-district, and land survey/khata number.'
      },
      {
        stepNumber: 3,
        title: 'e-KYC Completion',
        description: 'Complete OTP-based e-KYC via registered mobile or biometric authentication at a CSC.'
      },
      {
        stepNumber: 4,
        title: 'State Nodal Verification & DBT Approval',
        description: 'State agriculture authorities verify land records before release of central instalments.'
      }
    ],
    officialPortalUrl: 'https://pmkisan.gov.in',
    helplineNumber: '155261 / 011-24300606',
    verificationStatus: 'Demonstration Record',
    sourceMetadata: {
      sourceTitle: 'PM-KISAN Official Portal, Ministry of Agriculture & Farmers Welfare',
      sourceUrl: 'https://pmkisan.gov.in',
      sourceType: 'Official Ministry Portal',
      lastVerifiedDate: '2024-11-15',
      verificationStatus: 'Demonstration Record',
      requiresPeriodicUpdate: true,
      periodicUpdateNotice: 'Beneficiary lists, e-KYC deadlines, and instalment release schedules are updated periodically by the Ministry of Agriculture.'
    },
    lastAuditDate: '2024-11-15',
    matchScoreDefault: 98
  },
  {
    id: 'ayushman-bharat',
    title: 'Ayushman Bharat PM-JAY',
    titleTelugu: 'ఆయుష్మాన్ భారత్ ప్రధాన్ మంత్రి జన్ ఆరోగ్య యోజన',
    titleHindi: 'आयुष्मान भारत - प्रधानमंत्री जन आरोग्य योजना (पीएम-जय)',
    category: 'Health',
    level: 'Central',
    ministry: 'Ministry of Health and Family Welfare',
    nodalAgency: 'National Health Authority (NHA)',
    launchYear: 2018,
    beneficiaryType: ['Low Income', 'Senior Citizens', 'Women'],
    shortDescription: 'National health assurance initiative providing health cover of up to ₹5 lakh per family per year for secondary and tertiary hospitalization.',
    detailedDescription: 'Ayushman Bharat Pradhan Mantri Jan Arogya Yojana (PM-JAY) provides cashless and paperless access to healthcare services for eligible families at empaneled public and private hospitals across India, subject to defined entitlement databases.',
    objectives: [
      'Mitigate catastrophic health expenditures for vulnerable and underprivileged households.',
      'Provide cashless treatment for covered medical and surgical procedures.',
      'Ensure portability of treatment across empaneled network hospitals throughout India.'
    ],
    benefitAmount: '₹5,00,000 / Family / Year',
    benefitFrequency: 'Insurance Cover',
    benefitsList: [
      'Cashless coverage up to ₹5 Lakh per eligible family per year for inpatient treatment.',
      'Pre-hospitalization (up to 3 days) and post-hospitalization (up to 15 days) diagnostic and medicine coverage.',
      'Pre-existing conditions covered from day one in empaneled hospitals.'
    ],
    eligibility: {
      gender: 'All',
      maxAnnualIncome: 250000,
      specificConditions: [
        'Households identified in SECC 2011 database based on deprivation criteria, or state-specific food security/NFSA ration card lists.',
        'Senior citizens aged 70 years and above are being enrolled under the expanded Ayushman Vay Vandana card framework.',
        'Beneficiary must hold an active Ayushman Card issued after Aadhaar e-KYC.'
      ]
    },
    requiredDocuments: [
      {
        name: 'Aadhaar Card',
        type: 'Identity',
        description: 'Mandatory Aadhaar card for biometric identity and e-KYC verification.',
        isMandatory: true,
        issuingAuthority: 'UIDAI'
      },
      {
        name: 'Ration Card (NFSA / BPL / Food Security Card)',
        type: 'Income',
        description: 'Official ration card showing family tree and category proof.',
        isMandatory: true,
        issuingAuthority: 'State Civil Supplies Department'
      }
    ],
    applicationProcess: [
      {
        stepNumber: 1,
        title: 'Check Am I Eligible',
        description: 'Visit beneficiary.nha.gov.in or download the official Ayushman App to verify database inclusion.',
        portalUrl: 'https://beneficiary.nha.gov.in'
      },
      {
        stepNumber: 2,
        title: 'e-KYC Authentication',
        description: 'Authenticate using Aadhaar OTP, IRIS, or biometric fingerprint scanner.'
      },
      {
        stepNumber: 3,
        title: 'Ayushman Card Download',
        description: 'Download the digital Ayushman card or obtain a printed PVC card at an empaneled hospital / CSC.'
      }
    ],
    officialPortalUrl: 'https://nha.gov.in',
    helplineNumber: '14555',
    verificationStatus: 'Demonstration Record',
    sourceMetadata: {
      sourceTitle: 'National Health Authority (NHA) Official PM-JAY Portal',
      sourceUrl: 'https://nha.gov.in',
      sourceType: 'Official Ministry Portal',
      lastVerifiedDate: '2024-11-15',
      verificationStatus: 'Demonstration Record',
      requiresPeriodicUpdate: true,
      periodicUpdateNotice: 'Empaneled hospital lists, package procedure rates, and state-level convergence criteria are subject to periodic review by the NHA.'
    },
    lastAuditDate: '2024-11-15',
    matchScoreDefault: 95
  },
  {
    id: 'pm-surya-ghar',
    title: 'PM Surya Ghar: Muft Bijli Yojana',
    titleTelugu: 'పీఎం సూర్య ఘర్: ఉచిత విద్యుత్ యోజన',
    titleHindi: 'पीएम सूर्य घर: मुफ्त बिजली योजना',
    category: 'Energy',
    level: 'Central',
    ministry: 'Ministry of New and Renewable Energy',
    nodalAgency: 'National Programme Implementation Agency (REC Ltd)',
    launchYear: 2024,
    beneficiaryType: ['Low Income', 'Farmers', 'Youth'],
    shortDescription: 'Central financial assistance up to ₹78,000 for installing residential rooftop solar systems to reduce household power costs.',
    detailedDescription: 'Launched to promote residential rooftop solar installations across India. Eligible households receive direct capital subsidies credited after technical feasibility approval, installation by an empaneled vendor, and DISCOM net-meter inspection.',
    objectives: [
      'Incentivize residential households to generate clean rooftop solar electricity.',
      'Provide capital subsidy slabs based on system capacity (up to ₹78,000 for 3kW+).',
      'Enable households to supply surplus power back to the grid in accordance with state DISCOM net-metering regulations.'
    ],
    benefitAmount: 'Up to ₹78,000 Subsidy',
    benefitFrequency: 'One-Time',
    benefitsList: [
      '₹30,000 flat capital subsidy for 1 kW capacity system.',
      '₹60,000 flat capital subsidy for 2 kW capacity system.',
      '₹78,000 maximum capital subsidy for 3 kW and higher residential systems.',
      'Concessional collateral-free bank loans available through national portal partners.'
    ],
    eligibility: {
      gender: 'All',
      specificConditions: [
        'Must be an Indian citizen with an active domestic/residential electricity consumer connection.',
        'Must possess unshaded, structurally sound rooftop space suitable for solar mounting.',
        'Must not have availed a previous central government rooftop solar subsidy for the same consumer connection.'
      ]
    },
    requiredDocuments: [
      {
        name: 'Recent Electricity Bill',
        type: 'Other',
        description: 'Latest bill showing Consumer Service Number, tariff category, and DISCOM name.',
        isMandatory: true,
        issuingAuthority: 'State Electricity Distribution Company (DISCOM)'
      },
      {
        name: 'Aadhaar Card of Electricity Consumer',
        type: 'Identity',
        description: 'Identity proof matching or relating to the electricity connection account.',
        isMandatory: true,
        issuingAuthority: 'UIDAI'
      },
      {
        name: 'Bank Passbook / Cancelled Cheque',
        type: 'Banking',
        description: 'Aadhaar-seeded bank account for direct subsidy credit via PFMS.',
        isMandatory: true,
        issuingAuthority: 'Commercial / Scheduled Bank'
      }
    ],
    applicationProcess: [
      {
        stepNumber: 1,
        title: 'Portal Registration',
        description: 'Register on pmsuryaghar.gov.in by choosing State, DISCOM, and Consumer Account Number.',
        portalUrl: 'https://pmsuryaghar.gov.in'
      },
      {
        stepNumber: 2,
        title: 'Technical Feasibility & Vendor Engagement',
        description: 'Submit rooftop capacity application. DISCOM reviews technical feasibility, after which an empaneled vendor installs the plant.'
      },
      {
        stepNumber: 3,
        title: 'Net-Meter Inspection & Commissioning',
        description: 'DISCOM inspects installation, installs bidirectional net meter, and uploads the commissioning certificate.'
      },
      {
        stepNumber: 4,
        title: 'Direct Subsidy Disbursal',
        description: 'Subsidy is disbursed directly to the consumer verified bank account via PFMS.'
      }
    ],
    officialPortalUrl: 'https://pmsuryaghar.gov.in',
    helplineNumber: '15555',
    verificationStatus: 'Demonstration Record',
    sourceMetadata: {
      sourceTitle: 'PM Surya Ghar National Portal, Ministry of New & Renewable Energy',
      sourceUrl: 'https://pmsuryaghar.gov.in',
      sourceType: 'Official Ministry Portal',
      lastVerifiedDate: '2024-11-15',
      verificationStatus: 'Demonstration Record',
      requiresPeriodicUpdate: true,
      periodicUpdateNotice: 'Subsidy slabs, technical benchmark standards, and empaneled vendor regulations are periodically issued by MNRE.'
    },
    lastAuditDate: '2024-11-15',
    matchScoreDefault: 92
  },
  {
    id: 'rythu-bandhu',
    title: 'Rythu Bharosa / Rythu Bandhu Scheme',
    titleTelugu: 'రైతు భరోసా / రైతు బంధు పథకం',
    titleHindi: 'रैतु भरोसा / रैतु बंधु योजना (तेलंगाना)',
    category: 'Agriculture',
    level: 'State',
    state: 'Telangana',
    ministry: 'Department of Agriculture & Farmers Welfare, Government of Telangana',
    launchYear: 2018,
    beneficiaryType: ['Farmers'],
    shortDescription: 'State investment assistance providing financial grants to eligible landholding farmers in Telangana for agricultural inputs.',
    detailedDescription: 'An agricultural investment support initiative in Telangana designed to support farmers in purchasing seeds, fertilizers, and field preparation inputs before crop sowing seasons, subject to prevailing state guidelines and budget allocations.',
    objectives: [
      'Provide direct agricultural investment assistance before the sowing seasons.',
      'Support eligible small and marginal cultivators documented in state land records.',
      'Lessen reliance on non-institutional informal credit channels.'
    ],
    benefitAmount: 'Per Acre Investment Support (Subject to State Orders)',
    benefitFrequency: 'Annual',
    benefitsList: [
      'Seasonal investment support credited per acre of cultivable landholding.',
      'Disbursed directly into verified farmer bank accounts through state treasury systems.',
      'Applicable across notified agricultural seasons as per state government sanction.'
    ],
    eligibility: {
      residenceRequired: 'Telangana',
      occupation: ['Farmer', 'Pattadar'],
      specificConditions: [
        'Must own agricultural land recorded in Telangana state revenue registries (Dharani/RoR).',
        'Must possess an active Pattadar passbook with Aadhaar linkage.',
        'Subject to prevailing state government eligibility criteria and land ceiling regulations.'
      ]
    },
    requiredDocuments: [
      {
        name: 'Pattadar Passbook / Dharani Record',
        type: 'Land',
        description: 'Digitally verified agricultural land title from Telangana Revenue Department.',
        isMandatory: true,
        issuingAuthority: 'Telangana Revenue / Dharani Portal'
      },
      {
        name: 'Aadhaar Card',
        type: 'Identity',
        description: 'Identity proof of the landholder.',
        isMandatory: true,
        issuingAuthority: 'UIDAI'
      },
      {
        name: 'Bank Account Passbook Copy',
        type: 'Banking',
        description: 'Active savings account for state treasury direct transfer.',
        isMandatory: true,
        issuingAuthority: 'Scheduled / Commercial Bank'
      }
    ],
    applicationProcess: [
      {
        stepNumber: 1,
        title: 'Land Record Verification',
        description: 'Agricultural Extension Officer (AEO) reviews land records registered under Dharani.'
      },
      {
        stepNumber: 2,
        title: 'Bank & Aadhaar Linkage',
        description: 'Confirm bank details on the official state portal or through local agricultural nodal officers.',
        portalUrl: 'https://rythubandhu.telangana.gov.in'
      },
      {
        stepNumber: 3,
        title: 'Treasury Disbursal',
        description: 'Funds are transferred to verified farmer accounts during scheduled disbursement windows.'
      }
    ],
    officialPortalUrl: 'https://rythubandhu.telangana.gov.in',
    helplineNumber: '040-23383520',
    verificationStatus: 'Demonstration Record',
    sourceMetadata: {
      sourceTitle: 'Rythu Bandhu / Rythu Bharosa Portal, Government of Telangana',
      sourceUrl: 'https://rythubandhu.telangana.gov.in',
      sourceType: 'State Government Portal',
      lastVerifiedDate: '2024-11-15',
      verificationStatus: 'Demonstration Record',
      requiresPeriodicUpdate: true,
      periodicUpdateNotice: 'State investment support amounts, tenant eligibility norms, and disbursement schedules are subject to revised state government orders and budgetary allocations.'
    },
    lastAuditDate: '2024-11-15',
    matchScoreDefault: 94
  },
  {
    id: 'kalyana-lakshmi',
    title: 'Kalyana Lakshmi / Shaadi Mubarak Scheme',
    titleTelugu: 'కళ్యాణ లక్ష్మి / షాదీ ముబారక్ పథకం',
    titleHindi: 'कल्याणा लक्ष्मी / शादी मुबारक योजना',
    category: 'Women & Child',
    level: 'State',
    state: 'Telangana',
    ministry: 'Scheduled Castes, BC & Minority Welfare Department, Telangana',
    launchYear: 2014,
    beneficiaryType: ['Women', 'Low Income'],
    shortDescription: 'One-time financial assistance of ₹1,00,116 to unmarried brides from economically disadvantaged SC, ST, BC, EBC, and Minority families.',
    detailedDescription: 'A welfare program implemented by the Government of Telangana to curb child marriage and provide financial relief to low-income families at the time of a daughter’s marriage, conditioned on strict statutory age and income limits.',
    objectives: [
      'Prevent child marriages by strictly mandating minimum age of 18 years for the bride.',
      'Alleviate financial distress for underprivileged families during daughter’s marriage.',
      'Empower young women and support social security.'
    ],
    benefitAmount: '₹1,00,116 One-Time',
    benefitFrequency: 'One-Time',
    benefitsList: [
      'One-time grant of ₹1,00,116 sanctioned and credited into the bank account of the bride’s mother.',
      'Direct government treasury disbursement.'
    ],
    eligibility: {
      minAge: 18,
      gender: 'Female',
      maxAnnualIncome: 200000,
      residenceRequired: 'Telangana',
      casteCategories: ['SC', 'ST', 'BC', 'EBC', 'Minority'],
      specificConditions: [
        'Bride must have completed 18 years of age at the time of marriage.',
        'Combined annual parental family income must not exceed ₹2,00,000 (Urban) or ₹1,50,000 (Rural).',
        'Applicant must be a permanent resident of Telangana state.'
      ]
    },
    requiredDocuments: [
      {
        name: 'Age Proof Certificate of Bride',
        type: 'Education',
        description: 'SSC Memo / Date of Birth Certificate confirming completed 18+ years.',
        isMandatory: true,
        issuingAuthority: 'School Board / Municipal Registrar of Births'
      },
      {
        name: 'Integrated Caste & Income Certificate',
        type: 'Caste',
        description: 'Income and community certificate issued by Revenue Department through MeeSeva.',
        isMandatory: true,
        issuingAuthority: 'Tahsildar / MeeSeva'
      },
      {
        name: 'Marriage Confirmation Proof (Lagnapatrika / Nikahnama / Certificate)',
        type: 'Other',
        description: 'Wedding invitation card or marriage registration document.',
        isMandatory: true,
        issuingAuthority: 'Gram Panchayat / Religious Body / Registrar'
      },
      {
        name: 'Aadhaar Cards of Bride and Groom',
        type: 'Identity',
        description: 'Biometric identity proof of both bride and groom.',
        isMandatory: true,
        issuingAuthority: 'UIDAI'
      }
    ],
    applicationProcess: [
      {
        stepNumber: 1,
        title: 'Online Application on Telangana ePASS',
        description: 'Apply on telanganaepass.cgg.gov.in before the wedding or within the notified post-marriage window.',
        portalUrl: 'https://telanganaepass.cgg.gov.in'
      },
      {
        stepNumber: 2,
        title: 'Mandal Revenue Officer (MRO) Field Enquiry',
        description: 'Village Revenue Officer and MRO verify age certificates, parental income, and address.'
      },
      {
        stepNumber: 3,
        title: 'Sanction and Treasury Credit',
        description: 'Revenue Divisional Officer sanctions the grant, credited to the bride’s mother’s bank account.'
      }
    ],
    officialPortalUrl: 'https://telanganaepass.cgg.gov.in',
    helplineNumber: '040-23390228',
    verificationStatus: 'Demonstration Record',
    sourceMetadata: {
      sourceTitle: 'Telangana ePASS Portal, Centre for Good Governance (CGG)',
      sourceUrl: 'https://telanganaepass.cgg.gov.in',
      sourceType: 'State Government Portal',
      lastVerifiedDate: '2024-11-15',
      verificationStatus: 'Demonstration Record',
      requiresPeriodicUpdate: true,
      periodicUpdateNotice: 'Income thresholds and document verification procedures are defined under state welfare circulars.'
    },
    lastAuditDate: '2024-11-15',
    matchScoreDefault: 90
  },
  {
    id: 'pm-mudra',
    title: 'Pradhan Mantri MUDRA Yojana (PMMY)',
    titleTelugu: 'ప్రధాన మంత్రి ముద్రా యోజన',
    titleHindi: 'प्रधानमंत्री मुद्रा योजना (PMMY)',
    category: 'Finance',
    level: 'Central',
    ministry: 'Ministry of Finance',
    nodalAgency: 'Micro Units Development & Refinance Agency Ltd (MUDRA)',
    launchYear: 2015,
    beneficiaryType: ['Small Business', 'Youth', 'Women'],
    shortDescription: 'Institutional collateral-free micro credit up to ₹20 Lakh across Shishu, Kishore, and Tarun tiers for small and micro business enterprises.',
    detailedDescription: 'PMMY facilitates non-farm, non-corporate micro and small business lending by commercial banks, RRBs, Small Finance Banks, and NBFCs without requiring third-party collateral security.',
    objectives: [
      'Foster micro-entrepreneurship and self-employment across India.',
      'Bridge credit access challenges for micro and small non-farm businesses.',
      'Offer refinance support and credit guarantees for institutional lenders.'
    ],
    benefitAmount: 'Up to ₹20,00,000 Micro-Loan',
    benefitFrequency: 'One-Time',
    benefitsList: [
      'Shishu Tier: Micro loans up to ₹50,000 for early-stage or tiny ventures.',
      'Kishore Tier: Loans from ₹50,001 up to ₹5,00,000 for equipment and working capital.',
      'Tarun Tier: Loans from ₹5,00,001 up to ₹20,00,000 for enterprise growth (expanded under recent union budget).',
      'No collateral security requirement; interest rates set as per bank appraisal guidelines.'
    ],
    eligibility: {
      minAge: 18,
      gender: 'All',
      occupation: ['Self-Employed', 'Small Merchant', 'Artisan', 'Manufacturer'],
      specificConditions: [
        'Must possess a viable non-farm business proposal in manufacturing, trading, or service sector.',
        'Applicant must not be a loan defaulter with any financial institution or commercial bank.',
        'Sanction is subject to commercial credit appraisal and satisfactory verification by the lending institution.'
      ]
    },
    requiredDocuments: [
      {
        name: 'KYC Identity Documents (Aadhaar / Voter ID / PAN)',
        type: 'Identity',
        description: 'Government proof of identity and residential address.',
        isMandatory: true,
        issuingAuthority: 'Government of India'
      },
      {
        name: 'Business Address Proof & Udyam Registration',
        type: 'Other',
        description: 'Proof of commercial activity and MSME Udyam registration certificate.',
        isMandatory: true,
        issuingAuthority: 'Ministry of MSME / Local Authority'
      },
      {
        name: 'Bank Account Statements (Last 6 Months)',
        type: 'Banking',
        description: 'Bank statements showing turnover and cash flow transactions.',
        isMandatory: true,
        issuingAuthority: 'Bank'
      }
    ],
    applicationProcess: [
      {
        stepNumber: 1,
        title: 'Prepare Business Proposal',
        description: 'Outline the business model, machinery/inventory needs, and estimated revenue cash flow.'
      },
      {
        stepNumber: 2,
        title: 'Apply on JanSamarth / Udyamimitra or at Bank',
        description: 'Submit application online via jansamarth.in / udyamimitra.in or directly at an authorized bank branch.',
        portalUrl: 'https://www.mudra.org.in'
      },
      {
        stepNumber: 3,
        title: 'Credit Appraisal & Loan Sanction',
        description: 'Lending institution appraises the credit proposal and sanctions credit facilities.'
      }
    ],
    officialPortalUrl: 'https://www.mudra.org.in',
    helplineNumber: '1800 180 1111',
    verificationStatus: 'Demonstration Record',
    sourceMetadata: {
      sourceTitle: 'Pradhan Mantri MUDRA Yojana Portal, Ministry of Finance',
      sourceUrl: 'https://www.mudra.org.in',
      sourceType: 'Official Ministry Portal',
      lastVerifiedDate: '2024-11-15',
      verificationStatus: 'Demonstration Record',
      requiresPeriodicUpdate: true,
      periodicUpdateNotice: 'Maximum loan limits, interest rate benchmarks, and credit guarantee coverage rules depend on participating bank appraisal and Ministry of Finance circulars.'
    },
    lastAuditDate: '2024-11-15',
    matchScoreDefault: 88
  },
  {
    id: 'pm-awas-gramin',
    title: 'Pradhan Mantri Awas Yojana (Gramin)',
    titleTelugu: 'ప్రధాన మంత్రి ఆవాస్ యోజన (గ్రామీణ)',
    titleHindi: 'प्रधानमंत्री आवास योजना (ग्रामीण)',
    category: 'Housing',
    level: 'Central',
    ministry: 'Ministry of Rural Development',
    nodalAgency: 'Department of Rural Development, GoI',
    launchYear: 2016,
    beneficiaryType: ['Low Income', 'Farmers'],
    shortDescription: 'Financial grant of ₹1.20 Lakh (plains) / ₹1.30 Lakh (hilly areas) for homeless rural households to construct permanent pucca dwellings.',
    detailedDescription: 'PMAY-G provides direct cash assistance towards the construction of a permanent pucca house with basic amenities for rural families currently living in kutcha or dilapidated structures, selected via survey and Gram Sabha validation.',
    objectives: [
      'Assist houseless and kutcha-dwelling rural families in constructing safe pucca houses.',
      'Integrate 90/95 days of unskilled wage labor support under MGNREGA for house building.',
      'Execute staged, geotagged milestone-based disbursements directly into beneficiary accounts.'
    ],
    benefitAmount: '₹1,20,000 + Labor Wages',
    benefitFrequency: 'One-Time',
    benefitsList: [
      '₹1.20 Lakh (plains) or ₹1.30 Lakh (hilly/difficult areas) paid in 3-4 progress milestones.',
      'Additional support of up to ₹12,000 for toilet construction under Swachh Bharat Mission (Gramin).',
      'Unskilled wage labor entitlement (90 to 95 days) through convergence with MGNREGA.'
    ],
    eligibility: {
      minAge: 18,
      gender: 'All',
      maxAnnualIncome: 180000,
      specificConditions: [
        'Households without shelter or living in kutcha dwellings as identified under SECC 2011 and Awaas+ survey lists.',
        'Must not possess a pucca house in any part of India.',
        'Must not own motorized four-wheelers, mechanized boats, or have permanent government employment in family.'
      ]
    },
    requiredDocuments: [
      {
        name: 'Aadhaar Card of Family Members',
        type: 'Identity',
        description: 'Identity proof for biometric verification.',
        isMandatory: true,
        issuingAuthority: 'UIDAI'
      },
      {
        name: 'Bank Passbook / Post Office Account',
        type: 'Banking',
        description: 'Account into which geotagged milestone funds are credited.',
        isMandatory: true,
        issuingAuthority: 'Bank / India Post'
      },
      {
        name: 'MGNREGA Job Card',
        type: 'Other',
        description: 'Required to claim unskilled labor wage entitlements during construction.',
        isMandatory: true,
        issuingAuthority: 'Gram Panchayat'
      }
    ],
    applicationProcess: [
      {
        stepNumber: 1,
        title: 'Survey Identification & Gram Sabha Validation',
        description: 'Eligible beneficiaries are identified from Awaas+ lists and validated by local Gram Sabhas.'
      },
      {
        stepNumber: 2,
        title: 'Geotagging of Site via AwaasApp',
        description: 'Panchayat officials photograph and geotag the site before commencement of construction.',
        portalUrl: 'https://pmayg.nic.in'
      },
      {
        stepNumber: 3,
        title: 'Staged Milestone Disbursements',
        description: 'Instalments are credited following inspection at Foundation, Lintel, Roof, and Completion stages.'
      }
    ],
    officialPortalUrl: 'https://pmayg.nic.in',
    helplineNumber: '1800-11-6446',
    verificationStatus: 'Demonstration Record',
    sourceMetadata: {
      sourceTitle: 'PMAY-G Official Portal, Ministry of Rural Development',
      sourceUrl: 'https://pmayg.nic.in',
      sourceType: 'Official Ministry Portal',
      lastVerifiedDate: '2024-11-15',
      verificationStatus: 'Demonstration Record',
      requiresPeriodicUpdate: true,
      periodicUpdateNotice: 'Beneficiary prioritization depends on Awaas+ survey lists validated by local Gram Sabhas and state rural housing departments.'
    },
    lastAuditDate: '2024-11-15',
    matchScoreDefault: 96
  },
  {
    id: 'post-matric-scholarship',
    title: 'Post Matric Scholarship for SC/ST/BC Students',
    titleTelugu: 'పోస్ట్ మెట్రిక్ స్కాలర్‌షిప్ పథకం',
    titleHindi: 'एससी/एसटी/ओबीसी छात्रों के लिए पोस्ट-मैट्रिक छात्रवृत्ति',
    category: 'Education',
    level: 'Central',
    ministry: 'Ministry of Social Justice and Empowerment / Ministry of Tribal Affairs',
    launchYear: 2006,
    beneficiaryType: ['Students', 'Youth', 'Low Income'],
    shortDescription: 'Tuition fee support and maintenance allowances for eligible marginalized students pursuing higher education beyond Class 10.',
    detailedDescription: 'Provides financial support to eligible Scheduled Caste, Scheduled Tribe, and Backward Class students pursuing post-matriculation courses (Polytechnic, Degree, Professional, and Post-Graduate degrees) in recognized institutions.',
    objectives: [
      'Support post-secondary educational attainment among marginalized student populations.',
      'Reduce dropout rates in higher and technical education due to economic hardship.',
      'Directly credit maintenance allowance and institution fee support via PFMS.'
    ],
    benefitAmount: 'Tuition Fee Support + Maintenance Allowance',
    benefitFrequency: 'Annual',
    benefitsList: [
      'Tuition fee reimbursement as per approved government fee regulatory committee norms.',
      'Monthly/annual maintenance allowance for hostellers and day scholars as per scheme slabs.',
      'Direct Benefit Transfer into student Aadhaar-seeded accounts.'
    ],
    eligibility: {
      minAge: 15,
      maxAge: 35,
      gender: 'All',
      maxAnnualIncome: 250000,
      casteCategories: ['SC', 'ST', 'BC', 'EBC', 'Minority'],
      occupation: ['Student'],
      specificConditions: [
        'Must have passed Class 10 / SSC examination from a recognized education board.',
        'Must be enrolled in a recognized post-matric college, university, or polytechnic.',
        'Combined parental annual family income from all sources must not exceed ₹2.50 Lakh.'
      ]
    },
    requiredDocuments: [
      {
        name: 'SSC (Class 10) Marks Memorandum',
        type: 'Education',
        description: 'Proof of completing matriculation and date of birth.',
        isMandatory: true,
        issuingAuthority: 'State Board of Secondary Education / CBSE'
      },
      {
        name: 'Community & Income Certificate',
        type: 'Caste',
        description: 'Digitally verified caste and family income certificate issued via revenue portals.',
        isMandatory: true,
        issuingAuthority: 'Revenue Department / MeeSeva / e-District'
      },
      {
        name: 'College Admission & Bonafide Certificate',
        type: 'Education',
        description: 'Official proof of active enrollment in an affiliated institution.',
        isMandatory: true,
        issuingAuthority: 'Principal / Registrar of Enrolled Institution'
      }
    ],
    applicationProcess: [
      {
        stepNumber: 1,
        title: 'NSP / State ePASS Portal Registration',
        description: 'Register with student Aadhaar and academic credentials on scholarships.gov.in or state ePASS portal.',
        portalUrl: 'https://scholarships.gov.in'
      },
      {
        stepNumber: 2,
        title: 'Institutional Verification',
        description: 'Institution Nodal Officer verifies candidate admission, attendance, and fee structure online.'
      },
      {
        stepNumber: 3,
        title: 'District Welfare Officer Sanction',
        description: 'Welfare department validates application and releases funds via PFMS direct transfer.'
      }
    ],
    officialPortalUrl: 'https://scholarships.gov.in',
    helplineNumber: '0120-6619540',
    verificationStatus: 'Demonstration Record',
    sourceMetadata: {
      sourceTitle: 'National Scholarship Portal (NSP), Ministry of Electronics & IT / Ministry of Social Justice',
      sourceUrl: 'https://scholarships.gov.in',
      sourceType: 'Official Ministry Portal',
      lastVerifiedDate: '2024-11-15',
      verificationStatus: 'Demonstration Record',
      requiresPeriodicUpdate: true,
      periodicUpdateNotice: 'Application windows, income limits, and maintenance allowance slabs are revised for each academic year.'
    },
    lastAuditDate: '2024-11-15',
    matchScoreDefault: 93
  },
  {
    id: 'sukanya-samriddhi',
    title: 'Sukanya Samriddhi Yojana (SSY)',
    titleTelugu: 'సుకున్య సమృద్ధి యోజన',
    titleHindi: 'सुकन्या समृद्धि योजना (SSY)',
    category: 'Women & Child',
    level: 'Central',
    ministry: 'Ministry of Finance / Department of Posts',
    launchYear: 2015,
    beneficiaryType: ['Women', 'Low Income', 'Youth'],
    shortDescription: 'Government-backed savings scheme for girl children offering compound interest and Section 80C tax benefits under Beti Bachao Beti Padhao.',
    detailedDescription: 'Sukanya Samriddhi Account is a sovereign-backed small savings scheme designed for parents or legal guardians to build an educational and marriage savings fund for girl children.',
    objectives: [
      'Promote targeted financial security for girl children across India.',
      'Incentivize long-term savings for female higher education and marriage expenses.',
      'Provide sovereign government-backed savings benefits with complete tax exemption (EEE).'
    ],
    benefitAmount: '8.2% p.a. Compounded (Subject to Quarterly Revision)',
    benefitFrequency: 'Revolving',
    benefitsList: [
      'Compound annual interest rate (currently notified at 8.2% p.a. by Ministry of Finance).',
      'Triple tax exemption (Exempt-Exempt-Exempt) on deposits, interest accrual, and maturity withdrawals.',
      'Flexible annual deposits starting from ₹250 up to ₹1,50,000 per financial year.',
      'Partial withdrawal (up to 50%) permitted for higher education after child reaches 18 years.'
    ],
    eligibility: {
      maxAge: 10,
      gender: 'Female',
      specificConditions: [
        'Account must be opened by a parent or legal guardian before the girl child turns 10 years old.',
        'Maximum of two accounts allowed per family (one per girl child, with exceptions for natural twin/triplet births).',
        'Deposit term extends for 15 years from account opening, maturing at 21 years.'
      ]
    },
    requiredDocuments: [
      {
        name: 'Birth Certificate of Girl Child',
        type: 'Other',
        description: 'Mandatory official proof of child’s date of birth.',
        isMandatory: true,
        issuingAuthority: 'Municipal Corporation / Registrar of Births'
      },
      {
        name: 'KYC & Address Proof of Parent / Guardian',
        type: 'Identity',
        description: 'Aadhaar / Voter ID / PAN of parent or legal guardian.',
        isMandatory: true,
        issuingAuthority: 'UIDAI / Government of India'
      }
    ],
    applicationProcess: [
      {
        stepNumber: 1,
        title: 'Form Submission at Post Office or Bank',
        description: 'Complete Form SSA-1 at any India Post Office branch or authorized commercial bank.'
      },
      {
        stepNumber: 2,
        title: 'Initial Deposit & Passbook Issuance',
        description: 'Deposit minimum opening amount (min ₹250) and collect official SSY passbook.'
      },
      {
        stepNumber: 3,
        title: 'Regular Digital Contributions',
        description: 'Deposit funds annually through mobile banking apps, IPPB, or counter deposits.'
      }
    ],
    officialPortalUrl: 'https://www.indiapost.gov.in',
    helplineNumber: '1800 266 6868',
    verificationStatus: 'Demonstration Record',
    sourceMetadata: {
      sourceTitle: 'India Post Small Savings Schemes Portal, Department of Posts',
      sourceUrl: 'https://www.indiapost.gov.in',
      sourceType: 'Official Ministry Portal',
      lastVerifiedDate: '2024-11-15',
      verificationStatus: 'Demonstration Record',
      requiresPeriodicUpdate: true,
      periodicUpdateNotice: 'Small savings interest rates (currently 8.2% p.a.) are reviewed and notified quarterly by the Ministry of Finance and are subject to change.'
    },
    lastAuditDate: '2024-11-15',
    matchScoreDefault: 97
  },
  {
    id: 'mgnrega',
    title: 'Mahatma Gandhi NREGA',
    titleTelugu: 'మహాత్మా గాంధీ జాతీయ గ్రామీణ ఉపాధి హామీ పథకం',
    titleHindi: 'महात्मा गांधी राष्ट्रीय ग्रामीण रोजगार गारंटी अधिनियम (मनरेगा)',
    category: 'Employment',
    level: 'Central',
    ministry: 'Ministry of Rural Development',
    launchYear: 2005,
    beneficiaryType: ['Low Income', 'Farmers', 'Youth'],
    shortDescription: 'Statutory guarantee of 100 days of wage employment per financial year to rural households whose adult members volunteer for unskilled manual labor.',
    detailedDescription: 'The Mahatma Gandhi National Rural Employment Guarantee Act (MGNREGA) confers a statutory legal right to work for adult rural citizens, providing minimum notified daily wage rates and developing rural community infrastructure.',
    objectives: [
      'Provide guaranteed social safety net of 100 days unskilled manual work in rural areas.',
      'Build durable rural assets including water conservation, farm ponds, and canal renovation.',
      'Protect vulnerable rural laborers from seasonal unemployment and distress migration.'
    ],
    benefitAmount: 'State-Notified Daily Wage Rate (~₹250 - ₹374/Day)',
    benefitFrequency: 'Monthly',
    benefitsList: [
      'Guaranteed up to 100 days of wage work per household per financial year upon demand.',
      'Wages credited directly to bank or post office accounts via Aadhaar Based Payment System (ABPS).',
      'Unemployment allowance statutory entitlement if work is not allotted within 15 days of demand.'
    ],
    eligibility: {
      minAge: 18,
      gender: 'All',
      occupation: ['Rural Laborer', 'Manual Worker', 'Farmer'],
      specificConditions: [
        'Must reside in a rural Gram Panchayat area.',
        'Adult member must volunteer to perform unskilled physical manual labor.',
        'Household must hold a valid MGNREGA Job Card issued by local Gram Panchayat.'
      ]
    },
    requiredDocuments: [
      {
        name: 'Aadhaar Card',
        type: 'Identity',
        description: 'Mandatory Aadhaar for wage disbursal via Aadhaar Based Payment System (ABPS).',
        isMandatory: true,
        issuingAuthority: 'UIDAI'
      },
      {
        name: 'Rural Household Ration Card',
        type: 'Identity',
        description: 'Proof of family composition and residence within Gram Panchayat.',
        isMandatory: true,
        issuingAuthority: 'Civil Supplies Department'
      },
      {
        name: 'Bank / Post Office Account Passbook',
        type: 'Banking',
        description: 'Aadhaar-seeded bank or post office account for direct wage payment.',
        isMandatory: true,
        issuingAuthority: 'Commercial Bank / Post Office'
      }
    ],
    applicationProcess: [
      {
        stepNumber: 1,
        title: 'Job Card Application',
        description: 'Apply with household details and photographs to the local Gram Panchayat secretary.'
      },
      {
        stepNumber: 2,
        title: 'Free Job Card Issuance',
        description: 'Gram Panchayat verifies residence and issues Job Card within 15 days.',
        portalUrl: 'https://nrega.nic.in'
      },
      {
        stepNumber: 3,
        title: 'Demand for Work & Muster Roll Allotment',
        description: 'Submit written demand for work; Panchayat allocates work on approved muster rolls within 15 days.'
      }
    ],
    officialPortalUrl: 'https://nrega.nic.in',
    helplineNumber: '1800 110 707',
    verificationStatus: 'Demonstration Record',
    sourceMetadata: {
      sourceTitle: 'MGNREGA National Portal, Ministry of Rural Development',
      sourceUrl: 'https://nrega.nic.in',
      sourceType: 'Official Ministry Portal',
      lastVerifiedDate: '2024-11-15',
      verificationStatus: 'Demonstration Record',
      requiresPeriodicUpdate: true,
      periodicUpdateNotice: 'Daily wage rates are notified state-wise each financial year by the Ministry of Rural Development and vary across states and union territories.'
    },
    lastAuditDate: '2024-11-15',
    matchScoreDefault: 90
  }
]
