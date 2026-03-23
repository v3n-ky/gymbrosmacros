import type { MenuItem } from '@/types/menu';

const sizeGroup = {
  id: 'gyg-size',
  name: 'Size',
  type: 'single' as const,
  required: true,
  defaultOptionId: 'gyg-size-regular',
  options: [
    {
      id: 'gyg-size-regular',
      name: 'Regular',
      macroDelta: {},
      isDefault: true,
    },
    {
      id: 'gyg-size-mini',
      name: 'Mini',
      macroDelta: { calories: -200, protein: -12, carbs: -22, fat: -8 },
    },
  ],
};

const extrasGroup = {
  id: 'gyg-extras',
  name: 'Extras',
  type: 'multi' as const,
  required: false,
  options: [
    {
      id: 'gyg-extra-chicken',
      name: 'Extra Chicken',
      macroDelta: { calories: 100, protein: 18, fat: 3 },
    },
    {
      id: 'gyg-extra-guacamole',
      name: 'Guacamole',
      macroDelta: { calories: 80, fat: 7, fibre: 2 },
    },
    {
      id: 'gyg-extra-sour-cream',
      name: 'Sour Cream',
      macroDelta: { calories: 60, fat: 6 },
    },
    {
      id: 'gyg-extra-cheese',
      name: 'Cheese',
      macroDelta: { calories: 50, protein: 3, fat: 4 },
    },
    {
      id: 'gyg-extra-jalapenos',
      name: 'Jalapeños',
      macroDelta: { calories: 5 },
    },
  ],
};

const riceGroup = {
  id: 'gyg-rice',
  name: 'Rice',
  type: 'single' as const,
  required: true,
  defaultOptionId: 'gyg-rice-white',
  options: [
    {
      id: 'gyg-rice-white',
      name: 'White Rice',
      macroDelta: {},
      isDefault: true,
    },
    {
      id: 'gyg-rice-brown',
      name: 'Brown Rice',
      macroDelta: { calories: -10, fibre: 3 },
    },
  ],
};

export const gygMenu: MenuItem[] = [
  {
    id: 'gyg-chicken-burrito',
    restaurantSlug: 'gyg',
    name: 'Chicken Burrito',
    category: 'Burritos',
    baseMacros: { calories: 680, protein: 38, carbs: 72, fat: 24 },
    tags: ['high-protein'],
    customizationGroups: [sizeGroup, extrasGroup],
  },
  {
    id: 'gyg-pulled-pork-burrito',
    restaurantSlug: 'gyg',
    name: 'Pulled Pork Burrito',
    category: 'Burritos',
    baseMacros: { calories: 720, protein: 34, carbs: 76, fat: 28 },
    tags: ['high-protein'],
    customizationGroups: [sizeGroup, extrasGroup],
  },
  {
    id: 'gyg-grilled-chicken-bowl',
    restaurantSlug: 'gyg',
    name: 'Grilled Chicken Bowl',
    category: 'Bowls',
    baseMacros: { calories: 520, protein: 42, carbs: 48, fat: 16 },
    isPopular: true,
    tags: ['high-protein'],
    customizationGroups: [riceGroup, extrasGroup],
  },
  {
    id: 'gyg-pulled-pork-bowl',
    restaurantSlug: 'gyg',
    name: 'Pulled Pork Bowl',
    category: 'Bowls',
    baseMacros: { calories: 560, protein: 36, carbs: 52, fat: 20 },
    tags: ['high-protein'],
    customizationGroups: [riceGroup, extrasGroup],
  },
  {
    id: 'gyg-chicken-taco',
    restaurantSlug: 'gyg',
    name: 'Chicken Taco (single)',
    category: 'Tacos',
    baseMacros: { calories: 220, protein: 14, carbs: 18, fat: 10 },
    customizationGroups: [extrasGroup],
  },
  {
    id: 'gyg-beef-taco',
    restaurantSlug: 'gyg',
    name: 'Beef Taco (single)',
    category: 'Tacos',
    baseMacros: { calories: 240, protein: 16, carbs: 18, fat: 12 },
    customizationGroups: [extrasGroup],
  },
  {
    id: 'gyg-chicken-nachos',
    restaurantSlug: 'gyg',
    name: 'Chicken Nachos',
    category: 'Nachos',
    baseMacros: { calories: 780, protein: 36, carbs: 68, fat: 38 },
    tags: ['high-protein'],
    customizationGroups: [extrasGroup],
  },
  {
    id: 'gyg-bean-burrito',
    restaurantSlug: 'gyg',
    name: 'Bean Burrito',
    category: 'Burritos',
    baseMacros: { calories: 580, protein: 20, carbs: 78, fat: 18 },
    customizationGroups: [sizeGroup, extrasGroup],
  },
  {
    id: 'gyg-grilled-veggie-bowl',
    restaurantSlug: 'gyg',
    name: 'Grilled Veggie Bowl',
    category: 'Bowls',
    baseMacros: { calories: 420, protein: 14, carbs: 56, fat: 16 },
    customizationGroups: [riceGroup, extrasGroup],
  },
];
