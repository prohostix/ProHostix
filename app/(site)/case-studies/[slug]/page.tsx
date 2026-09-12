import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import CaseStudyDetailClient from '@/components/case-studies/CaseStudyDetailClient';
import { CASE_STUDIES } from '@/data/staticContent';
import { getAbsoluteImageUrl } from '@/utils/imageUrl';

export const dynamic = 'force-dynamic';

async function getCaseStudy(slug: string) {
    return CASE_STUDIES.find((s: any) => s.slug === slug);
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const study = await getCaseStudy(slug);
    if (!study) return { title: 'Case Study Not Found' };

    return {
        title: `${study.title} | Case Study`,
        description: study.description,
        keywords: study.techStack || [],
        openGraph: {
            title: `${study.title} | ProHostix Case Study`,
            description: study.description,
            images: study.image ? [getAbsoluteImageUrl(study.image)] : [],
            type: 'article',
        },
        alternates: {
            canonical: `/case-studies/${slug}`,
            languages: {
                'x-default': `/case-studies/${slug}`,
                'en': `/case-studies/${slug}`,
            }
        }
    };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const study = await getCaseStudy(slug);

    if (!study) {
        return notFound();
    }

    const articleSchema = {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": study.title,
        "description": study.description,
        "image": study.image ? getAbsoluteImageUrl(study.image) : "https://www.prohostix.com/project_dashboard_preview_1770603074238.jpg",
        "author": {
            "@type": "Organization",
            "name": "ProHostix"
        },
        "publisher": {
            "@type": "Organization",
            "name": "ProHostix",
            "logo": {
                "@type": "ImageObject",
                "url": "https://www.prohostix.com/logo.png"
            }
        },
        "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": `https://www.prohostix.com/case-studies/${study.slug}`
        }
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
            />
            <CaseStudyDetailClient study={study} />
        </>
    );
}
