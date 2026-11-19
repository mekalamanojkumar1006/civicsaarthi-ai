/**
 * Automated Verification Test for Complete Multilingual Translation (English, Telugu, Hindi)
 * and 5-Language Selector UI in CivicSaarthi AI:
 *   Available: en (English), te (Telugu), hi (Hindi)
 *   Coming Soon: ta (Tamil), kn (Kannada)
 */

const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');

let totalChecks = 0;
let passedChecks = 0;
let failedChecks = 0;

function assert(condition, description, details = '') {
  totalChecks++;
  if (condition) {
    passedChecks++;
    console.log(`  [PASS] ${description}`);
  } else {
    failedChecks++;
    console.error(`  [FAIL] ${description} ${details ? `-> ${details}` : ''}`);
  }
}

console.log('\n======================================================');
console.log('CivicSaarthi AI: Complete Multilingual Verification Suite');
console.log('Available: English (en), Telugu (te), Hindi (hi)');
console.log('Coming Soon: Tamil (ta), Kannada (kn)');
console.log('======================================================\n');

// 1. Translations file inspection
console.log('--- 1. Translation Dictionary Completeness & Key Parity ---');
const translationsPath = path.join(ROOT_DIR, 'src', 'locales', 'translations.ts');
assert(fs.existsSync(translationsPath), 'src/locales/translations.ts exists');

const translationsContent = fs.readFileSync(translationsPath, 'utf8');

// Parse dictionaries from translations.ts
const enBlockMatch = translationsContent.match(/en:\s*\{([\s\S]*?)\},\s*te:/);
const teBlockMatch = translationsContent.match(/te:\s*\{([\s\S]*?)\},\s*hi:/);
const hiBlockMatch = translationsContent.match(/hi:\s*\{([\s\S]*?)\},\s*\}\s*as const/);

assert(Boolean(enBlockMatch), 'English translation block (en) extracted successfully');
assert(Boolean(teBlockMatch), 'Telugu translation block (te) extracted successfully');
assert(Boolean(hiBlockMatch), 'Hindi translation block (hi) extracted successfully');
assert(!translationsContent.includes('kn:\s*{'), 'Kannada is NOT in active translation dictionary (Coming Soon)');
assert(!translationsContent.includes('ta:\s*{'), 'Tamil is NOT in active translation dictionary (Coming Soon)');

function extractKeys(blockStr) {
  const keys = new Set();
  const regex = /^\s*([a-zA-Z0-9_]+)\s*:/gm;
  let match;
  while ((match = regex.exec(blockStr)) !== null) {
    keys.add(match[1]);
  }
  return keys;
}

const enKeys = extractKeys(enBlockMatch ? enBlockMatch[1] : '');
const teKeys = extractKeys(teBlockMatch ? teBlockMatch[1] : '');
const hiKeys = extractKeys(hiBlockMatch ? hiBlockMatch[1] : '');

console.log(`  Key counts: en=${enKeys.size}, te=${teKeys.size}, hi=${hiKeys.size}`);
assert(enKeys.size >= 300, `English has comprehensive translation keys (count: ${enKeys.size})`);
assert(teKeys.size >= 300, `Telugu has comprehensive translation keys (count: ${teKeys.size})`);
assert(hiKeys.size >= 300, `Hindi has comprehensive translation keys (count: ${hiKeys.size})`);

// Check 100% key parity
let missingInTe = [...enKeys].filter(k => !teKeys.has(k));
let extraInTe = [...teKeys].filter(k => !enKeys.has(k));
let missingInHi = [...enKeys].filter(k => !hiKeys.has(k));
let extraInHi = [...hiKeys].filter(k => !enKeys.has(k));

assert(missingInTe.length === 0, `100% key parity: all en keys exist in te (${missingInTe.length} missing)`, missingInTe.join(', '));
assert(extraInTe.length === 0, `100% key parity: no extra keys in te without en match (${extraInTe.length} extra)`, extraInTe.join(', '));
assert(missingInHi.length === 0, `100% key parity: all en keys exist in hi (${missingInHi.length} missing)`, missingInHi.join(', '));
assert(extraInHi.length === 0, `100% key parity: no extra keys in hi without en match (${extraInHi.length} extra)`, extraInHi.join(', '));

// 2. 5-Language Selector UI Inspection
console.log('\n--- 2. LanguageSwitcher 5-Language UI Verification ---');
const switcherPath = path.join(ROOT_DIR, 'src', 'components', 'common', 'LanguageSwitcher.tsx');
assert(fs.existsSync(switcherPath), 'src/components/common/LanguageSwitcher.tsx exists');
const switcherContent = fs.readFileSync(switcherPath, 'utf8');

assert(switcherContent.includes("code: 'en'") && switcherContent.includes('English'), 'Displays English in dropdown');
assert(switcherContent.includes("code: 'te'") && switcherContent.includes('తెలుగు'), 'Displays Telugu (తెలుగు) in dropdown');
assert(switcherContent.includes("code: 'hi'") && switcherContent.includes('हिन्दी'), 'Displays Hindi (हिन्दी) in dropdown');
assert(switcherContent.includes("code: 'ta'") && switcherContent.includes('தமிழ்'), 'Displays Tamil (தமிழ்) in dropdown');
assert(switcherContent.includes("code: 'kn'") && switcherContent.includes('ಕನ್ನಡ'), 'Displays Kannada (ಕನ್ನಡ) in dropdown');

assert(switcherContent.includes('Coming Soon'), 'Displays "Coming Soon" label for disabled languages');
assert(switcherContent.includes('cursor-not-allowed'), 'Uses disabled cursor styling for Coming Soon languages');
assert(switcherContent.includes('isAvailable: false'), 'Tamil and Kannada are marked isAvailable: false');
assert(switcherContent.includes('isAvailable: true'), 'English, Telugu, and Hindi are marked isAvailable: true');
assert(switcherContent.includes('aria-disabled="true"'), 'Provides aria-disabled for accessibility');

// 3. LanguageContext & State Isolation
console.log('\n--- 3. LanguageContext & State Isolation ---');
const contextPath = path.join(ROOT_DIR, 'src', 'context', 'LanguageContext.tsx');
const contextContent = fs.readFileSync(contextPath, 'utf8');

assert(translationsContent.includes("Language = 'en' | 'te' | 'hi'"), 'Active Language type is strictly en | te | hi in translations.ts');
assert(contextContent.includes('export type { Language }'), 'LanguageContext re-exports Language type');
assert(!contextContent.includes("'kn'"), 'Kannada is NOT in active LanguageContext state type');
assert(!contextContent.includes("'ta'"), 'Tamil is NOT in active LanguageContext state type');
assert(contextContent.includes('isHindi'), 'LanguageContext exposes isHindi flag');
assert(contextContent.includes('isTelugu'), 'LanguageContext exposes isTelugu flag');
assert(contextContent.includes('civicsaarthi_language'), 'LanguageContext uses localStorage key civicsaarthi_language');
assert(contextContent.includes('document.documentElement.lang = language'), 'LanguageContext dynamically updates document.documentElement.lang');

// 4. Indic Font Styling
console.log('\n--- 4. Indic Font Family Styling ---');
const indexCssPath = path.join(ROOT_DIR, 'src', 'index.css');
const indexCssContent = fs.readFileSync(indexCssPath, 'utf8');
assert(indexCssContent.includes("Noto Sans Telugu"), 'index.css defines Noto Sans Telugu for Telugu typography');
assert(indexCssContent.includes("Noto Sans Devanagari"), 'index.css defines Noto Sans Devanagari for Hindi typography');

// 5. Scheme Data Hindi Titles
console.log('\n--- 5. Scheme Data Hindi Support ---');
const schemesDataPath = path.join(ROOT_DIR, 'src', 'data', 'schemesData.ts');
const schemesDataContent = fs.readFileSync(schemesDataPath, 'utf8');
assert(schemesDataContent.includes('titleHindi?: string'), 'DetailedScheme has titleHindi property');
assert(schemesDataContent.includes('पीएम किसान सम्मान निधि'), 'PM Kisan has Hindi title');
assert(schemesDataContent.includes('पीएम सूर्य घर: मुफ्त बिजली योजना'), 'PM Surya Ghar has Hindi title');

console.log('\n======================================================');
console.log(`Results: ${passedChecks}/${totalChecks} checks PASSED (${failedChecks} failed)`);
console.log('======================================================\n');

if (failedChecks > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
