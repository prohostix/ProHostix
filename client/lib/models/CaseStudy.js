import mongoose from 'mongoose';

const caseStudySchema = new mongoose.Schema({
    title: { type: String, required: true, minlength: 5, maxlength: 100 },
    category: { type: String },
    description: { type: String, required: true, minlength: 20, maxlength: 300 },
    slug: { type: String, unique: true, index: true },
    industry: { type: String, index: true },
    problem: { type: String },
    solution: { type: String },
    techStack: [String],
    stats: [{
        label: { type: String },
        value: { type: String }
    }],
    cta: { type: String },
    outcome: { type: String },
    image: { type: String },
    projectUrl: { type: String },
    seo: {
        title: String,
        description: String,
        keywords: [String]
    }
}, { timestamps: true });

caseStudySchema.index({ title: 'text', description: 'text', industry: 'text' });

const CaseStudy = mongoose.models.CaseStudy || mongoose.model('CaseStudy', caseStudySchema);
export default CaseStudy;
