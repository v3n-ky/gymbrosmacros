'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useProfiles } from '@/hooks/useProfiles';
import { getAllMenuItems } from '@/data';
import { computeItemMacros } from '@/lib/macros';
import { buildOrderLabel } from '@/lib/meal-finder';
import { SavedItem, SavedMeal } from '@/types/profile';
import { useMealBuilder } from '@/hooks/useMealBuilder';

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback: silently fail
    }
  };

  return (
    <Button
      size="sm"
      variant="outline"
      className="text-xs h-7 px-3 border-border text-muted-foreground hover:border-primary hover:text-primary"
      onClick={handleCopy}
    >
      {copied ? 'Copied!' : '📋 Copy order'}
    </Button>
  );
}

function SavedMealCard({ meal, onDelete, onAddAll }: {
  meal: SavedMeal;
  onDelete: () => void;
  onAddAll: () => void;
}) {
  const allMenuItems = useMemo(() => getAllMenuItems(), []);

  const orderLines = meal.items.map((item) => {
    const menuItem = allMenuItems.find((m) => m.id === item.itemId);
    const label = menuItem
      ? buildOrderLabel(menuItem, item.selectedOptions) || menuItem.name
      : item.itemId;
    const qty = item.quantity > 1 ? `×${item.quantity} ` : '';
    return `${qty}${menuItem?.name ?? item.itemId}${label && label !== menuItem?.name ? ` — ${label}` : ''}`;
  });

  const copyText = orderLines.join('\n');

  return (
    <Card className="flex flex-col">
      <CardContent className="p-4 flex flex-col gap-3">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <p className="text-xs text-muted-foreground uppercase tracking-wide mb-0.5">Saved meal</p>
            <h4 className="text-sm font-semibold leading-tight">{meal.name}</h4>
          </div>
          <button
            onClick={onDelete}
            className="text-muted-foreground hover:text-destructive transition-colors flex-shrink-0 text-sm leading-none mt-0.5"
            aria-label="Delete saved meal"
          >
            ✕
          </button>
        </div>

        {/* Item list */}
        <div className="space-y-1.5">
          {meal.items.map((item, i) => {
            const menuItem = allMenuItems.find((m) => m.id === item.itemId);
            const orderLabel = menuItem ? buildOrderLabel(menuItem, item.selectedOptions) : '';
            return (
              <div key={i} className="rounded bg-secondary/40 px-3 py-1.5">
                <div className="flex items-baseline justify-between gap-2">
                  <p className="text-xs font-medium truncate">
                    {item.quantity > 1 && (
                      <span className="text-primary font-bold mr-1">×{item.quantity}</span>
                    )}
                    {menuItem?.name ?? item.itemId}
                  </p>
                  <p className="text-xs text-muted-foreground shrink-0">
                    {item.computedMacros.calories} cal · {item.computedMacros.protein}g P
                  </p>
                </div>
                {orderLabel && (
                  <p className="text-[11px] text-primary/70 leading-tight mt-0.5 truncate">{orderLabel}</p>
                )}
              </div>
            );
          })}
        </div>

        {/* Total macros */}
        <div className="grid grid-cols-4 gap-1 text-center">
          <div>
            <p className="text-[10px] text-muted-foreground">Cal</p>
            <p className="text-sm font-bold text-primary">{meal.totalMacros.calories}</p>
          </div>
          <div>
            <p className="text-[10px] text-muted-foreground">Protein</p>
            <p className="text-sm font-bold text-blue-400">{meal.totalMacros.protein}g</p>
          </div>
          <div>
            <p className="text-[10px] text-muted-foreground">Carbs</p>
            <p className="text-sm font-bold text-amber-400">{meal.totalMacros.carbs}g</p>
          </div>
          <div>
            <p className="text-[10px] text-muted-foreground">Fat</p>
            <p className="text-sm font-bold text-orange-400">{meal.totalMacros.fat}g</p>
          </div>
        </div>

        <div className="flex gap-2">
          <CopyButton text={copyText} />
          <Button
            size="sm"
            variant="outline"
            className="text-xs h-7 px-3 border-primary/40 text-primary hover:bg-primary/10"
            onClick={onAddAll}
          >
            + Add all to Meal
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function FavoriteCard({ saved, onRemove, onAdd }: {
  saved: SavedItem;
  onRemove: () => void;
  onAdd: () => void;
}) {
  const allItems = useMemo(() => getAllMenuItems(), []);
  const item = allItems.find((i) => i.id === saved.itemId);

  if (!item) return null;

  const macros = computeItemMacros(item, saved.selectedOptions);
  const orderLabel = buildOrderLabel(item, saved.selectedOptions) || item.name;

  return (
    <Card className="flex flex-col">
      <CardContent className="p-4 flex flex-col gap-3">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <Link
              href={`/${item.restaurantSlug}`}
              className="text-xs text-muted-foreground hover:text-primary uppercase tracking-wide"
            >
              {item.restaurantSlug}
            </Link>
            <h4 className="text-sm font-semibold leading-tight">{item.name}</h4>
            {orderLabel !== item.name && (
              <p className="text-xs text-muted-foreground mt-0.5 leading-snug">{orderLabel}</p>
            )}
          </div>
          <button
            onClick={onRemove}
            className="text-muted-foreground hover:text-destructive transition-colors flex-shrink-0 text-lg leading-none"
            aria-label="Remove from favorites"
          >
            ♥
          </button>
        </div>

        <div className="grid grid-cols-4 gap-1 text-center">
          <div>
            <p className="text-[10px] text-muted-foreground">Cal</p>
            <p className="text-sm font-bold text-primary">{macros.calories}</p>
          </div>
          <div>
            <p className="text-[10px] text-muted-foreground">Protein</p>
            <p className="text-sm font-bold text-blue-400">{macros.protein}g</p>
          </div>
          <div>
            <p className="text-[10px] text-muted-foreground">Carbs</p>
            <p className="text-sm font-bold text-amber-400">{macros.carbs}g</p>
          </div>
          <div>
            <p className="text-[10px] text-muted-foreground">Fat</p>
            <p className="text-sm font-bold text-orange-400">{macros.fat}g</p>
          </div>
        </div>

        <div className="flex gap-2">
          <CopyButton text={orderLabel} />
          <Button
            size="sm"
            variant="outline"
            className="text-xs h-7 px-3 border-primary/40 text-primary hover:bg-primary/10"
            onClick={onAdd}
          >
            + Add to Meal
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default function FavoritesPage() {
  const { activeProfile, activeId, profiles, setActiveId, toggleFavorite, removeSavedMeal } = useProfiles();
  const { addItem } = useMealBuilder();
  const allItems = useMemo(() => getAllMenuItems(), []);

  const favorites = activeProfile?.favorites ?? [];
  const savedMeals = activeProfile?.savedMeals ?? [];

  // Group individual favorites by restaurant
  const grouped = useMemo(() => {
    const map: Record<string, SavedItem[]> = {};
    for (const fav of favorites) {
      if (!map[fav.restaurantSlug]) map[fav.restaurantSlug] = [];
      map[fav.restaurantSlug].push(fav);
    }
    return map;
  }, [favorites]);

  const handleAdd = (saved: SavedItem) => {
    const item = allItems.find((i) => i.id === saved.itemId);
    if (item) addItem(item, saved.selectedOptions);
  };

  const handleAddAllFromMeal = (meal: SavedMeal) => {
    for (const savedItem of meal.items) {
      const menuItem = allItems.find((m) => m.id === savedItem.itemId);
      if (menuItem) {
        for (let q = 0; q < savedItem.quantity; q++) {
          addItem(menuItem, savedItem.selectedOptions);
        }
      }
    }
  };

  const isEmpty = favorites.length === 0 && savedMeals.length === 0;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">
            <span className="text-primary">Favorites</span>
          </h1>
          <p className="text-muted-foreground mt-1">
            Your saved meals and customisations for {activeProfile?.label}.
          </p>
        </div>
        {/* Profile switcher inline */}
        <div className="flex items-center gap-0.5 bg-secondary rounded-lg p-0.5">
          {(['A', 'B'] as const).map((id) => (
            <button
              key={id}
              onClick={() => setActiveId(id)}
              className={`px-4 py-1.5 rounded-md text-sm font-semibold transition-colors ${
                activeId === id
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {profiles[id]?.label ?? id}
            </button>
          ))}
        </div>
      </div>

      {isEmpty ? (
        <div className="text-center py-16">
          <p className="text-muted-foreground mb-2">No favorites saved yet for {activeProfile?.label}.</p>
          <p className="text-xs text-muted-foreground mb-6">
            Tap ♡ on any result in{' '}
            <Link href="/find" className="text-primary hover:underline">Find a Meal</Link>
            {' '}to save individual items, or use{' '}
            <span className="text-primary">♥ Save this meal</span>{' '}in the tray to save a full meal.
          </p>
        </div>
      ) : (
        <div className="space-y-10">
          {/* Saved meals section */}
          {savedMeals.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold mb-3">Saved Meals</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {savedMeals.map((meal) => (
                  <SavedMealCard
                    key={meal.id}
                    meal={meal}
                    onDelete={() => removeSavedMeal(meal.id)}
                    onAddAll={() => handleAddAllFromMeal(meal)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Individual favorites grouped by restaurant */}
          {favorites.length > 0 && (
            <div>
              {savedMeals.length > 0 && (
                <h2 className="text-lg font-semibold mb-3">Saved Items</h2>
              )}
              <div className="space-y-8">
                {Object.entries(grouped).map(([slug, items]) => (
                  <div key={slug}>
                    <h2 className={`font-semibold capitalize mb-3 ${savedMeals.length > 0 ? 'text-base' : 'text-lg'}`}>
                      {slug}
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {items.map((saved) => (
                        <FavoriteCard
                          key={`${saved.itemId}-${saved.savedAt}`}
                          saved={saved}
                          onRemove={() => toggleFavorite(saved)}
                          onAdd={() => handleAdd(saved)}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
