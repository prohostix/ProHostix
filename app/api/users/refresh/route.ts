import { NextRequest } from 'next/server';
import { withMiddleware, runMiddleware } from '@/lib/api-handler';
import { refreshAccessToken } from '@/lib/controllers/userController';

export async function POST(request: NextRequest, context: any) {
    return runMiddleware(request, context, refreshAccessToken);
}

