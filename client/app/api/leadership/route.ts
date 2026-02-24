import { NextRequest } from 'next/server';
import { withMiddleware, runMiddleware } from '@/lib/api-handler';
import { protect } from '@/lib/middleware/authMiddleware';
import { getLeadership, createLeadership } from '@/lib/controllers/cmsController';

export async function GET(request: NextRequest, context: any) {
    return runMiddleware(request, context, getLeadership);
}

export async function POST(request: NextRequest, context: any) {
    return withMiddleware(request, context, [protect], createLeadership);
}

