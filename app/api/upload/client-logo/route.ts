import { NextRequest } from 'next/server';
import { withMiddleware } from '@/lib/api-handler';
import { protect, admin } from '@/lib/middleware/authMiddleware';
import { uploadClientLogo } from '@/lib/controllers/uploadController';

export async function POST(request: NextRequest, context: any) {
    return withMiddleware(request, context, [protect, admin], uploadClientLogo);
}
