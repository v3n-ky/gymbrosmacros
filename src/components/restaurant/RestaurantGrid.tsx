import { restaurants } from '@/data/restaurants';
import { getMenuItems } from '@/data';
import { RestaurantCard } from './RestaurantCard';

export function RestaurantGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {restaurants.map((restaurant) => (
        <RestaurantCard
          key={restaurant.slug}
          restaurant={restaurant}
          menuItems={getMenuItems(restaurant.slug)}
        />
      ))}
    </div>
  );
}
