'use client';

import { useState, useMemo } from 'react';
import { getAllMenuItems } from '@/data';
import { restaurants } from '@/data/restaurants';
import { proteinPerCalorie, isTopPick } from '@/lib/macros';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { DietaryFilters, DietaryIcons } from '@/components/DietaryIcons';

type SortKey = 'protein' | 'calories' | 'carbs' | 'fat' | 'efficiency';
type SortDir = 'asc' | 'desc';

export default function RankingsPage() {
  const allItems = useMemo(() => getAllMenuItems(), []);
  const [sortKey, setSortKey] = useState<SortKey>('protein');
  const [sortDir, setSortDir] = useState<SortDir>('desc');
  const [filterRestaurant, setFilterRestaurant] = useState<string>('');
  const [filterMinProtein, setFilterMinProtein] = useState<string>('');
  const [filterMinCalories, setFilterMinCalories] = useState<string>('100');
  const [filterMaxCalories, setFilterMaxCalories] = useState<string>('1000');
  const [dietaryFilters, setDietaryFilters] = useState<string[]>([]);

  const filtered = useMemo(() => {
    let items = allItems;

    if (filterRestaurant) {
      items = items.filter((i) => i.restaurantSlug === filterRestaurant);
    }
    const minProtein = Number(filterMinProtein);
    if (filterMinProtein && !isNaN(minProtein)) {
      items = items.filter((i) => i.baseMacros.protein >= minProtein);
    }
    const minCal = Number(filterMinCalories);
    if (filterMinCalories && !isNaN(minCal)) {
      items = items.filter((i) => i.baseMacros.calories >= minCal);
    }
    const maxCal = Number(filterMaxCalories);
    if (filterMaxCalories && !isNaN(maxCal)) {
      items = items.filter((i) => i.baseMacros.calories <= maxCal);
    }
    if (dietaryFilters.length > 0) {
      const prefs = dietaryFilters.filter((t) => t !== 'gluten-free-option');
      const restrictions = dietaryFilters.filter((t) => t === 'gluten-free-option');
      items = items.filter((i) => {
        const matchesPref = prefs.length === 0 || prefs.some((t) => i.tags?.includes(t));
        const matchesRestriction = restrictions.every((t) => i.tags?.includes(t));
        return matchesPref && matchesRestriction;
      });
    }

    return items;
  }, [allItems, filterRestaurant, filterMinProtein, filterMinCalories, filterMaxCalories, dietaryFilters]);

  const sorted = useMemo(() => {
    const list = [...filtered];
    list.sort((a, b) => {
      let va: number, vb: number;
      switch (sortKey) {
        case 'protein': va = a.baseMacros.protein; vb = b.baseMacros.protein; break;
        case 'calories': va = a.baseMacros.calories; vb = b.baseMacros.calories; break;
        case 'carbs': va = a.baseMacros.carbs; vb = b.baseMacros.carbs; break;
        case 'fat': va = a.baseMacros.fat; vb = b.baseMacros.fat; break;
        case 'efficiency': va = proteinPerCalorie(a.baseMacros); vb = proteinPerCalorie(b.baseMacros); break;
      }
      return sortDir === 'desc' ? vb - va : va - vb;
    });
    return list;
  }, [filtered, sortKey, sortDir]);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === 'desc' ? 'asc' : 'desc'));
    } else {
      setSortKey(key);
      setSortDir(key === 'calories' || key === 'fat' ? 'asc' : 'desc');
    }
  };

  const SortHeader = ({ label, sortKeyVal }: { label: string; sortKeyVal: SortKey }) => (
    <button
      onClick={() => handleSort(sortKeyVal)}
      className={`text-xs font-medium text-right ${
        sortKey === sortKeyVal ? 'text-primary' : 'text-muted-foreground'
      } hover:text-foreground transition-colors`}
    >
      {label} {sortKey === sortKeyVal && (sortDir === 'desc' ? '↓' : '↑')}
    </button>
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">
        <span className="text-primary">Rankings</span>
      </h1>
      <p className="text-muted-foreground mb-6">
        Every menu item ranked. Default sorted by protein — because that&apos;s what matters.
      </p>

      {/* Dietary filters */}
      <div className="mb-4">
        <p className="text-xs text-muted-foreground mb-2">Dietary preference:</p>
        <DietaryFilters selected={dietaryFilters} onChange={setDietaryFilters} />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6 rounded-xl border border-border bg-card p-4">
        <div>
          <label className="text-xs text-muted-foreground block mb-1">Restaurant</label>
          <select
            value={filterRestaurant}
            onChange={(e) => setFilterRestaurant(e.target.value)}
            className="rounded-lg border border-border bg-background px-3 py-1.5 text-sm"
          >
            <option value="">All</option>
            {restaurants.map((r) => (
              <option key={r.slug} value={r.slug}>{r.shortName}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-xs text-muted-foreground block mb-1">Min protein (g)</label>
          <input
            type="number"
            min={0}
            value={filterMinProtein}
            onChange={(e) => {
              const v = e.target.value;
              if (v === '' || (parseInt(v, 10) >= 0)) setFilterMinProtein(v);
            }}
            placeholder="e.g. 30"
            className="rounded-lg border border-border bg-background px-3 py-1.5 text-sm w-24"
          />
        </div>
        <div>
          <label className="text-xs text-muted-foreground block mb-1">Min calories</label>
          <input
            type="number"
            min={0}
            value={filterMinCalories}
            onChange={(e) => {
              const v = e.target.value;
              if (v === '' || (parseInt(v, 10) >= 0)) setFilterMinCalories(v);
            }}
            placeholder="e.g. 100"
            className="rounded-lg border border-border bg-background px-3 py-1.5 text-sm w-24"
          />
        </div>
        <div>
          <label className="text-xs text-muted-foreground block mb-1">Max calories</label>
          <input
            type="number"
            min={0}
            value={filterMaxCalories}
            onChange={(e) => {
              const v = e.target.value;
              if (v === '' || (parseInt(v, 10) >= 0)) setFilterMaxCalories(v);
            }}
            placeholder="e.g. 1000"
            className="rounded-lg border border-border bg-background px-3 py-1.5 text-sm w-24"
          />
        </div>
      </div>

      {/* Results count */}
      <p className="text-xs text-muted-foreground mb-3">
        Showing {sorted.length} items
      </p>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full text-sm">
          <thead className="bg-card">
            <tr className="border-b border-border">
              <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">#</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Item</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Restaurant</th>
              <th className="text-right px-4 py-3">
                <SortHeader label="Calories" sortKeyVal="calories" />
              </th>
              <th className="text-right px-4 py-3">
                <SortHeader label="Protein" sortKeyVal="protein" />
              </th>
              <th className="text-right px-4 py-3">
                <SortHeader label="Carbs" sortKeyVal="carbs" />
              </th>
              <th className="text-right px-4 py-3">
                <SortHeader label="Fat" sortKeyVal="fat" />
              </th>
              <th className="text-right px-4 py-3">
                <SortHeader label="g/100cal" sortKeyVal="efficiency" />
              </th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((item, i) => (
              <tr
                key={item.id}
                className="border-b border-border/50 hover:bg-secondary/30 transition-colors"
              >
                <td className="px-4 py-3 text-xs text-muted-foreground">{i + 1}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{item.name}</span>
                    {isTopPick(item.baseMacros) && (
                      <Badge className="bg-primary/20 text-primary text-[10px] px-1">Top Pick</Badge>
                    )}
                    <DietaryIcons tags={item.tags} />
                  </div>
                </td>
                <td className="px-4 py-3">
                  <Link
                    href={`/${item.restaurantSlug}`}
                    className="text-muted-foreground hover:text-primary text-xs uppercase"
                  >
                    {item.restaurantSlug}
                  </Link>
                </td>
                <td className="px-4 py-3 text-right text-primary font-bold">
                  {item.baseMacros.calories}
                </td>
                <td className="px-4 py-3 text-right text-blue-400 font-bold">
                  {item.baseMacros.protein}g
                </td>
                <td className="px-4 py-3 text-right text-amber-400">
                  {item.baseMacros.carbs}g
                </td>
                <td className="px-4 py-3 text-right text-orange-400">
                  {item.baseMacros.fat}g
                </td>
                <td className="px-4 py-3 text-right text-muted-foreground">
                  {proteinPerCalorie(item.baseMacros)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
