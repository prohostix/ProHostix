import { NextRequest } from 'next/server';
import { withMiddleware, runMiddleware } from '@/lib/api-handler';
import { protect, admin } from '@/lib/middleware/authMiddleware';
import { getBlogs, createBlog } from '@/lib/controllers/blogController';

export async function GET(request: NextRequest, context: any) {
    return runMiddleware(request, context, getBlogs);
}

export async function POST(request: NextRequest, context: any) {
    return withMiddleware(request, context, [protect, admin], createBlog);
}

