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
        }
    };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const solution = await getSolution(slug);
    return <SolutionDetailClient solution={solution} />;
}
