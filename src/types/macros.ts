export interface Macros {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fibre?: number;
  sodium?: number;
  sugar?: number;
}

export const EMPTY_MACROS: Macros = {
  calories: 0,
  protein: 0,
  carbs: 0,
  fat: 0,
};
