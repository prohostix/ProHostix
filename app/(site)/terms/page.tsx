import type { Metadata } from 'next';
import TermsClient from './TermsClient';

export const metadata: Metadata = {
    title: 'Terms of Service',
    description: 'Read the terms of service and usage conditions for ProHostix enterprise software services and applications.',
    keywords: [
        'terms of service',
        'usage policy',
        'ProHostix terms',
        'legal terms'
    ],
    openGraph: {
        title: 'Terms of Service | ProHostix',
        description: 'Read the terms of service and usage conditions for ProHostix enterprise software services.',
        url: 'https://www.prohostix.com/terms',
    },
    alternates: {
        canonical: 'https://www.prohostix.com/terms',
        languages: {
            'x-default': 'https://www.prohostix.com/terms',
            'en': 'https://www.prohostix.com/terms',
        }
    },
};

export default function TermsPage() {
    return <TermsClient />;
}
