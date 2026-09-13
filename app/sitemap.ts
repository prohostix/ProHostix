import { MetadataRoute } from 'next'

// Configuration for site base URL
const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://www.prohostix.com'
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    // Define static routes
    const staticPaths = [
        '',
        '/services',
        '/solutions',
        '/case-studies',
        '/careers',
        '/company',
        '/company/ceo',
        '/lets-talk',
        '/blog',
        '/privacy'
    ];

    const staticRoutes = staticPaths.map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: route === '' ? 1 : 0.8,
    }));

    try {
        // Fetch dynamic slugs in parallel
        const [blogsRes, servicesRes, solutionsRes, caseStudiesRes] = await Promise.all([
            fetch(`${API_URL}/blogs`, { next: { revalidate: 3600 } }),
            fetch(`${API_URL}/services`, { next: { revalidate: 3600 } }),
            fetch(`${API_URL}/solutions`, { next: { revalidate: 3600 } }),
            fetch(`${API_URL}/case-studies`, { next: { revalidate: 3600 } })
        ]);

        const [blogs, services, solutions, caseStudies] = await Promise.all([
            blogsRes.ok ? blogsRes.json() : [],
            servicesRes.ok ? servicesRes.json() : [],
            solutionsRes.ok ? solutionsRes.json() : [],
            caseStudiesRes.ok ? caseStudiesRes.json() : []
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
        
        // Case Study Routes
        const caseStudyRoutes = Array.isArray(caseStudies) ? caseStudies.map((study: any) => ({
            url: `${baseUrl}/case-studies/${study.slug}`,
            lastModified: new Date(study.updatedAt || study.createdAt || new Date()),
            changeFrequency: 'monthly' as const,
            priority: 0.7,
        })) : [];

        return [...staticRoutes, ...blogRoutes, ...serviceRoutes, ...solutionRoutes, ...caseStudyRoutes];
    } catch (error) {
        console.error('Error generating dynamic sitemap:', error);
        return staticRoutes;
    }
}
