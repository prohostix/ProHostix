'use client';
import React, { useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { PAGE_CONTENT } from "../../data/staticContent";
import SmartImage from "../ui/SmartImage";
import { useIsMobile } from "../../hooks/useIsMobile";

/* ---------------------------------------------
   PROJECT CARD COMPONENT
 ---------------------------------------------- */
function ProjectCard({ project, idx, scrollYProgress }: { project: any, idx: any, scrollYProgress: any }) {
    const isMobile = useIsMobile();
    const router = useRouter();

    const y = useTransform(
        scrollYProgress,
        [0, 0.3],
        [isMobile ? 30 : 80 + idx * 15, 0]
    );

    const x = useTransform(
        scrollYProgress,
        [0, 0.3],
        isMobile ? [0, 0] : (idx % 2 === 0 ? [-30, 0] : [30, 0])
    );

    const rotate = useTransform(
        scrollYProgress,
        [0, 0.3],
        isMobile ? [0, 0] : (idx % 2 === 0 ? [-1.2, 0] : [1.2, 0])
    );


    // Replaced scroll-linked opacity with whileInView to fix "dimmed" issue
    // This ensures full visibility once the card enters the viewport

    return (
        <motion.div
            style={{ y, x, rotate }}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            onClick={() => router.push(project.link || '/case-studies')}
            className="group relative h-[450px] w-full overflow-hidden rounded-[32px] bg-[#0A0A0A] border border-white/10 hover:border-emerald-500/30 transition-all duration-500 shadow-2xl cursor-pointer flex flex-col will-change-transform"
        >
            {/* IMAGE SECTION - Takes up most space */}
            <div className="absolute inset-x-0 top-0 bottom-[140px] overflow-hidden">
                <SmartImage
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 opacity-90 group-hover:opacity-100"
                />
                {/* Subtle gradient overlay for better text contrast if needed */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] to-transparent opacity-80" />
            </div>

            {/* CONTENT OVERLAY PANEL - Anchored Bottom with Fixed Height/Space */}
            <div className="absolute bottom-0 left-0 right-0 h-[160px] bg-[#0A0A0A] border-t border-white/5 p-6 flex flex-row items-center justify-between transition-colors duration-300 z-10">
                <div className="flex flex-col items-start gap-2 w-full pr-4">
                    {/* TAGS */}
                    <div className="flex flex-wrap justify-center sm:justify-start gap-2 mb-1">
                        {(project.tags || []).map((tag: any, i: number) => (
                            <span
                                key={i}
                                className="px-2.5 py-1 rounded-lg text-[10px] font-bold tracking-widest uppercase text-emerald-400 bg-emerald-500/10 border border-emerald-500/20"
                            >
                                {tag}
                            </span>
                        ))}
                    </div>

                    {/* TITLE */}
                    <h3 className="text-2xl font-bold text-white tracking-tight uppercase leading-snug group-hover:text-emerald-400 transition-colors duration-300">
                        {project.title}
                    </h3>

                    {/* DESCRIPTION */}
                    <p className="text-sm text-white/60 max-w-md line-clamp-2 leading-relaxed">
                        {project.description}
                    </p>
                </div>

                {/* CTA ACTION */}
                <button
                    className="w-12 h-12 rounded-full flex items-center justify-center bg-white/5 border border-white/10 text-white/50 group-hover:bg-emerald-500 group-hover:text-black group-hover:border-emerald-500 transition-all duration-300 shrink-0 self-center md:self-auto"
                    aria-label="View project details"
                >
                    <ArrowRight size={20} strokeWidth={2} />
                </button>
            </div>
        </motion.div >
    );
}

/* ---------------------------------------------
   MAIN SECTION
---------------------------------------------- */
export default function PioneerWork() {
    const router = useRouter(); // Initialize router
    const sectionRef = useRef(null);

    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start end", "center start"]
    });

    const sectionData = PAGE_CONTENT.home.pioneer_work;
    const { title, caption, projects = [] } = sectionData;

    return (
        <div ref={sectionRef} className="relative w-full py-32 bg-black border-t border-white/5 overflow-hidden">
            {/* Ambient Glow */}
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none" />

            {/* SECTION HEADER */}
            <div className="flex flex-col items-center mb-20 text-center px-4 max-w-5xl mx-auto w-full relative z-10">
                <h2 className="text-4xl md:text-7xl font-black mb-6 tracking-tighter bg-gradient-to-br from-white via-neutral-200 to-neutral-500 bg-clip-text text-transparent uppercase leading-[0.85]">
                    {title}
                </h2>
                <motion.p
                    style={{
                        y: useTransform(scrollYProgress, [0, 0.2], [20, 0])
                    }}
                    className="text-lg text-white/60 leading-relaxed max-w-xl mb-10 mx-auto"
                >
                    {caption}
                </motion.p>
            </div>

            {/* PROJECT GRID */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 w-full max-w-7xl mx-auto px-6 md:px-12 lg:px-16 relative z-10">
                {projects.map((project, idx) => (
                    <ProjectCard
                        key={project.id}
                        project={project}
                        idx={idx}
                        scrollYProgress={scrollYProgress}
                    />
                ))}
            </div>
        </div >
    );
}
