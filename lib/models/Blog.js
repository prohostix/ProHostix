import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema({
    title: { type: String, required: true, minlength: 5, maxlength: 100 },
    content: { type: String, required: true, minlength: 50 },
    excerpt: { type: String, minlength: 20, maxlength: 200 },
    readTime: { type: String },
    category: { type: String, required: true },
    slug: { type: String, unique: true, required: true, index: true },
    image: { type: String }, // URL or path to image
    published: { type: Boolean, default: false, index: true },
    seo: {
        title: String,
        description: String,
        keywords: [String]
    }
}, { timestamps: true });

blogSchema.index({ title: 'text', content: 'text', excerpt: 'text', category: 'text' });

const Blog = mongoose.models.Blog || mongoose.model('Blog', blogSchema);
export default Blog;
