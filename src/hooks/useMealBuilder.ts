'use client';

import { useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { MealItem, Meal, MacroTargets } from '@/types/meal';
import { Macros, EMPTY_MACROS } from '@/types/macros';
import { MenuItem } from '@/types/menu';
import { computeItemMacros, sumMacros, multiplyMacros } from '@/lib/macros';

const MEAL_STORAGE_KEY = 'eatmacros-meal';
const TARGETS_STORAGE_KEY = 'eatmacros-targets';

const emptyMeal: Meal = {
  items: [],
  totalMacros: { ...EMPTY_MACROS },
  createdAt: new Date().toISOString(),
};

export function useMealBuilder() {
  const [meal, setMeal] = useLocalStorage<Meal>(MEAL_STORAGE_KEY, emptyMeal);
  const [targets, setTargets] = useLocalStorage<MacroTargets>(TARGETS_STORAGE_KEY, {});

  const recalculateTotal = useCallback((items: MealItem[]): Macros => {
    return sumMacros(items.map((i) => multiplyMacros(i.computedMacros, i.quantity)));
  }, []);

  const addItem = useCallback(
    (menuItem: MenuItem, selectedOptions: Record<string, string[]> = {}) => {
      setMeal((prev) => {
        const computedMacros = computeItemMacros(menuItem, selectedOptions);
        const newItem: MealItem = {
          menuItem,
          selectedOptions,
          quantity: 1,
          computedMacros,
        };
        const items = [...prev.items, newItem];
        return {
          ...prev,
          items,
          totalMacros: recalculateTotal(items),
          restaurant: prev.items.length === 0 ? menuItem.restaurantSlug : prev.restaurant,
        };
      });
    },
    [setMeal, recalculateTotal]
  );

  const removeItem = useCallback(
    (index: number) => {
      setMeal((prev) => {
        const items = prev.items.filter((_, i) => i !== index);
        return {
          ...prev,
          items,
          totalMacros: recalculateTotal(items),
        };
      });
    },
    [setMeal, recalculateTotal]
  );

  const updateQuantity = useCallback(
    (index: number, quantity: number) => {
      if (quantity < 1) return;
      setMeal((prev) => {
        const items = prev.items.map((item, i) =>
          i === index ? { ...item, quantity } : item
        );
        return {
          ...prev,
          items,
          totalMacros: recalculateTotal(items),
        };
      });
    },
    [setMeal, recalculateTotal]
  );

  const clearMeal = useCallback(() => {
    setMeal({
      items: [],
      totalMacros: { ...EMPTY_MACROS },
      createdAt: new Date().toISOString(),
    });
  }, [setMeal]);

  const remaining: Partial<Macros> = {
    calories: targets.calories != null ? targets.calories - meal.totalMacros.calories : undefined,
    protein: targets.protein != null ? targets.protein - meal.totalMacros.protein : undefined,
    carbs: targets.carbs != null ? targets.carbs - meal.totalMacros.carbs : undefined,
    fat: targets.fat != null ? targets.fat - meal.totalMacros.fat : undefined,
  };

  return {
    meal,
    targets,
    setTargets,
    addItem,
    removeItem,
    updateQuantity,
    clearMeal,
    remaining,
    itemCount: meal.items.reduce((sum, i) => sum + i.quantity, 0),
  };
}
