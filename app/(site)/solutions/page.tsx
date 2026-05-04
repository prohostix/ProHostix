import React from 'react';
import { Metadata } from 'next';
import SolutionsClient from './SolutionsClient';
import api from '@/utils/api';
import { SOLUTIONS } from '@/data/staticContent';
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
    title: 'Digital Solutions | ERP, SaaS, CRM & Enterprise Platforms',
    description: 'End-to-end digital solutions for businesses: custom ERP systems, SaaS platforms, CRM tools, AI-powered analytics, and enterprise-grade software ecosystems.',
    keywords: [
        'digital solutions',
        'ERP solutions',
        'SaaS platform development',
        'CRM solutions',
        'enterprise software solutions',
        'AI software solutions',
        'business automation software',
        'custom digital solutions',
        'IT solutions company',
        'software solutions for business',
    ],
    openGraph: {
        title: 'Digital Solutions | ProHostix',
        description: 'End-to-end digital solutions: custom ERP systems, SaaS platforms, CRM tools, and enterprise-grade software ecosystems.',
        url: 'https://www.prohostix.com/solutions',
    },
    alternates: { canonical: 'https://www.prohostix.com/solutions' },
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
