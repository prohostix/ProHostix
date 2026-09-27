import mongoose from 'mongoose';
import Client from '../lib/models/Client.js';

async function clearClients() {
    try {
        await mongoose.connect('mongodb+srv://hostixpro_db_user:prohostix123@prohostix.boshp8x.mongodb.net/?appName=Prohostix');
        const result = await Client.deleteMany({ logo: { $regex: 'via.placeholder.com' } });
        console.log(`Deleted ${result.deletedCount} placeholder clients.`);
        
        // Also let's update masterSeed.js so it doesn't re-insert them on next seed run.
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}

clearClients();
