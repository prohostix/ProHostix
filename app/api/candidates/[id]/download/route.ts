import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db.js';
import Candidate from '@/lib/models/Candidate.js';

export async function GET(
    request: NextRequest,
    context: { params: Promise<{ id: string }> | { id: string } }
) {
    try {
        await connectDB();
        const resolved = await context.params;
        const candidate = await Candidate.findById(resolved.id);

        if (!candidate) {
            return NextResponse.json({ error: 'Candidate not found' }, { status: 404 });
        }

        const url = new URL(request.url);
        const isDownload = url.searchParams.get('download') === '1' || url.searchParams.get('download') === 'true';

        let buffer: Buffer;
        let mimeType = candidate.resumeFileType || 'application/pdf';
        const fileName = candidate.resumeFileName || `${candidate.fullName.replace(/\s+/g, '_')}_Resume.pdf`;

        if (candidate.resumeFileBase64 && candidate.resumeFileBase64.length > 50) {
            let b64 = candidate.resumeFileBase64;
            if (b64.includes(';base64,')) {
                b64 = b64.split(';base64,')[1];
            }
            buffer = Buffer.from(b64, 'base64');
        } else if (candidate.resumeRawText) {
            buffer = Buffer.from(candidate.resumeRawText, 'utf-8');
            mimeType = 'text/plain; charset=utf-8';
        } else {
            return NextResponse.json({ error: 'No resume file content stored for this candidate' }, { status: 404 });
        }

        const disposition = isDownload
            ? `attachment; filename="${encodeURIComponent(fileName)}"`
            : `inline; filename="${encodeURIComponent(fileName)}"`;

        return new NextResponse(new Uint8Array(buffer), {
            status: 200,
            headers: {
                'Content-Type': mimeType,
                'Content-Disposition': disposition,
                'Content-Length': buffer.length.toString(),
                'Cache-Control': 'public, max-age=3600',
            },
        });
    } catch (error: any) {
        console.error('Error downloading candidate resume:', error);
        return NextResponse.json({ error: 'Failed to download resume', details: error.message }, { status: 500 });
    }
}
