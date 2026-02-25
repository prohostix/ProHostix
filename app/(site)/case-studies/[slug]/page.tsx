'use client';

import React from 'react';
import { notFound, useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowUpRight, CheckCircle2, LayoutGrid, Server, Database, Code2, Cpu } from 'lucide-react';
import Link from 'next/link';
import SmartImage from '@/components/ui/SmartImage';
import { CASE_STUDIES } from '@/data/staticContent';

// Helper to find icon for tech stack (optional, basic mapping)
const getTechIcon = (tech: string) => {
    const t = tech.toLowerCase();
    if (t.includes('react') || t.includes('next')) return LayoutGrid;
    if (t.includes('node') || t.includes('express')) return Server;
    if (t.includes('sql') || t.includes('mongo') || t.includes('redis')) return Database;
    if (t.includes('python') || t.includes('tensorflow')) return Cpu;
    return Code2;
};

export default function CaseStudyDetail() {
    const params = useParams();
    // Find the case study
    const study = CASE_STUDIES.find((s) => s.slug === params.slug);

    if (!study) {
        return notFound();
    }

    return (
        <div className="min-h-screen bg-black text-white selection:bg-emerald-500/30 selection:text-emerald-400 relative overflow-x-hidden pt-24 pb-20">

            {/* --- BACK BUTTON --- */}
            <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16 mb-8">
                <Link href="/case-studies" className="group inline-flex items-center gap-2 text-white/40 hover:text-emerald-400 text-[10px] font-black uppercase tracking-[0.3em] transition-all">
                    <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> BACK TO CASE STUDIES
                </Link>
            </div>

            {/* --- HERO SECTION --- */}
            <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16 mb-16">
                <div className="flex flex-col lg:flex-row gap-12 items-start">
                    <div className="flex-1">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <span className="inline-block px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-[0.2em] mb-6">
                                {study.category}
                            </span>
                            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter uppercase leading-[0.9] text-white mb-6">
                                {study.title}
                            </h1>
                            <p className="text-xl md:text-2xl text-white/60 font-medium leading-relaxed max-w-2xl mb-8">
                                {study.description}
                            </p>

                            {/* --- STATS GRID --- */}
                            <div className="grid grid-cols-3 gap-6 mb-10 border-y border-white/10 py-8">
                                {study.stats?.map((stat: any, idx: number) => (
                                    <div key={idx}>
                                        <div className="text-2xl md:text-4xl font-black text-white mb-1">{stat.value}</div>
                                        <div className="text-xs uppercase tracking-widest text-white/40 font-bold">{stat.label}</div>
                                    </div>
                                ))}
                            </div>

                            {/* --- ACTION BUTTONS --- */}
                            <div className="flex flex-wrap gap-4">
                                {study.projectUrl && (
                                    <a
                                        href={study.projectUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="px-8 py-4 rounded-xl bg-emerald-500 text-black font-black uppercase tracking-widest text-xs hover:bg-emerald-400 transition-all hover:scale-105 shadow-[0_0_30px_rgba(16,185,129,0.3)] flex items-center gap-2"
                                    >
                                        Launch Live Project <ArrowUpRight size={16} />
                                    </a>
                                )}
                            </div>
                        </motion.div>
                    </div>

                    {/* --- HERO IMAGE --- */}
                    <div className="flex-1 w-full">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="relative rounded-3xl overflow-hidden border border-white/10 shadow-2xl aspect-video lg:aspect-square"
                        >
                            <SmartImage
                                src={study.image || "/project_dashboard_preview_1770603074238.jpg"} // Fallback
                                alt={study.title}
                                className="object-cover w-full h-full"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* --- DETAILS SECTION --- */}
            <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16 grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-24 border-t border-white/10 pt-16">

                {/* --- LEFT COLUMN: TECH STACK --- */}
                <div className="lg:col-span-1 space-y-12">

                    <div>
                        <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-white/40 mb-6">Technologies Used</h3>
                        <div className="flex flex-wrap gap-3">
                            {study.techStack?.map((tech: string, i: number) => {
                                const Icon = getTechIcon(tech);
                                return (
                                    <div key={i} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 hover:border-emerald-500/30 transition-colors group">
                                        <Icon size={14} className="text-emerald-500/70 group-hover:text-emerald-400" />
                                        <span className="text-xs font-bold text-white/70 uppercase tracking-wide">{tech}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div>
                        <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-white/40 mb-6">Deliverables</h3>
                        <ul className="space-y-4">
                            {['System Architecture Design', 'Frontend Development', 'API Development', 'Cloud Infrastructure', 'QA & Testing'].map((item, i) => (
                                <li key={i} className="flex items-center gap-3 text-sm text-white/70">
                                    <CheckCircle2 size={16} className="text-emerald-500" />
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* --- RIGHT COLUMN: PROBLEM & SOLUTION --- */}
                <div className="lg:col-span-2 space-y-16">
                    <div>
                        <h2 className="text-3xl font-bold text-white mb-6">The Challenge</h2>
                        <p className="text-lg text-white/60 leading-relaxed">
                            {study.problem || "Information regarding the specific challenges faced during this project is confidential. However, generally speaking, we tackled issues related to scalability, performance bottlenecks, and legacy system integration."}
                        </p>
                    </div>

                    <div>
                        <h2 className="text-3xl font-bold text-white mb-6">The Solution</h2>
                        <p className="text-lg text-white/60 leading-relaxed mb-6">
                            {study.solution || "We implemented a custom-tailored solution leveraging modern architectural patterns. This included breaking down monoliths into microservices, implementing real-time data processing pipelines, and optimizing database queries for high throughput."}
                        </p>

                        {/* Highlights (Generic for now, or could be data-driven) */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                            <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                                <h4 className="font-bold text-white mb-2">Scalable Architecture</h4>
                                <p className="text-sm text-white/50">Designed to handle massive traffic spikes without degradation.</p>
                            </div>
                            <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                                <h4 className="font-bold text-white mb-2">Real-Time Processing</h4>
                                <p className="text-sm text-white/50">Data ingestion and analysis happening in milliseconds.</p>
                            </div>
                        </div>
                    </div>
                </div >
            </div >

        </div >
    );
}
