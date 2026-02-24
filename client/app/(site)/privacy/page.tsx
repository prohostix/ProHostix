'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, Eye, Server, Cpu, Globe, ChevronRight } from 'lucide-react';

const PrivacyProtocol = () => {
    const sections = [
        {
            icon: Eye,
            title: "Data Visibility",
            content: "We provide absolute transparency into what data is collected. ProHostix operates on a 'Minimum Viable Data' principle, only capturing telemetry essential for system optimization and security."
        },
        {
            icon: Lock,
            title: "Encryption Layer",
            content: "All data, whether at rest or in transit, is protected by AES-256 and TLS 1.3 protocols. Critical architectural schemas are further isolated within encrypted hardware security modules (HSMs)."
        },
        {
            icon: Server,
            title: "Infrastructure Protocol",
            content: "Your data is architected across distributed, high-availability clusters. We do not use third-party processing for mission-critical operations, maintaining a closed-loop engineering environment."
        },
        {
            icon: Cpu,
            title: "System Integrity",
            content: "We conduct bi-weekly security audits and automated vulnerability scans. Access to the core engine telemetry is restricted to senior architectural staff via hardware-based 2FA."
        }
    ];

    return (
        <div className="min-h-screen bg-black text-white selection:bg-emerald-500/30">
            {/* --- HERO SECTION --- */}
            <div className="relative pt-32 pb-20 px-6 border-b border-white/5 overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none" />

                <div className="max-w-5xl mx-auto relative z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-[0.2em] mb-8"
                    >
                        <Shield size={12} /> Privacy Infrastructure
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-7xl font-black uppercase tracking-tighter leading-none mb-8"
                    >
                        Security <span className="text-emerald-500">Protocol</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-white/50 text-lg md:text-xl max-w-2xl mx-auto font-medium leading-relaxed"
                    >
                        ProHostix is built on a foundation of absolute data integrity. This protocol outlines our commitment to technical security and privacy excellence.
                    </motion.p>
                </div>
            </div>

            {/* --- CORE PRINCIPLES --- */}
            <div className="max-w-7xl mx-auto px-6 py-24">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {sections.map((section, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                            className="p-8 rounded-[32px] bg-[#0A0A0A] border border-white/5 hover:border-emerald-500/30 transition-all duration-500 group"
                        >
                            <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 text-white/40 group-hover:text-emerald-400 group-hover:bg-emerald-500/10 group-hover:border-emerald-500/30 transition-all duration-500">
                                <section.icon size={24} />
                            </div>
                            <h3 className="text-2xl font-black uppercase tracking-tight mb-4">{section.title}</h3>
                            <p className="text-white/50 leading-loose font-medium">{section.content}</p>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* --- DETAILED DATA POLICY --- */}
            <div className="bg-[#050505] py-24 border-y border-white/5">
                <div className="max-w-4xl mx-auto px-6">
                    <div className="space-y-16">
                        <section>
                            <h2 className="text-xs font-black uppercase tracking-[0.4em] text-emerald-500 mb-6 flex items-center gap-4">
                                <div className="h-[1px] w-8 bg-emerald-500/30" /> 01. Collection
                            </h2>
                            <div className="prose prose-invert max-w-none text-white/60 font-medium leading-loose space-y-4">
                                <p>We collect system interaction data to improve the performance of our CRM and ERP architectures. This includes API response times, resource utilization metrics, and system-level event logs. We do not sell or trade your data to third-party advertising networks.</p>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-xs font-black uppercase tracking-[0.4em] text-emerald-500 mb-6 flex items-center gap-4">
                                <div className="h-[1px] w-8 bg-emerald-500/30" /> 02. Processing
                            </h2>
                            <div className="prose prose-invert max-w-none text-white/60 font-medium leading-loose space-y-4">
                                <p>Processing is localized within geographically optimized data centers. We maintain strict data residency compliance, ensuring your operational data never leaves the authorized regional boundaries.</p>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-xs font-black uppercase tracking-[0.4em] text-emerald-500 mb-6 flex items-center gap-4">
                                <div className="h-[1px] w-8 bg-emerald-500/30" /> 03. Retention
                            </h2>
                            <div className="prose prose-invert max-w-none text-white/60 font-medium leading-loose space-y-4">
                                <p>Data is retained only as long as necessary for providing our services. Log data is automatically purged after 90 days unless required for active security investigations or legal compliance.</p>
                            </div>
                        </section>
                    </div>
                </div>
            </div>

            {/* --- BOTTOM METADATA --- */}
            <div className="max-w-4xl mx-auto px-6 py-32 text-center">
                <div className="flex items-center justify-center gap-8 opacity-20 hover:opacity-100 transition-opacity">
                    <Globe size={16} />
                    <div className="h-4 w-[1px] bg-white" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">Last Updated: Q1 2026</span>
                </div>
            </div>
        </div>
    );
};

export default PrivacyProtocol;
