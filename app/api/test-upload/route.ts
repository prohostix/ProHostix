import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic'; // prevent static generation since it uses secrets/env at runtime for upload

export async function POST(request: Request) {
    try {
        const { url } = await request.json();

        if (!url) {
            return NextResponse.json(
                { error: 'URL is required' },
                { status: 400 }
            );
        }

        // Process an image URL (simulating local file buffer for test)
        // In a real test-upload, we'd fetch the URL and convert to Base64
        const response = await fetch(url);
        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const mimeType = response.headers.get('content-type') || 'image/jpeg';

        const base64Data = `data:${mimeType};base64,${buffer.toString('base64')}`;

        return NextResponse.json({
            secureToken: 'TEST-SUCCESS-MONGODB',
            imageUrl: base64Data,
            message: 'Image converted to Base64 for MongoDB storage'
        });
    } catch (error: any) {
        console.error('Upload error:', error);
        return NextResponse.json(
            { error: error?.message || 'Upload failed' },
            { status: 500 }
        );
    }
}

export async function GET() {
    return NextResponse.json({ message: 'Upload endpoint ready' });
}
