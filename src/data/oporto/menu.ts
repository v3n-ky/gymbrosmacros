import { MenuItem } from '@/types/menu';

const sizeGroup = {
  id: 'oporto-size',
  name: 'Size',
  type: 'single' as const,
  required: true,
  defaultOptionId: 'oporto-size-regular',
  options: [
    {
      id: 'oporto-size-regular',
      name: 'Regular',
      macroDelta: {},
      isDefault: true,
    },
    {
      id: 'oporto-size-junior',
      name: 'Junior',
      macroDelta: { calories: -150, protein: -10, carbs: -14, fat: -8 },
    },
  ],
};

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
    id: 'oporto-bondi-burger',
    restaurantSlug: 'oporto',
    name: 'Bondi Burger',
    category: 'Burgers',
    baseMacros: { calories: 520, protein: 28, carbs: 42, fat: 24 },
    isPopular: true,
    customizationGroups: [sizeGroup, extrasGroup, sauceGroup],
  },
  {
    id: 'oporto-double-bondi-burger',
    restaurantSlug: 'oporto',
    name: 'Double Bondi Burger',
    category: 'Burgers',
    baseMacros: { calories: 720, protein: 44, carbs: 44, fat: 38 },
    tags: ['high-protein'],
    customizationGroups: [sizeGroup, extrasGroup, sauceGroup],
  },
  {
    id: 'oporto-chicken-rappa',
    restaurantSlug: 'oporto',
    name: 'Chicken Rappa',
    category: 'Wraps',
    baseMacros: { calories: 480, protein: 26, carbs: 48, fat: 18 },
    customizationGroups: [extrasGroup, sauceGroup],
  },
  {
    id: 'oporto-grilled-chicken-rappa',
    restaurantSlug: 'oporto',
    name: 'Grilled Chicken Rappa',
    category: 'Wraps',
    baseMacros: { calories: 420, protein: 30, carbs: 44, fat: 14 },
    isPopular: true,
    tags: ['high-protein'],
    customizationGroups: [extrasGroup, sauceGroup],
  },
  {
    id: 'oporto-pulled-chicken-bowl',
    restaurantSlug: 'oporto',
    name: 'Pulled Chicken Bowl',
    category: 'Bowls',
    baseMacros: { calories: 510, protein: 36, carbs: 52, fat: 16 },
    tags: ['high-protein'],
    customizationGroups: [extrasGroup, sauceGroup],
  },
  {
    id: 'oporto-grilled-chicken-bowl',
    restaurantSlug: 'oporto',
    name: 'Grilled Chicken Bowl',
    category: 'Bowls',
    baseMacros: { calories: 480, protein: 38, carbs: 48, fat: 14 },
    tags: ['high-protein'],
    customizationGroups: [extrasGroup, sauceGroup],
  },
  {
    id: 'oporto-original-chilli-chicken-burger',
    restaurantSlug: 'oporto',
    name: 'Original Chilli Chicken Burger',
    category: 'Burgers',
    baseMacros: { calories: 560, protein: 30, carbs: 46, fat: 26 },
    tags: ['high-protein'],
    customizationGroups: [sizeGroup, extrasGroup, sauceGroup],
  },
  {
    id: 'oporto-chicken-tenders-5pc',
    restaurantSlug: 'oporto',
    name: 'Oporto Chicken Tenders (5pc)',
    category: 'Sides',
    baseMacros: { calories: 440, protein: 32, carbs: 28, fat: 22 },
    tags: ['high-protein'],
    customizationGroups: [sauceGroup],
  },
];
