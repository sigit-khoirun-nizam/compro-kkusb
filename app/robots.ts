import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/portal-pelamar/', '/api/']
      }
    ],
    sitemap: 'https://kkusb.co.id/sitemap.xml'
  }
}
