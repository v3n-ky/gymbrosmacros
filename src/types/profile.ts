import { MacroTargets } from './meal';

export type ProfileId = 'A' | 'B';

export interface SavedItem {
  itemId: string;
  restaurantSlug: string;
  selectedOptions: Record<string, string[]>;
  savedAt: number;
}

export interface UserProfile {
  id: ProfileId;
  label: string;
  macroTargets: MacroTargets;
  dietaryFilters: string[];
  restaurantFilters: string[];
  favorites: SavedItem[];
}
