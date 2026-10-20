import { MetadataRoute } from 'next'
import { BUSINESS_UNITS, NEWS_ARTICLES, JOB_VACANCIES } from '@/lib/data/kkusb-data'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://kkusb.co.id'
  const lastModified = new Date()

  const staticPages: MetadataRoute.Sitemap = [
    { url: `${baseUrl}`, lastModified, changeFrequency: 'weekly', priority: 1.0 },
    { url: `${baseUrl}/tentang-kami`, lastModified, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${baseUrl}/unit-usaha`, lastModified, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/berita`, lastModified, changeFrequency: 'daily', priority: 0.8 },
    { url: `${baseUrl}/karir`, lastModified, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/mitra`, lastModified, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/kontak`, lastModified, changeFrequency: 'yearly', priority: 0.8 },
    { url: `${baseUrl}/dokumen`, lastModified, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/galeri`, lastModified, changeFrequency: 'monthly', priority: 0.6 },
  ]

  const unitPages: MetadataRoute.Sitemap = BUSINESS_UNITS.map(unit => ({
    url: `${baseUrl}/unit-usaha/${unit.slug}`,
    lastModified,
    changeFrequency: 'monthly',
    priority: 0.8
  }))

  const newsPages: MetadataRoute.Sitemap = NEWS_ARTICLES.map(news => ({
    url: `${baseUrl}/berita/${news.slug}`,
    lastModified,
    changeFrequency: 'monthly',
    priority: 0.7
  }))

  const jobPages: MetadataRoute.Sitemap = JOB_VACANCIES.map(job => ({
    url: `${baseUrl}/karir/${job.slug}`,
    lastModified,
    changeFrequency: 'monthly',
    priority: 0.7
  }))

  return [...staticPages, ...unitPages, ...newsPages, ...jobPages]
}
