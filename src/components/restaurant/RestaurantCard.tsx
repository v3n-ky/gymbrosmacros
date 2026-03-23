import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Restaurant } from '@/types/restaurant';
import { MenuItem } from '@/types/menu';
import { proteinPerCalorie } from '@/lib/macros';

interface RestaurantCardProps {
  restaurant: Restaurant;
  menuItems: MenuItem[];
}

export function RestaurantCard({ restaurant, menuItems }: RestaurantCardProps) {
  const highestProtein = menuItems.reduce(
    (best, item) =>
      item.baseMacros.protein > (best?.baseMacros.protein ?? 0) ? item : best,
    menuItems[0]
  );

  return (
    <Link href={`/${restaurant.slug}`}>
      <Card className="group hover:border-primary/50 transition-all duration-200 hover:shadow-lg hover:shadow-primary/5 cursor-pointer h-full">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3
                className="text-lg font-bold group-hover:text-primary transition-colors"
                style={{ color: restaurant.brandColor }}
              >
                {restaurant.name}
              </h3>
              <p className="text-xs text-muted-foreground mt-1">
                {menuItems.length} items
              </p>
            </div>
            <Badge variant="secondary" className="text-xs">
              {restaurant.categories.length} categories
            </Badge>
          </div>

          {highestProtein && (
            <div className="mt-4 rounded-lg bg-secondary/50 p-3">
              <p className="text-xs text-muted-foreground mb-1">Best protein</p>
              <p className="text-sm font-medium text-foreground">
                {highestProtein.name}
              </p>
              <div className="flex gap-3 mt-2 text-xs">
                <span className="text-primary font-bold">
                  {highestProtein.baseMacros.protein}g protein
                </span>
                <span className="text-muted-foreground">
                  {highestProtein.baseMacros.calories} cal
                </span>
                <span className="text-muted-foreground">
                  {proteinPerCalorie(highestProtein.baseMacros)}g/100cal
                </span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
