import mongoose from 'mongoose';

const leadershipSchema = new mongoose.Schema({
    name: { type: String, required: true },
    role: { type: String, required: true }, // position
    desc: { type: String }, // bio
    specialization: { type: String, index: true },
    avatar: { type: String }, // image
}, { timestamps: true });

leadershipSchema.index({ name: 1, role: 1 });
leadershipSchema.index({ name: 'text', role: 'text', specialization: 'text' });

const Leadership = mongoose.models.Leadership || mongoose.model('Leadership', leadershipSchema);
export default Leadership;
