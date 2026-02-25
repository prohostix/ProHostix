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
                title: seo.title,
                description: seo.description,
                ...(seo.ogImage && { images: [{ url: seo.ogImage }] })
            },
            alternates: {
                canonical: seo.canonicalUrl
            },
            robots: {
                index: seo.robots?.includes('noindex') ? false : true,
                follow: seo.robots?.includes('nofollow') ? false : true,
            }
        };
    }

    return {
        title: 'ProHostix | Architecting High-Performance Digital Ecosystems',
        description: 'ProHostix specializes in building intelligent, scalable digital solutions, from custom ERPs and SaaS platforms to complex cloud architectures.',
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
