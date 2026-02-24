'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import SmartImage from '@/components/ui/SmartImage';
import { useCardMotion } from '@/hooks/useCardMotion';

interface CaseStudyStats {
    value: string;
    label: string;
}

interface CaseStudyCardProps {
    title: string;
    category: string;
    description: string;
    stats?: CaseStudyStats[];
    image?: string;
    cta?: string;
    link?: string;
    index: number;
    tags?: string[];
}

const CaseStudyCard: React.FC<CaseStudyCardProps> = ({
    title,
    category,
    description,
    stats = [],
    image,
    cta,
    link = '#',
    index,
    tags = []
}) => {
    const motionProps = useCardMotion(index);

    return (
        <motion.div
            {...motionProps as any}
            className={`group flex flex-col ${index % 2 === 1 ? 'md:flex-row-reverse' : 'md:flex-row'} gap-10 md:gap-20 items-center justify-between pb-24 border-b border-white/5 last:border-0`}
        >
            {/* Visual Side */}
            <div className="w-full md:w-1/2">
                <div className="relative aspect-[16/10] rounded-[24px] overflow-hidden border border-white/10 bg-white/5 group-hover:border-emerald-500/30 transition-all duration-500">
                    <div className="absolute inset-0 bg-neutral-900/50 z-10" />
                    {image && (
                        <SmartImage
                            src={image}
                            alt={title}
                            className="w-full h-full object-cover opacity-60 group-hover:opacity-80 group-hover:scale-105 transition-all duration-700"
                        />
                    )}

                    {/* Overlay Stats */}
                    <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black via-black/80 to-transparent z-20">
                        <div className="flex justify-between items-end">
                            {stats.length > 0 && stats.map((stat, i) => (
                                <div key={i}>
                                    <div className="text-xl font-bold text-white mb-1">{stat.value}</div>
                                    <div className="text-[10px] uppercase font-bold tracking-widest text-emerald-500">{stat.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Side */}
            <div className="w-full md:w-1/2 flex flex-col items-start text-left">
                <span className="mb-4 inline-block px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] font-bold uppercase tracking-widest text-emerald-400">
                    {category}
                </span>
                <h3 className="text-3xl md:text-5xl font-black text-white mb-6 uppercase tracking-tighter leading-[0.9] group-hover:text-emerald-500 transition-colors line-clamp-2 overflow-hidden">
                    {title}
                </h3>
                <p className="text-white/50 text-lg leading-relaxed mb-8 max-w-md line-clamp-3 overflow-hidden">
                    {description}
                </p>

                <div className="flex flex-wrap items-center justify-between gap-6 w-full">
                    <div className="flex flex-wrap gap-2">
                        {tags.map((tag, i) => (
                            <span key={i} className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/40 text-xs font-bold uppercase tracking-wider">
                                {tag}
                            </span>
                        ))}
                    </div>

                    <a href={link} className="flex items-center gap-2 px-6 py-3 rounded-full bg-white text-black font-bold text-xs uppercase tracking-widest hover:bg-emerald-500 transition-all group/btn">
                        {cta}
                        <ArrowUpRight size={16} className="group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                    </a>
                </div>
            </div>
        </motion.div>
    );
};

export default CaseStudyCard;
