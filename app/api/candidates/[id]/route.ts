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
        return NextResponse.json(candidate);
    } catch (error: any) {
        return NextResponse.json({ error: error.message || 'Failed to fetch candidate' }, { status: 500 });
    }
}

export async function PATCH(
    request: NextRequest,
    context: { params: Promise<{ id: string }> | { id: string } }
) {
    try {
        await connectDB();
        const resolved = await context.params;
        const body = await request.json();

        const candidate = await Candidate.findByIdAndUpdate(
            resolved.id,
            { $set: body },
            { new: true, runValidators: true }
        );

        if (!candidate) {
            return NextResponse.json({ error: 'Candidate not found' }, { status: 404 });
        }

        return NextResponse.json(candidate);
    } catch (error: any) {
        return NextResponse.json({ error: error.message || 'Failed to update candidate' }, { status: 500 });
    }
}

export async function DELETE(
    request: NextRequest,
    context: { params: Promise<{ id: string }> | { id: string } }
) {
    try {
        await connectDB();
        const resolved = await context.params;
        const candidate = await Candidate.findByIdAndDelete(resolved.id);
        if (!candidate) {
            return NextResponse.json({ error: 'Candidate not found' }, { status: 404 });
        }
        return NextResponse.json({ success: true, message: 'Candidate deleted' });
    } catch (error: any) {
        return NextResponse.json({ error: error.message || 'Failed to delete candidate' }, { status: 500 });
    }
}

