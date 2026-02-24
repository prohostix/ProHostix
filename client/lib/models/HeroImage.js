import mongoose from 'mongoose';

const heroImageSchema = new mongoose.Schema({
    imageUrl: { type: String, required: true }, // visual.img
    altText: { type: String }, // visual.alt
    isActive: { type: Boolean, default: true },
    badge: { type: String },
    titleLine1: { type: String },
    titleLine2: { type: String },
    subtitle: { type: String }, // subheading
    services: { type: String },
    primaryCtaText: { type: String },
    primaryCtaLink: { type: String },
    secondaryCtaText: { type: String },
    secondaryCtaLink: { type: String }
}, { timestamps: true });

const HeroImage = mongoose.models.HeroImage || mongoose.model('HeroImage', heroImageSchema);
export default HeroImage;
