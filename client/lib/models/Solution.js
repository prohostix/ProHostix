import mongoose from 'mongoose';

const solutionSchema = new mongoose.Schema({
    title: { type: String, required: true, minlength: 5, maxlength: 100 },
    slug: { type: String, required: true, unique: true, index: true },
    description: { type: String, required: true, minlength: 10, maxlength: 200 },
    problemSolved: { type: String },
    longDescription: { type: String },
    deliverables: [String],
    coreCapabilities: [String],
    capabilities: [{
        title: { type: String },
        description: { type: String }
    }],
    detailedProcess: [{
        title: { type: String },
        description: { type: String }
    }],
    outcome: { type: String },
    outcomes: [String],
    tags: [String],
    cta: { type: String },
    illustration: { type: String },
    icon: { type: String },
    link: { type: String },
    relatedServices: [String],
    projectLink: {
        label: { type: String },
        url: { type: String }
    },
    details: { type: String },
    seo: {
        title: String,
        description: String,
        keywords: [String]
    }
}, { timestamps: true });

solutionSchema.index({ title: 'text', description: 'text', tags: 'text' });

const Solution = mongoose.models.Solution || mongoose.model('Solution', solutionSchema);
export default Solution;
