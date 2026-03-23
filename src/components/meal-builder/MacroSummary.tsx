import { Macros } from '@/types/macros';
import { MacroTargets } from '@/types/meal';
import { MacroBar } from './MacroBar';

interface MacroSummaryProps {
  macros: Macros;
  targets?: MacroTargets;
  compact?: boolean;
}

export function MacroSummary({ macros, targets, compact }: MacroSummaryProps) {
  if (compact) {
    return (
      <div className="flex gap-4 text-xs">
        <span>
          <span className="font-bold text-primary">{macros.calories}</span> cal
        </span>
        <span>
          <span className="font-bold text-blue-400">{macros.protein}g</span> protein
        </span>
        <span>
          <span className="font-bold text-amber-400">{macros.carbs}g</span> carbs
        </span>
        <span>
          <span className="font-bold text-orange-400">{macros.fat}g</span> fat
        </span>
      </div>
    );
  }

  // Calculate calorie percentage from each macro
  // Protein = 4 cal/g, Carbs = 4 cal/g, Fat = 9 cal/g
  const proteinCals = macros.protein * 4;
  const carbsCals = macros.carbs * 4;
  const fatCals = macros.fat * 9;
  const totalMacroCals = proteinCals + carbsCals + fatCals;

  const proteinPct = totalMacroCals > 0 ? (proteinCals / totalMacroCals) * 100 : 0;
  const carbsPct = totalMacroCals > 0 ? (carbsCals / totalMacroCals) * 100 : 0;
  const fatPct = totalMacroCals > 0 ? (fatCals / totalMacroCals) * 100 : 0;

  // For calories bar: use target if available, otherwise show as proportion of a reasonable max
  const calPct = targets?.calories
    ? (macros.calories / targets.calories) * 100
    : Math.min((macros.calories / 800) * 100, 100); // 800 cal as a reference max for single items

  return (
    <div className="space-y-3">
      <MacroBar
        label="Calories"
        value={macros.calories}
        unit=" cal"
        color="oklch(0.8 0.22 145)"
        percentage={calPct}
      />
      <MacroBar
        label="Protein"
        value={macros.protein}
        unit="g"
        color="oklch(0.7 0.15 250)"
        percentage={targets?.protein ? (macros.protein / targets.protein) * 100 : proteinPct}
      />
      <MacroBar
        label="Carbs"
        value={macros.carbs}
        unit="g"
        color="oklch(0.75 0.15 80)"
        percentage={targets?.carbs ? (macros.carbs / targets.carbs) * 100 : carbsPct}
      />
      <MacroBar
        label="Fat"
        value={macros.fat}
        unit="g"
        color="oklch(0.7 0.15 40)"
        percentage={targets?.fat ? (macros.fat / targets.fat) * 100 : fatPct}
      />
    </div>
  );
}
