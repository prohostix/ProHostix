import { NextRequest } from 'next/server';
import { withMiddleware, runMiddleware } from '@/lib/api-handler';
import { protect } from '@/lib/middleware/authMiddleware';
import { getSettings, updateSettings } from '@/lib/controllers/cmsController';

export async function GET(request: NextRequest, context: any) {
    return runMiddleware(request, context, getSettings);
}

export async function PUT(request: NextRequest, context: any) {
    return withMiddleware(request, context, [protect], updateSettings);
}

