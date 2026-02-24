import { NextRequest } from 'next/server';
import { withMiddleware, runMiddleware } from '@/lib/api-handler';
import { getAllPageContent } from '@/lib/controllers/cmsController';

export async function GET(request: NextRequest, context: any) {
    return runMiddleware(request, context, getAllPageContent);
}

