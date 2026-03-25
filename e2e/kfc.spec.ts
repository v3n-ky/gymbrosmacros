/**
 * KFC page e2e tests.
 * Verifies the /kfc route renders correctly and key items show expected macros
 * sourced from the KFC Australia API (captured 2026-03-25).
 */

import { test, expect } from '@playwright/test';

test.describe('KFC restaurant page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/kfc');
    await expect(page.locator('main')).toBeVisible({ timeout: 10000 });
  });

  test('page loads with KFC heading', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /kfc/i })).toBeVisible();
  });

  test('shows expected categories', async ({ page }) => {
    const body = await page.locator('main').textContent();
    expect(body).toMatch(/Burgers/i);
    expect(body).toMatch(/Chicken/i);
    expect(body).toMatch(/Snacks/i);
  });

  test('Zinger® Burger card shows correct calories and protein', async ({ page }) => {
    // API source: kJ=1874 → 448 kcal, protein=26.2g
    const card = page.locator('main').filter({ hasText: /Zinger.*Burger/ }).first();
    await expect(card).toBeVisible({ timeout: 5000 });
    const text = await card.textContent();
    expect(text).toMatch(/448\s*(cal|kcal)?/i);   // calories
    expect(text).toMatch(/26\.2\s*g/);             // protein — specific enough to avoid false matches
  });

  test('Regular Chips card shows correct calories', async ({ page }) => {
    // API source: kJ=1186 → 283 kcal
    const card = page.locator('main').filter({ hasText: /Regular Chips/ }).first();
    await expect(card).toBeVisible({ timeout: 5000 });
    const text = await card.textContent();
    expect(text).toMatch(/283/);
  });

  test('no duplicate item keys (React console error guard)', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error' && msg.text().includes('same key')) {
        errors.push(msg.text());
      }
    });
    await page.goto('/kfc');
    await page.waitForTimeout(1000);
    expect(errors, 'duplicate React key errors found').toHaveLength(0);
  });

  test('KFC appears in rankings page', async ({ page }) => {
    await page.goto('/rankings');
    const body = await page.locator('main').textContent();
    expect(body?.toLowerCase()).toContain('kfc');
  });

  test('KFC items appear in Find page results', async ({ page }) => {
    await page.goto('/find');
    await page.getByRole('button', { name: /lunch/i }).first().click();
    await page.getByPlaceholder('e.g. 40').fill('25');
    await expect(page.getByText(/top \d+ match/i)).toBeVisible({ timeout: 8000 });
    const body = await page.locator('main').textContent();
    expect(body?.toLowerCase()).toContain('kfc');
  });
});
