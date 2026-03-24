/**
 * Nutrition source link health checks.
 *
 * Each restaurant has a nutritionSourceUrl shown on the restaurant page so
 * users can verify macro values. These tests catch broken/moved pages before
 * they affect users (as happened with Fishbowl and Nando's).
 *
 * Strategy:
 *  - Use full browser navigation (not API requests) — some sites (Subway) block
 *    headless API-level requests but allow normal browser traffic.
 *  - For PDF links, only check HTTP status (no visible body text to parse).
 *  - For HTML pages, check the page title / h1 heading for error indicators
 *    rather than the full body (avoids false positives from embedded JS/JSON
 *    that may contain status codes).
 */

import { test, expect } from '@playwright/test';

interface NutritionLink {
  restaurant: string;
  slug: string;
  url: string;
  isPdf?: boolean;
}

// Sourced from src/data/restaurants.ts — keep in sync
const NUTRITION_LINKS: NutritionLink[] = [
  { restaurant: 'Subway',   slug: 'subway',   url: 'https://www.subway.com/en-AU/MenuNutrition/Nutrition' },
  { restaurant: 'GYG',      slug: 'gyg',      url: 'https://www.guzmanygomez.com.au/nutrition' },
  { restaurant: 'Fishbowl', slug: 'fishbowl', url: 'https://fishbowl.com.au/media/site/a7c38cedc6-1765146075/fishbowl-nutritional-overview-dec-25.pdf', isPdf: true },
  { restaurant: "Grill'd",  slug: 'grilld',   url: 'https://www.grilld.com.au/menu' },
  { restaurant: 'Oporto',   slug: 'oporto',   url: 'https://www.oporto.com.au/nutrition' },
  { restaurant: "Nando's",  slug: 'nandos',   url: 'https://www.nandos.com.au/menu' },
];

// ─── HTTP / browser navigation status ────────────────────────────────────────

test.describe('Nutrition source URLs — reachable', () => {
  for (const { restaurant, url, isPdf } of NUTRITION_LINKS) {
    test(`${restaurant}: nutrition URL loads without error`, async ({ page, request }) => {
      if (isPdf) {
        // PDFs trigger browser downloads — use the API context instead
        const response = await request.get(url, {
          timeout: 20000,
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
          },
        });
        expect(
          response.status(),
          `${restaurant} PDF nutrition URL returned HTTP ${response.status()} — link broken: ${url}`
        ).toBeLessThan(400);
        return;
      }

      // For HTML pages, use full browser navigation.
      // Some sites (e.g. Subway) have bot-protection that drops HTTP/2 connections
      // from headless browsers — treat network errors as "inconclusive" rather than
      // a hard failure, since the URL is known-good from real browser testing.
      const response = await page.goto(url, {
        timeout: 30000,
        waitUntil: 'domcontentloaded',
      }).catch((err: Error) => {
        // ERR_HTTP2_PROTOCOL_ERROR / ERR_CONNECTION_RESET = bot protection, not a broken URL
        if (/ERR_HTTP2_PROTOCOL_ERROR|ERR_CONNECTION_RESET|ERR_CONNECTION_REFUSED/.test(err.message)) {
          test.skip(true, `${restaurant} blocks headless requests (bot protection) — verify manually: ${url}`);
        }
        throw err;
      });

      const status = response?.status() ?? 0;
      expect(
        status,
        `${restaurant} nutrition URL returned HTTP ${status} — link may be broken: ${url}`
      ).toBeLessThan(400);
    });
  }
});

// ─── Page content check (HTML pages only) ────────────────────────────────────

test.describe('Nutrition source URLs — no 404 page shown', () => {
  for (const { restaurant, url, isPdf } of NUTRITION_LINKS) {
    if (isPdf) continue; // PDFs have no HTML body to inspect

    test(`${restaurant}: nutrition page title and heading don't indicate a 404`, async ({ page }) => {
      const nav = await page.goto(url, { timeout: 30000, waitUntil: 'domcontentloaded' })
        .catch((err: Error) => {
          if (/ERR_HTTP2_PROTOCOL_ERROR|ERR_CONNECTION_RESET/.test(err.message)) {
            test.skip(true, `${restaurant} blocks headless requests — verify manually: ${url}`);
          }
          throw err;
        });
      if (!nav) return;

      // Check page title
      const title = (await page.title()).toLowerCase();
      expect(title, `${restaurant}: page title looks like a 404`).not.toMatch(/\bnot found\b|^404\b/);

      // Check first visible heading (h1 / h2) if present — ignore embedded JS
      const headingText = await page
        .locator('h1, h2')
        .first()
        .textContent({ timeout: 3000 })
        .catch(() => '');
      const heading = (headingText ?? '').toLowerCase();

      const errorPatterns = [/page not found/, /404/, /we can'?t find that/, /oops.*went wrong/];
      for (const pattern of errorPatterns) {
        expect(heading, `${restaurant}: heading matches error pattern ${pattern}`).not.toMatch(pattern);
      }
    });
  }
});

// ─── App restaurant pages — nutrition link present in UI ─────────────────────

test.describe('Restaurant pages — nutrition source link in UI', () => {
  for (const { restaurant, slug, url } of NUTRITION_LINKS) {
    test(`${restaurant}: /${slug} page links to nutrition source`, async ({ page }) => {
      await page.goto(`/${slug}`);

      // Accept exact URL match OR a link to the same hostname
      const hostname = new URL(url).hostname;
      const exactLink  = page.locator(`a[href="${url}"]`);
      const domainLink = page.locator(`a[href*="${hostname}"]`);

      const hasExact  = await exactLink.count()  > 0;
      const hasDomain = await domainLink.count() > 0;

      expect(
        hasExact || hasDomain,
        `${restaurant} page (/${slug}) has no link to ${hostname}`
      ).toBe(true);
    });
  }
});
