import { NextRequest } from 'next/server';
import { withMiddleware, runMiddleware } from '@/lib/api-handler';
import { protect } from '@/lib/middleware/authMiddleware';
import { deleteJobApplication } from '@/lib/controllers/enquiryController';

export async function DELETE(request: NextRequest, context: any) {
    return withMiddleware(request, context, [protect], deleteJobApplication);
}

