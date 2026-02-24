import { NextRequest } from 'next/server';
import { withMiddleware, runMiddleware } from '@/lib/api-handler';
import { loginUser } from '@/lib/controllers/userController';

export async function POST(request: NextRequest, context: any) {
    return runMiddleware(request, context, loginUser);
}

