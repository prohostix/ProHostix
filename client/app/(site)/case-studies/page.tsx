'use client';

import React from 'react';
import { motion } from 'framer-motion';
import CaseStudyCard from '@/components/ui/cards/CaseStudyCard';
import { CASE_STUDIES, PAGE_CONTENT } from '@/data/staticContent';
import SmartImage from '@/components/ui/SmartImage';

export default function CaseStudies() {
    // Use static content
    const studies = CASE_STUDIES;
    const pageInfo = PAGE_CONTENT.case_studies.hero;

    return (
        <div className="min-h-screen bg-black text-white selection:bg-emerald-500/30 selection:text-emerald-400 relative overflow-x-hidden">
            {/* --- HERO BACKGROUND IMAGE --- */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[100vw] h-[40vh] overflow-hidden pointer-events-none z-0">
                <SmartImage
                    src="/hero-ai.jpg"
                    alt="Case Studies Architecture"
                    className="w-full h-full object-cover opacity-30 brightness-50 grayscale-[0.3]"
                    priority={true}
                />
                {/* Visual Fading & Ambient Depth */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/40 to-black z-10" />
                <div className="absolute top-0 left-0 right-0 h-full bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none" />
            </div>

            {/* --- HERO --- */}
            <div className="relative w-full max-w-7xl mx-auto px-6 md:px-12 lg:px-16 pt-32 pb-20 overflow-hidden text-center">
                <div className="relative z-10">
                    <motion.span
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                        className="mb-6 inline-block px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-[0.2em]"
                    >
                        {pageInfo.tagline}
                    </motion.span>
                    <div className="overflow-hidden mb-8">
                        <motion.h1
                            initial={{ opacity: 0, x: -80 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
                            className="text-4xl md:text-7xl font-black tracking-tighter uppercase leading-[0.9] bg-gradient-to-b from-white via-white/80 to-white/40 bg-clip-text text-transparent"
                        >
                            Architectures<br />That Perform
                        </motion.h1>
                    </div>
                    <motion.p
                        initial={{ opacity: 0, x: -40 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
                        className="max-w-2xl mx-auto text-lg md:text-xl font-medium leading-relaxed bg-gradient-to-br from-white/70 via-white/50 to-white/30 bg-clip-text text-transparent"
                    >
                        {pageInfo.subtitle}
                    </motion.p>
                </div>
            </div>

            {/* --- CASE STUDIES GRID --- */}
            <div className="relative w-full max-w-7xl mx-auto px-6 md:px-12 lg:px-16 py-10 space-y-20">
                {studies.map((study: any, idx: number) => (
                    <CaseStudyCard
                        key={idx}
                        index={idx}
                        title={study.title}
                        category={study.category}
                        description={study.description}
                        stats={study.stats}
                        image={study.image}
                        tags={study.techStack}
                        link={`/case-studies/${study.slug}`}
                        cta="View Case Study"
                    />
                ))}
            </div>

            {/* --- CTA --- */}
            <div className="relative w-full max-w-4xl mx-auto px-6 md:px-12 lg:px-16 py-32 text-center">
                <h2 className="text-4xl font-black uppercase tracking-tighter mb-8 text-white">
                    Need Similar Results?
                </h2>
                <div className="flex flex-col sm:flex-row gap-6 justify-center">
                    <button className="px-8 py-4 rounded-full bg-white text-black font-bold uppercase tracking-widest text-xs hover:bg-emerald-400 transition-colors">
                        View More Architectures
                    </button>
                    <button className="px-8 py-4 rounded-full border border-white/20 hover:border-emerald-500/50 hover:text-emerald-400 font-bold uppercase tracking-widest text-xs transition-colors">
                        Build Something Similar
                    </button>
                </div>
            </div>
        </div>
    );
};
