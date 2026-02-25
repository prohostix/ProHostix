'use client';

import React, { useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
    Layers, Workflow, Code2, Cloud, Server, ArrowRight, CheckCircle2, ShieldCheck, Zap, Database, ArrowUpRight
} from 'lucide-react';
import SolutionCard from '@/components/ui/cards/SolutionCard';
import ArchitectureHighlightCard from '@/components/ui/cards/ArchitectureHighlightCard';
import { PAGE_CONTENT } from '@/data/staticContent';
import SmartImage from '@/components/ui/SmartImage';

const iconMap: Record<string, any> = {
    Layers, Workflow, Code2, Cloud, Server, Database
};

const highlightIconMap: Record<string, any> = {
    CheckCircle2, Zap, ShieldCheck
};

interface SolutionsClientProps {
    solutions: any[];
}

export default function SolutionsClient({ solutions }: SolutionsClientProps) {
    const router = useRouter();
    const pageInfo = PAGE_CONTENT.solutions.hero;
    const highlights = PAGE_CONTENT.solutions.highlights;
    const liveProjects = PAGE_CONTENT.home.pioneer_work.projects;

    const solutionsRef = useRef(null);
    const { scrollYProgress: solutionsScroll } = useScroll({
        target: solutionsRef,
        offset: ["start end", "center start"]
    });

    const pageRef = useRef(null);
    const { scrollYProgress: pageScroll } = useScroll({
        target: pageRef,
        offset: ["start start", "end end"]
    });

    if (!pageInfo) {
        return null;
    }

    return (
        <div ref={pageRef} className="min-h-screen bg-black text-white selection:bg-emerald-500/30 selection:text-emerald-400 relative overflow-x-hidden">
            {/* --- HERO BACKGROUND IMAGE --- */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[100vw] h-[40vh] overflow-hidden pointer-events-none z-0">
                <SmartImage
                    src="/hero-ai.jpg"
                    alt="Solutions Hero Vector"
                    priority={true}
                    className="w-full h-full object-cover opacity-40 brightness-75 grayscale-[0.5]"
                />
                <div className="absolute inset-x-0 bottom-0 h-full bg-gradient-to-b from-transparent via-black/20 to-black z-10" />
                <div className="absolute top-0 left-0 right-0 h-full bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none" />
            </div>

            {/* --- SECTION 1: HERO --- */}
            <div className="relative w-full max-w-7xl mx-auto px-6 md:px-12 lg:px-16 pt-32 pb-20 overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-[500px] bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none" />
                <div className="relative z-10 flex flex-col items-center text-center">
                    <motion.span
                        style={{
                            opacity: useTransform(pageScroll, [0, 0.05], [1, 0]),
                            y: useTransform(pageScroll, [0, 0.05], [0, -20])
                        }}
                        className="mb-6 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-[0.2em] backdrop-blur-sm"
                    >
                        {pageInfo.tagline}
                    </motion.span>
                    <div className="overflow-hidden mb-8">
                        <motion.h1
                            style={{
                                opacity: useTransform(pageScroll, [0, 0.1], [1, 0.3]),
                                y: useTransform(pageScroll, [0, 0.1], [0, -40])
                            }}
                            className="text-4xl md:text-7xl font-black tracking-tighter uppercase leading-[0.9] bg-gradient-to-b from-white via-white/80 to-white/40 bg-clip-text text-transparent max-w-5xl"
                        >
                            {pageInfo.title}
                        </motion.h1>
                    </div>
                    <motion.p
                        style={{
                            opacity: useTransform(pageScroll, [0, 0.1], [1, 0]),
                            y: useTransform(pageScroll, [0, 0.1], [0, -20])
                        }}
                        className="max-w-2xl text-lg md:text-xl font-medium leading-relaxed bg-gradient-to-br from-white/70 via-white/50 to-white/30 bg-clip-text text-transparent"
                    >
                        {pageInfo.subtitle}
                    </motion.p>
                    <motion.div
                        style={{
                            opacity: useTransform(pageScroll, [0, 0.1], [1, 0]),
                            y: useTransform(pageScroll, [0, 0.1], [0, -20])
                        }}
                        className="mt-12 w-full max-w-lg mx-auto"
                    >
                        <div className="flex flex-wrap justify-center gap-4">
                            {['Scalability', 'Performance', 'Security'].map((tag) => (
                                <span key={tag} className="px-6 py-2 rounded-full bg-white/5 border border-white/10 text-white/40 text-[10px] font-black uppercase tracking-[0.2em] backdrop-blur-md">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* --- SECTION 2: SOLUTION PILLARS --- */}
            <div ref={solutionsRef} className="relative w-full max-w-7xl mx-auto px-6 md:px-12 lg:px-16 pt-10 pb-24">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                    {solutions.map((solution: any, idx: number) => {
                        const IconComponent = iconMap[solution.icon] || Layers;
                        return (
                            <SolutionCard
                                isShuffle={solutions.length > 1}
                                index={idx}
                                key={solution.slug || idx}
                                title={solution.title}
                                description={solution.description}
                                tags={solution.tags}
                                cta={solution.cta}
                                illustration={solution.illustration}
                                icon={IconComponent}
                                hasCaseStudy={['saas-platforms', 'enterprise-applications', 'erp-systems'].includes(solution.slug)}
                                onClick={() => router.push(`/solutions/${solution.slug}`)}
                                projectLink={solution.projectLink}
                                scrollYProgress={solutionsScroll}
                                className=""
                            />
                        );
                    })}
                </div>
            </div>

            {/* --- SECTION 3: ARCHITECTURE HIGHLIGHTS --- */}
            <div className="relative w-full py-32 bg-neutral-900/30 border-y border-white/5 px-6 md:px-12 lg:px-16">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-12 relative">
                        {/* Connecting Line */}
                        <div className="hidden md:block absolute top-[40px] left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent z-0" />

                        {highlights.map((item: any, idx: number) => {
                            const HighlightIcon = highlightIconMap[item.icon] || CheckCircle2;
                            return (
                                <ArchitectureHighlightCard
                                    key={idx}
                                    value={item.value}
                                    label={item.label}
                                    icon={HighlightIcon}
                                />
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* --- SECTION 4: LIVE IMPLEMENTATION BENCHMARKS --- */}
            {(solutions.some((s: any) => s.projectLink) || liveProjects.length > 0) && (
                <div className="relative w-full py-24 bg-zinc-900/40 border-y border-white/5">
                    <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16">
                        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
                            <div className="max-w-2xl">
                                <span className="mb-4 inline-block px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-[0.2em]">
                                    Operational Benchmarks
                                </span>
                                <h2 className="text-4xl md:text-5xl font-black tracking-tighter uppercase leading-[0.9] text-white">
                                    Live Implementation <br /> Proof-of-Concepts
                                </h2>
                            </div>
                            <p className="max-w-md text-white/50 text-sm font-medium leading-relaxed mb-1">
                                Every solution we architect is backed by rigorous testing. Explore our live benchmarks to see these systems performing in real-time.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">



                            {/* Priority 2: Featured Work (Case Studies) */}
                            {liveProjects.slice(0, 2).map((project: any, idx: number) => (
                                <motion.div
                                    key={project.id}
                                    initial={{
                                        opacity: 0,
                                        y: 30,
                                        x: idx % 2 === 0 ? -15 : 15,
                                        scale: 0.95
                                    }}
                                    whileInView={{
                                        opacity: 1,
                                        y: 0,
                                        x: 0,
                                        scale: 1
                                    }}
                                    viewport={{ once: true, amount: 0.1 }}
                                    transition={{
                                        duration: 0.5,
                                        delay: (idx + 2) * 0.05,
                                        ease: "easeOut"
                                    }}
                                    className="group relative h-[450px] rounded-[32px] overflow-hidden border border-emerald-500/30 bg-zinc-800/80 backdrop-blur-2xl shadow-[0_0_50px_rgba(16,185,129,0.1)] hover:border-emerald-500/60 transition-all duration-500"
                                >
                                    <SmartImage
                                        src="/project_dashboard_preview_1770603074238.jpg"
                                        alt={project.title}
                                        className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:scale-110 transition-transform duration-700"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />

                                    {/* Featured Badge */}
                                    <div className="absolute top-8 left-8 z-20">
                                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500 text-black text-[10px] font-black uppercase tracking-widest shadow-lg shadow-emerald-500/20">
                                            Case Study Available
                                        </div>
                                    </div>

                                    <div className="absolute inset-0 p-10 flex flex-col justify-end text-left">
                                        <div className="flex gap-2 mb-4">
                                            {project.tags?.map((tag: string, i: number) => (
                                                <span key={i} className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/40 text-[9px] font-black uppercase tracking-widest">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                        <h3 className="text-3xl font-black text-white mb-3 tracking-tighter uppercase group-hover:text-emerald-400 transition-colors">{project.title}</h3>
                                        <p className="text-white/50 text-sm font-medium mb-8 max-w-sm line-clamp-2">{project.description}</p>
                                        <button className="w-fit px-8 py-3 rounded-xl bg-white/5 border border-emerald-500/30 text-emerald-400 font-black uppercase tracking-widest text-[10px] flex items-center gap-2 hover:bg-emerald-500 hover:text-black transition-all group-hover:scale-105">
                                            Read Case Study <ArrowRight size={14} />
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* --- SECTION 5: CTA --- */}
            <div className="relative w-full max-w-5xl mx-auto px-6 md:px-12 lg:px-16 py-32 text-center">
                <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-8 bg-gradient-to-b from-white to-white/40 bg-clip-text text-transparent">
                    Let’s Architect Your Solution
                </h2>
                <button
                    onClick={() => {
                        router.push('/lets-talk?type=general&subject=Technical Consultation');
                    }}
                    className="px-10 py-5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black font-black uppercase tracking-widest text-sm transition-all duration-300 transform hover:scale-105 shadow-[0_0_40px_rgba(16,185,129,0.3)]">
                    Start Your Project
                </button>
            </div>
        </div>
    );
};
