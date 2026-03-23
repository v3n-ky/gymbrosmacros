import type { MetadataRoute } from 'next';
import { getAllRestaurantSlugs } from '@/data';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://eatmacros.com.au';
  const restaurantSlugs = getAllRestaurantSlugs();

  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: `${baseUrl}/find`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/rankings`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/compare`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
  ];

  const restaurantPages: MetadataRoute.Sitemap = restaurantSlugs.map((slug) => ({
    url: `${baseUrl}/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }));

  return [...staticPages, ...restaurantPages];
}
