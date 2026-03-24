/**
 * Unit tests for src/lib/meal-finder.ts
 *
 * Covers: findMatchingItems (filtering, scoring, sorting, maxResults, variant generation)
 * Note: computeDistance and computeMatchScore are private; tested via the public API.
 */

import { describe, it, expect } from 'vitest';
import { findMatchingItems } from '@/lib/meal-finder';
import { MenuItem } from '@/types/menu';
import { MacroTargets } from '@/types/meal';

function makeItem(
  id: string,
  slug: string,
  category: string,
  macros: { calories: number; protein: number; carbs: number; fat: number }
): MenuItem {
  return {
    id,
    restaurantSlug: slug,
    name: id,
    category,
    baseMacros: macros,
  };
}

const ITEMS: MenuItem[] = [
  makeItem('bowl-a',   'fishbowl', 'Bowl',   { calories: 500, protein: 40, carbs: 40, fat: 12 }),
  makeItem('salad-b',  'fishbowl', 'Salad',  { calories: 250, protein: 20, carbs: 15, fat:  8 }),
  makeItem('burger-c', 'grilld',   'Burger', { calories: 700, protein: 40, carbs: 55, fat: 30 }),
  makeItem('wrap-d',   'grilld',   'Wrap',   { calories: 450, protein: 30, carbs: 50, fat: 15 }),
  makeItem('sub-e',    'subway',   'Sub',    { calories: 380, protein: 25, carbs: 45, fat: 10 }),
];

// ─────────────────────────────────────────────────────────────────────────────
// Filtering
// ─────────────────────────────────────────────────────────────────────────────

describe('findMatchingItems — filtering', () => {
  const targets: MacroTargets = { calories: 400 };

  it('returns all items when no filters are provided', () => {
    const results = findMatchingItems(ITEMS, targets);
    expect(results).toHaveLength(ITEMS.length);
  });

  it('filters by restaurant slug', () => {
    const results = findMatchingItems(ITEMS, targets, { restaurantFilter: ['fishbowl'] });
    expect(results.every((r) => r.item.restaurantSlug === 'fishbowl')).toBe(true);
    expect(results).toHaveLength(2);
  });

  it('filters by multiple restaurant slugs', () => {
    const results = findMatchingItems(ITEMS, targets, {
      restaurantFilter: ['fishbowl', 'subway'],
    });
    expect(results).toHaveLength(3);
    expect(results.every((r) => ['fishbowl', 'subway'].includes(r.item.restaurantSlug))).toBe(true);
  });

  it('filters by category', () => {
    const results = findMatchingItems(ITEMS, targets, { categoryFilter: ['Bowl'] });
    expect(results).toHaveLength(1);
    expect(results[0].item.id).toBe('bowl-a');
  });

  it('applies both restaurant and category filters together', () => {
    const results = findMatchingItems(ITEMS, targets, {
      restaurantFilter: ['grilld'],
      categoryFilter: ['Wrap'],
    });
    expect(results).toHaveLength(1);
    expect(results[0].item.id).toBe('wrap-d');
  });

  it('returns an empty array when no items match the filter', () => {
    const results = findMatchingItems(ITEMS, targets, { restaurantFilter: ['nonexistent'] });
    expect(results).toHaveLength(0);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Scoring (accessed via bestVariant)
// ─────────────────────────────────────────────────────────────────────────────

describe('findMatchingItems — scoring', () => {
  it('assigns score 100 to a perfect match (no customizations)', () => {
    const perfect = makeItem('perfect', 'test', 'Test', { calories: 400, protein: 30, carbs: 40, fat: 10 });
    const targets: MacroTargets = { calories: 400, protein: 30, carbs: 40, fat: 10 };
    const [result] = findMatchingItems([perfect], targets);
    expect(result.bestVariant.matchScore).toBe(100);
    expect(result.bestVariant.distance).toBe(0);
  });

  it('assigns score 50 when no targets are set', () => {
    const results = findMatchingItems(ITEMS, {});
    expect(results.every((r) => r.bestVariant.matchScore === 50)).toBe(true);
  });

  it('assigns a lower score to items further from the target', () => {
    // bowl-a (500 cal) is closer to 500 than burger-c (700 cal)
    const targets: MacroTargets = { calories: 500 };
    const results = findMatchingItems([ITEMS[0], ITEMS[2]], targets);
    const bowlScore   = results.find((r) => r.item.id === 'bowl-a')!.bestVariant.matchScore;
    const burgerScore = results.find((r) => r.item.id === 'burger-c')!.bestVariant.matchScore;
    expect(bowlScore).toBeGreaterThan(burgerScore);
  });

  it('clamps score to 0 when distance is very large', () => {
    const farAway = makeItem('far', 'test', 'Test', { calories: 9999, protein: 0, carbs: 0, fat: 0 });
    const targets: MacroTargets = { calories: 100 };
    const [result] = findMatchingItems([farAway], targets);
    expect(result.bestVariant.matchScore).toBe(0);
  });

  it('bestVariant.computedMacros matches item baseMacros when there are no customization groups', () => {
    const targets: MacroTargets = { calories: 500 };
    const [result] = findMatchingItems([ITEMS[0]], targets);
    expect(result.bestVariant.computedMacros).toEqual(ITEMS[0].baseMacros);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Sorting
// ─────────────────────────────────────────────────────────────────────────────

describe('findMatchingItems — sorting', () => {
  it('returns results sorted by bestVariant.matchScore descending', () => {
    const targets: MacroTargets = { calories: 500 };
    const results = findMatchingItems(ITEMS, targets);
    for (let i = 0; i < results.length - 1; i++) {
      expect(results[i].bestVariant.matchScore).toBeGreaterThanOrEqual(
        results[i + 1].bestVariant.matchScore
      );
    }
  });

  it('places the exact-match item first', () => {
    const targets: MacroTargets = { calories: 500 };
    const results = findMatchingItems(ITEMS, targets);
    expect(results[0].item.id).toBe('bowl-a'); // exactly 500 cal
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// maxResults
// ─────────────────────────────────────────────────────────────────────────────

describe('findMatchingItems — maxResults', () => {
  it('returns at most maxResults items', () => {
    const results = findMatchingItems(ITEMS, {}, { maxResults: 3 });
    expect(results).toHaveLength(3);
  });

  it('defaults to 20 results when maxResults is not specified', () => {
    const results = findMatchingItems(ITEMS, {});
    expect(results).toHaveLength(ITEMS.length);
  });

  it('returns fewer than maxResults if not enough items exist', () => {
    const results = findMatchingItems(ITEMS, {}, { maxResults: 100 });
    expect(results).toHaveLength(ITEMS.length);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Variants
// ─────────────────────────────────────────────────────────────────────────────

describe('findMatchingItems — variants', () => {
  it('items without customization groups have exactly one variant', () => {
    const results = findMatchingItems(ITEMS, { calories: 400 });
    results.forEach((r) => expect(r.variants).toHaveLength(1));
  });

  it('each result exposes bestVariant as a shortcut for variants[0]', () => {
    const [result] = findMatchingItems(ITEMS, { calories: 500 });
    expect(result.bestVariant).toBe(result.variants[0]);
  });

  it('generates multiple variants for items with required customization groups', () => {
    const itemWithGroups: MenuItem = {
      id: 'custom-item',
      restaurantSlug: 'test',
      name: 'Custom Item',
      category: 'Test',
      baseMacros: { calories: 300, protein: 20, carbs: 30, fat: 8 },
      customizationGroups: [
        {
          id: 'size',
          name: 'Size',
          type: 'single',
          required: true,
          options: [
            { id: 'small', name: 'Small', macroDelta: {} },
            { id: 'large', name: 'Large', macroDelta: { calories: 200, protein: 15, carbs: 20, fat: 8 } },
          ],
        },
      ],
    };

    const results = findMatchingItems([itemWithGroups], { calories: 400 }, { maxVariants: 3 });
    expect(results[0].variants.length).toBeGreaterThan(1);
  });

  it('selects the best optional customization to match the target', () => {
    // Base: 300 cal. Optional protein: +100 cal (+20g protein). Target: 400 cal, 40g protein.
    // The algorithm should pick the protein option to get closer to target.
    const itemWithOptional: MenuItem = {
      id: 'opt-item',
      restaurantSlug: 'test',
      name: 'Optional Protein Item',
      category: 'Test',
      baseMacros: { calories: 300, protein: 20, carbs: 30, fat: 8 },
      customizationGroups: [
        {
          id: 'protein',
          name: 'Protein',
          type: 'single',
          required: false,
          options: [
            { id: 'chicken', name: 'Chicken', macroDelta: { calories: 100, protein: 20 } },
          ],
        },
      ],
    };

    const targets: MacroTargets = { calories: 400, protein: 40 };
    const [result] = findMatchingItems([itemWithOptional], targets);
    expect(result.bestVariant.selectedOptions['protein']).toContain('chicken');
    expect(result.bestVariant.computedMacros.calories).toBe(400);
    expect(result.bestVariant.computedMacros.protein).toBe(40);
  });

  it('skips an optional group when skipping produces a better match', () => {
    // Base: 400 cal. Optional sauce: +100 cal. Target: 400 cal exactly.
    // Algorithm should skip sauce.
    const itemWithSauce: MenuItem = {
      id: 'sauce-item',
      restaurantSlug: 'test',
      name: 'Saucy Item',
      category: 'Test',
      baseMacros: { calories: 400, protein: 30, carbs: 40, fat: 10 },
      customizationGroups: [
        {
          id: 'sauce',
          name: 'Sauce',
          type: 'single',
          required: false,
          options: [
            { id: 'mayo', name: 'Mayo', macroDelta: { calories: 100, fat: 10 } },
          ],
        },
      ],
    };

    const [result] = findMatchingItems([itemWithSauce], { calories: 400 });
    expect(result.bestVariant.selectedOptions['sauce'] ?? []).toHaveLength(0);
    expect(result.bestVariant.computedMacros.calories).toBe(400);
  });
});
