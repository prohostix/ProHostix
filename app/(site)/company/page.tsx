import type { Metadata } from 'next';
import CompanyClient from './CompanyClient';

export const metadata: Metadata = {
    title: 'About Us | Custom Software Development Company',
    description: 'ProHostix is a custom software development company. Meet our leadership team and learn how we architect scalable ERP systems, SaaS platforms, and enterprise software.',
    keywords: [
        'about software company',
        'software development company',
        'IT company about us',
        'custom software team',
        'software engineering company',
        'enterprise software company',
        'ProHostix about',
        'software company leadership',
        'tech company about',
    ],
    openGraph: {
        title: 'About ProHostix | Custom Software Development Company',
        description: 'Meet the team behind ProHostix — architects, engineers, and strategists building scalable software for growing businesses.',
        url: 'https://www.prohostix.com/company',
    },
    alternates: { canonical: 'https://www.prohostix.com/company' },
};

export default function CompanyPage() {
    return <CompanyClient />;
}
