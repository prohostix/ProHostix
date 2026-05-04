import type { Metadata } from 'next';
import CaseStudiesClient from './CaseStudiesClient';

export const metadata: Metadata = {
    title: 'Case Studies | Software Development Success Stories',
    description: 'Explore real-world software development case studies from ProHostix — ERP systems, SaaS platforms, mobile apps, and enterprise solutions delivered for clients worldwide.',
    keywords: [
        'software development case studies',
        'ERP case study',
        'SaaS development case study',
        'software company portfolio',
        'IT company case studies',
        'enterprise software examples',
        'custom software success stories',
        'web app case study',
        'ProHostix portfolio',
    ],
    openGraph: {
        title: 'Case Studies | ProHostix Software Development',
        description: 'Real-world software development case studies — ERP systems, SaaS platforms, and enterprise solutions delivered for clients worldwide.',
        url: 'https://www.prohostix.com/case-studies',
    },
    alternates: { canonical: 'https://www.prohostix.com/case-studies' },
};

export default function CaseStudiesPage() {
    return <CaseStudiesClient />;
}
