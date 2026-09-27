import { MetadataRoute } from 'next'

import dbConnect from '@/lib/db';
import Blog from '@/lib/models/Blog';
import Service from '@/lib/models/Service';
import Solution from '@/lib/models/Solution';
import CaseStudy from '@/lib/models/CaseStudy';

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://www.prohostix.com';

export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
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
        '/privacy',
        '/terms'
    ];

    const staticRoutes = staticPaths.map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: route === '' ? 1 : 0.8,
    }));

    try {
        await dbConnect();
        const [blogs, services, solutions, caseStudies] = await Promise.all([
            Blog.find({ published: true }).select('slug updatedAt createdAt').lean(),
            Service.find().select('slug updatedAt createdAt').lean(),
            Solution.find().select('slug updatedAt createdAt').lean(),
            CaseStudy.find().select('slug updatedAt createdAt').lean()
        ]);

        const blogRoutes = blogs.map((post: any) => ({
            url: `${baseUrl}/blog/${post.slug}`,
            lastModified: new Date(post.updatedAt || post.createdAt || new Date()),
            changeFrequency: 'daily' as const,
            priority: 0.6,
        }));

        const serviceRoutes = services.map((service: any) => ({
            url: `${baseUrl}/services/${service.slug}`,
            lastModified: new Date(service.updatedAt || service.createdAt || new Date()),
            changeFrequency: 'monthly' as const,
            priority: 0.7,
        }));

        const solutionRoutes = solutions.map((solution: any) => ({
            url: `${baseUrl}/solutions/${solution.slug}`,
            lastModified: new Date(solution.updatedAt || solution.createdAt || new Date()),
            changeFrequency: 'monthly' as const,
            priority: 0.7,
        }));
        
        const caseStudyRoutes = caseStudies.map((study: any) => ({
            url: `${baseUrl}/case-studies/${study.slug}`,
            lastModified: new Date(study.updatedAt || study.createdAt || new Date()),
            changeFrequency: 'monthly' as const,
            priority: 0.7,
        }));

        return [...staticRoutes, ...blogRoutes, ...serviceRoutes, ...solutionRoutes, ...caseStudyRoutes];
    } catch (error) {
        console.error('Error generating dynamic sitemap:', error);
        return staticRoutes;
    }
}

