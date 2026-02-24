import mongoose from 'mongoose';

const socialLinkSchema = new mongoose.Schema({
    platform: { type: String, required: true },
    url: { type: String, required: true },
    icon: { type: String, required: true }, // Name of the Lucide icon
    isActive: { type: Boolean, default: true },
    order: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.models.SocialLink || mongoose.model('SocialLink', socialLinkSchema);
