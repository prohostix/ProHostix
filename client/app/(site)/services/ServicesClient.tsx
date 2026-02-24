'use client';

import React, { useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
    Code, Smartphone, Database, Palette, Cloud, Headphones, Search, Hammer, TrendingUp, ArrowRight
} from 'lucide-react';
import ServiceCard from '@/components/ui/cards/ServiceCard';
import { PAGE_CONTENT } from '@/data/staticContent';
import SmartImage from '@/components/ui/SmartImage';

const iconMap: Record<string, any> = {
    "web-development": Code,
    "mobile-development": Smartphone,
    "erp-development": Database,
    "ui-ux-design": Palette,
    "cloud-devops": Cloud,
    "maintenance-support": Headphones
};

const engagementSteps = [
    { title: "Discover", desc: "We analyze your requirements and define the roadmap.", icon: Search },
    { title: "Build", desc: "Agile development with regular updates and feedback loops.", icon: Hammer },
    { title: "Scale", desc: "Deployment optimization and strategies for growth.", icon: TrendingUp },
];

interface ServicesClientProps {
    services: any[];
}

export default function ServicesClient({ services }: ServicesClientProps) {
    const router = useRouter();
    const pageInfo = PAGE_CONTENT.services.hero;

    const servicesRef = useRef(null);
    const { scrollYProgress: servicesScroll } = useScroll({
        target: servicesRef,
        offset: ["start end", "center start"]
    });

    const pageRef = useRef(null);
    const { scrollYProgress: pageScroll } = useScroll({
        target: pageRef,
        offset: ["start start", "end end"]
    });

    return (
        <div ref={pageRef} className="min-h-screen bg-black text-white selection:bg-emerald-500/30 selection:text-emerald-400 relative overflow-x-hidden">
            {/* --- HERO BACKGROUND IMAGE --- */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[100vw] h-[40vh] overflow-hidden pointer-events-none z-0">
                <SmartImage
                    src="/hero-ai.jpg"
                    alt="Services Engineering Vector"
                    className="w-full h-full object-cover opacity-30 brightness-75 grayscale-[0.2]"
                    priority={true}
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/40 to-black z-10" />
                <div className="absolute top-0 left-0 right-0 h-full bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none" />
            </div>

            {/* --- SECTION 1: SERVICES HERO --- */}
            <div className="relative w-full max-w-7xl mx-auto px-6 md:px-12 lg:px-16 pt-32 pb-20 overflow-hidden text-center">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-emerald-500/5 blur-[100px] rounded-full pointer-events-none" />
                <div className="relative z-10">
                    <motion.span
                        style={{
                            opacity: useTransform(pageScroll, [0, 0.05], [1, 0]),
                            y: useTransform(pageScroll, [0, 0.05], [0, -20])
                        }}
                        className="mb-6 inline-block px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-[0.2em]"
                    >
                        {pageInfo.tagline}
                    </motion.span>
                    <div className="overflow-hidden mb-8">
                        <motion.h1
                            style={{
                                opacity: useTransform(pageScroll, [0, 0.1], [1, 0.3]),
                                y: useTransform(pageScroll, [0, 0.1], [0, -40])
                            }}
                            className="text-4xl md:text-7xl font-black tracking-tighter uppercase leading-[0.9] bg-gradient-to-b from-white via-white/80 to-white/40 bg-clip-text text-transparent max-w-5xl mx-auto"
                        >
                            Engineering Services<br />That Power Intelligence
                        </motion.h1>
                    </div>
                    <motion.p
                        style={{
                            opacity: useTransform(pageScroll, [0, 0.1], [1, 0]),
                            y: useTransform(pageScroll, [0, 0.1], [0, -20])
                        }}
                        className="max-w-2xl mx-auto text-lg md:text-xl font-medium leading-relaxed bg-gradient-to-br from-white/70 via-white/50 to-white/30 bg-clip-text text-transparent"
                    >
                        {pageInfo.subtitle}
                    </motion.p>
                </div>
            </div>

            {/* --- SECTION 2: SERVICE STACK --- */}
            <div ref={servicesRef} className="relative w-full max-w-6xl mx-auto px-6 md:px-12 lg:px-16 py-20">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                    {services.map((service: any, idx: number) => {
                        const IconComponent = iconMap[service.slug] || Code;
                        return (
                            <ServiceCard
                                key={idx}
                                title={service.title}
                                description={service.description}
                                deliverables={service.deliverables}
                                outcome={service.outcome}
                                illustration={service.illustration}
                                icon={IconComponent}
                                onClick={() => router.push(`/services/${service.slug}`)}
                                index={idx}
                                scrollYProgress={servicesScroll}
                            />
                        );
                    })}
                </div>
            </div>

            {/* --- SECTION 3: ENGAGEMENT MODEL --- */}
            <div className="relative w-full bg-neutral-900/40 border-y border-white/5 py-32">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-8 relative">
                        <div className="hidden md:block absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent -translate-y-1/2 z-0" />
                        {engagementSteps.map((step, idx) => (
                            <div key={idx} className="relative z-10 flex flex-col items-center text-center max-w-xs group">
                                <div className="w-20 h-20 rounded-full bg-zinc-800/80 backdrop-blur-xl border border-white/20 flex items-center justify-center mb-6 shadow-2xl relative">
                                    <div className="absolute inset-0 rounded-full bg-emerald-500/5 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                                    <step.icon size={32} className="text-emerald-400" />
                                </div>
                                <h4 className="text-xl font-bold text-white mb-2 uppercase tracking-wider">{step.title}</h4>
                                <p className="text-white/50 text-sm font-medium">{step.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* --- SECTION 4: CTA --- */}
            <div className="relative w-full max-w-5xl mx-auto px-6 md:px-12 lg:px-16 py-32 text-center">
                <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-8 bg-gradient-to-b from-white to-white/40 bg-clip-text text-transparent">
                    Ready to Build?
                </h2>
                <button
                    onClick={() => router.push('/lets-talk')}
                    className="px-10 py-5 rounded-full bg-white text-black hover:bg-emerald-400 font-black uppercase tracking-widest text-sm transition-all duration-300 transform hover:scale-105 shadow-xl flex items-center gap-2 mx-auto"
                >
                    Request a Technical Consultation
                    <ArrowRight size={16} />
                </button>
            </div>
        </div>
    );
};
