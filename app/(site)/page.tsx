import React from 'react';
import HomeClient from './HomeClient';
import { Metadata } from 'next';
export const dynamic = 'force-dynamic';

import { getSeoMetadata } from '@/lib/seo';

export async function generateMetadata(): Promise<Metadata> {
    const seo = await getSeoMetadata('home');

    if (seo) {
        return {
            title: seo.title,
            description: seo.description,
            keywords: seo.keywords,
            openGraph: {
                type: 'website',
                title: seo.title,
                description: seo.description,
                url: 'https://www.prohostix.com',
                siteName: 'ProHostix',
                ...(seo.ogImage && { images: [{ url: seo.ogImage, width: 1200, height: 630, alt: seo.title }] })
            },
            twitter: {
                card: 'summary_large_image',
                title: seo.title,
                description: seo.description,
                ...(seo.ogImage && { images: [seo.ogImage] }),
            },
            alternates: {
                canonical: seo.canonicalUrl || 'https://www.prohostix.com'
            },
            robots: {
                index: seo.robots?.includes('noindex') ? false : true,
                follow: seo.robots?.includes('nofollow') ? false : true,
            }
        };
    }

    return {
        title: 'ProHostix | Custom Software Development Company',
        description: 'ProHostix is a custom software development company building ERP systems, SaaS platforms, web & mobile apps, and cloud architectures for growing businesses worldwide.',
        keywords: [
            'software development company',
            'custom software development',
            'IT company',
            'ERP development company',
            'SaaS development',
            'web application development',
            'mobile app development',
            'software agency',
            'enterprise software company',
            'cloud architecture',
        ],
        openGraph: {
            type: 'website',
            title: 'ProHostix | Custom Software Development Company',
            description: 'Building ERP systems, SaaS platforms, web & mobile apps, and cloud architectures for growing businesses.',
            url: 'https://www.prohostix.com',
            siteName: 'ProHostix',
            images: [{ url: '/hero-ai.jpg', width: 1200, height: 630, alt: 'ProHostix - Custom Software Development' }],
        },
        twitter: {
            card: 'summary_large_image',
            title: 'ProHostix | Custom Software Development Company',
            description: 'Building ERP systems, SaaS platforms, web & mobile apps, and cloud architectures for growing businesses.',
            images: ['/hero-ai.jpg'],
        },
        alternates: { canonical: 'https://www.prohostix.com' },
    };
}

/**
 * HomePage (Server Component)
 * Pre-fetches critical data on the server for instant loading and SEO.
 */
export default async function HomePage() {
    let latestBlogs = [];

    try {
        // Fetch only published blogs, limit to 3 for the home page insights section
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";
        const res = await fetch(`${apiUrl}/blogs`, { next: { revalidate: 3600 } });

        if (res.ok) {
            const allBlogs = await res.json();
            if (Array.isArray(allBlogs)) {
                latestBlogs = allBlogs
                    .filter((b: any) => b.published)
                    .slice(0, 3);
            }
        }
    } catch (error) {
        console.error('Failed to fetch home page blogs:', error);
    }

    return (
        <HomeClient latestBlogs={latestBlogs} />
    );
};
