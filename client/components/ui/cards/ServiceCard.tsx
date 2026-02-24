'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { useCardMotion } from '@/hooks/useCardMotion';
import { ArrowRight, Code } from 'lucide-react';
import SmartImage from '../SmartImage';

const ServiceCard = ({
    title,
    description,
    deliverables = [], // Used as ability tags (3-4 max)
    outcome,
    illustration,
    icon: IconComponent = Code,
    onClick,
    index = 0,
    scrollYProgress
}: {
    title: string;
    description: string;
    deliverables?: string[];
    outcome?: string;
    illustration: string;
    icon?: any;
    onClick?: () => void;
    index?: number;
    scrollYProgress: any;
}) => {
    const motionProps = useCardMotion(index, scrollYProgress);

    return (
        <motion.div
            {...motionProps as any}
            onClick={onClick}
            className="group relative flex flex-col h-full bg-zinc-800/80 backdrop-blur-2xl border border-white/20 rounded-3xl overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.7)] hover:border-emerald-500/30 cursor-pointer will-change-transform"
        >
            {/* Ambient Glow (Subtle) */}
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

            {/* Illustration Section */}
            <div className="relative w-full h-[220px] overflow-hidden bg-zinc-800">
                <div className="absolute inset-0 bg-gradient-to-t from-[#0E0E0E] via-transparent to-transparent z-10" />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500 z-10" />
                <SmartImage
                    src={`${illustration}`}
                    alt={title}
                    fallbackSrc="/hero-ai.jpg"
                    className="w-full h-full object-cover transform scale-100 group-hover:scale-110 transition-transform duration-700 opacity-80 group-hover:opacity-100 grayscale-[20%] group-hover:grayscale-0"
                />

                {/* Floating Icon */}
                <div className="absolute top-6 left-6 w-12 h-12 rounded-xl bg-[#0E0E0E]/80 backdrop-blur-md border border-white/10 flex items-center justify-center text-white shadow-xl z-20 group-hover:border-emerald-500/30 group-hover:text-emerald-400 transition-colors duration-300">
                    <IconComponent size={24} />
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-grow flex flex-col p-8 pt-2 relative z-20 items-center text-center md:items-start md:text-left">
                <h3 className="text-2xl font-bold text-white mb-3 tracking-tight group-hover:text-emerald-400 transition-colors truncate w-full" title={title}>
                    {title}
                </h3>
                <p className="text-neutral-400 text-sm leading-relaxed mb-8 line-clamp-3 overflow-hidden w-full">
                    {description}
                </p>

                {/* Capability Tags */}
                <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-8 mt-auto">
                    {deliverables.slice(0, 3).map((tag: string, i: number) => (
                        <span
                            key={i}
                            className="px-3 py-1 rounded bg-[#1A1D21] border border-white/5 text-[11px] font-medium text-neutral-400 group-hover:border-white/10 group-hover:text-neutral-300 transition-colors"
                        >
                            {tag}
                        </span>
                    ))}
                </div>

                {/* CTA */}
                <div className="flex items-center justify-center md:justify-start gap-2 text-emerald-500 text-xs font-bold uppercase tracking-widest mt-4 group-hover:text-emerald-400 transition-colors">
                    Explore Service
                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </div>
            </div>
        </motion.div>
    );
};

export default ServiceCard;
