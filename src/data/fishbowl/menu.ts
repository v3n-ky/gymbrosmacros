import { MenuItem } from '@/types/menu';

const customizationGroups: MenuItem['customizationGroups'] = [
  {
    id: 'base',
    name: 'Base',
    type: 'single',
    required: true,
    defaultOptionId: 'base-white-rice',
    options: [
      {
        id: 'base-white-rice',
        name: 'White Rice',
        macroDelta: {},
        isDefault: true,
      },
      {
        id: 'base-brown-rice',
        name: 'Brown Rice',
        macroDelta: { calories: -10, fibre: 3 },
      },
      {
        id: 'base-quinoa',
        name: 'Quinoa',
        macroDelta: { calories: 20, protein: 4, fibre: 2 },
      },
      {
        id: 'base-mixed-greens',
        name: 'Mixed Greens',
        macroDelta: { calories: -80, carbs: -18, fibre: 2 },
      },
    ],
  },
  {
    id: 'extras',
    name: 'Extras',
    type: 'multi',
    required: false,
    options: [
      {
        id: 'extras-extra-protein',
        name: 'Extra Protein',
        macroDelta: { calories: 120, protein: 20, fat: 4 },
      },
      {
        id: 'extras-edamame',
        name: 'Edamame',
        macroDelta: { calories: 60, protein: 6, fat: 2 },
      },
      {
        id: 'extras-avocado',
        name: 'Avocado',
        macroDelta: { calories: 80, fat: 7, fibre: 2 },
      },
      {
        id: 'extras-sesame-seeds',
        name: 'Sesame Seeds',
        macroDelta: { calories: 30, fat: 3 },
      },
    ],
  },
  {
    id: 'sauce',
    name: 'Sauce',
    type: 'single',
    required: false,
    defaultOptionId: 'sauce-teriyaki',
    options: [
      {
        id: 'sauce-teriyaki',
        name: 'Teriyaki',
        macroDelta: {},
        isDefault: true,
      },
      {
        id: 'sauce-spicy-mayo',
        name: 'Spicy Mayo',
        macroDelta: { calories: 60, fat: 6 },
      },
      {
        id: 'sauce-ponzu',
        name: 'Ponzu',
        macroDelta: { calories: 10 },
      },
      {
        id: 'sauce-miso',
        name: 'Miso',
        macroDelta: { calories: 20, carbs: 3 },
      },
    ],
  },
];

export const fishbowlMenu: MenuItem[] = [
  {
    id: 'fishbowl-teriyaki-salmon',
    restaurantSlug: 'fishbowl',
    name: 'Teriyaki Salmon Bowl',
    category: 'Bowls',
    baseMacros: { calories: 580, protein: 38, carbs: 62, fat: 18 },
    isPopular: true,
    tags: ['high-protein'],
    customizationGroups,
  },
  {
    id: 'fishbowl-crispy-chicken',
    restaurantSlug: 'fishbowl',
    name: 'Crispy Chicken Bowl',
    category: 'Bowls',
    baseMacros: { calories: 620, protein: 32, carbs: 68, fat: 22 },
    tags: ['high-protein'],
    customizationGroups,
  },
  {
    id: 'fishbowl-grilled-chicken',
    restaurantSlug: 'fishbowl',
    name: 'Grilled Chicken Bowl',
    category: 'Bowls',
    baseMacros: { calories: 520, protein: 40, carbs: 52, fat: 14 },
    isPopular: true,
    tags: ['high-protein'],
    customizationGroups,
  },
  {
    id: 'fishbowl-tofu',
    restaurantSlug: 'fishbowl',
    name: 'Tofu Bowl',
    category: 'Bowls',
    baseMacros: { calories: 480, protein: 22, carbs: 58, fat: 18 },
    customizationGroups,
  },
  {
    id: 'fishbowl-prawn',
    restaurantSlug: 'fishbowl',
    name: 'Prawn Bowl',
    category: 'Bowls',
    baseMacros: { calories: 490, protein: 34, carbs: 54, fat: 14 },
    tags: ['high-protein'],
    customizationGroups,
  },
  {
    id: 'fishbowl-tuna-poke',
    restaurantSlug: 'fishbowl',
    name: 'Tuna Poke Bowl',
    category: 'Bowls',
    baseMacros: { calories: 510, protein: 36, carbs: 56, fat: 14 },
    tags: ['high-protein'],
    customizationGroups,
  },
  {
    id: 'fishbowl-green-goddess-salad',
    restaurantSlug: 'fishbowl',
    name: 'Green Goddess Salad',
    category: 'Salads',
    baseMacros: { calories: 380, protein: 28, carbs: 24, fat: 20 },
    customizationGroups,
  },
  {
    id: 'fishbowl-chicken-caesar-salad',
    restaurantSlug: 'fishbowl',
    name: 'Chicken Caesar Salad',
    category: 'Salads',
    baseMacros: { calories: 420, protein: 34, carbs: 18, fat: 24 },
    tags: ['high-protein'],
    customizationGroups,
  },
];
