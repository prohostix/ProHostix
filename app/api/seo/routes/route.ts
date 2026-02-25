import { NextRequest } from 'next/server';
import { withMiddleware, runMiddleware } from '@/lib/api-handler';
import { protect, admin } from '@/lib/middleware/authMiddleware';
import { getAvailableRoutes } from '@/lib/controllers/seoController';

export async function GET(request: NextRequest, context: any) {
    return withMiddleware(request, context, [protect, admin], getAvailableRoutes);
}

