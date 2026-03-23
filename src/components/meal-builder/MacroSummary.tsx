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

  return (
    <div className="space-y-3">
      <MacroBar
        label="Calories"
        value={macros.calories}
        unit=" cal"
        color="oklch(0.8 0.22 145)"
        max={targets?.calories}
      />
      <MacroBar
        label="Protein"
        value={macros.protein}
        unit="g"
        color="oklch(0.7 0.15 250)"
        max={targets?.protein}
      />
      <MacroBar
        label="Carbs"
        value={macros.carbs}
        unit="g"
        color="oklch(0.75 0.15 80)"
        max={targets?.carbs}
      />
      <MacroBar
        label="Fat"
        value={macros.fat}
        unit="g"
        color="oklch(0.7 0.15 40)"
        max={targets?.fat}
      />
    </div>
  );
}
