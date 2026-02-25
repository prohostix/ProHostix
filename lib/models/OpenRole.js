import mongoose from 'mongoose';

const openRoleSchema = new mongoose.Schema({
    title: { type: String, required: true },
    location: { type: String, required: true },
    type: { type: String, enum: ['Full-time', 'Part-time', 'Contract'], required: true },
    description: { type: String, required: true },
    requirements: [String],
    isActive: { type: Boolean, default: true, index: true }
}, { timestamps: true });

openRoleSchema.index({ title: 1 });
openRoleSchema.index({ title: 'text', location: 'text', description: 'text' });

const OpenRole = mongoose.models.OpenRole || mongoose.model('OpenRole', openRoleSchema);
export default OpenRole;
