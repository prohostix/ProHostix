import { NextRequest } from 'next/server';
import { withMiddleware, runMiddleware } from '@/lib/api-handler';
import { protect } from '@/lib/middleware/authMiddleware';
import { getServices, createService } from '@/lib/controllers/cmsController';

export async function GET(request: NextRequest, context: any) {
    return runMiddleware(request, context, getServices);
}

export async function POST(request: NextRequest, context: any) {
    return withMiddleware(request, context, [protect], createService);
}

