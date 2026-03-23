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
      id: 'bun-low-carb',
      name: 'Low Carb Bun',
      macroDelta: { calories: -60, carbs: -20, fat: 4 },
    },
    {
      id: 'bun-gluten-free',
      name: 'Gluten Free Bun',
      macroDelta: { calories: -20, carbs: -8 },
    },
    {
      id: 'bun-lettuce-wrap',
      name: 'Lettuce Wrap',
      macroDelta: { calories: -120, carbs: -32, fat: -2 },
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
      id: 'patty-chicken',
      name: 'Chicken',
      macroDelta: { calories: -40, protein: 2, fat: -4 },
    },
    {
      id: 'patty-plant-based',
      name: 'Plant-Based',
      macroDelta: { calories: -20, protein: -8, carbs: 6, fat: 2 },
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
      id: 'extra-patty',
      name: 'Extra Patty',
      macroDelta: { calories: 250, protein: 20, fat: 16 },
    },
    {
      id: 'extra-bacon',
      name: 'Bacon',
      macroDelta: { calories: 80, protein: 6, fat: 6 },
    },
    {
      id: 'extra-avocado',
      name: 'Avocado',
      macroDelta: { calories: 70, fat: 6 },
    },
    {
      id: 'extra-cheese',
      name: 'Cheese',
      macroDelta: { calories: 60, protein: 4, fat: 5 },
    },
  ],
};

const BURGER_CUSTOMIZATIONS = [BUN_GROUP, PATTY_GROUP, EXTRAS_GROUP];

export const grilldMenu: MenuItem[] = [
  {
    id: 'grilld-simply-grilled-chicken',
    restaurantSlug: 'grilld',
    name: 'Simply Grilled Chicken Burger',
    category: 'Burgers',
    baseMacros: { calories: 480, protein: 38, carbs: 36, fat: 18 },
    isPopular: true,
    tags: ['high-protein'],
    customizationGroups: BURGER_CUSTOMIZATIONS,
  },
  {
    id: 'grilld-crispy-bacon-cheese',
    restaurantSlug: 'grilld',
    name: 'Crispy Bacon & Cheese',
    category: 'Burgers',
    baseMacros: { calories: 680, protein: 36, carbs: 42, fat: 38 },
    tags: ['high-protein'],
    customizationGroups: BURGER_CUSTOMIZATIONS,
  },
  {
    id: 'grilld-garden-goodness',
    restaurantSlug: 'grilld',
    name: 'Garden Goodness',
    category: 'Burgers',
    baseMacros: { calories: 520, protein: 18, carbs: 52, fat: 26 },
    tags: ['vegetarian'],
    customizationGroups: BURGER_CUSTOMIZATIONS,
  },
  {
    id: 'grilld-beefy-deluxe',
    restaurantSlug: 'grilld',
    name: 'Beefy Deluxe',
    category: 'Burgers',
    baseMacros: { calories: 620, protein: 40, carbs: 38, fat: 32 },
    isPopular: true,
    tags: ['high-protein'],
    customizationGroups: BURGER_CUSTOMIZATIONS,
  },
  {
    id: 'grilld-sweet-chilli-chicken',
    restaurantSlug: 'grilld',
    name: 'Sweet Chilli Chicken',
    category: 'Burgers',
    baseMacros: { calories: 540, protein: 34, carbs: 44, fat: 22 },
    tags: ['high-protein'],
    customizationGroups: BURGER_CUSTOMIZATIONS,
  },
  {
    id: 'grilld-healthy-chicken-caesar-salad',
    restaurantSlug: 'grilld',
    name: 'Healthy Chicken Caesar Salad',
    category: 'Salads',
    baseMacros: { calories: 380, protein: 32, carbs: 16, fat: 22 },
    tags: ['high-protein'],
  },
  {
    id: 'grilld-super-greens-salad',
    restaurantSlug: 'grilld',
    name: 'Super Greens Salad',
    category: 'Salads',
    baseMacros: { calories: 320, protein: 12, carbs: 28, fat: 18 },
    tags: [],
  },
  {
    id: 'grilld-sweet-potato-fries',
    restaurantSlug: 'grilld',
    name: 'Sweet Potato Fries',
    category: 'Sides',
    baseMacros: { calories: 340, protein: 4, carbs: 48, fat: 14 },
    tags: [],
  },
  {
    id: 'grilld-herbed-chips',
    restaurantSlug: 'grilld',
    name: 'Herbed Chips',
    category: 'Sides',
    baseMacros: { calories: 380, protein: 6, carbs: 52, fat: 16 },
    tags: [],
  },
];
