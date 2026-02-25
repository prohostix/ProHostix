'use client';
import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { PAGE_CONTENT } from "../../data/staticContent";
import SmartImage from "../ui/SmartImage";
import { useIsMobile } from "../../hooks/useIsMobile";

/* ---------------------------------------------
   CARD COMPONENT (hooks live here – SAFE)
 ---------------------------------------------- */
function IntelligenceCard({ cap, idx, scrollYProgress }: { cap: any, idx: any, scrollYProgress: any }) {
    const isMobile = useIsMobile();
    const [isHovered, setIsHovered] = React.useState(false);

    const y = useTransform(
        scrollYProgress,
        [0, 0.3],
        [isMobile ? 30 : 60 + idx * 12, 0]
    );

    const x = useTransform(
        scrollYProgress,
        [0, 0.3],
        isMobile ? [0, 0] : (idx === 0 ? [40, 0] : idx === 1 ? [-40, 0] : [20, 0])
    );

    const rotate = useTransform(
        scrollYProgress,
        [0, 0.3],
        isMobile ? [0, 0] : (idx === 0 ? [1.2, 0] : idx === 1 ? [-1.2, 0] : [0.8, 0])
    );

    // Ensure full visibility triggered by viewport
    // Note: Removed scroll-linked opacity to fix dimmed issue permanently

    const progress = useTransform(
        scrollYProgress,
        [0.15, 0.35],
        [0, cap.targetWidth || 0.8]
    );

    return (
        <motion.div
            style={{ y, x, rotate }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.8 }}
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
            className="group relative h-[540px] rounded-[32px] overflow-hidden bg-[#0A0A0A] border border-white/10 hover:border-emerald-500/40 transition-all duration-500 cursor-default shadow-2xl flex flex-col will-change-transform"
        >
            {/* TOP IMAGE SECTION (40% height) */}
            <div className="relative h-[40%] w-full overflow-hidden">
                <SmartImage
                    src={cap.img}
                    alt={cap.title}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] to-transparent" />
            </div>

            {/* CONTENT SECTION (Remaining height) */}
            <div className="flex flex-col flex-grow p-8 relative z-10 -mt-6">
                {/* Progress & Stat Row */}
                <div className="flex justify-between items-center mb-5">
                    <div className="flex-grow mr-4">
                        <div className="h-1 bg-white/10 rounded-full overflow-hidden w-full max-w-[100px]">
                            <motion.div
                                initial={{ scaleX: 0 }}
                                whileInView={{ scaleX: cap.targetWidth || 0.8 }}
                                animate={{
                                    scaleX: isHovered ? 1 : (cap.targetWidth || 0.8),
                                    boxShadow: isHovered ? "0 0 20px #10b981" : "0 0 15px #10b981"
                                }}
                                transition={{ duration: 0.5, ease: "circOut" }}
                                style={{ transformOrigin: "left" }}
                                className="h-full bg-emerald-500 shadow-[0_0_15px_#10b981]"
                            />
                        </div>
                    </div>

                    <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase whitespace-nowrap">
                        {cap.stat}
                    </span>
                </div>

                {/* Title (No Truncate) */}
                <h3 className="text-2xl font-bold mb-3 text-white uppercase tracking-tight group-hover:text-emerald-400 transition-colors w-full break-words">
                    {cap.title}
                </h3>

                {/* Description (Line Clamp relaxed) */}
                <p className="text-white/60 text-sm leading-relaxed mb-6 line-clamp-4 w-full">
                    {cap.desc}
                </p>

                {/* Tags (Bottom Pinned) */}
                <div className="mt-auto flex flex-col items-start gap-2 w-full">
                    {cap.features.map((feat: any, i: number) => (
                        <span
                            key={i}
                            className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-white/50 text-[9px] font-bold uppercase tracking-widest group-hover:border-emerald-500/30 group-hover:text-emerald-500 transition-colors"
                        >
                            {feat}
                        </span>
                    ))}
                </div>
            </div>
        </motion.div>
    );
}

/* ---------------------------------------------
   MAIN SECTION
---------------------------------------------- */
export default function ScalableIntelligence() {
    const sectionRef = useRef(null);

    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start end", "center start"]
    });

    const sectionData = PAGE_CONTENT.home.scalable_intelligence;
    const { title, caption, capabilities = [] } = sectionData;

    return (
        <div
            ref={sectionRef}
            className="relative w-full py-24 bg-black border-t border-white/5"
        >
            {/* Ambient Glow */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none" />

            {/* HEADER */}
            <div className="flex flex-col items-center mb-20 text-center px-6 md:px-12 lg:px-16 max-w-5xl mx-auto relative z-10">
                <h2 className="text-4xl md:text-7xl font-black mb-6 tracking-tighter bg-gradient-to-br from-white via-neutral-200 to-neutral-500 bg-clip-text text-transparent uppercase leading-[0.85]">
                    {title}
                </h2>

                <motion.p
                    style={{
                        y: useTransform(scrollYProgress, [0, 0.2], [20, 0])
                    }}
                    className="text-lg text-white/60 leading-relaxed max-w-xl mx-auto"
                >
                    {caption}
                </motion.p>
            </div>

            {/* CARDS */}
            <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {capabilities.map((cap: any, idx: number) => (
                        <IntelligenceCard
                            key={cap.id}
                            cap={cap}
                            idx={idx}
                            scrollYProgress={scrollYProgress}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
