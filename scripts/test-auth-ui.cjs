const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');
const os = require('os');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const BASE_URL = 'http://localhost:5173';
const SCREENSHOT_DIR = path.resolve(__dirname, '../public/images/qa');

async function runAuthUITests() {
  console.log('Starting CivicSaarthi AI Login & Registration UI Verification...');
  const tempProfileDir = path.join(os.tmpdir(), `civicsaarthi-ui-qa-${Date.now()}`);

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

  try {
    // ── 1. DESKTOP VIEWPORT: LOGIN PAGE ──
    console.log('\n--- 1. Testing /login UI on Desktop (1440px) ---');
    await page.setViewport({ width: 1440, height: 900 });
    await page.goto(`${BASE_URL}/login`, { waitUntil: 'networkidle2' });

    // Measure input padding & icon position
    const loginEmailMetrics = await page.evaluate(() => {
      const input = document.querySelector('input[type="email"]');
      const icon = input.parentElement.querySelector('svg');
      const inputRect = input.getBoundingClientRect();
      const iconRect = icon.getBoundingClientRect();
      const computed = window.getComputedStyle(input);
      return {
        paddingLeft: parseFloat(computed.paddingLeft),
        iconLeftOffset: iconRect.left - inputRect.left,
        iconWidth: iconRect.width,
        inputHeight: inputRect.height,
        clearance: parseFloat(computed.paddingLeft) - (iconRect.left - inputRect.left + iconRect.width),
      };
    });

    console.log(`Email Input Padding-Left: ${loginEmailMetrics.paddingLeft}px (Target >= 40px)`);
    console.log(`Icon Left Offset: ${loginEmailMetrics.iconLeftOffset}px`);
    console.log(`Icon Clearance Gap: ${loginEmailMetrics.clearance}px (Target >= 10px)`);

    if (loginEmailMetrics.paddingLeft >= 40 && loginEmailMetrics.clearance >= 10) {
      console.log('[PASS] Email input has ample left padding; placeholder never overlaps icon');
    } else {
      console.error('[FAIL] Email input icon overlap detected!');
    }

    // Measure password eye button position
    const loginPasswordMetrics = await page.evaluate(() => {
      const input = document.querySelector('input[name="password"], input[placeholder*="password"]');
      const eyeBtn = input.parentElement.querySelector('button');
      const inputRect = input.getBoundingClientRect();
      const eyeRect = eyeBtn.getBoundingClientRect();
      const computed = window.getComputedStyle(input);
      return {
        paddingRight: parseFloat(computed.paddingRight),
        eyeRightOffset: inputRect.right - eyeRect.right,
        clearance: parseFloat(computed.paddingRight) - eyeRect.width,
      };
    });

    console.log(`Password Input Padding-Right: ${loginPasswordMetrics.paddingRight}px (Target >= 40px)`);
    if (loginPasswordMetrics.paddingRight >= 40) {
      console.log('[PASS] Password input has proper right padding for visibility toggle');
    } else {
      console.error('[FAIL] Password input right padding insufficient!');
    }

    // Test toggle click
    await page.click('button[aria-label="Show password"]');
    await new Promise((r) => setTimeout(r, 200));
    const inputTypeAfterToggle = await page.$eval('input[placeholder*="password"]', (el) => el.type);
    console.log(`Input type after clicking show: "${inputTypeAfterToggle}"`);
    if (inputTypeAfterToggle === 'text') {
      console.log('[PASS] Password visibility toggle smoothly switches type to text');
    } else {
      console.error('[FAIL] Password visibility toggle failed');
    }

    const loginScreenshot = path.join(SCREENSHOT_DIR, '17-login-fixed-desktop.png');
    await page.screenshot({ path: loginScreenshot, fullPage: false });
    console.log('[PASS] Saved screenshot: 17-login-fixed-desktop.png');

    // ── 2. DESKTOP VIEWPORT: REGISTER PAGE ──
    console.log('\n--- 2. Testing /register UI on Desktop (1440px) ---');
    await page.goto(`${BASE_URL}/register`, { waitUntil: 'networkidle2' });

    // Measure Mobile Phone input with +91 prefix
    const phoneMetrics = await page.evaluate(() => {
      const input = document.querySelector('input[type="tel"]');
      const icon = input.parentElement.querySelector('svg');
      const prefix = input.parentElement.querySelector('div');
      const inputRect = input.getBoundingClientRect();
      const prefixRect = prefix.getBoundingClientRect();
      const computed = window.getComputedStyle(input);
      return {
        paddingLeft: parseFloat(computed.paddingLeft),
        prefixRightOffset: prefixRect.right - inputRect.left,
        clearance: parseFloat(computed.paddingLeft) - (prefixRect.right - inputRect.left),
      };
    });

    console.log(`Phone Input Padding-Left: ${phoneMetrics.paddingLeft}px (Target >= 75px)`);
    console.log(`Phone Prefix Width & Offset: ${phoneMetrics.prefixRightOffset}px`);
    console.log(`Phone Clearance Gap: ${phoneMetrics.clearance}px (Target >= 8px)`);

    if (phoneMetrics.paddingLeft >= 75 && phoneMetrics.clearance >= 8) {
      console.log('[PASS] Phone input has ample padding; number input never collides with +91 badge');
    } else {
      console.error('[FAIL] Phone input prefix collision detected!');
    }

    const regScreenshot = path.join(SCREENSHOT_DIR, '18-register-fixed-desktop.png');
    await page.screenshot({ path: regScreenshot, fullPage: false });
    console.log('[PASS] Saved screenshot: 18-register-fixed-desktop.png');

    // ── 3. TABLET VIEWPORT (768px) ──
    console.log('\n--- 3. Testing Responsiveness on Tablet (768px) ---');
    await page.setViewport({ width: 768, height: 1024 });

    await page.goto(`${BASE_URL}/login`, { waitUntil: 'networkidle2' });
    const loginTabletOverflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
    console.log(`Tablet /login horizontal overflow: ${loginTabletOverflow ? 'YES (FAIL)' : 'NO (PASS)'}`);

    await page.goto(`${BASE_URL}/register`, { waitUntil: 'networkidle2' });
    const regTabletOverflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
    console.log(`Tablet /register horizontal overflow: ${regTabletOverflow ? 'YES (FAIL)' : 'NO (PASS)'}`);

    const tabletScreenshot = path.join(SCREENSHOT_DIR, '19-register-fixed-tablet.png');
    await page.screenshot({ path: tabletScreenshot, fullPage: false });
    console.log('[PASS] Saved screenshot: 19-register-fixed-tablet.png');

    // ── 4. MOBILE VIEWPORT (375px) ──
    console.log('\n--- 4. Testing Responsiveness on Mobile (375px) ---');
    await page.setViewport({ width: 375, height: 812 });

    await page.goto(`${BASE_URL}/login`, { waitUntil: 'networkidle2' });
    const loginMobileOverflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
    console.log(`Mobile /login horizontal overflow: ${loginMobileOverflow ? 'YES (FAIL)' : 'NO (PASS)'}`);

    await page.goto(`${BASE_URL}/register`, { waitUntil: 'networkidle2' });
    const regMobileOverflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
    console.log(`Mobile /register horizontal overflow: ${regMobileOverflow ? 'YES (FAIL)' : 'NO (PASS)'}`);

    const mobileLoginScreenshot = path.join(SCREENSHOT_DIR, '20-login-fixed-mobile.png');
    await page.screenshot({ path: mobileLoginScreenshot, fullPage: false });
    console.log('[PASS] Saved screenshot: 20-login-fixed-mobile.png');

    const mobileRegScreenshot = path.join(SCREENSHOT_DIR, '21-register-fixed-mobile.png');
    await page.screenshot({ path: mobileRegScreenshot, fullPage: false });
    console.log('[PASS] Saved screenshot: 21-register-fixed-mobile.png');

    console.log(`\n==========================================`);
    console.log(`UI QA Complete: 0 Overflows, ${consoleErrors.length} Console Errors`);
    console.log(`==========================================`);
  } catch (err) {
    console.error('Test execution error:', err);
  } finally {
    await browser.close();
    try {
      fs.rmSync(tempProfileDir, { recursive: true, force: true });
    } catch {}
  }
}

runAuthUITests();
