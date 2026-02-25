'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
    ArrowLeft,
    CheckCircle2,
    Code,
    Smartphone,
    Database,
    Palette,
    Cloud,
    Headphones,
    ArrowRight,
    Zap,
    ShieldCheck
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useServices } from '@/hooks/usePageData';
import { getAbsoluteImageUrl } from '@/utils/imageUrl';
import { SERVICES as STATIC_SERVICES } from '@/data/staticContent';

interface ServiceDetailClientProps {
    service: any;
}

const ServiceDetailClient: React.FC<ServiceDetailClientProps> = ({ service }) => {
    const router = useRouter();
    const { data: apiServices = [] } = useServices();

    const iconMap: any = {
        "web-development": Code,
        "mobile-development": Smartphone,
        "erp-development": Database,
        "ui-ux-design": Palette,
        "cloud-devops": Cloud,
        "maintenance-support": Headphones
    };

    if (!service) {
        return (
            <div className="min-h-screen bg-black text-white flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-4">Service Not Found</h2>
                    <button
                        onClick={() => router.push('/services')}
                        className="text-emerald-500 hover:text-emerald-400 font-bold flex items-center gap-2 mx-auto"
                    >
                        <ArrowLeft size={16} /> BACK TO SERVICES
                    </button>
                </div>
            </div>
        );
    }

    const IconComponent = iconMap[service.slug] || Code;

    return (
        <div className="min-h-screen bg-[#070707] text-white selection:bg-emerald-500/30 selection:text-emerald-400 pb-20">

            {/* --- HERO / HEADER SECTION --- */}
            <div className="relative w-full min-h-[60vh] lg:min-h-[500px]">
                {/* Immersive Background Illustration */}
                <div className="absolute inset-x-0 -top-24 bottom-0 z-0 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#070707]/60 to-[#070707] z-10" />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#070707] via-transparent to-[#070707]/20 z-10" />
                    <img
                        src={service.illustration ? getAbsoluteImageUrl(service.illustration) : "/hero-ai.jpg"}
                        alt={service.title}
                        onError={(e: any) => {
                            e.target.onerror = null;
                            e.target.src = "/hero-ai.jpg";
                        }}
                        className="w-full h-full object-cover opacity-50 scale-105"
                    />
                </div>

                {/* Content Overlay */}
                <div className="relative z-20 max-w-7xl mx-auto px-6 md:px-12 lg:px-16 min-h-[60vh] lg:min-h-[500px] flex flex-col pt-32 pb-6">
                    <Link
                        href="/services"
                        className="group flex items-center gap-2 text-white/40 hover:text-emerald-400 text-[10px] font-black uppercase tracking-[0.3em] mb-12 transition-all w-fit"
                    >
                        <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                        BACK TO ALL SERVICES
                    </Link>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-end">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            className="lg:col-span-8"
                        >
                            <div className="flex items-center gap-6 mb-8">
                                <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.1)]">
                                    <IconComponent size={32} />
                                </div>
                                <span className="px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-[0.2em]">
                                    Service Overview
                                </span>
                            </div>

                            <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-8 leading-[0.9] text-white break-words max-w-full overflow-hidden">
                                {service.title}
                            </h1>
                            <p className="text-xl md:text-2xl text-white/70 leading-relaxed font-light mb-10 max-w-2xl break-words hyphens-auto max-w-full">
                                {service.longDescription || service.description}
                            </p>

                            {/* Quick Stats / Highlights */}
                            <div className="flex flex-wrap gap-4">
                                {(service.outcomes || [service.outcome]).filter(Boolean).map((outcome: string, i: number) => (
                                    <div key={i} className="px-5 py-2.5 rounded-xl bg-zinc-800/80 border border-white/20 text-white/80 text-sm font-bold flex items-center gap-3 backdrop-blur-2xl shadow-lg">
                                        <Zap size={14} className="text-emerald-400 fill-emerald-400/20" />
                                        {outcome}
                                    </div>
                                ))}
                            </div>
                        </motion.div>

                        {/* Hero CTA Card */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="lg:col-span-4"
                        >
                            <div className="p-8 rounded-[32px] bg-zinc-800/80 backdrop-blur-2xl border border-white/20 shadow-2xl relative overflow-hidden group/cta">
                                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-transparent opacity-0 group-hover/cta:opacity-100 transition-opacity duration-700" />
                                <h4 className="text-white text-xl font-bold mb-2 relative z-10">Scale Faster.</h4>
                                <p className="text-white/40 text-sm mb-8 relative z-10">
                                    Ready to implement {service.title}? Let's architect your success today.
                                </p>
                                <Link
                                    href={`/lets-talk?type=services&subject=${service.title}`}
                                    className="w-full py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-2 transition-all active:scale-95 relative z-10 shadow-[0_0_20px_rgba(16,185,129,0.2)]"
                                >
                                    Start Conversation <ArrowRight size={14} />
                                </Link>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* --- CORE CONTENT GRID --- */}
            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-16 mt-8">

                {/* LEFT COLUMN: Deep Dive (Capabilities & Process) */}
                <div className="lg:col-span-8 space-y-20">

                    {/* Capabilities */}
                    {(service.capabilities || []).length > 0 && (
                        <section>
                            <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
                                <span className="w-8 h-[1px] bg-emerald-500"></span>
                                Core Capabilities
                            </h2>
                            <div className="grid md:grid-cols-2 gap-6">
                                {service.capabilities.map((cap: any, i: number) => (
                                    <div key={i} className="p-8 rounded-3xl bg-zinc-800/80 backdrop-blur-2xl border border-white/20 hover:border-emerald-500/30 transition-all shadow-xl">
                                        <h3 className="text-lg font-bold text-white mb-3 break-words">{cap.title}</h3>
                                        <p className="text-white/50 text-sm leading-relaxed break-words">{cap.description}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Detailed Process */}
                    {(service.detailedProcess || []).length > 0 && (
                        <section>
                            <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
                                <span className="w-8 h-[1px] bg-emerald-500"></span>
                                How We Work
                            </h2>
                            <div className="space-y-6">
                                {service.detailedProcess.map((step: any, i: number) => (
                                    <div key={i} className="flex gap-6 group">
                                        <div className="flex flex-col items-center">
                                            <div className="w-10 h-10 rounded-full bg-neutral-900 border border-white/10 flex items-center justify-center text-white/50 font-mono text-sm group-hover:border-emerald-500/50 group-hover:text-emerald-400 transition-colors">
                                                {i + 1}
                                            </div>
                                            {i !== service.detailedProcess.length - 1 && (
                                                <div className="w-[1px] h-full bg-white/5 my-2 group-hover:bg-emerald-500/20 transition-colors" />
                                            )}
                                        </div>
                                        <div className="pb-8 pt-2">
                                            <h4 className="text-lg font-bold text-white mb-2">{step.title}</h4>
                                            <p className="text-white/50 text-sm leading-relaxed max-w-xl">{step.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                </div>

                {/* RIGHT COLUMN: Sidebar (Use Cases & Outcomes) */}
                <div className="lg:col-span-4 space-y-12">

                    {/* Use Cases Box */}
                    {(service.useCases || []).length > 0 && (
                        <div className="p-8 rounded-3xl bg-zinc-800/80 backdrop-blur-2xl border border-white/20 shadow-xl sticky top-24">
                            <h3 className="text-sm font-bold uppercase tracking-widest text-white/40 mb-6 flex items-center gap-2">
                                <ShieldCheck size={14} /> Who This Is For
                            </h3>
                            <ul className="space-y-4">
                                {service.useCases.map((useCase: string, i: number) => (
                                    <li key={i} className="flex items-start gap-3 text-sm text-white/80">
                                        <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                                        {useCase}
                                    </li>
                                ))}
                            </ul>

                            {/* Sidebar Footer */}
                            <div className="mt-6">
                                <p className="text-white/20 text-[10px] uppercase tracking-widest text-center">
                                    Premium Software Engineering
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Related Services */}
                    {(service.relatedServices || []).length > 0 && (
                        <div>
                            <h3 className="text-sm font-bold uppercase tracking-widest text-white/40 mb-6">Related Services</h3>
                            <div className="space-y-3">
                                {service.relatedServices.map((relatedSlug: string, i: number) => {
                                    // Fallback to static if API service not loaded yet (or not fetched)
                                    // Though API should be faster or eventually loaded.
                                    const relatedService = apiServices.find((s: any) => s.slug === relatedSlug) || STATIC_SERVICES.find((s: any) => s.slug === relatedSlug);
                                    if (!relatedService) return null;
                                    return (
                                        <Link
                                            key={i}
                                            href={`/services/${relatedService.slug}`}
                                            className="block p-4 rounded-xl border border-white/5 hover:bg-white/5 hover:border-white/10 transition-all group"
                                        >
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors">
                                                    {relatedService.title}
                                                </span>
                                                <ArrowRight size={14} className="text-white/20 group-hover:text-emerald-400 -translate-x-2 group-hover:translate-x-0 opacity-0 group-hover:opacity-100 transition-all" />
                                            </div>
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ServiceDetailClient;
