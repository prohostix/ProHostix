'use client';

import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';

interface Client {
    _id: string;
    name: string;
    logo: string;
    website?: string;
    order: number;
    active: boolean;
    description?: string;
}

export default function TopClients() {
    const sectionRef = useRef(null);

    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ['start end', 'center start']
    });

    // Fetch clients
    const { data: clients = [], isLoading } = useQuery({
        queryKey: ['clients'],
        queryFn: async () => {
            const res = await fetch('/api/clients');
            if (!res.ok) throw new Error('Failed to fetch clients');
            const data = await res.json();
            return data || [];
        }
    });

    // Don't render if no clients
    if (!isLoading && clients.length === 0) {
        return null;
    }

    return (
        <div
            ref={sectionRef}
            className="relative w-full py-20 bg-black border-t border-white/5 overflow-hidden"
        >
            {/* Ambient Glow */}
            <div className="absolute top-1/2 right-0 w-[400px] h-[400px] bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none" />

            <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-3xl md:text-5xl font-black mb-4 tracking-tighter bg-gradient-to-br from-white via-neutral-200 to-neutral-500 bg-clip-text text-transparent uppercase leading-tight">
                        Trusted By Industry Leaders
                    </h2>
                    <p className="text-lg text-white/60 max-w-2xl mx-auto">
                        Partnering with forward-thinking organizations to deliver exceptional digital solutions
                    </p>
                </motion.div>

                {/* Clients Grid */}
                {isLoading ? (
                    <div className="flex items-center justify-center py-12">
                        <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
                    </div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6"
                    >
                        {clients.map((client: Client, index: number) => (
                            <motion.div
                                key={client._id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.05 }}
                                className="group relative"
                            >
                                <div className="aspect-square bg-white/5 border border-white/10 rounded-2xl p-6 flex items-center justify-center hover:border-emerald-500/30 hover:bg-white/10 transition-all duration-300">
                                    {client.website ? (
                                        <a
                                            href={client.website}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="w-full h-full flex items-center justify-center"
                                        >
                                            <img
                                                src={client.logo}
                                                alt={client.name}
                                                className="max-w-full max-h-full object-contain filter grayscale group-hover:grayscale-0 opacity-60 group-hover:opacity-100 transition-all duration-300"
                                            />
                                        </a>
                                    ) : (
                                        <img
                                            src={client.logo}
                                            alt={client.name}
                                            className="max-w-full max-h-full object-contain filter grayscale group-hover:grayscale-0 opacity-60 group-hover:opacity-100 transition-all duration-300"
                                        />
                                    )}
                                </div>

                                {/* Tooltip on hover */}
                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-emerald-500 text-black text-xs font-bold rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-300 whitespace-nowrap">
                                    {client.name}
                                    <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 w-2 h-2 bg-emerald-500 rotate-45" />
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </div>
        </div>
    );
}
