'use client';
import React from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { HERO_CONTENT } from "../../data/staticContent";
import { useIsMobile } from "../../hooks/useIsMobile";

export default function Hero() {
    const router = useRouter();
    const isMobile = useIsMobile();
    // Use static content
    const heroData = HERO_CONTENT;

    // Loading check removed as data is static

    return (
        <section className="relative w-full min-h-[85vh] pt-32 pb-16 flex items-center bg-black overflow-hidden">
            {/* Background Image with Overlays */}
            <div className="absolute inset-0 z-0">
                <img
                    src={heroData.imageUrl}
                    alt=""
                    className="w-full h-full object-cover opacity-[0.25] grayscale brightness-[0.4]"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                {/* Second layer for deeper bottom fade starting from half */}
                <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black via-black/90 to-transparent" />
                {/* Ambient Glow */}
                <div className={`absolute top-1/4 -right-1/4 w-[600px] h-[600px] bg-emerald-500/10 rounded-full force-gpu ${isMobile ? 'blur-[80px]' : 'blur-[150px]'}`} />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 lg:px-16 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center w-full">
                {/* LEFT — CONTENT */}
                <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
                    {/* Badge */}
                    {heroData.badge && (
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: false }}
                            transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                            className="mb-6 px-4 py-2 rounded-full border border-emerald-400/20 text-emerald-400 text-sm font-semibold force-gpu"
                        >
                            {heroData.badge}
                        </motion.div>
                    )}

                    {/* Headline */}
                    <div className="flex flex-col mb-8">
                        {["SOFTWARE SOLUTIONS", "FOR GROWING BUSINESS"].map((line, idx) => (
                            <div key={idx} className="relative">
                                <motion.h1
                                    initial={{ opacity: 0, x: -100 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: false, amount: 0.5 }}
                                    transition={{
                                        duration: 0.8,
                                        delay: idx * 0.1,
                                        ease: [0.22, 1, 0.36, 1]
                                    }}
                                    className="text-4xl md:text-7xl font-black tracking-tighter uppercase leading-[0.8] bg-gradient-to-br from-white via-white/90 to-emerald-500 bg-clip-text text-transparent"
                                >
                                    {line}
                                </motion.h1>
                            </div>
                        ))}
                    </div>

                    {/* Subheading */}
                    <motion.p
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: false, amount: 0.5 }}
                        transition={{ duration: 0.8, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
                        className="text-lg text-white/70 max-w-xl leading-relaxed mb-8 mx-auto lg:mx-0"
                    >
                        {heroData.subtitle}
                    </motion.p>

                    {/* Services */}
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: false }}
                        transition={{ duration: 0.6, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
                        className="text-sm text-white/50 mb-10"
                    >
                        {heroData.services}
                    </motion.p>

                    {/* CTA */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: false }}
                        transition={{ duration: 0.6, delay: 0.8, ease: [0.22, 1, 0.36, 1] }}
                        className="flex flex-col sm:flex-row items-center gap-4"
                    >
                        {heroData.primaryCtaText && (
                            <button
                                onClick={() => router.push(heroData.primaryCtaLink)}
                                className="h-12 w-full sm:w-auto px-8 rounded-xl font-semibold bg-emerald-500 text-black hover:bg-emerald-400 hover:scale-105 active:scale-95 transition-all font-outfit"
                            >
                                {heroData.primaryCtaText}
                            </button>
                        )}

                        {heroData.secondaryCtaText && (
                            <button
                                onClick={() => router.push(heroData.secondaryCtaLink)}
                                className="h-12 w-full sm:w-auto px-8 rounded-xl font-medium border border-white/15 text-white/70 hover:text-white hover:border-white/30 hover:bg-white/10 hover:scale-105 active:scale-95 transition-all font-outfit"
                            >
                                {heroData.secondaryCtaText}
                            </button>
                        )}
                    </motion.div>
                </div>

                {/* RIGHT — REALISTIC AI BRAIN ONLY */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                    className="hidden lg:flex justify-center items-center relative force-gpu"
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
        </section>
    );
}
