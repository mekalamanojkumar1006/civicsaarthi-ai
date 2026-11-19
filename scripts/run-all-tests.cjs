/**
 * CivicSaarthi AI - Master Test Suite Runner
 * Runs all stage verification suites and aggregates PASS / FAIL / UNVERIFIED statuses.
 */

const { execSync } = require('child_process')
const path = require('path')

console.log('='.repeat(75))
console.log('CIVICSAARTHI AI – MASTER AUTOMATED VERIFICATION SUITE')
console.log('='.repeat(75))

const suites = [
  { stage: 'Stage 4.4', name: 'Citizen Document Storage & RLS Suite', script: 'test-stage4-4-storage.cjs' },
  { stage: 'Stage 4.5', name: 'Authentication & Profile Audit Suite', script: 'test-stage4-5-auth.cjs' },
  { stage: 'Stage 5.2', name: 'PDF Text Extraction & OCR Readiness', script: 'test-stage5-2-pdf.cjs' },
  { stage: 'Stage 5.4', name: 'RAG Grounding & Semantic Chunking', script: 'test-stage5-4-rag.cjs' },
  { stage: 'Stage 6.1/6.2', name: 'Scheme Data & Explainable Eligibility', script: 'test-stage6-eligibility.cjs' },
  { stage: 'Multilingual', name: '4-Language Localization & Switching (en, te, hi, kn)', script: 'test-multilingual.cjs' },
]

const results = []

for (const suite of suites) {
  process.stdout.write(`\nRunning [${suite.stage}] ${suite.name} ... `)
  const scriptPath = path.join(__dirname, suite.script)
  try {
    const output = execSync(`node "${scriptPath}"`, { encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] })
    const hasFail = output.includes('FAIL') || output.includes('FAILED')
    if (hasFail) {
      console.log('❌ FAIL')
      results.push({ ...suite, status: 'FAIL', output })
    } else {
      console.log('✅ PASS')
      results.push({ ...suite, status: 'PASS', output })
    }
  } catch (err) {
    console.log('❌ ERROR')
    results.push({ ...suite, status: 'ERROR', error: err.message, stderr: err.stderr })
  }
}

console.log('\n' + '='.repeat(75))
console.log('AUTOMATED SUITE EXECUTION SUMMARY')
console.log('='.repeat(75))
results.forEach((r, idx) => {
  console.log(`${idx + 1}. [${r.status}] ${r.stage}: ${r.name}`)
})
console.log('='.repeat(75))
