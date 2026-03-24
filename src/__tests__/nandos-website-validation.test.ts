/**
 * Nando's Website Validation Tests
 * Source: nandos.com.au, verified March 2026
 *
 * No official PDF available — values taken directly from the website's
 * nutritional information pages. Per-serve figures as listed (kcal, macros in
 * grams, sodium in mg). Spice level does not meaningfully change macro values.
 *
 * TOLERANCE: ±3 — website rounds to 1 decimal place; we store rounded integers.
 */

import { describe, it, expect } from 'vitest';
import { nandosMenu } from '@/data/nandos/menu';
import { computeItemMacros } from '@/lib/macros';
import type { MenuItem } from '@/types/menu';

const TOLERANCE = 3;

function expectMacro(actual: number | undefined, expected: number, label: string) {
  expect(actual ?? 0, label).toBeGreaterThanOrEqual(expected - TOLERANCE);
  expect(actual ?? 0, label).toBeLessThanOrEqual(expected + TOLERANCE);
}

function getItem(id: string): MenuItem {
  const item = nandosMenu.find((i) => i.id === id);
  if (!item) throw new Error(`Item not found: ${id}`);
  return item;
}

// ─────────────────────────────────────────────────────────────────────────────
// CHICKEN
// ─────────────────────────────────────────────────────────────────────────────

describe('Chicken — base macros (nandos.com.au, March 2026)', () => {
  it('Half PERi-PERi Chicken: 715 cal, 108g protein, 1g carbs, 31g fat, 2010mg sodium', () => {
    const item = getItem('nandos-half-chicken');
    // Website: 460g serve — 715 kcal, 108g P, 1.1g C, 30.8g F, 2010mg Na
    expectMacro(item.baseMacros.calories, 715, 'calories');
    expectMacro(item.baseMacros.protein, 108, 'protein');
    expectMacro(item.baseMacros.carbs, 1, 'carbs');
    expectMacro(item.baseMacros.fat, 31, 'fat');
    expectMacro(item.baseMacros.sodium, 2010, 'sodium');
  });

  it('Whole PERi-PERi Chicken: 1380 cal, 208g protein, 2g carbs, 60g fat, 3890mg sodium', () => {
    const item = getItem('nandos-whole-chicken');
    // Website: 889g serve — 1380 kcal, 208g P, 2.2g C, 59.7g F, 3890mg Na
    expectMacro(item.baseMacros.calories, 1380, 'calories');
    expectMacro(item.baseMacros.protein, 208, 'protein');
    expectMacro(item.baseMacros.carbs, 2, 'carbs');
    expectMacro(item.baseMacros.fat, 60, 'fat');
    expectMacro(item.baseMacros.sodium, 3890, 'sodium');
  });

  it('4 PERi-PERi Grilled Tenders: 220 cal, 40g protein, 1g carbs, 7g fat, 949mg sodium', () => {
    const item = getItem('nandos-tenders-4pc');
    // Website: 160g serve — 220 kcal, 39.6g P, 0.7g C, 6.5g F, 949mg Na
    expectMacro(item.baseMacros.calories, 220, 'calories');
    expectMacro(item.baseMacros.protein, 40, 'protein');
    expectMacro(item.baseMacros.carbs, 1, 'carbs');
    expectMacro(item.baseMacros.fat, 7, 'fat');
    expectMacro(item.baseMacros.sodium, 949, 'sodium');
  });

  it('BBQ Chicken Ribs: 297 cal, 30g protein, 4g carbs, 18g fat, 922mg sodium', () => {
    const item = getItem('nandos-bbq-chicken-ribs');
    // Website: 128g serve — 297 kcal, 29.6g P, 4.4g C, 18g F, 922mg Na
    expectMacro(item.baseMacros.calories, 297, 'calories');
    expectMacro(item.baseMacros.protein, 30, 'protein');
    expectMacro(item.baseMacros.carbs, 4, 'carbs');
    expectMacro(item.baseMacros.fat, 18, 'fat');
    expectMacro(item.baseMacros.sodium, 922, 'sodium');
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// WRAPS & BURGERS
// ─────────────────────────────────────────────────────────────────────────────

describe('Wraps & Burgers — base macros (nandos.com.au, March 2026)', () => {
  it('PERinaise Classic: 496 cal, 41g protein, 43g carbs, 17g fat, 971mg sodium', () => {
    const item = getItem('nandos-perinaise-classic');
    // Website: 259g serve — 496 kcal, 41g P, 42.5g C, 16.9g F, 971mg Na
    expectMacro(item.baseMacros.calories, 496, 'calories');
    expectMacro(item.baseMacros.protein, 41, 'protein');
    expectMacro(item.baseMacros.carbs, 43, 'carbs');
    expectMacro(item.baseMacros.fat, 17, 'fat');
    expectMacro(item.baseMacros.sodium, 971, 'sodium');
  });

  it('Supremo: 648 cal, 42g protein, 53g carbs, 29g fat, 1450mg sodium', () => {
    const item = getItem('nandos-supremo');
    // Website: 332g serve — 648 kcal, 41.9g P, 52.5g C, 28.9g F, 1450mg Na
    expectMacro(item.baseMacros.calories, 648, 'calories');
    expectMacro(item.baseMacros.protein, 42, 'protein');
    expectMacro(item.baseMacros.carbs, 53, 'carbs');
    expectMacro(item.baseMacros.fat, 29, 'fat');
    expectMacro(item.baseMacros.sodium, 1450, 'sodium');
  });

  it('Avo Goodness: 568 cal, 38g protein, 52g carbs, 22g fat, 1330mg sodium', () => {
    const item = getItem('nandos-avo-goodness');
    // Website: 333g serve — 568 kcal, 38.4g P, 52.4g C, 21.5g F, 1330mg Na
    expectMacro(item.baseMacros.calories, 568, 'calories');
    expectMacro(item.baseMacros.protein, 38, 'protein');
    expectMacro(item.baseMacros.carbs, 52, 'carbs');
    expectMacro(item.baseMacros.fat, 22, 'fat');
    expectMacro(item.baseMacros.sodium, 1330, 'sodium');
  });

  it('The Halloumi: 599 cal, 40g protein, 54g carbs, 25g fat, 1630mg sodium', () => {
    const item = getItem('nandos-the-halloumi');
    // Website: 283g serve — 599 kcal, 40.1g P, 53.9g C, 24.7g F, 1630mg Na
    expectMacro(item.baseMacros.calories, 599, 'calories');
    expectMacro(item.baseMacros.protein, 40, 'protein');
    expectMacro(item.baseMacros.carbs, 54, 'carbs');
    expectMacro(item.baseMacros.fat, 25, 'fat');
    expectMacro(item.baseMacros.sodium, 1630, 'sodium');
  });

  it('Double Cheese & Bacon: 667 cal, 47g protein, 48g carbs, 31g fat, 1700mg sodium', () => {
    const item = getItem('nandos-double-cheese-bacon');
    // Website: 327g serve — 667 kcal, 47.2g P, 48.4g C, 31.4g F, 1700mg Na
    expectMacro(item.baseMacros.calories, 667, 'calories');
    expectMacro(item.baseMacros.protein, 47, 'protein');
    expectMacro(item.baseMacros.carbs, 48, 'carbs');
    expectMacro(item.baseMacros.fat, 31, 'fat');
    expectMacro(item.baseMacros.sodium, 1700, 'sodium');
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// SALADS & BOWLS
// ─────────────────────────────────────────────────────────────────────────────

describe('Salads & Bowls — base macros (nandos.com.au, March 2026)', () => {
  it('Mediterranean Salad with Chicken: 581 cal, 38g protein, 15g carbs, 35g fat, 1880mg sodium', () => {
    const item = getItem('nandos-mediterranean-salad');
    // Website: 485g serve — 581 kcal, 37.8g P, 15.3g C, 35g F, 1880mg Na
    expectMacro(item.baseMacros.calories, 581, 'calories');
    expectMacro(item.baseMacros.protein, 38, 'protein');
    expectMacro(item.baseMacros.carbs, 15, 'carbs');
    expectMacro(item.baseMacros.fat, 35, 'fat');
    expectMacro(item.baseMacros.sodium, 1880, 'sodium');
  });

  it('Paella: 557 cal, 31g protein, 82g carbs, 10g fat, 1390mg sodium', () => {
    const item = getItem('nandos-paella');
    // Website: 395g serve — 557 kcal, 31g P, 81.9g C, 10g F, 1390mg Na
    expectMacro(item.baseMacros.calories, 557, 'calories');
    expectMacro(item.baseMacros.protein, 31, 'protein');
    expectMacro(item.baseMacros.carbs, 82, 'carbs');
    expectMacro(item.baseMacros.fat, 10, 'fat');
    expectMacro(item.baseMacros.sodium, 1390, 'sodium');
  });

  it('PERi-Harvest Bowl: 421 cal, 10g protein, 27g carbs, 23g fat, 526mg sodium', () => {
    const item = getItem('nandos-peri-harvest-bowl');
    // Website: 382g serve — 421 kcal, 9.9g P, 26.7g C, 22.6g F, 526mg Na
    expectMacro(item.baseMacros.calories, 421, 'calories');
    expectMacro(item.baseMacros.protein, 10, 'protein');
    expectMacro(item.baseMacros.carbs, 27, 'carbs');
    expectMacro(item.baseMacros.fat, 23, 'fat');
    expectMacro(item.baseMacros.sodium, 526, 'sodium');
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// SIDES
// ─────────────────────────────────────────────────────────────────────────────

describe('Sides — base macros (nandos.com.au, March 2026)', () => {
  it('PERi-PERi Chips (Regular): 326 cal, 5g protein, 45g carbs, 13g fat, 716mg sodium', () => {
    const item = getItem('nandos-peri-peri-chips-regular');
    // Website: 140g — 326 kcal, 5.4g P, 44.7g C, 13g F, 716mg Na
    expectMacro(item.baseMacros.calories, 326, 'calories');
    expectMacro(item.baseMacros.protein, 5, 'protein');
    expectMacro(item.baseMacros.carbs, 45, 'carbs');
    expectMacro(item.baseMacros.fat, 13, 'fat');
    expectMacro(item.baseMacros.sodium, 716, 'sodium');
  });

  it('Halloumi Sticks & Dip: 360 cal, 18g protein, 15g carbs, 26g fat, 1080mg sodium', () => {
    const item = getItem('nandos-halloumi-sticks');
    // Website: 127g — 360 kcal, 17.6g P, 14.7g C, 25.5g F, 1080mg Na
    expectMacro(item.baseMacros.calories, 360, 'calories');
    expectMacro(item.baseMacros.protein, 18, 'protein');
    expectMacro(item.baseMacros.carbs, 15, 'carbs');
    expectMacro(item.baseMacros.fat, 26, 'fat');
    expectMacro(item.baseMacros.sodium, 1080, 'sodium');
  });

  it('Grain Salad: 221 cal, 8g protein, 19g carbs, 6g fat, 184mg sodium', () => {
    const item = getItem('nandos-grain-salad');
    // Website: 220g — 221 kcal, 7.5g P, 19.1g C, 6.3g F, 184mg Na
    expectMacro(item.baseMacros.calories, 221, 'calories');
    expectMacro(item.baseMacros.protein, 8, 'protein');
    expectMacro(item.baseMacros.carbs, 19, 'carbs');
    expectMacro(item.baseMacros.fat, 6, 'fat');
    expectMacro(item.baseMacros.sodium, 184, 'sodium');
  });

  it('Roasted Broccoli with PERi-Crackle: 339 cal, 11g protein, 3g carbs, 30g fat, 611mg sodium', () => {
    const item = getItem('nandos-roasted-broccoli');
    // Website: 175g — 339 kcal, 11.4g P, 3.2g C, 30.3g F, 611mg Na
    expectMacro(item.baseMacros.calories, 339, 'calories');
    expectMacro(item.baseMacros.protein, 11, 'protein');
    expectMacro(item.baseMacros.carbs, 3, 'carbs');
    expectMacro(item.baseMacros.fat, 30, 'fat');
    expectMacro(item.baseMacros.sodium, 611, 'sodium');
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// CUSTOMIZATION — spice level has no macro impact
// ─────────────────────────────────────────────────────────────────────────────

describe('Customization — spice level does not change macros', () => {
  const spiceOptions = [
    'nandos-spice-lemon-herb',
    'nandos-spice-medium',
    'nandos-spice-hot',
    'nandos-spice-extra-hot',
  ];

  it('4 Tenders macros are identical across all spice levels', () => {
    const item = getItem('nandos-tenders-4pc');
    const macrosList = spiceOptions.map((optId) =>
      computeItemMacros(item, { 'nandos-spice': [optId] })
    );
    const base = macrosList[0];
    macrosList.forEach((m) => {
      expect(m.calories).toBe(base.calories);
      expect(m.protein).toBe(base.protein);
      expect(m.fat).toBe(base.fat);
    });
  });

  it('Half Chicken macros are identical across all spice levels', () => {
    const item = getItem('nandos-half-chicken');
    const macrosList = spiceOptions.map((optId) =>
      computeItemMacros(item, { 'nandos-spice': [optId] })
    );
    const base = macrosList[0];
    macrosList.forEach((m) => {
      expect(m.calories).toBe(base.calories);
      expect(m.protein).toBe(base.protein);
    });
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// CUSTOMIZATION — extras add correct macro deltas
// ─────────────────────────────────────────────────────────────────────────────

describe('Customization — extras macro deltas (PERinaise Classic)', () => {
  const BASE_ID = 'nandos-perinaise-classic';

  it('Extra Tenders adds ~110 cal and ~20g protein', () => {
    const item = getItem(BASE_ID);
    const base = computeItemMacros(item, {});
    const withExtra = computeItemMacros(item, { 'nandos-extras': ['nandos-extra-chicken'] });
    expectMacro(withExtra.calories - base.calories, 110, 'extra calories');
    expectMacro(withExtra.protein - base.protein, 20, 'extra protein');
  });

  it('Halloumi adds ~120 cal and ~8g protein', () => {
    const item = getItem(BASE_ID);
    const base = computeItemMacros(item, {});
    const withExtra = computeItemMacros(item, { 'nandos-extras': ['nandos-extra-halloumi'] });
    expectMacro(withExtra.calories - base.calories, 120, 'extra calories');
    expectMacro(withExtra.protein - base.protein, 8, 'extra protein');
  });

  it('Multiple extras stack correctly', () => {
    const item = getItem(BASE_ID);
    const base = computeItemMacros(item, {});
    const withBoth = computeItemMacros(item, {
      'nandos-extras': ['nandos-extra-chicken', 'nandos-extra-halloumi'],
    });
    // ~110 + ~120 = ~230 cal added
    expectMacro(withBoth.calories - base.calories, 230, 'stacked calories');
    expectMacro(withBoth.protein - base.protein, 28, 'stacked protein');
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// DATA INTEGRITY
// ─────────────────────────────────────────────────────────────────────────────

describe('Data integrity', () => {
  it('all items have restaurantSlug "nandos"', () => {
    nandosMenu.forEach((item) => {
      expect(item.restaurantSlug, item.id).toBe('nandos');
    });
  });

  it('all items have positive calories, protein, carbs, and fat', () => {
    nandosMenu.forEach((item) => {
      expect(item.baseMacros.calories, `${item.id} calories`).toBeGreaterThan(0);
      expect(item.baseMacros.protein, `${item.id} protein`).toBeGreaterThan(0);
      expect(item.baseMacros.carbs, `${item.id} carbs`).toBeGreaterThanOrEqual(0);
      expect(item.baseMacros.fat, `${item.id} fat`).toBeGreaterThan(0);
    });
  });

  it('all item IDs are unique', () => {
    const ids = nandosMenu.map((i) => i.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('contains exactly 16 items', () => {
    expect(nandosMenu).toHaveLength(16);
  });

  it('The Halloumi is tagged vegetarian', () => {
    const item = getItem('nandos-the-halloumi');
    expect(item.tags).toContain('vegetarian');
  });

  it('PERi-Harvest Bowl is tagged vegetarian', () => {
    const item = getItem('nandos-peri-harvest-bowl');
    expect(item.tags).toContain('vegetarian');
  });

  it('chicken items are tagged contains-meat', () => {
    ['nandos-half-chicken', 'nandos-whole-chicken', 'nandos-tenders-4pc', 'nandos-bbq-chicken-ribs'].forEach((id) => {
      const item = getItem(id);
      expect(item.tags, id).toContain('contains-meat');
    });
  });
});
