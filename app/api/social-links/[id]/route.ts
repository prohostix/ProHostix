import { NextRequest } from 'next/server';
import { withMiddleware, runMiddleware } from '@/lib/api-handler';
import { protect } from '@/lib/middleware/authMiddleware';
import { updateSocialLink, deleteSocialLink } from '@/lib/controllers/cmsController';

export async function PUT(request: NextRequest, context: any) {
    return withMiddleware(request, context, [protect], updateSocialLink);
}

export async function DELETE(request: NextRequest, context: any) {
    return withMiddleware(request, context, [protect], deleteSocialLink);
}

