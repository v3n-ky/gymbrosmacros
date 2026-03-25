/**
 * Scrape Oporto nutrition data.
 *
 * Strategy:
 *  1. Open oporto.com.au, click "Start an Order" to open the store locator modal.
 *  2. Wait for stores to load, then click "Order Pickup" on the first open store.
 *  3. Intercept the auth token from in-browser API calls.
 *  4. With the token, call the Oporto mobile API directly to get menu + nutrition.
 *  5. Separately, scrape CalorieKing for P/C/F (if accessible).
 *  6. Reconcile: scale CalorieKing P/C/F to official kJ/kcal from the API.
 *
 * Usage:  npx tsx scripts/scrape-oporto-nutrition.ts
 * Output: scripts/oporto-nutrition-raw.json
 *         scripts/oporto-nutrition-parsed.json
 */

import { chromium, Page, Request } from 'playwright';
import { writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';

const RAW_OUT    = join(__dirname, 'oporto-nutrition-raw.json');
const PARSED_OUT = join(__dirname, 'oporto-nutrition-parsed.json');
const DEBUG_DIR  = join(__dirname, '..', 'docs', 'scrape-debug');

interface OfficialItem {
  name: string;
  kJ: number;
  kcal: number;
  protein?: number;
  carbs?: number;
  fat?: number;
}

interface ThirdPartyItem {
  name: string;
  kcal: number;
  protein: number;
  carbs: number;
  fat: number;
  source: string;
  url: string;
}

interface ReconciledItem {
  name: string;
  officialKcal: number;
  officialKj: number;
  thirdPartyKcal: number;
  protein: number;
  carbs: number;
  fat: number;
  macroCalCheck: number;
  source: string;
}

// ── helpers ───────────────────────────────────────────────────────────────────

function kjToKcal(kj: number): number { return Math.round(kj / 4.184); }

async function ss(page: Page, name: string) {
  mkdirSync(DEBUG_DIR, { recursive: true });
  await page.screenshot({ path: join(DEBUG_DIR, `oporto-${name}.png`), fullPage: false });
}

async function dismissOverlays(page: Page) {
  for (const text of ['Accept All', 'Accept Cookies', 'I agree', 'Allow All', 'OK', 'Got It']) {
    const btn = page.getByRole('button', { name: new RegExp(`^${text}$`, 'i') }).first();
    if (await btn.isVisible({ timeout: 1000 }).catch(() => false)) {
      await btn.click();
      await page.waitForTimeout(300);
    }
  }
}

function parseKj(text: string): number {
  const m = text.match(/(\d[\d,]*)\s*kJ/i);
  return m ? parseInt(m[1].replace(/,/g, ''), 10) : 0;
}

function parseKcal(text: string): number {
  const m = text.match(/(\d[\d,]*)\s*[Cc]al(?!ories\s+per)/);
  return m ? parseInt(m[1].replace(/,/g, ''), 10) : 0;
}

// ── Phase 1: Navigate ordering flow + intercept auth token ────────────────────

const TARGET_ITEMS = [
  'Bondi Burger',
  'Double Bondi Burger',
  'Original Chilli Chicken Burger',
  'Chicken Rappa',
  'Grilled Chicken Rappa',
  'Pulled Chicken Bowl',
  'Grilled Chicken Bowl',
  'Chicken Tenders (5pc)',
];

async function scrapeViaOrderFlow(page: Page): Promise<{
  official: OfficialItem[];
  authToken: string | null;
  authHeaders: Record<string, string>;
  apiCaptures: Record<string, unknown>;
  storeId: string | null;
}> {
  console.log('\n── Phase 1: Order flow + auth token intercept ───────────────────────────');

  const apiCaptures: Record<string, unknown> = {};
  let authToken: string | null = null;
  let storeId: string | null = null;
  const authHeaders: Record<string, string> = {};

  // Intercept responses and requests to capture auth tokens + data
  page.on('response', async (resp) => {
    const ct = resp.headers()['content-type'] ?? '';
    if (ct.includes('json')) {
      try { apiCaptures[resp.url()] = await resp.json(); } catch { /* ignore */ }
    }
  });

  page.on('request', (req: Request) => {
    const url = req.url();
    if (url.includes('api.oporto.com.au') || url.includes('mobile-services')) {
      const headers = req.headers();
      // Look for Authorization or x-api-key style headers
      for (const [k, v] of Object.entries(headers)) {
        if (/authorization|x-api-key|api-key|token|bearer/i.test(k)) {
          authToken = v;
          authHeaders[k] = v;
          console.log(`  ✓ Auth header captured: ${k} = ${v.slice(0, 40)}…`);
        }
      }
      // Log the full request headers for any oporto API call
      if (Object.keys(authHeaders).length === 0) {
        console.log(`  Oporto API call: ${url}`);
        const interesting = Object.entries(headers).filter(([k]) =>
          !/^(:authority|:method|:path|:scheme|accept-encoding|accept-language|cache-control|pragma|sec-|upgrade-insecure)/.test(k)
        );
        interesting.forEach(([k, v]) => console.log(`    ${k}: ${v.slice(0, 60)}`));
      }
    }
  });

  // ── Step 1: Load homepage ─────────────────────────────────────────────────
  await page.goto('https://www.oporto.com.au', { waitUntil: 'networkidle', timeout: 30000 });
  await dismissOverlays(page);
  await page.waitForTimeout(1000);
  await ss(page, '01-homepage');

  // ── Step 2: Click "Start an Order" to open the store locator modal ─────────
  const startOrderBtn = page.locator('a, button').filter({ hasText: /start an order/i }).first();
  if (await startOrderBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
    console.log('  Clicking "Start an Order"…');
    await startOrderBtn.click();
    await page.waitForTimeout(3000); // wait for modal + store list to load
    await ss(page, '01-store-modal');
  } else {
    console.log('  "Start an Order" not found — looking for other entry points');
    await ss(page, '01-no-start-btn');
  }

  // ── Step 3: Wait for the store list and click "Order Pickup" ──────────────
  // Try multiple selectors for the Order Pickup button
  const orderPickupSelectors = [
    'a:has-text("Order Pickup")',
    'button:has-text("Order Pickup")',
    '[href*="order"]:has-text("Pickup")',
    'text=Order Pickup',
  ];

  let clicked = false;
  for (const sel of orderPickupSelectors) {
    const btn = page.locator(sel).first();
    if (await btn.isVisible({ timeout: 2000 }).catch(() => false)) {
      const href = await btn.getAttribute('href').catch(() => null);
      console.log(`  Clicking "Order Pickup" (${sel}) → href: ${href}`);
      // Capture store ID from URL if present
      if (href) {
        const storeMatch = href.match(/store[_-]?id[=\/](\d+)|\/stores?\/(\d+)|restaurant[=\/](\d+)/i);
        if (storeMatch) storeId = storeMatch[1] ?? storeMatch[2] ?? storeMatch[3];
      }
      await btn.click();
      clicked = true;
      break;
    }
  }

  if (!clicked) {
    // Also try "View Menu" as a fallback
    const viewMenuBtn = page.locator('a, button').filter({ hasText: /view menu/i }).first();
    if (await viewMenuBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
      console.log('  No "Order Pickup" — clicking "View Menu"');
      await viewMenuBtn.click();
      clicked = true;
    }
  }

  if (!clicked) {
    console.log('  ⚠ No store action button found — modal content:');
    const modalText = await page.locator('body').innerText().catch(() => '');
    modalText.split('\n').filter(l => l.trim()).slice(0, 50)
      .forEach((l, i) => console.log(`    [${i}] ${l.trim()}`));
  } else {
    await page.waitForTimeout(4000);
    await page.waitForLoadState('networkidle').catch(() => {});
    await page.waitForTimeout(2000);
    await ss(page, '01-after-store-select');
    console.log(`  URL after click: ${page.url()}`);
  }

  // ── Step 4: Check what loaded + try to scrape item kJ ─────────────────────
  const postClickText = await page.locator('body').innerText().catch(() => '');
  const lines = postClickText.split('\n').filter(l => l.trim());
  console.log(`\n  Page after store select (${lines.length} lines):`);
  lines.slice(0, 60).forEach((l, i) => console.log(`    [${i}] ${l.trim()}`));

  // Check frames
  const frames = page.frames();
  console.log(`\n  Frames: ${frames.length}`);
  for (const frame of frames) {
    const furl = frame.url();
    if (furl && furl !== 'about:blank') {
      console.log(`    [frame] ${furl}`);
      const ft = await frame.locator('body').innerText().catch(() => '');
      if (ft.length > 50) {
        console.log('    Frame content (first 30 lines):');
        ft.split('\n').filter(l => l.trim()).slice(0, 30)
          .forEach((l, i) => console.log(`      [${i}] ${l.trim()}`));
      }
    }
  }

  // Try scraping kJ values from visible menu items
  const official: OfficialItem[] = [];
  for (const name of TARGET_ITEMS) {
    const pattern = new RegExp(name.split(' ').slice(0, 2).join('\\s+'), 'i');
    const itemEl = page.locator('[class*="item"], [class*="card"], [class*="product"], li')
      .filter({ hasText: pattern }).first();
    if (!await itemEl.isVisible({ timeout: 1000 }).catch(() => false)) continue;

    const cardText = await itemEl.innerText().catch(() => '');
    const kj = parseKj(cardText);
    const kcal = parseKcal(cardText);
    if (kj || kcal) {
      official.push({ name, kJ: kj || Math.round(kcal * 4.184), kcal: kj ? kjToKcal(kj) : kcal });
      console.log(`  ✓ ${name}: ${kj}kJ = ${kjToKcal(kj)}kcal`);
    }
  }

  // Print all intercepted API endpoints
  console.log('\n  All intercepted API endpoints:');
  Object.keys(apiCaptures).forEach(u => console.log(`    ${u}`));

  return { official, authToken, authHeaders, apiCaptures, storeId };
}

// ── Phase 1b: Direct Oporto API call with captured auth ───────────────────────

async function fetchOportoMenuAPI(
  authHeaders: Record<string, string>,
  storeId: string | null,
  apiCaptures: Record<string, unknown>
): Promise<OfficialItem[]> {
  console.log('\n── Phase 1b: Direct Oporto mobile API ───────────────────────────────────');

  if (Object.keys(authHeaders).length === 0) {
    console.log('  ⚠ No auth headers captured — cannot call API directly');

    // Try to find nutrition from already-captured API data
    console.log('  Scanning captured API data for nutrition…');
    for (const [url, data] of Object.entries(apiCaptures)) {
      const str = JSON.stringify(data);
      if (/kJ|calories|protein|bondi/i.test(str)) {
        console.log(`  Possible nutrition data at: ${url}`);
        console.log(`  Preview: ${str.slice(0, 300)}`);
      }
    }
    return [];
  }

  const headerEntries = Object.entries(authHeaders).map(([k, v]) => `"${k}": "${v}"`).join(', ');
  console.log(`  Auth headers: ${headerEntries.slice(0, 80)}…`);

  // Try common menu API endpoints with the auth token
  const storeParam = storeId ? `?storeId=${storeId}` : '';
  const endpoints = [
    `https://api.oporto.com.au/mobile-services/menu${storeParam}`,
    `https://api.oporto.com.au/mobile-services/v1/menu${storeParam}`,
    `https://api.oporto.com.au/mobile-services/v2/menu${storeParam}`,
    `https://api.oporto.com.au/mobile-services/products${storeParam}`,
    `https://api.oporto.com.au/mobile-services/v1/items`,
    `https://api.oporto.com.au/mobile-services/v2/items`,
  ];

  for (const endpoint of endpoints) {
    try {
      const res = await fetch(endpoint, {
        headers: {
          ...authHeaders,
          'Accept': 'application/json',
          'User-Agent': 'Mozilla/5.0',
        },
      });
      const body = await res.text();
      console.log(`  ${endpoint} → ${res.status}: ${body.slice(0, 200)}`);
      if (res.ok) {
        const data = JSON.parse(body);
        // Save for inspection
        writeFileSync(
          join(__dirname, 'oporto-api-menu.json'),
          JSON.stringify(data, null, 2),
          'utf8'
        );
        console.log('  ✓ Menu data saved to scripts/oporto-api-menu.json');
        break;
      }
    } catch (e: unknown) {
      console.log(`  ${endpoint} → error: ${(e as Error).message}`);
    }
  }

  return [];
}

// ── Phase 2: CalorieKing (with long wait) ─────────────────────────────────────

const CK_TARGETS = [
  { name: 'Bondi Burger',                   query: 'oporto bondi burger' },
  { name: 'Double Bondi Burger',            query: 'oporto double bondi burger' },
  { name: 'Original Chilli Chicken Burger', query: 'oporto original chilli chicken' },
  { name: 'Chicken Rappa',                  query: 'oporto chicken rappa' },
  { name: 'Grilled Chicken Rappa',          query: 'oporto grilled chicken rappa' },
  { name: 'Pulled Chicken Bowl',            query: 'oporto pulled chicken bowl' },
  { name: 'Grilled Chicken Bowl',           query: 'oporto grilled chicken bowl' },
  { name: 'Chicken Tenders (5pc)',          query: 'oporto chicken tenders' },
];

async function scrapeCalorieKing(page: Page): Promise<ThirdPartyItem[]> {
  console.log('\n── Phase 2: calorieking.com.au ──────────────────────────────────────────');
  const results: ThirdPartyItem[] = [];

  // Visit CalorieKing homepage first to establish session
  await page.goto('https://www.calorieking.com.au', {
    waitUntil: 'domcontentloaded', timeout: 20000,
  }).catch(() => {});
  await page.waitForTimeout(5000);
  await dismissOverlays(page);
  await ss(page, '02-ck-home');

  const homeText = (await page.locator('body').innerText().catch(() => '')).trim();
  if (!homeText) {
    console.log('  ⚠ CalorieKing is blank — geo-blocked or bot-detected, skipping');
    return results;
  }
  console.log(`  Homepage loaded (${homeText.split('\n').length} lines)`);

  for (const t of CK_TARGETS) {
    const url = `https://www.calorieking.com.au/foods/search?keywords=${encodeURIComponent(t.query)}`;
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 20000 }).catch(() => {});
    await page.waitForTimeout(4000);
    await dismissOverlays(page);
    await ss(page, `02-ck-${t.name.replace(/[^a-z0-9]/gi, '-').slice(0, 25)}`);

    const searchText = await page.locator('body').innerText().catch(() => '');
    const oportoLinks = await page.locator('a').filter({ hasText: /oporto/i }).all();
    console.log(`\n  "${t.query}": ${oportoLinks.length} Oporto links`);

    if (oportoLinks.length === 0) {
      console.log(`    Page lines: ${searchText.split('\n').filter(l => l.trim()).length}`);
      continue;
    }

    await oportoLinks[0].click({ timeout: 8000 });
    await page.waitForTimeout(3000);
    const detailText = await page.locator('body').innerText().catch(() => '');
    const detailUrl = page.url();

    const kcalM  = detailText.match(/Calories?\s*[:\-]?\s*(\d+)/i);
    const kjM    = detailText.match(/(\d{3,4})\s*kJ/i);
    const protM  = detailText.match(/Protein\s*[:\-]?\s*(\d+\.?\d*)\s*g/i);
    const fatM   = detailText.match(/(?:Total\s+)?Fat\s*[:\-]?\s*(\d+\.?\d*)\s*g/i);
    const carbsM = detailText.match(/(?:Total\s+)?Carb(?:ohydrate)?s?\s*[:\-]?\s*(\d+\.?\d*)\s*g/i);

    if ((kcalM || kjM) && protM && fatM && carbsM) {
      const kcal = kcalM ? parseInt(kcalM[1]) : kjToKcal(parseInt(kjM![1]));
      results.push({ name: t.name, kcal, protein: parseFloat(protM[1]), fat: parseFloat(fatM[1]), carbs: parseFloat(carbsM[1]), source: 'CalorieKing AU', url: detailUrl });
      console.log(`    ✓ ${kcal} kcal | P:${protM[1]}g C:${carbsM[1]}g F:${fatM[1]}g`);
    } else {
      console.log(`    ⚠ Incomplete — kcal:${kcalM?.[1]??'?'} P:${protM?.[1]??'?'} F:${fatM?.[1]??'?'} C:${carbsM?.[1]??'?'}`);
    }
  }

  return results;
}

// ── Phase 3: Reconcile ────────────────────────────────────────────────────────

function reconcile(official: OfficialItem[], thirdParty: ThirdPartyItem[]): ReconciledItem[] {
  console.log('\n── Phase 3: Reconciliation ──────────────────────────────────────────────');
  const out: ReconciledItem[] = [];

  for (const tp of thirdParty) {
    const off = official.find(o =>
      o.name.toLowerCase().split(' ').some(w => w.length > 3 && tp.name.toLowerCase().includes(w))
    );

    const tpMacro  = tp.protein * 4 + tp.carbs * 4 + tp.fat * 9;
    const offKcal  = off?.kcal ?? tp.kcal;
    const offKj    = off?.kJ   ?? Math.round(tp.kcal * 4.184);
    const scale    = tpMacro > 0 ? offKcal / tpMacro : 1;
    const protein  = Math.round(tp.protein * scale);
    const carbs    = Math.round(tp.carbs   * scale);
    const fat      = Math.round(tp.fat      * scale);
    const check    = Math.round(protein * 4 + carbs * 4 + fat * 9);

    console.log(`  ${tp.name}`);
    console.log(`    Official: ${offKcal} kcal  3rd-party: ${tp.kcal} kcal  scale ×${scale.toFixed(3)}`);
    console.log(`    → P:${protein}g C:${carbs}g F:${fat}g  (check: ${check} kcal)`);

    out.push({ name: tp.name, officialKcal: offKcal, officialKj: offKj, thirdPartyKcal: tp.kcal, protein, carbs, fat, macroCalCheck: check, source: tp.source });
  }

  return out;
}

// ── main ──────────────────────────────────────────────────────────────────────

async function main() {
  const browser = await chromium.launch({ headless: false, slowMo: 50 });
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
    viewport: { width: 1280, height: 900 },
  });
  const page = await context.newPage();

  let official: OfficialItem[] = [];
  let authHeaders: Record<string, string> = {};
  let apiCaptures: Record<string, unknown> = {};
  let storeId: string | null = null;
  let thirdParty: ThirdPartyItem[] = [];

  try {
    const r = await scrapeViaOrderFlow(page);
    official    = r.official;
    authHeaders = r.authHeaders;
    apiCaptures = r.apiCaptures;
    storeId     = r.storeId;
  } catch (e) {
    console.error('Phase 1 failed:', e);
  }

  // If we captured auth, try the direct API
  if (Object.keys(authHeaders).length > 0 && official.length === 0) {
    try {
      const apiItems = await fetchOportoMenuAPI(authHeaders, storeId, apiCaptures);
      if (apiItems.length > 0) official = apiItems;
    } catch (e) {
      console.error('Phase 1b failed:', e);
    }
  }

  try {
    thirdParty = await scrapeCalorieKing(page);
  } catch (e) {
    console.error('Phase 2 failed:', e);
  }

  await browser.close();

  const reconciled = reconcile(official, thirdParty);

  writeFileSync(RAW_OUT,    JSON.stringify({ official, thirdParty, apiCaptures }, null, 2), 'utf8');
  writeFileSync(PARSED_OUT, JSON.stringify(reconciled, null, 2), 'utf8');

  console.log(`\n✓ Raw    → ${RAW_OUT}`);
  console.log(`✓ Parsed → ${PARSED_OUT}`);

  if (reconciled.length > 0) {
    console.log('\n── menu.ts baseMacros patch preview ─────────────────────────────────────');
    for (const item of reconciled) {
      const gap = item.officialKcal - item.macroCalCheck;
      const gapNote = Math.abs(gap) > 20 ? `  ⚠ gap ${gap > 0 ? '+' : ''}${gap} kcal` : '';
      console.log(`  // ${item.name}  [official: ${item.officialKcal} kcal | ${item.source}]`);
      console.log(`  baseMacros: { calories: ${item.officialKcal}, protein: ${item.protein}, carbs: ${item.carbs}, fat: ${item.fat} },${gapNote}`);
    }
  }

  console.log('\n── Status ───────────────────────────────────────────────────────────────');
  console.log(`  Official calories: ${official.length}/${TARGET_ITEMS.length} items`);
  console.log(`  Third-party macros: ${thirdParty.length}/${TARGET_ITEMS.length} items`);
  if (official.length === 0) {
    console.log('\n  Next steps for official calories:');
    console.log('  1. Check docs/scrape-debug/oporto-01-*.png for the ordering system URL');
    console.log('  2. If ordering is in a third-party SPA, note the URL from the screenshots');
    console.log('  3. Auth headers captured:', JSON.stringify(authHeaders));
  }
  if (thirdParty.length === 0) {
    console.log('\n  Next steps for macros:');
    console.log('  - CalorieKing AU: calorieking.com.au → search "oporto" (manual lookup)');
    console.log('  - FoodSwitch AU:  foodswitch.com.au → search each item (manual lookup)');
  }
}

main().catch(err => { console.error(err); process.exit(1); });
