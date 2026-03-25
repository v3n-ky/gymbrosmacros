/**
 * Regression test: restaurant categories in restaurants.ts must stay in sync
 * with the category values used on menu items.
 *
 * Catches the class of bug where a menu item category is renamed (e.g.
 * 'Wraps' → 'Rappas') but the restaurants.ts categories array is not updated,
 * causing the meal-finder category filter to silently drop those items.
 */

import { describe, it, expect } from 'vitest';
import { restaurants } from '@/data/restaurants';
import { subwayMenu } from '@/data/subway/menu';
import { gygMenu } from '@/data/gyg/menu';
import { fishbowlMenu } from '@/data/fishbowl/menu';
import { grilldMenu } from '@/data/grilld/menu';
import { oportoMenu } from '@/data/oporto/menu';
import { nandosMenu } from '@/data/nandos/menu';
import { MenuItem } from '@/types/menu';

const allMenus: Record<string, MenuItem[]> = {
  subway: subwayMenu,
  gyg: gygMenu,
  fishbowl: fishbowlMenu,
  grilld: grilldMenu,
  oporto: oportoMenu,
  nandos: nandosMenu,
};

describe('restaurant category sync', () => {
  for (const restaurant of restaurants) {
    const menu = allMenus[restaurant.slug];
    if (!menu) continue;

    it(`every item in ${restaurant.slug} menu has a category listed in restaurants.ts`, () => {
      const declared = new Set(restaurant.categories);
      const unknown = menu
        .map((item) => item.category)
        .filter((cat) => !declared.has(cat));

      expect(unknown, `Items with undeclared categories: ${[...new Set(unknown)].join(', ')}`).toHaveLength(0);
    });

    it(`every category declared for ${restaurant.slug} is used by at least one menu item`, () => {
      const used = new Set(menu.map((item) => item.category));
      const unused = restaurant.categories.filter((cat) => !used.has(cat));

      expect(unused, `Declared categories with no items: ${unused.join(', ')}`).toHaveLength(0);
    });
  }
});
