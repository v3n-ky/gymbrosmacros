import { MenuItem } from '@/types/menu';

const BREAD_GROUP = {
  id: 'bread',
  name: 'Bread',
  type: 'single' as const,
  required: true,
  defaultOptionId: 'bread-italian-white',
  options: [
    {
      id: 'bread-italian-white',
      name: 'Italian White',
      macroDelta: {},
      isDefault: true,
    },
    {
      id: 'bread-wholemeal',
      name: 'Wholemeal',
      macroDelta: { calories: -10, fibre: 3 },
    },
    {
      id: 'bread-herbs-cheese',
      name: 'Italian Herbs & Cheese',
      macroDelta: { calories: 40, fat: 3, carbs: 4 },
    },
    {
      id: 'bread-multigrain',
      name: 'Multigrain',
      macroDelta: { calories: -5, fibre: 4 },
    },
  ],
};

const SIZE_GROUP = {
  id: 'size',
  name: 'Size',
  type: 'single' as const,
  required: true,
  defaultOptionId: 'size-6inch',
  options: [
    {
      id: 'size-6inch',
      name: '6-inch',
      macroDelta: {},
      isDefault: true,
    },
    {
      id: 'size-footlong',
      name: 'Footlong',
      macroDelta: { calories: 430, protein: 26, carbs: 57, fat: 12 },
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
      id: 'extra-double-meat',
      name: 'Double Meat',
      macroDelta: { calories: 120, protein: 18, fat: 3 },
      tags: ['contains-meat'],
    },
    {
      id: 'extra-cheese',
      name: 'Cheese',
      macroDelta: { calories: 40, protein: 2, fat: 3 },
    },
    {
      id: 'extra-avocado',
      name: 'Avocado',
      macroDelta: { calories: 70, fat: 6, fibre: 2 },
    },
  ],
};

const SAUCE_GROUP = {
  id: 'sauce',
  name: 'Sauce',
  type: 'multi' as const,
  required: false,
  maxSelections: 2,
  options: [
    {
      id: 'sauce-mayo',
      name: 'Mayo',
      // PDF: 15g serve = 44 cal, 4.6g fat, 0.6g carbs
      macroDelta: { calories: 44, fat: 5 },
    },
    {
      id: 'sauce-sweet-onion',
      name: 'Sweet Onion',
      // PDF: 21g serve = 39 cal, 9.1g carbs
      macroDelta: { calories: 39, carbs: 9 },
    },
    {
      id: 'sauce-mustard',
      name: 'Mustard',
      // PDF: Honey Mustard 21g = 30 cal, 6.5g carbs
      macroDelta: { calories: 5 },
    },
    {
      id: 'sauce-bbq',
      name: 'BBQ',
      // PDF: Smoky BBQ 21g = 36 cal, 8.4g carbs
      macroDelta: { calories: 36, carbs: 8 },
    },
    {
      id: 'sauce-ranch',
      name: 'Ranch',
      // PDF: Ranch Dressing 21g = 69 cal, 7.2g fat, 0.9g carbs
      macroDelta: { calories: 69, fat: 7 },
    },
  ],
};

const SHARED_CUSTOMIZATIONS = [BREAD_GROUP, SIZE_GROUP, EXTRAS_GROUP, SAUCE_GROUP];

export const subwayMenu: MenuItem[] = [
  {
    id: 'subway-chicken-teriyaki',
    restaurantSlug: 'subway',
    name: 'Chicken Teriyaki',
    category: 'Classic Subs',
    description: '6-inch sub with teriyaki-glazed chicken, lettuce, tomato, and onion on Italian White bread.',
    // PDF: Sweet Onion Chicken Teriyaki on white bread = 396 cal, 25.3g P, 54.5g C, 8.0g F
    baseMacros: { calories: 396, protein: 25, carbs: 55, fat: 8 },
    servingSize: '6-inch sub',
    isPopular: true,
    tags: ['high-protein', 'contains-meat', 'chicken'],
    customizationGroups: SHARED_CUSTOMIZATIONS,
  },
  {
    id: 'subway-turkey-breast',
    restaurantSlug: 'subway',
    name: 'Turkey Breast',
    category: 'Classic Subs',
    description: '6-inch sub with sliced turkey breast, lettuce, tomato, and cucumber on Italian White bread.',
    // PDF: Turkey on Rye = 394 cal, 23.9g P, 47.7g C, 10.7g F (on malted rye)
    // On Italian White basis: subtract rye delta (+49 cal, +3P, +3C, +2F)
    baseMacros: { calories: 345, protein: 21, carbs: 45, fat: 8 },
    servingSize: '6-inch sub',
    isPopular: true,
    tags: ['contains-meat'],
    customizationGroups: SHARED_CUSTOMIZATIONS,
  },
  {
    id: 'subway-veggie-delite',
    restaurantSlug: 'subway',
    name: 'Veggie Delite',
    category: 'Classic Subs',
    description: '6-inch sub loaded with fresh lettuce, tomato, cucumber, capsicum, and onion on Italian White bread.',
    // PDF: Veggie Delite with Avo on malted rye = 377 cal, 16.1g P, 44.5g C, 14.7g F
    // On Italian White basis (no avo): subtract rye delta (+49 cal) AND avo delta (+70 cal, +6g fat)
    // 377 − 49 − 70 = 258 cal; 14.7 − 2 (rye) − 6 (avo) = 6.7g fat → rounded 7g fat
    baseMacros: { calories: 258, protein: 13, carbs: 42, fat: 7 },
    servingSize: '6-inch sub',
    tags: ['vegan', 'vegetarian'],
    customizationGroups: SHARED_CUSTOMIZATIONS,
  },
  {
    id: 'subway-italian-bmt',
    restaurantSlug: 'subway',
    name: 'Italian BMT',
    category: 'Classic Subs',
    description: '6-inch sub with pepperoni, salami, and ham on Italian White bread.',
    // PDF: Italian BMT on Italian H&C bread = 506 cal, 24.6g P, 42.5g C, 25.8g F
    // On Italian White basis: subtract IH&C delta (+39 cal, +2P, +2C, +2F)
    baseMacros: { calories: 467, protein: 23, carbs: 40, fat: 24 },
    servingSize: '6-inch sub',
    tags: ['contains-meat', 'pork', 'beef'],
    customizationGroups: SHARED_CUSTOMIZATIONS,
  },
  {
    id: 'subway-chicken-schnitzel',
    restaurantSlug: 'subway',
    name: 'Chicken Schnitzel',
    category: 'Signature Subs',
    description: '6-inch sub with crispy chicken schnitzel, lettuce, and tomato on Italian White bread.',
    // PDF: Chicken Schnitzel on Italian H&C bread = 538 cal, 29.9g P, 49.5g C, 23.6g F
    // On Italian White basis: subtract IH&C delta (+39 cal, +2P, +2C, +2F)
    baseMacros: { calories: 499, protein: 28, carbs: 47, fat: 22 },
    servingSize: '6-inch sub',
    tags: ['high-protein', 'contains-meat', 'chicken'],
    customizationGroups: SHARED_CUSTOMIZATIONS,
  },
  {
    id: 'subway-meatball-marinara',
    restaurantSlug: 'subway',
    name: 'Meatball Marinara',
    category: 'Classic Subs',
    description: '6-inch sub with Italian-style meatballs smothered in marinara sauce on Italian White bread.',
    // PDF: Italian Meatball on Italian H&C bread = 561 cal, 24.0g P, 51.8g C, 28.4g F
    // On Italian White basis: subtract IH&C delta (+39 cal, +2P, +2C, +2F)
    baseMacros: { calories: 522, protein: 22, carbs: 50, fat: 26 },
    servingSize: '6-inch sub',
    tags: ['contains-meat', 'beef'],
    customizationGroups: SHARED_CUSTOMIZATIONS,
  },
];
