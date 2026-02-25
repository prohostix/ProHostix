import Blog from '../models/Blog.js';
import Service from '../models/Service.js';
import CaseStudy from '../models/CaseStudy.js';
import Solution from '../models/Solution.js';
import Leadership from '../models/Leadership.js';
import OpenRole from '../models/OpenRole.js';

// @desc    Search across multiple collections
// @route   GET /api/search
// @access  Public
export const search = async (req, res) => {
    const q = req.query.q;

    if (!q) {
        return res.status(400).json({ message: 'Search query is required' });
    }

    const regex = { $regex: q, $options: 'i' };

    try {
        const blogs = await Blog.find({
            $or: [
                { title: regex },
                { content: regex },
                { excerpt: regex },
                { category: regex }
            ]
        }).select('title slice excerpt slug image category');

        const services = await Service.find({
            $or: [
                { title: regex },
                { description: regex },
                { category: regex }
            ]
        }).select('title icon description');

        const caseStudies = await CaseStudy.find({
            $or: [
                { title: regex },
                { description: regex },
                { industry: regex }
            ]
        }).select('title image industry slug');

        const solutions = await Solution.find({
            $or: [
                { title: regex },
                { description: regex },
                { category: regex }
            ]
        }).select('title image description category slug');

        const team = await Leadership.find({
            $or: [
                { name: regex },
                { role: regex },
                { specialization: regex }
            ]
        }).select('name role avatar');

        const jobs = await OpenRole.find({
            $or: [
                { title: regex },
                { location: regex },
                { description: regex }
            ],
            isActive: true
        }).select('title location type');

        res.json({
            blogs,
            services,
            caseStudies,
            solutions,
            team,
            jobs
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
