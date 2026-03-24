import { MenuItem } from '@/types/menu';

const SPICE_LEVEL_GROUP = {
  id: 'spice-level',
  name: 'Spice Level',
  type: 'single' as const,
  required: true,
  defaultOptionId: 'spice-lemon-herb',
  options: [
    {
      id: 'spice-lemon-herb',
      name: 'Lemon & Herb',
      macroDelta: {},
      isDefault: true,
    },
    {
      id: 'spice-medium',
      name: 'Medium',
      macroDelta: {},
    },
    {
      id: 'spice-hot',
      name: 'Hot',
      macroDelta: {},
    },
    {
      id: 'spice-extra-hot',
      name: 'Extra Hot',
      macroDelta: {},
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
      id: 'extra-chicken',
      name: 'Extra Chicken',
      macroDelta: { calories: 100, protein: 18, fat: 4 },
    },
    {
      id: 'extra-halloumi',
      name: 'Halloumi',
      macroDelta: { calories: 120, protein: 8, fat: 8 },
    },
    {
      id: 'extra-avocado',
      name: 'Avocado',
      macroDelta: { calories: 70, fat: 6 },
    },
    {
      id: 'extra-cheese',
      name: 'Cheese',
      macroDelta: { calories: 50, protein: 3, fat: 4 },
    },
    {
      id: 'extra-peri-peri-drizzle',
      name: 'Peri-Peri Drizzle',
      macroDelta: { calories: 30, fat: 3 },
    },
  ],
};

const CHICKEN_CUSTOMIZATIONS = [SPICE_LEVEL_GROUP, EXTRAS_GROUP];

export const nandosMenu: MenuItem[] = [
  {
    id: 'nandos-quarter-chicken-breast',
    restaurantSlug: 'nandos',
    name: '1/4 Chicken Breast',
    category: 'Chicken',
    baseMacros: { calories: 280, protein: 36, carbs: 2, fat: 14 },
    isPopular: true,
    tags: ['high-protein', 'contains-meat', 'chicken', 'gluten-free-option'],
    customizationGroups: CHICKEN_CUSTOMIZATIONS,
  },
  {
    id: 'nandos-half-chicken',
    restaurantSlug: 'nandos',
    name: '1/2 Chicken',
    category: 'Chicken',
    baseMacros: { calories: 520, protein: 64, carbs: 4, fat: 28 },
    isPopular: true,
    tags: ['high-protein', 'contains-meat', 'chicken', 'gluten-free-option'],
    customizationGroups: CHICKEN_CUSTOMIZATIONS,
  },
  {
    id: 'nandos-chicken-breast-burger',
    restaurantSlug: 'nandos',
    name: 'Chicken Breast Burger',
    category: 'Burgers',
    baseMacros: { calories: 480, protein: 34, carbs: 38, fat: 20 },
    tags: ['high-protein', 'contains-meat', 'chicken'],
    customizationGroups: CHICKEN_CUSTOMIZATIONS,
  },
  {
    id: 'nandos-chicken-thigh-burger',
    restaurantSlug: 'nandos',
    name: 'Chicken Thigh Burger',
    category: 'Burgers',
    baseMacros: { calories: 540, protein: 30, carbs: 40, fat: 28 },
    tags: ['high-protein', 'contains-meat', 'chicken'],
    customizationGroups: CHICKEN_CUSTOMIZATIONS,
  },
  {
    id: 'nandos-classic-wrap',
    restaurantSlug: 'nandos',
    name: 'Classic Wrap',
    category: 'Wraps',
    baseMacros: { calories: 460, protein: 28, carbs: 42, fat: 18 },
    tags: ['contains-meat', 'chicken'],
    customizationGroups: CHICKEN_CUSTOMIZATIONS,
  },
  {
    id: 'nandos-grilled-chicken-wrap',
    restaurantSlug: 'nandos',
    name: 'Grilled Chicken Wrap',
    category: 'Wraps',
    baseMacros: { calories: 420, protein: 32, carbs: 38, fat: 14 },
    tags: ['high-protein', 'contains-meat', 'chicken'],
    customizationGroups: CHICKEN_CUSTOMIZATIONS,
  },
  {
    id: 'nandos-chicken-caesar-salad',
    restaurantSlug: 'nandos',
    name: 'Chicken Caesar Salad',
    category: 'Salads',
    baseMacros: { calories: 380, protein: 30, carbs: 14, fat: 22 },
    tags: ['high-protein', 'contains-meat', 'chicken', 'gluten-free-option'],
    customizationGroups: CHICKEN_CUSTOMIZATIONS,
  },
  {
    id: 'nandos-mediterranean-salad',
    restaurantSlug: 'nandos',
    name: 'Mediterranean Salad',
    category: 'Salads',
    baseMacros: { calories: 340, protein: 26, carbs: 18, fat: 18 },
    tags: ['contains-meat', 'chicken', 'gluten-free-option'],
    customizationGroups: CHICKEN_CUSTOMIZATIONS,
  },
  {
    id: 'nandos-peri-peri-chicken-tenders',
    restaurantSlug: 'nandos',
    name: 'Peri-Peri Chicken Tenders (5pc)',
    category: 'Sides',
    baseMacros: { calories: 380, protein: 28, carbs: 22, fat: 18 },
    tags: ['contains-meat', 'chicken'],
    customizationGroups: [SPICE_LEVEL_GROUP],
  },
  {
    id: 'nandos-spicy-rice',
    restaurantSlug: 'nandos',
    name: 'Spicy Rice',
    category: 'Sides',
    baseMacros: { calories: 280, protein: 6, carbs: 48, fat: 6 },
    tags: ['vegan', 'vegetarian', 'gluten-free-option'],
  },
  {
    id: 'nandos-coleslaw',
    restaurantSlug: 'nandos',
    name: 'Coleslaw',
    category: 'Sides',
    baseMacros: { calories: 120, protein: 2, carbs: 8, fat: 8 },
    tags: ['vegetarian', 'gluten-free-option'],
  },
];
