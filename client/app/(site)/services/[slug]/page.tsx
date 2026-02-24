import type { Metadata } from 'next';
import ServiceDetailClient from '@/components/services/ServiceDetailClient';
import { SERVICES } from '@/data/staticContent';
import { getAbsoluteImageUrl } from '@/utils/imageUrl';

async function getService(slug: string) {
    try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";
        const res = await fetch(`${apiUrl}/services`, { next: { revalidate: 60 } });
        if (res.ok) {
            const services = await res.json();
            const found = services.find((s: any) => s.slug === slug);
            if (found) return found;
        }
    } catch (e) {
        // ignore
    }

    // Static fallback
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
        }
    };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const service = await getService(slug);
    return <ServiceDetailClient service={service} />;
}
