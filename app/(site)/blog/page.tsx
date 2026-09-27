import React from 'react';
import { Metadata } from 'next';
import BlogClient from './BlogClient';
import api from '@/utils/api';
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
    title: 'Blog | Software Development Insights & Tech Articles',
    description: 'Read expert articles on software development, ERP systems, cloud architecture, SaaS, mobile apps, and digital transformation from the ProHostix engineering team.',
    keywords: [
        'software development blog',
        'tech articles',
        'ERP insights',
        'cloud architecture blog',
        'SaaS development tips',
        'software engineering blog',
        'IT company blog',
        'digital transformation articles',
        'web development insights',
        'ProHostix blog',
    ],
    openGraph: {
        title: 'Blog | ProHostix Software Development Insights',
        description: 'Expert articles on software development, ERP systems, cloud architecture, and digital transformation.',
        url: 'https://www.prohostix.com/blog',
    },
    alternates: {
        canonical: 'https://www.prohostix.com/blog',
        languages: {
            'x-default': 'https://www.prohostix.com/blog',
            'en': 'https://www.prohostix.com/blog',
        }
    },
};

import { blogContent } from '@/config/blog/blogContent';

import dbConnect from '@/lib/db';
import BlogModel from '@/lib/models/Blog';

/**
 * Blog Page (Server Component)
 * Fetches data on the server for improved performance and SEO.
 */
export default async function BlogPage() {
    let blogs = [];

    try {
        await dbConnect();
        const dynamicBlogs = await BlogModel.find({ published: true }).lean();
        if (Array.isArray(dynamicBlogs) && dynamicBlogs.length > 0) {
            // Convert MongoDB _id and dates to string
            blogs = dynamicBlogs.map((blog: any) => {
                const b = { ...blog };
                if (b._id) b._id = b._id.toString();
                if (b.createdAt) b.createdAt = b.createdAt.toISOString();
                if (b.updatedAt) b.updatedAt = b.updatedAt.toISOString();
                return b;
            });
        }

        // If still empty (no published blogs), fallback to static content
        if (blogs.length === 0) {
            blogs = blogContent.posts;
        }
    } catch (error) {
        console.error('Failed to fetch blogs from DB:', error);
        // Fallback to static content on error
        blogs = blogContent.posts;
    }

    return (
        <BlogClient initialBlogs={blogs} />
    );
};
