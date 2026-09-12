import type { Metadata } from 'next';
import SolutionDetailClient from '@/components/solutions/SolutionDetailClient';
import { SOLUTIONS } from '@/data/staticContent';
import { getAbsoluteImageUrl } from '@/utils/imageUrl';
export const dynamic = 'force-dynamic';

async function getSolution(slug: string) {
    // Rely on On-demand rendering (force-dynamic) to fetch from API at runtime
    // Static fallback for build/fallback
    return SOLUTIONS.find((s: any) => s.slug === slug);
}


export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const solution = await getSolution(slug);
    if (!solution) return { title: 'Solution Not Found' };

    return {
        title: solution.title,
        description: solution.description,
        keywords: solution.tags || [],
        openGraph: {
            images: solution.illustration ? [getAbsoluteImageUrl(solution.illustration)] : [],
            type: 'website',
        },
        alternates: {
            canonical: `/solutions/${slug}`,
        }
    };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const solution = await getSolution(slug);

    if (!solution) {
        return <div>Solution not found</div>;
    }

    const solutionSchema = {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": solution.title,
        "applicationCategory": "BusinessApplication",
        "operatingSystem": "All",
        "description": solution.description,
        "provider": {
            "@type": "Organization",
            "name": "ProHostix",
            "url": "https://www.prohostix.com"
        }
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(solutionSchema) }}
            />
            <SolutionDetailClient solution={solution} />
        </>
    );
}
