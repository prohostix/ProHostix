import mongoose from 'mongoose';

const subscriberSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    isActive: { type: Boolean, default: true },
    status: { type: String, enum: ['new', 'read'], default: 'new' }
}, { timestamps: true });

const Subscriber = mongoose.models.Subscriber || mongoose.model('Subscriber', subscriberSchema);
export default Subscriber;
