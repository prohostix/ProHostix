import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://www.prohostix.com'

    // Define static routes
    const routes = [
        '',
        '/about',
        '/services',
        '/solutions',
        '/case-studies',
        '/careers',
        '/company',
        '/lets-talk',
        '/blog',
        '/contact'
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: route === '' ? 1 : 0.8,
    }))

    return [...routes]
}
