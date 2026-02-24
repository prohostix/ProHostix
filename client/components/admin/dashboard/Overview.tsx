'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Inbox, Target, Zap, TrendingUp, ShieldCheck, Cog, Lightbulb } from 'lucide-react';
import ProjectDetailsModal from './ProjectDetailsModal';
import { countries } from '@/config/countries';

interface OverviewProps {
    stats: any;
    recentEnquiries: any[];
    onNavigate: (tab: string, subtab?: string) => void;
    isLoading?: boolean;
    user?: any;
}

const Overview: React.FC<OverviewProps> = ({ stats, recentEnquiries, onNavigate, isLoading, user }) => {
    const [selectedEnquiry, setSelectedEnquiry] = useState<any>(null);

    const handleCardClick = (stat: any) => {
        if (!onNavigate) return;

        switch (stat.label) {
            case 'Project Enquiries':
                onNavigate('enquiries', 'projects');
                break;
            case 'Job Applications':
                onNavigate('enquiries', 'careers');
                break;
            case 'Active Subscribers':
                onNavigate('enquiries', 'subscribers');
                break;
            case 'Published Blogs':
                onNavigate('blogs');
                break;
            case 'Leadership':
                onNavigate('leadership');
                break;
            case 'Services':
                onNavigate('services');
                break;
            case 'Solutions':
                onNavigate('solutions');
                break;
            default:
                break;
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center p-20">
                <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Header / Greeting */}
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="pt-0 pb-2 flex flex-col items-start gap-2"
            >
                <div className="flex items-center gap-3 px-3 py-1.5 bg-emerald-500/5 border border-emerald-500/10 rounded-full mb-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                    <span className="text-[9px] font-black uppercase tracking-[0.2em] text-emerald-400">System Dashboard</span>
                </div>
                <h3 className="text-3xl md:text-6xl font-black tracking-tighter flex flex-wrap items-center gap-x-4">
                    <span className="bg-gradient-to-b from-white to-white/30 bg-clip-text text-transparent pb-2">
                        {(() => {
                            const hour = new Date().getHours();
                            if (hour < 12) return 'Good Morning';
                            if (hour < 17) return 'Good Afternoon';
                            if (hour < 21) return 'Good Evening';
                            return 'Good Night';
                        })()},
                    </span>
                    <span className="text-emerald-500 drop-shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                        {user?.name?.split(' ')[0] || 'Admin'}
                    </span>
                </h3>
                <p className="text-white/30 text-sm font-medium tracking-tight mt-1 max-w-md">
                    Welcome back to the ProHostix engine. All systems are currently operational and waiting for your review.
                </p>
            </motion.div>
            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-7 gap-4 sm:gap-5 mb-8 sm:mb-12">
                {[
                    { label: 'Project Enquiries', value: stats.enquiries, icon: Inbox, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
                    { label: 'Job Applications', value: stats.applications, icon: Target, color: 'text-blue-400', bg: 'bg-blue-400/10' },
                    { label: 'Active Subscribers', value: stats.subscribers, icon: Zap, color: 'text-amber-400', bg: 'bg-amber-400/10' },
                    { label: 'Published Blogs', value: stats.blogs, icon: TrendingUp, color: 'text-indigo-400', bg: 'bg-indigo-400/10' },
                    { label: 'Leadership', value: stats.leadership, icon: ShieldCheck, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
                    { label: 'Services', value: stats.services, icon: Cog, color: 'text-zinc-400', bg: 'bg-zinc-400/10' },
                    { label: 'Solutions', value: stats.solutions, icon: Lightbulb, color: 'text-amber-200', bg: 'bg-amber-200/10' },
                ].map((stat, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.22, delay: i * 0.04, ease: [0.22, 1, 0.36, 1] }}
                        whileHover={{ y: -4, transition: { duration: 0.15 } }}
                        onClick={() => handleCardClick(stat)}
                        className="p-5 sm:p-6 bg-[#0f0f0f] border border-[#222222] rounded-2xl cursor-pointer hover:border-[#333333]/80 hover:bg-white/[0.02] shadow-sm hover:shadow-xl hover:shadow-black/20 transition-all flex flex-col justify-between min-h-[140px]"
                    >
                        {/* Top: Icon & Value */}
                        <div className="flex justify-between items-start mb-4">
                            <h3 className="text-3xl sm:text-4xl font-semibold text-white tracking-tight leading-none">
                                {stat.value ?? 0}
                            </h3>
                            <div className={`p-2 rounded-xl ${stat.bg} ${stat.color} flex shrink-0`}>
                                <stat.icon size={18} strokeWidth={2.5} />
                            </div>
                        </div>

                        {/* Bottom: Label & Meta */}
                        <div className="flex flex-col gap-2 mt-auto">
                            <div className="w-full h-px bg-[#222222]" />
                            <div className="flex items-center justify-between pt-1">
                                <span className="text-xs sm:text-[13px] font-medium text-zinc-400 capitalize leading-tight" title={stat.label}>
                                    {stat.label.toLowerCase()}
                                </span>
                                {/* Optional: tiny status dot if we wanted to show dynamic updates, static for now */}
                                <div className="w-1.5 h-1.5 rounded-full bg-zinc-700 shrink-0 ml-2 mt-0.5 self-start" />
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5">
                <div className="lg:col-span-2 bg-[#0f0f0f] border border-[#222222] rounded-2xl p-5 sm:p-6 flex flex-col min-h-[300px]">
                    <div className="flex justify-between items-center mb-5 sm:mb-6">
                        <h4 className="text-sm font-semibold text-white tracking-tight">Recent Project Enquiries</h4>
                        <button
                            onClick={() => onNavigate && onNavigate('enquiries', 'projects')}
                            className="text-[11px] font-semibold text-zinc-400 hover:text-white uppercase tracking-widest transition-colors"
                        >
                            View All
                        </button>
                    </div>
                    <div className="space-y-3 flex-grow">
                        {recentEnquiries && recentEnquiries.length > 0 ? recentEnquiries.map((enquiry, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.2, delay: 0.3 + (i * 0.05) }}
                                whileHover={{ x: 4, backgroundColor: "rgba(255, 255, 255, 0.03)" }}
                                onClick={() => setSelectedEnquiry(enquiry)}
                                className="flex items-center justify-between py-3 px-4 bg-[#141414] border border-[#222222] rounded-xl hover:border-[#333333] transition-all group cursor-pointer"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-[#1c1c1c] border border-[#2a2a2a] flex items-center justify-center text-white font-semibold">
                                        {enquiry.name?.charAt(0) || '?'}
                                    </div>
                                    <div className="flex flex-col gap-0.5">
                                        <div className="flex items-center gap-2">
                                            <p className="text-sm font-medium text-white group-hover:text-zinc-200 transition-colors truncate max-w-[140px] sm:max-w-[200px]" title={enquiry.name}>{enquiry.name || 'Unknown'}</p>
                                            {enquiry.country && (
                                                <span className="text-xs opacity-80" title={enquiry.country}>
                                                    {(countries as any[]).find(c => c.name === enquiry.country)?.flag}
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-[11px] text-zinc-500 font-medium truncate max-w-[200px] sm:max-w-[300px]" title={`${enquiry.enquiryType || 'General'} • ${enquiry.company || 'N/A'}`}>
                                            {enquiry.enquiryType || 'General'} • {enquiry.company || 'N/A'}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex flex-col items-end gap-1">
                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${enquiry.status === 'new' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-[#1c1c1c] text-zinc-400'
                                        }`}>
                                        {enquiry.status || 'new'}
                                    </span>
                                    <p className="text-[11px] text-zinc-500 font-medium">{enquiry.createdAt ? new Date(enquiry.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : 'N/A'}</p>
                                </div>
                            </motion.div>
                        )) : (
                            <div className="flex-grow flex items-center justify-center border border-dashed border-[#222222] rounded-xl">
                                <p className="text-center text-zinc-500 text-sm font-medium">No recent enquiries found.</p>
                            </div>
                        )}
                    </div>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.22, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
                    className="bg-[#0f0f0f] border border-[#222222] rounded-2xl p-5 sm:p-6 flex flex-col"
                >
                    <h4 className="text-sm font-semibold text-white tracking-tight mb-5 sm:mb-6">System Health</h4>
                    <div className="space-y-5 flex-grow">
                        {[
                            { label: 'Server Status', status: 'Operational', color: 'text-emerald-400' },
                            { label: 'Database Latency', status: '12ms', color: 'text-zinc-300' },
                            { label: 'API Uptime', status: '99.9%', color: 'text-emerald-400' },
                        ].map((item, i) => (
                            <div key={i} className="flex justify-between items-center py-1">
                                <span className="text-sm font-medium text-zinc-400">{item.label}</span>
                                <span className={`text-sm font-semibold ${item.color}`}>{item.status}</span>
                            </div>
                        ))}
                    </div>
                    <div className="pt-5 mt-auto border-t border-[#222222]">
                        <div className="flex justify-between items-center mb-2">
                            <p className="text-xs font-medium text-zinc-400">Storage Usage</p>
                            <span className="text-xs font-semibold text-white">2.4GB <span className="text-zinc-500 font-normal">/ 10GB</span></span>
                        </div>
                        <div className="h-1.5 w-full bg-[#1c1c1c] rounded-full overflow-hidden">
                            <div className="h-full bg-blue-500 w-[24%]" />
                        </div>
                    </div>
                </motion.div>
            </div>
            {/* Modal */}
            <ProjectDetailsModal
                enquiry={selectedEnquiry}
                onClose={() => setSelectedEnquiry(null)}
            />
        </div>
    );
};

export default Overview;
