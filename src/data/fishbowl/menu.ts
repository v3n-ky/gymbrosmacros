import { MenuItem } from '@/types/menu';

// Source: Fishbowl Nutritional Overview, Dec 2025
// All pre-built bowls served with Brown Rice & Cabbage base (Regular size as baseMacros)

// Size upgrade — adds a larger portion of all components
const SIZE_GROUP = {
  id: 'fb-size',
  name: 'Size',
  type: 'single' as const,
  required: true,
  defaultOptionId: 'fb-size-regular',
  options: [
    {
      id: 'fb-size-regular',
      name: 'Regular',
      macroDelta: {},
      isDefault: true,
    },
    {
      id: 'fb-size-large',
      name: 'Large',
      // Average delta across all bowls (Regular → Large)
      macroDelta: { calories: 175, protein: 10, fat: 11, carbs: 9 },
    },
  ],
};

// Base options for Build Your Own Bowl (choose 1 or 2)
// Deltas relative to Brown Rice & Cabbage base (Regular: 111 Cal, 3.1g P, <1g F, 21.5g C)
// halfAndHalf: when 2 bases selected, each delta is halved (50/50 split)
const BASE_GROUP = {
  id: 'fb-base',
  name: 'Base',
  type: 'multi' as const,
  required: true,
  maxSelections: 2,
  halfAndHalf: true,
  defaultOptionId: 'fb-base-brown-rice-cabbage',
  options: [
    {
      id: 'fb-base-brown-rice-cabbage',
      name: 'Brown Rice & Cabbage',
      macroDelta: {},
      isDefault: true,
    },
    {
      id: 'fb-base-sushi-rice',
      name: 'Sushi Rice',
      // 179 Cal, 3.3g P, <1g F, 39.6g C (swap from 111 Cal base)
      macroDelta: { calories: 68, carbs: 18 },
    },
    {
      id: 'fb-base-brown-rice',
      name: 'Brown Rice',
      // 199 Cal, 4.9g P, 1.3g F, 40.2g C
      macroDelta: { calories: 88, protein: 2, fat: 1, carbs: 19 },
    },
    {
      id: 'fb-base-cabbage',
      name: 'Cabbage',
      // 22 Cal, 1.3g P, <1g F, 2.8g C
      macroDelta: { calories: -89, protein: -2, carbs: -19 },
    },
    {
      id: 'fb-base-mixed-leaves',
      name: 'Mixed Leaves',
      // <10 Cal, <1g all macros
      macroDelta: { calories: -101, protein: -3, carbs: -21 },
    },
    {
      id: 'fb-base-glass-noodles',
      name: 'Glass Noodles',
      // 235 Cal, 5.0g P, <1g F, 52.2g C
      macroDelta: { calories: 124, protein: 2, carbs: 31 },
    },
  ],
};

// Proteins for Build Your Own Bowl
const PROTEIN_GROUP = {
  id: 'fb-protein',
  name: 'Protein',
  type: 'single' as const,
  required: false,
  defaultOptionId: 'fb-protein-chicken',
  options: [
    {
      id: 'fb-protein-chicken',
      name: 'Poached Chicken',
      macroDelta: { calories: 84, protein: 18, fat: 1 },
      isDefault: true,
    },
    {
      id: 'fb-protein-salmon-sashimi',
      name: 'Salmon Sashimi',
      macroDelta: { calories: 140, protein: 12, fat: 10 },
    },
    {
      id: 'fb-protein-tofu',
      name: 'Roasted Tofu',
      macroDelta: { calories: 136, protein: 10, fat: 10 },
    },
    {
      id: 'fb-protein-miso-salmon',
      name: 'Miso Glazed Salmon Fillet',
      macroDelta: { calories: 266, protein: 20, fat: 16, carbs: 10 },
    },
    {
      id: 'fb-protein-beef-brisket',
      name: 'Beef Brisket',
      macroDelta: { calories: 178, protein: 24, fat: 8, carbs: 1 },
    },
    {
      id: 'fb-protein-miso-eggplant',
      name: 'Miso Glazed Eggplant',
      macroDelta: { calories: 90, protein: 3, fat: 1, carbs: 13 },
    },
  ],
};

// Dressings — choose 1 or 2
const DRESSING_GROUP = {
  id: 'fb-dressing',
  name: 'Dressing',
  type: 'multi' as const,
  required: false,
  maxSelections: 2,
  options: [
    {
      id: 'fb-dressing-lime-cashew',
      name: 'Lime Cashew',
      macroDelta: { calories: 133, fat: 12, carbs: 7 },
    },
    {
      id: 'fb-dressing-thai-green-goddess',
      name: 'Thai Green Goddess',
      macroDelta: { calories: 75, fat: 7, carbs: 2 },
    },
    {
      id: 'fb-dressing-red-hot-chilli',
      name: 'Red Hot Chilli',
      macroDelta: { calories: 120, fat: 10, carbs: 6 },
    },
    {
      id: 'fb-dressing-lemon-olive-oil',
      name: 'Lemon Olive Oil',
      macroDelta: { calories: 154, fat: 16 },
    },
    {
      id: 'fb-dressing-wasabi-mayo',
      name: 'Wasabi Mayo',
      macroDelta: { calories: 145, fat: 15, carbs: 2 },
    },
    {
      id: 'fb-dressing-tamari-ponzu',
      name: 'Tamari Ponzu',
      macroDelta: { calories: 126, fat: 11, carbs: 6 },
    },
    {
      id: 'fb-dressing-roasted-sesame',
      name: 'Roasted Sesame',
      macroDelta: { calories: 164, protein: 1, fat: 16, carbs: 4 },
    },
    {
      id: 'fb-dressing-spicy-sesame',
      name: 'Spicy Sesame',
      macroDelta: { calories: 164, protein: 1, fat: 16, carbs: 4 },
    },
  ],
};

// Extra protein — same portions as PROTEIN_GROUP, can add on top of (or instead of) base protein
const EXTRA_PROTEIN_GROUP = {
  id: 'fb-extra-protein',
  name: 'Extra Protein',
  type: 'multi' as const,
  required: false,
  options: [
    {
      id: 'fb-xp-chicken',
      name: 'Poached Chicken',
      macroDelta: { calories: 84, protein: 18, fat: 1 },
    },
    {
      id: 'fb-xp-salmon-sashimi',
      name: 'Salmon Sashimi',
      macroDelta: { calories: 140, protein: 12, fat: 10 },
    },
    {
      id: 'fb-xp-tofu',
      name: 'Roasted Tofu',
      macroDelta: { calories: 136, protein: 10, fat: 10 },
    },
    {
      id: 'fb-xp-miso-salmon',
      name: 'Miso Glazed Salmon Fillet',
      macroDelta: { calories: 266, protein: 20, fat: 16, carbs: 10 },
    },
    {
      id: 'fb-xp-beef-brisket',
      name: 'Beef Brisket',
      macroDelta: { calories: 178, protein: 24, fat: 8, carbs: 1 },
    },
    {
      id: 'fb-xp-miso-eggplant',
      name: 'Miso Glazed Eggplant',
      macroDelta: { calories: 90, protein: 3, fat: 1, carbs: 13 },
    },
  ],
};

// Add-on extras — toppings, veggie add-ons, crunch
// Macros approximate where not listed in PDF
const EXTRAS_GROUP = {
  id: 'fb-extras',
  name: 'Extras',
  type: 'multi' as const,
  required: false,
  options: [
    // ── Toppings ──
    {
      id: 'fb-extra-avocado',
      name: 'Avocado',
      macroDelta: { calories: 69, fat: 7 },
    },
    {
      id: 'fb-extra-seaweed-salad',
      name: 'Seaweed Salad',
      macroDelta: { calories: 58, fat: 2, carbs: 9 },
    },
    {
      id: 'fb-extra-wasabi-mayo-drizzle',
      name: 'Wasabi Mayo Drizzle',
      macroDelta: { calories: 73, fat: 8, carbs: 1 },
    },
    // ── Extra Veggie ──
    {
      id: 'fb-extra-edamame',
      name: 'Edamame',
      // ~70g serve: approx 70 cal, 6g protein, 5g carbs, 3g fat
      macroDelta: { calories: 70, protein: 6, fat: 3, carbs: 5 },
    },
    {
      id: 'fb-extra-kale',
      name: 'Kale',
      // Small handful: approx 15 cal, 1g protein, 2g carbs
      macroDelta: { calories: 15, protein: 1, carbs: 2 },
    },
    // ── Extra Crunch ──
    {
      id: 'fb-extra-tamari-almonds',
      name: 'Tamari Almonds',
      // ~15g serve: approx 90 cal, 3g protein, 8g fat, 3g carbs
      macroDelta: { calories: 90, protein: 3, fat: 8, carbs: 3 },
    },
    {
      id: 'fb-extra-umami-cashew-crunch',
      name: 'Umami Cashew Crunch',
      // ~20g serve: approx 120 cal, 3g protein, 10g fat, 7g carbs
      macroDelta: { calories: 120, protein: 3, fat: 10, carbs: 7 },
    },
    {
      id: 'fb-extra-wasabi-peas',
      name: 'Wasabi Peas',
      // ~15g serve: approx 60 cal, 2g protein, 2g fat, 9g carbs
      macroDelta: { calories: 60, protein: 2, fat: 2, carbs: 9 },
    },
    {
      id: 'fb-extra-crispy-shallots',
      name: 'Crispy Shallots',
      // ~10g serve: approx 45 cal, 1g protein, 3g fat, 5g carbs
      macroDelta: { calories: 45, protein: 1, fat: 3, carbs: 5 },
    },
  ],
};

// Pre-built bowls: size + base swap + extra protein + extras
// NOTE: Dressing swap is not tracked for prebuilt bowls because the bowl's
// baseMacros already include a specific dressing — swapping would require
// per-bowl dressing delta tracking. Add extras/base accurately.
const PREBUILT_CUSTOMIZATIONS = [SIZE_GROUP, BASE_GROUP, EXTRA_PROTEIN_GROUP, EXTRAS_GROUP];

export const fishbowlMenu: MenuItem[] = [
  // ── NEW ARRIVALS / HOUSE FAVOURITES ────────────────────────────────────────
  {
    id: 'fishbowl-lime-light-chicken',
    restaurantSlug: 'fishbowl',
    name: 'Lime Light Chicken',
    category: 'House Favourites',
    description: 'Poached chicken, bok choy, carrot, cucumber, coriander, mint, lime cashew dressing, pickled daikon. Brown rice & cabbage base.',
    baseMacros: { calories: 516, protein: 27, carbs: 43, fat: 24, sodium: 984 },
    servingSize: 'Regular bowl',
    isPopular: true,
    tags: ['high-protein', 'contains-meat', 'chicken'],
    customizationGroups: PREBUILT_CUSTOMIZATIONS,
  },
  {
    id: 'fishbowl-heat-check-chicken',
    restaurantSlug: 'fishbowl',
    name: 'Heat Check Chicken',
    category: 'House Favourites',
    description: 'Poached chicken, cabbage, carrot, edamame, shallots, coriander, red hot chilli dressing, pickled sesame. Brown rice & cabbage base.',
    baseMacros: { calories: 508, protein: 28, carbs: 47, fat: 20, sodium: 1510 },
    servingSize: 'Regular bowl',
    tags: ['high-protein', 'contains-meat', 'chicken'],
    customizationGroups: PREBUILT_CUSTOMIZATIONS,
  },
  {
    id: 'fishbowl-green-dream-chicken',
    restaurantSlug: 'fishbowl',
    name: 'Green Dream Chicken',
    category: 'House Favourites',
    description: 'Poached chicken, kale, spicy broccoli, cucumber, edamame, red onion, thai green goddess dressing, pickled ginger. Brown rice & cabbage base.',
    baseMacros: { calories: 499, protein: 32, carbs: 37, fat: 23, sodium: 1210 },
    servingSize: 'Regular bowl',
    isPopular: true,
    tags: ['high-protein', 'contains-meat', 'chicken'],
    customizationGroups: PREBUILT_CUSTOMIZATIONS,
  },
  {
    id: 'fishbowl-salmon-og',
    restaurantSlug: 'fishbowl',
    name: 'Salmon O.G.',
    category: 'House Favourites',
    description: 'Salmon sashimi, kale, beets, edamame, red onion, roasted sesame dressing, seaweed salad, crispy shallots, tobiko. Brown rice & cabbage base.',
    baseMacros: { calories: 609, protein: 23, carbs: 51, fat: 33, sodium: 975 },
    servingSize: 'Regular bowl',
    isPopular: true,
    tags: ['high-protein', 'contains-fish'],
    customizationGroups: PREBUILT_CUSTOMIZATIONS,
  },
  {
    id: 'fishbowl-chicken-og',
    restaurantSlug: 'fishbowl',
    name: 'Chicken O.G.',
    category: 'House Favourites',
    description: 'Poached chicken, kale, beets, edamame, red onion, roasted sesame dressing, seaweed salad, crispy shallots. Brown rice & cabbage base.',
    baseMacros: { calories: 553, protein: 29, carbs: 51, fat: 24, sodium: 989 },
    servingSize: 'Regular bowl',
    tags: ['high-protein', 'contains-meat', 'chicken'],
    customizationGroups: PREBUILT_CUSTOMIZATIONS,
  },
  {
    id: 'fishbowl-tofu-og',
    restaurantSlug: 'fishbowl',
    name: 'Roasted Tofu O.G.',
    category: 'House Favourites',
    description: 'Roasted tofu, kale, beets, edamame, red onion, roasted sesame dressing, seaweed salad, crispy shallots. Brown rice & cabbage base.',
    baseMacros: { calories: 606, protein: 21, carbs: 52, fat: 33, sodium: 1100 },
    servingSize: 'Regular bowl',
    tags: ['vegan', 'vegetarian'],
    customizationGroups: PREBUILT_CUSTOMIZATIONS,
  },
  {
    id: 'fishbowl-chilli-chicken',
    restaurantSlug: 'fishbowl',
    name: 'Chilli Chicken',
    category: 'House Favourites',
    description: 'Poached chicken, kale, carrot, cucumber, spicy broccoli, radish, green chilli, spicy sesame dressing, umami cashew crunch. Brown rice & cabbage base.',
    baseMacros: { calories: 531, protein: 29, carbs: 36, fat: 27, sodium: 991 },
    servingSize: 'Regular bowl',
    tags: ['high-protein', 'contains-meat', 'chicken'],
    customizationGroups: PREBUILT_CUSTOMIZATIONS,
  },
  {
    id: 'fishbowl-tofu-boys',
    restaurantSlug: 'fishbowl',
    name: 'Tofu Boys',
    category: 'House Favourites',
    description: 'Roasted tofu, kale, carrot, cucumber, shallots, edamame, roasted sesame or lime cashew dressing, tamari almonds. Brown rice & cabbage base.',
    baseMacros: { calories: 643, protein: 23, carbs: 45, fat: 39, sodium: 1060 },
    servingSize: 'Regular bowl',
    tags: ['vegan', 'vegetarian'],
    customizationGroups: PREBUILT_CUSTOMIZATIONS,
  },

  // ── WARM BOWLS ─────────────────────────────────────────────────────────────
  {
    id: 'fishbowl-miso-salmon',
    restaurantSlug: 'fishbowl',
    name: 'Miso Salmon',
    category: 'Warm Bowls',
    description: 'Miso glazed salmon, cabbage, carrot, shallots, coriander, tamari ponzu dressing, tamari almonds. Brown rice & cabbage base.',
    baseMacros: { calories: 670, protein: 29, carbs: 48, fat: 37, sodium: 1670 },
    servingSize: 'Regular bowl',
    isPopular: true,
    tags: ['high-protein', 'contains-fish'],
    customizationGroups: PREBUILT_CUSTOMIZATIONS,
  },
  {
    id: 'fishbowl-braised-beef',
    restaurantSlug: 'fishbowl',
    name: 'Braised Beef',
    category: 'Warm Bowls',
    description: '5 spice beef brisket, kale, cucumber, sweet potato, red onion, tamari ponzu dressing, wasabi mayo drizzle, umami cashew crunch. Brown rice & cabbage base.',
    baseMacros: { calories: 678, protein: 35, carbs: 51, fat: 35, sodium: 1430 },
    servingSize: 'Regular bowl',
    isPopular: true,
    tags: ['high-protein', 'contains-meat', 'beef'],
    customizationGroups: PREBUILT_CUSTOMIZATIONS,
  },
  {
    id: 'fishbowl-spicy-salmon',
    restaurantSlug: 'fishbowl',
    name: 'Spicy Salmon',
    category: 'Warm Bowls',
    description: 'Miso glazed salmon, kale, spicy broccoli, red onion, radish, green chilli, spicy sesame dressing, wasabi mayo drizzle, wasabi peas. Brown rice & cabbage base.',
    baseMacros: { calories: 695, protein: 30, carbs: 49, fat: 40, sodium: 1890 },
    servingSize: 'Regular bowl',
    tags: ['high-protein', 'contains-fish'],
    customizationGroups: PREBUILT_CUSTOMIZATIONS,
  },
  {
    id: 'fishbowl-miso-eggplant',
    restaurantSlug: 'fishbowl',
    name: 'Miso Eggplant',
    category: 'Warm Bowls',
    description: 'Miso glazed eggplant, poached chicken or roasted tofu, kale, edamame, radish, red onion, lemon olive oil dressing. Brown rice & cabbage base.',
    baseMacros: { calories: 489, protein: 12, carbs: 52, fat: 22, sodium: 1730 },
    servingSize: 'Regular bowl',
    tags: ['vegan', 'vegetarian', 'gluten-free-option'],
    customizationGroups: PREBUILT_CUSTOMIZATIONS,
  },

  // ── STREET FOOD ────────────────────────────────────────────────────────────
  {
    id: 'fishbowl-lemon-chicken-box',
    restaurantSlug: 'fishbowl',
    name: 'Lemon Chicken Box',
    category: 'Street Food',
    baseMacros: { calories: 554, protein: 25, carbs: 44, fat: 29, sodium: 910 },
    tags: ['contains-meat', 'chicken'],
  },
  {
    id: 'fishbowl-miso-salmon-box',
    restaurantSlug: 'fishbowl',
    name: 'Miso Salmon Box',
    category: 'Street Food',
    baseMacros: { calories: 634, protein: 27, carbs: 53, fat: 33, sodium: 1480 },
    tags: ['contains-fish'],
  },
  {
    id: 'fishbowl-beef-brisket-box',
    restaurantSlug: 'fishbowl',
    name: 'Beef Brisket Box',
    category: 'Street Food',
    baseMacros: { calories: 545, protein: 32, carbs: 45, fat: 25, sodium: 1140 },
    tags: ['high-protein', 'contains-meat', 'beef'],
  },
  {
    id: 'fishbowl-tofu-box',
    restaurantSlug: 'fishbowl',
    name: 'Roasted Tofu Box',
    category: 'Street Food',
    baseMacros: { calories: 483, protein: 17, carbs: 46, fat: 24, sodium: 887 },
    tags: ['vegan', 'vegetarian'],
  },

  // ── BUILD YOUR OWN BOWL ────────────────────────────────────────────────────
  {
    id: 'fishbowl-build-your-own',
    restaurantSlug: 'fishbowl',
    name: 'Build Your Own Bowl',
    category: 'Build Your Own',
    description: 'Start with your choice of base (up to 2), add a protein, dressing and extras.',
    // baseMacros = Brown Rice & Cabbage base, Regular, no protein, no dressing
    baseMacros: { calories: 111, protein: 3, carbs: 22, fat: 1 },
    servingSize: 'Regular bowl (base only)',
    tags: [],
    customizationGroups: [SIZE_GROUP, BASE_GROUP, PROTEIN_GROUP, EXTRA_PROTEIN_GROUP, DRESSING_GROUP, EXTRAS_GROUP],
  },
];
