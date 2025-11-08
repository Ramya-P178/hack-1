const { chromium } = require('playwright');

(async () => {
  const base = process.env.BASE_URL || 'http://localhost:8080';
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  try {
    console.log('Opening site:', base);
    await page.goto(base, { waitUntil: 'networkidle' });

    // --- About page check ---
    console.log('Navigating to About page...');
    await page.goto(`${base}/about`, { waitUntil: 'networkidle' });

    // Try clicking the "Company Founded" milestone trigger
    const aboutTrigger = page.locator('text=Company Founded').first();
    if (await aboutTrigger.count() === 0) {
      throw new Error('Could not find About milestone trigger with text "Company Founded"');
    }
    console.log('Clicking About milestone trigger...');
    await aboutTrigger.click();

    // Wait for a dialog to appear
    await page.waitForSelector('[role="dialog"]', { timeout: 5000 });
    console.log('About dialog appeared');

    // Close dialog with Escape
    await page.keyboard.press('Escape');
    await page.waitForTimeout(400);

    // --- Services page check ---
    console.log('Navigating to Services page...');
    await page.goto(`${base}/services`, { waitUntil: 'networkidle' });

    // Find Learn more buttons and click the first two (if present)
    const learnButtons = page.locator('text=Learn more');
    const count = await learnButtons.count();
    if (count === 0) {
      throw new Error('No "Learn more" buttons found on Services page');
    }

    const toTest = Math.min(2, count);
    for (let i = 0; i < toTest; i++) {
      console.log(`Clicking Learn more #${i + 1}`);
      await learnButtons.nth(i).click();
      await page.waitForSelector('[role="dialog"]', { timeout: 5000 });
      console.log(`Service dialog #${i + 1} opened`);
      await page.keyboard.press('Escape');
      await page.waitForTimeout(300);
    }

    console.log('All verifications passed');
    await browser.close();
    process.exit(0);
  } catch (err) {
    console.error('Verification failed:', err);
    await browser.close();
    process.exit(2);
  }
})();
