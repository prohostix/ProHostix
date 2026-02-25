import { NextRequest } from 'next/server';
import { withMiddleware, runMiddleware } from '@/lib/api-handler';
import { protect } from '@/lib/middleware/authMiddleware';
import { getMe, updateUserProfile } from '@/lib/controllers/userController';

export async function GET(request: NextRequest, context: any) {
    return withMiddleware(request, context, [protect], getMe);
}

export async function PUT(request: NextRequest, context: any) {
    return withMiddleware(request, context, [protect], updateUserProfile);
}

