'use client';

import { useState, useMemo } from 'react';
import { MenuItem } from '@/types/menu';
import { Restaurant } from '@/types/restaurant';
import { MenuItemCard } from '@/components/restaurant/MenuItemCard';
import { ItemCustomizer } from './ItemCustomizer';
import { MealTray } from './MealTray';
import { useMealBuilder } from '@/hooks/useMealBuilder';

interface MealBuilderProps {
  restaurant: Restaurant;
  menuItems: MenuItem[];
}

export function MealBuilder({ restaurant, menuItems }: MealBuilderProps) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [customizingItem, setCustomizingItem] = useState<MenuItem | null>(null);
  const [sortBy, setSortBy] = useState<'protein' | 'calories' | 'name'>('protein');

  const { meal, targets, addItem, removeItem, updateQuantity, clearMeal } =
    useMealBuilder();

  const categories = useMemo(
    () => [...new Set(menuItems.map((i) => i.category))],
    [menuItems]
  );

  const filteredItems = useMemo(() => {
    let items = activeCategory
      ? menuItems.filter((i) => i.category === activeCategory)
      : menuItems;

    switch (sortBy) {
      case 'protein':
        items = [...items].sort((a, b) => b.baseMacros.protein - a.baseMacros.protein);
        break;
      case 'calories':
        items = [...items].sort((a, b) => a.baseMacros.calories - b.baseMacros.calories);
        break;
      case 'name':
        items = [...items].sort((a, b) => a.name.localeCompare(b.name));
        break;
    }

    return items;
  }, [menuItems, activeCategory, sortBy]);

  const handleSelectItem = (item: MenuItem) => {
    if (item.customizationGroups && item.customizationGroups.length > 0) {
      setCustomizingItem(item);
    } else {
      addItem(item);
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-6">
      {/* Menu side */}
      <div className="flex-1">
        {/* Category tabs */}
        <div className="flex gap-2 overflow-x-auto pb-3 mb-4 scrollbar-hide">
          <button
            onClick={() => setActiveCategory(null)}
            className={`shrink-0 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              activeCategory === null
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary text-muted-foreground hover:text-foreground'
            }`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`shrink-0 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                activeCategory === cat
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-muted-foreground hover:text-foreground'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Sort controls */}
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xs text-muted-foreground">Sort by:</span>
          {(['protein', 'calories', 'name'] as const).map((sort) => (
            <button
              key={sort}
              onClick={() => setSortBy(sort)}
              className={`text-xs px-2 py-1 rounded transition-colors ${
                sortBy === sort
                  ? 'bg-primary/20 text-primary font-medium'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {sort === 'protein' ? 'Protein' : sort === 'calories' ? 'Calories' : 'Name'}
            </button>
          ))}
        </div>

        {/* Menu items grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {filteredItems.map((item) => (
            <MenuItemCard key={item.id} item={item} onSelect={handleSelectItem} />
          ))}
        </div>
      </div>

      {/* Meal tray sidebar (desktop) */}
      <div className="w-full md:w-80 shrink-0">
        <MealTray
          items={meal.items}
          totalMacros={meal.totalMacros}
          targets={targets}
          onRemoveItem={removeItem}
          onUpdateQuantity={updateQuantity}
          onClear={clearMeal}
        />

        {/* Order links */}
        {(restaurant.orderLinks.uberEats || restaurant.orderLinks.doorDash) && (
          <div className="mt-4 rounded-xl border border-border bg-card p-4 hidden md:block">
            <h4 className="text-sm font-medium mb-3">Order Now</h4>
            <div className="flex flex-col gap-2">
              {restaurant.orderLinks.uberEats && (
                <a
                  href={restaurant.orderLinks.uberEats}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg border border-border px-3 py-2 text-xs font-medium text-center hover:bg-secondary transition-colors"
                >
                  Uber Eats
                </a>
              )}
              {restaurant.orderLinks.doorDash && (
                <a
                  href={restaurant.orderLinks.doorDash}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg border border-border px-3 py-2 text-xs font-medium text-center hover:bg-secondary transition-colors"
                >
                  DoorDash
                </a>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Item customizer dialog */}
      <ItemCustomizer
        item={customizingItem}
        open={customizingItem !== null}
        onClose={() => setCustomizingItem(null)}
        onAdd={addItem}
      />
    </div>
  );
}
