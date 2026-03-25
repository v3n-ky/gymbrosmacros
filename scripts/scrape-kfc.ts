/**
 * One-off scraper for KFC Australia nutrition data.
 * Run with: npx tsx scripts/scrape-kfc.ts
 *
 * Outputs: scripts/kfc-nutrition.json
 */

import { chromium } from 'playwright';
import { writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const URL = 'https://www.kfc.com.au/nutrition-allergen';

async function main() {
  const browser = await chromium.launch({
    headless: false, // some sites block headless — use headed mode
    args: ['--disable-blink-features=AutomationControlled'],
  });
  const context = await browser.newContext({
    userAgent:
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
    viewport: { width: 1280, height: 900 },
  });
  const page = await context.newPage();
  // Hide webdriver flag
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'webdriver', { get: () => undefined });
  });

  console.log('Navigating to KFC nutrition page...');
  await page.goto(URL, { waitUntil: 'domcontentloaded', timeout: 60000 });

  // Give JS a moment to fully render
  await page.waitForTimeout(3000);

  // Try to intercept any JSON API responses by re-navigating with request interception
  const apiData: unknown[] = [];
  page.on('response', async (response) => {
    const url = response.url();
    const contentType = response.headers()['content-type'] ?? '';
    if (contentType.includes('application/json') && url.includes('kfc')) {
      try {
        const json = await response.json();
        console.log(`Captured JSON from: ${url}`);
        apiData.push({ url, data: json });
      } catch {
        // ignore
      }
    }
  });

  // Reload to capture network requests with listener active
  console.log('Reloading to capture API responses...');
  await page.goto(URL, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(3000);

  if (apiData.length > 0) {
    const outPath = join(__dirname, 'kfc-api-responses.json');
    writeFileSync(outPath, JSON.stringify(apiData, null, 2));
    console.log(`\nSaved ${apiData.length} API response(s) to ${outPath}`);
  }

  // Also scrape the DOM — extract all visible nutrition data from the page
  console.log('Extracting nutrition data from DOM...');
  const items = await page.evaluate(() => {
    const results: Record<string, unknown>[] = [];

    // Try common patterns: tables, rows with nutrition data
    const rows = document.querySelectorAll('tr, [class*="nutrition"], [class*="menu-item"], [class*="product"]');
    rows.forEach((row) => {
      const text = row.textContent?.trim();
      if (text && text.length > 5) {
        const cells = Array.from(row.querySelectorAll('td, th, [class*="cell"], [class*="col"]'))
          .map(el => el.textContent?.trim())
          .filter(Boolean);
        if (cells.length > 1) {
          results.push({ cells, html: row.innerHTML.substring(0, 500) });
        }
      }
    });

    return results;
  });

  // Dump the full page HTML for manual inspection if needed
  const html = await page.content();
  const htmlPath = join(__dirname, 'kfc-page.html');
  writeFileSync(htmlPath, html);
  console.log(`Saved full page HTML to ${htmlPath}`);

  const domPath = join(__dirname, 'kfc-dom-rows.json');
  writeFileSync(domPath, JSON.stringify(items, null, 2));
  console.log(`Saved ${items.length} DOM rows to ${domPath}`);

  // Take a screenshot for visual inspection
  const ssPath = join(__dirname, 'kfc-screenshot.png');
  await page.screenshot({ path: ssPath, fullPage: true });
  console.log(`Screenshot saved to ${ssPath}`);

  await browser.close();
  console.log('\nDone!');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
