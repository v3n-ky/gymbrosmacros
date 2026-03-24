'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { MacroSummary } from './MacroSummary';
import { MealItem } from '@/types/meal';
import { Macros } from '@/types/macros';
import { MacroTargets } from '@/types/meal';
import { buildOrderLabel } from '@/lib/meal-finder';

interface MealTrayProps {
  items: MealItem[];
  totalMacros: Macros;
  targets?: MacroTargets;
  onRemoveItem: (index: number) => void;
  onUpdateQuantity: (index: number, quantity: number) => void;
  onClear: () => void;
  onSaveMeal?: (name: string) => void;
}

export function MealTray({
  items,
  totalMacros,
  targets,
  onRemoveItem,
  onUpdateQuantity,
  onClear,
  onSaveMeal,
}: MealTrayProps) {
  const [expanded, setExpanded] = useState(false);
  const [saving, setSaving] = useState(false);
  const [mealName, setMealName] = useState('');
  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);

  if (items.length === 0) return null;

  const handleSaveClick = () => {
    const defaultName = new Date().toLocaleDateString('en-AU', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
    });
    setMealName(defaultName);
    setSaving(true);
  };

  const handleSaveConfirm = () => {
    if (onSaveMeal && mealName.trim()) {
      onSaveMeal(mealName.trim());
    }
    setSaving(false);
  };

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
          {items.map((mealItem, index) => {
            const orderLabel = buildOrderLabel(mealItem.menuItem, mealItem.selectedOptions);
            return (
              <div
                key={index}
                className="flex items-start justify-between rounded-lg bg-secondary/50 px-3 py-2 gap-2"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{mealItem.menuItem.name}</p>
                  {orderLabel && (
                    <p className="text-[11px] text-primary/80 leading-tight truncate mt-0.5">
                      {orderLabel}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {mealItem.computedMacros.calories} cal · {mealItem.computedMacros.protein}g protein
                  </p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
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
            );
          })}
        </div>

        {/* Total macros */}
        <div className="rounded-lg bg-secondary/30 p-3 mb-3">
          <p className="text-xs font-medium text-muted-foreground mb-2">Total</p>
          <MacroSummary macros={totalMacros} targets={targets} />
        </div>

        {/* Save meal */}
        {onSaveMeal && (
          saving ? (
            <div className="flex gap-2">
              <input
                type="text"
                value={mealName}
                onChange={(e) => setMealName(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleSaveConfirm(); if (e.key === 'Escape') setSaving(false); }}
                placeholder="Meal name…"
                autoFocus
                className="flex-1 h-8 rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring"
              />
              <Button size="sm" className="h-8 text-xs px-3" onClick={handleSaveConfirm}>
                Save
              </Button>
              <Button size="sm" variant="ghost" className="h-8 text-xs px-2" onClick={() => setSaving(false)}>
                ✕
              </Button>
            </div>
          ) : (
            <Button
              size="sm"
              variant="outline"
              className="w-full text-xs h-8 border-primary/40 text-primary hover:bg-primary/10"
              onClick={handleSaveClick}
            >
              ♥ Save this meal
            </Button>
          )
        )}
      </div>
    </div>
  );
}
