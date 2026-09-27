import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Blog from '@/lib/models/Blog';
import CaseStudy from '@/lib/models/CaseStudy';
import Service from '@/lib/models/Service';
import Solution from '@/lib/models/Solution';

export async function GET() {
    try {
        await dbConnect();
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
            Blog.find({ published: true }).select('slug title').lean(),
            CaseStudy.find().select('slug title').lean(),
            Service.find().select('slug title').lean(),
            Solution.find().select('slug title').lean()
        ]);

        const routes = [
            ...staticRoutes.map(route => ({
                type: 'static',
                value: route,
                label: route === 'home' ? 'Home Page' : route.split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' ')
            })),
            ...bServices.map((s: any) => ({ type: 'service', value: `services/${s.slug}`, label: `Service: ${s.title}` })),
            ...bSolutions.map((s: any) => ({ type: 'solution', value: `solutions/${s.slug}`, label: `Solution: ${s.title}` })),
            ...bCaseStudies.map((cs: any) => ({ type: 'case-study', value: `case-studies/${cs.slug}`, label: `Case Study: ${cs.title}` })),
            ...blogs.map((b: any) => ({ type: 'blog', value: `blog/${b.slug}`, label: `Blog: ${b.title}` }))
        ];

        return NextResponse.json(routes);
    } catch (error: any) {
        console.error(error);
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
