import { NextRequest } from 'next/server';
import { withMiddleware, runMiddleware } from '@/lib/api-handler';
import { protect } from '@/lib/middleware/authMiddleware';
import { markAllEnquiriesRead } from '@/lib/controllers/enquiryController';

export async function PUT(request: NextRequest, context: any) {
    return withMiddleware(request, context, [protect], markAllEnquiriesRead);
}

