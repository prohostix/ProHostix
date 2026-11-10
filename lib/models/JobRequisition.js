import mongoose from 'mongoose';

const jobRequisitionSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        department: { type: String, default: 'Engineering' },
        location: { type: String, default: 'Remote / Hybrid' },
        type: { type: String, default: 'Full-time' },
        experienceLevel: { type: String, default: 'Senior' },
        minYears: { type: Number, default: 4 },
        requiredSkills: { type: [String], default: [] },
        preferredSkills: { type: [String], default: [] },
        description: { type: String, default: '' },
        status: { type: String, enum: ['Active', 'Draft', 'Closed'], default: 'Active' },
    },
    { timestamps: true }
);

const JobRequisition = mongoose.models.JobRequisition || mongoose.model('JobRequisition', jobRequisitionSchema);
export default JobRequisition;
