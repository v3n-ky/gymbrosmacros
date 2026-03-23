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
      macroDelta: { calories: 100, fat: 11 },
    },
    {
      id: 'sauce-sweet-onion',
      name: 'Sweet Onion',
      macroDelta: { calories: 40, carbs: 9 },
    },
    {
      id: 'sauce-mustard',
      name: 'Mustard',
      macroDelta: { calories: 5 },
    },
    {
      id: 'sauce-bbq',
      name: 'BBQ',
      macroDelta: { calories: 30, carbs: 7 },
    },
    {
      id: 'sauce-ranch',
      name: 'Ranch',
      macroDelta: { calories: 110, fat: 12 },
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
    baseMacros: { calories: 468, protein: 32, carbs: 58, fat: 10 },
    servingSize: '6-inch sub',
    isPopular: true,
    tags: ['high-protein'],
    customizationGroups: SHARED_CUSTOMIZATIONS,
  },
  {
    id: 'subway-turkey-breast',
    restaurantSlug: 'subway',
    name: 'Turkey Breast',
    category: 'Classic Subs',
    description: '6-inch sub with sliced turkey breast, lettuce, tomato, and cucumber on Italian White bread.',
    baseMacros: { calories: 380, protein: 26, carbs: 56, fat: 5 },
    servingSize: '6-inch sub',
    isPopular: true,
    tags: [],
    customizationGroups: SHARED_CUSTOMIZATIONS,
  },
  {
    id: 'subway-roast-beef',
    restaurantSlug: 'subway',
    name: 'Roast Beef',
    category: 'Classic Subs',
    description: '6-inch sub with seasoned roast beef, lettuce, tomato, and onion on Italian White bread.',
    baseMacros: { calories: 410, protein: 28, carbs: 56, fat: 8 },
    servingSize: '6-inch sub',
    tags: ['high-protein'],
    customizationGroups: SHARED_CUSTOMIZATIONS,
  },
  {
    id: 'subway-veggie-delite',
    restaurantSlug: 'subway',
    name: 'Veggie Delite',
    category: 'Classic Subs',
    description: '6-inch sub loaded with fresh lettuce, tomato, cucumber, capsicum, and onion on Italian White bread.',
    baseMacros: { calories: 310, protein: 12, carbs: 56, fat: 4 },
    servingSize: '6-inch sub',
    tags: [],
    customizationGroups: SHARED_CUSTOMIZATIONS,
  },
  {
    id: 'subway-italian-bmt',
    restaurantSlug: 'subway',
    name: 'Italian BMT',
    category: 'Classic Subs',
    description: '6-inch sub with pepperoni, salami, and ham on Italian White bread.',
    baseMacros: { calories: 480, protein: 24, carbs: 56, fat: 20 },
    servingSize: '6-inch sub',
    tags: [],
    customizationGroups: SHARED_CUSTOMIZATIONS,
  },
  {
    id: 'subway-chicken-schnitzel',
    restaurantSlug: 'subway',
    name: 'Chicken Schnitzel',
    category: 'Signature Subs',
    description: '6-inch sub with crispy chicken schnitzel, lettuce, and tomato on Italian White bread.',
    baseMacros: { calories: 520, protein: 28, carbs: 64, fat: 16 },
    servingSize: '6-inch sub',
    tags: ['high-protein'],
    customizationGroups: SHARED_CUSTOMIZATIONS,
  },
  {
    id: 'subway-meatball-marinara',
    restaurantSlug: 'subway',
    name: 'Meatball Marinara',
    category: 'Classic Subs',
    description: '6-inch sub with Italian-style meatballs smothered in marinara sauce on Italian White bread.',
    baseMacros: { calories: 530, protein: 24, carbs: 62, fat: 20 },
    servingSize: '6-inch sub',
    tags: [],
    customizationGroups: SHARED_CUSTOMIZATIONS,
  },
  {
    id: 'subway-steak-and-cheese',
    restaurantSlug: 'subway',
    name: 'Steak & Cheese',
    category: 'Signature Subs',
    description: '6-inch sub with seasoned steak strips and melted cheese on Italian White bread.',
    baseMacros: { calories: 460, protein: 30, carbs: 56, fat: 14 },
    servingSize: '6-inch sub',
    tags: ['high-protein'],
    customizationGroups: SHARED_CUSTOMIZATIONS,
  },
];
