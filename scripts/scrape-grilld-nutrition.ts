/**
 * Scrape Grill'd nutrition data from grilld.com.au/nutrition
 *
 * Usage:  npx tsx scripts/scrape-grilld-nutrition.ts
 * Output: scripts/grilld-nutrition-raw.json   (all intercepted API JSON)
 *         scripts/grilld-nutrition-parsed.json (clean table per item/bun)
 *
 * Strategy:
 *  - Intercept ALL JSON API responses while clicking through the nutrition page.
 *  - For each burger/item: click it, then click each bun option.
 *  - Scrape the visible nutrition table from the DOM after each bun selection.
 *  - Also save all intercepted API responses so we can inspect the full structure.
 */

import { chromium, Page } from 'playwright';
import { writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';

const NUTRITION_URL = 'https://www.grilld.com.au/nutrition';
const RAW_OUT    = join(__dirname, 'grilld-nutrition-raw.json');
const PARSED_OUT = join(__dirname, 'grilld-nutrition-parsed.json');
const DEBUG_DIR  = join(__dirname, '..', 'docs', 'scrape-debug');

// ── types ─────────────────────────────────────────────────────────────────────

interface NutritionRow {
  nutrient: string;
  perServe: string;
  per100g: string;
}

interface VariantData {
  variantName: string;
  kJ: number;
  kcal: number;
  nutrition: NutritionRow[];
}

interface ItemData {
  name: string;
  category: string;
  variants: VariantData[];
}

// ── helpers ──────────────────────────────────────────────────────────────────

function parseKj(text: string): number {
  const m = text.match(/(\d[\d,]*)\s*kJ/i);
  return m ? parseInt(m[1].replace(/,/g, ''), 10) : 0;
}

function kcalFromKj(kj: number): number {
  return Math.round(kj / 4.184);
}

async function ss(page: Page, name: string) {
  mkdirSync(DEBUG_DIR, { recursive: true });
  await page.screenshot({ path: join(DEBUG_DIR, `${name}.png`), fullPage: false });
}

/** Read the nutrition table currently visible in the page */
async function readNutritionTable(page: Page): Promise<NutritionRow[]> {
  // Grill'd table structure (from DOM inspection):
  //   Each row is an array: ["Nutrient", "value per serve", "% daily", "per 100g"]
  // We look for the rendered HTML table first, then fall back to text parsing.

  const rows: NutritionRow[] = [];

  // Strategy 1: HTML <table> rows
  const trs = await page.locator('table tr').all();
  for (const tr of trs) {
    const cells = await tr.locator('td').allTextContents();
    if (cells.length >= 2) {
      const nutrient = cells[0].trim();
      if (/energy|protein|^fat$|saturated|carbohydrate|dietary fibre|sugars|sodium/i.test(nutrient)) {
        rows.push({
          nutrient,
          perServe: cells[1]?.trim() ?? '',
          per100g: cells[cells.length - 1]?.trim() ?? '',
        });
      }
    }
  }
  if (rows.length >= 3) return rows;

  // Strategy 2: div-based rows (inspect actual class names below)
  // The Grill'd nutrition modal has rows like:
  //   <div class="nutrition-row"> <span>Energy</span> <span>2050kJ</span> … </div>
  const nutritionContainer = page.locator(
    '[class*="nutrition"], [class*="allergen"], [class*="macros"]'
  ).last();
  const allText = await nutritionContainer.innerText().catch(() => '');
  const lines = allText.split('\n').map((l) => l.trim()).filter(Boolean);

  for (let i = 0; i < lines.length; i++) {
    if (/^(energy|protein|fat|saturated fat|carbohydrate|dietary fibre|sugars|sodium)$/i.test(lines[i])) {
      rows.push({
        nutrient: lines[i],
        perServe: lines[i + 1] ?? '',
        per100g: lines[i + 3] ?? '', // skip daily% column
      });
      i += 3;
    }
  }

  return rows;
}

// ── main ─────────────────────────────────────────────────────────────────────

async function main() {
  const browser = await chromium.launch({ headless: false, slowMo: 80 });
  const context = await browser.newContext({
    userAgent:
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
    viewport: { width: 1280, height: 900 },
  });
  const page = await context.newPage();

  // Intercept ALL JSON API responses
  const apiCaptures: Record<string, unknown> = {};
  page.on('response', async (resp) => {
    const url = resp.url();
    if (resp.headers()['content-type']?.includes('json')) {
      try {
        apiCaptures[url] = await resp.json();
      } catch { /* ignore */ }
    }
  });

  // ── Load nutrition page ───────────────────────────────────────────────────
  console.log('Loading nutrition page…');
  await page.goto(NUTRITION_URL, { waitUntil: 'networkidle', timeout: 45000 });
  await ss(page, '01-loaded');

  // Dismiss overlays
  for (const text of ['Accept All', 'Accept Cookies', 'Got It', 'Close', 'Dismiss']) {
    const btn = page.getByRole('button', { name: new RegExp(text, 'i') }).first();
    if (await btn.isVisible({ timeout: 1500 }).catch(() => false)) {
      await btn.click();
      await page.waitForTimeout(500);
    }
  }

  // ── Find the item list ────────────────────────────────────────────────────
  // On the nutrition page, items appear as card buttons — look for a grid/list
  // of burger names.  Try multiple selector strategies.
  const itemSelectors = [
    '[data-testid="menu-item"]',
    '[class*="menu-item"]',
    '[class*="product"]',
    '[class*="burger"]',
    'li[class*="item"]',
  ];

  let itemCards = page.locator('button, a, li').filter({
    hasText: /chicken|beef|lamb|garden|caesar|simply|crispy|sweet chilli|chilli|beefy|almighty/i,
  });

  // Trim to reasonable count
  const cardCount = await itemCards.count();
  console.log(`Item-like elements found: ${cardCount}`);
  await ss(page, '02-before-items');

  // Log first 20 visible texts so we know what to click
  for (let i = 0; i < Math.min(cardCount, 20); i++) {
    const text = (await itemCards.nth(i).textContent())?.trim().slice(0, 60);
    console.log(`  [${i}] ${text}`);
  }

  // ── Scrape loop ────────────────────────────────────────────────────────────
  const allItems: ItemData[] = [];

  // Target items we care about (must match the title text, case-insensitive partial)
  const targets = [
    { match: /simply grill.?d/i,         category: 'Beef Burgers' },
    { match: /crispy bacon.*cheese/i,     category: 'Beef Burgers' },
    { match: /beefy deluxe/i,            category: 'Beef Burgers' },
    { match: /summer sunset/i,           category: 'Beef Burgers' },
    { match: /sweet chilli chicken/i,    category: 'Chicken Burgers' },
    { match: /garden goodness/i,         category: 'Vegetarian' },
    { match: /chicken caesar salad/i,    category: 'Salads' },
    { match: /honey.d hen/i,             category: 'Salads' },
    { match: /superpower salad/i,        category: 'Salads' },
    { match: /famous grill.d chips.*regular/i, category: 'Chips' },
    { match: /sweet potato chips.*regular/i,   category: 'Chips' },
  ];

  for (const target of targets) {
    // Find the clickable element for this item
    const el = page
      .locator('button, a, li, [role="button"]')
      .filter({ hasText: target.match })
      .first();

    const visible = await el.isVisible({ timeout: 3000 }).catch(() => false);
    if (!visible) {
      console.log(`  ⚠  Not found: ${target.match}`);
      continue;
    }

    const label = (await el.textContent())?.trim() ?? '';
    console.log(`\nOpening: ${label}`);

    await el.click({ timeout: 8000 });
    await page.waitForTimeout(1000); // let modal/panel open

    // Capture any new API calls
    await page.waitForTimeout(500);
    await ss(page, `item-${label.replace(/[^a-z0-9]/gi, '-').slice(0, 30)}`);

    // ── Scrape bun variants ─────────────────────────────────────────────────
    const variants: VariantData[] = [];

    // Find bun option buttons — they're image buttons with labels like
    // "Hi Fibre Lo GI Bun", "Low Carb SuperBun", "Gluten Free"
    const bunBtns = page
      .locator('button, [role="button"]')
      .filter({ hasText: /bun|superbun|gluten free|lettuce/i });
    const bunCount = await bunBtns.count();
    console.log(`  Bun options: ${bunCount}`);

    if (bunCount === 0) {
      // No bun selector — scrape once
      const kJText = await page.locator('text=/\\d+kJ/i').first().textContent().catch(() => '');
      const kj = parseKj(kJText ?? '');
      const nutrition = await readNutritionTable(page);
      variants.push({ variantName: 'Default', kJ: kj, kcal: kcalFromKj(kj), nutrition });
    } else {
      for (let b = 0; b < bunCount; b++) {
        const btn = bunBtns.nth(b);
        const variantName = (await btn.textContent())?.trim().replace(/\s+/g, ' ') ?? `Bun ${b + 1}`;
        if (variantName.length > 60) continue;

        await btn.click({ timeout: 5000 });
        await page.waitForTimeout(600);

        const kJText = await page.locator('text=/\\d+kJ/i').first().textContent().catch(() => '');
        const kj = parseKj(kJText ?? '');
        const nutrition = await readNutritionTable(page);

        console.log(`    [${variantName}] kJ:${kj} P:${nutrition.find(r => /protein/i.test(r.nutrient))?.perServe ?? '?'}`);
        variants.push({ variantName, kJ: kj, kcal: kcalFromKj(kj), nutrition });
      }
    }

    if (variants.length > 0) {
      allItems.push({ name: label, category: target.category, variants });
    }

    // Close the item detail (back button or overlay click)
    const backBtn = page.locator('button').filter({ hasText: /back|close|‹|←/i }).first();
    const hasBack = await backBtn.isVisible({ timeout: 1000 }).catch(() => false);
    if (hasBack) {
      await backBtn.click();
    } else {
      await page.keyboard.press('Escape');
    }
    await page.waitForTimeout(600);
  }

  await ss(page, '99-done');
  await browser.close();

  // ── Save outputs ──────────────────────────────────────────────────────────
  writeFileSync(RAW_OUT, JSON.stringify({ apiCaptures, allItems }, null, 2), 'utf8');

  if (allItems.length === 0) {
    console.log('\n⚠  No items scraped — check docs/scrape-debug/ screenshots.');
    console.log('   The page structure may have changed; update selectors above.');
  } else {
    // Print summary
    console.log('\n── Scraped items ────────────────────────────────────────────────────────────');
    for (const item of allItems) {
      console.log(`\n${item.name}  [${item.category}]`);
      for (const v of item.variants) {
        const p   = v.nutrition.find(r => /protein/i.test(r.nutrient))?.perServe ?? '?';
        const fat = v.nutrition.find(r => /^fat$/i.test(r.nutrient))?.perServe ?? '?';
        const c   = v.nutrition.find(r => /carbohydrate/i.test(r.nutrient))?.perServe ?? '?';
        console.log(`  [${v.variantName}]  ${v.kcal} kcal / ${v.kJ} kJ  |  P:${p}  F:${fat}  C:${c}`);
      }
    }

    writeFileSync(PARSED_OUT, JSON.stringify(allItems, null, 2), 'utf8');
    console.log(`\n✓ ${allItems.length} items saved → ${PARSED_OUT}`);
  }

  // Also save any new API URLs intercepted (may reveal the nutrition endpoint)
  console.log('\nIntercepted API endpoints:');
  Object.keys(apiCaptures).forEach((u) => console.log(' ', u));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
