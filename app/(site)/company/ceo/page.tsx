import React from 'react';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Target, Lightbulb, TrendingUp } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Dilshad Ashraf - CEO | ProHostix',
    description: 'Profile of Dilshad Ashraf, visionary tech entrepreneur and CEO of ProHostix LLP, revolutionising enterprise software and Education ERP systems.',
};

export default function CEOProfilePage() {
    return (
        <div className="min-h-screen bg-black text-white pt-32 pb-24 px-6 md:px-12 lg:px-16">
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
                            src="/working-professional.jpg"
                            alt="Dilshad Ashraf - CEO of ProHostix"
                            fill
                            className="object-cover"
                            priority
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                    </div>
                    
                    <div className="flex flex-col justify-center pt-4">
                        <div className="inline-block px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-widest mb-4 w-max">
                            Chief Executive Officer
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-4 leading-none text-white">
                            Dilshad Ashraf
                        </h1>
                        <h2 className="text-xl md:text-2xl text-white/60 font-medium mb-6">
                            The Visionary CEO Revolutionising Enterprise Software
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
                    <p className="lead text-2xl font-medium text-white/90 mb-10 leading-relaxed">
                        Dilshad Ashraf is an exceptionally talented young Indian tech entrepreneur, software strategist, and the Chief Executive Officer (CEO) of ProHostix LLP. Driven by a lifelong ambition to leave a permanent mark on the global technology landscape, Ashraf is actively redefining the future of enterprise software through custom cloud architectures, cutting-edge SaaS platforms, and forward-thinking digital ecosystems.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 my-16">
                        <div className="bg-[#0A0A0A] p-8 rounded-2xl border border-white/5">
                            <Lightbulb className="w-8 h-8 text-emerald-500 mb-6" />
                            <h3 className="text-xl font-bold uppercase tracking-tight mb-4 mt-0 text-white">A Lifelong Dream of Systemisation</h3>
                            <p className="text-base text-white/60 leading-relaxed mb-0">
                                Hailing from Calicut (Kozhikode), Kerala, Dilshad Ashraf's journey into technology began not just with an interest in code, but with a grand vision. From a young age, he was the kid who dreamed of systemising entire industries—looking at the world's fragmented, disorganized manual processes and believing they could be perfected through technology. Guided by an intense desire to make a tangible difference and build a name that lasts forever in the tech industry, he channeled his focus entirely into enterprise-grade problem-solving.
                            </p>
                        </div>

                        <div className="bg-[#0A0A0A] p-8 rounded-2xl border border-white/5">
                            <Target className="w-8 h-8 text-emerald-500 mb-6" />
                            <h3 className="text-xl font-bold uppercase tracking-tight mb-4 mt-0 text-white">The Ultimate Education ERP</h3>
                            <p className="text-base text-white/60 leading-relaxed mb-0">
                                At the core of Ashraf’s leadership at ProHostix is his disruptive philosophy on how organizations should operate. Instead of relying on rigid legacy corporate tools, his premier focus is the revolutionisation of the education sector through an advanced Education Resource Management platform. This unique ERP is built to seamlessly unify complex academic architectures into a singular, intelligent, cloud-native hub.
                            </p>
                        </div>
                    </div>

                    <h3 className="text-3xl font-black uppercase tracking-tight mb-8">Career Milestones & Trajectory</h3>
                    <p className="text-white/70 mb-8">
                        Ashraf’s path to becoming a chief executive is characterized by a rapid, multi-regional ascent through operations, system analysis, and project deployment:
                    </p>

                    <div className="space-y-6">
                        <div className="flex gap-6 items-start">
                            <div className="w-16 h-16 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex flex-col items-center justify-center shrink-0">
                                <span className="text-[10px] font-bold text-emerald-500 uppercase">Present</span>
                                <span className="text-xs font-black text-white">2026</span>
                            </div>
                            <div>
                                <h4 className="text-xl font-bold text-white m-0 mb-2">Executive Leadership, ProHostix</h4>
                                <p className="text-base text-white/60 m-0">
                                    Appointed as the Chief Executive Officer and Designated Partner of ProHostix. He spearheads the company’s product roadmaps, tech stacks, and aggressive growth strategies out of its primary corporate hub in Noida, Uttar Pradesh.
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-6 items-start">
                            <div className="w-16 h-16 rounded-xl bg-white/5 border border-white/10 flex flex-col items-center justify-center shrink-0">
                                <span className="text-[10px] font-bold text-white/40 uppercase">2024</span>
                                <span className="text-xs font-black text-white/70">-26</span>
                            </div>
                            <div>
                                <h4 className="text-xl font-bold text-white m-0 mb-2">Project Delivery & Management, IRPS Pvt. Ltd.</h4>
                                <p className="text-base text-white/60 m-0">
                                    Served as a Project Manager in Calicut, Kerala. Over a highly active 16-month tenure, he rose swiftly through the management tiers, acting as both an R&D Team Manager and Team Lead Manager to direct complex software deployment cycles.
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-6 items-start">
                            <div className="w-16 h-16 rounded-xl bg-white/5 border border-white/10 flex flex-col items-center justify-center shrink-0">
                                <span className="text-[10px] font-bold text-white/40 uppercase">2023</span>
                                <span className="text-xs font-black text-white/70">-24</span>
                            </div>
                            <div>
                                <h4 className="text-xl font-bold text-white m-0 mb-2">Systems & Data Analytics, Total Trust Air Conditioning</h4>
                                <p className="text-base text-white/60 m-0">
                                    Operated as a Business Analyst in Calicut, building the foundational expertise in operational workflows, data pipelines, and efficiency modeling that would later shape his ERP architectures.
                                </p>
                            </div>
                        </div>
                    </div>
                </article>
            </div>
        </div>
    );
}
