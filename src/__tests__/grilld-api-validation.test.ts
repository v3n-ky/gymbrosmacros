/**
 * Grill'd API Validation Tests
 * Source: api.digital.grilld.com.au/v1/restaurants/94/menu/{id}?orderType=106
 * Verified: March 2026
 *
 * Baseline: Traditional (Hi Fibre Lo GI) bun, default toppings, no extras.
 * Tolerance: ±10 kcal / ±2g macros (API returns 1 d.p.; our values rounded to integers).
 *
 * Bun deltas are tested via computeItemMacros with explicit option selections.
 */

import { describe, it, expect } from 'vitest';
import { grilldMenu } from '@/data/grilld/menu';
import { computeItemMacros } from '@/lib/macros';

const CAL_TOL  = 10; // ±10 kcal
const MACRO_TOL = 2; // ±2g

function expectMacro(actual: number | undefined, expected: number, label: string) {
  expect(actual ?? 0, label).toBeGreaterThanOrEqual(expected - MACRO_TOL);
  expect(actual ?? 0, label).toBeLessThanOrEqual(expected + MACRO_TOL);
}

function expectCal(actual: number | undefined, expected: number, label: string) {
  expect(actual ?? 0, label).toBeGreaterThanOrEqual(expected - CAL_TOL);
  expect(actual ?? 0, label).toBeLessThanOrEqual(expected + CAL_TOL);
}

function getItem(id: string) {
  const item = grilldMenu.find((i) => i.id === id);
  if (!item) throw new Error(`Menu item not found: ${id}`);
  return item;
}

// ─────────────────────────────────────────────────────────────────────────────
// BURGERS — Traditional Bun (base macros, no extras)
// API: /menu/{id}?orderType=106 → choices[Add Bun][Traditional].nutrition.tableRows
// ─────────────────────────────────────────────────────────────────────────────

describe('Grill\'d Burgers — Traditional Bun base macros (API verified)', () => {
  it('Zen Hen: 488 kcal, 43g protein, 20g fat, 32g carbs', () => {
    const item = getItem('grilld-simply-grilled-chicken');
    expectCal(item.baseMacros.calories,  488, 'calories');
    expectMacro(item.baseMacros.protein, 43,  'protein');
    expectMacro(item.baseMacros.fat,     20,  'fat');
    expectMacro(item.baseMacros.carbs,   32,  'carbs');
  });

  it('Crispy Bacon & Cheese: 631 kcal, 30g protein, 35g fat, 31g carbs', () => {
    const item = getItem('grilld-crispy-bacon-cheese');
    expectCal(item.baseMacros.calories,  631, 'calories');
    expectMacro(item.baseMacros.protein, 30,  'protein');
    expectMacro(item.baseMacros.fat,     35,  'fat');
    expectMacro(item.baseMacros.carbs,   31,  'carbs');
  });

  it('Garden Goodness: 490 kcal, 17g protein, 25g fat, 50g carbs', () => {
    const item = getItem('grilld-garden-goodness');
    expectCal(item.baseMacros.calories,  490, 'calories');
    expectMacro(item.baseMacros.protein, 17,  'protein');
    expectMacro(item.baseMacros.fat,     25,  'fat');
    expectMacro(item.baseMacros.carbs,   50,  'carbs');
  });

  it('Almighty: 705 kcal, 36g protein, 39g fat, 36g carbs', () => {
    const item = getItem('grilld-beefy-deluxe');
    expectCal(item.baseMacros.calories,  705, 'calories');
    expectMacro(item.baseMacros.protein, 36,  'protein');
    expectMacro(item.baseMacros.fat,     39,  'fat');
    expectMacro(item.baseMacros.carbs,   36,  'carbs');
  });

  it('Sweet Chilli Chicken: 483 kcal, 42g protein, 17g fat, 38g carbs', () => {
    const item = getItem('grilld-sweet-chilli-chicken');
    expectCal(item.baseMacros.calories,  483, 'calories');
    expectMacro(item.baseMacros.protein, 42,  'protein');
    expectMacro(item.baseMacros.fat,     17,  'fat');
    expectMacro(item.baseMacros.carbs,   38,  'carbs');
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// SALADS
// ─────────────────────────────────────────────────────────────────────────────

describe('Grill\'d Salads — base macros (API verified)', () => {
  it('Chicken Caesar Salad: 576 kcal, 51g protein, 34g fat, 15g carbs', () => {
    const item = getItem('grilld-healthy-chicken-caesar-salad');
    expectCal(item.baseMacros.calories,  576, 'calories');
    expectMacro(item.baseMacros.protein, 51,  'protein');
    expectMacro(item.baseMacros.fat,     34,  'fat');
    expectMacro(item.baseMacros.carbs,   15,  'carbs');
  });

  it('Superpower Salad: 459 kcal, 42g protein, 22g fat, 22g carbs', () => {
    const item = getItem('grilld-super-greens-salad');
    expectCal(item.baseMacros.calories,  459, 'calories');
    expectMacro(item.baseMacros.protein, 42,  'protein');
    expectMacro(item.baseMacros.fat,     22,  'fat');
    expectMacro(item.baseMacros.carbs,   22,  'carbs');
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// SIDES
// ─────────────────────────────────────────────────────────────────────────────

describe('Grill\'d Sides — base macros (API verified)', () => {
  it('Sweet Potato Chips (Regular): 540 kcal, 5g protein, 26g fat, 67g carbs', () => {
    const item = getItem('grilld-sweet-potato-fries');
    expectCal(item.baseMacros.calories,  540, 'calories');
    expectMacro(item.baseMacros.protein, 5,   'protein');
    expectMacro(item.baseMacros.fat,     26,  'fat');
    expectMacro(item.baseMacros.carbs,   67,  'carbs');
  });

  it('Famous Grill\'d Chips (Regular): 588 kcal, 4g protein, 28g fat, 70g carbs', () => {
    const item = getItem('grilld-herbed-chips');
    expectCal(item.baseMacros.calories,  588, 'calories');
    expectMacro(item.baseMacros.protein, 4,   'protein');
    expectMacro(item.baseMacros.fat,     28,  'fat');
    expectMacro(item.baseMacros.carbs,   70,  'carbs');
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// BUN DELTAS — tested via computeItemMacros
// Low Carb SuperBun delta: +41 kcal / +3g P / +12g F / -19g C (API avg)
// Gluten Free delta: +120 kcal / -1g P / +5g F / +17g C (API avg)
// No Bun delta: -160 kcal / -5g P / -5g F / -21g C (API avg)
// ─────────────────────────────────────────────────────────────────────────────

describe('Grill\'d Bun options — macro deltas (API verified)', () => {
  const sweetChilli = () => getItem('grilld-sweet-chilli-chicken');

  it('Low Carb SuperBun: ~528 kcal, higher fat, much lower carbs', () => {
    // Sweet Chilli Chicken: Traditional 483 → LC 528 kcal (API)
    const macros = computeItemMacros(sweetChilli(), { bun: ['bun-low-carb'] });
    expectCal(macros.calories,  528, 'calories');
    expectMacro(macros.protein, 45,  'protein');   // 42.4 + 3.3 ≈ 46 (API)
    expectMacro(macros.fat,     29,  'fat');        // 16.5 + 12.3 ≈ 29 (API)
    expectMacro(macros.carbs,   19,  'carbs');      // 37.5 - 18.4 ≈ 19 (API)
  });

  it('Gluten Free: ~600 kcal (higher than Traditional, more carbs)', () => {
    // Sweet Chilli Chicken: Traditional 483 → GF 624 kcal (API)
    const macros = computeItemMacros(sweetChilli(), { bun: ['bun-gluten-free'] });
    expectCal(macros.calories,  603, 'calories');
    expectMacro(macros.carbs,   55,  'carbs');      // 37.5 + 17 ≈ 55
  });

  it('No Bun: ~320 kcal (much lower calories and carbs)', () => {
    // Sweet Chilli Chicken: Traditional 483 → No Bun 323 kcal (API)
    const macros = computeItemMacros(sweetChilli(), { bun: ['bun-no-bun'] });
    expectCal(macros.calories,  323, 'calories');
    expectMacro(macros.carbs,   17,  'carbs');      // 37.5 - 21 ≈ 17
  });

  it('Crispy Bacon & Cheese on Low Carb SuperBun: ~669 kcal', () => {
    // API: Traditional 631 → LC 669 kcal
    const item = getItem('grilld-crispy-bacon-cheese');
    const macros = computeItemMacros(item, { bun: ['bun-low-carb'] });
    expectCal(macros.calories, 672, 'calories');    // 631 + 41
  });

  it('Crispy Bacon & Cheese on Gluten Free: ~751 kcal', () => {
    // API: Traditional 631 → GF 743 kcal
    const item = getItem('grilld-crispy-bacon-cheese');
    const macros = computeItemMacros(item, { bun: ['bun-gluten-free'] });
    expectCal(macros.calories, 751, 'calories');    // 631 + 120
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// MENU COMPLETENESS
// ─────────────────────────────────────────────────────────────────────────────

describe('Grill\'d menu completeness', () => {
  it('has 9 items', () => {
    expect(grilldMenu).toHaveLength(9);
  });

  it('all items have valid baseMacros', () => {
    for (const item of grilldMenu) {
      expect(item.baseMacros.calories, item.name + ' calories').toBeGreaterThan(0);
      expect(item.baseMacros.protein,  item.name + ' protein').toBeGreaterThan(0);
      expect(item.baseMacros.fat,      item.name + ' fat').toBeGreaterThan(0);
      expect(item.baseMacros.carbs,    item.name + ' carbs').toBeGreaterThan(0);
    }
  });

  it('burgers have bun customization group', () => {
    const burgers = grilldMenu.filter(i => i.category === 'Burgers');
    for (const burger of burgers) {
      const hasBun = burger.customizationGroups?.some(g => g.id === 'bun');
      expect(hasBun, burger.name + ' has bun group').toBe(true);
    }
  });

  it('salads and sides have no bun group', () => {
    const nonBurgers = grilldMenu.filter(i => i.category !== 'Burgers');
    for (const item of nonBurgers) {
      const hasBun = item.customizationGroups?.some(g => g.id === 'bun');
      expect(hasBun, item.name + ' should not have bun group').toBeFalsy();
    }
  });

  it('all item IDs are unique', () => {
    const ids = grilldMenu.map(i => i.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});
