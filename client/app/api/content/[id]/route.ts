import { NextRequest } from 'next/server';
import { withMiddleware, runMiddleware } from '@/lib/api-handler';
import { protect } from '@/lib/middleware/authMiddleware';
import { updatePageContent, deletePageContent } from '@/lib/controllers/cmsController';

export async function PUT(request: NextRequest, context: any) {
    return withMiddleware(request, context, [protect], updatePageContent);
}

export async function DELETE(request: NextRequest, context: any) {
    return withMiddleware(request, context, [protect], deletePageContent);
}

