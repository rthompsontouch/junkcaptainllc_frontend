import { MetadataRoute } from 'next'

const BASE = 'https://junkcaptainllc.com'

export default function sitemap(): MetadataRoute.Sitemap {
  const locationPages = [
    'junk-removal-raleigh',
    'junk-removal-cary',
    'junk-removal-apex',
    'junk-removal-durham',
    'junk-removal-fuquay-varina',
    'junk-removal-angier',
    'junk-removal-lillington',
  ]

  return [
    { url: BASE, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 1 },
    { url: `${BASE}/about`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.8 },
    ...locationPages.map((path) => ({
      url: `${BASE}/${path}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
    { url: `${BASE}/blog`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.6 },
    { url: `${BASE}/blog/how-to-prepare-for-junk-removal`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.6 },
  ]
}
