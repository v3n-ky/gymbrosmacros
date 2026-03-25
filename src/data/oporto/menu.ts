import { MenuItem } from '@/types/menu';

// ─────────────────────────────────────────────────────────────────────────────
// Calories are OFFICIAL from the Oporto ordering API (api.oporto.com.au /
// mobile-services/content/menu/{store}), sourced March 2026.
//
// Protein / carbs / fat are ESTIMATED — the existing ratios from prior data
// have been proportionally scaled to match the official calorie totals.
// Macro splits have NOT been independently verified from a third-party source.
// Display an "estimated macros" disclosure wherever P/C/F are shown for Oporto.
// ─────────────────────────────────────────────────────────────────────────────

const extrasGroup = {
  id: 'oporto-extras',
  name: 'Extras',
  type: 'multi' as const,
  required: false,
  options: [
    {
      id: 'oporto-extra-chicken',
      name: 'Extra Chicken',
      macroDelta: { calories: 100, protein: 16, fat: 4 },
      tags: ['contains-meat'],
    },
    {
      id: 'oporto-extra-cheese',
      name: 'Cheese',
      macroDelta: { calories: 50, protein: 3, fat: 4 },
    },
    {
      id: 'oporto-extra-bacon',
      name: 'Bacon',
      macroDelta: { calories: 80, protein: 6, fat: 6 },
      tags: ['contains-meat'],
    },
    {
      id: 'oporto-extra-avocado',
      name: 'Avocado',
      macroDelta: { calories: 70, fat: 6 },
    },
  ],
};

const sauceGroup = {
  id: 'oporto-sauce',
  name: 'Sauce',
  type: 'single' as const,
  required: false,
  defaultOptionId: 'oporto-sauce-original-chilli',
  options: [
    {
      id: 'oporto-sauce-original-chilli',
      name: 'Original Chilli',
      macroDelta: {},
      isDefault: true,
    },
    {
      id: 'oporto-sauce-lemon-herb',
      name: 'Lemon Herb',
      macroDelta: { calories: 10 },
    },
    {
      id: 'oporto-sauce-garlic-aioli',
      name: 'Garlic Aioli',
      macroDelta: { calories: 80, fat: 9 },
    },
  ],
};

export const oportoMenu: MenuItem[] = [
  {
    // Official: 535 cal / 2238 kJ (Single Bondi Burger)
    id: 'oporto-bondi-burger',
    restaurantSlug: 'oporto',
    name: 'Bondi Burger',
    category: 'Burgers',
    baseMacros: { calories: 535, protein: 30, carbs: 46, fat: 26 },
    isPopular: true,
    tags: ['contains-meat', 'chicken'],
    customizationGroups: [extrasGroup, sauceGroup],
  },
  {
    // Official: 696 cal / 2910 kJ (Double Bondi Burger)
    id: 'oporto-double-bondi-burger',
    restaurantSlug: 'oporto',
    name: 'Double Bondi Burger',
    category: 'Burgers',
    baseMacros: { calories: 696, protein: 44, carbs: 44, fat: 38 },
    tags: ['high-protein', 'contains-meat', 'chicken'],
    customizationGroups: [extrasGroup, sauceGroup],
  },
  {
    // Official: 719 cal / 3010 kJ (Portuguese Crispy Burger)
    // Previously listed as "Original Chilli Chicken Burger" — no longer on the
    // Oporto online menu under that name. Mapped to the Portuguese Crispy Burger
    // which is Oporto's current featured crispy chicken burger.
    id: 'oporto-portuguese-crispy-burger',
    restaurantSlug: 'oporto',
    name: 'Portuguese Crispy Burger',
    category: 'Burgers',
    baseMacros: { calories: 719, protein: 38, carbs: 59, fat: 33 },
    isPopular: true,
    tags: ['contains-meat', 'chicken'],
    customizationGroups: [extrasGroup, sauceGroup],
  },
  {
    // Official: 421 cal / 1760 kJ (Chicken Rappa)
    id: 'oporto-chicken-rappa',
    restaurantSlug: 'oporto',
    name: 'Chicken Rappa',
    category: 'Rappas',
    baseMacros: { calories: 421, protein: 23, carbs: 42, fat: 16 },
    tags: ['contains-meat', 'chicken'],
    customizationGroups: [extrasGroup, sauceGroup],
  },
  {
    // Official: 641 cal / 2680 kJ (Bondi Rappa — the grilled chicken rappa)
    // Previously called "Grilled Chicken Rappa". Now called "Bondi Rappa" on
    // the Oporto online menu.
    id: 'oporto-bondi-rappa',
    restaurantSlug: 'oporto',
    name: 'Bondi Rappa',
    category: 'Rappas',
    baseMacros: { calories: 641, protein: 46, carbs: 67, fat: 21 },
    isPopular: true,
    tags: ['high-protein', 'contains-meat', 'chicken'],
    customizationGroups: [extrasGroup, sauceGroup],
  },
  {
    // Official: 573 cal / 2399 kJ (Pulled Chicken Bowl)
    id: 'oporto-pulled-chicken-bowl',
    restaurantSlug: 'oporto',
    name: 'Pulled Chicken Bowl',
    category: 'Bowls',
    baseMacros: { calories: 573, protein: 42, carbs: 60, fat: 18 },
    tags: ['high-protein', 'contains-meat', 'chicken'],
    customizationGroups: [extrasGroup, sauceGroup],
  },
  {
    // Official: 526 cal / 2200 kJ (Chicken Salad Bowl)
    // Previously called "Grilled Chicken Bowl". Now called "Chicken Salad Bowl"
    // on the Oporto online menu.
    id: 'oporto-chicken-salad-bowl',
    restaurantSlug: 'oporto',
    name: 'Chicken Salad Bowl',
    category: 'Bowls',
    baseMacros: { calories: 526, protein: 43, carbs: 54, fat: 16 },
    tags: ['high-protein', 'contains-meat', 'chicken'],
    customizationGroups: [extrasGroup, sauceGroup],
  },
  {
    // Official: 240 cal / 1005 kJ (Chicken Tenders 4 Pack — grilled)
    // Note: Oporto sells a 4-pack of grilled chicken tenders, not a 5-pack.
    // Renamed from "Oporto Chicken Tenders (5pc)".
    id: 'oporto-chicken-tenders-4pc',
    restaurantSlug: 'oporto',
    name: 'Chicken Tenders (4pc)',
    category: 'Sides',
    baseMacros: { calories: 240, protein: 30, carbs: 8, fat: 9 },
    tags: ['high-protein', 'contains-meat', 'chicken'],
    customizationGroups: [sauceGroup],
  },
];
