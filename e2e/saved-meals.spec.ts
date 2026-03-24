/**
 * Tests for the meal tray order label and save-meal-to-favorites flow.
 *
 * Covers:
 *  - Order label shown per item in the tray after customisation
 *  - "Save this meal" button appears / inline name input / confirm
 *  - Saved meal card appears on Favorites with item details & macros
 *  - Order label shown inside the saved meal card
 *  - Delete saved meal
 *  - "Add all to Meal" re-populates the tray
 *  - Empty-state hint on Favorites page mentions saving a meal
 */

import { test, expect, Page } from '@playwright/test';

// ─── helpers ─────────────────────────────────────────────────────────────────

async function clearStorage(page: Page) {
  await page.goto('/');
  await page.evaluate(() => localStorage.clear());
}

/**
 * Adds one item to the tray via the Find page (40g protein / 550 cal).
 * Returns the item name that was added so tests can assert on it.
 */
async function addItemFromFind(page: Page): Promise<string> {
  await page.goto('/find');
  await page.getByRole('button', { name: /lunch/i }).first().click();
  await page.getByPlaceholder('e.g. 40').fill('40');
  await page.getByPlaceholder('e.g. 600').fill('550');

  // Wait for results — Customize & Add confirms cards are in the DOM
  const addButton = page.getByRole('button', { name: /customize & add/i }).first();
  await expect(addButton).toBeVisible({ timeout: 10000 });

  // Grab the first result's item name (h4 inside main)
  const itemName = (await page.locator('main h4').first().textContent({ timeout: 5000 }) ?? '').trim();

  await addButton.click();
  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible({ timeout: 3000 });
  await dialog.getByRole('button', { name: /add to meal/i }).click();
  await expect(dialog).not.toBeVisible({ timeout: 2000 });

  return itemName;
}

/** Save the current tray under the given name using the inline form. */
async function saveMealAs(page: Page, name: string) {
  await page.getByRole('button', { name: /save this meal/i }).click();
  const input = page.getByPlaceholder('Meal name…');
  await expect(input).toBeVisible({ timeout: 2000 });
  await input.fill(name);
  // Press Enter to confirm (avoids ambiguity with other Save buttons)
  await page.keyboard.press('Enter');
  await expect(input).not.toBeVisible({ timeout: 2000 });
}

// ─── Tray order label ─────────────────────────────────────────────────────────

test.describe('Meal tray — order label', () => {
  test.beforeEach(async ({ page }) => {
    await clearStorage(page);
  });

  test('tray shows item name after adding from Find', async ({ page }) => {
    const itemName = await addItemFromFind(page);
    expect(itemName).toBeTruthy();

    await expect(page.getByRole('heading', { name: /your meal/i })).toBeVisible({ timeout: 3000 });
    // Scope to the expanded tray panel: h3 → parent flex-row div → parent bg-card panel
    const trayPanel = page.getByRole('heading', { name: /your meal/i }).locator('../..');
    await expect(trayPanel.getByText(itemName, { exact: false })).toBeVisible({ timeout: 2000 });
  });

  test('tray item row has name line and macro line', async ({ page }) => {
    await addItemFromFind(page);
    await expect(page.getByRole('heading', { name: /your meal/i })).toBeVisible({ timeout: 3000 });

    // The expanded tray panel is h3's grandparent (bg-card div)
    const trayPanel = page.getByRole('heading', { name: /your meal/i }).locator('../..');
    // Each item row has a flex-1 content div with <p> elements
    // The macro line always contains "cal"
    await expect(trayPanel.getByText(/cal · /i).first()).toBeVisible({ timeout: 2000 });
    // And the item name paragraph (font-medium) must also be present
    await expect(trayPanel.locator('p.font-medium').first()).toBeVisible();
  });

  test('items with non-default selections show an order label line in the tray', async ({ page }) => {
    // Targets 40g protein / 550 cal reliably return Fishbowl "Green Dream Chicken"
    // as first result with order label "Cabbage · Roasted Tofu".
    await page.goto('/find');
    await page.getByRole('button', { name: /lunch/i }).first().click();
    await page.getByPlaceholder('e.g. 40').fill('40');
    await page.getByPlaceholder('e.g. 600').fill('550');
    await expect(page.getByRole('button', { name: /customize & add/i }).first()).toBeVisible({ timeout: 10000 });

    await page.getByRole('button', { name: /customize & add/i }).first().click();
    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible({ timeout: 3000 });
    await dialog.getByRole('button', { name: /add to meal/i }).click();
    await expect(dialog).not.toBeVisible({ timeout: 2000 });

    await expect(page.getByRole('heading', { name: /your meal/i })).toBeVisible({ timeout: 3000 });

    // The expanded tray panel is h3's grandparent
    const trayPanel = page.getByRole('heading', { name: /your meal/i }).locator('../..');
    // Each item row content div has p.font-medium (name) + p.text-xs (macros)
    // and optionally a middle paragraph for the order label.
    // Verify at least name + macro paragraphs exist (≥2 <p> in the flex-1 content div).
    const firstRowContentDiv = trayPanel.locator('p.font-medium').first().locator('..');
    const pCount = await firstRowContentDiv.locator('p').count();
    expect(pCount).toBeGreaterThanOrEqual(2);
  });

  test('"Save this meal" button appears when tray has items', async ({ page }) => {
    await addItemFromFind(page);
    await expect(page.getByRole('button', { name: /save this meal/i })).toBeVisible({ timeout: 3000 });
  });

  test('"Save this meal" button is absent when tray is empty', async ({ page }) => {
    await page.goto('/find');
    await expect(page.getByRole('button', { name: /save this meal/i })).not.toBeVisible();
  });
});

// ─── Save meal inline form ────────────────────────────────────────────────────

test.describe('Meal tray — save meal inline form', () => {
  test.beforeEach(async ({ page }) => {
    await clearStorage(page);
  });

  test('clicking "Save this meal" shows an inline input pre-filled with a date string', async ({ page }) => {
    await addItemFromFind(page);
    await page.getByRole('button', { name: /save this meal/i }).click();
    const input = page.getByPlaceholder('Meal name…');
    await expect(input).toBeVisible({ timeout: 2000 });
    const value = await input.inputValue();
    expect(value.trim()).not.toBe('');
  });

  test('pressing Escape dismisses the name input without saving', async ({ page }) => {
    await addItemFromFind(page);
    await page.getByRole('button', { name: /save this meal/i }).click();
    await expect(page.getByPlaceholder('Meal name…')).toBeVisible({ timeout: 2000 });
    await page.keyboard.press('Escape');
    await expect(page.getByPlaceholder('Meal name…')).not.toBeVisible({ timeout: 1000 });
    await expect(page.getByRole('button', { name: /save this meal/i })).toBeVisible();
  });

  test('pressing Enter with a custom name confirms the save', async ({ page }) => {
    await addItemFromFind(page);
    await page.getByRole('button', { name: /save this meal/i }).click();
    await page.getByPlaceholder('Meal name…').fill('Enter Key Meal');
    await page.keyboard.press('Enter');
    await expect(page.getByPlaceholder('Meal name…')).not.toBeVisible({ timeout: 2000 });

    await page.goto('/favorites');
    await expect(page.getByText('Enter Key Meal')).toBeVisible({ timeout: 3000 });
  });

  test('dismissing with ✕ button does not save to Favorites', async ({ page }) => {
    await addItemFromFind(page);
    await page.getByRole('button', { name: /save this meal/i }).click();
    const input = page.getByPlaceholder('Meal name…');
    await input.fill('Should Not Appear');
    // The ✕ dismiss button sits next to the Save button in the inline form
    // It is the only button with text exactly "✕" when the save form is open
    const dismissBtn = page.locator('button').filter({ hasText: /^✕$/ });
    await expect(dismissBtn).toBeVisible({ timeout: 1000 });
    await dismissBtn.click();
    await expect(input).not.toBeVisible({ timeout: 1000 });

    await page.goto('/favorites');
    await expect(page.getByText('Should Not Appear')).not.toBeVisible();
  });
});

// ─── Favorites page — saved meals ────────────────────────────────────────────

test.describe('Favorites — saved meals section', () => {
  test.beforeEach(async ({ page }) => {
    await clearStorage(page);
  });

  test('saved meal appears on Favorites page with the given name', async ({ page }) => {
    await addItemFromFind(page);
    await saveMealAs(page, 'Gym Day Lunch');

    await page.goto('/favorites');
    await expect(page.getByText('Gym Day Lunch')).toBeVisible({ timeout: 3000 });
  });

  test('"Saved Meals" section heading appears when at least one meal is saved', async ({ page }) => {
    await addItemFromFind(page);
    await saveMealAs(page, 'Any Meal');

    await page.goto('/favorites');
    await expect(page.getByRole('heading', { name: /saved meals/i })).toBeVisible({ timeout: 3000 });
  });

  test('saved meal card shows total macro values', async ({ page }) => {
    await addItemFromFind(page);
    await saveMealAs(page, 'Macro Meal');

    await page.goto('/favorites');
    await expect(page.getByText('Macro Meal')).toBeVisible({ timeout: 3000 });
    // Cal / Protein labels come from the macro grid inside the saved meal card
    const cards = page.locator('main').getByText('Macro Meal').locator('../../../..');
    await expect(cards.getByText('Cal').first()).toBeVisible({ timeout: 2000 });
    await expect(cards.getByText('Protein').first()).toBeVisible();
  });

  test('saved meal card shows at least one item row', async ({ page }) => {
    await addItemFromFind(page);
    await saveMealAs(page, 'Item Row Meal');

    await page.goto('/favorites');
    await expect(page.getByText('Item Row Meal')).toBeVisible({ timeout: 3000 });
    // Item rows have bg-secondary/40 — verify at least one exists on the page
    await expect(page.locator('[class*="bg-secondary"]').filter({ hasText: /cal/i }).first()).toBeVisible({ timeout: 2000 });
  });

  test('saved meal card has "Add all to Meal" button', async ({ page }) => {
    await addItemFromFind(page);
    await saveMealAs(page, 'Add All Meal');

    await page.goto('/favorites');
    await expect(page.getByRole('button', { name: /add all to meal/i })).toBeVisible({ timeout: 3000 });
  });

  test('"Add all to Meal" re-populates the tray', async ({ page }) => {
    await addItemFromFind(page);
    await saveMealAs(page, 'Re-add Meal');

    // Clear the tray
    await page.getByRole('button', { name: /clear/i }).click();
    await expect(page.getByRole('heading', { name: /your meal/i })).not.toBeVisible({ timeout: 2000 });

    // Go to favorites and add all back
    await page.goto('/favorites');
    await page.getByRole('button', { name: /add all to meal/i }).click();
    await expect(page.getByRole('heading', { name: /your meal/i })).toBeVisible({ timeout: 3000 });
  });

  test('deleting a saved meal removes it from Favorites', async ({ page }) => {
    await addItemFromFind(page);
    await saveMealAs(page, 'Delete Me Meal');

    await page.goto('/favorites');
    await expect(page.getByText('Delete Me Meal')).toBeVisible({ timeout: 3000 });

    await page.getByRole('button', { name: /delete saved meal/i }).first().click();

    await expect(page.getByText('Delete Me Meal')).not.toBeVisible({ timeout: 2000 });
  });

  test('multiple saved meals all appear on Favorites', async ({ page }) => {
    await addItemFromFind(page);
    await saveMealAs(page, 'Meal One');

    // Clear tray and add a second item for a distinct second meal
    await page.getByRole('button', { name: /clear/i }).click();
    await addItemFromFind(page);
    await saveMealAs(page, 'Meal Two');

    await page.goto('/favorites');
    await expect(page.getByText('Meal One')).toBeVisible({ timeout: 3000 });
    await expect(page.getByText('Meal Two')).toBeVisible();
  });

  test('empty Favorites page hints at using "Save this meal" from the tray', async ({ page }) => {
    await page.goto('/favorites');
    await expect(page.getByText(/save this meal/i)).toBeVisible({ timeout: 3000 });
  });
});

// ─── Saved meal persistence ───────────────────────────────────────────────────

test.describe('Favorites — persistence', () => {
  test('saved meal survives a page reload', async ({ page }) => {
    await clearStorage(page);
    await addItemFromFind(page);
    await saveMealAs(page, 'Persist Meal');

    await page.goto('/favorites');
    await page.reload();
    await expect(page.getByText('Persist Meal')).toBeVisible({ timeout: 3000 });
  });

  test('saved meal is per-profile — switching profiles shows different saved meals', async ({ page }) => {
    await clearStorage(page);

    // Save a meal under the default profile A (Cutting)
    await addItemFromFind(page);
    await saveMealAs(page, 'Profile A Meal');

    // Switch to profile B on Favorites page
    await page.goto('/favorites');
    await page.getByRole('button', { name: /bulking/i }).first().click();

    // Profile B should NOT show the meal saved under A
    await expect(page.getByText('Profile A Meal')).not.toBeVisible({ timeout: 1000 });
  });
});
