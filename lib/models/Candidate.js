import mongoose from 'mongoose';

const candidateSchema = new mongoose.Schema(
    {
        fullName: { type: String, required: true },
        email: { type: String, default: '' },
        phone: { type: String, default: '' },
        location: { type: String, default: '' },
        jobId: { type: String, required: true },
        jobTitle: { type: String, required: true },
        resumeFileName: { type: String, required: true },
        resumeFileType: { type: String, default: 'application/pdf' },
        resumeFileSize: { type: Number, default: 0 },
        resumeFileBase64: { type: String, default: '' },
        resumeRawText: { type: String, default: '' },
        skills: { type: [String], default: [] },
        experienceYears: { type: Number, default: 0 },
        currentRole: { type: String, default: '' },
        currentCompany: { type: String, default: '' },
        education: [
            {
                degree: String,
                school: String,
                year: String,
            },
        ],
        workHistory: [
            {
                company: String,
                role: String,
                duration: String,
            },
        ],
        aiScore: { type: Number, default: 0 },
        aiStatus: {
            type: String,
            enum: ['SHORTLISTED', 'REVIEW', 'REJECTED'],
            default: 'REVIEW',
        },
        skillsMatchScore: { type: Number, default: 0 },
        experienceMatchScore: { type: Number, default: 0 },
        educationMatchScore: { type: Number, default: 0 },
        aiSummary: { type: String, default: '' },
        strengths: { type: [String], default: [] },
        weaknesses: { type: [String], default: [] },
        interviewQuestions: { type: [String], default: [] },
        pipelineStatus: {
            type: String,
            enum: [
                'Applied',
                'AI Shortlisted',
                'Screening',
                'Technical Round',
                'Executive Interview',
                'Offered',
                'Rejected',
            ],
            default: 'Applied',
        },
        recruiterNotes: { type: String, default: '' },
        rating: { type: Number, default: 0 },
        source: { type: String, default: 'Manual Upload' }, // 'Manual Upload', 'Bulk Upload', 'Website Careers'
    },
    { timestamps: true }
);

const Candidate = mongoose.models.Candidate || mongoose.model('Candidate', candidateSchema);
export default Candidate;

