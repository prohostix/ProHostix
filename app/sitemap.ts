import { MetadataRoute } from 'next'

// Configuration for site base URL
const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://www.prohostix.com'
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    // skip dynamic fetching if we're in build and no production API URL is available
    // to prevent ECONNREFUSED from localhost
    const isBuildPhase = typeof window === 'undefined' && !process.env.NEXT_PUBLIC_API_URL && API_URL.includes('localhost');

    // Define static routes
    const staticPaths = [
        '',
        '/services',
        '/solutions',
        '/case-studies',
        '/careers',
        '/company',
        '/lets-talk',
        '/blog',
        '/contact'
    ];

    const staticRoutes = staticPaths.map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: route === '' ? 1 : 0.8,
    }));

    if (isBuildPhase) {
        return staticRoutes;
    }

    try {
        // Fetch dynamic slugs in parallel
        const [blogsRes, servicesRes, solutionsRes] = await Promise.all([
            fetch(`${API_URL}/blogs`, { next: { revalidate: 3600 } }),
            fetch(`${API_URL}/services`, { next: { revalidate: 3600 } }),
            fetch(`${API_URL}/solutions`, { next: { revalidate: 3600 } })
        ]);

        const [blogs, services, solutions] = await Promise.all([
            blogsRes.ok ? blogsRes.json() : [],
            servicesRes.ok ? servicesRes.json() : [],
            solutionsRes.ok ? solutionsRes.json() : []
        ]);

        // Blog Routes
        const blogRoutes = Array.isArray(blogs) ? blogs.map((post: any) => ({
            url: `${baseUrl}/blog/${post.slug}`,
            lastModified: new Date(post.updatedAt || post.createdAt || new Date()),
            changeFrequency: 'daily' as const,
            priority: 0.6,
        })) : [];

        // Service Routes
        const serviceRoutes = Array.isArray(services) ? services.map((service: any) => ({
            url: `${baseUrl}/services/${service.slug}`,
            lastModified: new Date(service.updatedAt || service.createdAt || new Date()),
            changeFrequency: 'monthly' as const,
            priority: 0.7,
        })) : [];

        // Solution Routes
        const solutionRoutes = Array.isArray(solutions) ? solutions.map((solution: any) => ({
            url: `${baseUrl}/solutions/${solution.slug}`,
            lastModified: new Date(solution.updatedAt || solution.createdAt || new Date()),
            changeFrequency: 'monthly' as const,
            priority: 0.7,
        })) : [];

        return [...staticRoutes, ...blogRoutes, ...serviceRoutes, ...solutionRoutes];
    } catch (error) {
        console.error('Error generating dynamic sitemap:', error);
        return staticRoutes;
    }
}

