import type { MetadataRoute } from 'next';
import { DOCS } from './docs/content';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://riscent.com';

  const staticPages: MetadataRoute.Sitemap = [
    { url: base, lastModified: new Date(), changeFrequency: 'weekly', priority: 1.0 },
    { url: `${base}/docs`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${base}/docs/playbook`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.95 },
    { url: `${base}/research`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${base}/thoughts`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
  ];

  const docPages: MetadataRoute.Sitemap = DOCS.map((doc) => ({
    url: `${base}/docs/${doc.slug}`,
    lastModified: new Date(doc.date),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  const sectionPages: MetadataRoute.Sitemap = DOCS.flatMap((doc) =>
    doc.article.map((section) => ({
      url: `${base}/docs/${doc.slug}/${section.heading.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}`,
      lastModified: new Date(doc.date),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }))
  );

  return [...staticPages, ...docPages, ...sectionPages];
}
