'use client';

import { Facebook, Instagram, X, Mail, Send, Loader2, CheckCircle2, Globe } from "lucide-react";
import * as LucideIcons from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import api from "../../utils/api";
import { fetchSettings } from "../../features/settings/settingsSlice";

const Footer = () => {
    const dispatch = useDispatch();
    const { data: settings } = useSelector((state: any) => state.settings);
    const [socialLinks, setSocialLinks] = useState<any[]>([]);

    useEffect(() => {
        // @ts-ignore
        dispatch(fetchSettings());
        fetchSocialLinks();
    }, [dispatch]);

    const fetchSocialLinks = async () => {
        try {
            const res: any = await api.get('/social-links');
            setSocialLinks(res || []);
        } catch (err) {
            console.error('Failed to fetch social links', err);
        }
    };

    return (
        <footer className="w-full bg-[#050505] border-t border-white/5 py-20 px-6 md:px-12 lg:px-16 relative overflow-hidden">
            {/* Ambient Background Elements */}
            <div className="absolute top-0 right-[-10%] w-[500px] h-[500px] bg-emerald-500/5 blur-[150px] rounded-full pointer-events-none" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-emerald-500/5 blur-[150px] rounded-full pointer-events-none" />

            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 items-start gap-12 lg:gap-24 mb-10">
                    {/* Brand & Mission Section */}
                    <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
                        <Link href="/" onClick={() => window.scrollTo(0, 0)} className="flex items-center gap-3 mb-5 group transition-transform hover:scale-105 duration-300">
                            <div className="w-10 h-10 flex items-center justify-center bg-transparent transition-all">
                                <img src="/logo.png" alt="Logo" className="w-full h-full object-contain pointer-events-none" />
                            </div>
                            <span className="text-2xl font-bold tracking-tight text-white">{settings?.companyName || "ProHostix"}</span>
                        </Link>
                        <p className="text-white/50 text-base leading-loose max-w-sm mb-6">
                            Architecting high-performance digital ecosystems with precision-engineered AI solutions for the forward-thinking enterprise.
                        </p>

                        <div className="flex gap-4">
                            {socialLinks.length > 0 ? (
                                socialLinks.map((social: any, i) => {
                                    const IconComponent = (LucideIcons as any)[social.icon] || Globe;
                                    return (
                                        <a
                                            key={i}
                                            href={social.url || "#"}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            title={social.platform}
                                            className="w-10 h-10 flex items-center justify-center bg-white/[0.03] border border-white/10 rounded-xl text-white/40 hover:text-emerald-400 hover:border-emerald-500/50 hover:bg-emerald-500/5 transition-all duration-300"
                                        >
                                            <IconComponent size={20} />
                                        </a>
                                    );
                                })
                            ) : (
                                [
                                    { icon: Facebook, href: settings?.socialLinks?.facebook, label: 'Facebook' },
                                    { icon: Instagram, href: settings?.socialLinks?.instagram, label: 'Instagram' },
                                    { icon: LucideIcons.X, href: settings?.socialLinks?.x, label: 'X (Twitter)' }
                                ].map((social, i) => (
                                    <a
                                        key={i}
                                        href={social.href || "#"}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-10 h-10 flex items-center justify-center bg-white/[0.03] border border-white/10 rounded-xl text-white/40 hover:text-emerald-400 hover:border-emerald-500/50 hover:bg-emerald-500/5 transition-all duration-300"
                                    >
                                        <social.icon size={20} />
                                    </a>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Navigation Links Sections */}
                    {/* Navigation Links Sections */}
                    <div className="grid grid-cols-3 gap-6 md:gap-12 lg:gap-16 w-full justify-between text-center lg:text-left items-start justify-items-center lg:justify-items-start">
                        <div className="flex flex-col gap-6 items-center lg:items-start">
                            <h4 className="text-white font-bold text-xs uppercase tracking-[0.2em] opacity-90 border-b border-emerald-500/20 pb-2 w-fit">Company</h4>
                            <div className="flex flex-col gap-3">
                                <Link href="/company" onClick={() => window.scrollTo(0, 0)} className="text-white/40 hover:text-emerald-400 transition-colors text-sm hover:translate-x-1 duration-300 inline-block">About Us</Link>
                                <Link href="/case-studies" onClick={() => window.scrollTo(0, 0)} className="text-white/40 hover:text-emerald-400 transition-colors text-sm hover:translate-x-1 duration-300 inline-block">Case Studies</Link>
                                <Link href="/blog" onClick={() => window.scrollTo(0, 0)} className="text-white/40 hover:text-emerald-400 transition-colors text-sm hover:translate-x-1 duration-300 inline-block">Insights</Link>
                                <Link href="/careers" onClick={() => window.scrollTo(0, 0)} className="text-white/40 hover:text-emerald-400 transition-colors text-sm hover:translate-x-1 duration-300 inline-block">Careers</Link>
                            </div>
                        </div>
                        <div className="flex flex-col gap-6 items-center lg:items-start">
                            <h4 className="text-white font-bold text-xs uppercase tracking-[0.2em] opacity-90 border-b border-emerald-500/20 pb-2 w-fit">Solutions</h4>
                            <div className="flex flex-col gap-3">
                                <Link href="/solutions/crm-solutions" onClick={() => window.scrollTo(0, 0)} className="text-white/40 hover:text-emerald-400 transition-colors text-sm hover:translate-x-1 duration-300 inline-block">CRM Platform</Link>
                                <Link href="/solutions/erp-systems" onClick={() => window.scrollTo(0, 0)} className="text-white/40 hover:text-emerald-400 transition-colors text-sm hover:translate-x-1 duration-300 inline-block">ERP Systems</Link>
                                <Link href="/solutions" onClick={() => window.scrollTo(0, 0)} className="text-white/40 hover:text-emerald-400 transition-colors text-sm hover:translate-x-1 duration-300 inline-block">All Scope</Link>
                            </div>
                        </div>
                        <div className="flex flex-col gap-6 items-center lg:items-start">
                            <h4 className="text-white font-bold text-xs uppercase tracking-[0.2em] opacity-90 border-b border-emerald-500/20 pb-2 w-fit">Services</h4>
                            <div className="flex flex-col gap-3">
                                <Link href="/services" onClick={() => window.scrollTo(0, 0)} className="text-white/40 hover:text-emerald-400 transition-colors text-sm hover:translate-x-1 duration-300 inline-block">Core Services</Link>
                                <Link href="/lets-talk" onClick={() => window.scrollTo(0, 0)} className="text-white/40 hover:text-emerald-400 transition-colors text-sm hover:translate-x-1 duration-300 inline-block">Consultation</Link>
                                <Link href="/lets-talk" onClick={() => window.scrollTo(0, 0)} className="text-white/40 hover:text-white transition-colors text-sm hover:translate-x-1 duration-300 inline-block">SLA Support</Link>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Bottom Bar */}
                <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
                        <p className="text-white/30 text-xs tracking-wide">
                            © {new Date().getFullYear()} {settings?.companyName || "ProHostix"}. Global Presence.
                        </p>
                        <div className="hidden sm:block h-1 w-1 rounded-full bg-white/10" />
                        <Link href="/privacy" onClick={() => window.scrollTo(0, 0)} className="text-white/30 hover:text-white transition-colors text-xs">Privacy Protocol</Link>
                    </div>

                    <div className="flex items-center gap-3 px-4 py-2 bg-white/[0.03] border border-white/10 rounded-xl group transition-all hover:border-emerald-500/30">
                        <div className="relative">
                            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                            <div className="absolute inset-0 w-2.5 h-2.5 rounded-full bg-emerald-400 blur-[4px] animate-ping opacity-40" />
                        </div>
                        <span className="text-white/60 text-[11px] uppercase tracking-[0.2em] font-bold">System Status: 100% Active</span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
