import { Restaurant } from '@/types/restaurant';

export const restaurants: Restaurant[] = [
  {
    slug: 'subway',
    name: 'Subway',
    shortName: 'Subway',
    brandColor: '#008C15',
    websiteUrl: 'https://www.subway.com/en-AU',
    nutritionSourceUrl: 'https://www.subway.com/en-AU/MenuNutrition/Nutrition',
    categories: ['Classic Subs', 'Signature Subs', 'Wraps', 'Salads', 'Sides'],
    lastUpdated: '2026-03-23',
    orderLinks: {
      uberEats: 'https://www.ubereats.com/au/brand/subway',
      doorDash: 'https://www.doordash.com/en-AU/store/subway',
      menulog: 'https://www.menulog.com.au/restaurants-subway',
    },
  },
  {
    slug: 'gyg',
    name: 'Guzman y Gomez',
    shortName: 'GYG',
    brandColor: '#FFD100',
    websiteUrl: 'https://www.guzmanygomez.com.au',
    nutritionSourceUrl: 'https://www.guzmanygomez.com.au/nutrition',
    categories: ['Burritos', 'Bowls', 'Tacos', 'Nachos', 'Sides'],
    lastUpdated: '2026-03-23',
    orderLinks: {
      uberEats: 'https://www.ubereats.com/au/brand/guzman-y-gomez',
      doorDash: 'https://www.doordash.com/en-AU/store/guzman-y-gomez',
      menulog: 'https://www.menulog.com.au/restaurants-guzman-y-gomez',
    },
  },
  {
    slug: 'fishbowl',
    name: 'Fishbowl',
    shortName: 'Fishbowl',
    brandColor: '#00B4D8',
    websiteUrl: 'https://www.fishbowl.com.au',
    nutritionSourceUrl: 'https://www.fishbowl.com.au/nutrition',
    categories: ['Bowls', 'Salads', 'Sides'],
    lastUpdated: '2026-03-23',
    orderLinks: {
      uberEats: 'https://www.ubereats.com/au/brand/fishbowl',
      doorDash: 'https://www.doordash.com/en-AU/store/fishbowl',
    },
  },
  {
    slug: 'grilld',
    name: "Grill'd",
    shortName: "Grill'd",
    brandColor: '#D32F2F',
    websiteUrl: 'https://www.grilld.com.au',
    nutritionSourceUrl: 'https://www.grilld.com.au/menu',
    categories: ['Burgers', 'Salads', 'Sides', 'Kids'],
    lastUpdated: '2026-03-23',
    orderLinks: {
      uberEats: 'https://www.ubereats.com/au/brand/grilld',
      doorDash: 'https://www.doordash.com/en-AU/store/grilld',
      menulog: 'https://www.menulog.com.au/restaurants-grilld',
    },
  },
  {
    slug: 'oporto',
    name: 'Oporto',
    shortName: 'Oporto',
    brandColor: '#E65100',
    websiteUrl: 'https://www.oporto.com.au',
    nutritionSourceUrl: 'https://www.oporto.com.au/nutrition',
    categories: ['Burgers', 'Wraps', 'Bowls', 'Sides'],
    lastUpdated: '2026-03-23',
    orderLinks: {
      uberEats: 'https://www.ubereats.com/au/brand/oporto',
      doorDash: 'https://www.doordash.com/en-AU/store/oporto',
      menulog: 'https://www.menulog.com.au/restaurants-oporto',
    },
  },
  {
    slug: 'nandos',
    name: "Nando's",
    shortName: "Nando's",
    brandColor: '#D32F2F',
    websiteUrl: 'https://www.nandos.com.au',
    nutritionSourceUrl: 'https://www.nandos.com.au/food/nutrition',
    categories: ['Chicken', 'Burgers', 'Wraps', 'Sides', 'Salads'],
    lastUpdated: '2026-03-23',
    orderLinks: {
      uberEats: 'https://www.ubereats.com/au/brand/nandos',
      doorDash: 'https://www.doordash.com/en-AU/store/nandos',
      menulog: 'https://www.menulog.com.au/restaurants-nandos',
    },
  },
];

export function getRestaurant(slug: string): Restaurant | undefined {
  return restaurants.find((r) => r.slug === slug);
}

export function getAllRestaurantSlugs(): string[] {
  return restaurants.map((r) => r.slug);
}
