import { NextRequest } from 'next/server';
import { withMiddleware, runMiddleware } from '@/lib/api-handler';
import { protect, admin } from '@/lib/middleware/authMiddleware';
import { getSeoMetadataByPage, updateSeoMetadata, deleteSeoMetadata } from '@/lib/controllers/seoController';

export async function GET(request: NextRequest, context: any) {
    return runMiddleware(request, context, getSeoMetadataByPage);
}

export async function PUT(request: NextRequest, context: any) {
    return withMiddleware(request, context, [protect, admin], updateSeoMetadata);
}

export async function DELETE(request: NextRequest, context: any) {
    return withMiddleware(request, context, [protect, admin], deleteSeoMetadata);
}

