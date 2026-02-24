import { NextRequest } from 'next/server';
import { withMiddleware, runMiddleware } from '@/lib/api-handler';
import { logoutUser } from '@/lib/controllers/userController';

export async function POST(request: NextRequest, context: any) {
    return runMiddleware(request, context, logoutUser);
}

