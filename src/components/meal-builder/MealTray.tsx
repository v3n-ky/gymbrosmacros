'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { MacroSummary } from './MacroSummary';
import { MealItem } from '@/types/meal';
import { Macros } from '@/types/macros';
import { MacroTargets } from '@/types/meal';

interface MealTrayProps {
  items: MealItem[];
  totalMacros: Macros;
  targets?: MacroTargets;
  onRemoveItem: (index: number) => void;
  onUpdateQuantity: (index: number, quantity: number) => void;
  onClear: () => void;
}

export function MealTray({
  items,
  totalMacros,
  targets,
  onRemoveItem,
  onUpdateQuantity,
  onClear,
}: MealTrayProps) {
  const [expanded, setExpanded] = useState(false);
  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);

  if (items.length === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 md:sticky md:top-20">
      {/* Collapsed bar */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full bg-card border-t border-border px-4 py-3 flex items-center justify-between md:hidden"
      >
        <div className="flex items-center gap-3">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
            {itemCount}
          </span>
          <span className="text-sm font-medium">Your Meal</span>
        </div>
        <MacroSummary macros={totalMacros} compact />
      </button>

      {/* Expanded tray (always shown on desktop) */}
      <div
        className={`bg-card border-t md:border border-border md:rounded-xl p-4 ${
          expanded ? 'block' : 'hidden md:block'
        }`}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold">
            Your Meal ({itemCount} {itemCount === 1 ? 'item' : 'items'})
          </h3>
          <Button variant="ghost" size="sm" onClick={onClear} className="text-xs text-destructive">
            Clear
          </Button>
        </div>

        {/* Item list */}
        <div className="space-y-2 mb-4 max-h-48 overflow-y-auto">
          {items.map((mealItem, index) => (
            <div
              key={index}
              className="flex items-center justify-between rounded-lg bg-secondary/50 px-3 py-2"
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{mealItem.menuItem.name}</p>
                <p className="text-xs text-muted-foreground">
                  {mealItem.computedMacros.calories} cal · {mealItem.computedMacros.protein}g protein
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0 ml-2">
                <button
                  onClick={() => onUpdateQuantity(index, mealItem.quantity - 1)}
                  className="h-6 w-6 rounded bg-secondary text-xs font-bold hover:bg-secondary/80"
                  disabled={mealItem.quantity <= 1}
                >
                  -
                </button>
                <span className="text-sm font-medium w-4 text-center">{mealItem.quantity}</span>
                <button
                  onClick={() => onUpdateQuantity(index, mealItem.quantity + 1)}
                  className="h-6 w-6 rounded bg-secondary text-xs font-bold hover:bg-secondary/80"
                >
                  +
                </button>
                <button
                  onClick={() => onRemoveItem(index)}
                  className="h-6 w-6 rounded text-destructive text-xs font-bold hover:bg-destructive/10"
                >
                  x
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Total macros */}
        <div className="rounded-lg bg-secondary/30 p-3">
          <p className="text-xs font-medium text-muted-foreground mb-2">Total</p>
          <MacroSummary macros={totalMacros} targets={targets} />
        </div>
      </div>
    </div>
  );
}
