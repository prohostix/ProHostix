import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema({
    title: { type: String, required: true, minlength: 5, maxlength: 100 },
    slug: { type: String, required: true, unique: true, index: true },
    description: { type: String, required: true, minlength: 10, maxlength: 200 }, // Short description
    longDescription: { type: String },
    deliverables: [String],
    techStack: [String],
    outcome: { type: String }, // Single outcome string
    illustration: { type: String },
    useCases: [String],
    capabilities: [{
        title: { type: String },
        description: { type: String }
    }],
    detailedProcess: [{
        title: { type: String },
        description: { type: String }
    }],
    outcomes: [String], // Array of outcome strings
    relatedServices: [String], // Array of slugs
    icon: { type: String }, // Icon identifier
    seo: {
        title: String,
        description: String,
        keywords: [String]
    }
}, { timestamps: true });

serviceSchema.index({ title: 'text', description: 'text' });

const Service = mongoose.models.Service || mongoose.model('Service', serviceSchema);
export default Service;
