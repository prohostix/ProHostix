import mongoose from 'mongoose';

const navigationSchema = new mongoose.Schema({
    label: { type: String, required: true },
    path: { type: String, required: true },
    icon: { type: String, required: true }, // Store lucide icon name
    order: { type: Number, default: 0 }
}, { timestamps: true });

const Navigation = mongoose.models.Navigation || mongoose.model('Navigation', navigationSchema);
export default Navigation;
