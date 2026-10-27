import type { MetadataRoute } from 'next';
import { siteConfig } from '@/lib/config/site';
import { demoSalons } from '@/lib/demo-data';
import { SRI_LANKA_DISTRICTS } from '@/lib/config/districts';
import { SALON_CATEGORIES } from '@/lib/config/categories';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = siteConfig.url;

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/salons`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/for-salons`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/booking/manage`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ];

  const districtRoutes: MetadataRoute.Sitemap = SRI_LANKA_DISTRICTS.map((d) => ({
    url: `${baseUrl}/salons/in/${d.id}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  const categoryRoutes: MetadataRoute.Sitemap = SALON_CATEGORIES.map((c) => ({
    url: `${baseUrl}/salons/category/${c.id}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  const salonRoutes: MetadataRoute.Sitemap = demoSalons.map((s) => ({
    url: `${baseUrl}/salons/${s.slug}`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 0.85,
  }));

  return [...staticRoutes, ...districtRoutes, ...categoryRoutes, ...salonRoutes];
}
