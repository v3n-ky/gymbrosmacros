import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { getRestaurant, getAllRestaurantSlugs } from '@/data';
import { getMenuItems } from '@/data';
import { MealBuilder } from '@/components/meal-builder/MealBuilder';

export async function generateStaticParams() {
  return getAllRestaurantSlugs().map((slug) => ({ restaurant: slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ restaurant: string }>;
}): Promise<Metadata> {
  const { restaurant: slug } = await params;
  const restaurant = getRestaurant(slug);
  if (!restaurant) return {};

  return {
    title: `${restaurant.name} Macros & Nutrition`,
    description: `Calculate macros for ${restaurant.name} menu items. Calories, protein, carbs, and fat for every item with customisations.`,
  };
}

export default async function RestaurantPage({
  params,
}: {
  params: Promise<{ restaurant: string }>;
}) {
  const { restaurant: slug } = await params;
  const restaurant = getRestaurant(slug);

  if (!restaurant) {
    notFound();
  }

  const menuItems = getMenuItems(slug);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">
          <span style={{ color: restaurant.brandColor }}>{restaurant.name}</span>{' '}
          <span className="text-foreground">Macros</span>
        </h1>
        <p className="text-muted-foreground">
          {menuItems.length} items · Nutritional data last verified{' '}
          {restaurant.lastUpdated}
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          Source:{' '}
          <a
            href={restaurant.nutritionSourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-primary"
          >
            Official nutrition info
          </a>
        </p>
      </div>

      <MealBuilder restaurant={restaurant} menuItems={menuItems} />
    </div>
  );
}
