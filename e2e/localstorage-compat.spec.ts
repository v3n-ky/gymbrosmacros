/**
 * localStorage backward-compatibility tests.
 *
 * Each test seeds a realistic "old" localStorage shape that a real user's browser
 * could contain, then verifies the app loads without crashing and degrades
 * gracefully (preserving whatever data it can).
 *
 * Historical schema changes:
 *   v0  (commit da96197) — macroTargets: MacroTargets (flat), no savedMeals
 *   v1  (current)        — mealTargets: Record<MealType, MacroTargets>, savedMeals added
 *
 * When adding a breaking schema change:
 *   1. Bump SCHEMA_VERSION in src/hooks/useProfiles.ts
 *   2. Add a migration in sanitiseProfile
 *   3. Add a new describe block here with the old shape as a fixture
 */

import { test, expect, Page } from '@playwright/test';

const PROFILES_KEY = 'gmb-profiles';
const ACTIVE_KEY = 'gmb-active-profile';

// ─── helpers ─────────────────────────────────────────────────────────────────

async function seedStorage(page: Page, profiles: unknown, activeId = 'A') {
  await page.goto('/');
  await page.evaluate(
    ([key, val, akey, aval]) => {
      localStorage.setItem(key as string, JSON.stringify(val));
      localStorage.setItem(akey as string, JSON.stringify(aval));
    },
    [PROFILES_KEY, profiles, ACTIVE_KEY, activeId]
  );
}

async function appIsUsable(page: Page) {
  // No crash: header is visible and no Next.js error dialog text
  await expect(page.locator('header')).toBeVisible({ timeout: 5000 });
  await expect(page.getByText(/application error/i)).toHaveCount(0);
  await expect(page.getByText(/unhandled runtime error/i)).toHaveCount(0);
}

// ─── v0 data: flat macroTargets (before per-meal targets) ────────────────────
// Commit da96197 stored a flat { protein, calories, … } object directly on the
// profile. sanitiseProfile migrates this into mealTargets.lunch.

test.describe('v0 localStorage (flat macroTargets, no savedMeals)', () => {
  const V0_PROFILES = {
    A: {
      id: 'A',
      label: 'Cutting',
      macroTargets: { protein: 40, calories: 600 },   // old field name
      dietaryFilters: [],
      restaurantFilters: [],
      favorites: [],
      // savedMeals intentionally absent
    },
    B: {
      id: 'B',
      label: 'Bulking',
      macroTargets: { protein: 60, calories: 900 },
      dietaryFilters: [],
      restaurantFilters: [],
      favorites: [],
    },
  };

  test.beforeEach(async ({ page }) => {
    await seedStorage(page, V0_PROFILES);
  });

  test('app loads without crashing', async ({ page }) => {
    await page.goto('/');
    await appIsUsable(page);
  });

  test('profile labels are preserved', async ({ page }) => {
    await page.goto('/profile');
    // The Profile name input for profile A should have the value "Cutting"
    await expect(page.getByLabel('Profile name').first()).toHaveValue('Cutting', { timeout: 5000 });
  });

  test('old macroTargets are migrated to mealTargets.lunch on Find page', async ({ page }) => {
    await page.goto('/find');
    // The migrated protein=40 should pre-fill the lunch protein input
    const proteinInput = page.getByPlaceholder('e.g. 40');
    await expect(proteinInput).toHaveValue('40', { timeout: 5000 });
    // And results should appear immediately (no need to manually enter targets)
    await expect(page.getByText(/top \d+ match/i)).toBeVisible({ timeout: 8000 });
  });

  test('Favorites page loads without crashing (no savedMeals field)', async ({ page }) => {
    await page.goto('/favorites');
    await appIsUsable(page);
    // Missing savedMeals defaults to [] — empty state message should appear
    await expect(page.getByText(/no favorites|nothing saved|add items/i)).toBeVisible({ timeout: 5000 });
  });
});

// ─── missing savedMeals field (added in commit 66ce4ac) ──────────────────────

test.describe('missing savedMeals field', () => {
  const PROFILES_NO_SAVED_MEALS = {
    A: {
      id: 'A',
      label: 'Cutting',
      mealTargets: { breakfast: {}, lunch: { protein: 35 }, dinner: {} },
      dietaryFilters: [],
      restaurantFilters: [],
      favorites: [
        {
          itemId: 'gyg-grilled-chicken-bowl',
          restaurantSlug: 'gyg',
          selectedOptions: {},
          savedAt: 1711000000000,
        },
      ],
      // savedMeals intentionally absent
    },
    B: {
      id: 'B',
      label: 'Bulking',
      mealTargets: { breakfast: {}, lunch: {}, dinner: {} },
      dietaryFilters: [],
      restaurantFilters: [],
      favorites: [],
    },
  };

  test.beforeEach(async ({ page }) => {
    await seedStorage(page, PROFILES_NO_SAVED_MEALS);
  });

  test('app loads without crashing', async ({ page }) => {
    await page.goto('/');
    await appIsUsable(page);
  });

  test('existing favorites survive the upgrade', async ({ page }) => {
    await page.goto('/favorites');
    await appIsUsable(page);
    // The seeded favorite should still appear
    await expect(page.getByText(/grilled chicken bowl/i)).toBeVisible({ timeout: 5000 });
  });

  test('saved meal section is absent (empty savedMeals)', async ({ page }) => {
    await page.goto('/favorites');
    // The "Saved Meals" section heading is conditional on savedMeals.length > 0
    await expect(page.getByRole('heading', { name: /^saved meals$/i })).toHaveCount(0);
  });

  test('Find page still uses preserved lunch targets', async ({ page }) => {
    await page.goto('/find');
    await expect(page.getByPlaceholder('e.g. 40')).toHaveValue('35', { timeout: 5000 });
  });
});

// ─── corrupt / unexpected shapes ─────────────────────────────────────────────

test.describe('corrupt localStorage data', () => {
  test('plain string value falls back to defaults', async ({ page }) => {
    await page.goto('/');
    await page.evaluate(
      ([key]) => localStorage.setItem(key as string, '"this is not a profiles object"'),
      [PROFILES_KEY]
    );
    await page.goto('/find');
    await appIsUsable(page);
    await expect(page.getByText(/enter your target macros above/i)).toBeVisible();
  });

  test('null value falls back to defaults', async ({ page }) => {
    await page.goto('/');
    await page.evaluate(
      ([key]) => localStorage.setItem(key as string, 'null'),
      [PROFILES_KEY]
    );
    await page.goto('/find');
    await appIsUsable(page);
  });

  test('profile with mealTargets as flat array falls back gracefully', async ({ page }) => {
    await seedStorage(page, {
      A: {
        id: 'A',
        label: 'Cutting',
        mealTargets: [40, 600],            // wrong type — should be object
        dietaryFilters: [],
        restaurantFilters: [],
        favorites: [],
        savedMeals: [],
      },
      B: { id: 'B', label: 'Bulking', mealTargets: {}, dietaryFilters: [], restaurantFilters: [], favorites: [], savedMeals: [] },
    });
    await page.goto('/find');
    await appIsUsable(page);
    // mealTargets was invalid — targets default to empty, prompt shown
    await expect(page.getByText(/enter your target macros above/i)).toBeVisible();
  });

  test('profile with favorites as non-array falls back to empty', async ({ page }) => {
    await seedStorage(page, {
      A: {
        id: 'A',
        label: 'Cutting',
        mealTargets: { breakfast: {}, lunch: {}, dinner: {} },
        dietaryFilters: [],
        restaurantFilters: [],
        favorites: 'corrupted',            // wrong type
        savedMeals: [],
      },
      B: makeMinimalProfile('B', 'Bulking'),
    });
    await page.goto('/favorites');
    await appIsUsable(page);
  });

  test('missing profile B falls back to default B', async ({ page }) => {
    await seedStorage(page, {
      A: makeMinimalProfile('A', 'Cutting'),
      // B intentionally absent
    });
    await page.goto('/profile');
    await appIsUsable(page);
    // Switch to B — should show default "Bulking" label
    await page.getByRole('button', { name: /bulking/i }).first().click();
    await expect(page.getByLabel('Profile name').first()).toHaveValue('Bulking', { timeout: 3000 });
  });
});

// ─── valid modern data stays intact ──────────────────────────────────────────

test.describe('current schema data is preserved exactly', () => {
  const MODERN_PROFILES = {
    A: {
      id: 'A',
      label: 'My Cut',
      mealTargets: {
        breakfast: { protein: 20, calories: 300 },
        lunch: { protein: 45, calories: 700 },
        dinner: { protein: 40, calories: 600 },
      },
      dietaryFilters: ['contains-meat'],
      restaurantFilters: ['gyg'],
      favorites: [],
      savedMeals: [],
      lastMealType: 'lunch',
    },
    B: makeMinimalProfile('B', 'Bulk'),
  };

  test.beforeEach(async ({ page }) => {
    await seedStorage(page, MODERN_PROFILES);
  });

  test('custom profile label is preserved', async ({ page }) => {
    await page.goto('/profile');
    await expect(page.getByLabel('Profile name').first()).toHaveValue('My Cut', { timeout: 5000 });
  });

  test('lunch macro targets are preserved on Find page', async ({ page }) => {
    await page.goto('/find');
    await expect(page.getByPlaceholder('e.g. 40')).toHaveValue('45', { timeout: 5000 });
    await expect(page.getByPlaceholder('e.g. 600')).toHaveValue('700', { timeout: 5000 });
  });

  test('restaurant filter is preserved', async ({ page }) => {
    await page.goto('/find');
    await page.getByPlaceholder('e.g. 40').fill('45');
    await page.waitForTimeout(1000);
    // GYG should be highlighted (selected), others dim
    const hrefs = await page.locator('[class*="grid"] a[href^="/"]').evaluateAll(
      (els) => [...new Set(els.map((el) => (el as HTMLAnchorElement).pathname.replace('/', '')))]
    );
    expect(hrefs.every((s) => s === 'gyg')).toBe(true);
  });
});

// ─── fixture helper ───────────────────────────────────────────────────────────

function makeMinimalProfile(id: string, label: string) {
  return {
    id,
    label,
    mealTargets: { breakfast: {}, lunch: {}, dinner: {} },
    dietaryFilters: [],
    restaurantFilters: [],
    favorites: [],
    savedMeals: [],
  };
}
