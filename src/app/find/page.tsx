'use client';

import { useMemo } from 'react';
import { MacroInput } from '@/components/meal-finder/MacroInput';
import { FinderResults } from '@/components/meal-finder/FinderResults';
import { MacroTargets } from '@/types/meal';
import { MealType } from '@/types/profile';
import { getAllMenuItems } from '@/data';
import { findMatchingItems } from '@/lib/meal-finder';
import { restaurants } from '@/data/restaurants';
import { DietaryFilters } from '@/components/DietaryIcons';
import { useMealBuilder } from '@/hooks/useMealBuilder';
import { useProfiles } from '@/hooks/useProfiles';

const MEAL_TYPES: { id: MealType; label: string; emoji: string }[] = [
  { id: 'breakfast', label: 'Breakfast', emoji: '🌅' },
  { id: 'lunch',     label: 'Lunch',     emoji: '☀️' },
  { id: 'dinner',    label: 'Dinner',    emoji: '🌙' },
];

export default function FindPage() {
  const { activeProfile, activeId, updateProfile } = useProfiles();
  const { addItem } = useMealBuilder();

  const selectedMeal: MealType = activeProfile?.lastMealType ?? 'lunch';

  const targets: MacroTargets = activeProfile?.mealTargets?.[selectedMeal] ?? {};
  const dietaryFilters = activeProfile?.dietaryFilters ?? [];
  const selectedRestaurants = activeProfile?.restaurantFilters ?? [];

  const setMealType = (m: MealType) => updateProfile(activeId, { lastMealType: m });

  const setTargets = (t: MacroTargets) =>
    updateProfile(activeId, {
      mealTargets: { ...activeProfile?.mealTargets, [selectedMeal]: t } as Record<MealType, MacroTargets>,
    });

  const setDietaryFilters = (f: string[]) => updateProfile(activeId, { dietaryFilters: f });

  const toggleRestaurant = (slug: string) => {
    const current = activeProfile?.restaurantFilters ?? [];
    updateProfile(activeId, {
      restaurantFilters: current.includes(slug)
        ? current.filter((s) => s !== slug)
        : [...current, slug],
    });
  };

  const allItems = useMemo(() => getAllMenuItems(), []);

  const results = useMemo(() => {
    const hasAnyTarget = Object.values(targets).some((v) => v != null);
    if (!hasAnyTarget) return [];

    let items = allItems;
    if (dietaryFilters.length > 0) {
      // Preference tags (plant-based / animal): OR — item needs at least one match
      // Restriction tags (gluten-free): AND — item must satisfy all
      const prefs = dietaryFilters.filter((t) => t !== 'gluten-free-option');
      const restrictions = dietaryFilters.filter((t) => t === 'gluten-free-option');
      items = items.filter((item) => {
        const matchesPref = prefs.length === 0 || prefs.some((t) => item.tags?.includes(t));
        const matchesRestriction = restrictions.every((t) => item.tags?.includes(t));
        return matchesPref && matchesRestriction;
      });
    }

    const ranked = findMatchingItems(items, targets, {
      restaurantFilter: selectedRestaurants.length > 0 ? selectedRestaurants : undefined,
      maxResults: 100,
      dietaryFilters,
    });

    // When no restaurant filter is active, interleave results so the first batch
    // includes the best match from every restaurant — prevents highly-customisable
    // restaurants (e.g. GYG, Fishbowl) from monopolising the visible results.
    if (selectedRestaurants.length > 0) return ranked.slice(0, 21);

    const seen = new Set<string>();
    const representatives: typeof ranked = [];
    const rest: typeof ranked = [];
    for (const r of ranked) {
      if (!seen.has(r.item.restaurantSlug)) {
        seen.add(r.item.restaurantSlug);
        representatives.push(r);
      } else {
        rest.push(r);
      }
    }
    return [...representatives, ...rest].slice(0, 21);
  }, [allItems, targets, selectedRestaurants, dietaryFilters]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">
        <span className="text-primary">Find</span> a Meal by Macros
      </h1>
      <p className="text-muted-foreground mb-6">
        Select what you&apos;re ordering for and we&apos;ll find the best matches for your targets.
      </p>

      {/* Step 1: What are you ordering for? */}
      <div className="rounded-xl border border-border bg-card p-6 mb-4">
        <p className="text-sm font-semibold mb-3">What are you ordering for?</p>
        <div className="flex gap-2 flex-wrap">
          {MEAL_TYPES.map((m) => (
            <button
              key={m.id}
              onClick={() => setMealType(m.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors border ${
                selectedMeal === m.id
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-secondary text-muted-foreground border-transparent hover:text-foreground'
              }`}
            >
              <span className="text-base">{m.emoji}</span> {m.label}
            </button>
          ))}
        </div>
      </div>

      {/* Step 2: Macro targets (pre-filled from profile) */}
      <div className="rounded-xl border border-border bg-card p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm font-semibold">
            {MEAL_TYPES.find((m) => m.id === selectedMeal)?.emoji} {MEAL_TYPES.find((m) => m.id === selectedMeal)?.label} targets
          </p>
          {!Object.values(targets).some((v) => v != null) && (
            <span className="text-xs text-muted-foreground">
              Set defaults in <a href="/profile" className="text-primary hover:underline">Profile</a>
            </span>
          )}
        </div>
        <MacroInput targets={targets} onChange={setTargets} />
      </div>

      {/* Dietary filters */}
      <div className="mb-4">
        <p className="text-xs text-muted-foreground mb-2">Dietary preference:</p>
        <DietaryFilters selected={dietaryFilters} onChange={setDietaryFilters} />
      </div>

      {/* Restaurant filter */}
      <div className="mb-6">
        <p className="text-xs text-muted-foreground mb-2">Filter by restaurant:</p>
        <div className="flex flex-wrap gap-2">
          {restaurants.map((r) => (
            <button
              key={r.slug}
              onClick={() => toggleRestaurant(r.slug)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                selectedRestaurants.includes(r.slug) || selectedRestaurants.length === 0
                  ? 'bg-primary/20 text-primary border border-primary/30'
                  : 'bg-secondary text-muted-foreground border border-transparent'
              }`}
            >
              {r.shortName}
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      <FinderResults results={results} onAddItem={addItem} />
    </div>
  );
}
