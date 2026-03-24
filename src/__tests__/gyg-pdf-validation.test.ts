/**
 * GYG PDF Validation Tests
 * Source: GYG Allergen, Ingredient & Nutritional Information Guide, December 5, 2025
 *
 * Column order in PDF:
 * Serve Size (g) | kJ | Cal | Protein (g) | Total Fat (g) | Sat Fat (g) | Carbs (g) | Sugars (g) | Fibre (g) | Sodium (mg)
 *
 * All items tested are Mild (standard) Regular size unless noted.
 */

import { describe, it, expect } from 'vitest';
import { gygMenu } from '@/data/gyg/menu';
import { computeItemMacros } from '@/lib/macros';
import type { MenuItem } from '@/types/menu';

const TOLERANCE = 3; // ±3 cal/g — PDF values are rounded; our data stores rounded integers

function expectMacro(actual: number | undefined, expected: number, label: string) {
  expect(actual ?? 0, label).toBeGreaterThanOrEqual(expected - TOLERANCE);
  expect(actual ?? 0, label).toBeLessThanOrEqual(expected + TOLERANCE);
}

function getItem(id: string): MenuItem {
  const item = gygMenu.find((i) => i.id === id);
  if (!item) throw new Error(`Item not found: ${id}`);
  return item;
}

// ─────────────────────────────────────────────────────────────────────────────
// BURRITOS — Regular, Mild (PDF p.17)
// ─────────────────────────────────────────────────────────────────────────────
describe('Burrito base macros — Regular, Mild (PDF Dec 2025)', () => {
  it('Chicken Burrito: 773 cal, 48g protein, 91g carbs, 24g fat', () => {
    const item = getItem('gyg-chicken-burrito');
    // PDF: Mild Grilled Chicken Burrito = 773 cal, 48.3g P, 91.0g C, 23.5g F
    expectMacro(item.baseMacros.calories, 773, 'calories');
    expectMacro(item.baseMacros.protein, 48, 'protein');
    expectMacro(item.baseMacros.carbs, 91, 'carbs');
    expectMacro(item.baseMacros.fat, 24, 'fat');
  });

  it('Ground Beef Burrito: 828 cal, 37g protein, 94g carbs, 34g fat', () => {
    const item = getItem('gyg-ground-beef-burrito');
    // PDF: Mild Ground Beef Burrito = 828 cal, 36.7g P, 93.9g C, 33.5g F
    expectMacro(item.baseMacros.calories, 828, 'calories');
    expectMacro(item.baseMacros.protein, 37, 'protein');
    expectMacro(item.baseMacros.carbs, 94, 'carbs');
    expectMacro(item.baseMacros.fat, 34, 'fat');
  });

  it('Pulled Pork Burrito: 759 cal, 42g protein, 90g carbs, 25g fat', () => {
    const item = getItem('gyg-pulled-pork-burrito');
    // PDF: Mild Pulled Pork Burrito = 759 cal, 42.1g P, 90.4g C, 24.9g F
    expectMacro(item.baseMacros.calories, 759, 'calories');
    expectMacro(item.baseMacros.protein, 42, 'protein');
    expectMacro(item.baseMacros.carbs, 90, 'carbs');
    expectMacro(item.baseMacros.fat, 25, 'fat');
  });

  it('Beef Brisket Burrito: 806 cal, 49g protein, 91g carbs, 27g fat', () => {
    const item = getItem('gyg-beef-brisket-burrito');
    // PDF: Mild Shredded Beef Brisket Burrito = 806 cal, 48.5g P, 90.6g C, 27.3g F
    expectMacro(item.baseMacros.calories, 806, 'calories');
    expectMacro(item.baseMacros.protein, 49, 'protein');
    expectMacro(item.baseMacros.carbs, 91, 'carbs');
    expectMacro(item.baseMacros.fat, 27, 'fat');
  });

  it('Veggie & Guac Burrito: 808 cal, 24g protein, 97g carbs, 35g fat', () => {
    const item = getItem('gyg-veggie-burrito');
    // PDF: Mild Sautéed Vegetables with Guacamole Burrito = 808 cal, 24.0g P, 96.7g C, 35.2g F
    expectMacro(item.baseMacros.calories, 808, 'calories');
    expectMacro(item.baseMacros.protein, 24, 'protein');
    expectMacro(item.baseMacros.carbs, 97, 'carbs');
    expectMacro(item.baseMacros.fat, 35, 'fat');
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// BOWLS — Regular, Mild (PDF p.17)
// ─────────────────────────────────────────────────────────────────────────────
describe('Bowl base macros — Regular, Mild (PDF Dec 2025)', () => {
  it('Grilled Chicken Bowl: 659 cal, 44g protein, 74g carbs, 21g fat', () => {
    const item = getItem('gyg-grilled-chicken-bowl');
    // PDF: Mild Grilled Chicken Bowl = 659 cal, 43.8g P, 74.1g C, 20.5g F
    expectMacro(item.baseMacros.calories, 659, 'calories');
    expectMacro(item.baseMacros.protein, 44, 'protein');
    expectMacro(item.baseMacros.carbs, 74, 'carbs');
    expectMacro(item.baseMacros.fat, 21, 'fat');
  });

  it('Ground Beef Bowl: 714 cal, 32g protein, 77g carbs, 31g fat', () => {
    const item = getItem('gyg-ground-beef-bowl');
    // PDF: Mild Ground Beef Bowl = 714 cal, 32.2g P, 77.0g C, 30.5g F
    expectMacro(item.baseMacros.calories, 714, 'calories');
    expectMacro(item.baseMacros.protein, 32, 'protein');
    expectMacro(item.baseMacros.carbs, 77, 'carbs');
    expectMacro(item.baseMacros.fat, 31, 'fat');
  });

  it('Pulled Pork Bowl: 645 cal, 38g protein, 74g carbs, 22g fat', () => {
    const item = getItem('gyg-pulled-pork-bowl');
    // PDF: Mild Pulled Pork Bowl = 645 cal, 37.6g P, 73.5g C, 21.9g F
    expectMacro(item.baseMacros.calories, 645, 'calories');
    expectMacro(item.baseMacros.protein, 38, 'protein');
    expectMacro(item.baseMacros.carbs, 74, 'carbs');
    expectMacro(item.baseMacros.fat, 22, 'fat');
  });

  it('Beef Brisket Bowl: 692 cal, 44g protein, 74g carbs, 24g fat', () => {
    const item = getItem('gyg-beef-brisket-bowl');
    // PDF: Mild Shredded Beef Brisket Bowl = 692 cal, 44.0g P, 73.7g C, 24.3g F
    expectMacro(item.baseMacros.calories, 692, 'calories');
    expectMacro(item.baseMacros.protein, 44, 'protein');
    expectMacro(item.baseMacros.carbs, 74, 'carbs');
    expectMacro(item.baseMacros.fat, 24, 'fat');
  });

  it('Veggie & Guac Bowl: 694 cal, 20g protein, 80g carbs, 32g fat', () => {
    const item = getItem('gyg-veggie-bowl');
    // PDF: Mild Sautéed Vegetables with Guacamole Bowl = 694 cal, 19.5g P, 79.8g C, 32.2g F
    expectMacro(item.baseMacros.calories, 694, 'calories');
    expectMacro(item.baseMacros.protein, 20, 'protein');
    expectMacro(item.baseMacros.carbs, 80, 'carbs');
    expectMacro(item.baseMacros.fat, 32, 'fat');
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// TACOS — Soft Flour, Mild, 1 taco (PDF p.20)
// ─────────────────────────────────────────────────────────────────────────────
describe('Taco base macros — soft flour, 1 taco, Mild (PDF Dec 2025)', () => {
  it('Chicken Taco: 192 cal, 16g protein, 16g carbs, 7g fat', () => {
    const item = getItem('gyg-chicken-taco');
    // PDF: Soft Flour Taco – Mild Grilled Chicken (1 taco) = 192 cal, 15.8g P, 15.6g C, 7.1g F
    expectMacro(item.baseMacros.calories, 192, 'calories');
    expectMacro(item.baseMacros.protein, 16, 'protein');
    expectMacro(item.baseMacros.carbs, 16, 'carbs');
    expectMacro(item.baseMacros.fat, 7, 'fat');
  });

  it('Ground Beef Taco: 214 cal, 11g protein, 17g carbs, 11g fat', () => {
    const item = getItem('gyg-beef-taco');
    // PDF: Soft Flour Taco – Mild Ground Beef (1 taco) = 214 cal, 11.2g P, 16.7g C, 11.1g F
    expectMacro(item.baseMacros.calories, 214, 'calories');
    expectMacro(item.baseMacros.protein, 11, 'protein');
    expectMacro(item.baseMacros.carbs, 17, 'carbs');
    expectMacro(item.baseMacros.fat, 11, 'fat');
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// NACHOS — Mild (PDF p.19)
// ─────────────────────────────────────────────────────────────────────────────
describe('Nachos base macros — Mild (PDF Dec 2025)', () => {
  it('Chicken Nachos: 1110 cal, 52g protein, 78g carbs, 64g fat', () => {
    const item = getItem('gyg-chicken-nachos');
    // PDF: Mild Grilled Chicken Nachos = 1110 cal, 52.3g P, 77.7g C, 64.3g F
    expectMacro(item.baseMacros.calories, 1110, 'calories');
    expectMacro(item.baseMacros.protein, 52, 'protein');
    expectMacro(item.baseMacros.carbs, 78, 'carbs');
    expectMacro(item.baseMacros.fat, 64, 'fat');
  });

  it('Ground Beef Nachos: 1160 cal, 41g protein, 81g carbs, 74g fat', () => {
    const item = getItem('gyg-beef-nachos');
    // PDF: Mild Ground Beef Nachos = 1160 cal, 40.7g P, 80.6g C, 74.3g F
    expectMacro(item.baseMacros.calories, 1160, 'calories');
    expectMacro(item.baseMacros.protein, 41, 'protein');
    expectMacro(item.baseMacros.carbs, 81, 'carbs');
    expectMacro(item.baseMacros.fat, 74, 'fat');
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// RICE SWAP DELTAS (PDF p.17)
// Burrito: White → Brown = -14 cal, -0.5g P, -5.2g C, +0.8g F
// Bowl:    White → Brown = -22 cal, -0.8g P, -8.1g C, +1.2g F
// ─────────────────────────────────────────────────────────────────────────────
describe('Brown rice swap deltas', () => {
  it('Burrito: brown rice saves ~14 cal and ~5g carbs vs white rice', () => {
    const item = getItem('gyg-chicken-burrito');
    const withWhite = computeItemMacros(item, { 'gyg-rice': ['gyg-rice-white'] });
    const withBrown = computeItemMacros(item, { 'gyg-rice': ['gyg-rice-brown'] });
    const calDelta = (withWhite.calories ?? 0) - (withBrown.calories ?? 0);
    const carbDelta = (withWhite.carbs ?? 0) - (withBrown.carbs ?? 0);
    // PDF: -14 cal, -5.2g carbs
    expect(calDelta, 'Burrito brown rice -cal').toBeGreaterThanOrEqual(10);
    expect(calDelta, 'Burrito brown rice -cal').toBeLessThanOrEqual(20);
    expect(carbDelta, 'Burrito brown rice -carbs').toBeGreaterThanOrEqual(3);
    expect(carbDelta, 'Burrito brown rice -carbs').toBeLessThanOrEqual(8);
  });

  it('Bowl: brown rice saves ~22 cal and ~8g carbs vs white rice', () => {
    const item = getItem('gyg-grilled-chicken-bowl');
    const withWhite = computeItemMacros(item, { 'gyg-rice': ['gyg-rice-white'] });
    const withBrown = computeItemMacros(item, { 'gyg-rice': ['gyg-rice-brown'] });
    const calDelta = (withWhite.calories ?? 0) - (withBrown.calories ?? 0);
    const carbDelta = (withWhite.carbs ?? 0) - (withBrown.carbs ?? 0);
    // PDF: -22 cal, -8.1g carbs
    expect(calDelta, 'Bowl brown rice -cal').toBeGreaterThanOrEqual(18);
    expect(calDelta, 'Bowl brown rice -cal').toBeLessThanOrEqual(28);
    expect(carbDelta, 'Bowl brown rice -carbs').toBeGreaterThanOrEqual(5);
    expect(carbDelta, 'Bowl brown rice -carbs').toBeLessThanOrEqual(12);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// EXTRAS DELTAS (PDF p.23 — "Extras – Reg Burritos, Bowls & Salads")
// Guacamole (70g): 126 cal, 1.2g P, 0.5g C, 13.2g F
// Extra Grilled Chicken (100g): 144 cal, 27.2g P, 0.7g C, 3.5g F
// ─────────────────────────────────────────────────────────────────────────────
describe('Extras macro deltas', () => {
  it('Guacamole adds ~126 cal and ~13g fat', () => {
    const item = getItem('gyg-grilled-chicken-bowl');
    const without = computeItemMacros(item, {});
    const withGuac = computeItemMacros(item, { 'gyg-extras': ['gyg-extra-guacamole'] });
    expectMacro((withGuac.calories ?? 0) - (without.calories ?? 0), 126, 'Guac cal delta');
    expectMacro((withGuac.fat ?? 0) - (without.fat ?? 0), 13, 'Guac fat delta');
  });

  it('Extra Chicken adds ~144 cal and ~27g protein', () => {
    const item = getItem('gyg-grilled-chicken-bowl');
    const without = computeItemMacros(item, {});
    const withExtra = computeItemMacros(item, { 'gyg-extras': ['gyg-extra-chicken'] });
    expectMacro((withExtra.calories ?? 0) - (without.calories ?? 0), 144, 'Extra chicken cal delta');
    expectMacro((withExtra.protein ?? 0) - (without.protein ?? 0), 27, 'Extra chicken protein delta');
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// BEAN SWAP DELTA (PDF p.23 — "Extras – Reg Burritos, Bowls & Salads")
// Pinto Beans vs Black Beans: +35 cal, +2.8g P, +1.0g C, +0.7g F
// ─────────────────────────────────────────────────────────────────────────────
describe('Bean swap delta', () => {
  it('Pinto beans add ~35 cal and ~3g protein vs black beans', () => {
    const item = getItem('gyg-chicken-burrito');
    const withBlack = computeItemMacros(item, { 'gyg-beans': ['gyg-beans-black'] });
    const withPinto = computeItemMacros(item, { 'gyg-beans': ['gyg-beans-pinto'] });
    const calDelta = (withPinto.calories ?? 0) - (withBlack.calories ?? 0);
    const proteinDelta = (withPinto.protein ?? 0) - (withBlack.protein ?? 0);
    // PDF: +35 cal, +2.8g P
    expect(calDelta, 'Pinto beans +cal').toBeGreaterThanOrEqual(30);
    expect(calDelta, 'Pinto beans +cal').toBeLessThanOrEqual(40);
    expect(proteinDelta, 'Pinto beans +protein').toBeGreaterThanOrEqual(1);
    expect(proteinDelta, 'Pinto beans +protein').toBeLessThanOrEqual(5);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// SPICY DELTA (PDF p.17)
// Burrito/Bowl Spicy salsa vs Mild: +17 cal, +0.3g P, +2.2g C, +0.7g F
// Taco Spicy vs Mild (per taco):    +8 cal, +1.0g C
// ─────────────────────────────────────────────────────────────────────────────
describe('Spicy option delta', () => {
  it('Burrito spicy adds ~17 cal and ~2g carbs vs mild', () => {
    const item = getItem('gyg-chicken-burrito');
    const mild = computeItemMacros(item, { 'gyg-heat': ['gyg-heat-mild'] });
    const spicy = computeItemMacros(item, { 'gyg-heat': ['gyg-heat-spicy'] });
    const calDelta = (spicy.calories ?? 0) - (mild.calories ?? 0);
    const carbDelta = (spicy.carbs ?? 0) - (mild.carbs ?? 0);
    // PDF: +17 cal, +2.2g carbs
    expect(calDelta, 'Burrito spicy +cal').toBeGreaterThanOrEqual(12);
    expect(calDelta, 'Burrito spicy +cal').toBeLessThanOrEqual(22);
    expect(carbDelta, 'Burrito spicy +carbs').toBeGreaterThanOrEqual(0);
    expect(carbDelta, 'Burrito spicy +carbs').toBeLessThanOrEqual(5);
  });

  it('Taco spicy adds ~8 cal vs mild', () => {
    const item = getItem('gyg-chicken-taco');
    const mild = computeItemMacros(item, { 'gyg-heat': ['gyg-heat-mild'] });
    const spicy = computeItemMacros(item, { 'gyg-heat': ['gyg-heat-spicy'] });
    const calDelta = (spicy.calories ?? 0) - (mild.calories ?? 0);
    // PDF: +8 cal per taco
    expect(calDelta, 'Taco spicy +cal').toBeGreaterThanOrEqual(4);
    expect(calDelta, 'Taco spicy +cal').toBeLessThanOrEqual(12);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// HARD SHELL DELTA (PDF p.20)
// Hard Shell Taco vs Soft Flour: -6 cal, -1g P, -2.4g C, +0.6g F
// ─────────────────────────────────────────────────────────────────────────────
describe('Hard shell taco delta', () => {
  it('Hard shell saves ~6 cal and ~2g carbs vs soft flour', () => {
    const item = getItem('gyg-chicken-taco');
    const soft = computeItemMacros(item, { 'gyg-shell': ['gyg-shell-soft'] });
    const hard = computeItemMacros(item, { 'gyg-shell': ['gyg-shell-hard'] });
    const calDelta = (soft.calories ?? 0) - (hard.calories ?? 0);
    const carbDelta = (soft.carbs ?? 0) - (hard.carbs ?? 0);
    // PDF: -6 cal, -2.4g carbs
    expect(calDelta, 'Hard shell -cal').toBeGreaterThanOrEqual(2);
    expect(calDelta, 'Hard shell -cal').toBeLessThanOrEqual(10);
    expect(carbDelta, 'Hard shell -carbs').toBeGreaterThanOrEqual(0);
    expect(carbDelta, 'Hard shell -carbs').toBeLessThanOrEqual(5);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// DATA INTEGRITY
// ─────────────────────────────────────────────────────────────────────────────
describe('GYG data integrity', () => {
  it('all items have positive calories, protein, carbs, fat', () => {
    for (const item of gygMenu) {
      expect(item.baseMacros.calories, `${item.name} calories`).toBeGreaterThan(0);
      expect(item.baseMacros.protein, `${item.name} protein`).toBeGreaterThan(0);
      expect(item.baseMacros.carbs, `${item.name} carbs`).toBeGreaterThan(0);
      expect(item.baseMacros.fat, `${item.name} fat`).toBeGreaterThan(0);
    }
  });

  it('all items have unique IDs', () => {
    const ids = gygMenu.map((i) => i.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('all items have the gyg restaurantSlug', () => {
    for (const item of gygMenu) {
      expect(item.restaurantSlug, item.name).toBe('gyg');
    }
  });

  it('high-calorie items (burritos/bowls) have at least one customization group', () => {
    const burritos = gygMenu.filter((i) => i.category === 'Burritos' || i.category === 'Bowls');
    for (const item of burritos) {
      expect(item.customizationGroups?.length ?? 0, `${item.name} customizations`).toBeGreaterThan(0);
    }
  });

  it('protein-heavy items (>30g) have high-protein or contains-meat tag', () => {
    for (const item of gygMenu) {
      if (item.baseMacros.protein >= 30) {
        const hasTag = item.tags?.some((t) =>
          ['high-protein', 'contains-meat', 'chicken', 'beef', 'pork'].includes(t)
        );
        expect(hasTag, `${item.name} should have a protein/meat tag`).toBe(true);
      }
    }
  });

  it('burritos are higher calorie than equivalent bowls', () => {
    const chickenBurrito = getItem('gyg-chicken-burrito');
    const chickenBowl = getItem('gyg-grilled-chicken-bowl');
    expect(chickenBurrito.baseMacros.calories).toBeGreaterThan(chickenBowl.baseMacros.calories);
  });
});
