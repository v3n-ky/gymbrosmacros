'use client';

import { useState, useMemo } from 'react';
import { MacroInput } from '@/components/meal-finder/MacroInput';
import { FinderResults } from '@/components/meal-finder/FinderResults';
import { MacroTargets } from '@/types/meal';
import { getAllMenuItems } from '@/data';
import { findMatchingItems } from '@/lib/meal-finder';
import { restaurants } from '@/data/restaurants';

export default function FindPage() {
  const [targets, setTargets] = useState<MacroTargets>({});
  const [selectedRestaurants, setSelectedRestaurants] = useState<string[]>([]);

  const allItems = useMemo(() => getAllMenuItems(), []);

  const results = useMemo(() => {
    const hasAnyTarget = Object.values(targets).some((v) => v != null);
    if (!hasAnyTarget) return [];

    return findMatchingItems(allItems, targets, {
      restaurantFilter: selectedRestaurants.length > 0 ? selectedRestaurants : undefined,
      maxResults: 21,
    });
  }, [allItems, targets, selectedRestaurants]);

  const toggleRestaurant = (slug: string) => {
    setSelectedRestaurants((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]
    );
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">
        <span className="text-primary">Find</span> a Meal by Macros
      </h1>
      <p className="text-muted-foreground mb-6">
        Enter your target macros and we&apos;ll find matching items across all restaurants.
      </p>

      {/* Target inputs */}
      <div className="rounded-xl border border-border bg-card p-6 mb-6">
        <MacroInput targets={targets} onChange={setTargets} />
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
      <FinderResults results={results} />
    </div>
  );
}
