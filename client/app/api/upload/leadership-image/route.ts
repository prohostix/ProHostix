import { NextRequest } from 'next/server';
import { withMiddleware, runMiddleware } from '@/lib/api-handler';
import { uploadLeadershipImage } from '@/lib/controllers/uploadController';

export async function POST(request: NextRequest, context: any) {
    return runMiddleware(request, context, uploadLeadershipImage);
}

