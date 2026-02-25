import mongoose from 'mongoose';

const enquirySchema = new mongoose.Schema({
    name: { type: String, required: true, minLength: 2, maxLength: 60 },
    email: { type: String, required: true, match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please enter a valid email'] },
    company: { type: String, required: true, minLength: 2, maxLength: 100 },
    role: { type: String, required: true },
    enquiryType: { type: String, required: true },
    enquiryItem: { type: String, required: true },
    country: { type: String, required: true },
    countryCode: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    description: { type: String, required: true, minLength: 20, maxLength: 2000 }, // message
    timeline: { type: String, required: true },
    status: { type: String, enum: ['new', 'contacted', 'resolved'], default: 'new', index: true }
}, { timestamps: true });

const Enquiry = mongoose.models.Enquiry || mongoose.model('Enquiry', enquirySchema);
export default Enquiry;
