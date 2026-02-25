import { NextRequest } from 'next/server';
import { withMiddleware, runMiddleware } from '@/lib/api-handler';
import { protect } from '@/lib/middleware/authMiddleware';
import { updateUser, deleteUser } from '@/lib/controllers/userController';

export async function PUT(request: NextRequest, context: any) {
    return withMiddleware(request, context, [protect], updateUser);
}

export async function DELETE(request: NextRequest, context: any) {
    return withMiddleware(request, context, [protect], deleteUser);
}

