'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Server, Zap, Database, Clock, FileCheck, PhoneCall, ArrowRight } from 'lucide-react';
import LetsTalkForm from '@/components/common/LetsTalkForm';

const LetsTalkClient = () => {
    const fadeIn: any = {
        hidden: { opacity: 0, x: -30 },
        visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } }
    };

    const trustSignals = [
        { icon: Server, title: "Enterprise Architecture", desc: "Built for massive scale and reliability." },
        { icon: ShieldCheck, title: "Security First", desc: "SOC2 compliant standards and encryption." },
        { icon: Zap, title: "AI-Driven efficiency", desc: "Automating workflows for maximum ROI." },
        { icon: Database, title: "Data Integrity", desc: "Robust data pipelines and warehousing." }
    ];

    const nextSteps = [
        { icon: FileCheck, title: "1. Review", desc: "Our engineering team analyzes your requirements." },
        { icon: PhoneCall, title: "2. Discovery Call", desc: "We discuss technical feasibility and strategy." },
        { icon: ArrowRight, title: "3. Proposal", desc: "You receive a detailed roadmap and timeline." }
    ];

    return (
        <div className="min-h-screen bg-[#0b0b0b] text-white pb-20 relative overflow-hidden">
            {/* --- HERO BACKGROUND --- */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[100vw] h-[40vh] overflow-hidden pointer-events-none z-0">
                <img
                    src="/hero-ai.jpg"
                    alt="Contact Consultation Workspace"
                    className="w-full h-full object-cover opacity-20 brightness-75 grayscale-[0.3]"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0b0b0b]/40 to-[#0b0b0b] z-10" />
                <div className="absolute top-0 left-0 right-0 h-full bg-emerald-500/5 blur-[120px] rounded-full" />
            </div>

            <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16 pt-32 relative z-10">
                <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 items-center lg:items-start">

                    {/* LEFT COLUMN: Content & Trust */}
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
                        className="flex-1 pt-2 flex flex-col items-center text-center lg:items-start lg:text-left w-full"
                    >
                        <motion.div variants={fadeIn} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-widest mb-8">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            Accepting New Projects
                        </motion.div>

                        <motion.h1 variants={fadeIn} className="text-5xl md:text-7xl font-black tracking-tighter leading-tight mb-6 bg-gradient-to-br from-white via-white/90 to-white/50 bg-clip-text text-transparent">
                            LET’S BUILD <br />
                            SOMETHING <br />
                            <span className="text-emerald-500">INTELLIGENT.</span>
                        </motion.h1>

                        <motion.p variants={fadeIn} className="text-xl text-white/50 leading-relaxed max-w-xl mb-12">
                            Transform your vision into a scalable, enterprise-grade reality.
                            We specialize in high-performance software that drives real business outcomes.
                        </motion.p>

                        <motion.div variants={fadeIn} className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12 w-full">
                            {trustSignals.map((signal, idx) => (
                                <div key={idx} className="flex flex-col md:flex-row items-center md:items-start gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 text-emerald-500 shadow-lg">
                                        <signal.icon size={24} />
                                    </div>
                                    <div className="flex flex-col items-center md:items-start">
                                        <h4 className="font-bold text-white mb-1 text-center md:text-left">{signal.title}</h4>
                                        <p className="text-sm text-white/40 leading-snug text-center md:text-left max-w-[250px] md:max-w-none">{signal.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </motion.div>

                        <motion.div variants={fadeIn} className="p-6 rounded-2xl bg-zinc-800/80 backdrop-blur-2xl border border-white/20 shadow-xl w-full max-w-xl">
                            <h4 className="font-bold text-white mb-4 uppercase tracking-widest text-xs">Response Commitment</h4>
                            <div className="flex items-center justify-center lg:justify-start gap-3 text-white/70 text-sm">
                                <Clock size={20} className="text-emerald-500 shrink-0" />
                                <span> Guaranteed response within <strong className="text-white">24 hours</strong>.</span>
                            </div>
                        </motion.div>
                    </motion.div>

                    {/* RIGHT COLUMN: Form */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="flex-1 w-full max-w-xl lg:max-w-none"
                    >
                        <div className="relative p-1 rounded-3xl bg-gradient-to-br from-white/10 via-white/5 to-transparent">
                            <div className="bg-zinc-800/80 backdrop-blur-2xl rounded-[22px] p-6 md:p-8 shadow-2xl border border-white/20 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 blur-[80px] rounded-full pointer-events-none" />

                                <div className="text-center mb-8">
                                    <h3 className="text-2xl font-black tracking-tighter uppercase text-white mb-2">Project Details</h3>
                                    <p className="text-white/40 text-sm">Tell us a bit about what you're looking to achieve.</p>
                                </div>

                                <React.Suspense fallback={<div>Loading form...</div>}>
                                    <LetsTalkForm />
                                </React.Suspense>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* BOTTOM: Next Steps */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="mt-32 pt-16 border-t border-white/5"
                >
                    <h3 className="text-center text-2xl font-bold text-white mb-16 uppercase tracking-widest">What Happens Next</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {nextSteps.map((step, idx) => (
                            <div key={idx} className="relative group text-center flex flex-col items-center">
                                <div className="w-20 h-20 rounded-full bg-zinc-800/80 backdrop-blur-2xl border border-white/20 flex items-center justify-center mb-6 group-hover:border-emerald-500/50 group-hover:bg-emerald-500/10 transition-all duration-500 shadow-[0_0_30px_rgba(0,0,0,0.5)]">
                                    <step.icon size={32} className="text-white/30 group-hover:text-emerald-500 transition-colors duration-500" />
                                </div>
                                <h4 className="text-xl font-bold text-white mb-3">{step.title}</h4>
                                <p className="text-white/50 max-w-xs leading-relaxed">{step.desc}</p>

                                {idx < nextSteps.length - 1 && (
                                    <div className="hidden md:block absolute top-10 left-[60%] w-[80%] h-[1px] bg-gradient-to-r from-emerald-500/20 to-transparent z-[-1]" />
                                )}
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default LetsTalkClient;
