'use client';
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Open_Sans, DM_Sans } from "next/font/google";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { HERO_CONTENT } from "../../data/staticContent";
import { useIsMobile } from "../../hooks/useIsMobile";
import { useScrollDisintegration } from "../../animations/text-disintegration/useScrollDisintegration";

const openSans = Open_Sans({ subsets: ["latin"], weight: ["300", "700"], display: "swap" });
const ROTATING_LINES = ["Designed To Deliver", "Tailored To Your Goals", "Delivered With Care", "Clear, Reliable, Ready"];
// Second headline line and the paragraph start once the first line has finished revealing
const SECOND_LINE_DELAY = 1.5;
const dmSans = DM_Sans({ subsets: ["latin"], display: "swap" });

// Letter-by-letter reveal: each letter slides up from below an invisible baseline (clipped by overflow-hidden)
const containerVariants = {
    hidden: {},
    show: (delay: number) => ({ transition: { staggerChildren: 0.035, delayChildren: delay } }),
    exit: { transition: { staggerChildren: 0.015 } },
};
const letterVariants = {
    hidden: { y: "110%" },
    show: { y: "0%", transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const } },
    exit: { y: "-110%", transition: { duration: 0.35, ease: [0.64, 0, 0.78, 0] as const } },
};

function SlideLetters({ text, delay = 0, inView = false }: { text: string; delay?: number; inView?: boolean }) {
    const trigger = inView
        ? { whileInView: "show", viewport: { once: true, amount: 0.5 } }
        : { animate: "show" };
    return (
        <motion.span
            aria-label={text}
            custom={delay}
            variants={containerVariants}
            initial="hidden"
            exit="exit"
            {...trigger}
            className="block"
        >
            {text.split(" ").map((word, w, words) => (
                <React.Fragment key={w}>
                    <span aria-hidden className="inline-block whitespace-nowrap overflow-hidden align-bottom pb-[0.18em] -mb-[0.18em]">
                        {word.split("").map((ch, i) => (
                            <motion.span key={i} variants={letterVariants} className="inline-block">
                                {ch}
                            </motion.span>
                        ))}
                    </span>
                    {w < words.length - 1 && " "}
                </React.Fragment>
            ))}
        </motion.span>
    );
}

export default function Hero() {
    const router = useRouter();
    const isMobile = useIsMobile();
    // Second headline line: swaps to a random different phrase every few seconds
    const [lineIdx, setLineIdx] = useState(0);
    const [rotated, setRotated] = useState(false);
    const sectionRef = useRef<HTMLElement>(null);
    const mountedAt = useRef(Date.now());
    const lastSwapAt = useRef(0);
    const rotationPaused = useRef(false);
    useEffect(() => {
        const id = setInterval(() => {
            if (rotationPaused.current) return;
            lastSwapAt.current = Date.now();
            setRotated(true);
            setLineIdx((prev) => {
                let next = Math.floor(Math.random() * ROTATING_LINES.length);
                if (next === prev) next = (next + 1) % ROTATING_LINES.length;
                return next;
            });
        }, 5000);
        return () => clearInterval(id);
    }, []);

    // Scroll once on desktop: hero text disintegrates and the page glides to the next section
    useScrollDisintegration(sectionRef, {
        beforeDisintegrate: async () => {
            rotationPaused.current = true;
            // let the entry / phrase-swap animations finish so letters are measured at rest
            const wait = Math.max(mountedAt.current + 3400, lastSwapAt.current + 1900) - Date.now();
            if (wait > 0) await new Promise((r) => setTimeout(r, wait));
        },
        onRestored: () => {
            rotationPaused.current = false;
        },
    });

    // Use static content
    const heroData = HERO_CONTENT;

    // Loading check removed as data is static

    return (
        <section ref={sectionRef} className="relative w-full min-h-dvh pt-32 pb-16 flex items-center bg-black overflow-hidden">
            {/* Background Image with Overlays */}
            <div className="absolute inset-0 z-0">
                <Image
                    src={heroData.imageUrl}
                    alt="ProHostix Custom Software Development"
                    fill
                    priority
                    sizes="100vw"
                    style={{ objectFit: 'cover' }}
                    className="opacity-[0.25] grayscale brightness-[0.4]"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                {/* Second layer for deeper bottom fade starting from half */}
                <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black via-black/90 to-transparent" />
                {/* Ambient Glow */}
                <div className={`absolute top-1/4 -right-1/4 w-[600px] h-[600px] bg-emerald-500/10 rounded-full force-gpu ${isMobile ? 'blur-[80px]' : 'blur-[150px]'}`} />
            </div>

            <div className="relative z-10 w-full px-6 md:px-12 lg:px-16">
                {/* LEFT — CONTENT */}
                <div className="relative z-10 flex flex-col items-start text-left w-full">
                    {/* Headline */}
                    <h1 data-disintegrate className={`${openSans.className} flex flex-col w-full mb-10 -ml-2 tracking-tighter leading-[1.05] text-white text-transparent`}>
                        {[
                            { text: "Practical IT Solutions", cls: "self-start font-[600]! text-5xl sm:text-7xl lg:text-[68px] xl:text-[107px] 2xl:text-[111px]" },
                        ].map((line, idx) => (
                            <div key={idx} className={`block ${line.cls}`}>
                                <SlideLetters text={line.text} delay={idx * 0.1} inView />
                            </div>
                        ))}
                    </h1>

                    {/* CTA stack + subtitle */}
                    <div className="flex flex-col md:flex-row md:items-center gap-6 md:gap-10">
                    {/* CTA — hidden on PC (lg+) for now; remove `lg:hidden` to restore */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: false }}
                        transition={{ duration: 0.6, delay: 0.8, ease: [0.22, 1, 0.36, 1] }}
                        className="lg:hidden flex flex-col items-stretch gap-4 w-full sm:w-auto shrink-0"
                    >
                        {heroData.primaryCtaText && (
                            <button
                                onClick={() => router.push(heroData.primaryCtaLink)}
                                className="h-11 w-full px-6 rounded-md text-sm font-medium bg-emerald-500 text-black hover:bg-emerald-400 transition-colors font-outfit"
                            >
                                {heroData.primaryCtaText}
                            </button>
                        )}

                        {heroData.secondaryCtaText && (
                            <button
                                onClick={() => router.push(heroData.secondaryCtaLink)}
                                className="h-11 w-full px-6 rounded-md text-sm font-medium border border-white/15 text-white/70 hover:text-white hover:border-white/30 hover:bg-white/10 transition-colors font-outfit"
                            >
                                {heroData.secondaryCtaText}
                            </button>
                        )}
                    </motion.div>
                    {/* Subtitle */}
                    <motion.p
                        data-disintegrate
                        initial={{ opacity: 0, x: 80 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.9, delay: SECOND_LINE_DELAY, ease: [0.22, 1, 0.36, 1] }}
                        className={`${dmSans.className} text-base text-white max-w-xl leading-relaxed`}
                    >
                        {heroData.subtitle}
                    </motion.p>
                    </div>
                </div>

                {/* RIGHT — REALISTIC AI BRAIN ONLY */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                    className="hidden lg:flex absolute z-0 -right-12 top-[-6.5rem] bottom-[6.5rem] w-1/2 justify-center items-center pointer-events-none force-gpu"
                >
                    {/* Animated Vector Illustration */}
                    <svg
                        width="600"
                        height="600"
                        viewBox="0 0 600 600"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-full max-w-[600px] h-auto force-gpu"
                        style={{ willChange: "transform, opacity" }}
                    >
                        <defs>
                            {/* Gradients */}
                            <linearGradient id="emeraldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#10b981" />
                                <stop offset="100%" stopColor="#059669" />
                            </linearGradient>
                            <radialGradient id="glowGradient" cx="50%" cy="50%" r="50%">
                                <stop offset="0%" stopColor="#10b981" stopOpacity="0.6" />
                                <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                            </radialGradient>
                        </defs>

                        {/* Background Glow */}
                        <motion.circle
                            cx="300"
                            cy="300"
                            r="250"
                            fill="url(#glowGradient)"
                            initial={{ scale: 1, opacity: 0.3 }}
                            animate={{
                                scale: [1, 1.2, 1],
                                opacity: [0.3, 0.6, 0.3]
                            }}
                            transition={{
                                duration: 5,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                        />

                        {/* Central Hexagon Network */}
                        <motion.g
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 1 }}
                        >
                            {/* Main Hexagon */}
                            <motion.path
                                d="M 300 150 L 390 200 L 390 300 L 300 350 L 210 300 L 210 200 Z"
                                stroke="url(#emeraldGradient)"
                                strokeWidth="3"
                                fill="rgba(16, 185, 129, 0.05)"
                                initial={{ pathLength: 0 }}
                                animate={{ pathLength: 1 }}
                                transition={{ duration: 2, ease: "easeInOut" }}
                            />

                            {/* Inner Hexagon */}
                            <motion.path
                                d="M 300 200 L 350 225 L 350 275 L 300 300 L 250 275 L 250 225 Z"
                                stroke="#10b981"
                                strokeWidth="2"
                                fill="rgba(16, 185, 129, 0.1)"
                                initial={{ rotate: 0, opacity: 1 }}
                                animate={{
                                    rotate: 360
                                }}
                                transition={{
                                    duration: 20,
                                    repeat: Infinity,
                                    ease: "linear"
                                }}
                                style={{ transformOrigin: "300px 250px" }}
                            />

                            {/* Center Dot */}
                            <motion.circle
                                cx="300"
                                cy="250"
                                r="8"
                                fill="#10b981"
                                initial={{ scale: 1, opacity: 1 }}
                                animate={{
                                    scale: [1, 1.5, 1],
                                    opacity: [1, 0.5, 1]
                                }}
                                transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                }}
                            />
                        </motion.g>

                        {/* Orbiting Nodes */}
                        {[...Array(6)].map((_, i) => {
                            const angle = (i * 360) / 6;
                            const radius = 180;
                            const x = 300 + Math.cos((angle * Math.PI) / 180) * radius;
                            const y = 250 + Math.sin((angle * Math.PI) / 180) * radius;

                            return (
                                <motion.g key={`node-${i}`}>
                                    {/* Connection Line */}
                                    <motion.line
                                        x1="300"
                                        y1="250"
                                        x2={Number(x.toFixed(2)) || 0}
                                        y2={Number(y.toFixed(2)) || 0}
                                        stroke="#10b981"
                                        strokeWidth="1"
                                        strokeDasharray="5,5"
                                        initial={{ pathLength: 0, opacity: 0 }}
                                        animate={{
                                            pathLength: 1,
                                            opacity: [0.2, 0.6, 0.2]
                                        }}
                                        transition={{
                                            pathLength: { duration: 1.5, delay: i * 0.2 },
                                            opacity: { duration: 3, repeat: Infinity, delay: i * 0.3 }
                                        }}
                                    />

                                    {/* Node Circle */}
                                    <motion.circle
                                        cx={Number(x.toFixed(2)) || 0}
                                        cy={Number(y.toFixed(2)) || 0}
                                        r="12"
                                        fill="rgba(16, 185, 129, 0.2)"
                                        stroke="#10b981"
                                        strokeWidth="2"
                                        initial={{ scale: 1, opacity: 0.6 }}
                                        animate={{
                                            scale: [1, 1.3, 1],
                                            opacity: [0.6, 1, 0.6]
                                        }}
                                        transition={{
                                            duration: 2,
                                            repeat: Infinity,
                                            delay: i * 0.3,
                                            ease: "easeInOut"
                                        }}
                                    />

                                    {/* Inner Node Dot */}
                                    <circle cx={Number(x.toFixed(2)) || 0} cy={Number(y.toFixed(2)) || 0} r="4" fill="#10b981" />
                                </motion.g>
                            );
                        })}

                        {/* Data Flow Particles */}
                        {[...Array(12)].map((_, i) => {
                            const startAngle = (i * 360) / 12;
                            const startX = 300 + Math.cos((startAngle * Math.PI) / 180) * 80;
                            const startY = 250 + Math.sin((startAngle * Math.PI) / 180) * 80;
                            const endX = 300 + Math.cos((startAngle * Math.PI) / 180) * 220;
                            const endY = 250 + Math.sin((startAngle * Math.PI) / 180) * 220;

                            return (
                                <motion.circle
                                    key={`particle-${i}`}
                                    r="3"
                                    fill="#10b981"
                                    initial={{
                                        cx: Number(startX.toFixed(2)) || 0,
                                        cy: Number(startY.toFixed(2)) || 0,
                                        opacity: 0
                                    }}
                                    animate={{
                                        cx: [Number(startX.toFixed(2)) || 0, Number(endX.toFixed(2)) || 0, Number(startX.toFixed(2)) || 0],
                                        cy: [Number(startY.toFixed(2)) || 0, Number(endY.toFixed(2)) || 0, Number(startY.toFixed(2)) || 0],
                                        opacity: [0, 1, 0]
                                    }}
                                    transition={{
                                        duration: 4,
                                        repeat: Infinity,
                                        delay: i * 0.3,
                                        ease: "linear"
                                    }}
                                />
                            );
                        })}

                        {/* Rotating Rings */}
                        <motion.circle
                            cx="300"
                            cy="250"
                            r="200"
                            stroke="#10b981"
                            strokeWidth="1"
                            strokeOpacity="0.3"
                            fill="none"
                            strokeDasharray="10,10"
                            initial={{ rotate: 0 }}
                            animate={{ rotate: 360 }}
                            transition={{
                                duration: 30,
                                repeat: Infinity,
                                ease: "linear"
                            }}
                            style={{ transformOrigin: "300px 250px" }}
                        />

                        <motion.circle
                            cx="300"
                            cy="250"
                            r="240"
                            stroke="#10b981"
                            strokeWidth="1"
                            strokeOpacity="0.2"
                            fill="none"
                            strokeDasharray="15,15"
                            initial={{ rotate: 0 }}
                            animate={{ rotate: -360 }}
                            transition={{
                                duration: 40,
                                repeat: Infinity,
                                ease: "linear"
                            }}
                            style={{ transformOrigin: "300px 250px" }}
                        />

                        {/* Corner Tech Elements */}
                        {[
                            { x: 100, y: 100, delay: 0 },
                            { x: 500, y: 100, delay: 0.5 },
                            { x: 100, y: 400, delay: 1 },
                            { x: 500, y: 400, delay: 1.5 }
                        ].map((corner, i) => (
                            <motion.g
                                key={`corner-${i}`}
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.8, delay: corner.delay }}
                            >
                                {/* Corner Bracket */}
                                <path
                                    d={`M ${corner.x - 15} ${corner.y} L ${corner.x} ${corner.y} L ${corner.x} ${corner.y + 15}`}
                                    stroke="#10b981"
                                    strokeWidth="2"
                                    fill="none"
                                    opacity="0.6"
                                />
                                <motion.circle
                                    cx={corner.x || 0}
                                    cy={corner.y || 0}
                                    r="3"
                                    fill="#10b981"
                                    initial={{ scale: 1, opacity: 0.6 }}
                                    animate={{
                                        scale: [1, 1.5, 1],
                                        opacity: [0.6, 1, 0.6]
                                    }}
                                    transition={{
                                        duration: 2,
                                        repeat: Infinity,
                                        delay: corner.delay
                                    }}
                                />
                            </motion.g>
                        ))}

                        {/* Binary Code Stream */}
                        {[...Array(6)].map((_, i) => (
                            <motion.text
                                key={`binary-${i}`}
                                x={150 + i * 60}
                                fill="#10b981"
                                fontSize="12"
                                fontFamily="monospace"
                                initial={{ y: 50, opacity: 0 }}
                                animate={{
                                    y: [50, 550],
                                    opacity: [0, 0.4, 0]
                                }}
                                transition={{
                                    duration: 6,
                                    repeat: Infinity,
                                    delay: i * 0.5,
                                    ease: "linear"
                                }}
                            >
                                {i % 2 === 0 ? '1010' : '0101'}
                            </motion.text>
                        ))}
                    </svg>
                </motion.div>
            </div>
            {/* Headline — second line, anchored from the bottom of the hero (change bottom-* to move) */}
            <div data-disintegrate className={`${openSans.className} absolute z-10 right-6 md:right-12 lg:right-16 bottom-24 lg:bottom-34 tracking-tighter leading-[1.05] text-white`}>
                <AnimatePresence mode="wait">
                    <div key={lineIdx} className="text-right font-light text-4xl sm:text-6xl lg:text-[68px] xl:text-[107px] 2xl:text-[111px]">
                        <SlideLetters text={ROTATING_LINES[lineIdx]} delay={rotated ? 0 : SECOND_LINE_DELAY} />
                    </div>
                </AnimatePresence>
            </div>
            {/* Services — bottom left of hero */}
            <motion.p
                data-disintegrate
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false }}
                transition={{ duration: 0.6, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className="absolute z-10 bottom-6 left-6 md:left-12 lg:bottom-8 lg:left-16 max-w-[calc(100%-3rem)] text-left text-sm text-white/50"
            >
                {heroData.services}
            </motion.p>
        </section>
    );
}
