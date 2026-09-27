import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import SeoMetadata from '@/lib/models/SeoMetadata';

export async function GET(req: Request, context: { params: Promise<{ page: string }> }) {
    try {
        await dbConnect();
        const params = await context.params;
        const page = decodeURIComponent(params.page);
        const metadata = await SeoMetadata.findOne({ page });

        if (!metadata) {
            return NextResponse.json({ message: 'SEO Metadata not found for this page' }, { status: 404 });
        }
        return NextResponse.json(metadata);
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}

export async function PUT(req: Request, context: { params: Promise<{ page: string }> }) {
    try {
        await dbConnect();
        const params = await context.params;
        const page = decodeURIComponent(params.page);
        const body = await req.json();

        const metadata = await SeoMetadata.findOneAndUpdate(
            { page },
            {
                page,
                title: body.title,
                description: body.description,
                keywords: body.keywords,
                ogImage: body.ogImage,
                robots: body.robots,
                canonicalUrl: body.canonicalUrl
            },
            { new: true, upsert: true, runValidators: true }
        );

        return NextResponse.json(metadata);
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 400 });
    }
}

export async function DELETE(req: Request, context: { params: Promise<{ page: string }> }) {
    try {
        await dbConnect();
        const params = await context.params;
        const page = decodeURIComponent(params.page);
        const metadata = await SeoMetadata.findOneAndDelete({ page });

        if (!metadata) {
            return NextResponse.json({ message: 'SEO Metadata not found' }, { status: 404 });
        }
        return NextResponse.json({ message: 'SEO Metadata removed' });
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
