import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Leadership from '../models/Leadership.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../../.env') });

const checkLeadership = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const members = await Leadership.find({});
        console.log('--- Leadership Members in DB ---');
        console.log(JSON.stringify(members, null, 2));
        console.log('--------------------------------');
        process.exit();
    } catch (error) {
        console.error('Check failed:', error);
        process.exit(1);
    }
};

checkLeadership();
