import { Restaurant } from '@/types/restaurant';

export const restaurants: Restaurant[] = [
  {
    slug: 'subway',
    name: 'Subway',
    shortName: 'Subway',
    brandColor: '#008C15',
    websiteUrl: 'https://www.subway.com/en-AU',
    nutritionSourceUrl: 'https://www.subway.com/en-AU/MenuNutrition/Nutrition',
    categories: ['Classic Subs', 'Signature Subs'],
    lastUpdated: '2026-03-23',
    orderLinks: {
      uberEats: 'https://www.ubereats.com/au/brand/subway',
      doorDash: 'https://www.doordash.com/en-AU/store/subway',
    },
  },
  {
    slug: 'gyg',
    name: 'Guzman y Gomez',
    shortName: 'GYG',
    brandColor: '#FFD100',
    websiteUrl: 'https://www.guzmanygomez.com.au',
    nutritionSourceUrl: 'https://www.guzmanygomez.com.au/nutrition',
    categories: ['Burritos', 'Bowls', 'Tacos', 'Nachos'],
    lastUpdated: '2026-03-23',
    orderLinks: {
      uberEats: 'https://www.ubereats.com/au/brand/guzman-y-gomez',
      doorDash: 'https://www.doordash.com/en-AU/store/guzman-y-gomez',
    },
  },
  {
    slug: 'fishbowl',
    name: 'Fishbowl',
    shortName: 'Fishbowl',
    brandColor: '#00B4D8',
    websiteUrl: 'https://www.fishbowl.com.au',
    nutritionSourceUrl: 'https://fishbowl.com.au/media/site/a7c38cedc6-1765146075/fishbowl-nutritional-overview-dec-25.pdf',
    categories: ['House Favourites', 'Warm Bowls', 'Street Food', 'Build Your Own'],
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
    categories: ['Burgers', 'Salads', 'Sides'],
    lastUpdated: '2026-03-23',
    orderLinks: {
      uberEats: 'https://www.ubereats.com/au/brand/grilld',
      doorDash: 'https://www.doordash.com/en-AU/store/grilld',
    },
  },
  {
    slug: 'oporto',
    name: 'Oporto',
    shortName: 'Oporto',
    brandColor: '#E65100',
    websiteUrl: 'https://www.oporto.com.au',
    nutritionSourceUrl: 'https://www.oporto.com.au/nutrition',
    categories: ['Burgers', 'Rappas', 'Bowls', 'Sides'],
    lastUpdated: '2026-03-23',
    orderLinks: {
      uberEats: 'https://www.ubereats.com/au/brand/oporto',
      doorDash: 'https://www.doordash.com/en-AU/store/oporto',
    },
  },
  {
    slug: 'nandos',
    name: "Nando's",
    shortName: "Nando's",
    brandColor: '#D32F2F',
    websiteUrl: 'https://www.nandos.com.au',
    nutritionSourceUrl: 'https://www.nandos.com.au/menu',
    categories: ['Chicken', 'Wraps & Burgers', 'Salads & Bowls', 'Sides'],
    lastUpdated: '2026-03-23',
    orderLinks: {
      uberEats: 'https://www.ubereats.com/au/brand/nandos',
      doorDash: 'https://www.doordash.com/en-AU/store/nandos',
    },
  },
];

export function getRestaurant(slug: string): Restaurant | undefined {
  return restaurants.find((r) => r.slug === slug);
}

export function getAllRestaurantSlugs(): string[] {
  return restaurants.map((r) => r.slug);
}
