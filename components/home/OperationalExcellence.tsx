'use client';
import React from "react";
import { motion } from "framer-motion";
import { PAGE_CONTENT } from "../../data/staticContent";
import SmartImage from "../ui/SmartImage";
import { useIsMobile } from "../../hooks/useIsMobile";

export default function OperationalExcellence() {
    // Use static content
    const section = PAGE_CONTENT.home.operational_excellence;
    const isMobile = useIsMobile(768);

    // Animation variants
    const getVariant = (idx: any) => {
        if (isMobile) {
            return {
                initial: { opacity: 0, y: 15 },
                whileInView: { opacity: 1, y: 0 },
                transition: { duration: 0.4, delay: idx * 0.05 }
            };
        }


        const variants = [
            { initial: { opacity: 0, y: 100, x: 50, rotate: 10 }, delay: 0.1 },
            { initial: { opacity: 0, y: 120, x: -50, rotate: -10 }, delay: 0.2 },
            { initial: { opacity: 0, y: 140, x: 20, rotate: 5 }, delay: 0.3 }
        ];

        return {
            initial: variants[idx].initial,
            whileInView: { opacity: 1, y: 0, x: 0, rotate: 0 },
            transition: { type: "spring", stiffness: 120, damping: 20, delay: variants[idx].delay },
            style: { willChange: "transform, opacity" }
        } as any;
    };

    return (
        <div className="relative w-full py-20 lg:py-32 border-t border-white/5 overflow-visible bg-black">
            <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16 flex flex-col lg:flex-row items-center gap-20 lg:gap-32">

                {/* LEFT: TEXT CONTENT */}
                <div className="w-full lg:w-[45%] flex flex-col items-center text-center lg:items-start lg:text-left relative z-10">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[10px] uppercase font-black tracking-[0.4em] mb-8">
                        Execution Layer
                    </div>
                    <h2 className="text-4xl md:text-7xl font-black tracking-tighter uppercase mb-8 leading-[0.85] bg-gradient-to-br from-white via-neutral-200 to-neutral-500 bg-clip-text text-transparent">
                        {section.title}
                    </h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="max-w-sm text-lg md:text-xl font-medium leading-relaxed mb-10 bg-gradient-to-br from-white/70 via-white/50 to-white/30 bg-clip-text text-transparent mx-auto lg:mx-0"
                    >
                        {section.subtitle}
                    </motion.p>

                    <div className="flex items-center gap-3 px-5 py-2.5 rounded-xl bg-emerald-500/5 border border-emerald-500/10 text-emerald-500 text-[10px] uppercase font-black tracking-[0.25em]">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        Active Systems Tracking
                    </div>
                </div>

                {/* RIGHT: VISUAL STACK */}
                <div className="w-full lg:w-[55%] relative min-h-[600px] flex items-center justify-center lg:justify-end">

                    {/* PRIMARY MEDIA */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.85, x: 60 }}
                        whileInView={{ opacity: 1, scale: 1, x: 0 }}
                        animate={{ y: [0, -12, 0] }}
                        transition={{
                            duration: 1.2,
                            ease: [0.16, 1, 0.3, 1],
                            y: {
                                duration: 8,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }
                        }}
                        className="relative w-[85%] md:w-[70%] lg:w-full max-w-sm md:max-w-md lg:max-w-md aspect-[4/3] mx-auto md:translate-x-12 lg:translate-x-0 lg:mx-0 lg:ml-auto transform rotate-2 z-10 shadow-[0_40px_100px_rgba(0,0,0,0.6)] rounded-[48px] overflow-hidden group cursor-pointer force-gpu"
                    >
                        <SmartImage
                            src={section.humanImage.src}
                            alt={section.humanImage.alt}
                            className="w-full h-full object-cover opacity-100 saturate-[1.0] scale-110 transition-all duration-700 ease-out group-hover:scale-125"
                        />
                        <div className="absolute inset-0 bg-gradient-to-tr from-black via-black/20 to-transparent" />
                    </motion.div>

                    {/* STACKED CONTENT CARDS */}
                    <div className="absolute inset-0 pointer-events-none">

                        {/* Card 1 */}
                        <motion.div
                            {...getVariant(0)}
                            viewport={{ once: false, amount: 0.1 }}
                            className={`absolute top-[0%] lg:left-[-15%] left-1/2 -translate-x-1/2 md:-translate-x-[90%] lg:translate-x-0 w-[90%] md:w-[340px] p-8 rounded-[40px] bg-zinc-800/80 safari-blur-fix force-gpu border border-white/20 shadow-[0_50px_100px_rgba(0,0,0,0.6)] ${isMobile ? 'shadow-black/40' : 'shadow-black/90'} pointer-events-auto z-40 group`}
                        >
                            <motion.div
                                animate={{ y: [0, -8, 0] }}
                                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                                className="flex flex-col gap-5"
                            >
                                <div className="flex items-center justify-between">
                                    <span className="text-[10px] uppercase font-black tracking-[0.4em] text-emerald-500">Live Status</span>
                                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_15px_#10b981]" />
                                </div>
                                <h4 className="text-2xl lg:text-3xl font-black tracking-tighter uppercase transition-all duration-500 bg-gradient-to-r from-emerald-500 to-neutral-500 bg-clip-text text-transparent">
                                    {section.cards[0].title}
                                </h4>
                                <p className="text-white/90 text-sm font-medium leading-relaxed">
                                    {section.cards[0].description}
                                </p>
                            </motion.div>
                        </motion.div>

                        {/* Card 2 */}
                        <motion.div
                            {...getVariant(1)}
                            viewport={{ once: false, amount: 0.1 }}
                            className={`absolute top-[38%] lg:left-[8%] left-1/2 -translate-x-1/2 md:-translate-x-[90%] lg:translate-x-0 w-[90%] md:w-[340px] p-8 rounded-[32px] bg-zinc-800/80 safari-blur-fix force-gpu border border-white/20 shadow-[0_30px_60px_rgba(0,0,0,0.5)] ${isMobile ? 'shadow-black/40' : 'shadow-black/80'} pointer-events-auto z-30 group`}
                        >
                            <motion.div
                                animate={{ y: [0, -8, 0] }}
                                transition={{ duration: 6, delay: 0.5, repeat: Infinity, ease: "easeInOut" }}
                                className="flex flex-col gap-4"
                            >
                                <span className="text-[9px] uppercase font-black tracking-[0.3em] text-white/80">Infrastructure</span>
                                <h4 className="text-xl lg:text-2xl font-black tracking-tighter uppercase leading-tight transition-all duration-500 bg-gradient-to-r from-emerald-500 to-neutral-500 bg-clip-text text-transparent">
                                    {section.cards[1].title}
                                </h4>
                                <p className="text-white/90 text-xs font-medium leading-relaxed">
                                    {section.cards[1].description}
                                </p>
                            </motion.div>
                        </motion.div>

                        {/* Card 3 */}
                        <motion.div
                            {...getVariant(2)}
                            viewport={{ once: false, amount: 0.1 }}
                            className={`absolute bottom-[2%] lg:left-[-5%] left-1/2 -translate-x-1/2 md:-translate-x-[90%] lg:translate-x-0 w-[90%] md:w-[340px] p-8 rounded-[32px] bg-zinc-800/80 safari-blur-fix force-gpu border border-white/20 shadow-[0_20px_40px_rgba(0,0,0,0.4)] ${isMobile ? 'shadow-black/40' : 'shadow-black/70'} pointer-events-auto z-20 group`}
                        >
                            <motion.div
                                animate={{ y: [0, -8, 0] }}
                                transition={{ duration: 7, delay: 1, repeat: Infinity, ease: "easeInOut" }}
                                className="flex flex-col gap-4"
                            >
                                <span className="text-[9px] uppercase font-black tracking-[0.3em] text-white/80 opacity-0">Monitoring Status</span>
                                <h4 className="text-lg lg:text-xl font-black tracking-tighter uppercase leading-tight transition-all duration-500 bg-gradient-to-r from-emerald-500 to-neutral-500 bg-clip-text text-transparent">
                                    {section.cards[2].title}
                                </h4>
                                <p className="text-white/90 text-xs font-medium leading-relaxed">
                                    {section.cards[2].description}
                                </p>
                            </motion.div>
                        </motion.div>

                    </div>
                </div>
            </div>
        </div>
    );
}
