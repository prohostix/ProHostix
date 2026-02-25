'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useCardMotion } from '@/hooks/useCardMotion';
import { ArrowRight, Layers } from 'lucide-react';
import SmartImage from '@/components/ui/SmartImage';

interface SolutionCardProps {
    title: string;
    description: string;
    tags?: string[];
    cta?: string;
    illustration?: string;
    icon?: any;
    onClick?: () => void;
    projectLink?: { url: string; label: string };
    hasCaseStudy?: boolean;
    className?: string;
    index?: number;
    isShuffle?: boolean;
    scrollYProgress: any;
}

const SolutionCard: React.FC<SolutionCardProps> = ({
    title,
    description,
    tags = [],
    cta,
    illustration,
    icon: IconComponent = Layers,
    onClick,
    projectLink,
    hasCaseStudy = false,
    className = '',
    index = 0,
    isShuffle = false,
    scrollYProgress
}) => {
    const motionProps = useCardMotion(index, scrollYProgress);

    return (
        <motion.div
            {...motionProps as any}
            onClick={onClick}
            className={`group relative rounded-[32px] border ${hasCaseStudy ? 'border-emerald-500/40 bg-zinc-800/90 shadow-[0_0_40px_rgba(16,185,129,0.1)]' : 'border-white/20 bg-zinc-800/80'} backdrop-blur-2xl shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] hover:bg-zinc-800/90 hover:border-emerald-500/40 transition-all duration-500 flex flex-col overflow-hidden cursor-pointer will-change-transform ${className}`}
        >
            {/* Case Study Badge */}
            {hasCaseStudy && (
                <div className="absolute top-6 left-6 z-30">
                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500 text-black border border-emerald-400/50 shadow-[0_0_15px_rgba(16,185,129,0.4)]">
                        <span className="text-[9px] font-black uppercase tracking-widest">Case Study Available</span>
                    </div>
                </div>
            )}

            {/* Live Badge */}
            {projectLink && (
                <div className="absolute top-6 right-6 z-30">
                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 backdrop-blur-md">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">Live</span>
                    </div>
                </div>
            )}

            {/* Hover Gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none z-10" />

            {/* Illustration Section */}
            <div className="relative w-full h-[160px] overflow-hidden bg-zinc-800">
                {illustration ? (
                    <div className="relative w-full h-full">
                        <SmartImage
                            src={illustration}
                            alt={title}
                            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 opacity-100 brightness-100 contrast-100"
                        />
                        {/* Edge Fade Overlay */}
                        <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-zinc-800 via-zinc-800/40 to-transparent pointer-events-none z-10" />
                    </div>
                ) : (
                    <div className="w-full h-full bg-emerald-500/5 flex items-center justify-center">
                        <div className="w-16 h-16 rounded-full bg-emerald-500/10 blur-2xl animate-pulse" />
                    </div>
                )}

                {/* Floating Icon Over Illustration */}
                <div className="absolute bottom-4 left-6 w-12 h-12 rounded-xl bg-white/5 backdrop-blur-md border border-white/10 flex items-center justify-center text-white/50 group-hover:text-emerald-400 group-hover:border-emerald-500/30 transition-all duration-500 shadow-xl z-20">
                    <IconComponent size={24} />
                </div>
            </div>

            {/* Content Area */}
            <div className="relative z-20 p-6 flex-grow flex flex-col items-center text-center md:items-start md:text-left">
                <h3 className="text-2xl font-bold text-white mb-2 tracking-tight group-hover:text-emerald-400/90 transition-colors truncate w-full" title={title}>
                    {title}
                </h3>
                <p className="text-white/50 text-sm leading-relaxed mb-6 max-w-md line-clamp-2 overflow-hidden w-full">
                    {description}
                </p>

                <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-6 mt-auto">
                    {tags.map((tag, i) => (
                        <span key={i} className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/40 text-[9px] font-bold uppercase tracking-wider group-hover:border-white/20 group-hover:text-white/70 transition-colors">
                            {tag}
                        </span>
                    ))}
                </div>

                <div className="flex flex-wrap justify-center md:justify-between items-center gap-4 pt-5 border-t border-white/5 w-full">
                    <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-emerald-400 group-hover:text-emerald-300 transition-colors">
                        {cta}
                        <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                    </div>

                    {projectLink && (
                        <a
                            href={projectLink.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="px-4 py-2 rounded-full border border-white/10 bg-white/5 text-[10px] font-bold uppercase tracking-widest text-white/60 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all sm:ml-auto"
                        >
                            {projectLink.label}
                        </a>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

export default SolutionCard;
