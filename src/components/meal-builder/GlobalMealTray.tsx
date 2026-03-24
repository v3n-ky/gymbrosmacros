'use client';

import { useCallback } from 'react';
import { useMealBuilder } from '@/hooks/useMealBuilder';
import { useProfiles } from '@/hooks/useProfiles';
import { MealTray } from './MealTray';
import { SavedMeal, SavedMealItem } from '@/types/profile';

export function GlobalMealTray() {
  const { meal, targets, removeItem, updateQuantity, clearMeal } = useMealBuilder();
  const { saveMeal } = useProfiles();

  const handleSaveMeal = useCallback(
    (name: string) => {
      const items: SavedMealItem[] = meal.items.map((i) => ({
        itemId: i.menuItem.id,
        restaurantSlug: i.menuItem.restaurantSlug,
        selectedOptions: i.selectedOptions,
        computedMacros: i.computedMacros,
        quantity: i.quantity,
      }));
      const saved: SavedMeal = {
        id: Date.now().toString(),
        name,
        items,
        totalMacros: meal.totalMacros,
        savedAt: Date.now(),
      };
      saveMeal(saved);
    },
    [meal, saveMeal]
  );

  return (
    <MealTray
      items={meal.items}
      totalMacros={meal.totalMacros}
      targets={targets}
      onRemoveItem={removeItem}
      onUpdateQuantity={updateQuantity}
      onClear={clearMeal}
      onSaveMeal={handleSaveMeal}
    />
  );
}
