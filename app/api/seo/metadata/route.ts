import { NextResponse } from 'next/server';
import { getAllSeoMetadata } from '@/lib/controllers/seoController';

export async function GET(req: Request): Promise<Response> {
    // We simulate req/res to use the existing controller
    return new Promise<Response>((resolve) => {
        const res: any = {
            status: (statusCode: number) => ({
                json: (data: any) => resolve(NextResponse.json(data, { status: statusCode })),
                send: (data: any) => resolve(new NextResponse(data, { status: statusCode }))
            }),
            json: (data: any) => resolve(NextResponse.json(data))
        };
        getAllSeoMetadata(req as any, res);
    });
}
