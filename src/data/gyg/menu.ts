import type { MenuItem } from '@/types/menu';

// Source: GYG Allergen, Ingredient & Nutritional Information Guide, December 5, 2025
// All baseMacros = Mild (standard heat), Regular size, as listed in PDF.
// Column order: Serve Size (g) | kJ | Cal | Protein (g) | Total Fat (g) | Sat Fat (g) | Carbs (g) | Sugars (g) | Fibre (g) | Sodium (mg)
// Spicy delta (burrito/bowl): +17 cal, +0.3g P, +2.2g C, +0.7g F
// Spicy delta (1 soft taco): +8 cal, +0.2g P, +1.0g C, +0.3g F

// ─── RICE GROUPS ─────────────────────────────────────────────────────────────
// Burrito swap White → Brown: -14 cal, -0.5g P, -5.2g C, +0.8g F
const riceGroupBurrito = {
  id: 'gyg-rice',
  name: 'Rice',
  type: 'single' as const,
  required: false,
  defaultOptionId: 'gyg-rice-white',
  options: [
    { id: 'gyg-rice-white', name: 'White Rice', macroDelta: {}, isDefault: true },
    {
      id: 'gyg-rice-brown',
      name: 'Brown Rice',
      // PDF (Burrito): -14 cal, -0.5g P, -5.2g C, +0.8g F
      macroDelta: { calories: -14, protein: -1, carbs: -5, fat: 1 },
    },
  ],
};

// Bowl swap White → Brown: -22 cal, -0.8g P, -8.1g C, +1.2g F
const riceGroupBowl = {
  id: 'gyg-rice',
  name: 'Rice',
  type: 'single' as const,
  required: false,
  defaultOptionId: 'gyg-rice-white',
  options: [
    { id: 'gyg-rice-white', name: 'White Rice', macroDelta: {}, isDefault: true },
    {
      id: 'gyg-rice-brown',
      name: 'Brown Rice',
      // PDF (Bowl): -22 cal, -0.8g P, -8.1g C, +1.2g F
      macroDelta: { calories: -22, protein: -1, carbs: -8, fat: 1 },
    },
  ],
};

// ─── BEAN GROUP ──────────────────────────────────────────────────────────────
// PDF p.17: "Swap Black Beans for Pinto Beans" = +35 cal, +2.8g P, +1.0g C, +0.7g F
const beanGroup = {
  id: 'gyg-beans',
  name: 'Beans',
  type: 'single' as const,
  required: false,
  defaultOptionId: 'gyg-beans-black',
  options: [
    { id: 'gyg-beans-black', name: 'Black Beans', macroDelta: {}, isDefault: true },
    {
      id: 'gyg-beans-pinto',
      name: 'Pinto Beans',
      // PDF: +35 cal, +2.8g P, +1.0g C, +0.7g F
      macroDelta: { calories: 35, protein: 3, carbs: 1, fat: 1 },
    },
  ],
};

// ─── HEAT GROUPS ─────────────────────────────────────────────────────────────
// Burrito/Bowl spicy delta (PDF p.17): +17 cal, +0.3g P, +2.2g C, +0.7g F
const heatGroupLarge = {
  id: 'gyg-heat',
  name: 'Heat',
  type: 'single' as const,
  required: false,
  defaultOptionId: 'gyg-heat-mild',
  options: [
    { id: 'gyg-heat-mild', name: 'Mild', macroDelta: {}, isDefault: true },
    {
      id: 'gyg-heat-spicy',
      name: 'Spicy',
      // PDF: +17 cal, +0.3g P, +2.2g C, +0.7g F
      macroDelta: { calories: 17, carbs: 2, fat: 1 },
    },
  ],
};

// Taco spicy delta (PDF p.20): +8 cal, +0.2g P, +1.0g C, +0.3g F (per 1 taco)
const heatGroupTaco = {
  id: 'gyg-heat',
  name: 'Heat',
  type: 'single' as const,
  required: false,
  defaultOptionId: 'gyg-heat-mild',
  options: [
    { id: 'gyg-heat-mild', name: 'Mild', macroDelta: {}, isDefault: true },
    {
      id: 'gyg-heat-spicy',
      name: 'Spicy',
      // PDF: +8 cal, +1.0g C (per 1 taco)
      macroDelta: { calories: 8, carbs: 1 },
    },
  ],
};

// ─── SHELL GROUP (Tacos) ──────────────────────────────────────────────────────
// Soft Flour Taco is default. Hard shell delta vs soft (PDF p.20/21):
// Grilled Chicken: soft 192 cal vs hard 186 cal → -6 cal, -1g P, -2g C, +1g F
const shellGroupTaco = {
  id: 'gyg-shell',
  name: 'Shell',
  type: 'single' as const,
  required: false,
  defaultOptionId: 'gyg-shell-soft',
  options: [
    { id: 'gyg-shell-soft', name: 'Soft Flour', macroDelta: {}, isDefault: true },
    {
      id: 'gyg-shell-hard',
      name: 'Hard Shell',
      // PDF: hard vs soft = -6 cal, -1g P, -2.4g C, +0.6g F (consistent across fillings)
      macroDelta: { calories: -6, protein: -1, carbs: -2, fat: 1 },
    },
  ],
};

// ─── EXTRAS ──────────────────────────────────────────────────────────────────
// PDF p.23-24: "Extras – Reg Burritos, Bowls & Salads"
const extrasGroup = {
  id: 'gyg-extras',
  name: 'Extras',
  type: 'multi' as const,
  required: false,
  options: [
    // ── Extra Proteins ──
    {
      id: 'gyg-extra-chicken',
      name: 'Extra Chicken',
      // PDF: Mild Grilled Chicken (100g) = 144 cal, 27.2g P, 0.7g C, 3.5g F
      macroDelta: { calories: 144, protein: 27, carbs: 1, fat: 4 },
    },
    {
      id: 'gyg-extra-ground-beef',
      name: 'Extra Ground Beef',
      // PDF: Mild Ground Beef (100g) = 199 cal, 15.6g P, 3.6g C, 13.5g F
      macroDelta: { calories: 199, protein: 16, carbs: 4, fat: 14 },
    },
    {
      id: 'gyg-extra-pulled-pork',
      name: 'Extra Pulled Pork',
      // PDF: Mild Pulled Pork (100g) = 235 cal, 25.5g P, 0.8g C, 14.5g F
      macroDelta: { calories: 235, protein: 26, carbs: 1, fat: 15 },
    },
    {
      id: 'gyg-extra-beef-brisket',
      name: 'Extra Beef Brisket',
      // PDF: Mild Shredded Beef Brisket (100g) = 177 cal, 27.4g P, 0.3g C, 7.3g F
      macroDelta: { calories: 177, protein: 27, fat: 7 },
    },
    // ── Toppings ──
    {
      id: 'gyg-extra-guacamole',
      name: 'Guacamole',
      // PDF: Guacamole (70g) = 126 cal, 1.2g P, 0.5g C, 13.2g F
      macroDelta: { calories: 126, protein: 1, fat: 13, fibre: 1 },
    },
    {
      id: 'gyg-extra-queso',
      name: 'Queso',
      // PDF: Queso Mild (80g) = 100 cal, 6.2g P, 2.0g C, 7.6g F
      macroDelta: { calories: 100, protein: 6, carbs: 2, fat: 8 },
    },
    {
      id: 'gyg-extra-sour-cream',
      name: 'Sour Cream',
      // PDF: Sour Cream side (87g) = 163 cal — as burrito add-on (~30g): approx 56 cal, 6g F, 1g C
      macroDelta: { calories: 56, fat: 6, carbs: 1 },
    },
    {
      id: 'gyg-extra-cheese',
      name: 'Cheese',
      // Approximate — not listed as standalone extra in PDF
      macroDelta: { calories: 50, protein: 3, fat: 4 },
    },
    {
      id: 'gyg-extra-corn',
      name: 'Seasoned Corn',
      // PDF: Seasoned Corn (60g) = 72 cal, 1.9g P, 11.9g C, 1.4g F
      macroDelta: { calories: 72, protein: 2, carbs: 12, fat: 1 },
    },
    {
      id: 'gyg-extra-jalapenos',
      name: 'Jalapeños',
      // PDF: Pickled Jalapeños (18g) = 4 cal
      macroDelta: { calories: 5 },
    },
  ],
};

// ─── REMOVAL GROUP (Burritos & Bowls) ────────────────────────────────────────
// Cheese is a standard component in GYG burritos and bowls.
// These negative-delta options let the algorithm (and the user) explicitly remove it.
const removalGroup = {
  id: 'gyg-remove',
  name: 'Remove',
  type: 'multi' as const,
  required: false,
  options: [
    {
      id: 'gyg-no-cheese',
      name: 'No Cheese',
      // Inverse of the extras cheese addition (approximate — not in PDF standalone)
      macroDelta: { calories: -50, protein: -3, fat: -4 },
    },
  ],
};

// ─── SIZE GROUP (Burritos) ────────────────────────────────────────────────────
// Little G's Grilled Chicken Burrito = 414 cal, 24.8g P, 46.1g C, 14.1g F
// vs Regular = 773 cal, 48.3g P, 91.0g C, 23.5g F → delta ≈ -359 cal, -23g P, -45g C, -10g F
const sizeGroupBurrito = {
  id: 'gyg-size',
  name: "Size",
  type: 'single' as const,
  required: false,
  defaultOptionId: 'gyg-size-regular',
  options: [
    { id: 'gyg-size-regular', name: 'Regular', macroDelta: {}, isDefault: true },
    {
      id: 'gyg-size-kids',
      name: "Little G's (Kids)",
      // PDF: Little G's Grilled Chicken Burrito vs Regular delta
      macroDelta: { calories: -359, protein: -23, carbs: -45, fat: -10 },
    },
  ],
};

export const gygMenu: MenuItem[] = [
  // ── BURRITOS ──────────────────────────────────────────────────────────────
  {
    id: 'gyg-chicken-burrito',
    restaurantSlug: 'gyg',
    name: 'Chicken Burrito',
    category: 'Burritos',
    description: 'Grilled chicken, white rice, black beans, tomatillo salsa, cheese, pico de gallo. Flour tortilla.',
    // PDF: Mild Grilled Chicken Burrito (Regular) = 773 cal, 48.3g P, 91.0g C, 23.5g F
    baseMacros: { calories: 773, protein: 48, carbs: 91, fat: 24, sodium: 1950 },
    servingSize: 'Regular burrito (480g)',
    isPopular: true,
    tags: ['high-protein', 'contains-meat', 'chicken'],
    customizationGroups: [sizeGroupBurrito, heatGroupLarge, riceGroupBurrito, beanGroup, extrasGroup, removalGroup],
  },
  {
    id: 'gyg-ground-beef-burrito',
    restaurantSlug: 'gyg',
    name: 'Ground Beef Burrito',
    category: 'Burritos',
    description: 'Seasoned ground beef, white rice, black beans, tomatillo salsa, cheese, pico de gallo. Flour tortilla.',
    // PDF: Mild Ground Beef Burrito (Regular) = 828 cal, 36.7g P, 93.9g C, 33.5g F
    baseMacros: { calories: 828, protein: 37, carbs: 94, fat: 34, sodium: 1950 },
    servingSize: 'Regular burrito (480g)',
    tags: ['high-protein', 'contains-meat', 'beef'],
    customizationGroups: [sizeGroupBurrito, heatGroupLarge, riceGroupBurrito, beanGroup, extrasGroup, removalGroup],
  },
  {
    id: 'gyg-pulled-pork-burrito',
    restaurantSlug: 'gyg',
    name: 'Pulled Pork Burrito',
    category: 'Burritos',
    description: 'Slow-cooked pulled pork, white rice, black beans, tomatillo salsa, cheese, pico de gallo. Flour tortilla.',
    // PDF: Mild Pulled Pork Burrito (Regular) = 759 cal, 42.1g P, 90.4g C, 24.9g F
    baseMacros: { calories: 759, protein: 42, carbs: 90, fat: 25, sodium: 2030 },
    servingSize: 'Regular burrito (480g)',
    tags: ['high-protein', 'contains-meat', 'pork'],
    customizationGroups: [sizeGroupBurrito, heatGroupLarge, riceGroupBurrito, beanGroup, extrasGroup, removalGroup],
  },
  {
    id: 'gyg-beef-brisket-burrito',
    restaurantSlug: 'gyg',
    name: 'Shredded Beef Brisket Burrito',
    category: 'Burritos',
    description: 'Shredded beef brisket, white rice, black beans, tomatillo salsa, cheese, pico de gallo. Flour tortilla.',
    // PDF: Mild Shredded Beef Brisket Burrito (Regular) = 806 cal, 48.5g P, 90.6g C, 27.3g F
    baseMacros: { calories: 806, protein: 49, carbs: 91, fat: 27, sodium: 1930 },
    servingSize: 'Regular burrito (480g)',
    tags: ['high-protein', 'contains-meat', 'beef'],
    customizationGroups: [sizeGroupBurrito, heatGroupLarge, riceGroupBurrito, beanGroup, extrasGroup, removalGroup],
  },
  {
    id: 'gyg-veggie-burrito',
    restaurantSlug: 'gyg',
    name: 'Sautéed Veg & Guac Burrito',
    category: 'Burritos',
    description: 'Sautéed vegetables with guacamole, white rice, black beans, tomatillo salsa, cheese, pico de gallo. Flour tortilla.',
    // PDF: Mild Sautéed Vegetables with Guacamole Burrito (Regular) = 808 cal, 24.0g P, 96.7g C, 35.2g F
    baseMacros: { calories: 808, protein: 24, carbs: 97, fat: 35, sodium: 1930 },
    servingSize: 'Regular burrito (550g)',
    tags: ['vegetarian', 'vegan'],
    customizationGroups: [sizeGroupBurrito, heatGroupLarge, riceGroupBurrito, beanGroup, extrasGroup, removalGroup],
  },

  // ── BOWLS ─────────────────────────────────────────────────────────────────
  {
    id: 'gyg-grilled-chicken-bowl',
    restaurantSlug: 'gyg',
    name: 'Grilled Chicken Bowl',
    category: 'Bowls',
    description: 'Grilled chicken over white rice and black beans with tomatillo salsa, cheese, pico de gallo.',
    // PDF: Mild Grilled Chicken Bowl (Regular) = 659 cal, 43.8g P, 74.1g C, 20.5g F
    baseMacros: { calories: 659, protein: 44, carbs: 74, fat: 21, sodium: 1700 },
    servingSize: 'Regular bowl (455g)',
    isPopular: true,
    tags: ['high-protein', 'contains-meat', 'chicken'],
    customizationGroups: [heatGroupLarge, riceGroupBowl, beanGroup, extrasGroup, removalGroup],
  },
  {
    id: 'gyg-ground-beef-bowl',
    restaurantSlug: 'gyg',
    name: 'Ground Beef Bowl',
    category: 'Bowls',
    description: 'Seasoned ground beef over white rice and black beans with tomatillo salsa, cheese, pico de gallo.',
    // PDF: Mild Ground Beef Bowl (Regular) = 714 cal, 32.2g P, 77.0g C, 30.5g F
    baseMacros: { calories: 714, protein: 32, carbs: 77, fat: 31, sodium: 1690 },
    servingSize: 'Regular bowl (455g)',
    tags: ['high-protein', 'contains-meat', 'beef'],
    customizationGroups: [heatGroupLarge, riceGroupBowl, beanGroup, extrasGroup, removalGroup],
  },
  {
    id: 'gyg-pulled-pork-bowl',
    restaurantSlug: 'gyg',
    name: 'Pulled Pork Bowl',
    category: 'Bowls',
    description: 'Slow-cooked pulled pork over white rice and black beans with tomatillo salsa, cheese, pico de gallo.',
    // PDF: Mild Pulled Pork Bowl (Regular) = 645 cal, 37.6g P, 73.5g C, 21.9g F
    baseMacros: { calories: 645, protein: 38, carbs: 74, fat: 22, sodium: 1770 },
    servingSize: 'Regular bowl (455g)',
    tags: ['high-protein', 'contains-meat', 'pork'],
    customizationGroups: [heatGroupLarge, riceGroupBowl, beanGroup, extrasGroup, removalGroup],
  },
  {
    id: 'gyg-beef-brisket-bowl',
    restaurantSlug: 'gyg',
    name: 'Shredded Beef Brisket Bowl',
    category: 'Bowls',
    description: 'Shredded beef brisket over white rice and black beans with tomatillo salsa, cheese, pico de gallo.',
    // PDF: Mild Shredded Beef Brisket Bowl (Regular) = 692 cal, 44.0g P, 73.7g C, 24.3g F
    baseMacros: { calories: 692, protein: 44, carbs: 74, fat: 24, sodium: 1680 },
    servingSize: 'Regular bowl (455g)',
    tags: ['high-protein', 'contains-meat', 'beef'],
    customizationGroups: [heatGroupLarge, riceGroupBowl, beanGroup, extrasGroup, removalGroup],
  },
  {
    id: 'gyg-veggie-bowl',
    restaurantSlug: 'gyg',
    name: 'Sautéed Veg & Guac Bowl',
    category: 'Bowls',
    description: 'Sautéed vegetables with guacamole over white rice and black beans with tomatillo salsa, cheese, pico de gallo.',
    // PDF: Mild Sautéed Vegetables with Guacamole Bowl (Regular) = 694 cal, 19.5g P, 79.8g C, 32.2g F
    baseMacros: { calories: 694, protein: 20, carbs: 80, fat: 32, sodium: 1670 },
    servingSize: 'Regular bowl (525g)',
    tags: ['vegetarian', 'vegan'],
    customizationGroups: [heatGroupLarge, riceGroupBowl, beanGroup, extrasGroup, removalGroup],
  },

  // ── TACOS ─────────────────────────────────────────────────────────────────
  {
    id: 'gyg-chicken-taco',
    restaurantSlug: 'gyg',
    name: 'Chicken Taco',
    category: 'Tacos',
    description: 'Grilled chicken, tomatillo salsa, cheese, pico de gallo. Soft flour tortilla (1 taco).',
    // PDF: Soft Flour Taco – Mild Grilled Chicken (1 taco) = 192 cal, 15.8g P, 15.6g C, 7.1g F
    baseMacros: { calories: 192, protein: 16, carbs: 16, fat: 7, sodium: 472 },
    servingSize: '1 taco (118g)',
    tags: ['contains-meat', 'chicken'],
    customizationGroups: [heatGroupTaco, shellGroupTaco, extrasGroup],
  },
  {
    id: 'gyg-beef-taco',
    restaurantSlug: 'gyg',
    name: 'Ground Beef Taco',
    category: 'Tacos',
    description: 'Seasoned ground beef, tomatillo salsa, cheese, pico de gallo. Soft flour tortilla (1 taco).',
    // PDF: Soft Flour Taco – Mild Ground Beef (1 taco) = 214 cal, 11.2g P, 16.7g C, 11.1g F
    baseMacros: { calories: 214, protein: 11, carbs: 17, fat: 11, sodium: 470 },
    servingSize: '1 taco (118g)',
    tags: ['contains-meat', 'beef'],
    customizationGroups: [heatGroupTaco, shellGroupTaco, extrasGroup],
  },

  // ── NACHOS ────────────────────────────────────────────────────────────────
  {
    id: 'gyg-chicken-nachos',
    restaurantSlug: 'gyg',
    name: 'Chicken Nachos',
    category: 'Nachos',
    description: 'Corn chips loaded with grilled chicken, queso, pico de gallo, tomatillo salsa, cheese.',
    // PDF: Mild Grilled Chicken Nachos = 1110 cal, 52.3g P, 77.7g C, 64.3g F
    baseMacros: { calories: 1110, protein: 52, carbs: 78, fat: 64, sodium: 1840 },
    servingSize: 'Regular (500g)',
    tags: ['high-protein', 'contains-meat', 'chicken'],
    customizationGroups: [heatGroupLarge, extrasGroup],
  },
  {
    id: 'gyg-beef-nachos',
    restaurantSlug: 'gyg',
    name: 'Ground Beef Nachos',
    category: 'Nachos',
    description: 'Corn chips loaded with seasoned ground beef, queso, pico de gallo, tomatillo salsa, cheese.',
    // PDF: Mild Ground Beef Nachos = 1160 cal, 40.7g P, 80.6g C, 74.3g F
    baseMacros: { calories: 1160, protein: 41, carbs: 81, fat: 74, sodium: 1840 },
    servingSize: 'Regular (500g)',
    tags: ['contains-meat', 'beef'],
    customizationGroups: [heatGroupLarge, extrasGroup],
  },
];
