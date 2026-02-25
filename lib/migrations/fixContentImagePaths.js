import mongoose from "mongoose";
import dotenv from "dotenv";
import Blog from "../models/Blog.js";

dotenv.config();

const normalizeContentImages = (content) => {
    if (!content) return content;

    return content.replace(
        /(<img[^>]+src=["'])(?!https?:\/\/|\/uploads\/)([^"']+)/gi,
        `$1/uploads/$2`
    );
};

const runMigration = async () => {
    try {
        console.log("🔌 Connecting to MongoDB...");
        await mongoose.connect(process.env.MONGO_URI);
        console.log("✅ Connected");

        const blogs = await Blog.find({ content: { $regex: /<img/i } });
        console.log(`📄 Found ${blogs.length} blogs with <img> tags`);

        let updatedCount = 0;

        for (const blog of blogs) {
            const original = blog.content;
            const normalized = normalizeContentImages(original);

            if (original !== normalized) {
                blog.content = normalized;
                await blog.save();
                updatedCount++;
                console.log(`✔ Fixed blog ${blog._id}`);
            }
        }

        console.log(`🎉 Migration complete. Updated ${updatedCount} blogs.`);
        process.exit(0);
    } catch (err) {
        console.error("❌ Migration failed:", err);
        process.exit(1);
    }
};

runMigration();
