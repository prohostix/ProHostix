'use client';
import React from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { PAGE_CONTENT } from "../../data/staticContent";
import { ArrowRight, Box } from "lucide-react";
import { useIsMobile } from "../../hooks/useIsMobile";

export default function CTASection() {
    const router = useRouter();
    const isMobile = useIsMobile();
    // Use static content
    const sectionData = PAGE_CONTENT.home.cta_section;

    // Smooth scroll-driven animation instead of threshold-based trigger
    // The scroll-driven animation logic (useScroll, useTransform) and useEffect for IntersectionObserver are removed as per instructions.

    return (
        <motion.div
            className="relative w-full flex items-center justify-center px-6 md:px-12 lg:px-16 py-24 md:py-40 overflow-hidden bg-slate-50"
        // scale, opacity, and willChange are removed as useScroll and useTransform are no longer used.
        >
            <div className="relative w-full max-w-7xl mx-auto flex flex-col items-center text-center z-10">

                <h2 className="text-4xl md:text-7xl font-black tracking-tighter uppercase mb-10 leading-[0.85] text-slate-900">
                    {sectionData.titlePart1} <br /> <span className="text-emerald-600">{sectionData.titlePart2}</span> {sectionData.titlePart3}
                </h2>

                <p className="text-lg md:text-xl font-medium leading-relaxed mb-12 max-w-2xl text-slate-500">
                    {sectionData.description}
                </p>

                <div className="flex flex-col sm:flex-row gap-6 mt-4">
                    <button
                        onClick={() => {
                            router.push("/lets-talk");
                            window.scrollTo(0, 0);
                        }}
                        className="h-16 px-12 bg-slate-900 text-white font-black rounded-2xl hover:bg-slate-800 transition-all hover:scale-105 active:scale-95 shadow-[0_10px_30px_rgba(15,23,42,0.15)]">
                        {sectionData.primaryButtonText}
                    </button>
                    <button
                        onClick={() => {
                            router.push("/services");
                            window.scrollTo(0, 0);
                        }}
                        className="h-16 px-12 bg-transparent border border-emerald-500/50 text-emerald-500 font-black rounded-2xl hover:border-emerald-400 hover:text-emerald-400 transition-all hover:bg-emerald-500/10 hover:scale-[1.03] active:scale-[0.98]">
                        {sectionData.secondaryButtonText}
                    </button>
                </div>
            </div>

            {/* Background Elements */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className={`absolute top-1/2 left-0 w-[600px] h-[600px] bg-emerald-500/5 rounded-full mix-blend-multiply ${isMobile ? 'blur-[60px]' : 'blur-[120px]'}`} />
                <div className={`absolute top-1/2 right-0 w-[400px] h-[400px] bg-blue-500/5 rounded-full mix-blend-multiply ${isMobile ? 'blur-[50px]' : 'blur-[100px]'}`} />
            </div>
        </motion.div>
    );
}
