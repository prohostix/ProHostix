import { NextRequest } from 'next/server';
import { withMiddleware, runMiddleware } from '@/lib/api-handler';
import { protect } from '@/lib/middleware/authMiddleware';
import {
    getJobApplicationById,
    updateJobApplication,
    deleteJobApplication
} from '@/lib/controllers/enquiryController';

export async function GET(request: NextRequest, context: any) {
    return withMiddleware(request, context, [protect], getJobApplicationById);
}

export async function PATCH(request: NextRequest, context: any) {
    return withMiddleware(request, context, [protect], updateJobApplication);
}

export async function DELETE(request: NextRequest, context: any) {
    return withMiddleware(request, context, [protect], deleteJobApplication);
}

