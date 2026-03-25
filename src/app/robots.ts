import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: '*', allow: '/' },
      // Block AI training crawlers from ingesting curated nutrition data
      { userAgent: 'GPTBot', disallow: '/' },
      { userAgent: 'ChatGPT-User', disallow: '/' },
      { userAgent: 'ClaudeBot', disallow: '/' },
      { userAgent: 'anthropic-ai', disallow: '/' },
      { userAgent: 'Google-Extended', disallow: '/' },
      { userAgent: 'Googlebot-Extended', disallow: '/' },
      { userAgent: 'CCBot', disallow: '/' },
      { userAgent: 'FacebookBot', disallow: '/' },
      { userAgent: 'Applebot-Extended', disallow: '/' },
      { userAgent: 'cohere-ai', disallow: '/' },
      { userAgent: 'PerplexityBot', disallow: '/' },
    ],
    sitemap: 'https://eatmacros.com.au/sitemap.xml',
  };
}
