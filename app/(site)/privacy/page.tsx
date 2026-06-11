import type { Metadata } from 'next';
import PrivacyClient from './PrivacyClient';

export const metadata: Metadata = {
    title: 'Privacy Protocol & Security Standards',
    description: 'ProHostix is built on a foundation of absolute data integrity. Read our security protocols and privacy standards for enterprise software infrastructure.',
    keywords: [
        'data security company',
        'privacy policy software',
        'secure enterprise development',
        'GDPR compliance systems',
        'software security standard',
        'ProHostix security'
    ],
    openGraph: {
        title: 'Privacy Protocol & Security Standards | ProHostix',
        description: 'Read our security protocols and privacy standards for enterprise custom software systems.',
        url: 'https://www.prohostix.com/privacy',
    },
    alternates: { canonical: 'https://www.prohostix.com/privacy' },
};

export default function PrivacyPage() {
    return <PrivacyClient />;
}
