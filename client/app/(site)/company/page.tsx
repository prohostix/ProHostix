'use client';

import React, { useRef } from 'react';
import { motion, useScroll } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Target, Users, Zap, ShieldCheck, Sparkles, Box } from 'lucide-react';
import { LEADERSHIP, PAGE_CONTENT } from '@/data/staticContent';
import SmartImage from '@/components/ui/SmartImage';
import { useLeadership } from '@/hooks/usePageData';

const iconMap: Record<string, any> = {
    "target": Target,
    "sparkles": Sparkles,
    "box": Box,
    "users": Users,
    "zap": Zap,
    "shield-check": ShieldCheck
};

export default function Company() {
    const router = useRouter();
    const aboutRef = useRef(null);
    useScroll({
        target: aboutRef,
        offset: ["start end", "center start"]
    });

    // Unified data fetching: try API first, fallback to static
    const { data: apiLeadership } = useLeadership();
    const leadership = Array.isArray(apiLeadership) && apiLeadership.length > 0
        ? apiLeadership
        : LEADERSHIP;

    const pageInfo = PAGE_CONTENT.company;

    const fadeIn = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6 }
    };

    return (
        <div className="min-h-screen bg-black text-white relative">
            {/* --- HERO --- */}
            <div className="relative w-full max-w-7xl mx-auto px-6 md:px-12 lg:px-16 pt-32 pb-24 text-center overflow-hidden">
                {/* Background Vector */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[100vw] h-[40vh] overflow-hidden pointer-events-none z-0">
                    <SmartImage
                        src="/working-professional.jpg"
                        alt="Company Architectural Core"
                        priority={true}
                        className="w-full h-full object-cover opacity-20 brightness-75 grayscale-[0.2]"
                    />
                    {/* Visual Fading & Ambient Depth */}
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/40 to-black z-10" />
                    <div className="absolute top-0 left-0 right-0 h-full bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none" />
                </div>

                <div className="relative z-10">
                    <motion.span
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                        className="mb-6 inline-block px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-[0.2em]"
                    >
                        {pageInfo.hero.tagline}
                    </motion.span>
                    <div className="overflow-hidden mb-8">
                        <motion.h1
                            initial={{ opacity: 0, x: -80 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
                            className="text-4xl md:text-7xl font-black tracking-tighter uppercase leading-[0.9] bg-gradient-to-b from-white via-white/80 to-white/40 bg-clip-text text-transparent max-w-5xl mx-auto"
                        >
                            {pageInfo.hero.title}
                        </motion.h1>
                    </div>
                    <motion.p
                        initial={{ opacity: 0, x: -40 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
                        className="max-w-2xl mx-auto text-lg md:text-xl font-medium leading-relaxed bg-gradient-to-br from-white/70 via-white/50 to-white/30 bg-clip-text text-transparent"
                    >
                        {pageInfo.hero.subtitle}
                    </motion.p>
                </div>
            </div>

            {/* --- COMPACT CORE FOUNDATIONS --- */}
            <section ref={aboutRef} className="max-w-6xl mx-auto px-6 md:px-12 lg:px-16 pt-24 pb-12 relative">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16 px-4">
                    <div className="max-w-xl">
                        <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="text-[10px] font-black tracking-[0.4em] text-emerald-500 mb-4 uppercase"
                        >
                            Operational Directive // v4.0
                        </motion.div>
                        <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter uppercase leading-none">
                            Architectural <span className="text-emerald-500">Pillars</span>
                        </h2>
                    </div>
                    <p className="text-white/40 text-sm font-medium max-w-xs md:text-right border-l md:border-l-0 md:border-r border-emerald-500/20 pl-4 md:pl-0 md:pr-4">
                        Defining the core logic that drives our engineering ecosystem and client success.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                        { ...pageInfo.mission, id: "01", icon: "target", tag: "PRECISION" },
                        { ...pageInfo.vision, id: "02", icon: "sparkles", tag: "SCALE" },
                        { ...pageInfo.philosophy, id: "03", icon: "box", tag: "LEGACY" }
                    ].map((item, idx) => {
                        const Icon = iconMap[item.icon] || Target;

                        return (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                                className="group relative"
                            >
                                <div className="relative h-full bg-[#0D1117] border border-white/5 rounded-2xl p-8 transition-all duration-500 hover:border-emerald-500/30 hover:bg-emerald-500/[0.02] flex flex-col group/card">
                                    {/* Top Metadata */}
                                    <div className="flex justify-between items-start mb-10">
                                        <div className="flex flex-col">
                                            <span className="text-[9px] font-mono text-emerald-500/50 uppercase tracking-widest leading-none mb-1">Unit_{item.id}</span>
                                            <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] leading-none">{item.tag}</span>
                                        </div>
                                        <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white/30 group-hover/card:text-emerald-400 group-hover/card:bg-emerald-500/10 group-hover/card:border-emerald-500/30 transition-all duration-500">
                                            <Icon size={20} />
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="flex-grow">
                                        <h3 className="text-xl font-black text-white tracking-tight uppercase mb-3">
                                            {item.title}
                                        </h3>
                                        <p className="text-white/50 text-sm leading-relaxed font-medium transition-colors group-hover/card:text-white/70">
                                            {item.description}
                                        </p>
                                    </div>

                                    {/* Bottom Decorative Element */}
                                    <div className="mt-10 pt-6 border-t border-white/5 flex items-center justify-between">
                                        <div className="flex gap-1.5">
                                            {[...Array(3)].map((_, i) => (
                                                <div key={i} className={`w-1 h-1 rounded-full ${i === idx ? 'bg-emerald-500' : 'bg-white/10'} transition-colors duration-500 group-hover/card:bg-emerald-500/40`} />
                                            ))}
                                        </div>
                                        <div className="text-[8px] font-mono text-white/10 group-hover/card:text-white/30 transition-colors uppercase italic">
                                            // core_initialized
                                        </div>
                                    </div>

                                    {/* Corner Accents */}
                                    <div className="absolute top-0 right-0 w-8 h-8 pointer-events-none opacity-0 group-hover/card:opacity-100 transition-opacity">
                                        <div className="absolute top-4 right-4 w-[1px] h-2 bg-emerald-500" />
                                        <div className="absolute top-4 right-4 h-[1px] w-2 bg-emerald-500" />
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </section>

            {/* --- TEAM --- */}
            <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16 pt-12 pb-32 relative overflow-hidden">
                {/* Background Accent */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none" />

                <div className="relative z-10 flex flex-col items-center mb-24">
                    <motion.div
                        {...fadeIn}
                        className="text-xs font-bold text-emerald-500 uppercase tracking-[0.4em] mb-4"
                    >
                        The Intelligence Core
                    </motion.div>
                    <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-center">Architectural Leadership</h2>
                </div>

                <div className="flex flex-col gap-20 max-w-5xl mx-auto">
                    {leadership.map((member: any, idx: number) => (
                        <motion.div
                            key={idx}
                            initial={{
                                opacity: 0,
                                y: 80,
                                x: idx % 2 === 0 ? -20 : 20
                            }}
                            whileInView={{
                                opacity: 1,
                                y: 0,
                                x: 0
                            }}
                            viewport={{ once: true, amount: 0.2 }}
                            transition={{
                                duration: 0.8,
                                delay: idx * 0.1,
                                ease: [0.22, 1, 0.36, 1]
                            }}
                            className="group relative"
                        >
                            {/* Card Glow Effect */}
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500/20 to-transparent rounded-[32px] blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                            <div className="relative flex flex-col md:flex-row rounded-[32px] border border-white/10 bg-[#0A0A0A] hover:border-emerald-500/30 transition-all duration-500 overflow-hidden shadow-2xl min-h-[260px]">
                                {/* Image Section (Square) */}
                                <div className="relative w-full md:w-[280px] aspect-square overflow-hidden shrink-0">
                                    <SmartImage
                                        src={member.avatar}
                                        alt={member.name}
                                        fallbackSrc="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=800&auto=format&fit=crop"
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                    />
                                    {/* Shadow on the left edge of the image */}
                                    <div className="absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-black/60 to-transparent z-10" />

                                    {/* Specialty Badge moved to overlap */}
                                    <div className="absolute bottom-6 left-6 px-4 py-1.5 rounded-full bg-emerald-500 text-[10px] font-black uppercase text-black shadow-2xl z-20">
                                        {member.specialization}
                                    </div>
                                </div>

                                {/* Vertical Divider (Desktop) */}
                                <div className="hidden md:block w-px bg-white/5 my-6" />

                                {/* Content Section */}
                                <div className="flex-grow p-6 md:p-10 flex flex-col justify-center">
                                    <div className="space-y-3 mb-6">
                                        <div className="flex flex-col gap-2">
                                            <h3 className="text-3xl md:text-4xl font-black text-white tracking-tight group-hover:text-emerald-400 transition-colors duration-300 uppercase leading-none">
                                                {member.name}
                                            </h3>
                                            <div className="text-emerald-500/60 text-xs md:text-sm uppercase tracking-[0.4em] font-medium">
                                                {member.role}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Horizontal element replaced/accentuated */}
                                    <div className="h-px w-24 bg-emerald-500/30 mb-6" />

                                    <p className="text-white/60 text-lg leading-relaxed font-medium">
                                        {member.desc}
                                    </p>

                                    {/* Design Accent */}
                                    <div className="mt-6 flex justify-end">
                                        <div className="w-12 h-[1px] bg-emerald-500/20" />
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* --- WHY CHOOSE US --- */}
            <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16 py-20 border-y border-white/5">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
                    {pageInfo.values.map((val: any, idx: number) => {
                        const Icon = iconMap[val.icon] || ShieldCheck;
                        return (
                            <div key={idx} className="flex flex-col items-center">
                                <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mb-6 text-emerald-400">
                                    <Icon size={32} />
                                </div>
                                <h3 className="text-xl font-bold uppercase mb-2">{val.title}</h3>
                                <p className="text-white/50 text-sm max-w-xs">{val.desc}</p>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* --- CAREERS --- */}
            <div className="relative w-full max-w-4xl mx-auto px-6 md:px-12 lg:px-16 py-32 text-center">
                <h2 className="text-4xl font-black uppercase tracking-tighter mb-8 bg-gradient-to-b from-white to-white/40 bg-clip-text text-transparent">
                    {pageInfo.careers.title}
                </h2>
                <p className="text-white/50 mb-10 max-w-lg mx-auto">
                    {pageInfo.careers.description}
                </p>
                <button
                    onClick={() => {
                        router.push(pageInfo.careers.link);
                    }}
                    className="px-10 py-5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black font-black uppercase tracking-widest text-sm transition-all duration-300 transform hover:scale-105 shadow-xl">
                    {pageInfo.careers.cta}
                </button>
            </div>
        </div>
    );
};
