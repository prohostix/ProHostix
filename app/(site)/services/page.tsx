import React from 'react';
import { Metadata } from 'next';
import ServicesClient from './ServicesClient';
import api from '@/utils/api';
import { SERVICES } from '@/data/staticContent';
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
    title: 'Software Development Services | Web, Mobile, ERP & Cloud',
    description: 'Expert software development services: web applications, mobile apps, ERP systems, CRM platforms, cloud architecture & DevOps. Scalable solutions built for enterprise growth.',
    keywords: [
        'software development services',
        'web application development',
        'mobile app development',
        'ERP development company',
        'CRM software development',
        'cloud architecture services',
        'custom software services',
        'IT services company',
        'enterprise software development',
        'SaaS development services',
    ],
    openGraph: {
        title: 'Software Development Services | ProHostix',
        description: 'Expert software development services: web applications, mobile apps, ERP systems, CRM platforms, cloud architecture & DevOps.',
        url: 'https://www.prohostix.com/services',
    },
    alternates: {
        canonical: 'https://www.prohostix.com/services',
        languages: {
            'x-default': 'https://www.prohostix.com/services',
            'en': 'https://www.prohostix.com/services',
        }
    },
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

    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
            {
                "@type": "Question",
                "name": "What software development services does ProHostix offer?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "ProHostix offers comprehensive software development services including custom ERP development, CRM solutions, SaaS platform architecture, web and mobile app development, and robust cloud DevOps integrations."
                }
            },
            {
                "@type": "Question",
                "name": "Do you build custom ERP systems?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes, we specialize in architecting modular, scalable custom ERP systems that unify business operations, finance, HR, and supply chain management for mid-to-large enterprises."
                }
            },
            {
                "@type": "Question",
                "name": "How do you ensure software scalability and security?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "We follow secure-by-design principles, utilize cloud-native infrastructure, enforce role-based access controls, and perform rigorous testing and monitoring to ensure applications can scale efficiently without compromising security."
                }
            }
        ]
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
            />
            <ServicesClient services={services} />
        </>
    );
};
