import { NextRequest } from 'next/server';
import { withMiddleware, runMiddleware } from '@/lib/api-handler';
import { protect } from '@/lib/middleware/authMiddleware';
import { createJobApplication, getJobApplications } from '@/lib/controllers/enquiryController';

export async function POST(request: NextRequest, context: any) {
    return runMiddleware(request, context, createJobApplication);
}

export async function GET(request: NextRequest, context: any) {
    return withMiddleware(request, context, [protect], getJobApplications);
}

