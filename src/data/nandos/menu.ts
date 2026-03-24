import { MenuItem } from '@/types/menu';

// Source: Nando's Australia website (nandos.com.au), verified March 2026
// Per-serve values as listed on the website (kcal, macros in grams, sodium in mg).
// Spice level (Lemon & Herb → Extra Hot) does not meaningfully change macro values.

// ─── SPICE LEVEL ─────────────────────────────────────────────────────────────
// Applied to all PERi-PERi marinated items. Macro delta is negligible.
const SPICE_LEVEL_GROUP = {
  id: 'nandos-spice',
  name: 'Spice Level',
  type: 'single' as const,
  required: true,
  defaultOptionId: 'nandos-spice-lemon-herb',
  options: [
    { id: 'nandos-spice-lemon-herb',  name: 'Lemon & Herb', macroDelta: {}, isDefault: true },
    { id: 'nandos-spice-medium',      name: 'Medium',       macroDelta: {} },
    { id: 'nandos-spice-hot',         name: 'Hot',          macroDelta: {} },
    { id: 'nandos-spice-extra-hot',   name: 'Extra Hot',    macroDelta: {} },
  ],
};

// ─── EXTRAS ──────────────────────────────────────────────────────────────────
// Approximate add-on values — not listed as standalone add-ons on the website.
const EXTRAS_GROUP = {
  id: 'nandos-extras',
  name: 'Extras',
  type: 'multi' as const,
  required: false,
  options: [
    {
      id: 'nandos-extra-chicken',
      name: 'Extra Tenders',
      // ~2 extra tenders based on 4-tender serving (220 cal / 40g protein)
      macroDelta: { calories: 110, protein: 20, fat: 4 },
    },
    {
      id: 'nandos-extra-halloumi',
      name: 'Halloumi',
      // Small halloumi add-on (approx, based on Halloumi Sticks side data)
      macroDelta: { calories: 120, protein: 8, fat: 9 },
    },
    {
      id: 'nandos-extra-avocado',
      name: 'Avocado',
      macroDelta: { calories: 70, fat: 6 },
    },
    {
      id: 'nandos-extra-cheese',
      name: 'Cheese',
      macroDelta: { calories: 50, protein: 3, fat: 4 },
    },
    {
      id: 'nandos-extra-peri-drizzle',
      name: 'PERi-PERi Drizzle',
      macroDelta: { calories: 30, fat: 3 },
    },
  ],
};

export const nandosMenu: MenuItem[] = [
  // ── CHICKEN ───────────────────────────────────────────────────────────────

  {
    id: 'nandos-half-chicken',
    restaurantSlug: 'nandos',
    name: 'Half PERi-PERi Chicken',
    category: 'Chicken',
    description: 'Half chicken marinated in PERi-PERi. Choose your spice level.',
    // Website: 460g serve — 715 kcal, 108g P, 30.8g F, 1.1g C, 2010mg Na
    baseMacros: { calories: 715, protein: 108, carbs: 1, fat: 31, sodium: 2010 },
    servingSize: '460g',
    isPopular: true,
    tags: ['high-protein', 'contains-meat', 'chicken', 'gluten-free-option'],
    customizationGroups: [SPICE_LEVEL_GROUP, EXTRAS_GROUP],
  },
  {
    id: 'nandos-whole-chicken',
    restaurantSlug: 'nandos',
    name: 'Whole PERi-PERi Chicken',
    category: 'Chicken',
    description: 'Whole chicken marinated in PERi-PERi. Choose your spice level.',
    // Website: 889g serve — 1380 kcal, 208g P, 59.7g F, 2.2g C, 3890mg Na
    baseMacros: { calories: 1380, protein: 208, carbs: 2, fat: 60, sodium: 3890 },
    servingSize: '889g',
    tags: ['high-protein', 'contains-meat', 'chicken', 'gluten-free-option'],
    customizationGroups: [SPICE_LEVEL_GROUP],
  },
  {
    id: 'nandos-tenders-4pc',
    restaurantSlug: 'nandos',
    name: '4 PERi-PERi Grilled Tenders',
    category: 'Chicken',
    description: 'Four PERi-PERi marinated chicken breast tenders. Choose your spice level.',
    // Website: 160g serve — 220 kcal, 39.6g P, 6.5g F, 0.7g C, 949mg Na
    baseMacros: { calories: 220, protein: 40, carbs: 1, fat: 7, sodium: 949 },
    servingSize: '160g (4 pieces)',
    isPopular: true,
    tags: ['high-protein', 'contains-meat', 'chicken', 'gluten-free-option'],
    customizationGroups: [SPICE_LEVEL_GROUP],
  },
  {
    id: 'nandos-bbq-chicken-ribs',
    restaurantSlug: 'nandos',
    name: 'BBQ Chicken Ribs',
    category: 'Chicken',
    description: 'Four PERi-PERi BBQ chicken ribs.',
    // Website: 128g serve (4 ribs) — 297 kcal, 29.6g P, 18g F, 4.4g C, 922mg Na
    baseMacros: { calories: 297, protein: 30, carbs: 4, fat: 18, sodium: 922 },
    servingSize: '128g (4 ribs)',
    tags: ['high-protein', 'contains-meat', 'chicken', 'gluten-free-option'],
    customizationGroups: [SPICE_LEVEL_GROUP],
  },

  // ── WRAPS & BURGERS ───────────────────────────────────────────────────────

  {
    id: 'nandos-perinaise-classic',
    restaurantSlug: 'nandos',
    name: 'PERinaise Classic',
    category: 'Wraps & Burgers',
    description: 'Grilled chicken breast with PERinaise, lettuce and tomato.',
    // Website: 259g serve — 496 kcal, 41g P, 16.9g F, 42.5g C, 971mg Na
    baseMacros: { calories: 496, protein: 41, carbs: 43, fat: 17, sugar: 6, sodium: 971 },
    isPopular: true,
    tags: ['high-protein', 'contains-meat', 'chicken'],
    customizationGroups: [SPICE_LEVEL_GROUP, EXTRAS_GROUP],
  },
  {
    id: 'nandos-supremo',
    restaurantSlug: 'nandos',
    name: 'Supremo',
    category: 'Wraps & Burgers',
    description: 'Grilled chicken, halloumi, avocado, Portuguese roll.',
    // Website: 332g serve — 648 kcal, 41.9g P, 28.9g F, 52.5g C, 1450mg Na
    baseMacros: { calories: 648, protein: 42, carbs: 53, fat: 29, sugar: 12, sodium: 1450 },
    tags: ['contains-meat', 'chicken'],
    customizationGroups: [SPICE_LEVEL_GROUP, EXTRAS_GROUP],
  },
  {
    id: 'nandos-avo-goodness',
    restaurantSlug: 'nandos',
    name: 'Avo Goodness',
    category: 'Wraps & Burgers',
    description: 'Grilled chicken, avocado, lettuce, tomato, PERinaise. Wrap.',
    // Website: 333g serve — 568 kcal, 38.4g P, 21.5g F, 52.4g C, 1330mg Na
    baseMacros: { calories: 568, protein: 38, carbs: 52, fat: 22, sugar: 12, sodium: 1330 },
    tags: ['contains-meat', 'chicken'],
    customizationGroups: [SPICE_LEVEL_GROUP, EXTRAS_GROUP],
  },
  {
    id: 'nandos-the-halloumi',
    restaurantSlug: 'nandos',
    name: 'The Halloumi',
    category: 'Wraps & Burgers',
    description: 'Grilled halloumi, PERinaise, lettuce, tomato, red onion. Pita.',
    // Website: 283g serve — 599 kcal, 40.1g P, 24.7g F, 53.9g C, 1630mg Na
    baseMacros: { calories: 599, protein: 40, carbs: 54, fat: 25, sugar: 13, sodium: 1630 },
    tags: ['vegetarian', 'contains-dairy'],
    customizationGroups: [EXTRAS_GROUP],
  },
  {
    id: 'nandos-double-cheese-bacon',
    restaurantSlug: 'nandos',
    name: 'Double Cheese & Bacon',
    category: 'Wraps & Burgers',
    description: 'Double chicken breast, double cheese, bacon, PERinaise. Portuguese roll.',
    // Website: 327g serve — 667 kcal, 47.2g P, 31.4g F, 48.4g C, 1700mg Na
    baseMacros: { calories: 667, protein: 47, carbs: 48, fat: 31, sugar: 10, sodium: 1700 },
    tags: ['contains-meat', 'chicken'],
    customizationGroups: [SPICE_LEVEL_GROUP],
  },

  // ── SALADS & BOWLS ────────────────────────────────────────────────────────

  {
    id: 'nandos-mediterranean-salad',
    restaurantSlug: 'nandos',
    name: 'Mediterranean Salad with Chicken',
    category: 'Salads & Bowls',
    description: 'Mixed greens, olives, feta, roasted peppers, cucumber, tomato with 3 grilled tenders.',
    // Website: 485g serve (3 tenders) — 581 kcal, 37.8g P, 35g F, 15.3g C, 1880mg Na
    baseMacros: { calories: 581, protein: 38, carbs: 15, fat: 35, sugar: 12, sodium: 1880 },
    tags: ['contains-meat', 'chicken', 'gluten-free-option'],
    customizationGroups: [SPICE_LEVEL_GROUP],
  },
  {
    id: 'nandos-paella',
    restaurantSlug: 'nandos',
    name: 'Paella',
    category: 'Salads & Bowls',
    description: 'Saffron rice, chicken, chorizo, peas, capsicum.',
    // Website: 395g serve — 557 kcal, 31g P, 10g F, 81.9g C, 1390mg Na
    baseMacros: { calories: 557, protein: 31, carbs: 82, fat: 10, sugar: 8, sodium: 1390 },
    tags: ['contains-meat', 'chicken'],
  },
  {
    id: 'nandos-peri-harvest-bowl',
    restaurantSlug: 'nandos',
    name: 'PERi-Harvest Bowl',
    category: 'Salads & Bowls',
    description: 'Roasted seasonal vegetables, grains, feta, tahini dressing.',
    // Website: 382g serve — 421 kcal, 9.9g P, 22.6g F, 26.7g C, 526mg Na
    baseMacros: { calories: 421, protein: 10, carbs: 27, fat: 23, sugar: 16, sodium: 526 },
    tags: ['vegetarian', 'gluten-free-option'],
  },

  // ── SIDES ─────────────────────────────────────────────────────────────────

  {
    id: 'nandos-peri-peri-chips-regular',
    restaurantSlug: 'nandos',
    name: 'PERi-PERi Chips (Regular)',
    category: 'Sides',
    // Website: 140g — 326 kcal, 5.4g P, 13g F, 44.7g C, 716mg Na
    baseMacros: { calories: 326, protein: 5, carbs: 45, fat: 13, sugar: 1, sodium: 716 },
    servingSize: '140g',
    isPopular: true,
    tags: ['vegan', 'vegetarian', 'gluten-free-option'],
  },
  {
    id: 'nandos-halloumi-sticks',
    restaurantSlug: 'nandos',
    name: 'Halloumi Sticks & Dip',
    category: 'Sides',
    // Website: 127g — 360 kcal, 17.6g P, 25.5g F, 14.7g C, 1080mg Na
    baseMacros: { calories: 360, protein: 18, carbs: 15, fat: 26, sugar: 12, sodium: 1080 },
    servingSize: '127g',
    tags: ['vegetarian', 'contains-dairy'],
  },
  {
    id: 'nandos-grain-salad',
    restaurantSlug: 'nandos',
    name: 'Grain Salad',
    category: 'Sides',
    // Website: 220g — 221 kcal, 7.5g P, 6.3g F, 19.1g C, 184mg Na
    baseMacros: { calories: 221, protein: 8, carbs: 19, fat: 6, sugar: 6, sodium: 184 },
    servingSize: '220g',
    tags: ['vegan', 'vegetarian'],
  },
  {
    id: 'nandos-roasted-broccoli',
    restaurantSlug: 'nandos',
    name: 'Roasted Broccoli with PERi-Crackle',
    category: 'Sides',
    // Website: 175g — 339 kcal, 11.4g P, 30.3g F, 3.2g C, 611mg Na
    baseMacros: { calories: 339, protein: 11, carbs: 3, fat: 30, sugar: 2, sodium: 611 },
    servingSize: '175g',
    tags: ['vegan', 'vegetarian', 'gluten-free-option'],
  },
];
