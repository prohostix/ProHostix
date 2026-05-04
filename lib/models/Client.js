import mongoose from 'mongoose';

const clientSchema = new mongoose.Schema({
    name: { type: String, required: true, minlength: 2, maxlength: 100 },
    logo: { type: String, required: true }, // URL or path to logo image
    website: { type: String },
    order: { type: Number, default: 0 }, // For custom ordering
    active: { type: Boolean, default: true, index: true },
    description: { type: String, maxlength: 500 } // Optional description
}, { timestamps: true });

// Compound index for efficient sorting and filtering
clientSchema.index({ active: 1, order: 1, createdAt: -1 });

const Client = mongoose.models.Client || mongoose.model('Client', clientSchema);
export default Client;
