'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Scale, FileText, CheckSquare, ShieldCheck, Globe } from 'lucide-react';

const TermsClient = () => {
    const sections = [
        {
            icon: FileText,
            title: "Service Usage",
            content: "By accessing ProHostix services and applications, you agree to comply with our acceptable use policies. Our systems are designed for enterprise applications and must not be used for unauthorized or malicious activities."
        },
        {
            icon: CheckSquare,
            title: "Client Obligations",
            content: "Clients must ensure that the data they provide or process using our systems complies with all applicable local and international laws. ProHostix is not liable for data integrity breaches caused by user-side negligence."
        },
        {
            icon: ShieldCheck,
            title: "Intellectual Property",
            content: "All proprietary architecture, codebase, and methodologies developed by ProHostix remain our intellectual property unless explicitly transferred under a custom service level agreement."
        },
        {
            icon: Scale,
            title: "Liability & Support",
            content: "While we guarantee 99.9% uptime on our SLA tiers, ProHostix is not liable for indirect damages resulting from third-party API failures or cloud infrastructure outages beyond our control."
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
                        <Scale size={12} /> Legal Framework
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-7xl font-black uppercase tracking-tighter leading-none mb-8"
                    >
                        Terms of <span className="text-emerald-500">Service</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-white/50 text-lg md:text-xl max-w-2xl mx-auto font-medium leading-relaxed"
                    >
                        These Terms of Service govern your use of ProHostix platforms and services. We value transparency, fairness, and mutual growth.
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

            {/* --- DETAILED TERMS --- */}
            <div className="bg-[#050505] py-24 border-y border-white/5">
                <div className="max-w-4xl mx-auto px-6">
                    <div className="space-y-16">
                        <section>
                            <h2 className="text-xs font-black uppercase tracking-[0.4em] text-emerald-500 mb-6 flex items-center gap-4">
                                <div className="h-[1px] w-8 bg-emerald-500/30" /> 01. Agreement Overview
                            </h2>
                            <div className="prose prose-invert max-w-none text-white/60 font-medium leading-loose space-y-4">
                                <p>This document constitutes a legally binding agreement between you and ProHostix. By accessing our services, engaging in software development contracts, or utilizing our APIs, you accept these terms in full.</p>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-xs font-black uppercase tracking-[0.4em] text-emerald-500 mb-6 flex items-center gap-4">
                                <div className="h-[1px] w-8 bg-emerald-500/30" /> 02. Service Modifications
                            </h2>
                            <div className="prose prose-invert max-w-none text-white/60 font-medium leading-loose space-y-4">
                                <p>ProHostix reserves the right to modify, suspend, or discontinue any service with 30 days prior notice to active clients. We continuously push updates to improve security and performance without disrupting existing SLAs.</p>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-xs font-black uppercase tracking-[0.4em] text-emerald-500 mb-6 flex items-center gap-4">
                                <div className="h-[1px] w-8 bg-emerald-500/30" /> 03. Governing Law
                            </h2>
                            <div className="prose prose-invert max-w-none text-white/60 font-medium leading-loose space-y-4">
                                <p>These terms are governed by and construed in accordance with the laws of India. Any disputes relating to these terms and conditions will be subject to the exclusive jurisdiction of the courts of Kerala & Uttar Pradesh.</p>
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
                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">Last Updated: Q3 2026</span>
                </div>
            </div>
        </div>
    );
};

export default TermsClient;
