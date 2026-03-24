'use client';

import { useMealBuilder } from '@/hooks/useMealBuilder';
import { MealTray } from './MealTray';

export function GlobalMealTray() {
  const { meal, targets, removeItem, updateQuantity, clearMeal } = useMealBuilder();
  return (
    <MealTray
      items={meal.items}
      totalMacros={meal.totalMacros}
      targets={targets}
      onRemoveItem={removeItem}
      onUpdateQuantity={updateQuantity}
      onClear={clearMeal}
    />
  );
}
