
import mongoose from 'mongoose';

const seoMetadataSchema = new mongoose.Schema({
    page: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        index: true
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    keywords: {
        type: [String],
        default: []
    },
    ogImage: {
        type: String,
        trim: true
    },
    robots: {
        type: String,
        default: 'index, follow',
        trim: true
    },
    canonicalUrl: {
        type: String,
        trim: true
    }
}, { timestamps: true });

const SeoMetadata = mongoose.models.SeoMetadata || mongoose.models.SeoMetadata || mongoose.model('SeoMetadata', seoMetadataSchema);
export default SeoMetadata;
