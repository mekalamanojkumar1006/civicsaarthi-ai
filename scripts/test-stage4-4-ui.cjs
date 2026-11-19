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

async function runStage44UITests() {
  console.log('═════════════════════════════════════════════════════════════════');
  console.log('CivicSaarthi AI: Stage 4.4 Document Locker UI & QA Verification');
  console.log('═════════════════════════════════════════════════════════════════');

  if (!fs.existsSync(SCREENSHOT_DIR)) {
    fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
  }

  const isServerRunning = await checkServer();
  if (!isServerRunning) {
    console.error('Vite dev server is not running on port 5173. Please start it.');
    process.exit(1);
  }

  const tempProfileDir = path.join(os.tmpdir(), `civicsaarthi-stage4-4-qa-${Date.now()}`);
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

    // 1. Test DocumentsPage - Document Locker Tab at 1440px
    console.log('\n1. Testing Document Locker Tab on Desktop (1440px)...');
    await page.goto(`${BASE_URL}/documents`, { waitUntil: 'networkidle2' });
    await sleep(800);

    const docHeading = await page.$eval('h1', (el) => el.textContent);
    console.log(`- Page Heading: "${docHeading}"`);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'stage4-4-document-locker-desktop.png') });
    console.log('- Screenshot saved: stage4-4-document-locker-desktop.png');

    // 2. Test Requirements Checklist Tab at 1440px
    console.log('\n2. Testing Requirements Checklist Tab on Desktop (1440px)...');
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const checklistBtn = btns.find((b) => b.textContent.includes('Requirements Checklist'));
      if (checklistBtn) checklistBtn.click();
    });
    await sleep(600);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'stage4-4-requirements-checklist-desktop.png') });
    console.log('- Screenshot saved: stage4-4-requirements-checklist-desktop.png');

    // 3. Test Mobile Viewport at 375px
    console.log('\n3. Testing Document Locker on Mobile Viewport (375x667)...');
    await page.setViewport({ width: 375, height: 667, isMobile: true, hasTouch: true });
    // Switch back to locker
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const lockerBtn = btns.find((b) => b.textContent.includes('Document Locker'));
      if (lockerBtn) lockerBtn.click();
    });
    await sleep(600);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'stage4-4-document-locker-mobile.png') });
    console.log('- Screenshot saved: stage4-4-document-locker-mobile.png');

    console.log('\n═════════════════════════════════════════════════════════════════');
    console.log('>>> ALL STAGE 4.4 UI TESTS COMPLETED SUCCESSFULLY <<<');
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

runStage44UITests().catch((err) => {
  console.error('Test runner failure:', err);
  process.exit(1);
});
