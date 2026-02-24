import mongoose from 'mongoose';

const pageContentSchema = new mongoose.Schema({
    page: { type: String, required: true, index: true }, // e.g., 'home', 'company'
    section: { type: String, required: true, index: true }, // e.g., 'mission', 'hero'
    content: { type: mongoose.Schema.Types.Mixed, required: true }
}, { timestamps: true });

// Ensure unique combination of page and section
pageContentSchema.index({ page: 1, section: 1 }, { unique: true });

const PageContent = mongoose.models.PageContent || mongoose.models.PageContent || mongoose.model('PageContent', pageContentSchema);
export default PageContent;
