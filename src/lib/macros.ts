import { Macros, EMPTY_MACROS } from '@/types/macros';
import { MenuItem, CustomizationOption } from '@/types/menu';

export function computeItemMacros(
  item: MenuItem,
  selectedOptions: Record<string, string[]>
): Macros {
  const result = { ...item.baseMacros };

  for (const group of item.customizationGroups ?? []) {
    const selected = selectedOptions[group.id] ?? [];
    for (const optionId of selected) {
      const option = group.options.find((o: CustomizationOption) => o.id === optionId);
      if (option?.macroDelta) {
        for (const [key, value] of Object.entries(option.macroDelta)) {
          (result as Record<string, number | undefined>)[key] =
            ((result as Record<string, number | undefined>)[key] ?? 0) + (value ?? 0);
        }
      }
    }
  }

  return result;
}

export function sumMacros(items: Macros[]): Macros {
  return items.reduce(
    (acc, m) => ({
      calories: acc.calories + m.calories,
      protein: acc.protein + m.protein,
      carbs: acc.carbs + m.carbs,
      fat: acc.fat + m.fat,
      fibre: (acc.fibre ?? 0) + (m.fibre ?? 0),
      sodium: (acc.sodium ?? 0) + (m.sodium ?? 0),
      sugar: (acc.sugar ?? 0) + (m.sugar ?? 0),
    }),
    { ...EMPTY_MACROS }
  );
}

/** Grams of protein per 100 calories */
export function proteinPerCalorie(macros: Macros): number {
  return macros.calories > 0
    ? Math.round((macros.protein / macros.calories) * 1000) / 10
    : 0;
}

/** Percentage of calories from protein */
export function proteinPercentage(macros: Macros): number {
  const total = macros.protein * 4 + macros.carbs * 4 + macros.fat * 9;
  return total > 0 ? Math.round(((macros.protein * 4) / total) * 100) : 0;
}

/** Whether an item qualifies as "Top Pick" */
export function isTopPick(macros: Macros): boolean {
  return (
    macros.protein >= 30 &&
    macros.calories <= 600 &&
    proteinPercentage(macros) >= 30
  );
}

/** Whether an item qualifies as "High Protein" (>8g per 100cal) */
export function isHighProtein(macros: Macros): boolean {
  return proteinPerCalorie(macros) >= 8;
}

export function multiplyMacros(macros: Macros, quantity: number): Macros {
  return {
    calories: macros.calories * quantity,
    protein: macros.protein * quantity,
    carbs: macros.carbs * quantity,
    fat: macros.fat * quantity,
    fibre: macros.fibre != null ? macros.fibre * quantity : undefined,
    sodium: macros.sodium != null ? macros.sodium * quantity : undefined,
    sugar: macros.sugar != null ? macros.sugar * quantity : undefined,
  };
}
