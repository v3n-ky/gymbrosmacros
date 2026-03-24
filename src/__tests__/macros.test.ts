/**
 * Unit tests for src/lib/macros.ts
 *
 * Covers: proteinPerCalorie, proteinPercentage, isTopPick, isHighProtein,
 *         multiplyMacros, sumMacros, computeItemMacros
 */

import { describe, it, expect } from 'vitest';
import {
  computeItemMacros,
  sumMacros,
  multiplyMacros,
  proteinPerCalorie,
  proteinPercentage,
  isTopPick,
  isHighProtein,
} from '@/lib/macros';
import { Macros, EMPTY_MACROS } from '@/types/macros';
import { MenuItem } from '@/types/menu';

function makeItem(baseMacros: Macros, overrides: Partial<MenuItem> = {}): MenuItem {
  return {
    id: 'test-item',
    restaurantSlug: 'test',
    name: 'Test Item',
    category: 'Test',
    baseMacros,
    ...overrides,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// proteinPerCalorie
// ─────────────────────────────────────────────────────────────────────────────

describe('proteinPerCalorie', () => {
  it('returns grams of protein per 100 calories', () => {
    // 40 / 500 * 100 = 8.0
    expect(proteinPerCalorie({ calories: 500, protein: 40, carbs: 30, fat: 15 })).toBe(8);
  });

  it('rounds to one decimal place', () => {
    // 25 / 300 * 1000 = 83.33 → round → 83 / 10 = 8.3
    expect(proteinPerCalorie({ calories: 300, protein: 25, carbs: 20, fat: 10 })).toBe(8.3);
  });

  it('returns 0 when calories is 0', () => {
    expect(proteinPerCalorie({ calories: 0, protein: 30, carbs: 0, fat: 0 })).toBe(0);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// proteinPercentage
// ─────────────────────────────────────────────────────────────────────────────

describe('proteinPercentage', () => {
  it('calculates the percentage of calories from protein', () => {
    // protein: 40*4=160, carbs: 30*4=120, fat: 10*9=90 → total=370
    // round(160/370*100) = round(43.24) = 43
    expect(proteinPercentage({ calories: 500, protein: 40, carbs: 30, fat: 10 })).toBe(43);
  });

  it('returns 100 when all calories come from protein', () => {
    expect(proteinPercentage({ calories: 400, protein: 100, carbs: 0, fat: 0 })).toBe(100);
  });

  it('returns 0 when all macros are 0', () => {
    expect(proteinPercentage({ calories: 0, protein: 0, carbs: 0, fat: 0 })).toBe(0);
  });

  it('uses macro-derived calorie total, not the calories field', () => {
    // protein: 20*4=80, carbs: 10*4=40, fat: 5*9=45 → total=165
    // The calories field (999) should NOT be used
    expect(proteinPercentage({ calories: 999, protein: 20, carbs: 10, fat: 5 })).toBe(
      Math.round((80 / 165) * 100)
    );
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// isTopPick
// ─────────────────────────────────────────────────────────────────────────────

describe('isTopPick', () => {
  // protein: 35*4=140, carbs: 40*4=160, fat: 10*9=90 → total=390, protein%=36
  const qualifying: Macros = { calories: 500, protein: 35, carbs: 40, fat: 10 };

  it('returns true when protein >= 30g, calories <= 600, protein% >= 30', () => {
    expect(isTopPick(qualifying)).toBe(true);
  });

  it('returns false when protein < 30g', () => {
    expect(isTopPick({ ...qualifying, protein: 29 })).toBe(false);
  });

  it('returns false when calories > 600', () => {
    expect(isTopPick({ ...qualifying, calories: 601 })).toBe(false);
  });

  it('returns false when protein percentage < 30%', () => {
    // protein: 30*4=120, carbs: 80*4=320, fat: 20*9=180 → total=620, protein%=19
    expect(isTopPick({ calories: 600, protein: 30, carbs: 80, fat: 20 })).toBe(false);
  });

  it('returns true at the exact boundary (protein=30, calories=600, protein%=30)', () => {
    // protein: 30*4=120, carbs: 25*4=100, fat: 5*9=45 → total=265, protein%=round(45.28)=45
    expect(isTopPick({ calories: 600, protein: 30, carbs: 25, fat: 5 })).toBe(true);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// isHighProtein
// ─────────────────────────────────────────────────────────────────────────────

describe('isHighProtein', () => {
  it('returns true when protein >= 8g per 100 cal', () => {
    // 40 / 500 * 100 = 8.0
    expect(isHighProtein({ calories: 500, protein: 40, carbs: 30, fat: 15 })).toBe(true);
  });

  it('returns false when protein < 8g per 100 cal', () => {
    // 20 / 500 * 100 = 4.0
    expect(isHighProtein({ calories: 500, protein: 20, carbs: 50, fat: 20 })).toBe(false);
  });

  it('returns false when calories is 0 (avoids divide-by-zero)', () => {
    expect(isHighProtein({ calories: 0, protein: 50, carbs: 0, fat: 0 })).toBe(false);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// multiplyMacros
// ─────────────────────────────────────────────────────────────────────────────

describe('multiplyMacros', () => {
  it('scales all fields by the given quantity', () => {
    const m: Macros = { calories: 100, protein: 10, carbs: 20, fat: 5, fibre: 3, sodium: 200, sugar: 8 };
    expect(multiplyMacros(m, 3)).toEqual({
      calories: 300, protein: 30, carbs: 60, fat: 15,
      fibre: 9, sodium: 600, sugar: 24,
    });
  });

  it('leaves optional fields undefined when they are not set', () => {
    const m: Macros = { calories: 100, protein: 10, carbs: 20, fat: 5 };
    const result = multiplyMacros(m, 2);
    expect(result.fibre).toBeUndefined();
    expect(result.sodium).toBeUndefined();
    expect(result.sugar).toBeUndefined();
  });

  it('returns unchanged macros when quantity is 1', () => {
    const m: Macros = { calories: 400, protein: 30, carbs: 45, fat: 12 };
    expect(multiplyMacros(m, 1)).toEqual(m);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// sumMacros
// ─────────────────────────────────────────────────────────────────────────────

describe('sumMacros', () => {
  it('sums two macro objects', () => {
    const a: Macros = { calories: 300, protein: 20, carbs: 30, fat: 10 };
    const b: Macros = { calories: 200, protein: 15, carbs: 25, fat: 5 };
    const result = sumMacros([a, b]);
    expect(result.calories).toBe(500);
    expect(result.protein).toBe(35);
    expect(result.carbs).toBe(55);
    expect(result.fat).toBe(15);
  });

  it('returns EMPTY_MACROS for an empty array', () => {
    expect(sumMacros([])).toEqual({ ...EMPTY_MACROS });
  });

  it('sums optional fields (fibre, sodium, sugar)', () => {
    const a: Macros = { calories: 100, protein: 5, carbs: 10, fat: 3, fibre: 2, sodium: 150, sugar: 4 };
    const b: Macros = { calories: 200, protein: 10, carbs: 20, fat: 6, fibre: 4, sodium: 300, sugar: 8 };
    const result = sumMacros([a, b]);
    expect(result.fibre).toBe(6);
    expect(result.sodium).toBe(450);
    expect(result.sugar).toBe(12);
  });

  it('treats missing optional fields as 0', () => {
    const a: Macros = { calories: 100, protein: 5, carbs: 10, fat: 3, fibre: 2 };
    const b: Macros = { calories: 200, protein: 10, carbs: 20, fat: 6 }; // no fibre
    const result = sumMacros([a, b]);
    expect(result.fibre).toBe(2);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// computeItemMacros
// ─────────────────────────────────────────────────────────────────────────────

describe('computeItemMacros', () => {
  it('returns base macros when no options are selected', () => {
    const item = makeItem({ calories: 500, protein: 30, carbs: 50, fat: 15 });
    expect(computeItemMacros(item, {})).toEqual({ calories: 500, protein: 30, carbs: 50, fat: 15 });
  });

  it('applies a single macroDelta from a selected option', () => {
    const item = makeItem({ calories: 400, protein: 25, carbs: 40, fat: 10 }, {
      customizationGroups: [{
        id: 'base',
        name: 'Base',
        type: 'single',
        required: true,
        options: [
          { id: 'sushi-rice', name: 'Sushi Rice', macroDelta: { calories: 50, carbs: 12 } },
        ],
      }],
    });
    const result = computeItemMacros(item, { base: ['sushi-rice'] });
    expect(result.calories).toBe(450);
    expect(result.carbs).toBe(52);
    expect(result.protein).toBe(25); // unchanged
    expect(result.fat).toBe(10);     // unchanged
  });

  it('applies deltas from multiple customization groups', () => {
    const item = makeItem({ calories: 300, protein: 20, carbs: 30, fat: 8 }, {
      customizationGroups: [
        {
          id: 'protein',
          name: 'Protein',
          type: 'single',
          required: false,
          options: [{ id: 'chicken', name: 'Chicken', macroDelta: { calories: 100, protein: 20 } }],
        },
        {
          id: 'sauce',
          name: 'Sauce',
          type: 'single',
          required: false,
          options: [{ id: 'mayo', name: 'Mayo', macroDelta: { calories: 40, fat: 4 } }],
        },
      ],
    });
    const result = computeItemMacros(item, { protein: ['chicken'], sauce: ['mayo'] });
    expect(result.calories).toBe(440);
    expect(result.protein).toBe(40);
    expect(result.fat).toBe(12);
  });

  it('halves each delta when halfAndHalf is true and exactly 2 options are selected', () => {
    const item = makeItem({ calories: 300, protein: 10, carbs: 40, fat: 5 }, {
      customizationGroups: [{
        id: 'base',
        name: 'Base',
        type: 'multi',
        required: true,
        halfAndHalf: true,
        options: [
          { id: 'rice', name: 'Rice', macroDelta: { calories: 0, carbs: 0 } },
          { id: 'noodles', name: 'Noodles', macroDelta: { calories: 60, carbs: 15 } },
        ],
      }],
    });
    const result = computeItemMacros(item, { base: ['rice', 'noodles'] });
    // rice: 0/2=0, noodles: 60/2=30cal, round(15/2)=8carbs
    expect(result.calories).toBe(330);
    expect(result.carbs).toBe(48);
  });

  it('does NOT halve deltas when only 1 option is selected (even with halfAndHalf)', () => {
    const item = makeItem({ calories: 300, protein: 10, carbs: 40, fat: 5 }, {
      customizationGroups: [{
        id: 'base',
        name: 'Base',
        type: 'multi',
        required: true,
        halfAndHalf: true,
        options: [
          { id: 'noodles', name: 'Noodles', macroDelta: { calories: 60, carbs: 15 } },
        ],
      }],
    });
    const result = computeItemMacros(item, { base: ['noodles'] });
    // divisor = 1 (only 1 selected), so full delta applied
    expect(result.calories).toBe(360);
    expect(result.carbs).toBe(55);
  });

  it('ignores unknown option IDs', () => {
    const item = makeItem({ calories: 400, protein: 25, carbs: 40, fat: 10 }, {
      customizationGroups: [{
        id: 'base',
        name: 'Base',
        type: 'single',
        required: true,
        options: [{ id: 'real-option', name: 'Real', macroDelta: { calories: 100 } }],
      }],
    });
    const result = computeItemMacros(item, { base: ['nonexistent'] });
    expect(result).toEqual({ calories: 400, protein: 25, carbs: 40, fat: 10 });
  });

  it('ignores groups with no options selected', () => {
    const item = makeItem({ calories: 400, protein: 25, carbs: 40, fat: 10 }, {
      customizationGroups: [{
        id: 'extras',
        name: 'Extras',
        type: 'multi',
        required: false,
        options: [{ id: 'avocado', name: 'Avocado', macroDelta: { calories: 80, fat: 7 } }],
      }],
    });
    // extras group not included in selectedOptions
    expect(computeItemMacros(item, {})).toEqual({ calories: 400, protein: 25, carbs: 40, fat: 10 });
  });
});
