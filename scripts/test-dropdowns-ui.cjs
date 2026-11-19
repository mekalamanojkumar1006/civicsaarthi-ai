const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');
const os = require('os');
const { spawn } = require('child_process');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const BASE_URL = 'http://localhost:5173';
const SCREENSHOT_DIR = path.resolve(__dirname, '../public/images/qa');

async function runDropdownUITests() {
  console.log('═════════════════════════════════════════════════════════════════');
  console.log('CivicSaarthi AI: Dropdown & Popup Positioning QA Verification');
  console.log('═════════════════════════════════════════════════════════════════');

  if (!fs.existsSync(SCREENSHOT_DIR)) {
    fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
  }

  // 1. Check or start dev server
  let viteProcess = null;
  const isServerRunning = await checkServer();
  if (!isServerRunning) {
    console.log('Starting local Vite dev server on port 5173...');
    const viteBin = path.resolve(__dirname, '../node_modules/vite/bin/vite.js');
    viteProcess = spawn(process.execPath, [viteBin, '--port', '5173', '--host', '127.0.0.1'], {
      cwd: path.resolve(__dirname, '..'),
      stdio: 'pipe',
    });
    viteProcess.stdout.on('data', (data) => console.log(`[Vite stdout] ${data}`));
    viteProcess.stderr.on('data', (data) => console.error(`[Vite stderr] ${data}`));
    // Wait for server to be responsive
    let ready = false;
    for (let i = 0; i < 30; i++) {
      await sleep(500);
      if (await checkServer()) {
        ready = true;
        console.log('Vite dev server is ready at http://127.0.0.1:5173');
        break;
      }
    }
    if (!ready) {
      throw new Error('Vite dev server failed to start within 15 seconds.');
    }
  } else {
    console.log('Vite dev server is already running at http://localhost:5173');
  }

  const tempProfileDir = path.join(os.tmpdir(), `civicsaarthi-dropdown-qa-${Date.now()}`);
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    userDataDir: tempProfileDir,
    args: [
      '--no-first-run',
      '--no-default-browser-check',
      '--disable-extensions',
      '--disable-background-networking',
      '--window-size=1440,900',
    ],
  });

  const page = await browser.newPage();
  const consoleErrors = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });

  const results = {
    desktopNotifications: null,
    desktopLanguage: null,
    desktopUserProfile: null,
    tabletNotifications: null,
    tabletLanguage: null,
    mobileNotifications: null,
    mobileLanguage: null,
    publicLanguage: null,
    consoleErrors,
  };

  try {
    // ═════════════════════════════════════════════════════════════════
    // 1. DESKTOP VIEWPORT (1440 x 900) - DASHBOARD
    // ═════════════════════════════════════════════════════════════════
    console.log('\n--- 1. Testing Dropdown Positioning on Desktop (1440px) ---');
    await page.setViewport({ width: 1440, height: 900 });

    // Seed authenticated session in localStorage
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

    await page.goto(`${BASE_URL}/dashboard`, { waitUntil: 'networkidle2' });
    await sleep(600);

    // 1A: Notification Popup
    console.log('Testing Notification Popup on Desktop...');
    const bellBtn = await page.waitForSelector('button[aria-label="Notifications"]');
    await bellBtn.click();
    await sleep(300);

    const notifMetricsDesktop = await page.evaluate(() => {
      // Find the portal notification popup (fixed z-[100])
      const notifHeaders = Array.from(document.querySelectorAll('div')).filter(
        (el) => el.textContent.includes('Notifications') && el.textContent.includes('new')
      );
      const panel = notifHeaders[0]?.closest('.fixed') || document.querySelector('.fixed.z-\\[100\\]');
      if (!panel) return null;
      const rect = panel.getBoundingClientRect();
      const style = window.getComputedStyle(panel);
      return {
        top: Math.round(rect.top),
        bottom: Math.round(rect.bottom),
        left: Math.round(rect.left),
        right: Math.round(rect.right),
        width: Math.round(rect.width),
        height: Math.round(rect.height),
        zIndex: parseInt(style.zIndex, 10),
        isVisible: rect.width > 0 && rect.height > 0 && style.display !== 'none',
        hasScrollableContent: panel.querySelector('.overflow-y-auto') !== null,
      };
    });

    console.log('Notification Panel Metrics (Desktop):', notifMetricsDesktop);
    results.desktopNotifications = notifMetricsDesktop;
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'dropdown-notifications-desktop.png') });

    // Click outside to dismiss
    await page.click('main');
    await sleep(250);

    // Verify it closed
    const isNotifClosed = await page.evaluate(() => {
      const panel = document.querySelector('.fixed.z-\\[100\\]');
      return panel === null;
    });
    console.log(`Notification Panel Closed on Outside Click: ${isNotifClosed ? 'PASSED' : 'FAILED'}`);

    // 1B: Language Switcher
    console.log('\nTesting Language Switcher on Desktop...');
    const langBtn = await page.waitForSelector('button[aria-label="Select language"]');
    await langBtn.click();
    await sleep(300);

    const langMetricsDesktop = await page.evaluate(() => {
      const langHeader = Array.from(document.querySelectorAll('div')).find(
        (el) => el.textContent.includes('Select Language')
      );
      const panel = langHeader?.closest('.fixed') || document.querySelector('.fixed.z-\\[100\\]');
      if (!panel) return null;
      const rect = panel.getBoundingClientRect();
      const style = window.getComputedStyle(panel);
      return {
        top: Math.round(rect.top),
        bottom: Math.round(rect.bottom),
        left: Math.round(rect.left),
        right: Math.round(rect.right),
        width: Math.round(rect.width),
        height: Math.round(rect.height),
        zIndex: parseInt(style.zIndex, 10),
        isVisible: rect.width > 0 && rect.height > 0,
      };
    });

    console.log('Language Switcher Metrics (Desktop):', langMetricsDesktop);
    results.desktopLanguage = langMetricsDesktop;
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'dropdown-language-desktop.png') });

    // Select Telugu
    console.log('Selecting Telugu language...');
    const teluguBtn = await page.evaluateHandle(() => {
      const buttons = Array.from(document.querySelectorAll('.fixed.z-\\[100\\] button'));
      return buttons.find((b) => b.textContent.includes('తెలుగు'));
    });
    if (teluguBtn) {
      await teluguBtn.click();
      await sleep(300);
    }

    // Verify language button updated to Telugu
    const buttonTextAfterTelugu = await page.evaluate(() => {
      const btn = document.querySelector('button[aria-label="Select language"]');
      return btn ? btn.textContent : '';
    });
    console.log(`Language Button Text after Telugu Selection: "${buttonTextAfterTelugu}" (Contains Telugu: ${buttonTextAfterTelugu.includes('తెలుగు') ? 'YES' : 'NO'})`);

    // Reopen and switch back to English
    const langBtn2 = await page.waitForSelector('button[aria-label="Select language"]');
    await langBtn2.click();
    await sleep(300);

    const englishBtn = await page.evaluateHandle(() => {
      const buttons = Array.from(document.querySelectorAll('.fixed.z-\\[100\\] button'));
      return buttons.find((b) => b.textContent.includes('English'));
    });
    if (englishBtn) {
      await englishBtn.click();
      await sleep(300);
    }
    const buttonTextAfterEnglish = await page.evaluate(() => {
      const btn = document.querySelector('button[aria-label="Select language"]');
      return btn ? btn.textContent : '';
    });
    console.log(`Language Button Text after English Selection: "${buttonTextAfterEnglish}"`);

    // 1C: User Profile Menu
    console.log('\nTesting User Profile Menu on Desktop...');
    const profileBtn = await page.waitForSelector('button[aria-label="User profile menu"]');
    await profileBtn.click();
    await sleep(300);

    const profileMetricsDesktop = await page.evaluate(() => {
      const profileItem = Array.from(document.querySelectorAll('a')).find(
        (el) => el.textContent.includes('Citizen Profile')
      );
      const panel = profileItem?.closest('.fixed') || document.querySelector('.fixed.z-\\[100\\]');
      if (!panel) return null;
      const rect = panel.getBoundingClientRect();
      const style = window.getComputedStyle(panel);
      return {
        top: Math.round(rect.top),
        bottom: Math.round(rect.bottom),
        left: Math.round(rect.left),
        right: Math.round(rect.right),
        width: Math.round(rect.width),
        height: Math.round(rect.height),
        zIndex: parseInt(style.zIndex, 10),
        isVisible: rect.width > 0 && rect.height > 0,
      };
    });

    console.log('User Profile Menu Metrics (Desktop):', profileMetricsDesktop);
    results.desktopUserProfile = profileMetricsDesktop;
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'dropdown-user-desktop.png') });

    // Test ESC key dismissal
    await page.keyboard.press('Escape');
    await sleep(250);
    const isProfileClosed = await page.evaluate(() => !document.querySelector('.fixed.z-\\[100\\]'));
    console.log(`User Profile Menu Closed on Escape Key: ${isProfileClosed ? 'PASSED' : 'FAILED'}`);

    // ═════════════════════════════════════════════════════════════════
    // 2. TABLET VIEWPORT (768 x 1024)
    // ═════════════════════════════════════════════════════════════════
    console.log('\n--- 2. Testing Dropdown Positioning on Tablet (768px) ---');
    await page.setViewport({ width: 768, height: 1024 });
    await page.goto(`${BASE_URL}/dashboard`, { waitUntil: 'networkidle2' });
    await sleep(500);

    // Notification Menu on Tablet
    const bellBtnTablet = await page.waitForSelector('button[aria-label="Notifications"]');
    await bellBtnTablet.click();
    await sleep(300);

    const notifMetricsTablet = await page.evaluate(() => {
      const panel = document.querySelector('.fixed.z-\\[100\\]');
      if (!panel) return null;
      const rect = panel.getBoundingClientRect();
      return {
        top: Math.round(rect.top),
        left: Math.round(rect.left),
        right: Math.round(rect.right),
        width: Math.round(rect.width),
        height: Math.round(rect.height),
        fitsInViewport: rect.left >= 0 && rect.right <= 768,
      };
    });
    console.log('Notification Panel Metrics (Tablet):', notifMetricsTablet);
    results.tabletNotifications = notifMetricsTablet;
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'dropdown-notifications-tablet.png') });

    await page.keyboard.press('Escape');
    await sleep(250);

    // Language Menu on Tablet
    const langBtnTablet = await page.waitForSelector('button[aria-label="Select language"]');
    await langBtnTablet.click();
    await sleep(300);

    const langMetricsTablet = await page.evaluate(() => {
      const panel = document.querySelector('.fixed.z-\\[100\\]');
      if (!panel) return null;
      const rect = panel.getBoundingClientRect();
      return {
        top: Math.round(rect.top),
        left: Math.round(rect.left),
        right: Math.round(rect.right),
        width: Math.round(rect.width),
        fitsInViewport: rect.left >= 0 && rect.right <= 768,
      };
    });
    console.log('Language Switcher Metrics (Tablet):', langMetricsTablet);
    results.tabletLanguage = langMetricsTablet;
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'dropdown-language-tablet.png') });

    await page.keyboard.press('Escape');
    await sleep(250);

    // ═════════════════════════════════════════════════════════════════
    // 3. MOBILE VIEWPORT (375 x 667) - iPhone SE Width
    // ═════════════════════════════════════════════════════════════════
    console.log('\n--- 3. Testing Dropdown Positioning on Mobile (375px) ---');
    await page.setViewport({ width: 375, height: 667 });
    await page.goto(`${BASE_URL}/dashboard`, { waitUntil: 'networkidle2' });
    await sleep(500);

    // Notification Menu on Mobile
    const bellBtnMobile = await page.waitForSelector('button[aria-label="Notifications"]');
    await bellBtnMobile.click();
    await sleep(300);

    const notifMetricsMobile = await page.evaluate(() => {
      const panel = document.querySelector('.fixed.z-\\[100\\]');
      if (!panel) return null;
      const rect = panel.getBoundingClientRect();
      return {
        top: Math.round(rect.top),
        left: Math.round(rect.left),
        right: Math.round(rect.right),
        width: Math.round(rect.width),
        height: Math.round(rect.height),
        fitsInViewport: rect.left >= 0 && rect.right <= 375,
        leftMargin: Math.round(rect.left),
        rightMargin: Math.round(375 - rect.right),
      };
    });
    console.log('Notification Panel Metrics (Mobile 375px):', notifMetricsMobile);
    results.mobileNotifications = notifMetricsMobile;
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'dropdown-notifications-mobile.png') });

    await page.keyboard.press('Escape');
    await sleep(250);

    // Language Menu on Mobile
    const langBtnMobile = await page.waitForSelector('button[aria-label="Select language"]');
    await langBtnMobile.click();
    await sleep(300);

    const langMetricsMobile = await page.evaluate(() => {
      const panel = document.querySelector('.fixed.z-\\[100\\]');
      if (!panel) return null;
      const rect = panel.getBoundingClientRect();
      return {
        top: Math.round(rect.top),
        left: Math.round(rect.left),
        right: Math.round(rect.right),
        width: Math.round(rect.width),
        fitsInViewport: rect.left >= 0 && rect.right <= 375,
        leftMargin: Math.round(rect.left),
        rightMargin: Math.round(375 - rect.right),
      };
    });
    console.log('Language Switcher Metrics (Mobile 375px):', langMetricsMobile);
    results.mobileLanguage = langMetricsMobile;
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'dropdown-language-mobile.png') });

    await page.keyboard.press('Escape');
    await sleep(250);

    // ═════════════════════════════════════════════════════════════════
    // 4. PUBLIC NAVBAR TEST (/)
    // ═════════════════════════════════════════════════════════════════
    console.log('\n--- 4. Testing Language Switcher on Public Navbar (/) ---');
    await page.setViewport({ width: 1440, height: 900 });
    await page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle2' });
    await sleep(500);

    const publicLangBtn = await page.waitForSelector('button[aria-label="Select language"]');
    await publicLangBtn.click();
    await sleep(300);

    const publicLangMetrics = await page.evaluate(() => {
      const panel = document.querySelector('.fixed.z-\\[100\\]');
      if (!panel) return null;
      const rect = panel.getBoundingClientRect();
      const style = window.getComputedStyle(panel);
      return {
        top: Math.round(rect.top),
        left: Math.round(rect.left),
        right: Math.round(rect.right),
        width: Math.round(rect.width),
        zIndex: parseInt(style.zIndex, 10),
        isVisible: rect.width > 0 && rect.height > 0,
      };
    });
    console.log('Public Navbar Language Switcher Metrics:', publicLangMetrics);
    results.publicLanguage = publicLangMetrics;
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'dropdown-language-public.png') });

    console.log('\nAll QA tests completed successfully!');
    console.log('Total Console Errors Logged:', consoleErrors.length);
  } catch (err) {
    console.error('Test execution failed:', err);
    throw err;
  } finally {
    await browser.close();
    if (viteProcess) {
      viteProcess.kill();
    }
  }

  return results;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function checkServer() {
  const http = require('http');
  return new Promise((resolve) => {
    const req = http.get(BASE_URL, (res) => {
      resolve(res.statusCode === 200);
    });
    req.on('error', () => resolve(false));
    req.setTimeout(1000, () => {
      req.destroy();
      resolve(false);
    });
  });
}

runDropdownUITests()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
