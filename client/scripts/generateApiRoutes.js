const fs = require('fs');
const path = require('path');

const routes = [
    // Users
    { path: 'api/users/register', method: 'POST', controller: 'registerUser', module: 'userController', guard: null },
    { path: 'api/users/login', method: 'POST', controller: 'loginUser', module: 'userController', guard: null },
    { path: 'api/users/logout', method: 'POST', controller: 'logoutUser', module: 'userController', guard: null },
    { path: 'api/users/refresh', method: 'POST', controller: 'refreshAccessToken', module: 'userController', guard: null },
    { path: 'api/users/me', method: 'GET', controller: 'getMe', module: 'userController', guard: 'protect' },
    { path: 'api/users/profile', method: 'GET', controller: 'getMe', module: 'userController', guard: 'protect' },
    { path: 'api/users/profile', method: 'PUT', controller: 'updateUserProfile', module: 'userController', guard: 'protect' },
    { path: 'api/users', method: 'GET', controller: 'getUsers', module: 'userController', guard: 'protect' },
    { path: 'api/users/[id]', method: 'PUT', controller: 'updateUser', module: 'userController', guard: 'protect' },
    { path: 'api/users/[id]', method: 'DELETE', controller: 'deleteUser', module: 'userController', guard: 'protect' },

    // Enquiries
    { path: 'api/enquiries', method: 'POST', controller: 'createEnquiry', module: 'enquiryController', guard: null },
    { path: 'api/enquiries', method: 'GET', controller: 'getEnquiries', module: 'enquiryController', guard: 'protect' },
    { path: 'api/enquiries/careers', method: 'POST', controller: 'createJobApplication', module: 'enquiryController', guard: null }, // multer fallback
    { path: 'api/enquiries/careers', method: 'GET', controller: 'getJobApplications', module: 'enquiryController', guard: 'protect' },
    { path: 'api/enquiries/subscribe', method: 'POST', controller: 'subscribe', module: 'enquiryController', guard: null },
    { path: 'api/enquiries/subscribe', method: 'GET', controller: 'getSubscribers', module: 'enquiryController', guard: 'protect' },
    { path: 'api/enquiries/mark-all-read', method: 'PUT', controller: 'markAllEnquiriesRead', module: 'enquiryController', guard: 'protect' },
    { path: 'api/enquiries/[id]', method: 'DELETE', controller: 'deleteEnquiry', module: 'enquiryController', guard: 'protect' },
    { path: 'api/enquiries/careers/[id]', method: 'DELETE', controller: 'deleteJobApplication', module: 'enquiryController', guard: 'protect' },
    { path: 'api/enquiries/subscribe/[id]', method: 'DELETE', controller: 'deleteSubscriber', module: 'enquiryController', guard: 'protect' },

    // Blogs
    { path: 'api/blogs', method: 'GET', controller: 'getBlogs', module: 'blogController', guard: null },
    { path: 'api/blogs', method: 'POST', controller: 'createBlog', module: 'blogController', guard: 'protect, admin' },
    { path: 'api/blogs/[id]', method: 'GET', controller: 'getBlogById', module: 'blogController', guard: null },
    { path: 'api/blogs/[id]', method: 'PUT', controller: 'updateBlog', module: 'blogController', guard: 'protect, admin' },
    { path: 'api/blogs/[id]', method: 'DELETE', controller: 'deleteBlog', module: 'blogController', guard: 'protect, admin' },

    // Services
    { path: 'api/services', method: 'GET', controller: 'getServices', module: 'cmsController', guard: null },
    { path: 'api/services', method: 'POST', controller: 'createService', module: 'cmsController', guard: 'protect' },
    { path: 'api/services/[id]', method: 'PUT', controller: 'updateService', module: 'cmsController', guard: 'protect' },
    { path: 'api/services/[id]', method: 'DELETE', controller: 'deleteService', module: 'cmsController', guard: 'protect' },

    // Solutions
    { path: 'api/solutions', method: 'GET', controller: 'getSolutions', module: 'cmsController', guard: null },
    { path: 'api/solutions', method: 'POST', controller: 'createSolution', module: 'cmsController', guard: 'protect' },
    { path: 'api/solutions/[id]', method: 'PUT', controller: 'updateSolution', module: 'cmsController', guard: 'protect' },
    { path: 'api/solutions/[id]', method: 'DELETE', controller: 'deleteSolution', module: 'cmsController', guard: 'protect' },

    // Case Studies
    { path: 'api/case-studies', method: 'GET', controller: 'getCaseStudies', module: 'cmsController', guard: null },
    { path: 'api/case-studies', method: 'POST', controller: 'createCaseStudy', module: 'cmsController', guard: 'protect' },
    { path: 'api/case-studies/[id]', method: 'PUT', controller: 'updateCaseStudy', module: 'cmsController', guard: 'protect' },
    { path: 'api/case-studies/[id]', method: 'DELETE', controller: 'deleteCaseStudy', module: 'cmsController', guard: 'protect' },

    // Leadership
    { path: 'api/leadership', method: 'GET', controller: 'getLeadership', module: 'cmsController', guard: null },
    { path: 'api/leadership', method: 'POST', controller: 'createLeadership', module: 'cmsController', guard: 'protect' },
    { path: 'api/leadership/[id]', method: 'PUT', controller: 'updateLeadership', module: 'cmsController', guard: 'protect' },
    { path: 'api/leadership/[id]', method: 'DELETE', controller: 'deleteLeadership', module: 'cmsController', guard: 'protect' },

    // Hero Images
    { path: 'api/hero-images', method: 'GET', controller: 'getHeroImages', module: 'cmsController', guard: null },
    { path: 'api/hero-images', method: 'POST', controller: 'createHeroImage', module: 'cmsController', guard: 'protect' },
    { path: 'api/hero-images/[id]', method: 'PUT', controller: 'updateHeroImage', module: 'cmsController', guard: 'protect' },
    { path: 'api/hero-images/[id]', method: 'DELETE', controller: 'deleteHeroImage', module: 'cmsController', guard: 'protect' },

    // Open Roles
    { path: 'api/open-roles', method: 'GET', controller: 'getOpenRoles', module: 'cmsController', guard: null },
    { path: 'api/open-roles', method: 'POST', controller: 'createOpenRole', module: 'cmsController', guard: 'protect' },
    { path: 'api/open-roles/[id]', method: 'PUT', controller: 'updateOpenRole', module: 'cmsController', guard: 'protect' },
    { path: 'api/open-roles/[id]', method: 'DELETE', controller: 'deleteOpenRole', module: 'cmsController', guard: 'protect' },

    // Page Content
    { path: 'api/content', method: 'GET', controller: 'getPageContent', module: 'cmsController', guard: null },
    { path: 'api/content', method: 'POST', controller: 'createPageContent', module: 'cmsController', guard: 'protect' },
    { path: 'api/content/all', method: 'GET', controller: 'getAllPageContent', module: 'cmsController', guard: null },
    { path: 'api/content/[id]', method: 'PUT', controller: 'updatePageContent', module: 'cmsController', guard: 'protect' },
    { path: 'api/content/[id]', method: 'DELETE', controller: 'deletePageContent', module: 'cmsController', guard: 'protect' },

    // Navigation
    { path: 'api/navigation', method: 'GET', controller: 'getNavigation', module: 'cmsController', guard: null },
    { path: 'api/navigation', method: 'POST', controller: 'createNavigation', module: 'cmsController', guard: 'protect' },
    { path: 'api/navigation/[id]', method: 'PUT', controller: 'updateNavigation', module: 'cmsController', guard: 'protect' },
    { path: 'api/navigation/[id]', method: 'DELETE', controller: 'deleteNavigation', module: 'cmsController', guard: 'protect' },

    // Settings
    { path: 'api/settings', method: 'GET', controller: 'getSettings', module: 'cmsController', guard: null },
    { path: 'api/settings', method: 'PUT', controller: 'updateSettings', module: 'cmsController', guard: 'protect' },

    // Social Links
    { path: 'api/social-links', method: 'GET', controller: 'getSocialLinks', module: 'cmsController', guard: null },
    { path: 'api/social-links', method: 'POST', controller: 'createSocialLink', module: 'cmsController', guard: 'protect' },
    { path: 'api/social-links/[id]', method: 'PUT', controller: 'updateSocialLink', module: 'cmsController', guard: 'protect' },
    { path: 'api/social-links/[id]', method: 'DELETE', controller: 'deleteSocialLink', module: 'cmsController', guard: 'protect' },

    // Upload
    { path: 'api/upload/blog-image', method: 'POST', controller: 'uploadBlogImage', module: 'uploadController', guard: null },
    { path: 'api/upload/service-image', method: 'POST', controller: 'uploadServiceImage', module: 'uploadController', guard: null },
    { path: 'api/upload/solution-image', method: 'POST', controller: 'uploadSolutionImage', module: 'uploadController', guard: null },
    { path: 'api/upload/leadership-image', method: 'POST', controller: 'uploadLeadershipImage', module: 'uploadController', guard: null },
    { path: 'api/upload/profile-image', method: 'POST', controller: 'uploadProfileImage', module: 'uploadController', guard: null },

    // Search
    { path: 'api/search', method: 'GET', controller: 'search', module: 'searchController', guard: null },

    // SEO
    { path: 'api/seo/sitemap.xml', method: 'GET', controller: 'getSitemap', module: 'seoController', guard: null },
    { path: 'api/seo/robots.txt', method: 'GET', controller: 'getRobots', module: 'seoController', guard: null },
    { path: 'api/seo/metadata/[page]', method: 'GET', controller: 'getSeoMetadataByPage', module: 'seoController', guard: null },
    { path: 'api/seo/metadata', method: 'GET', controller: 'getAllSeoMetadata', module: 'seoController', guard: 'protect, admin' },
    { path: 'api/seo/routes', method: 'GET', controller: 'getAvailableRoutes', module: 'seoController', guard: 'protect, admin' },
    { path: 'api/seo/metadata/[page]', method: 'PUT', controller: 'updateSeoMetadata', module: 'seoController', guard: 'protect, admin' },
    { path: 'api/seo/metadata/[page]', method: 'DELETE', controller: 'deleteSeoMetadata', module: 'seoController', guard: 'protect, admin' }
];

const generatedPaths = {};

routes.forEach(route => {
    let folderPath = path.join(__dirname, '..', 'app', route.path);
    if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath, { recursive: true });
    }

    if (!generatedPaths[route.path]) {
        generatedPaths[route.path] = [];
    }
    generatedPaths[route.path].push(route);
});

for (const [routePath, routeDef] of Object.entries(generatedPaths)) {
    const filePath = path.join(__dirname, '..', 'app', routePath, 'route.ts');

    const controllers = [...new Set(routeDef.map(r => r.controller))];
    const modules = [...new Set(routeDef.map(r => r.module))];
    const guards = [...new Set(routeDef.filter(r => r.guard).map(r => r.guard.split(',').map(s => s.trim())).flat())];

    const needsAuthMiddleware = guards.length > 0;

    let content = `import { NextRequest } from 'next/server';\n`;
    content += `import { withMiddleware, runMiddleware } from '@/lib/api-handler';\n`;

    if (needsAuthMiddleware) {
        content += `import { ${guards.join(', ')} } from '@/lib/middleware/authMiddleware';\n`;
    }

    modules.forEach(mod => {
        const modControllers = routeDef.filter(r => r.module === mod).map(r => r.controller);
        content += `import { ${modControllers.join(', ')} } from '@/lib/controllers/${mod}';\n`;
    });

    content += `\n`;

    routeDef.forEach(route => {
        content += `export async function ${route.method}(request: NextRequest, context: any) {\n`;
        if (route.guard) {
            const guardArray = route.guard.split(',').map(s => s.trim());
            content += `    return withMiddleware(request, context, [${guardArray.join(', ')}], ${route.controller});\n`;
        } else {
            content += `    return runMiddleware(request, context, ${route.controller});\n`;
        }
        content += `}\n\n`;
    });

    fs.writeFileSync(filePath, content, 'utf8');
}

console.log('API routes generated mappings 1:1 correctly!');
