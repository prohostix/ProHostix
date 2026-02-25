import React from 'react';
import { Metadata } from 'next';
import SolutionsClient from './SolutionsClient';
import api from '@/utils/api';
import { SOLUTIONS } from '@/data/staticContent';
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
    title: 'Solutions | ProHostix',
    description: 'Intelligent digital solutions built for scale. Enterprise applications, SaaS platforms, and custom digital ecosystems.',
};

/**
 * Solutions Page (Server Component)
 * Fetches data on the server for improved performance and SEO.
 */
export default async function SolutionsPage() {
    let solutions = SOLUTIONS;

    try {
        // Fetch dynamic solutions from backend
        const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/solutions`, { cache: 'no-store' });
        if (res.ok) {
            const dynamicSolutions = await res.json();
            if (Array.isArray(dynamicSolutions) && dynamicSolutions.length > 0) {
                solutions = dynamicSolutions;
            }
        }
    } catch (error) {
        console.error('Failed to fetch dynamic solutions on server:', error);
        // Fallback to static SOLUTIONS is already handled by initial value
    }

    return (
        <SolutionsClient solutions={solutions} />
    );
};
