import { NextRequest } from 'next/server';
import { withMiddleware, runMiddleware } from '@/lib/api-handler';
import { protect } from '@/lib/middleware/authMiddleware';
import { getSolutions, createSolution } from '@/lib/controllers/cmsController';

export async function GET(request: NextRequest, context: any) {
    return runMiddleware(request, context, getSolutions);
}

export async function POST(request: NextRequest, context: any) {
    return withMiddleware(request, context, [protect], createSolution);
}

