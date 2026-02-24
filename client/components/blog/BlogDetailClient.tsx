'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Clock, Calendar } from 'lucide-react';
import SmartImage from '@/components/ui/SmartImage';

interface BlogPost {
    title: string;
    excerpt: string;
    content?: string;
    image: string;
    date?: string;
    createdAt?: string; // API usually returns createdAt
    readTime?: string;
    category?: string;
    author?: string;
    slug?: string;
    seo?: {
        title?: string;
        description?: string;
        keywords?: string[];
    };
}

interface BlogDetailClientProps {
    post: BlogPost | null;
}

const BlogDetailClient: React.FC<BlogDetailClientProps> = ({ post }) => {
    const router = useRouter();

    if (!post) {
        return (
            <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white p-4">
                <h2 className="text-4xl font-black mb-4">POST NOT FOUND</h2>
                <button
                    onClick={() => router.push('/blog')}
                    className="flex items-center gap-2 text-white/40 hover:text-emerald-400 text-[10px] font-black uppercase tracking-[0.3em] transition-all group"
                >
                    <ArrowLeft size={20} /> BACK TO INSIGHTS
                </button>
            </div>
        );
    }

    const displayDate = post.date || (post.createdAt ? new Date(post.createdAt).toLocaleDateString() : '');

    return (
        <div className="min-h-screen bg-black text-white selection:bg-emerald-500/30 selection:text-emerald-400 pb-32">
            {/* --- CINEMATIC HERO --- */}
            <div className="relative w-full min-h-[60vh] flex flex-col justify-start overflow-hidden pt-32 md:pt-40 pb-12">
                {/* Visual Foundation */}
                <div className="absolute inset-0 z-0">
                    <SmartImage
                        src={post.image}
                        alt={post.title}
                        priority={true}
                        className="w-full h-full object-cover grayscale-[0.3] brightness-[0.4]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                    <div className="absolute inset-0 bg-emerald-500/5 mix-blend-overlay" />
                </div>

                {/* Floating Particles/Ambient Glow */}
                <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-emerald-500/10 blur-[150px] rounded-full pointer-events-none" />

                <div className="max-w-5xl mx-auto px-6 md:px-12 lg:px-16 w-full relative z-10">
                    <motion.button
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        onClick={() => router.push('/blog')}
                        className="flex items-center gap-2 text-white/40 hover:text-emerald-400 text-[10px] font-black uppercase tracking-[0.3em] mb-12 transition-all w-fit group"
                    >
                        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                        BACK TO INSIGHTS
                    </motion.button>

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                        className="max-w-4xl"
                    >
                        <div className="flex flex-wrap items-center gap-4 mb-10">
                            <span className="px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-[0.2em] backdrop-blur-md">
                                {post.category || 'Architecture'}
                            </span>
                            <div className="h-px w-8 bg-white/20" />
                            <div className="flex items-center gap-4 text-white/40 text-[10px] font-black uppercase tracking-[0.2em]">
                                <div className="flex items-center gap-2">
                                    <Calendar size={12} className="text-emerald-500/50" />
                                    {displayDate}
                                </div>
                                <div className="flex items-center gap-2">
                                    <Clock size={12} className="text-emerald-500/50" />
                                    {post.readTime || '5 MIN READ'}
                                </div>
                            </div>
                        </div>

                        <h1 className="text-4xl md:text-7xl font-black tracking-tighter uppercase leading-[0.9] bg-gradient-to-b from-white via-white to-emerald-400 bg-clip-text text-transparent mb-12 break-words [text-wrap:balance]">
                            {post.title}
                        </h1>

                        <div className="flex items-center gap-6">
                            <div className="relative">
                                <div className="w-14 h-14 rounded-2xl bg-[#0D1117] border border-white/10 flex items-center justify-center font-black text-emerald-400 text-xl overflow-hidden group">
                                    {post.author?.charAt(0) || 'P'}
                                    <div className="absolute inset-0 bg-emerald-400/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>
                                <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-black" />
                            </div>
                            <div>
                                <div className="text-xs font-black uppercase tracking-[0.2em] text-white/90">
                                    {post.author || 'ProHostix Research'}
                                </div>
                                <div className="text-[10px] text-emerald-500/60 uppercase font-black tracking-[0.2em] mt-1 italic">
                                    // Senior Architect
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* --- CONTENT ARCHITECTURE --- */}
            <section className="max-w-5xl mx-auto px-6 md:px-12 lg:px-16 pt-12 grid grid-cols-1 lg:grid-cols-12 gap-16">
                {/* Main Content */}
                <motion.article
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="lg:col-span-8"
                >
                    <div className="text-2xl md:text-3xl text-white/90 font-black leading-[1.1] mb-16 tracking-tighter uppercase border-l-4 border-emerald-500 pl-8">
                        {post.excerpt}
                    </div>

                    <div className="text-white/60 leading-[1.9] text-xl font-medium whitespace-pre-wrap break-words prose prose-invert prose-emerald max-w-none">
                        {post.content || "Technical synchronization in progress..."}
                    </div>

                    {/* Article Footer */}
                    <div className="mt-24 pt-12 border-t border-white/5 flex justify-center">
                        <button
                            onClick={() => router.push('/blog')}
                            className="bg-white/5 border border-white/10 hover:border-emerald-500/50 px-10 py-4 rounded-full text-white font-black uppercase text-[10px] tracking-[0.3em] transition-all hover:bg-emerald-500/5"
                        >
                            Return to Repository
                        </button>
                    </div>
                </motion.article>

                {/* Sidebar Accents (Empty for now but creates balance) */}
                <aside className="hidden lg:block lg:col-span-4 space-y-12">
                    <div className="p-8 rounded-3xl bg-white/[0.02] border border-white/5 sticky top-32">
                        <div className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.4em] mb-6">// Journal_Entry.log</div>
                        <div className="space-y-6">
                            <div>
                                <div className="text-[9px] font-black text-white/40 uppercase mb-2 tracking-widest text-emerald-500/50">Status</div>
                                <div className="text-xs font-bold text-white uppercase tracking-widest">Verified Arch</div>
                            </div>
                            <div>
                                <div className="text-[9px] font-black text-white/40 uppercase mb-2 tracking-widest">Encryption</div>
                                <div className="text-xs font-bold text-white uppercase tracking-widest">AES-256</div>
                            </div>
                            <div>
                                <div className="text-[9px] font-black text-white/40 uppercase mb-2 tracking-widest">Access Level</div>
                                <div className="text-xs font-bold text-white uppercase tracking-widest">Public_Journal</div>
                            </div>
                        </div>
                    </div>
                </aside>
            </section>
        </div>
    );
};

export default BlogDetailClient;
