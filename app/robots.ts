import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://www.prohostix.com'

    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: ['/admin/'],
            },
            {
                userAgent: ['GPTBot', 'Google-Extended', 'PerplexityBot', 'anthropic-ai', 'Claude-Web', 'cohere-ai'],
                allow: '/',
                disallow: ['/admin/'],
            }
        ],
        sitemap: `${baseUrl}/sitemap.xml`,
    }
}
