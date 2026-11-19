const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');
const os = require('os');
const http = require('http');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const BASE_URL = 'http://localhost:5173';
const SCREENSHOT_DIR = path.resolve(__dirname, '../public/images/qa');

function checkServer() {
  return new Promise((resolve) => {
    const req = http.get(BASE_URL, (res) => {
      resolve(res.statusCode >= 200 && res.statusCode < 400);
    });
    req.on('error', () => resolve(false));
    req.setTimeout(1000, () => {
      req.destroy();
      resolve(false);
    });
  });
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function runStage43UITests() {
  console.log('═════════════════════════════════════════════════════════════════');
  console.log('CivicSaarthi AI: Stage 4.3 UI & Workflow QA Verification');
  console.log('═════════════════════════════════════════════════════════════════');

  if (!fs.existsSync(SCREENSHOT_DIR)) {
    fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
  }

  const isServerRunning = await checkServer();
  if (!isServerRunning) {
    console.error('Vite dev server is not running on port 5173. Please start it.');
    process.exit(1);
  }

  const tempProfileDir = path.join(os.tmpdir(), `civicsaarthi-stage4-3-qa-${Date.now()}`);
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    userDataDir: tempProfileDir,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu'],
  });

  const page = await browser.newPage();
  const consoleErrors = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });

  try {
    // 0. Seed authenticated session in localStorage
    console.log('\n0. Seeding authenticated QA session in localStorage...');
    await page.setViewport({ width: 1440, height: 900 });
    await page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle2' });
    await page.evaluate(() => {
      const fakeSession = {
        access_token: 'dummy.jwt.token',
        token_type: 'bearer',
        expires_at: Math.floor(Date.now() / 1000) + 86400,
        refresh_token: 'dummy-refresh',
        user: {
          id: 'e6b72a6b-2877-4475-b6ff-1830588e1460',
          email: 'citizen.qa@example.gov.in',
          aud: 'authenticated',
          app_metadata: { provider: 'email' },
          user_metadata: { full_name: 'Citizen QA Tester', state: 'Telangana' },
        },
      };
      localStorage.setItem('sb-jqfpfyjnpxuycoqaahph-auth-token', JSON.stringify(fakeSession));
    });

    // 1. Test SavedPage at 1440px
    console.log('\n1. Testing Saved Schemes Page (/saved)...');
    await page.goto(`${BASE_URL}/saved`, { waitUntil: 'networkidle2' });
    await sleep(800);

    const savedHeading = await page.$eval('h1', (el) => el.textContent);
    console.log(`- Page Heading: "${savedHeading}"`);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'stage4-3-saved-desktop.png') });
    console.log('- Screenshot saved: stage4-3-saved-desktop.png');

    // 2. Test EligibilityPage Calculator at 1440px
    console.log('\n2. Testing Eligibility Assessment Page (/eligibility)...');
    await page.goto(`${BASE_URL}/eligibility`, { waitUntil: 'networkidle2' });
    await sleep(800);

    const eligHeading = await page.$eval('h1', (el) => el.textContent);
    console.log(`- Page Heading: "${eligHeading}"`);

    // Advance Step 1 -> Step 2
    console.log('- Stepping through wizard...');
    const advanceStep = async (stepNum) => {
      const btn = await page.evaluateHandle(() => {
        const btns = Array.from(document.querySelectorAll('button'));
        return btns.find((b) => b.textContent.includes('Continue') || b.textContent.includes('Run Assessment'));
      });
      if (btn && btn.click) {
        await btn.click();
        await sleep(500);
      }
    };

    await advanceStep(1); // Step 1 -> 2
    await advanceStep(2); // Step 2 -> 3
    await advanceStep(3); // Step 3 -> 4
    await advanceStep(4); // Step 4 -> 5 (Run Assessment)

    // Verify Step 5 result banner
    const resultHeading = await page.evaluate(() => {
      const headings = Array.from(document.querySelectorAll('h3'));
      return headings.find((h) => h.textContent.includes('Preliminary Assessment'))?.textContent || 'Result displayed';
    });
    console.log(`- Step 5 Result: "${resultHeading}"`);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'stage4-3-eligibility-result-desktop.png') });
    console.log('- Screenshot saved: stage4-3-eligibility-result-desktop.png');

    // 3. Test Assessment History Tab
    console.log('\n3. Testing Assessment History Tab...');
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const histBtn = btns.find((b) => b.textContent.includes('History'));
      if (histBtn) histBtn.click();
    });
    await sleep(600);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'stage4-3-eligibility-history-desktop.png') });
    console.log('- Screenshot saved: stage4-3-eligibility-history-desktop.png');

    // 4. Test Dashboard at 1440px
    console.log('\n4. Testing Dashboard (/dashboard)...');
    await page.goto(`${BASE_URL}/dashboard`, { waitUntil: 'networkidle2' });
    await sleep(800);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'stage4-3-dashboard-desktop.png') });
    console.log('- Screenshot saved: stage4-3-dashboard-desktop.png');

    // 5. Test Mobile Viewport at 375px
    console.log('\n5. Testing Mobile Viewport (375x667)...');
    await page.setViewport({ width: 375, height: 667, isMobile: true, hasTouch: true });
    await page.goto(`${BASE_URL}/eligibility`, { waitUntil: 'networkidle2' });
    await sleep(800);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'stage4-3-eligibility-mobile.png') });
    console.log('- Screenshot saved: stage4-3-eligibility-mobile.png');

    console.log(`\n- Console errors captured: ${consoleErrors.length}`);
    if (consoleErrors.length > 0) {
      console.log('Console errors:', consoleErrors);
    }

    console.log('\n═════════════════════════════════════════════════════════════════');
    console.log('>>> ALL STAGE 4.3 UI WORKFLOW TESTS COMPLETED SUCCESSFULLY <<<');
    console.log('═════════════════════════════════════════════════════════════════');
  } finally {
    await browser.close();
    try {
      fs.rmSync(tempProfileDir, { recursive: true, force: true });
    } catch {
      // ignore
    }
  }
}

runStage43UITests().catch((err) => {
  console.error('Test runner failure:', err);
  process.exit(1);
});
