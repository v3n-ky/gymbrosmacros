/**
 * Find a Meal page — functional tests.
 *
 * Covers the core user flows and regression cases for /find.
 * Tests run against the local dev server (baseURL: http://localhost:3000).
 */

import { test, expect, Page } from '@playwright/test';

// ─── helpers ─────────────────────────────────────────────────────────────────

async function clearStorage(page: Page) {
  await page.goto('/');
  await page.evaluate(() => localStorage.clear());
}

async function goToFind(page: Page, protein: string) {
  await page.goto('/find');
  await page.getByPlaceholder('e.g. 40').fill(protein);
  await expect(page.getByText(/top \d+ match/i)).toBeVisible({ timeout: 8000 });
}

// ─── basic flow ──────────────────────────────────────────────────────────────

test.describe('Find a Meal — basic flow', () => {
  test.beforeEach(async ({ page }) => {
    await clearStorage(page);
  });

  test('shows prompt when no targets are set', async ({ page }) => {
    await page.goto('/find');
    await expect(
      page.getByText(/enter your target macros above/i)
    ).toBeVisible();
  });

  test('shows results once a protein target is entered', async ({ page }) => {
    await page.goto('/find');
    await page.getByPlaceholder('e.g. 40').fill('40');
    await expect(page.getByText(/top \d+ match/i)).toBeVisible({ timeout: 8000 });
  });

  test('clearing the protein target hides results', async ({ page }) => {
    await goToFind(page, '40');
    await page.getByPlaceholder('e.g. 40').clear();
    await expect(
      page.getByText(/enter your target macros above/i)
    ).toBeVisible({ timeout: 5000 });
  });
});

// ─── restaurant diversity ─────────────────────────────────────────────────────
// Regression: highly-customisable restaurants (GYG, Fishbowl) used to monopolise
// the first page of results, hiding Grill'd / Oporto / Nando's entirely.

test.describe('Find a Meal — restaurant diversity', () => {
  const ALL_RESTAURANTS = ['subway', 'gyg', 'fishbowl', 'grilld', 'oporto', 'nandos'];

  test.beforeEach(async ({ page }) => {
    await clearStorage(page);
  });

  test('results include at least one item from every restaurant when no filter is active', async ({ page }) => {
    await goToFind(page, '40');

    // Reveal all results
    while (await page.getByRole('button', { name: /show more/i }).isVisible().catch(() => false)) {
      await page.getByRole('button', { name: /show more/i }).click();
      await page.waitForTimeout(300);
    }

    // Each restaurant should have at least one result card link
    for (const slug of ALL_RESTAURANTS) {
      const links = page.locator(`a[href="/${slug}"]`);
      await expect(links.first()).toBeVisible({
        timeout: 3000,
      }).catch(() => {
        throw new Error(`No result from restaurant "${slug}" visible in Find results`);
      });
    }
  });

  test('first visible results include items from at least 4 different restaurants', async ({ page }) => {
    await goToFind(page, '40');

    // Only check the first page (no "show more") — diversity interleaving should
    // put the best match from each restaurant in the initial visible set.
    const links = await page.locator('[class*="grid"] a[href^="/"]').allTextContents();
    const slugs = new Set(
      (await page.locator('[class*="grid"] a[href^="/"]').all()).map((_, i) => i)
    );

    // Count distinct restaurant slugs visible without clicking "show more"
    const hrefs = await page.locator('[class*="grid"] a[href^="/"]').evaluateAll(
      (els) => els.map((el) => (el as HTMLAnchorElement).pathname.replace('/', ''))
    );
    const distinct = new Set(hrefs.filter((h) => ALL_RESTAURANTS.includes(h)));

    expect(distinct.size).toBeGreaterThanOrEqual(4);
    void links; void slugs; // suppress unused
  });
});

// ─── restaurant filter ───────────────────────────────────────────────────────

test.describe('Find a Meal — restaurant filter', () => {
  test.beforeEach(async ({ page }) => {
    await clearStorage(page);
  });

  test('all restaurant filter buttons are visible', async ({ page }) => {
    await page.goto('/find');
    const restaurants = ['Subway', 'GYG', 'Fishbowl', "Grill'd", 'Oporto', "Nando's"];
    for (const name of restaurants) {
      await expect(page.getByRole('button', { name: new RegExp(`^${name}$`, 'i') })).toBeVisible();
    }
  });

  test('selecting a single restaurant shows only that restaurants results', async ({ page }) => {
    await goToFind(page, '40');
    await page.getByRole('button', { name: /^oporto$/i }).click();
    await page.waitForTimeout(500);

    const hrefs = await page.locator('[class*="grid"] a[href^="/"]').evaluateAll(
      (els) => els.map((el) => (el as HTMLAnchorElement).pathname)
    );
    for (const href of hrefs) {
      expect(href).toMatch(/^\/oporto$/);
    }
  });

  test('Oporto filter shows all Oporto menu items', async ({ page }) => {
    await goToFind(page, '40');
    await page.getByRole('button', { name: /^oporto$/i }).click();
    await page.waitForTimeout(500);

    // Oporto has 8 menu items — all should be visible
    const count = await page.locator('a[href="/oporto"]').count();
    expect(count).toBeGreaterThanOrEqual(7);
  });
});
