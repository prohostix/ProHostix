import mongoose from 'mongoose';
import CaseStudy from '../lib/models/CaseStudy.js';

async function clearFakeCaseStudy() {
    try {
        await mongoose.connect('mongodb+srv://hostixpro_db_user:prohostix123@prohostix.boshp8x.mongodb.net/?appName=Prohostix');
        const result = await CaseStudy.deleteOne({ slug: 'client-support' });
        console.log(`Deleted fake case study:`, result.deletedCount);
        
        // Also let's update Pype CRM stats if it exists
        const pype = await CaseStudy.findOne({ slug: 'pype-crm' });
        if (pype) {
            pype.description = "An early-stage WhatsApp and call-based CRM tailored for education institutes, featuring automated pipelines and instant messaging.";
            pype.industry = "Education Technology";
            pype.problem = "Inefficient lead tracking and slow response times on WhatsApp.";
            pype.solution = "Developed a custom CRM with automated WhatsApp workflows, call integration, and real-time tracking.";
            pype.stats = [
                { label: "Institutes Onboarded", value: "225+" },
                { label: "WhatsApp Reply Time", value: "<5min" },
                { label: "User Adoption", value: "High" }
            ];
            await pype.save();
            console.log("Updated Pype CRM case study in DB.");
        }

        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}

clearFakeCaseStudy();
