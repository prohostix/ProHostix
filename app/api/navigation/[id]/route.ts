import { NextRequest } from 'next/server';
import { withMiddleware, runMiddleware } from '@/lib/api-handler';
import { protect } from '@/lib/middleware/authMiddleware';
import { updateNavigation, deleteNavigation } from '@/lib/controllers/cmsController';

export async function PUT(request: NextRequest, context: any) {
    return withMiddleware(request, context, [protect], updateNavigation);
}

export async function DELETE(request: NextRequest, context: any) {
    return withMiddleware(request, context, [protect], deleteNavigation);
}

