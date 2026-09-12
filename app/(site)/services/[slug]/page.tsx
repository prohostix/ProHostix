import type { Metadata } from 'next';
import ServiceDetailClient from '@/components/services/ServiceDetailClient';
import { SERVICES } from '@/data/staticContent';
import { getAbsoluteImageUrl } from '@/utils/imageUrl';
export const dynamic = 'force-dynamic';

async function getService(slug: string) {
    // Rely on On-demand rendering (force-dynamic) to fetch from API at runtime
    // Static fallback for build/fallback
    return SERVICES.find((s: any) => s.slug === slug);
}


export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const service = await getService(slug);
    if (!service) return { title: 'Service Not Found' };

    return {
        title: service.title,
        description: service.description,
        keywords: service.techStack || [],
        openGraph: {
            images: service.illustration ? [getAbsoluteImageUrl(service.illustration)] : [],
        },
        alternates: {
            canonical: `/services/${slug}`,
        }
    };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const service = await getService(slug);

    if (!service) {
        return <div>Service not found</div>;
    }

    const serviceSchema = {
        "@context": "https://schema.org",
        "@type": "Service",
        "serviceType": service.title,
        "description": service.description,
        "provider": {
            "@type": "Organization",
            "name": "ProHostix",
            "url": "https://www.prohostix.com"
        },
        "areaServed": "Worldwide",
        "hasOfferCatalog": {
            "@type": "OfferCatalog",
            "name": "Service Capabilities",
            "itemListElement": (service.techStack || []).map((tech: string, index: number) => ({
                "@type": "Offer",
                "itemOffered": {
                    "@type": "Service",
                    "name": tech
                }
            }))
        }
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
            />
            <ServiceDetailClient service={service} />
        </>
    );
}
