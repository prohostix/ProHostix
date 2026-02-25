import { NextRequest } from 'next/server';
import { withMiddleware, runMiddleware } from '@/lib/api-handler';
import { search } from '@/lib/controllers/searchController';

export async function GET(request: NextRequest, context: any) {
    return runMiddleware(request, context, search);
}

