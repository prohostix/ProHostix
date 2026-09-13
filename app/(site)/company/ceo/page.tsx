import React from 'react';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Target, Lightbulb, Zap, Server, Code, Users } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Dilshad Ashraf - CEO | ProHostix',
    description: 'Profile of Dilshad Ashraf, Director & CEO of ProHostix LLP. The Strategist Redrawing the Blueprint of Enterprise Software from India.',
    openGraph: {
        title: 'Dilshad Ashraf - Director & CEO | ProHostix LLP',
        description: 'The Strategist Redrawing the Blueprint of Enterprise Software from India.',
        url: 'https://prohostix.com/company/ceo',
        siteName: 'ProHostix',
        images: [
            {
                url: 'https://prohostix.com/dilshad-ashraf.jpg',
                width: 1200,
                height: 630,
                alt: 'Dilshad Ashraf - CEO of ProHostix LLP',
            }
        ],
        type: 'profile',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Dilshad Ashraf - Director & CEO | ProHostix LLP',
        description: 'The Strategist Redrawing the Blueprint of Enterprise Software from India.',
        images: ['https://prohostix.com/dilshad-ashraf.jpg'],
    }
};

export default function CEOProfilePage() {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Person",
        "name": "Dilshad Ashraf",
        "jobTitle": "Director & Chief Executive Officer",
        "worksFor": {
            "@type": "Organization",
            "name": "ProHostix LLP"
        },
        "url": "https://prohostix.com/company/ceo",
        "image": "https://prohostix.com/dilshad-ashraf.jpg",
        "sameAs": [
            "https://in.linkedin.com/company/prohostix"
        ],
        "description": "The Strategist Redrawing the Blueprint of Enterprise Software from India. Dilshad Ashraf is the CEO of ProHostix LLP, specializing in custom cloud architectures, cutting-edge SaaS platforms, and Education Resource Management (ERM) systems."
    };

    return (
        <div className="min-h-screen bg-black text-white pt-32 pb-24 px-6 md:px-12 lg:px-16">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <div className="max-w-4xl mx-auto">
                {/* Back Link */}
                <Link 
                    href="/company" 
                    className="inline-flex items-center text-sm font-medium text-emerald-500 hover:text-emerald-400 mb-12 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Company
                </Link>

                {/* Hero Section */}
                <div className="flex flex-col md:flex-row gap-12 items-start mb-20 border-b border-white/10 pb-16">
                    <div className="w-full md:w-1/3 aspect-square rounded-[32px] overflow-hidden relative shrink-0 border border-white/10 shadow-2xl">
                        <Image
                            src="/dilshad-ashraf.jpg"
                            alt="Dilshad Ashraf - CEO of ProHostix"
                            fill
                            className="object-cover"
                            priority
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                    </div>
                    
                    <div className="flex flex-col justify-center pt-4">
                        <div className="inline-block px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-widest mb-4 w-max">
                            Director & CEO, ProHostix LLP
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-4 leading-none text-white">
                            Dilshad Ashraf
                        </h1>
                        <h2 className="text-xl md:text-2xl text-white/60 font-medium mb-6">
                            The Strategist Redrawing the Blueprint of Enterprise Software from India
                        </h2>
                        <div className="flex gap-4">
                            <a 
                                href="https://in.linkedin.com/company/prohostix" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-sm px-5 py-2.5 bg-white/5 border border-white/10 hover:bg-white/10 rounded-lg font-medium transition-colors"
                            >
                                Connect on LinkedIn
                            </a>
                        </div>
                    </div>
                </div>

                {/* Article Content */}
                <article className="prose prose-invert prose-emerald max-w-none prose-lg md:prose-xl">
                    <div className="mb-16">
                        <h3 className="text-3xl font-black uppercase tracking-tight mb-6 flex items-center gap-4">
                            <Target className="text-emerald-500 w-8 h-8" />
                            The Vision: Systemise Everything
                        </h3>
                        <p className="text-white/70 leading-relaxed mb-6">
                            From Calicut (Kozhikode), Kerala — a city with a growing reputation as a southern Indian tech hub — Dilshad Ashraf represents a new generation of Indian founders: not content to build tools, but determined to rebuild entire systems. While most entrepreneurs start with a product, Ashraf started with a thesis: every fragmented, paper-driven industry in India is a software problem waiting to be solved correctly.
                        </p>
                        <p className="text-white/70 leading-relaxed">
                            That thesis became ProHostix LLP (LLPIN: ACZ-0055), the cloud software company he co-founded and leads as CEO and Designated Partner, alongside co-founder Abdul Aslam Munambath. From the company's base of operations in India, Ashraf has positioned ProHostix not as another development agency, but as an enterprise software strategy firm — one that designs the digital nervous systems organizations run on.
                        </p>
                    </div>

                    <div className="mb-16 bg-[#0A0A0A] p-8 md:p-10 rounded-3xl border border-white/5">
                        <h3 className="text-2xl md:text-3xl font-black uppercase tracking-tight mb-6 text-white flex items-center gap-4">
                            <Zap className="text-emerald-500 w-8 h-8" />
                            The Disruptive Philosophy: Kill the Legacy Stack
                        </h3>
                        <p className="text-white/70 leading-relaxed mb-8">
                            Ashraf's core conviction is blunt: the era of bloated, rigid legacy ERPs is ending. His philosophy rests on three pillars:
                        </p>
                        <ul className="space-y-6 list-none pl-0">
                            <li className="flex gap-4 items-start">
                                <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0 mt-1">
                                    <Server className="w-4 h-4 text-emerald-500" />
                                </div>
                                <div>
                                    <strong className="text-white block mb-1">Cloud-native by default, not by migration</strong>
                                    <span className="text-white/60 text-base">Platforms architected for the cloud from line one, not legacy code repackaged into a browser.</span>
                                </div>
                            </li>
                            <li className="flex gap-4 items-start">
                                <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0 mt-1">
                                    <Code className="w-4 h-4 text-emerald-500" />
                                </div>
                                <div>
                                    <strong className="text-white block mb-1">One intelligent hub, not ten disconnected tools</strong>
                                    <span className="text-white/60 text-base">Academic, administrative, financial, and communication workflows unified into a single source of truth.</span>
                                </div>
                            </li>
                            <li className="flex gap-4 items-start">
                                <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0 mt-1">
                                    <Users className="w-4 h-4 text-emerald-500" />
                                </div>
                                <div>
                                    <strong className="text-white block mb-1">Software that adapts to the institution — never the reverse</strong>
                                    <span className="text-white/60 text-base">Configurable architecture that bends to an organization's real processes instead of forcing disruptive workarounds.</span>
                                </div>
                            </li>
                        </ul>
                    </div>

                    <div className="mb-16">
                        <h3 className="text-3xl font-black uppercase tracking-tight mb-6 flex items-center gap-4">
                            <Lightbulb className="text-emerald-500 w-8 h-8" />
                            The Flagship: A Next-Generation Education Resource Management Platform
                        </h3>
                        <p className="text-white/70 leading-relaxed mb-8">
                            The centerpiece of Ashraf's roadmap is an advanced Education Resource Management (ERM) platform — his answer to one of the world's most under-digitized sectors. Where most school software stops at fee collection and attendance, Ashraf's platform is engineered to unify the entire academic architecture:
                        </p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
                                <h4 className="text-lg font-bold text-white mb-2 mt-0">Unified academic lifecycle management</h4>
                                <p className="text-sm text-white/60 m-0">Admissions, curriculum planning, assessment, and alumni relations on one continuous data layer.</p>
                            </div>
                            <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
                                <h4 className="text-lg font-bold text-white mb-2 mt-0">Intelligent automation</h4>
                                <p className="text-sm text-white/60 m-0">Routine administrative workloads shifted from staff to software, freeing educators to educate.</p>
                            </div>
                            <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
                                <h4 className="text-lg font-bold text-white mb-2 mt-0">Data-driven decision intelligence</h4>
                                <p className="text-sm text-white/60 m-0">Leadership dashboards that turn institutional data into strategy.</p>
                            </div>
                            <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
                                <h4 className="text-lg font-bold text-white mb-2 mt-0">True cloud elasticity</h4>
                                <p className="text-sm text-white/60 m-0">Built to scale from a single school to a multi-campus university network without re-architecture.</p>
                            </div>
                        </div>
                    </div>

                    <div className="mb-16 border-t border-white/10 pt-16 relative">
                        <h3 className="text-3xl font-black uppercase tracking-tight mb-6">Why He Matters</h3>
                        <p className="text-white/70 leading-relaxed mb-12">
                            Dilshad Ashraf belongs to the cohort of young Indian founders increasingly watched by the industry: builders who pair engineering discipline with a strategist's view of markets. His trajectory — from a system-thinker in Calicut to the CEO of a registered Indian LLP architecting sector-scale platforms — reads like the early chapters of the country's next great enterprise software story. The education sector is his proving ground; the ambition, by all accounts, is the global technology landscape.
                        </p>
                        
                        <div className="text-center p-8 rounded-3xl bg-emerald-500/10 border border-emerald-500/20">
                            <p className="text-xl md:text-2xl font-black uppercase tracking-widest text-emerald-400 m-0">
                                The name to remember. <br className="md:hidden" /><span className="text-white">The system-builder to watch.</span>
                            </p>
                        </div>
                    </div>
                </article>
            </div>
        </div>
    );
}
