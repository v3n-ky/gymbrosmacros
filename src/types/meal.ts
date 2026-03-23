import { Macros } from './macros';
import { MenuItem } from './menu';

export interface MealItem {
  menuItem: MenuItem;
  selectedOptions: Record<string, string[]>;
  quantity: number;
  computedMacros: Macros;
}

export interface Meal {
  items: MealItem[];
  totalMacros: Macros;
  restaurant?: string;
  createdAt: string;
}

export interface MacroTargets {
  calories?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
}
