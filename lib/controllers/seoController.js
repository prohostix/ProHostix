
import Blog from '../models/Blog.js';
import CaseStudy from '../models/CaseStudy.js';
import Service from '../models/Service.js';
import Solution from '../models/Solution.js';
import Settings from '../models/Settings.js';
import SeoMetadata from '../models/SeoMetadata.js';

/**
 * Generates sitemap.xml
 */
export const getSitemap = async (req, res) => {
    try {
        const settings = await Settings.findOne().lean();
        const siteUrl = (settings?.siteUrl || 'https://www.prohostix.com').replace(/\/$/, '');

        const today = new Date().toISOString().split('T')[0];

        // Static routes with individual priorities
        const staticRoutes = [
            { path: '',              changefreq: 'daily',   priority: '1.0' },
            { path: '/services',     changefreq: 'weekly',  priority: '0.9' },
            { path: '/solutions',    changefreq: 'weekly',  priority: '0.9' },
            { path: '/case-studies', changefreq: 'weekly',  priority: '0.8' },
            { path: '/company',      changefreq: 'monthly', priority: '0.8' },
            { path: '/blog',         changefreq: 'daily',   priority: '0.8' },
            { path: '/careers',      changefreq: 'weekly',  priority: '0.7' },
            { path: '/lets-talk',    changefreq: 'monthly', priority: '0.7' },
        ];

        // Dynamic routes
        const [blogs, caseStudies, services, solutions] = await Promise.all([
            Blog.find({ published: true }, 'slug updatedAt').lean(),
            CaseStudy.find({}, 'slug updatedAt').lean(),
            Service.find({}, 'slug updatedAt').lean(),
            Solution.find({}, 'slug updatedAt').lean()
        ]);

        let sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n';
        sitemap += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n';
        sitemap += '        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"\n';
        sitemap += '        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9\n';
        sitemap += '        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">\n';

        // Static routes
        staticRoutes.forEach(({ path, changefreq, priority }) => {
            sitemap += '  <url>\n';
            sitemap += `    <loc>${siteUrl}${path}</loc>\n`;
            sitemap += `    <lastmod>${today}</lastmod>\n`;
            sitemap += `    <changefreq>${changefreq}</changefreq>\n`;
            sitemap += `    <priority>${priority}</priority>\n`;
            sitemap += '  </url>\n';
        });

        // Service pages (high priority — core business)
        services.forEach(service => {
            sitemap += '  <url>\n';
            sitemap += `    <loc>${siteUrl}/services/${service.slug}</loc>\n`;
            sitemap += `    <lastmod>${service.updatedAt ? service.updatedAt.toISOString().split('T')[0] : today}</lastmod>\n`;
            sitemap += '    <changefreq>monthly</changefreq>\n';
            sitemap += '    <priority>0.8</priority>\n';
            sitemap += '  </url>\n';
        });

        // Solution pages
        solutions.forEach(solution => {
            sitemap += '  <url>\n';
            sitemap += `    <loc>${siteUrl}/solutions/${solution.slug}</loc>\n`;
            sitemap += `    <lastmod>${solution.updatedAt ? solution.updatedAt.toISOString().split('T')[0] : today}</lastmod>\n`;
            sitemap += '    <changefreq>monthly</changefreq>\n';
            sitemap += '    <priority>0.8</priority>\n';
            sitemap += '  </url>\n';
        });

        // Case study pages
        caseStudies.forEach(cs => {
            sitemap += '  <url>\n';
            sitemap += `    <loc>${siteUrl}/case-studies/${cs.slug}</loc>\n`;
            sitemap += `    <lastmod>${cs.updatedAt ? cs.updatedAt.toISOString().split('T')[0] : today}</lastmod>\n`;
            sitemap += '    <changefreq>monthly</changefreq>\n';
            sitemap += '    <priority>0.7</priority>\n';
            sitemap += '  </url>\n';
        });

        // Blog posts
        blogs.forEach(blog => {
            sitemap += '  <url>\n';
            sitemap += `    <loc>${siteUrl}/blog/${blog.slug}</loc>\n`;
            sitemap += `    <lastmod>${blog.updatedAt ? blog.updatedAt.toISOString().split('T')[0] : today}</lastmod>\n`;
            sitemap += '    <changefreq>monthly</changefreq>\n';
            sitemap += '    <priority>0.6</priority>\n';
            sitemap += '  </url>\n';
        });

        sitemap += '</urlset>';

        res.setHeader('Content-Type', 'application/xml');
        res.setHeader('Cache-Control', 'public, max-age=3600, s-maxage=3600');
        res.status(200).send(sitemap);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * Generates robots.txt
 */
export const getRobots = async (req, res) => {
    try {
        const settings = await Settings.findOne().lean();
        const siteUrl = (settings?.siteUrl || 'https://www.prohostix.com').replace(/\/$/, '');

        let robots = '# ProHostix robots.txt\n';
        robots += '# https://www.prohostix.com\n\n';
        robots += 'User-agent: *\n';
        robots += 'Allow: /\n';
        robots += 'Disallow: /admin/\n';
        robots += 'Disallow: /api/\n';
        robots += 'Disallow: /_next/\n\n';
        robots += '# Sitemaps\n';
        robots += `Sitemap: ${siteUrl}/api/seo/sitemap.xml\n`;

        res.setHeader('Content-Type', 'text/plain');
        res.setHeader('Cache-Control', 'public, max-age=86400');
        res.status(200).send(robots);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * Get all SEO Metadata
 */
export const getAllSeoMetadata = async (req, res) => {
    try {
        const metadata = await SeoMetadata.find().sort({ page: 1 });
        res.json(metadata);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * Get SEO Metadata for specific page
 */
export const getSeoMetadataByPage = async (req, res) => {
    try {
        const { page } = req.params;
        const metadata = await SeoMetadata.findOne({ page });

        if (!metadata) {
            return res.status(404).json({ message: 'SEO Metadata not found for this page' });
        }

        res.json(metadata);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * Create or Update SEO Metadata
 */
export const updateSeoMetadata = async (req, res) => {
    try {
        const { page } = req.params;
        const { title, description, keywords, ogImage, robots, canonicalUrl } = req.body;

        const metadata = await SeoMetadata.findOneAndUpdate(
            { page },
            {
                page,
                title,
                description,
                keywords,
                ogImage,
                robots,
                canonicalUrl
            },
            { new: true, upsert: true, runValidators: true }
        );

        res.json(metadata);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

/**
 * Delete SEO Metadata
 */
export const deleteSeoMetadata = async (req, res) => {
    try {
        const { page } = req.params;
        const metadata = await SeoMetadata.findOneAndDelete({ page });

        if (!metadata) {
            return res.status(404).json({ message: 'SEO Metadata not found' });
        }

        res.json({ message: 'SEO Metadata removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * Fetch all available routes (static and dynamic) for SEO selection
 */
export const getAvailableRoutes = async (req, res) => {
    try {
        const staticRoutes = [
            'home',
            'company',
            'services',
            'solutions',
            'case-studies',
            'blog',
            'careers',
            'lets-talk'
        ];

        const [blogs, bCaseStudies, bServices, bSolutions] = await Promise.all([
            Blog.find({ published: true }).select('slug title'),
            CaseStudy.find().select('slug title'),
            Service.find().select('slug title'),
            Solution.find().select('slug title')
        ]);

        const routes = [
            ...staticRoutes.map(route => ({
                type: 'static',
                value: route,
                label: route === 'home' ? 'Home Page' : route.split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' ')
            })),
            ...bServices.map(s => ({ type: 'service', value: `services/${s.slug}`, label: `Service: ${s.title}` })),
            ...bSolutions.map(s => ({ type: 'solution', value: `solutions/${s.slug}`, label: `Solution: ${s.title}` })),
            ...bCaseStudies.map(cs => ({ type: 'case-study', value: `case-studies/${cs.slug}`, label: `Case Study: ${cs.title}` })),
            ...blogs.map(b => ({ type: 'blog', value: `blog/${b.slug}`, label: `Blog: ${b.title}` }))
        ];

        res.json(routes);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};
