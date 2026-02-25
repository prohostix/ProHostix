import fs from "fs";
import path from "path";
import Blog from "../models/Blog.js";

/**
 * Safely delete image only if NOT used by any other blog
 * Strictly only for local /uploads paths
 */
const deleteImageIfUnused = async (imagePath, blogId) => {
    if (!imagePath || !imagePath.startsWith("/uploads/")) return;

    try {
        const isUsedElsewhere = await Blog.exists({
            _id: { $ne: blogId },
            image: imagePath
        });

        if (isUsedElsewhere) return;

        const fullPath = path.join(process.cwd(), imagePath);
        if (fs.existsSync(fullPath)) {
            fs.unlinkSync(fullPath);
        }
    } catch (err) {
        console.error("Cleanup error:", err);
    }
};

/**
 * Get all blogs
 */
export const getBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find().sort({ createdAt: -1 });
        res.json(blogs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * Get single blog
 */
export const getBlogById = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);
        if (!blog) {
            return res.status(404).json({ message: "Blog not found" });
        }
        res.json(blog);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * Create blog
 */
import { normalizeContentImages } from "../utils/normalizeContentImages.js";
import { normalizeHeroImage } from "../utils/normalizeHeroImage.js";

export const createBlog = async (req, res) => {
    try {
        const payload = {
            ...req.body,
            image: normalizeHeroImage(req.body.image),
            content: normalizeContentImages(req.body.content),
        };

        const blog = await Blog.create(payload);
        res.status(201).json(blog);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};


/**
 * Update blog (safe image replacement)
 */
export const updateBlog = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);

        if (!blog) {
            return res.status(404).json({ message: "Blog not found" });
        }

        const newImage = req.body.image
            ? normalizeHeroImage(req.body.image)
            : blog.image;

        if (
            newImage &&
            blog.image &&
            newImage !== blog.image
        ) {
            await deleteImageIfUnused(blog.image, blog._id);
        }

        blog.title = req.body.title ?? blog.title;
        blog.content = req.body.content
            ? normalizeContentImages(req.body.content)
            : blog.content;

        blog.category = req.body.category ?? blog.category;
        blog.excerpt = req.body.excerpt ?? blog.excerpt;
        blog.readTime = req.body.readTime ?? blog.readTime;
        blog.published = req.body.published ?? blog.published;
        blog.slug = req.body.slug ?? blog.slug;

        blog.image = newImage;

        if (req.body.seo) {
            blog.seo = {
                title: req.body.seo.title ?? blog.seo?.title,
                description: req.body.seo.description ?? blog.seo?.description,
                keywords: req.body.seo.keywords ?? blog.seo?.keywords
            };
        }

        const updatedBlog = await blog.save();
        res.json(updatedBlog);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};


/**
 * Delete blog (safe image cleanup)
 */
export const deleteBlog = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);

        if (!blog) {
            return res.status(404).json({ message: "Blog not found" });
        }

        await deleteImageIfUnused(blog.image, blog._id);
        await blog.deleteOne();

        res.json({ message: "Blog and unused image removed" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
