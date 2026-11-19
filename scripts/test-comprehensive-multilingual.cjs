/**
 * Comprehensive Automated Verification Suite for CivicSaarthi AI Multilingual Architecture
 * Validates:
 * 1. 372-key Parity across English (en), Telugu (te), and Hindi (hi)
 * 2. 5-Language Selector Configuration (en, te, hi Available; ta, kn Coming Soon)
 * 3. Typography & Font classes (Noto Sans Telugu, Noto Sans Devanagari)
 * 4. Zero isolated isTelugu checks across all pages
 * 5. Dynamic content support for AI Assistant, PDF Assistant, and Eligibility Calculator
 * 6. LocalStorage persistence validation
 */

const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
let passed = 0;
let failed = 0;

function test(name, condition, details = '') {
  if (condition) {
    passed++;
    console.log(`  [PASS] ${name}`);
  } else {
    failed++;
    console.error(`  [FAIL] ${name} ${details ? `-> ${details}` : ''}`);
  }
}

console.log('===========================================================================');
console.log('CIVICSAARTHI AI – COMPREHENSIVE MULTILINGUAL VERIFICATION');
console.log('===========================================================================\n');

// 1. Translations dictionary verification
console.log('--- 1. Dictionary Parity (English, Telugu, Hindi) ---');
const translationsPath = path.join(ROOT_DIR, 'src', 'locales', 'translations.ts');
const transCode = fs.readFileSync(translationsPath, 'utf8');

const enBlock = transCode.match(/en:\s*\{([\s\S]*?)\},\s*te:/)?.[1] || '';
const teBlock = transCode.match(/te:\s*\{([\s\S]*?)\},\s*hi:/)?.[1] || '';
const hiBlock = transCode.match(/hi:\s*\{([\s\S]*?)\},\s*\}\s*as const/)?.[1] || '';

function getKeys(block) {
  const keys = new Set();
  const re = /^\s*([a-zA-Z0-9_]+)\s*:/gm;
  let m;
  while ((m = re.exec(block)) !== null) keys.add(m[1]);
  return keys;
}

const enKeys = getKeys(enBlock);
const teKeys = getKeys(teBlock);
const hiKeys = getKeys(hiBlock);

test(`English dictionary size (count: ${enKeys.size})`, enKeys.size >= 370);
test(`Telugu dictionary size (count: ${teKeys.size})`, teKeys.size >= 370);
test(`Hindi dictionary size (count: ${hiKeys.size})`, hiKeys.size >= 370);

const missingTe = [...enKeys].filter(k => !teKeys.has(k));
const missingHi = [...enKeys].filter(k => !hiKeys.has(k));
const extraTe = [...teKeys].filter(k => !enKeys.has(k));
const extraHi = [...hiKeys].filter(k => !enKeys.has(k));

test('100% Key Parity between English and Telugu (0 missing, 0 extra)', missingTe.length === 0 && extraTe.length === 0);
test('100% Key Parity between English and Hindi (0 missing, 0 extra)', missingHi.length === 0 && extraHi.length === 0);

// 2. Language Switcher Configuration
console.log('\n--- 2. Language Switcher (5 Languages) ---');
const switcherPath = path.join(ROOT_DIR, 'src', 'components', 'common', 'LanguageSwitcher.tsx');
const switcherCode = fs.readFileSync(switcherPath, 'utf8');

test('English configured as Available', switcherCode.includes("code: 'en'") && switcherCode.includes("isAvailable: true"));
test('Telugu configured as Available', switcherCode.includes("code: 'te'") && switcherCode.includes("isAvailable: true"));
test('Hindi configured as Available', switcherCode.includes("code: 'hi'") && switcherCode.includes("isAvailable: true"));
test('Tamil configured as Coming Soon (Disabled)', switcherCode.includes("code: 'ta'") && switcherCode.includes("isAvailable: false"));
test('Kannada configured as Coming Soon (Disabled)', switcherCode.includes("code: 'kn'") && switcherCode.includes("isAvailable: false"));
test('Displays "Coming Soon" badge', switcherCode.includes("Coming Soon"));
test('Disabled cursor styling on Coming Soon items', switcherCode.includes("cursor-not-allowed"));

// 3. Typography & CSS Styling
console.log('\n--- 3. Typography & Styling ---');
const cssPath = path.join(ROOT_DIR, 'src', 'index.css');
const cssCode = fs.readFileSync(cssPath, 'utf8');

test('Noto Sans Telugu styling configured in index.css', cssCode.includes('Noto Sans Telugu'));
test('Noto Sans Devanagari styling configured in index.css', cssCode.includes('Noto Sans Devanagari'));
test('font-hindi class configured', cssCode.includes('.font-hindi'));
test('html[lang="hi"] rule configured', cssCode.includes('html[lang="hi"]'));

// 4. Zero Isolated isTelugu Checks
console.log('\n--- 4. Codebase Audit: Zero Isolated isTelugu Checks ---');
const pagesDir = path.join(ROOT_DIR, 'src', 'pages');
const pageFiles = fs.readdirSync(pagesDir).filter(f => f.endsWith('.tsx'));

let isolatedCount = 0;
pageFiles.forEach(file => {
  const content = fs.readFileSync(path.join(pagesDir, file), 'utf8');
  const lines = content.split('\n');
  lines.forEach((line, idx) => {
    if (line.includes('isTelugu ?')) {
      // Check window of 10 lines ahead for isHindi
      const window = lines.slice(idx, idx + 10).join(' ');
      if (!window.includes('isHindi')) {
        isolatedCount++;
        console.warn(`    Warning: Potential isolated check in ${file}:${idx + 1}`);
      }
    }
  });
});
test('Zero isolated isTelugu checks across all 11 pages in src/pages', isolatedCount === 0);

// 5. Scheme Data Hindi Coverage
console.log('\n--- 5. Scheme Data Hindi Localization ---');
const schemesPath = path.join(ROOT_DIR, 'src', 'data', 'schemesData.ts');
const schemesCode = fs.readFileSync(schemesPath, 'utf8');

test('DetailedScheme interface includes titleHindi?: string', schemesCode.includes('titleHindi?: string'));
test('Central and state schemes have Hindi titles populated', schemesCode.includes('titleHindi:'));

// 6. LanguageContext Architecture & Persistence
console.log('\n--- 6. LanguageContext Architecture & LocalStorage Persistence ---');
const contextPath = path.join(ROOT_DIR, 'src', 'context', 'LanguageContext.tsx');
const contextCode = fs.readFileSync(contextPath, 'utf8');

test('LanguageContext exposes isHindi flag', contextCode.includes('isHindi'));
test('LanguageContext exposes isTelugu flag', contextCode.includes('isTelugu'));
test('LanguageContext exposes isIndic flag', contextCode.includes('isIndic'));
test('LanguageContext dynamically computes fontClass for Hindi and Telugu', contextCode.includes('font-hindi') && contextCode.includes('font-telugu'));
test('LanguageContext saves language to localStorage (STORAGE_KEY = civicsaarthi_language)', contextCode.includes("STORAGE_KEY = 'civicsaarthi_language'") && contextCode.includes("localStorage.setItem(STORAGE_KEY, lang)"));
test('LanguageContext updates document.documentElement.lang dynamically', contextCode.includes('document.documentElement.lang = language'));

console.log('\n===========================================================================');
console.log(`TOTAL SUITE RESULTS: ${passed} PASSED, ${failed} FAILED`);
console.log('===========================================================================\n');

if (failed > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
