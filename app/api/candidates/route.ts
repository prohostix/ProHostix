import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db.js';
import Candidate from '@/lib/models/Candidate.js';
import JobRequisition from '@/lib/models/JobRequisition.js';
import {
    extractTextFromBuffer,
    extractFilesFromZip,
    evaluateResumeWithAI,
    JobRequisitionData,
} from '@/lib/ai-shortlisting';
import { ensureDefaultJobs } from '@/lib/initial-jobs';

export async function GET(request: NextRequest) {
    try {
        await connectDB();
        await ensureDefaultJobs();

        const url = new URL(request.url);
        const jobId = url.searchParams.get('jobId');
        const status = url.searchParams.get('status');
        const search = url.searchParams.get('search');

        const query: any = {};
        if (jobId && jobId !== 'ALL') {
            query.jobId = jobId;
        }
        if (status && status !== 'ALL') {
            query.aiStatus = status;
        }
        if (search) {
            query.$or = [
                { fullName: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
                { skills: { $in: [new RegExp(search, 'i')] } },
            ];
        }

        const candidates = await Candidate.find(query).sort({ aiScore: -1, createdAt: -1 });

        // Calculate aggregate statistics
        const allCandidates = await Candidate.find(jobId && jobId !== 'ALL' ? { jobId } : {});
        const total = allCandidates.length;
        const shortlisted = allCandidates.filter((c: any) => c.aiStatus === 'SHORTLISTED').length;
        const review = allCandidates.filter((c: any) => c.aiStatus === 'REVIEW').length;
        const rejected = allCandidates.filter((c: any) => c.aiStatus === 'REJECTED').length;
        const totalScore = allCandidates.reduce((acc: number, c: any) => acc + (c.aiScore || 0), 0);
        const averageScore = total > 0 ? Math.round(totalScore / total) : 0;

        return NextResponse.json({
            candidates,
            stats: {
                total,
                shortlisted,
                review,
                rejected,
                averageScore,
            },
        });
    } catch (error: any) {
        console.error('Error fetching candidates:', error);
        return NextResponse.json({ error: error.message || 'Failed to fetch candidates' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        await connectDB();
        await ensureDefaultJobs();

        const formData = await request.formData();
        const jobId = (formData.get('jobId') as string) || '';

        // Find the job requisition
        let job = await JobRequisition.findById(jobId);
        if (!job) {
            job = await JobRequisition.findOne({ status: 'Active' });
        }
        if (!job) {
            return NextResponse.json({ error: 'No active job requisition found to evaluate against' }, { status: 400 });
        }

        const jobData: JobRequisitionData = {
            _id: job._id.toString(),
            title: job.title,
            department: job.department,
            minYears: job.minYears,
            requiredSkills: job.requiredSkills || [],
            preferredSkills: job.preferredSkills || [],
            description: job.description || '',
        };

        // Collect all uploaded files (single or multiple)
        const rawFiles: File[] = [];
        const fileEntries = formData.getAll('files');
        if (fileEntries.length > 0) {
            fileEntries.forEach((f) => {
                if (f instanceof File && f.size > 0) rawFiles.push(f);
            });
        }
        const singleFile = formData.get('file') || formData.get('resume');
        if (singleFile instanceof File && singleFile.size > 0) {
            rawFiles.push(singleFile);
        }

        if (rawFiles.length === 0) {
            return NextResponse.json({ error: 'Please upload at least one CV file or ZIP archive' }, { status: 400 });
        }

        // Expand any ZIP files into individual CV files
        const filesToProcess: Array<{ name: string; buffer: Buffer; mimeType: string; size: number }> = [];

        for (const file of rawFiles) {
            const arrayBuffer = await file.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);
            const fileName = file.name || 'resume.pdf';
            const mimeType = file.type || 'application/pdf';

            if (fileName.toLowerCase().endsWith('.zip') || mimeType.includes('zip')) {
                const zipExtracted = await extractFilesFromZip(buffer);
                for (const item of zipExtracted) {
                    filesToProcess.push({
                        name: item.name,
                        buffer: item.buffer,
                        mimeType: item.mimeType,
                        size: item.buffer.length,
                    });
                }
            } else {
                filesToProcess.push({
                    name: fileName,
                    buffer,
                    mimeType,
                    size: file.size,
                });
            }
        }

        if (filesToProcess.length === 0) {
            return NextResponse.json({ error: 'No valid CV documents (PDF, DOCX, TXT) found in upload' }, { status: 400 });
        }

        const savedCandidates: any[] = [];

        for (const item of filesToProcess) {
            const rawText = await extractTextFromBuffer(item.buffer, item.name, item.mimeType);
            const evaluation = await evaluateResumeWithAI(rawText, item.name, jobData);
            const base64Data = item.buffer.toString('base64');

            const candidate = await Candidate.create({
                fullName: evaluation.fullName,
                email: evaluation.email,
                phone: evaluation.phone,
                location: evaluation.location,
                jobId: job._id.toString(),
                jobTitle: job.title,
                resumeFileName: item.name,
                resumeFileType: item.mimeType,
                resumeFileSize: item.size,
                resumeFileBase64: base64Data,
                resumeRawText: rawText.slice(0, 8000),
                skills: evaluation.skills,
                experienceYears: evaluation.experienceYears,
                currentRole: evaluation.currentRole,
                currentCompany: evaluation.currentCompany,
                education: evaluation.education,
                workHistory: evaluation.workHistory,
                aiScore: evaluation.aiScore,
                aiStatus: evaluation.aiStatus,
                skillsMatchScore: evaluation.skillsMatchScore,
                experienceMatchScore: evaluation.experienceMatchScore,
                educationMatchScore: evaluation.educationMatchScore,
                aiSummary: evaluation.aiSummary,
                strengths: evaluation.strengths,
                weaknesses: evaluation.weaknesses,
                interviewQuestions: evaluation.interviewQuestions,
                pipelineStatus: evaluation.aiStatus === 'SHORTLISTED' ? 'AI Shortlisted' : 'Applied',
                source: filesToProcess.length > 1 ? 'Bulk Upload' : 'Manual Upload',
            });

            savedCandidates.push(candidate);
        }

        return NextResponse.json({
            success: true,
            count: savedCandidates.length,
            candidates: savedCandidates,
        }, { status: 201 });
    } catch (error: any) {
        console.error('Error uploading/evaluating candidates:', error);
        return NextResponse.json({ error: error.message || 'Failed to process CVs' }, { status: 500 });
    }
}
