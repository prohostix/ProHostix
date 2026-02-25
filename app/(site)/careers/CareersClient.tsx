'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import CareersForm from '@/components/common/CareersForm';
import { PAGE_CONTENT } from '@/data/staticContent';

const CareersClient = () => {
    const router = useRouter();
    // Use static content
    const pageInfo = PAGE_CONTENT.careers.core_info;

    return (
        <div className="min-h-screen bg-[#050505] text-white selection:bg-emerald-500/30 selection:text-emerald-400 pt-32 pb-20">
            {/* --- HERO BACKGROUND --- */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[100vw] h-[40vh] overflow-hidden pointer-events-none z-0">
                <img
                    src="/hero-ai.jpg"
                    alt="Careers Infrastructure"
                    className="w-full h-full object-cover opacity-20 brightness-75 grayscale-[0.3]"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/40 to-[#050505] z-10" />
                <div className="absolute top-0 left-0 right-0 h-full bg-emerald-500/5 blur-[120px] rounded-full" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 lg:px-16">
                <div className="flex flex-col lg:flex-row gap-20 lg:gap-24 items-start">
                    {/* Left: Content Area */}
                    <div className="w-full lg:w-[48%] relative z-20">
                        <motion.button
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6 }}
                            onClick={() => router.push('/company')}
                            className="flex items-center gap-2 text-white/40 hover:text-emerald-400 text-[10px] font-black uppercase tracking-[0.3em] mb-12 transition-all w-fit group"
                        >
                            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                            BACK TO COMPANY
                        </motion.button>

                        <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 text-xs font-bold uppercase tracking-widest mb-8"
                            >
                                <Sparkles size={14} />
                                {pageInfo.badge}
                            </motion.div>
                            <div className="mb-8 w-full">
                                <motion.h1
                                    initial={{ opacity: 0, y: 40 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
                                    className="text-4xl md:text-6xl lg:text-6xl xl:text-7xl font-black tracking-tighter uppercase leading-[0.95] bg-gradient-to-b from-white via-white/80 to-white/40 bg-clip-text text-transparent w-full pr-6 pb-2"
                                >
                                    Build the <br /> <span className="text-emerald-500">Infrastructure</span> of Tomorrow
                                </motion.h1>
                            </div>
                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
                                className="text-lg md:text-xl font-medium leading-relaxed bg-gradient-to-br from-white/70 via-white/50 to-white/30 bg-clip-text text-transparent mb-12"
                            >
                                {pageInfo.subtitle}
                            </motion.p>

                            <div className="space-y-6">
                                {pageInfo.perks.map((perk: any, i: number) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, x: -30 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.5, delay: 0.8 + (i * 0.1), ease: [0.22, 1, 0.36, 1] }}
                                        className="flex gap-4"
                                    >
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2.5 shrink-0 shadow-[0_0_10px_#10b981]" />
                                        <div>
                                            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-1">{perk.title}</h4>
                                            <p className="text-white/40 text-sm leading-relaxed">{perk.desc}</p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right: Form Area */}
                    <div className="w-full lg:w-[52%] relative z-10">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
                            className="bg-zinc-800/80 backdrop-blur-2xl border border-white/20 rounded-[32px] p-8 md:p-12 shadow-[0_40px_100px_rgba(0,0,0,0.5)]"
                        >
                            <div className="mb-10 text-center">
                                <h2 className="text-3xl font-black tracking-tighter uppercase text-white mb-2">{pageInfo.formTitle}</h2>
                                <p className="text-white/40 font-medium text-sm">{pageInfo.formSubtitle}</p>
                            </div>
                            <CareersForm />
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CareersClient;
