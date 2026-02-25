'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Clock, ArrowRight } from 'lucide-react';
import SmartImage from '@/components/ui/SmartImage';
import { useCardMotion } from '@/hooks/useCardMotion';
import { getAbsoluteImageUrl } from '@/utils/imageUrl';

interface BlogPost {
    id: string;
    title: string;
    excerpt: string;
    date: string;
    readTime: string;
    category: string;
    slug: string;
    image: string;
}

interface BlogCardProps {
    post: BlogPost;
    idx: number;
}

const BlogCard: React.FC<BlogCardProps> = ({ post, idx }) => {
    const router = useRouter();
    const motionProps = useCardMotion(idx);

    return (
        <motion.div
            {...motionProps as any}
            onClick={() => router.push(`/blog/${post.slug}`)}
            className="
        group relative rounded-[32px]
        border border-white/20
        bg-zinc-800/80 safari-blur-fix force-gpu
        hover:bg-zinc-800/90 hover:border-emerald-500/30
        transition-colors duration-300
        flex flex-col h-full overflow-hidden cursor-pointer
        shadow-2xl
      "
        >
            <div className="relative h-48 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10" />

                <SmartImage
                    src={getAbsoluteImageUrl(post.image)}
                    alt={post.title}
                    className="
            w-full h-full object-cover
            transform group-hover:scale-105
            transition-transform duration-700
          "
                />

                <div className="absolute top-4 left-4 z-20">
                    <span className="
            px-3 py-1 rounded-full
            bg-black/60 backdrop-blur-md
            text-emerald-400 text-[10px]
            font-bold uppercase tracking-wider
            border border-white/10
          ">
                        {post.category}
                    </span>
                </div>
            </div>

            <div className="p-8 flex flex-col flex-grow items-center text-center md:items-start md:text-left">
                <div className="mb-4 flex flex-col items-center gap-2 sm:flex-row sm:justify-between w-full">
                    <span className="text-white text-xs font-mono font-medium">
                        {post.date}
                    </span>

                    <div className="flex items-center gap-2 text-white text-[10px] font-bold uppercase tracking-[0.2em]">
                        <Clock size={12} className="text-emerald-400" />
                        {post.readTime}
                    </div>
                </div>

                <h3 className="
          text-2xl font-bold text-white mb-3 tracking-tight
          group-hover:text-emerald-400 transition-colors
          line-clamp-2 overflow-hidden w-full
        ">
                    {post.title}
                </h3>

                <p className="text-white text-sm leading-relaxed mb-6 line-clamp-3 font-medium overflow-hidden w-full">
                    {post.excerpt}
                </p>

                <button className="
          mt-auto flex items-center gap-2
          text-emerald-400 text-xs font-bold
          uppercase tracking-widest group/btn
        ">
                    Read Insight
                    <ArrowRight
                        size={14}
                        className="group-hover/btn:translate-x-1 transition-transform"
                    />
                </button>
            </div>
        </motion.div>
    );
};

export default BlogCard;
