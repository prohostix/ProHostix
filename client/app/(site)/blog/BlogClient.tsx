'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Filter, Mail } from 'lucide-react';
import api from '@/utils/api';
import SmartImage from '@/components/ui/SmartImage';
import { PAGE_CONTENT } from '@/data/staticContent';
import BlogCard from '@/components/blog/BlogCard';
import toast from 'react-hot-toast';

interface BlogClientProps {
    initialBlogs: any[];
}

export default function BlogClient({ initialBlogs }: BlogClientProps) {
    const [email, setEmail] = useState('');
    const [subscribeStatus, setSubscribeStatus] = useState('idle');
    const [selectedCategory, setSelectedCategory] = useState('All');

    const hero = PAGE_CONTENT.blog.hero;
    const newsletter = PAGE_CONTENT.blog.newsletter;

    const handleSubscribe = async () => {
        if (!email || !/\S+@\S+\.\S+/.test(email)) {
            toast.error('Please enter a valid email address');
            return;
        }

        setSubscribeStatus('loading');
        const toastId = toast.loading('Subscribing...');
        try {
            await api.post('/enquiries/subscribe', { email });
            setSubscribeStatus('success');
            setEmail('');
            toast.success('Subscribed successfully!', { id: toastId });
        } catch (error) {
            console.error(error);
            setSubscribeStatus('error');
            toast.error('Failed to subscribe. Please try again.', { id: toastId });
            setTimeout(() => setSubscribeStatus('idle'), 3000);
        }
    };

    const posts = initialBlogs.map((post: any) => ({
        id: post._id || post.id || post.slug,
        title: post.title,
        excerpt: post.excerpt,
        date: new Date(post.createdAt).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        }),
        readTime: post.readTime || '5 min read',
        category: post.category || 'Technology',
        slug: post.slug || post._id,
        image: post.image
    }));

    const filteredPosts = selectedCategory.toLowerCase() === 'all'
        ? posts
        : posts.filter((post: any) => post.category.toLowerCase() === selectedCategory.toLowerCase());

    const categories = ['All', ...new Set(posts.map((p: any) => p.category))] as string[];

    if (!hero) {
        return null;
    }

    return (
        <div className="min-h-screen bg-black text-white selection:bg-emerald-500/30 selection:text-emerald-400 pb-32">
            {/* Hero Section */}
            <div className="relative w-full max-w-7xl mx-auto px-6 md:px-12 lg:px-16 pt-36 pb-16 text-center overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[100vw] h-[60vh] overflow-hidden pointer-events-none z-0">
                    <SmartImage
                        src="/hero-ai.jpg"
                        alt="Engineering Journal Insights"
                        className="w-full h-full object-cover opacity-20 brightness-75 grayscale-[0.2]"
                        priority={true}
                    />

                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/40 to-black z-10" />
                    <div className="absolute inset-0 bg-emerald-500/5 blur-[120px]" />
                </div>

                <div className="relative z-10">
                    <motion.span
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                        className="mb-2 inline-block px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-[0.2em]"
                    >
                        {hero.tagline}
                    </motion.span>

                    <motion.h1
                        initial={{ opacity: 0, x: -80 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-4xl md:text-7xl font-black tracking-tighter uppercase leading-[0.9] bg-gradient-to-b from-white to-emerald-400 bg-clip-text text-transparent"
                    >
                        {hero.title}
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, x: -40 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="max-w-2xl mx-auto text-lg md:text-xl font-medium bg-gradient-to-br from-white/70 to-white/30 bg-clip-text text-transparent"
                    >
                        {hero.subtitle}
                    </motion.p>
                </div>
            </div>

            <div className="w-full border-y border-white/5 bg-neutral-900/40">
                <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16 py-6 flex flex-wrap items-center justify-center md:justify-start gap-3">
                    <div className="hidden md:flex items-center gap-2 text-white/50 px-4 py-2 border-r border-white/10 mr-2">
                        <Filter size={16} />
                        <span className="text-sm font-bold uppercase">Filter</span>
                    </div>

                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 sm:gap-3">
                        {categories.map((cat: string) => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`px-4 py-2 rounded-full border transition-all text-[10px] md:text-xs font-bold uppercase ${selectedCategory === cat ? 'bg-emerald-500 border-emerald-500 text-black shadow-[0_0_15px_rgba(16,185,129,0.3)]' : 'bg-white/5 border-white/10 text-white/60 hover:text-white hover:bg-emerald-500/20 hover:border-emerald-500/40'}`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16 py-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredPosts.map((post: any, idx: number) => (
                    <BlogCard
                        key={post.id}
                        post={post}
                        idx={idx}
                    />
                ))}
            </div>

            <div className="relative w-full max-w-4xl mx-auto px-6 md:px-12 lg:px-16 py-32 text-center">
                <div className="p-12 rounded-[40px] bg-zinc-800/80 backdrop-blur-2xl border border-white/20">
                    <h2 className="text-3xl font-black uppercase mb-4">
                        {newsletter.title}
                    </h2>
                    <p className="text-white/50 mb-8">
                        {newsletter.description}
                    </p>

                    {subscribeStatus === 'success' ? (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-6 text-center"
                        >
                            <p className="text-emerald-400 font-bold mb-2">🎉 Subscribed Successfully!</p>
                            <p className="text-white/60 text-sm mb-4">Thank you for joining our newsletter.</p>
                            <button
                                onClick={() => setSubscribeStatus('idle')}
                                className="text-xs text-emerald-500 hover:text-emerald-400 underline"
                            >
                                Subscribe another email
                            </button>
                        </motion.div>
                    ) : (
                        <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                            <input
                                type="email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                placeholder="Enter your email"
                                className="flex-grow px-6 py-4 rounded-full bg-black border border-white/20 text-white focus:outline-none focus:border-emerald-500 transition-colors"
                            />
                            <button
                                onClick={handleSubscribe}
                                disabled={subscribeStatus === 'loading' || !email.trim()}
                                className={`px-8 py-4 rounded-full font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-2 transition-all duration-300 ${!email.trim() || subscribeStatus === 'loading' ? 'bg-zinc-700 text-white/30 cursor-not-allowed border border-white/5' : 'bg-emerald-500 hover:bg-emerald-400 text-black shadow-[0_0_20px_rgba(16,185,129,0.2)]'}`}
                            >
                                <span>{subscribeStatus === 'loading' ? 'Joining...' : 'Subscribe'}</span>
                                <Mail size={16} />
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
