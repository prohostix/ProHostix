'use client';
import React from "react";
import { motion } from "framer-motion";
import { ShieldCheck } from "lucide-react";
import { PAGE_CONTENT } from "../../data/staticContent";
import { useIsMobile } from "../../hooks/useIsMobile";

export default function CoreSpecializations() {
    const isMobile = useIsMobile();

    // Use static content
    const section = PAGE_CONTENT.home.core_specializations;

    // Loading check removed as data is static

    return (
        <section className="relative py-16 bg-black w-full overflow-hidden">
            <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
                {/* LEFT — TEXT */}
                <motion.div
                    initial={{ opacity: 0, y: isMobile ? 15 : 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: isMobile ? 0.4 : 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className="px-6 md:px-12 lg:px-16 flex flex-col items-center text-center lg:items-start lg:text-left"
                >
                    {/* Badge */}
                    <div className="inline-flex items-center px-4 py-2 mb-6 rounded-full border border-emerald-400/20 text-emerald-400 text-sm font-semibold">
                        {section.badge}
                    </div>

                    {/* Title */}
                    <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-6">
                        {section.title}
                    </h2>

                    {/* Caption */}
                    <p className="text-lg text-white/60 leading-relaxed max-w-xl mb-10">
                        {section.caption}
                    </p>

                    {/* Items */}
                    <div className="space-y-6 w-full">
                        {section.items.map((item, index) => (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, x: isMobile ? -10 : -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: isMobile ? 0 : index * 0.1, duration: 0.6 }}
                                className="border-l-2 border-emerald-400/30 pl-6 text-left mx-auto max-w-lg lg:mx-0"
                            >
                                <h3 className="text-xl font-semibold text-white mb-1">
                                    {item.title}
                                </h3>
                                <p className="text-white/60 leading-relaxed">
                                    {item.description}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* RIGHT — VISUAL / CONTEXT */}
                <motion.div
                    initial={{ opacity: 0, scale: isMobile ? 1 : 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: isMobile ? 0.5 : 0.9, ease: [0.16, 1, 0.3, 1] }}
                    className="relative group perspective-1000 flex justify-center lg:justify-end px-6 md:px-12 lg:px-16 lg:pl-0"
                >
                    <div className="relative rounded-[40px] overflow-hidden bg-zinc-800/80 backdrop-blur-2xl border border-white/20 p-12 shadow-2xl transition-all duration-700 hover:border-emerald-500/20 hover:shadow-[0_20px_80px_-10px_rgba(16,185,129,0.1)] group-hover:-translate-y-2">
                        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-white/[0.03] to-transparent pointer-events-none" />
                        <div className="absolute -top-24 -right-24 w-64 h-64 bg-emerald-500/20 blur-[100px] rounded-full pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />

                        <div className="relative flex flex-col items-center text-center z-10">
                            {/* Faded Background Vector Image (Icon) */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full opacity-[0.03] pointer-events-none select-none z-0">
                                <ShieldCheck className="w-full h-full transform scale-150 rotate-12" />
                            </div>

                            <motion.div
                                initial={{ opacity: 0, x: -30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: false }}
                                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                                className="relative z-10 flex flex-col items-center"
                            >
                                <div className="w-px h-16 bg-gradient-to-b from-transparent via-emerald-500/60 to-transparent mb-8" />
                                <div className="flex items-center gap-3 mb-6">
                                    <span className="text-[10px] uppercase font-bold tracking-[0.3em] text-emerald-400">
                                        Operational Focus
                                    </span>
                                </div>
                                <div className="mb-8 p-4 rounded-full bg-white/[0.02] border border-white/5 group-hover:border-emerald-500/20 group-hover:bg-emerald-500/5 transition-all duration-500">
                                    <ShieldCheck className="w-8 h-8 text-white/40 group-hover:text-emerald-400 transition-colors duration-500" strokeWidth={1.5} />
                                </div>
                                <h3 className="text-3xl md:text-4xl font-bold text-white mb-6 tracking-tight leading-tight uppercase">
                                    Built for Long-Term Control in <br />
                                    <span className="text-emerald-500 italic">ENGINEERING & OPERATIONS</span>
                                </h3>
                                <p className="text-white/50 text-base leading-relaxed max-w-sm mx-auto">
                                    Every system we deliver is engineered for reliability, deep observability, and long-term maintainability—ensuring your infrastructure scales with confidence.
                                </p>
                                <div className="mt-12 w-12 h-1 rounded-full bg-white/10 group-hover:bg-emerald-500/50 transition-colors duration-500" />
                            </motion.div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
