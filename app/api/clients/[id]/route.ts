import { NextRequest } from 'next/server';
import { withMiddleware, runMiddleware } from '@/lib/api-handler';
import { protect, admin } from '@/lib/middleware/authMiddleware';
import { getClientById, updateClient, deleteClient } from '@/lib/controllers/clientController';

export async function GET(request: NextRequest, context: any) {
    return runMiddleware(request, context, getClientById);
}

export async function PUT(request: NextRequest, context: any) {
    return withMiddleware(request, context, [protect, admin], updateClient);
}

export async function DELETE(request: NextRequest, context: any) {
    return withMiddleware(request, context, [protect, admin], deleteClient);
}
