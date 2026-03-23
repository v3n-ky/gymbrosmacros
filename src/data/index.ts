import { MenuItem } from '@/types/menu';
import { subwayMenu } from './subway/menu';
import { gygMenu } from './gyg/menu';
import { fishbowlMenu } from './fishbowl/menu';
import { grilldMenu } from './grilld/menu';
import { oportoMenu } from './oporto/menu';
import { nandosMenu } from './nandos/menu';

export { restaurants, getRestaurant, getAllRestaurantSlugs } from './restaurants';

const menusByRestaurant: Record<string, MenuItem[]> = {
  subway: subwayMenu,
  gyg: gygMenu,
  fishbowl: fishbowlMenu,
  grilld: grilldMenu,
  oporto: oportoMenu,
  nandos: nandosMenu,
};

export function getMenuItems(restaurantSlug: string): MenuItem[] {
  return menusByRestaurant[restaurantSlug] ?? [];
}

export function getAllMenuItems(): MenuItem[] {
  return Object.values(menusByRestaurant).flat();
}

export function getCategories(restaurantSlug: string): string[] {
  const items = getMenuItems(restaurantSlug);
  return [...new Set(items.map((i) => i.category))];
}
