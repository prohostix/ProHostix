import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db.js';
import JobRequisition from '@/lib/models/JobRequisition.js';
import { ensureDefaultJobs } from '@/lib/initial-jobs';

export async function GET(request: NextRequest) {
    try {
        await connectDB();
        await ensureDefaultJobs();
        const jobs = await JobRequisition.find().sort({ createdAt: -1 });
        return NextResponse.json(jobs);
    } catch (error: any) {
        console.error('Error fetching jobs:', error);
        return NextResponse.json({ error: error.message || 'Failed to fetch jobs' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        await connectDB();
        const body = await request.json();
        const { title, department, minYears, requiredSkills, preferredSkills, description, location, type } = body;

        if (!title || !department) {
            return NextResponse.json({ error: 'Title and Department are required' }, { status: 400 });
        }

        const job = await JobRequisition.create({
            title,
            department,
            minYears: Number(minYears) || 3,
            requiredSkills: Array.isArray(requiredSkills) ? requiredSkills : (requiredSkills ? requiredSkills.split(',').map((s: string) => s.trim()) : []),
            preferredSkills: Array.isArray(preferredSkills) ? preferredSkills : (preferredSkills ? preferredSkills.split(',').map((s: string) => s.trim()) : []),
            description: description || '',
            location: location || 'Remote / Hybrid',
            type: type || 'Full-time',
            status: 'Active',
        });

        return NextResponse.json(job, { status: 201 });
    } catch (error: any) {
        console.error('Error creating job:', error);
        return NextResponse.json({ error: error.message || 'Failed to create job' }, { status: 500 });
    }
}

