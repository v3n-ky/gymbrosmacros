/**
 * Source: Grill'd ordering API — api.digital.grilld.com.au/v1/restaurants/94/menu/{id}?orderType=106
 * Verified: March 2026
 * Baseline: Traditional (Hi Fibre Lo GI) Bun, default toppings, no extras
 * Tolerance: ±5 kcal / ±1g macros (API returns 1 d.p.)
 *
 * Bun deltas derived from API per-bun nutrition; averaged across 3–4 burgers.
 * Extras (cheese, bacon, avocado, extra patty) kJ = 0 in API — kept as estimates.
 * Note: Grill'd does NOT offer patty swaps on beef burgers — chicken/plant items
 *       are separate menu items. PATTY_GROUP is approximate and kept for UX only.
 */

import { MenuItem } from '@/types/menu';

const BUN_GROUP = {
  id: 'bun',
  name: 'Bun',
  type: 'single' as const,
  required: true,
  defaultOptionId: 'bun-traditional',
  options: [
    {
      id: 'bun-traditional',
      name: 'Traditional Bun',
      macroDelta: {},
      isDefault: true,
    },
    {
      // Low Carb SuperBun: +41 kcal / +3g P / +12g F / -19g C (API average across 4 burgers)
      id: 'bun-low-carb',
      name: 'Low Carb SuperBun',
      macroDelta: { calories: 41, protein: 3, fat: 12, carbs: -19 },
    },
    {
      // Gluten Free: +120 kcal / -1g P / +5g F / +17g C (API average across 3 burgers)
      id: 'bun-gluten-free',
      name: 'Gluten Free Bun',
      macroDelta: { calories: 120, protein: -1, fat: 5, carbs: 17 },
    },
    {
      // No Bun: -160 kcal / -5g P / -5g F / -21g C (API average across 3 burgers)
      id: 'bun-no-bun',
      name: 'No Bun',
      macroDelta: { calories: -160, protein: -5, fat: -5, carbs: -21 },
    },
  ],
};

const PATTY_GROUP = {
  id: 'patty',
  name: 'Patty',
  type: 'single' as const,
  required: true,
  defaultOptionId: 'patty-beef',
  options: [
    {
      id: 'patty-beef',
      name: 'Beef',
      macroDelta: {},
      isDefault: true,
    },
    {
      // Approximate: Grill'd chicken burgers are separate menu items.
      // Delta estimated by comparing Zen Hen vs Simply Grill'd on Traditional Bun.
      id: 'patty-chicken',
      name: 'Chicken',
      macroDelta: { calories: -110, protein: 15, fat: -13, carbs: 1 },
    },
    {
      // Approximate: based on Garden Goodness vs Simply Grill'd on Traditional Bun.
      id: 'patty-plant-based',
      name: 'Plant-Based',
      macroDelta: { calories: -108, protein: -11, carbs: 20, fat: -8 },
    },
  ],
};

const EXTRAS_GROUP = {
  id: 'extras',
  name: 'Extras',
  type: 'multi' as const,
  required: false,
  options: [
    {
      // kJ not exposed in API — estimate from standard nutrition databases
      id: 'extra-patty',
      name: 'Extra Patty',
      macroDelta: { calories: 250, protein: 20, fat: 16 },
    },
    {
      id: 'extra-bacon',
      name: 'Bacon',
      macroDelta: { calories: 100, protein: 7, fat: 8 },
    },
    {
      id: 'extra-avocado',
      name: 'Avocado',
      macroDelta: { calories: 70, fat: 6 },
    },
    {
      id: 'extra-cheese',
      name: 'Tasty Cheese',
      macroDelta: { calories: 60, protein: 4, fat: 5 },
    },
  ],
};

const BURGER_CUSTOMIZATIONS = [BUN_GROUP, PATTY_GROUP, EXTRAS_GROUP];

export const grilldMenu: MenuItem[] = [
  {
    // API id: 201 (Zen Hen) — closest plain grilled chicken burger on menu
    id: 'grilld-simply-grilled-chicken',
    restaurantSlug: 'grilld',
    name: 'Zen Hen',
    category: 'Burgers',
    baseMacros: { calories: 488, protein: 43, carbs: 32, fat: 20 },
    isPopular: true,
    tags: ['high-protein', 'contains-meat', 'chicken', 'gluten-free-option'],
    customizationGroups: BURGER_CUSTOMIZATIONS,
  },
  {
    // API id: 101
    id: 'grilld-crispy-bacon-cheese',
    restaurantSlug: 'grilld',
    name: 'Crispy Bacon & Cheese',
    category: 'Burgers',
    baseMacros: { calories: 631, protein: 30, carbs: 31, fat: 35 },
    tags: ['high-protein', 'contains-meat', 'beef', 'pork', 'gluten-free-option'],
    customizationGroups: BURGER_CUSTOMIZATIONS,
  },
  {
    // API id: 400
    id: 'grilld-garden-goodness',
    restaurantSlug: 'grilld',
    name: 'Garden Goodness',
    category: 'Burgers',
    baseMacros: { calories: 490, protein: 17, carbs: 50, fat: 25 },
    tags: ['vegetarian', 'gluten-free-option'],
    customizationGroups: BURGER_CUSTOMIZATIONS,
  },
  {
    // API id: 1000630 (Almighty) — closest premium beef burger
    id: 'grilld-beefy-deluxe',
    restaurantSlug: 'grilld',
    name: 'Almighty',
    category: 'Burgers',
    baseMacros: { calories: 705, protein: 36, carbs: 36, fat: 39 },
    isPopular: true,
    tags: ['high-protein', 'contains-meat', 'beef', 'gluten-free-option'],
    customizationGroups: BURGER_CUSTOMIZATIONS,
  },
  {
    // API id: 200
    id: 'grilld-sweet-chilli-chicken',
    restaurantSlug: 'grilld',
    name: 'Sweet Chilli Chicken',
    category: 'Burgers',
    baseMacros: { calories: 483, protein: 42, carbs: 38, fat: 17 },
    tags: ['high-protein', 'contains-meat', 'chicken', 'gluten-free-option'],
    customizationGroups: BURGER_CUSTOMIZATIONS,
  },
  {
    // API id: 700
    id: 'grilld-healthy-chicken-caesar-salad',
    restaurantSlug: 'grilld',
    name: 'Chicken Caesar Salad',
    category: 'Salads',
    baseMacros: { calories: 576, protein: 51, carbs: 15, fat: 34 },
    tags: ['high-protein', 'contains-meat', 'chicken'],
  },
  {
    // API id: 715
    id: 'grilld-super-greens-salad',
    restaurantSlug: 'grilld',
    name: 'Superpower Salad',
    category: 'Salads',
    baseMacros: { calories: 459, protein: 42, carbs: 22, fat: 22 },
    tags: ['high-protein', 'contains-meat', 'chicken'],
  },
  {
    // API id: 3302
    id: 'grilld-sweet-potato-fries',
    restaurantSlug: 'grilld',
    name: 'Sweet Potato Chips',
    category: 'Sides',
    baseMacros: { calories: 540, protein: 5, carbs: 67, fat: 26 },
    tags: ['vegetarian', 'vegan', 'gluten-free-option'],
  },
  {
    // API id: 2000
    id: 'grilld-herbed-chips',
    restaurantSlug: 'grilld',
    name: 'Famous Grill\'d Chips',
    category: 'Sides',
    baseMacros: { calories: 588, protein: 4, carbs: 70, fat: 28 },
    tags: ['vegetarian', 'vegan', 'gluten-free-option'],
  },
];
