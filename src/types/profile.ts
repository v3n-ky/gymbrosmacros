import { MacroTargets } from './meal';
import { Macros } from './macros';

export type ProfileId = 'A' | 'B';
export type MealType = 'breakfast' | 'lunch' | 'dinner';

export interface SavedItem {
  itemId: string;
  restaurantSlug: string;
  selectedOptions: Record<string, string[]>;
  savedAt: number;
}

export interface SavedMealItem {
  itemId: string;
  restaurantSlug: string;
  selectedOptions: Record<string, string[]>;
  computedMacros: Macros;
  quantity: number;
}

export interface SavedMeal {
  id: string;
  name: string;
  items: SavedMealItem[];
  totalMacros: Macros;
  savedAt: number;
}

export interface UserProfile {
  id: ProfileId;
  label: string;
  mealTargets: Record<MealType, MacroTargets>;
  dietaryFilters: string[];
  restaurantFilters: string[];
  favorites: SavedItem[];
  savedMeals: SavedMeal[];
  lastMealType?: MealType;
}
