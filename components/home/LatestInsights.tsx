'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, BookOpen } from 'lucide-react';
import Link from 'next/link';
import BlogCard from '@/components/blog/BlogCard';

interface LatestInsightsProps {
    blogs: any[];
}

export default function LatestInsights({ blogs }: LatestInsightsProps) {
    if (!blogs || blogs.length === 0) return null;

    return (
        <section className="relative w-full py-32 bg-black border-t border-white/5 overflow-hidden">
            {/* Ambient Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-emerald-500/5 blur-[150px] rounded-full pointer-events-none" />

            <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16 relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
                    <div className="max-w-2xl">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="flex items-center gap-2 mb-4"
                        >
                            <div className="w-12 h-px bg-emerald-500" />
                            <span className="text-emerald-400 text-xs font-bold uppercase tracking-[0.3em]">Insights & Architecture</span>
                        </motion.div>
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter leading-[0.9]"
                        >
                            From the <span className="text-emerald-400">Engineering</span> Journal
                        </motion.h2>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                    >
                        <Link
                            href="/blog"
                            className="flex items-center gap-2 px-6 py-3 rounded-full bg-white/5 border border-white/10 text-white font-bold uppercase tracking-widest text-xs hover:bg-emerald-500 hover:text-black transition-all duration-300"
                        >
                            View All Journal Entries
                            <ArrowRight size={16} />
                        </Link>
                    </motion.div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {blogs.map((blog, idx) => (
                        <div key={blog._id} className="flex flex-col">
                            <BlogCard
                                post={{
                                    ...blog,
                                    id: blog._id,
                                    date: new Date(blog.createdAt).toLocaleDateString('en-US', {
                                        month: 'short',
                                        day: 'numeric',
                                        year: 'numeric'
                                    }),
                                    readTime: blog.readTime || '5 min read'
                                }}
                                idx={idx}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
