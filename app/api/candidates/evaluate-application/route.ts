import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db.js';
import JobApplication from '@/lib/models/JobApplication.js';
import JobRequisition from '@/lib/models/JobRequisition.js';
import Candidate from '@/lib/models/Candidate.js';
import {
    extractTextFromBuffer,
    evaluateResumeWithAI,
    JobRequisitionData,
} from '@/lib/ai-shortlisting';
import { ensureDefaultJobs } from '@/lib/initial-jobs';

export async function POST(request: NextRequest) {
    try {
        await connectDB();
        await ensureDefaultJobs();

        const body = await request.json();
        const { applicationId, jobId } = body;

        if (!applicationId) {
            return NextResponse.json({ error: 'Application ID is required' }, { status: 400 });
        }

        const application = await JobApplication.findById(applicationId);
        if (!application) {
            return NextResponse.json({ error: 'Job application not found' }, { status: 404 });
        }

        // Find or match job requisition
        let job = null;
        if (jobId) {
            job = await JobRequisition.findById(jobId);
        }
        if (!job && application.role) {
            job = await JobRequisition.findOne({
                title: { $regex: application.role, $options: 'i' },
            });
        }
        if (!job) {
            job = await JobRequisition.findOne({ status: 'Active' });
        }

        const jobData: JobRequisitionData = {
            _id: job ? job._id.toString() : 'general',
            title: job ? job.title : (application.role || 'General Role'),
            department: job ? job.department : 'Engineering',
            minYears: job ? job.minYears : 3,
            requiredSkills: job?.requiredSkills?.length ? job.requiredSkills : ['Engineering', 'Problem Solving', 'Communication'],
            preferredSkills: job?.preferredSkills || [],
            description: job?.description || application.message || '',
        };

        // Extract text from the application's resume
        let resumeText = '';
        let resumeBuffer: Buffer | null = null;
        let mimeType = application.resumeMimeType || 'application/pdf';

        if (application.resumeData) {
            let b64 = application.resumeData;
            if (b64.includes(';base64,')) {
                b64 = b64.split(';base64,')[1];
            }
            resumeBuffer = Buffer.from(b64, 'base64');
            resumeText = await extractTextFromBuffer(
                resumeBuffer,
                application.resumeOriginalName || 'resume.pdf',
                mimeType
            );
        } else if (application.resume && application.resume.startsWith('data:')) {
            const parts = application.resume.split(';base64,');
            if (parts.length === 2) {
                resumeBuffer = Buffer.from(parts[1], 'base64');
                resumeText = await extractTextFromBuffer(
                    resumeBuffer,
                    application.resumeOriginalName || 'resume.pdf',
                    mimeType
                );
            }
        }

        if (!resumeText || resumeText.length < 20) {
            resumeText = `${application.name}\n${application.email}\n${application.phoneNumber}\nRole: ${application.role}\n\nCover Note:\n${application.message}`;
        }

        const evaluation = await evaluateResumeWithAI(
            resumeText,
            application.resumeOriginalName || `${application.name}_Resume.pdf`,
            jobData
        );

        // Update JobApplication document
        application.aiScore = evaluation.aiScore;
        application.aiStatus = evaluation.aiStatus;
        application.aiEvaluation = evaluation;
        await application.save();

        // Also upsert/mirror into Candidate collection for AI shortlisting portal
        await Candidate.findOneAndUpdate(
            { email: application.email, jobId: job ? job._id.toString() : 'general' },
            {
                fullName: application.name,
                email: application.email,
                phone: `${application.countryCode || ''} ${application.phoneNumber || ''}`.trim(),
                location: application.country || 'Remote',
                jobId: job ? job._id.toString() : 'general',
                jobTitle: job ? job.title : application.role,
                resumeFileName: application.resumeOriginalName || 'Resume.pdf',
                resumeFileType: application.resumeMimeType || 'application/pdf',
                resumeFileSize: application.resumeSize || 0,
                resumeFileBase64: application.resumeData || '',
                resumeRawText: resumeText.slice(0, 8000),
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
                source: 'Website Careers',
            },
            { upsert: true, new: true }
        );

        return NextResponse.json({
            success: true,
            aiScore: evaluation.aiScore,
            aiStatus: evaluation.aiStatus,
            evaluation,
        });
    } catch (error: any) {
        console.error('Error evaluating career application:', error);
        return NextResponse.json({ error: error.message || 'Evaluation failed' }, { status: 500 });
    }
}
