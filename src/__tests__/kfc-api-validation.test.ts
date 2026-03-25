/**
 * KFC API Validation Tests
 * Source: KFC Australia ordering API (orderserv-kfc-apac-olo-api.yum.com)
 * Captured: 2026-03-25 via scripts/scrape-kfc.ts → scripts/kfc-api-responses.json
 *
 * Nutrition values in the API are stored as:
 *   Energy (kJ) → converted to kcal via ÷ 4.184
 *   Protein, Carbohydrate, Fat, Saturated Fat (g) — direct
 *   Sodium (mg) — direct
 *
 * All values below are the serveWiseValue from the API with kcal rounded via Math.round(kJ / 4.184).
 */

import { describe, it, expect } from 'vitest';
import { kfcMenu } from '@/data/kfc/menu';
import type { MenuItem } from '@/types/menu';

const TOLERANCE = 2; // ±2 — kJ→kcal rounding only; g values are exact from API

function expectMacro(actual: number | undefined, expected: number, label: string) {
  expect(actual ?? 0, label).toBeGreaterThanOrEqual(expected - TOLERANCE);
  expect(actual ?? 0, label).toBeLessThanOrEqual(expected + TOLERANCE);
}

function getItem(id: string): MenuItem {
  const item = kfcMenu.find((i) => i.id === id);
  if (!item) throw new Error(`Item not found: ${id}`);
  return item;
}

// ─────────────────────────────────────────────────────────────────────────────
// BURGERS (API: KFCAustraliaMenu-Generic, BURGERS category)
// ─────────────────────────────────────────────────────────────────────────────
describe('KFC Burgers — base macros (API 2026-03-25)', () => {
  it('Zinger® Burger: 448 kcal, 26.2g protein, 34.4g carbs, 22.5g fat', () => {
    const item = getItem('kfc-zinger-burger');
    // API: kJ=1874 → kcal=448, P=26.2, C=34.4, F=22.5, Na=944mg
    expectMacro(item.baseMacros.calories, 448, 'calories');
    expectMacro(item.baseMacros.protein, 26.2, 'protein');
    expectMacro(item.baseMacros.carbs, 34.4, 'carbs');
    expectMacro(item.baseMacros.fat, 22.5, 'fat');
  });

  it('Zinger® Crunch Burger: 568 kcal, 29.7g protein, 45.2g carbs, 29.3g fat', () => {
    const item = getItem('kfc-zinger-crunch-burger');
    // API: kJ=2378 → kcal=568, P=29.7, C=45.2, F=29.3, Na=1231mg
    expectMacro(item.baseMacros.calories, 568, 'calories');
    expectMacro(item.baseMacros.protein, 29.7, 'protein');
    expectMacro(item.baseMacros.carbs, 45.2, 'carbs');
    expectMacro(item.baseMacros.fat, 29.3, 'fat');
  });

  it('Original Crispy Burger: 448 kcal, 24.7g protein, 35.9g carbs, 22.3g fat', () => {
    const item = getItem('kfc-original-crispy-burger');
    // API: kJ=1874 → kcal=448, P=24.7, C=35.9, F=22.3, Na=776mg
    expectMacro(item.baseMacros.calories, 448, 'calories');
    expectMacro(item.baseMacros.protein, 24.7, 'protein');
    expectMacro(item.baseMacros.carbs, 35.9, 'carbs');
    expectMacro(item.baseMacros.fat, 22.3, 'fat');
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// CHICKEN (API: CHICKEN category)
// ─────────────────────────────────────────────────────────────────────────────
describe('KFC Chicken pieces — base macros (API 2026-03-25)', () => {
  it('1 Piece of Chicken: 235 kcal, 20.4g protein, 7.2g carbs, 13.9g fat', () => {
    const item = getItem('kfc-1-piece-of-chicken');
    // API: kJ=984 → kcal=235, P=20.4, C=7.2, F=13.9, Na=407mg
    expectMacro(item.baseMacros.calories, 235, 'calories');
    expectMacro(item.baseMacros.protein, 20.4, 'protein');
    expectMacro(item.baseMacros.carbs, 7.2, 'carbs');
    expectMacro(item.baseMacros.fat, 13.9, 'fat');
  });

  it('3 Original Tenders™: 431 kcal, 26.2g protein, 14.4g carbs, 30.1g fat', () => {
    const item = getItem('kfc-3-original-tenders');
    // API: kJ=1803 → kcal=431, P=26.2, C=14.4, F=30.1, Na=988mg
    expectMacro(item.baseMacros.calories, 431, 'calories');
    expectMacro(item.baseMacros.protein, 26.2, 'protein');
    expectMacro(item.baseMacros.carbs, 14.4, 'carbs');
    expectMacro(item.baseMacros.fat, 30.1, 'fat');
  });

  it('Regular Popcorn Chicken®: 393 kcal, 19.3g protein, 24.2g carbs, 24.4g fat', () => {
    const item = getItem('kfc-regular-popcorn-chicken');
    // API: kJ=1644 → kcal=393, P=19.3, C=24.2, F=24.4, Na=939mg
    expectMacro(item.baseMacros.calories, 393, 'calories');
    expectMacro(item.baseMacros.protein, 19.3, 'protein');
    expectMacro(item.baseMacros.carbs, 24.2, 'carbs');
    expectMacro(item.baseMacros.fat, 24.4, 'fat');
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// WRAPS & BOWLS (API: TWISTERS & BOWLS category)
// ─────────────────────────────────────────────────────────────────────────────
describe('KFC Wraps & Bowls — base macros (API 2026-03-25)', () => {
  it('Zinger® Crunch Twister®: 582 kcal, 27.4g protein, 53.4g carbs, 27.9g fat', () => {
    const item = getItem('kfc-zinger-crunch-twister');
    // API: kJ=2435 → kcal=582, P=27.4, C=53.4, F=27.9, Na=1159mg
    expectMacro(item.baseMacros.calories, 582, 'calories');
    expectMacro(item.baseMacros.protein, 27.4, 'protein');
    expectMacro(item.baseMacros.carbs, 53.4, 'carbs');
    expectMacro(item.baseMacros.fat, 27.9, 'fat');
  });

  it('Zinger® Protein Bowl: 552 kcal, 44g protein, 27.6g carbs, 28.9g fat', () => {
    const item = getItem('kfc-zinger-protein-bowl');
    // API: kJ=2309 → kcal=552, P=44.0, C=27.6, F=28.9, Na=1531mg
    expectMacro(item.baseMacros.calories, 552, 'calories');
    expectMacro(item.baseMacros.protein, 44, 'protein');
    expectMacro(item.baseMacros.carbs, 27.6, 'carbs');
    expectMacro(item.baseMacros.fat, 28.9, 'fat');
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// SNACKS & SIDES (API: CHICKEN / sides)
// ─────────────────────────────────────────────────────────────────────────────
describe('KFC Snacks & Sides — base macros (API 2026-03-25)', () => {
  it('Regular Chips: 283 kcal, 4.4g protein, 40.6g carbs, 11.5g fat', () => {
    const item = getItem('kfc-regular-chips');
    // API: kJ=1186 → kcal=283, P=4.4, C=40.6, F=11.5, Na=113mg
    expectMacro(item.baseMacros.calories, 283, 'calories');
    expectMacro(item.baseMacros.protein, 4.4, 'protein');
    expectMacro(item.baseMacros.carbs, 40.6, 'carbs');
    expectMacro(item.baseMacros.fat, 11.5, 'fat');
  });

  it('Regular Coleslaw: 93 kcal, 1.1g protein, 14.1g carbs, 3.4g fat', () => {
    const item = getItem('kfc-regular-coleslaw');
    // API: kJ=388 → kcal=93, P=1.1, C=14.1, F=3.4, Na=173mg
    expectMacro(item.baseMacros.calories, 93, 'calories');
    expectMacro(item.baseMacros.protein, 1.1, 'protein');
    expectMacro(item.baseMacros.carbs, 14.1, 'carbs');
    expectMacro(item.baseMacros.fat, 3.4, 'fat');
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// DRINKS (API: COLD DRINKS category)
// ─────────────────────────────────────────────────────────────────────────────
describe('KFC Drinks — base macros (API 2026-03-25)', () => {
  it('Regular Pepsi: 104 kcal, 0g protein, 27.4g carbs, 0g fat', () => {
    const item = getItem('kfc-regular-pepsi');
    // API: kJ=434 → kcal=104, P=0, C=27.4, F=0, Na=39mg
    expectMacro(item.baseMacros.calories, 104, 'calories');
    expectMacro(item.baseMacros.protein, 0, 'protein');
    expectMacro(item.baseMacros.carbs, 27.4, 'carbs');
    expectMacro(item.baseMacros.fat, 0, 'fat');
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// kJ → kcal CONVERSION INTEGRITY
// ─────────────────────────────────────────────────────────────────────────────
describe('KFC kJ → kcal conversion', () => {
  it('Zinger® Burger kcal is within 1 of Math.round(1874 / 4.184)', () => {
    const item = getItem('kfc-zinger-burger');
    const expected = Math.round(1874 / 4.184); // 448
    expect(item.baseMacros.calories).toBeGreaterThanOrEqual(expected - 1);
    expect(item.baseMacros.calories).toBeLessThanOrEqual(expected + 1);
  });

  it('Regular Chips kcal is within 1 of Math.round(1186 / 4.184)', () => {
    const item = getItem('kfc-regular-chips');
    const expected = Math.round(1186 / 4.184); // 283
    expect(item.baseMacros.calories).toBeGreaterThanOrEqual(expected - 1);
    expect(item.baseMacros.calories).toBeLessThanOrEqual(expected + 1);
  });

  it('Zinger® Protein Bowl kcal is within 1 of Math.round(2309 / 4.184)', () => {
    const item = getItem('kfc-zinger-protein-bowl');
    const expected = Math.round(2309 / 4.184); // 552
    expect(item.baseMacros.calories).toBeGreaterThanOrEqual(expected - 1);
    expect(item.baseMacros.calories).toBeLessThanOrEqual(expected + 1);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// DATA INTEGRITY
// ─────────────────────────────────────────────────────────────────────────────
describe('KFC data integrity', () => {
  it('all items have unique IDs', () => {
    const ids = kfcMenu.map((i) => i.id);
    expect(new Set(ids).size, 'duplicate IDs found').toBe(ids.length);
  });

  it('all items have the kfc restaurantSlug', () => {
    for (const item of kfcMenu) {
      expect(item.restaurantSlug, item.name).toBe('kfc');
    }
  });

  it('all items have positive calories', () => {
    for (const item of kfcMenu) {
      expect(item.baseMacros.calories, `${item.name} calories`).toBeGreaterThan(0);
    }
  });

  it('all items have non-negative protein, carbs, fat', () => {
    for (const item of kfcMenu) {
      expect(item.baseMacros.protein, `${item.name} protein`).toBeGreaterThanOrEqual(0);
      expect(item.baseMacros.carbs, `${item.name} carbs`).toBeGreaterThanOrEqual(0);
      expect(item.baseMacros.fat, `${item.name} fat`).toBeGreaterThanOrEqual(0);
    }
  });

  it('drinks are tagged "drink" not "contains-meat"', () => {
    const drinks = kfcMenu.filter((i) => i.category === 'Drinks');
    expect(drinks.length, 'should have drink items').toBeGreaterThan(0);
    for (const item of drinks) {
      expect(item.tags, `${item.name} should not be tagged contains-meat`).not.toContain('contains-meat');
      expect(item.tags, `${item.name} should be tagged drink`).toContain('drink');
    }
  });

  it('well-known beverages are tagged "drink" regardless of API category placement', () => {
    // Some drinks appear under SNACK HACKS in the API before COLD DRINKS —
    // the converter must detect them by name, not just by category.
    const beverageNames = ['Regular Pepsi Max', 'Regular Pepsi', 'Regular 7Up'];
    for (const name of beverageNames) {
      const item = kfcMenu.find((i) => i.name === name);
      if (!item) continue; // item may not exist in all menu snapshots
      expect(item.tags, `${name} should be tagged drink`).toContain('drink');
      expect(item.tags, `${name} should not be tagged contains-meat`).not.toContain('contains-meat');
    }
  });

  it('chicken/burger/twister items are tagged contains-meat', () => {
    const meatItems = kfcMenu.filter((i) =>
      ['Burgers', 'Chicken', 'Wraps & Bowls', 'Box Meals'].includes(i.category)
    );
    for (const item of meatItems) {
      expect(item.tags, `${item.name} should be tagged contains-meat`).toContain('contains-meat');
    }
  });

  it('no sodium value exceeds 20000mg (guards against unit conversion bug — raw API is already in mg)', () => {
    for (const item of kfcMenu) {
      if (item.baseMacros.sodium !== undefined) {
        expect(item.baseMacros.sodium, `${item.name} sodium`).toBeLessThan(20000);
      }
    }
  });

  it('205 unique menu items loaded (zero-energy items excluded)', () => {
    expect(kfcMenu.length).toBe(205);
  });
});
