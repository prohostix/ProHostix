import { NextRequest } from 'next/server';
import { withMiddleware, runMiddleware } from '@/lib/api-handler';
import { protect, admin } from '@/lib/middleware/authMiddleware';
import { getBlogById, updateBlog, deleteBlog } from '@/lib/controllers/blogController';

export async function GET(request: NextRequest, context: any) {
    return runMiddleware(request, context, getBlogById);
}

export async function PUT(request: NextRequest, context: any) {
    return withMiddleware(request, context, [protect, admin], updateBlog);
}

export async function DELETE(request: NextRequest, context: any) {
    return withMiddleware(request, context, [protect, admin], deleteBlog);
}

