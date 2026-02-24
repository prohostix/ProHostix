import { NextRequest } from 'next/server';
import { withMiddleware, runMiddleware } from '@/lib/api-handler';
import { protect } from '@/lib/middleware/authMiddleware';
import { subscribe, getSubscribers } from '@/lib/controllers/enquiryController';

export async function POST(request: NextRequest, context: any) {
    return runMiddleware(request, context, subscribe);
}

export async function GET(request: NextRequest, context: any) {
    return withMiddleware(request, context, [protect], getSubscribers);
}

