import React from 'react';
import { Metadata } from 'next';
import ServicesClient from './ServicesClient';
import api from '@/utils/api';
import { SERVICES } from '@/data/staticContent';

export const metadata: Metadata = {
    title: 'Services | ProHostix',
    description: 'Expert engineering services including web development, mobile apps, ERP systems, and cloud architecture. Built with precision and scale in mind.',
};

/**
 * Services Page (Server Component)
 * Fetches data on the server for improved performance and SEO.
 */
export default async function ServicesPage() {
    let services = SERVICES;

    try {
        // Fetch dynamic services from backend
        const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/services`, { cache: 'no-store' });
        if (res.ok) {
            const dynamicServices = await res.json();
            if (Array.isArray(dynamicServices) && dynamicServices.length > 0) {
                services = dynamicServices;
            }
        }
    } catch (error) {
        console.error('Failed to fetch dynamic services on server:', error);
        // Fallback to static SERVICES is already handled by initial value
    }

    return (
        <ServicesClient services={services} />
    );
};
