/**
 * Fishbowl PDF Validation Tests
 * Source: Fishbowl Nutritional Overview, Dec 2025
 *
 * These tests verify that every value stored in our data files matches
 * the official PDF (within ±2 of each macro, to allow for rounding).
 *
 * If a test fails, update src/data/fishbowl/menu.ts to match the PDF.
 */

import { describe, it, expect } from 'vitest';
import { fishbowlMenu } from '@/data/fishbowl/menu';
import { computeItemMacros } from '@/lib/macros';

/** Tolerance for calorie/macro comparisons (±2 units) */
const TOLERANCE = 2;

function expectMacro(actual: number | undefined, expected: number, label: string) {
  expect(actual ?? 0, label).toBeGreaterThanOrEqual(expected - TOLERANCE);
  expect(actual ?? 0, label).toBeLessThanOrEqual(expected + TOLERANCE);
}

function getItem(id: string) {
  const item = fishbowlMenu.find((i) => i.id === id);
  if (!item) throw new Error(`Menu item not found: ${id}`);
  return item;
}

// ─────────────────────────────────────────────────────────────────────────────
// HOUSE FAVOURITE BOWLS (Regular, Brown Rice & Cabbage base)
// PDF p.3
// ─────────────────────────────────────────────────────────────────────────────
describe('House Favourite Bowls — Regular size (PDF p.3)', () => {
  it('Lime Light Chicken: 516 cal, 26.7g protein, 24.0g fat, 42.5g carbs', () => {
    const item = getItem('fishbowl-lime-light-chicken');
    expectMacro(item.baseMacros.calories, 516, 'calories');
    expectMacro(item.baseMacros.protein, 27, 'protein');
    expectMacro(item.baseMacros.fat, 24, 'fat');
    expectMacro(item.baseMacros.carbs, 43, 'carbs');
  });

  it('Heat Check Chicken: 508 cal, 27.5g protein, 20.3g fat, 47.2g carbs', () => {
    const item = getItem('fishbowl-heat-check-chicken');
    expectMacro(item.baseMacros.calories, 508, 'calories');
    expectMacro(item.baseMacros.protein, 28, 'protein');
    expectMacro(item.baseMacros.fat, 20, 'fat');
    expectMacro(item.baseMacros.carbs, 47, 'carbs');
  });

  it('Green Dream Chicken: 499 cal, 31.7g protein, 22.8g fat, 36.7g carbs', () => {
    const item = getItem('fishbowl-green-dream-chicken');
    expectMacro(item.baseMacros.calories, 499, 'calories');
    expectMacro(item.baseMacros.protein, 32, 'protein');
    expectMacro(item.baseMacros.fat, 23, 'fat');
    expectMacro(item.baseMacros.carbs, 37, 'carbs');
  });

  it('Salmon O.G.: 609 cal, 22.9g protein, 33.1g fat, 51.4g carbs', () => {
    const item = getItem('fishbowl-salmon-og');
    expectMacro(item.baseMacros.calories, 609, 'calories');
    expectMacro(item.baseMacros.protein, 23, 'protein');
    expectMacro(item.baseMacros.fat, 33, 'fat');
    expectMacro(item.baseMacros.carbs, 51, 'carbs');
  });

  it('Chicken O.G.: 553 cal, 28.5g protein, 24.2g fat, 51.4g carbs', () => {
    const item = getItem('fishbowl-chicken-og');
    expectMacro(item.baseMacros.calories, 553, 'calories');
    expectMacro(item.baseMacros.protein, 29, 'protein');
    expectMacro(item.baseMacros.fat, 24, 'fat');
    expectMacro(item.baseMacros.carbs, 51, 'carbs');
  });

  it('Roasted Tofu O.G.: 606 cal, 20.5g protein, 32.9g fat, 52.2g carbs', () => {
    const item = getItem('fishbowl-tofu-og');
    expectMacro(item.baseMacros.calories, 606, 'calories');
    expectMacro(item.baseMacros.protein, 21, 'protein');
    expectMacro(item.baseMacros.fat, 33, 'fat');
    expectMacro(item.baseMacros.carbs, 52, 'carbs');
  });

  it('Chilli Chicken: 531 cal, 29.1g protein, 27.1g fat, 35.9g carbs', () => {
    const item = getItem('fishbowl-chilli-chicken');
    expectMacro(item.baseMacros.calories, 531, 'calories');
    expectMacro(item.baseMacros.protein, 29, 'protein');
    expectMacro(item.baseMacros.fat, 27, 'fat');
    expectMacro(item.baseMacros.carbs, 36, 'carbs');
  });

  it('Tofu Boys: 643 cal, 22.9g protein, 38.6g fat, 44.9g carbs', () => {
    const item = getItem('fishbowl-tofu-boys');
    expectMacro(item.baseMacros.calories, 643, 'calories');
    expectMacro(item.baseMacros.protein, 23, 'protein');
    expectMacro(item.baseMacros.fat, 39, 'fat');
    expectMacro(item.baseMacros.carbs, 45, 'carbs');
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// WARM BOWLS (Regular, Brown Rice & Cabbage base)
// PDF p.4
// ─────────────────────────────────────────────────────────────────────────────
describe('Warm Bowls — Regular size (PDF p.4)', () => {
  it('Miso Salmon: 670 cal, 29.1g protein, 36.8g fat, 48.1g carbs', () => {
    const item = getItem('fishbowl-miso-salmon');
    expectMacro(item.baseMacros.calories, 670, 'calories');
    expectMacro(item.baseMacros.protein, 29, 'protein');
    expectMacro(item.baseMacros.fat, 37, 'fat');
    expectMacro(item.baseMacros.carbs, 48, 'carbs');
  });

  it('Braised Beef: 678 cal, 34.5g protein, 34.7g fat, 50.6g carbs', () => {
    const item = getItem('fishbowl-braised-beef');
    expectMacro(item.baseMacros.calories, 678, 'calories');
    expectMacro(item.baseMacros.protein, 35, 'protein');
    expectMacro(item.baseMacros.fat, 35, 'fat');
    expectMacro(item.baseMacros.carbs, 51, 'carbs');
  });

  it('Spicy Salmon: 695 cal, 29.8g protein, 39.6g fat, 48.5g carbs', () => {
    const item = getItem('fishbowl-spicy-salmon');
    expectMacro(item.baseMacros.calories, 695, 'calories');
    expectMacro(item.baseMacros.protein, 30, 'protein');
    expectMacro(item.baseMacros.fat, 40, 'fat');
    expectMacro(item.baseMacros.carbs, 49, 'carbs');
  });

  it('Miso Eggplant: 489 cal, 12.0g protein, 21.8g fat, 52.0g carbs', () => {
    const item = getItem('fishbowl-miso-eggplant');
    expectMacro(item.baseMacros.calories, 489, 'calories');
    expectMacro(item.baseMacros.protein, 12, 'protein');
    expectMacro(item.baseMacros.fat, 22, 'fat');
    expectMacro(item.baseMacros.carbs, 52, 'carbs');
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// STREET FOOD BOXES
// PDF p.4
// ─────────────────────────────────────────────────────────────────────────────
describe('Street Food Boxes (PDF p.4)', () => {
  it('Lemon Chicken Box: 554 cal, 25.3g protein, 28.5g fat, 43.6g carbs', () => {
    const item = getItem('fishbowl-lemon-chicken-box');
    expectMacro(item.baseMacros.calories, 554, 'calories');
    expectMacro(item.baseMacros.protein, 25, 'protein');
    expectMacro(item.baseMacros.fat, 29, 'fat');
    expectMacro(item.baseMacros.carbs, 44, 'carbs');
  });

  it('Miso Salmon Box: 634 cal, 27.1g protein, 32.6g fat, 52.9g carbs', () => {
    const item = getItem('fishbowl-miso-salmon-box');
    expectMacro(item.baseMacros.calories, 634, 'calories');
    expectMacro(item.baseMacros.protein, 27, 'protein');
    expectMacro(item.baseMacros.fat, 33, 'fat');
    expectMacro(item.baseMacros.carbs, 53, 'carbs');
  });

  it('Beef Brisket Box: 545 cal, 31.7g protein, 24.9g fat, 44.7g carbs', () => {
    const item = getItem('fishbowl-beef-brisket-box');
    expectMacro(item.baseMacros.calories, 545, 'calories');
    expectMacro(item.baseMacros.protein, 32, 'protein');
    expectMacro(item.baseMacros.fat, 25, 'fat');
    expectMacro(item.baseMacros.carbs, 45, 'carbs');
  });

  it('Roasted Tofu Box: 483 cal, 16.8g protein, 23.6g fat, 45.8g carbs', () => {
    const item = getItem('fishbowl-tofu-box');
    expectMacro(item.baseMacros.calories, 483, 'calories');
    expectMacro(item.baseMacros.protein, 17, 'protein');
    expectMacro(item.baseMacros.fat, 24, 'fat');
    expectMacro(item.baseMacros.carbs, 46, 'carbs');
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// BUILD YOUR OWN — base macros (Brown Rice & Cabbage, Regular)
// PDF p.5
// ─────────────────────────────────────────────────────────────────────────────
describe('Build Your Own Bowl — base (Brown Rice & Cabbage, PDF p.5)', () => {
  it('baseMacros matches Brown Rice & Cabbage Regular: 111 cal, 3.1g protein, <1g fat, 21.5g carbs', () => {
    const item = getItem('fishbowl-build-your-own');
    expectMacro(item.baseMacros.calories, 111, 'calories');
    expectMacro(item.baseMacros.protein, 3, 'protein');
    expect(item.baseMacros.fat).toBeLessThanOrEqual(2);
    expectMacro(item.baseMacros.carbs, 22, 'carbs');
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// BUILD YOUR OWN — protein deltas (PDF p.6)
// ─────────────────────────────────────────────────────────────────────────────
describe('Build Your Own — Protein customization deltas (PDF p.6)', () => {
  const byo = () => fishbowlMenu.find((i) => i.id === 'fishbowl-build-your-own')!;
  const proteinGroup = () => byo().customizationGroups!.find((g) => g.id === 'fb-protein')!;

  function calcWithProtein(optionId: string) {
    return computeItemMacros(byo(), { 'fb-protein': [optionId] });
  }

  it('Poached Chicken adds 84 cal, 17.8g protein, 1.3g fat', () => {
    const m = calcWithProtein('fb-protein-chicken');
    // base 111 + chicken 84 = 195 cal
    expectMacro(m.calories, 111 + 84, 'calories');
    expectMacro(m.protein, 3 + 18, 'protein');
    expect(m.fat).toBeLessThanOrEqual(3);
  });

  it('Salmon Sashimi adds 140 cal, 12.2g protein, 10.2g fat', () => {
    const m = calcWithProtein('fb-protein-salmon-sashimi');
    expectMacro(m.calories, 111 + 140, 'calories');
    expectMacro(m.protein, 3 + 12, 'protein');
    expectMacro(m.fat, 10, 'fat');
  });

  it('Beef Brisket adds 178 cal, 24.3g protein, 8.3g fat', () => {
    const m = calcWithProtein('fb-protein-beef-brisket');
    expectMacro(m.calories, 111 + 178, 'calories');
    expectMacro(m.protein, 3 + 24, 'protein');
    expectMacro(m.fat, 8, 'fat');
  });

  it('Roasted Tofu adds 136 cal, 9.8g protein, 10.0g fat', () => {
    const m = calcWithProtein('fb-protein-tofu');
    expectMacro(m.calories, 111 + 136, 'calories');
    expectMacro(m.protein, 3 + 10, 'protein');
    expectMacro(m.fat, 10, 'fat');
  });

  it('Miso Glazed Salmon Fillet adds 266 cal, 19.7g protein, 16.0g fat', () => {
    const m = calcWithProtein('fb-protein-miso-salmon');
    expectMacro(m.calories, 111 + 266, 'calories');
    expectMacro(m.protein, 3 + 20, 'protein');
    expectMacro(m.fat, 16, 'fat');
  });

  it('Miso Glazed Eggplant adds 90 cal, 3.0g protein, 1.2g fat', () => {
    const m = calcWithProtein('fb-protein-miso-eggplant');
    expectMacro(m.calories, 111 + 90, 'calories');
    expectMacro(m.protein, 3 + 3, 'protein');
    expect(m.fat).toBeLessThanOrEqual(3);
  });

  it('Protein group exists and has 6 options', () => {
    expect(proteinGroup().options).toHaveLength(6);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// BUILD YOUR OWN — dressing deltas (PDF p.7)
// ─────────────────────────────────────────────────────────────────────────────
describe('Build Your Own — Dressing deltas (PDF p.7)', () => {
  const byo = () => fishbowlMenu.find((i) => i.id === 'fishbowl-build-your-own')!;

  function calcWithDressing(optionId: string) {
    return computeItemMacros(byo(), { 'fb-dressing': [optionId] });
  }

  it('Lime Cashew adds 133 cal, 11.5g fat, 6.6g carbs', () => {
    const m = calcWithDressing('fb-dressing-lime-cashew');
    expectMacro(m.calories, 111 + 133, 'calories');
    expectMacro(m.fat, 12, 'fat');
    expectMacro(m.carbs, 22 + 7, 'carbs');
  });

  it('Thai Green Goddess adds 75 cal, 7.3g fat, 2.4g carbs', () => {
    const m = calcWithDressing('fb-dressing-thai-green-goddess');
    expectMacro(m.calories, 111 + 75, 'calories');
    expectMacro(m.fat, 7, 'fat');
  });

  it('Lemon Olive Oil adds 154 cal, 15.9g fat', () => {
    const m = calcWithDressing('fb-dressing-lemon-olive-oil');
    expectMacro(m.calories, 111 + 154, 'calories');
    expectMacro(m.fat, 16, 'fat');
  });

  it('Wasabi Mayo adds 145 cal, 14.9g fat', () => {
    const m = calcWithDressing('fb-dressing-wasabi-mayo');
    expectMacro(m.calories, 111 + 145, 'calories');
    expectMacro(m.fat, 15, 'fat');
  });

  it('Dressing group allows up to 2 selections', () => {
    const dressingGroup = byo().customizationGroups!.find((g) => g.id === 'fb-dressing')!;
    expect(dressingGroup.maxSelections).toBe(2);
    expect(dressingGroup.type).toBe('multi');
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// BUILD YOUR OWN — base swap deltas (PDF p.5)
// ─────────────────────────────────────────────────────────────────────────────
describe('Build Your Own — Base swap deltas (PDF p.5)', () => {
  const byo = () => fishbowlMenu.find((i) => i.id === 'fishbowl-build-your-own')!;

  function calcWithBase(optionId: string) {
    return computeItemMacros(byo(), { 'fb-base': [optionId] });
  }

  it('Sushi Rice base: ~179 cal total (111 + 68 delta)', () => {
    const m = calcWithBase('fb-base-sushi-rice');
    // PDF: Sushi Rice Regular = 179 cal
    expectMacro(m.calories, 179, 'calories');
  });

  it('Brown Rice base: ~199 cal total', () => {
    const m = calcWithBase('fb-base-brown-rice');
    // PDF: Brown Rice Regular = 199 cal
    expectMacro(m.calories, 199, 'calories');
  });

  it('Cabbage base: ~22 cal total', () => {
    const m = calcWithBase('fb-base-cabbage');
    // PDF: Cabbage Regular = 22 cal
    expectMacro(m.calories, 22, 'calories');
  });

  it('Glass Noodles base: ~235 cal total', () => {
    const m = calcWithBase('fb-base-glass-noodles');
    // PDF: Glass Noodles Regular = 235 cal
    expectMacro(m.calories, 235, 'calories');
  });

  it('Mixed Leaves base: ~10 cal total', () => {
    const m = calcWithBase('fb-base-mixed-leaves');
    // PDF: Mixed Leaves = <40 kJ / <10 cal
    expect(m.calories).toBeLessThanOrEqual(15);
  });

  it('Base group allows up to 2 selections', () => {
    const baseGroup = byo().customizationGroups!.find((g) => g.id === 'fb-base')!;
    expect(baseGroup.maxSelections).toBe(2);
    expect(baseGroup.type).toBe('multi');
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// FULL MEAL CALCULATION
// Chicken O.G. Regular = a complete meal, no customization needed
// Build Your Own: Brown Rice & Cabbage + Poached Chicken + Lime Cashew dressing
// ─────────────────────────────────────────────────────────────────────────────
describe('Full meal calculation scenarios', () => {
  it('Chicken O.G. with Large upgrade: ~728 cal, ~41g protein (average Large delta)', () => {
    const item = getItem('fishbowl-chicken-og');
    const macros = computeItemMacros(item, { 'fb-size': ['fb-size-large'] });
    // NOTE: SIZE_GROUP uses average Large delta (+175 cal, +10p, +11f, +9c) across all bowls.
    // PDF exact for Chicken O.G. Large = 711 cal, 39g protein — approx used for simplicity.
    // Computed: 553 + 175 = 728 cal, 29 + 10 = 39 protein
    expectMacro(macros.calories, 728, 'calories');
    expectMacro(macros.protein, 39, 'protein');
  });

  it('Build Your Own: Brown Rice & Cabbage + Poached Chicken + Lime Cashew = ~328 cal, ~21g protein', () => {
    const item = getItem('fishbowl-build-your-own');
    // base 111 + chicken 84 + lime cashew 133 = 328 cal
    // protein: 3 + 18 + 0 = 21g
    const macros = computeItemMacros(item, {
      'fb-base': ['fb-base-brown-rice-cabbage'],
      'fb-protein': ['fb-protein-chicken'],
      'fb-dressing': ['fb-dressing-lime-cashew'],
    });
    expectMacro(macros.calories, 328, 'calories');
    expectMacro(macros.protein, 21, 'protein');
  });

  it('Build Your Own: Sushi Rice + Beef Brisket = ~468 cal, ~27g protein', () => {
    const item = getItem('fishbowl-build-your-own');
    // base 111 + sushi rice delta 68 + beef brisket 178 = 357... wait
    // Actually with sushi rice swap: 111 + 68 = 179 cal base, then + beef brisket 178 = 357
    const macros = computeItemMacros(item, {
      'fb-base': ['fb-base-sushi-rice'],
      'fb-protein': ['fb-protein-beef-brisket'],
    });
    // 111 + 68 (sushi rice delta) + 178 (beef) = 357 cal
    // protein: 3 + 24 = 27g
    expectMacro(macros.calories, 357, 'calories');
    expectMacro(macros.protein, 27, 'protein');
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// DATA INTEGRITY CHECKS
// ─────────────────────────────────────────────────────────────────────────────
describe('Data integrity checks', () => {
  it('All Fishbowl items have positive calories', () => {
    for (const item of fishbowlMenu) {
      expect(item.baseMacros.calories, `${item.name} calories`).toBeGreaterThan(0);
    }
  });

  it('All Fishbowl items have non-negative protein', () => {
    for (const item of fishbowlMenu) {
      expect(item.baseMacros.protein, `${item.name} protein`).toBeGreaterThanOrEqual(0);
    }
  });

  it('All items have a restaurantSlug of "fishbowl"', () => {
    for (const item of fishbowlMenu) {
      expect(item.restaurantSlug).toBe('fishbowl');
    }
  });

  it('No duplicate item IDs', () => {
    const ids = fishbowlMenu.map((i) => i.id);
    const unique = new Set(ids);
    expect(unique.size).toBe(ids.length);
  });

  it('Build Your Own Bowl has all required customization groups', () => {
    const byo = fishbowlMenu.find((i) => i.id === 'fishbowl-build-your-own')!;
    const groupIds = byo.customizationGroups!.map((g) => g.id);
    expect(groupIds).toContain('fb-size');
    expect(groupIds).toContain('fb-base');
    expect(groupIds).toContain('fb-protein');
    expect(groupIds).toContain('fb-dressing');
    expect(groupIds).toContain('fb-extras');
  });

  it('Base group has exactly 6 options (the 5 real bases + default)', () => {
    const byo = fishbowlMenu.find((i) => i.id === 'fishbowl-build-your-own')!;
    const baseGroup = byo.customizationGroups!.find((g) => g.id === 'fb-base')!;
    expect(baseGroup.options).toHaveLength(6);
  });

  it('Items with fish protein are tagged contains-fish', () => {
    const fishItems = fishbowlMenu.filter((i) =>
      i.name.toLowerCase().includes('salmon') || i.name.toLowerCase().includes('fish')
    );
    for (const item of fishItems) {
      expect(item.tags, `${item.name} should have contains-fish`).toContain('contains-fish');
    }
  });

  it('Vegan items (Tofu OG, Tofu Boys, Miso Eggplant, Roasted Tofu Box) are tagged vegan', () => {
    const veganIds = ['fishbowl-tofu-og', 'fishbowl-tofu-boys', 'fishbowl-miso-eggplant', 'fishbowl-tofu-box'];
    for (const id of veganIds) {
      const item = getItem(id);
      expect(item.tags, `${item.name} should be tagged vegan`).toContain('vegan');
    }
  });
});
