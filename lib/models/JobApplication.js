import mongoose from 'mongoose';

const jobApplicationSchema = new mongoose.Schema({
    name: { type: String, required: true, minLength: 2, maxLength: 60 }, // applicantName
    email: { type: String, required: true, match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please enter a valid email'] },
    role: { type: String, required: true }, // roleApplyingFor
    country: { type: String, required: true },
    countryCode: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    portfolio: { type: String, required: false }, // resumeUrl/portfolioUrl
    resume: { type: String, required: true },
    message: { type: String, required: true, minLength: 20, maxLength: 2000 }, // coverLetter
    status: { type: String, enum: ['received', 'reviewing', 'shortlisted', 'rejected'], default: 'received' }
}, { timestamps: true });

const JobApplication = mongoose.models.JobApplication || mongoose.models.JobApplication || mongoose.model('JobApplication', jobApplicationSchema);
export default JobApplication;
