import { test, expect, Page } from '@playwright/test';

/**
 * Meal tray visibility tests.
 * These catch the class of bug where "Add to Meal" silently writes to
 * localStorage but no tray appears in the UI.
 */

async function clearStorage(page: Page) {
  await page.goto('/');
  await page.evaluate(() => localStorage.clear());
}

/** The tray heading — matches "Your Meal (N items)" on desktop. */
function trayHeading(page: Page) {
  return page.getByRole('heading', { name: /your meal/i });
}

/** Add one item via the Find page. Always goes through the customizer dialog. */
async function addItemFromFind(page: Page) {
  await page.goto('/find');

  // Select Lunch
  await page.getByRole('button', { name: /lunch/i }).first().click();

  // Enter a protein target to get results — placeholder is "e.g. 40"
  await page.getByPlaceholder('e.g. 40').fill('30');

  // Wait for and click the first result's Customize & Add button
  const addButton = page.getByRole('button', { name: /customize & add/i }).first();
  await expect(addButton).toBeVisible({ timeout: 8000 });
  await addButton.click();

  // The customizer dialog always opens — wait for it and confirm
  const dialogAdd = page.getByRole('dialog').getByRole('button', { name: /add to meal/i });
  await expect(dialogAdd).toBeVisible({ timeout: 3000 });
  await dialogAdd.click();

  // Dialog should close
  await expect(page.getByRole('dialog')).not.toBeVisible({ timeout: 2000 });
}

// ─── Find a Meal page ────────────────────────────────────────────────────────

test.describe('Meal tray — Find a Meal page', () => {
  test.beforeEach(async ({ page }) => {
    await clearStorage(page);
  });

  test('tray is hidden when meal is empty', async ({ page }) => {
    await page.goto('/find');
    await expect(trayHeading(page)).not.toBeVisible();
  });

  test('adding an item shows the tray', async ({ page }) => {
    await addItemFromFind(page);
    await expect(trayHeading(page)).toBeVisible({ timeout: 3000 });
  });

  test('tray shows 1 item after adding one', async ({ page }) => {
    await addItemFromFind(page);
    await expect(page.getByRole('heading', { name: /your meal \(1 item\)/i })).toBeVisible({ timeout: 3000 });
  });
});

// ─── Restaurant page ─────────────────────────────────────────────────────────

test.describe('Meal tray — restaurant page', () => {
  test.beforeEach(async ({ page }) => {
    await clearStorage(page);
  });

  test('adding an item shows the tray', async ({ page }) => {
    await page.goto('/subway');

    // MenuItemCards are divs; clicking any of them opens the customizer.
    // Find one by its "Protein" label (all cards have this) and click the parent card.
    const firstCard = page.locator('main').locator('h4').first();
    await expect(firstCard).toBeVisible({ timeout: 5000 });
    await firstCard.click();

    // Customizer dialog opens — confirm add
    const dialogAdd = page.getByRole('dialog').getByRole('button', { name: /add to meal/i });
    await expect(dialogAdd).toBeVisible({ timeout: 3000 });
    await dialogAdd.click();

    await expect(trayHeading(page)).toBeVisible({ timeout: 3000 });
  });
});

// ─── Cross-page persistence ──────────────────────────────────────────────────

test.describe('Meal tray — persistence across navigation', () => {
  test('items added on Find page persist when navigating to home', async ({ page }) => {
    await clearStorage(page);
    await addItemFromFind(page);
    await expect(trayHeading(page)).toBeVisible({ timeout: 3000 });

    await page.goto('/');
    await expect(trayHeading(page)).toBeVisible({ timeout: 3000 });
  });

  test('items added on Find page are visible on a restaurant page', async ({ page }) => {
    await clearStorage(page);
    await addItemFromFind(page);

    await page.goto('/subway');
    await expect(trayHeading(page)).toBeVisible({ timeout: 3000 });
  });
});

// ─── Tray interactions ───────────────────────────────────────────────────────

test.describe('Meal tray — clear and remove', () => {
  test('Clear button removes all items and hides tray', async ({ page }) => {
    await clearStorage(page);
    await addItemFromFind(page);
    await expect(trayHeading(page)).toBeVisible({ timeout: 3000 });

    await page.getByRole('button', { name: /clear/i }).click();
    await expect(trayHeading(page)).not.toBeVisible({ timeout: 3000 });
  });

  test('removing the only item hides the tray', async ({ page }) => {
    await clearStorage(page);
    await addItemFromFind(page);
    await expect(page.getByRole('heading', { name: /your meal \(1 item\)/i })).toBeVisible({ timeout: 3000 });

    // The remove button in the tray row is labelled "x" (exact)
    await page.locator('button').filter({ hasText: /^x$/ }).first().click();
    await expect(trayHeading(page)).not.toBeVisible({ timeout: 3000 });
  });
});
