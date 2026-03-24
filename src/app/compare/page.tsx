'use client';

import { useState, useMemo } from 'react';
import { getAllMenuItems } from '@/data';
import { restaurants } from '@/data/restaurants';
import { MenuItem } from '@/types/menu';
import { Macros } from '@/types/macros';
import { proteinPerCalorie, isTopPick, computeItemMacros } from '@/lib/macros';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { ItemCustomizer } from '@/components/meal-builder/ItemCustomizer';

interface CompareEntry {
  item: MenuItem;
  selectedOptions: Record<string, string[]>;
  macros: Macros;
}

export default function ComparePage() {
  const allItems = useMemo(() => getAllMenuItems(), []);
  const [entries, setEntries] = useState<CompareEntry[]>([]);
  const [search, setSearch] = useState('');
  const [filterRestaurant, setFilterRestaurant] = useState('');
  const [customizingItem, setCustomizingItem] = useState<MenuItem | null>(null);

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

  const handleSelectItem = (item: MenuItem) => {
    if (entries.length >= 4) return;
    if (item.customizationGroups && item.customizationGroups.length > 0) {
      setCustomizingItem(item);
    } else {
      addEntry(item, {});
    }
  };

  const addEntry = (item: MenuItem, selectedOptions: Record<string, string[]>) => {
    const macros = computeItemMacros(item, selectedOptions);
    setEntries((prev) => [...prev, { item, selectedOptions, macros }]);
    setSearch('');
  };

  const removeEntry = (index: number) => {
    setEntries((prev) => prev.filter((_, i) => i !== index));
  };

  const getOptionLabels = (entry: CompareEntry): string[] => {
    const labels: string[] = [];
    for (const group of entry.item.customizationGroups ?? []) {
      const selected = entry.selectedOptions[group.id] ?? [];
      for (const optionId of selected) {
        const option = group.options.find((o) => o.id === optionId);
        if (option && !option.isDefault) {
          labels.push(option.name);
        }
      }
    }
    return labels;
  };

  const macroKeys = [
    { key: 'calories' as const, label: 'Calories', unit: '', color: 'text-primary' },
    { key: 'protein' as const, label: 'Protein', unit: 'g', color: 'text-blue-400' },
    { key: 'carbs' as const, label: 'Carbs', unit: 'g', color: 'text-amber-400' },
    { key: 'fat' as const, label: 'Fat', unit: 'g', color: 'text-orange-400' },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">
        <span className="text-primary">Compare</span> Items
      </h1>
      <p className="text-muted-foreground mb-6">
        Compare up to 4 items side by side. Customise each item before comparing.
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
            disabled={entries.length >= 4}
          />
        </div>
        {searchResults.length > 0 && (
          <div className="space-y-1 max-h-48 overflow-y-auto">
            {searchResults.map((item) => (
              <button
                key={item.id}
                onClick={() => handleSelectItem(item)}
                disabled={entries.length >= 4}
                className="w-full text-left rounded-lg px-3 py-2 text-sm hover:bg-secondary/50 transition-colors flex justify-between disabled:opacity-40"
              >
                <span>
                  <span className="font-medium">{item.name}</span>
                  <span className="text-xs text-muted-foreground ml-2">
                    {item.restaurantSlug.toUpperCase()}
                  </span>
                  {item.customizationGroups && item.customizationGroups.length > 0 && (
                    <span className="text-xs text-primary ml-2">Customisable</span>
                  )}
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
      {entries.length === 0 ? (
        <p className="text-center text-muted-foreground py-12">
          Search and add items above to compare them side by side.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {entries.map((entry, index) => {
            const bestProtein = entries.reduce((best, e) =>
              e.macros.protein > best.macros.protein ? e : best
            );
            const isBest = entry === bestProtein;
            const customLabels = getOptionLabels(entry);

            return (
              <Card key={`${entry.item.id}-${index}`} className={isBest ? 'border-primary' : ''}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="text-xs text-muted-foreground uppercase">
                        {entry.item.restaurantSlug}
                      </p>
                      <h4 className="text-sm font-bold">{entry.item.name}</h4>
                    </div>
                    <button
                      onClick={() => removeEntry(index)}
                      className="text-xs text-muted-foreground hover:text-destructive"
                    >
                      Remove
                    </button>
                  </div>

                  {/* Show customisations */}
                  {customLabels.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {customLabels.map((label) => (
                        <Badge key={label} variant="secondary" className="text-[10px]">
                          {label}
                        </Badge>
                      ))}
                    </div>
                  )}

                  <div className="flex gap-1 mb-3">
                    {isBest && (
                      <Badge className="bg-primary/20 text-primary text-xs">
                        Most Protein
                      </Badge>
                    )}
                    {isTopPick(entry.macros) && (
                      <Badge className="bg-primary/20 text-primary text-xs">
                        Top Pick
                      </Badge>
                    )}
                  </div>

                  <div className="space-y-3">
                    {macroKeys.map(({ key, label, unit, color }) => (
                      <div key={key} className="flex justify-between">
                        <span className="text-xs text-muted-foreground">{label}</span>
                        <span className={`text-sm font-bold ${color}`}>
                          {entry.macros[key]}{unit}
                        </span>
                      </div>
                    ))}
                    <div className="flex justify-between pt-2 border-t border-border">
                      <span className="text-xs text-muted-foreground">Protein/100cal</span>
                      <span className="text-sm font-bold text-muted-foreground">
                        {proteinPerCalorie(entry.macros)}g
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Item customizer dialog */}
      <ItemCustomizer
        item={customizingItem}
        open={customizingItem !== null}
        onClose={() => setCustomizingItem(null)}
        onAdd={addEntry}
        submitLabel="Add to Compare"
      />
    </div>
  );
}
