import type { Metadata } from 'next';
import BlogDetailClient from '@/components/blog/BlogDetailClient';
import { blogContent } from '@/config/blog/blogContent';
import { getAbsoluteImageUrl } from '@/utils/imageUrl';
export const dynamic = 'force-dynamic';

// Define Post type to match what we expect
interface BlogPost {
    _id?: string;
    title: string;
    excerpt: string;
    content?: string;
    image: string;
    date?: string;
    createdAt?: string;
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

/**
 * Fetches the base URL for server-side requests.
 */
const getBaseUrl = () => {
    return process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";
};

// generateStaticParams removed to avoid build-time ECONNREFUSED errors.
// Since the page is force-dynamic, it will be rendered on demand.

async function getPost(slug: string): Promise<BlogPost | null> {
    try {
        // Try fetching from API
        const apiUrl = getBaseUrl();
        const res = await fetch(`${apiUrl}/blogs`, { next: { revalidate: 60 } });

        if (res.ok) {
            const apiBlogs: BlogPost[] = await res.json();
            const found = apiBlogs.find((p: any) => p.slug === slug || p._id === slug);
            if (found) {
                return {
                    ...found,
                    image: getAbsoluteImageUrl(found.image)
                };
            }
        }
    } catch (e) {
        // console.warn("API error, falling back to static search", e);
    }

    // Fallback static
    // blogContent.posts might be typed if I check the file, but assumed any here for safety
    const staticPost = (blogContent as any).posts.find((p: any) => p.slug === slug);
    if (staticPost) {
        return {
            ...staticPost,
            image: getAbsoluteImageUrl(staticPost.image)
        };
    }

    return null;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const post = await getPost(slug);
    if (!post) return { title: 'Post Not Found' };

    return {
        title: post.seo?.title || post.title,
        description: post.seo?.description || post.excerpt,
        keywords: post.seo?.keywords || [post.category || 'Technology'],
        openGraph: {
            images: [post.image],
            type: 'article',
        }
    };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }): Promise<React.ReactElement> {
    const { slug } = await params;
    const post = await getPost(slug);
    return <BlogDetailClient post={post} />;
}
