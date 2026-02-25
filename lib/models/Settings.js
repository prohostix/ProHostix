import mongoose from 'mongoose';

const settingsSchema = new mongoose.Schema({
    companyName: { type: String, required: true },
    brandWordmarkPart1: { type: String, required: true }, // e.g. "Pro"
    brandWordmarkPart2: { type: String, required: true }, // e.g. "Hostix"
    logoLetter: { type: String, required: true },       // e.g. "P"
    logoImage: { type: String },                       // Optional URL for actual logo image
    contactEmail: { type: String },
    contactPhone: { type: String },
    address: { type: String },
    socialLinks: {
        x: String,
        facebook: String,
        instagram: String,
        youtube: String,
        mail: String,
        globe: String
    },
    siteUrl: { type: String, default: 'https://prohostix.com' },
    defaultSeoTitle: { type: String },
    defaultSeoDescription: { type: String },
    favicon: { type: String }
}, { timestamps: true });

const Settings = mongoose.models.Settings || mongoose.model('Settings', settingsSchema);
export default Settings;
