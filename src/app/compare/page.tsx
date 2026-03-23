'use client';

import { useState, useMemo } from 'react';
import { getAllMenuItems } from '@/data';
import { restaurants } from '@/data/restaurants';
import { MenuItem } from '@/types/menu';
import { proteinPerCalorie, isGymBroApproved } from '@/lib/macros';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

export default function ComparePage() {
  const allItems = useMemo(() => getAllMenuItems(), []);
  const [selected, setSelected] = useState<MenuItem[]>([]);
  const [search, setSearch] = useState('');
  const [filterRestaurant, setFilterRestaurant] = useState('');

  const searchResults = useMemo(() => {
    if (!search && !filterRestaurant) return [];
    let items = allItems;
    if (filterRestaurant) {
      items = items.filter((i) => i.restaurantSlug === filterRestaurant);
    }
    if (search) {
      const q = search.toLowerCase();
      items = items.filter((i) => i.name.toLowerCase().includes(q));
    }
    return items.slice(0, 10);
  }, [allItems, search, filterRestaurant]);

  const addItem = (item: MenuItem) => {
    if (selected.length < 4 && !selected.find((s) => s.id === item.id)) {
      setSelected([...selected, item]);
      setSearch('');
    }
  };

  const removeItem = (id: string) => {
    setSelected(selected.filter((s) => s.id !== id));
  };

  const macroKeys = [
    { key: 'calories', label: 'Calories', unit: '', color: 'text-primary' },
    { key: 'protein', label: 'Protein', unit: 'g', color: 'text-blue-400' },
    { key: 'carbs', label: 'Carbs', unit: 'g', color: 'text-amber-400' },
    { key: 'fat', label: 'Fat', unit: 'g', color: 'text-orange-400' },
  ] as const;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">
        <span className="text-primary">Compare</span> Items
      </h1>
      <p className="text-muted-foreground mb-6">
        Compare up to 4 items side by side across any restaurants.
      </p>

      {/* Search to add items */}
      <div className="rounded-xl border border-border bg-card p-4 mb-6">
        <div className="flex gap-3 mb-2">
          <select
            value={filterRestaurant}
            onChange={(e) => setFilterRestaurant(e.target.value)}
            className="rounded-lg border border-border bg-background px-3 py-2 text-sm"
          >
            <option value="">All restaurants</option>
            {restaurants.map((r) => (
              <option key={r.slug} value={r.slug}>{r.shortName}</option>
            ))}
          </select>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search for an item..."
            className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm"
            disabled={selected.length >= 4}
          />
        </div>
        {searchResults.length > 0 && (
          <div className="space-y-1 max-h-48 overflow-y-auto">
            {searchResults.map((item) => (
              <button
                key={item.id}
                onClick={() => addItem(item)}
                disabled={selected.some((s) => s.id === item.id)}
                className="w-full text-left rounded-lg px-3 py-2 text-sm hover:bg-secondary/50 transition-colors flex justify-between disabled:opacity-40"
              >
                <span>
                  <span className="font-medium">{item.name}</span>
                  <span className="text-xs text-muted-foreground ml-2">
                    {item.restaurantSlug.toUpperCase()}
                  </span>
                </span>
                <span className="text-xs text-muted-foreground">
                  {item.baseMacros.calories} cal · {item.baseMacros.protein}g protein
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Comparison */}
      {selected.length === 0 ? (
        <p className="text-center text-muted-foreground py-12">
          Search and add items above to compare them side by side.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {selected.map((item) => {
            const bestProtein = selected.reduce((best, s) =>
              s.baseMacros.protein > best.baseMacros.protein ? s : best
            );
            const isBest = item.id === bestProtein.id;

            return (
              <Card key={item.id} className={isBest ? 'border-primary' : ''}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="text-xs text-muted-foreground uppercase">
                        {item.restaurantSlug}
                      </p>
                      <h4 className="text-sm font-bold">{item.name}</h4>
                    </div>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-xs text-muted-foreground hover:text-destructive"
                    >
                      Remove
                    </button>
                  </div>

                  {isBest && (
                    <Badge className="bg-primary/20 text-primary text-xs mb-3">
                      Most Protein
                    </Badge>
                  )}
                  {isGymBroApproved(item.baseMacros) && (
                    <Badge className="bg-primary/20 text-primary text-xs mb-3 ml-1">
                      GBA
                    </Badge>
                  )}

                  <div className="space-y-3 mt-3">
                    {macroKeys.map(({ key, label, unit, color }) => (
                      <div key={key} className="flex justify-between">
                        <span className="text-xs text-muted-foreground">{label}</span>
                        <span className={`text-sm font-bold ${color}`}>
                          {item.baseMacros[key]}{unit}
                        </span>
                      </div>
                    ))}
                    <div className="flex justify-between pt-2 border-t border-border">
                      <span className="text-xs text-muted-foreground">Protein/100cal</span>
                      <span className="text-sm font-bold text-muted-foreground">
                        {proteinPerCalorie(item.baseMacros)}g
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
