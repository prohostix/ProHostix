import { NextRequest } from 'next/server';
import { withMiddleware, runMiddleware } from '@/lib/api-handler';
import { getSitemap } from '@/lib/controllers/seoController';

export async function GET(request: NextRequest, context: any) {
    return runMiddleware(request, context, getSitemap);
}

