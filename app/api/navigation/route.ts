import { NextRequest } from 'next/server';
import { withMiddleware, runMiddleware } from '@/lib/api-handler';
import { protect } from '@/lib/middleware/authMiddleware';
import { getNavigation, createNavigation } from '@/lib/controllers/cmsController';

export async function GET(request: NextRequest, context: any) {
    return runMiddleware(request, context, getNavigation);
}

export async function POST(request: NextRequest, context: any) {
    return withMiddleware(request, context, [protect], createNavigation);
}

