'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

/** Client logos live in /public/clients (white PNGs on transparent background). */
const LOGO_FILES = [
    'adidas', 'adul', 'ai', 'al', 'albhr', 'amirtha', 'aster', 'bbk', 'coffe', 'dtale', 'etihad',
    'fedaral', 'garmin', 'geo', 'ikea', 'joyalu', 'land mark', 'live pool', 'lulu', 'marri', 'metro',
    'myg', 'nestle', 'oxygen', 'sedar', 'star', 'synth', 'toys', 'tri', 'university', 'v guard', 'woodl',
].map((name) => ({
    name,
    src: `/clients/${encodeURIComponent(name === 'woodl' ? 'woodllogo' : `${name} logo`)}.png`,
}));

const VISIBLE = 15; // tiles on screen (5 × 3)
const FLIP_EVERY_MS = 650;
const FLIPS_PER_TICK = 3; // tiles that flip at the same time

interface Tile {
    faces: [number, number]; // logo index on each face
    turns: number; // total half-turns so far; odd = back face showing
}

const rand = (n: number) => Math.floor(Math.random() * n);

function LogoFace({ index, className = '' }: { index: number; className?: string }) {
    const logo = LOGO_FILES[index];
    return (
        <div className={`absolute inset-0 flex items-center justify-center overflow-hidden rounded-2xl ${className}`} style={{ backfaceVisibility: 'hidden' }}>
            <div className="relative h-full w-full">
                <Image
                    src={logo.src}
                    alt={`${logo.name} logo`}
                    fill
                    sizes="(min-width: 1024px) 20vw, 33vw"
                    className="scale-[1.15] object-contain opacity-90"
                />
            </div>
        </div>
    );
}

export default function TopClients() {
    const [tiles, setTiles] = useState<Tile[]>(() =>
        Array.from({ length: VISIBLE }, (_, i) => ({ faces: [i, i], turns: 0 }))
    );
    const [paused, setPaused] = useState(false);
    const [started, setStarted] = useState(false);
    const lastFlipped = useRef<number[]>([]);
    const sectionRef = useRef<HTMLElement>(null);

    // Start flipping only once the section is on screen
    useEffect(() => {
        const el = sectionRef.current;
        if (!el) return;
        const io = new IntersectionObserver(([e]) => setStarted(e.isIntersecting), { threshold: 0.25 });
        io.observe(el);
        return () => io.disconnect();
    }, []);

    useEffect(() => {
        if (!started || paused) return;
        const id = setInterval(() => {
            setTiles((prev) => {
                const shown = new Set(prev.map((t) => t.faces[t.turns % 2]));
                const hidden = LOGO_FILES.map((_, i) => i).filter((i) => !shown.has(i));
                const count = Math.min(FLIPS_PER_TICK, hidden.length);
                if (!count) return prev;
                // pick distinct tiles (not flipped last tick) and distinct incoming logos
                const slots: number[] = [];
                while (slots.length < count) {
                    const slot = rand(prev.length);
                    if (!slots.includes(slot) && !lastFlipped.current.includes(slot)) slots.push(slot);
                }
                lastFlipped.current = slots;
                const incoming = new Map<number, number>();
                slots.forEach((slot) => {
                    const pick = hidden.splice(rand(hidden.length), 1)[0];
                    incoming.set(slot, pick);
                });
                return prev.map((t, i) => {
                    if (!incoming.has(i)) return t;
                    const nextSide = (t.turns + 1) % 2;
                    const faces: [number, number] = [...t.faces] as [number, number];
                    faces[nextSide] = incoming.get(i)!;
                    return { faces, turns: t.turns + 1 };
                });
            });
        }, FLIP_EVERY_MS);
        return () => clearInterval(id);
    }, [started, paused]);

    return (
        <section ref={sectionRef} className="relative w-full overflow-hidden border-t border-white/5 bg-black px-6 py-24 md:px-12 lg:px-16">
            {/* Colour field behind the glass */}
            <div className="pointer-events-none absolute inset-0">
                <div className="absolute left-1/2 top-0 h-[560px] w-[900px] -translate-x-1/2 rounded-full bg-emerald-500/25 blur-[140px]" />
                <div className="absolute -left-24 bottom-0 h-[420px] w-[420px] rounded-full bg-teal-500/20 blur-[130px]" />
                <div className="absolute -right-24 bottom-10 h-[420px] w-[420px] rounded-full bg-emerald-300/15 blur-[130px]" />
            </div>

            <div className="relative z-10 mx-auto max-w-7xl">
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7 }}
                    className="mb-14 text-center"
                >
                    <h2 className="mb-4 text-3xl font-bold tracking-tight text-white md:text-5xl">Trusted by industry leaders</h2>
                    <p className="mx-auto max-w-2xl text-lg text-white/55">
                        Partnering with forward-thinking organizations to deliver exceptional digital solutions
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-5%' }}
                    transition={{ duration: 0.8, delay: 0.1 }}
                    onMouseEnter={() => setPaused(true)}
                    onMouseLeave={() => setPaused(false)}
                    className="grid grid-cols-3 gap-3 md:gap-4 lg:grid-cols-5"
                    style={{ perspective: 1200 }}
                >
                    {tiles.map((tile, i) => (
                        <motion.div
                            key={i}
                            className="relative aspect-[3/2]"
                            animate={{ rotateX: tile.turns * 180 }}
                            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                            style={{ transformStyle: 'preserve-3d' }}
                        >
                            {/* front */}
                            <LogoFace
                                index={tile.faces[0]}
                                className="bg-white/[0.07] shadow-[0_8px_30px_rgba(0,0,0,0.25)] backdrop-blur-xl"
                            />
                            {/* back (pre-rotated so it reads correctly when flipped) */}
                            <div className="absolute inset-0" style={{ transform: 'rotateX(180deg)', transformStyle: 'preserve-3d' }}>
                                <LogoFace
                                    index={tile.faces[1]}
                                    className="bg-white/[0.07] shadow-[0_8px_30px_rgba(0,0,0,0.25)] backdrop-blur-xl"
                                />
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
