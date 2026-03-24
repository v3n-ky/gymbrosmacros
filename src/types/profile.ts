import { MacroTargets } from './meal';

export type ProfileId = 'A' | 'B';
export type MealType = 'breakfast' | 'lunch' | 'dinner';

export interface SavedItem {
  itemId: string;
  restaurantSlug: string;
  selectedOptions: Record<string, string[]>;
  savedAt: number;
}

export interface UserProfile {
  id: ProfileId;
  label: string;
  mealTargets: Record<MealType, MacroTargets>;
  dietaryFilters: string[];
  restaurantFilters: string[];
  favorites: SavedItem[];
  lastMealType?: MealType;
}
