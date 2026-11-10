import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';

import User from '../lib/models/User.js';
import bcrypt from 'bcryptjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const resetPassword = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const email = 'admin@prohostix.com';
        const newPassword = 'cadminPassword123';

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        const user = await User.findOneAndUpdate(
            { email },
            { password: hashedPassword },
            { new: true }
        );

        if (user) {
            console.log(`Password reset successful for ${email}`);
            console.log(`New password is: ${newPassword}`);
        } else {
            console.log(`User ${email} not found`);
        }

        const recruiterEmail = 'careers@prohostix.com';
        const recruiterPassword = 'ProxGM@12';
        const recruiterSalt = await bcrypt.genSalt(10);
        const hashedRecruiterPassword = await bcrypt.hash(recruiterPassword, recruiterSalt);

        await User.findOneAndUpdate(
            { email: recruiterEmail },
            {
                name: 'Prohostix Talent Team',
                email: recruiterEmail,
                password: hashedRecruiterPassword,
                role: 'Administrator'
            },
            { upsert: true, returnDocument: 'after' }
        );
        console.log(`Recruiter user ensured: ${recruiterEmail}`);

        process.exit(0);
    } catch (error) {
        console.error('Error resetting password:', error);
        process.exit(1);
    }
};

resetPassword();
