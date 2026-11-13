'use client';
import React from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { PAGE_CONTENT } from "../../data/staticContent";

/* ---------------------------------------------
   DECORATIVE PIECES
---------------------------------------------- */

// Corner-rounded guide lines (viewBox 1200 × 560). Each gets a glowing pulse that travels along it.
const LINES = [
    { d: "M 48 0 V 230 Q 48 262 80 262 H 300", delay: 0 },
    { d: "M 1152 0 V 100 Q 1152 132 1120 132 H 760", delay: 1.2 },
    { d: "M 1152 560 V 330 Q 1152 298 1120 298 H 900", delay: 2.4 },
    { d: "M 48 560 V 420 Q 48 388 80 388 H 340", delay: 3.6 },
];

// Sparkles at the line ends
const SPARKS = [
    { x: 300, y: 262 }, { x: 760, y: 132 }, { x: 900, y: 298 }, { x: 340, y: 388 },
];

// Falling streaks above / below the content
const STREAKS = [
    { x: -48, h: 70, delay: 0 }, { x: -16, h: 120, delay: 0.6 }, { x: 16, h: 50, delay: 1.2 }, { x: 48, h: 95, delay: 0.3 },
];

// Deterministic "random" dots so server and client render the same markup
const DOTS = Array.from({ length: 46 }, (_, i) => {
    const r = (n: number) => { const v = Math.sin(i * 12.9898 + n * 78.233) * 43758.5453; return Math.round((v - Math.floor(v)) * 1000) / 1000; };
    const f = (n: number) => Math.round(n * 100) / 100;
    return { x: f(r(1) * 100), y: f(r(2) * 100), s: f(1 + r(3) * 1.5), d: f(r(4) * 4), t: f(2.5 + r(5) * 3) };
});

function Spark({ x, y, delay }: { x: number; y: number; delay: number }) {
    return (
        <motion.path
            d={`M ${x} ${y - 7} L ${x + 1.6} ${y - 1.6} L ${x + 7} ${y} L ${x + 1.6} ${y + 1.6} L ${x} ${y + 7} L ${x - 1.6} ${y + 1.6} L ${x - 7} ${y} L ${x - 1.6} ${y - 1.6} Z`}
            fill="#a7f3d0"
            animate={{ opacity: [0.35, 1, 0.35], scale: [0.8, 1.2, 0.8] }}
            transition={{ duration: 2.8, repeat: Infinity, delay, ease: "easeInOut" }}
            style={{ transformOrigin: `${x}px ${y}px` }}
        />
    );
}

function Streaks({ from }: { from: "top" | "bottom" }) {
    return (
        <div className={`pointer-events-none absolute left-1/2 ${from === "top" ? "top-0" : "bottom-0"} h-40 w-0`}>
            {STREAKS.map((s, i) => (
                <motion.span
                    key={i}
                    className={`absolute w-px rounded-full ${from === "top" ? "top-0 bg-gradient-to-b" : "bottom-0 bg-gradient-to-t"} from-white/80 to-transparent`}
                    style={{ left: s.x, height: s.h }}
                    animate={{ y: from === "top" ? [-s.h, 40, 40] : [s.h, -40, -40], opacity: [0, 1, 0] }}
                    transition={{ duration: 3.2, repeat: Infinity, delay: s.delay, ease: "easeInOut" }}
                />
            ))}
        </div>
    );
}

/* ---------------------------------------------
   SECTION
---------------------------------------------- */
export default function CTASection() {
    const router = useRouter();
    const section: any = PAGE_CONTENT.home.cta_section;

    // "READY TO BUILD THE" + "NEXT" + "LEVEL?"  →  "Ready to build the next level?"
    const raw = `${section.titlePart1} ${section.titlePart2} ${section.titlePart3}`.toLowerCase();
    const title = raw.charAt(0).toUpperCase() + raw.slice(1);
    // two balanced lines, each with its own edge-fade
    const words = title.split(" ");
    const lines = [words.slice(0, Math.ceil(words.length / 2)).join(" "), words.slice(Math.ceil(words.length / 2)).join(" ")];

    const go = (path: string) => {
        router.push(path);
        window.scrollTo(0, 0);
    };

    return (
        <section className="relative w-full bg-black px-4 py-16 md:px-8 md:py-24">
            <div className="relative mx-auto flex min-h-[560px] max-w-7xl items-center justify-center overflow-hidden rounded-[28px] bg-black ring-1 ring-white/5">
                {/* colour glows */}
                <div className="pointer-events-none absolute -right-24 -top-24 h-[420px] w-[520px] rounded-full bg-emerald-300/35 blur-[110px]" />
                <div className="pointer-events-none absolute -bottom-32 -left-24 h-[360px] w-[460px] rounded-full bg-emerald-600/20 blur-[110px]" />

                {/* particles */}
                <div className="pointer-events-none absolute inset-0">
                    {DOTS.map((d, i) => (
                        <motion.span
                            key={i}
                            className="absolute rounded-full bg-white"
                            style={{ left: `${d.x}%`, top: `${d.y}%`, width: d.s, height: d.s }}
                            animate={{ opacity: [0.05, 0.5, 0.05] }}
                            transition={{ duration: d.t, repeat: Infinity, delay: d.d, ease: "easeInOut" }}
                        />
                    ))}
                </div>

                {/* guide lines + travelling light */}
                <svg className="pointer-events-none absolute inset-0 h-full w-full" viewBox="0 0 1200 560" preserveAspectRatio="xMidYMid slice" fill="none" aria-hidden="true">
                    <defs>
                        <filter id="cta-glow" x="-50%" y="-50%" width="200%" height="200%">
                            <feGaussianBlur stdDeviation="3" result="b" />
                            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
                        </filter>
                    </defs>
                    {LINES.map((l, i) => (
                        <g key={i}>
                            <path d={l.d} stroke="rgba(255,255,255,0.22)" strokeWidth="1.2" />
                            <motion.path
                                d={l.d}
                                pathLength={1}
                                stroke="#34d399"
                                strokeWidth="2.2"
                                strokeLinecap="round"
                                filter="url(#cta-glow)"
                                strokeDasharray="0.1 1"
                                initial={{ strokeDashoffset: 1 }}
                                animate={{ strokeDashoffset: [1, -0.1] }}
                                transition={{ duration: 4.5, repeat: Infinity, delay: l.delay, ease: "linear" }}
                            />
                        </g>
                    ))}
                    {SPARKS.map((s, i) => <Spark key={i} {...s} delay={i * 0.7} />)}
                </svg>

                <Streaks from="top" />
                <Streaks from="bottom" />

                {/* content */}
                <div className="relative z-10 flex max-w-3xl flex-col items-center px-6 py-20 text-center">
                    <motion.span
                        initial={{ opacity: 0, y: 12 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="mb-8 inline-flex items-center rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-medium text-white/80 shadow-[0_0_20px_rgba(255,255,255,0.04)] backdrop-blur"
                    >
                        {section.badge}
                    </motion.span>

                    <motion.h2
                        initial={{ opacity: 0, y: 24 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                        className="mb-6 text-4xl font-semibold leading-[1.1] tracking-tight md:text-6xl"
                    >
                        {lines.map((line) => (
                            <span key={line} className="block bg-gradient-to-r from-white/35 via-white to-white/35 bg-clip-text text-transparent">
                                {line}
                            </span>
                        ))}
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7, delay: 0.2 }}
                        className="mb-10 max-w-xl text-base leading-relaxed text-white/55 md:text-lg"
                    >
                        {section.description}
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7, delay: 0.3 }}
                        className="flex flex-col gap-3 sm:flex-row"
                    >
                        <button
                            onClick={() => go("/services")}
                            className="h-12 rounded-full border border-white/15 bg-white/[0.06] px-7 text-sm font-medium text-white backdrop-blur transition-colors hover:bg-white/10"
                        >
                            {section.secondaryButtonText}
                        </button>
                        <button
                            onClick={() => go("/lets-talk")}
                            className="h-12 rounded-full bg-emerald-500 px-7 text-sm font-semibold text-black shadow-[0_0_30px_rgba(16,185,129,0.35)] transition-all hover:bg-emerald-400 active:scale-95"
                        >
                            {section.primaryButtonText}
                        </button>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
