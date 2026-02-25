'use client';

import React, { useState, useEffect, Suspense, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard,
    FileText,
    MessageSquare,
    Users,
    UserCircle,
    Settings as SettingsIcon,
    Bell,
    LogOut,
    Menu,
    X,
    ExternalLink,
    ChevronRight,
    Loader2,
    CheckCircle2,
    ShieldCheck,
    Briefcase,
    Puzzle,
    Zap,
    Target,
    Globe
} from 'lucide-react';

import ProtectedRoute from '@/components/admin/ProtectedRoute';
import Overview from '@/components/admin/dashboard/Overview';
import Blogs from '@/components/admin/dashboard/Blogs';
import Enquiries from '@/components/admin/dashboard/Enquiries';
import Services from '@/components/admin/dashboard/Services';
import Solutions from '@/components/admin/dashboard/Solutions';
import Team from '@/components/admin/dashboard/Team';
import Leadership from '@/components/admin/dashboard/Leadership';
import Seo from '@/components/admin/dashboard/Seo';
import Settings from '@/components/admin/dashboard/Settings';
import { useDashboardStats } from '@/hooks/usePageData';
import { useViewport } from '@/hooks/useViewport';
import api from '@/utils/api';

function DashboardContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const queryClient = useQueryClient();
    const { forceHamburger } = useViewport() as any;

    const initialTab = searchParams.get('tab') || 'overview';
    const [activeTab, setActiveTabState] = useState(initialTab);
    const [activeSubTab, setActiveSubTab] = useState('projects');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
    const [user, setUser] = useState<any>(null);

    const { data: stats, isLoading: statsLoading, refetch: refetchStats } = useDashboardStats();

    const [showHeader, setShowHeader] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);
    const workspaceRef = useRef<HTMLDivElement>(null);
    const notificationRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const updateUserData = () => {
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                setUser(JSON.parse(storedUser));
            }
        };

        updateUserData();
        window.addEventListener('user-updated', updateUserData);
        return () => window.removeEventListener('user-updated', updateUserData);
    }, []);

    useEffect(() => {
        const workspace = workspaceRef.current;
        if (!workspace) return;

        const handleScroll = () => {
            const currentScrollY = workspace.scrollTop;
            setScrolled(currentScrollY > 20);
            if (currentScrollY > lastScrollY && currentScrollY > 50) {
                setShowHeader(false);
            } else {
                setShowHeader(true);
            }
            setLastScrollY(currentScrollY);
        };

        workspace.addEventListener('scroll', handleScroll);
        return () => workspace.removeEventListener('scroll', handleScroll);
    }, [lastScrollY]);

    // Sync state with URL
    useEffect(() => {
        const tab = searchParams.get('tab');
        if (tab && tab !== activeTab) {
            setActiveTabState(tab);
        }
    }, [searchParams, activeTab]);


    const setActiveTab = (tab: string, subtab?: string) => {
        setActiveTabState(tab);
        if (subtab) setActiveSubTab(subtab);
        const url = subtab ? `/admin/dashboard?tab=${tab}&subtab=${subtab}` : `/admin/dashboard?tab=${tab}`;
        router.push(url);
        if (isSidebarOpen) setIsSidebarOpen(false);
    };

    // Lock body scroll when mobile sidebar is open
    useEffect(() => {
        if (isSidebarOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isSidebarOpen]);

    // Close notifications on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
                setShowNotifications(false);
            }
        };

        if (showNotifications) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showNotifications]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        queryClient.clear();
        router.replace('/admin/login');
    };

    const menuItems = [
        { id: 'overview', label: 'Overview', icon: LayoutDashboard },
        { id: 'services', label: 'Services', icon: Briefcase },
        { id: 'solutions', label: 'Solutions', icon: Puzzle },
        { id: 'blogs', label: 'Blogs', icon: FileText },
        { id: 'enquiries', label: 'Leads', icon: MessageSquare },
        { id: 'leadership', label: 'Board Members', icon: UserCircle },
        { id: 'seo', label: 'SEO Config', icon: Globe },
        { id: 'settings', label: 'General Settings', icon: SettingsIcon },
    ];

    const renderActiveTab = () => {
        const overviewStats = stats || {
            enquiries: 0,
            applications: 0,
            subscribers: 0,
            blogs: 0,
            leadership: 0,
            services: 0,
            solutions: 0
        };

        const recentEnquiries = stats?.recentEnquiries || [];

        switch (activeTab) {
            case 'overview': return (
                <Overview
                    stats={overviewStats}
                    recentEnquiries={recentEnquiries}
                    onNavigate={setActiveTab}
                    isLoading={statsLoading}
                    user={user}
                />
            );
            case 'blogs': return <Blogs />;
            case 'services': return <Services />;
            case 'solutions': return <Solutions />;
            case 'enquiries': return <Enquiries initialTab={activeSubTab} />;
            case 'leadership': return <Leadership />;
            case 'seo': return <Seo />;
            case 'settings': return <Settings />;
            default: return (
                <Overview
                    stats={overviewStats}
                    recentEnquiries={recentEnquiries}
                    onNavigate={setActiveTab}
                    isLoading={statsLoading}
                    user={user}
                />
            );
        }
    };

    return (
        <div className="h-screen bg-[#050505] text-white flex flex-col overflow-hidden relative">
            {/* --- FULL WIDTH TOPBAR --- */}
            <header className="w-full shrink-0 z-50 bg-[#080808]/80 backdrop-blur-md border-b border-white/5 h-[70px]">
                <div className="h-full px-8 flex items-center justify-between">
                    <div className="flex items-center gap-8">
                        {/* mobile menu button */}
                        <button onClick={() => setIsSidebarOpen(true)} className={`${forceHamburger ? 'flex' : 'md:hidden'} p-2 -ml-2 text-white/60 hover:text-white transition-colors`}>
                            <Menu size={20} />
                        </button>

                        {/* Far Left Branding */}
                        <Link href="/" className="flex items-center gap-2.5 group">
                            <div className="w-7 h-7 shrink-0 transition-transform group-hover:scale-110 duration-500">
                                <img src="/logo.png" alt="Logo" className="w-full h-full object-contain brightness-125" />
                            </div>
                            <div className="flex flex-col">
                                <div className="flex items-baseline font-black text-lg tracking-tighter leading-none">
                                    <span className="text-white">PRO</span>
                                    <span className="text-white/40">HOSTIX</span>
                                </div>
                                <span className="text-[8px] font-black uppercase tracking-[0.2em] text-emerald-500/80 mt-1">Admin Control</span>
                            </div>
                        </Link>
                    </div>

                    <div className="hidden md:flex flex-1 max-w-[400px] lg:max-w-md mx-6" />

                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setActiveTab('settings')}
                            className="aspect-square shrink-0 p-0.5 rounded-full bg-white/5 border border-white/10 hover:border-emerald-500/50 transition-all group hover:scale-105 active:scale-95"
                        >
                            <div className="w-9 h-9 aspect-square shrink-0 rounded-full bg-emerald-500 flex items-center justify-center text-black font-black overflow-hidden relative">
                                {user?.avatar ? (
                                    <img src={user.avatar} alt="" className="w-full h-full object-cover rounded-full" />
                                ) : (
                                    <span className="leading-none text-sm">{(user?.name || 'A').charAt(0).toUpperCase()}</span>
                                )}
                            </div>
                        </button>

                        <div className="relative" ref={notificationRef}>
                            <button
                                onClick={() => setShowNotifications(!showNotifications)}
                                className={`relative p-2.5 transition-colors group ${showNotifications ? 'text-emerald-400' : 'text-white/40 hover:text-white'}`}
                            >
                                <Bell size={20} className="group-hover:scale-110 transition-transform" />
                                {(stats?.hasNewEnquiries || stats?.hasNewApplications || stats?.hasNewSubscribers) && (
                                    <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-emerald-500 rounded-full border-2 border-black animate-pulse" />
                                )}
                            </button>

                            <AnimatePresence>
                                {showNotifications && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                        className="absolute right-0 mt-4 w-80 sm:w-96 bg-zinc-900/90 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden"
                                    >
                                        <div className="p-4 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
                                            <h4 className="font-bold text-sm tracking-tight">Recent Activity</h4>
                                            <button
                                                onClick={async () => {
                                                    try {
                                                        // Optimistic Update: Mark local cache as read immediately
                                                        queryClient.setQueryData(['admin', 'stats'], (old: any) => {
                                                            if (!old) return old;
                                                            return {
                                                                ...old,
                                                                recentEnquiries: old.recentEnquiries ? old.recentEnquiries.map((e: any) => ({ ...e, status: 'contacted' })) : [],
                                                                recentApplications: old.recentApplications ? old.recentApplications.map((a: any) => ({ ...a, status: 'reviewing' })) : [],
                                                                recentSubscribers: old.recentSubscribers ? old.recentSubscribers.map((s: any) => ({ ...s, status: 'read' })) : [],
                                                                hasNewEnquiries: false,
                                                                hasNewApplications: false,
                                                                hasNewSubscribers: false
                                                            };
                                                        });

                                                        await api.put('/enquiries/mark-all-read');
                                                        refetchStats();
                                                    } catch (err) {
                                                        console.error('Failed to clear notifications', err);
                                                        refetchStats();
                                                    }
                                                }}
                                                className="text-[10px] font-bold text-emerald-400 hover:text-emerald-300 uppercase tracking-widest px-2 py-1 rounded-md hover:bg-emerald-500/10 transition-all"
                                            >
                                                Clear All
                                            </button>
                                        </div>
                                        <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                                            {((stats?.recentEnquiries?.filter((e: any) => e.status === 'new').length || 0) > 0 ||
                                                (stats?.recentApplications?.filter((a: any) => a.status === 'received').length || 0) > 0 ||
                                                (stats?.recentSubscribers?.filter((s: any) => s.status === 'new').length || 0) > 0) ? (
                                                <div className="divide-y divide-white/5">
                                                    {stats?.recentEnquiries?.filter((e: any) => e.status === 'new').map((enquiry: any) => (
                                                        <div
                                                            key={enquiry._id}
                                                            onClick={() => {
                                                                setActiveTab('enquiries', 'projects');
                                                                setShowNotifications(false);
                                                            }}
                                                            className="p-4 hover:bg-white/[0.04] cursor-pointer transition-colors group"
                                                        >
                                                            <div className="flex gap-3">
                                                                <div className="w-8 h-8 rounded-full bg-emerald-500 text-black flex items-center justify-center shrink-0">
                                                                    <MessageSquare size={14} />
                                                                </div>
                                                                <div>
                                                                    <p className="text-sm font-bold group-hover:text-emerald-400 transition-colors">New Enquiry: {enquiry.name}</p>
                                                                    <p className="text-xs text-white/40 line-clamp-1">{enquiry.description}</p>
                                                                    <p className="text-[10px] text-white/20 mt-1 uppercase tracking-tight">{enquiry.createdAt ? new Date(enquiry.createdAt).toLocaleString() : ''}</p>
                                                                </div>
                                                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 shrink-0 ml-auto" />
                                                            </div>
                                                        </div>
                                                    ))}

                                                    {stats?.recentApplications?.filter((a: any) => a.status === 'received').map((app: any) => (
                                                        <div
                                                            key={app._id}
                                                            onClick={() => {
                                                                setActiveTab('enquiries', 'careers');
                                                                setShowNotifications(false);
                                                            }}
                                                            className="p-4 hover:bg-white/[0.04] cursor-pointer transition-colors group"
                                                        >
                                                            <div className="flex gap-3">
                                                                <div className="w-8 h-8 rounded-full bg-blue-500 text-black flex items-center justify-center shrink-0">
                                                                    <Target size={14} />
                                                                </div>
                                                                <div>
                                                                    <p className="text-sm font-bold group-hover:text-blue-400 transition-colors">Job Application: {app.name}</p>
                                                                    <p className="text-xs text-white/40 line-clamp-1">{app.role}</p>
                                                                    <p className="text-[10px] text-white/20 mt-1 uppercase tracking-tight">{app.createdAt ? new Date(app.createdAt).toLocaleString() : ''}</p>
                                                                </div>
                                                                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 shrink-0 ml-auto" />
                                                            </div>
                                                        </div>
                                                    ))}

                                                    {stats?.recentSubscribers?.filter((s: any) => s.status === 'new').map((sub: any) => (
                                                        <div
                                                            key={sub._id}
                                                            onClick={() => {
                                                                setActiveTab('enquiries', 'subscribers');
                                                                setShowNotifications(false);
                                                            }}
                                                            className="p-4 hover:bg-white/[0.04] cursor-pointer transition-colors group"
                                                        >
                                                            <div className="flex gap-3">
                                                                <div className="w-8 h-8 rounded-full bg-amber-500 text-black flex items-center justify-center shrink-0">
                                                                    <Zap size={14} />
                                                                </div>
                                                                <div>
                                                                    <p className="text-sm font-bold group-hover:text-amber-400 transition-colors">New Subscriber</p>
                                                                    <p className="text-xs text-white/40">{sub.email}</p>
                                                                    <p className="text-[10px] text-white/20 mt-1 uppercase tracking-tight">{sub.createdAt ? new Date(sub.createdAt).toLocaleString() : ''}</p>
                                                                </div>
                                                                <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 shrink-0 ml-auto" />
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className="py-12 flex flex-col items-center justify-center text-white/20">
                                                    <Bell size={32} className="mb-2 opacity-20" />
                                                    <p className="text-xs font-bold uppercase tracking-widest">No new notifications</p>
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        <button
                            onClick={() => setShowLogoutConfirm(true)}
                            className="p-2.5 text-white/40 hover:text-red-500 transition-colors group relative"
                            title="Logout System"
                        >
                            <LogOut size={20} className="group-hover:rotate-12 transition-transform" />
                        </button>
                    </div>
                </div>
            </header>

            <div className="flex flex-grow overflow-hidden relative">
                {/* --- DESKTOP FULL SIDEBAR (LG screens) --- */}
                <aside className={`${forceHamburger ? 'hidden' : 'hidden lg:flex'} w-72 shrink-0 flex-col pb-8 border-r border-white/5 bg-[#080808] z-30 shadow-2xl overflow-hidden overscroll-behavior-contain`}>
                    <nav className="flex-grow flex flex-col gap-2 px-4 pt-10 pb-6 ml-2">
                        {menuItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = activeTab === item.id;
                            return (
                                <button
                                    key={item.id}
                                    onClick={() => setActiveTab(item.id)}
                                    className={`
                                            w-full h-12 flex items-center gap-4 pl-5 pr-2 rounded-2xl transition-all duration-300 group relative
                                            ${isActive
                                            ? 'bg-emerald-500 text-black font-black shadow-[0_8px_20px_rgba(16,185,129,0.25)]'
                                            : 'text-white/40 hover:text-white hover:bg-white/5'}
                                        `}
                                >
                                    <Icon size={20} className={isActive ? 'text-black' : 'group-hover:text-emerald-400 transition-colors'} />
                                    <span className={`text-[14px] font-bold tracking-tight whitespace-nowrap transition-transform duration-300 ${isActive ? 'translate-x-1' : 'group-hover:translate-x-1'}`}>
                                        {item.label}
                                    </span>
                                </button>
                            );
                        })}
                    </nav>
                </aside>

                {/* --- TABLET NAV RAIL (MD to LG) --- */}
                <aside className={`${forceHamburger ? 'hidden' : 'hidden md:flex lg:hidden'} w-24 shrink-0 flex-col pb-8 border-r border-white/5 bg-[#080808] z-30 shadow-2xl overflow-hidden overscroll-behavior-contain`}>
                    <nav className="flex-grow flex flex-col items-center gap-4 pt-8 pb-6">
                        {menuItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = activeTab === item.id;
                            return (
                                <div key={item.id} className="relative group/nav flex items-center justify-center w-full">
                                    <button
                                        onClick={() => setActiveTab(item.id)}
                                        className={`
                                                w-14 h-14 flex items-center justify-center rounded-2xl transition-all duration-300 relative
                    ${isActive
                                                ? 'bg-emerald-500 text-black shadow-[0_8px_20px_rgba(16,185,129,0.25)]'
                                                : 'text-white/30 hover:text-white hover:bg-white/5'}
                                            `}
                                    >
                                        <Icon size={24} className={isActive ? 'text-black scale-110' : 'group-hover/nav:scale-110 group-hover/nav:text-emerald-400 transition-all duration-300'} />
                                    </button>

                                    {/* Tooltip */}
                                    <div className="absolute left-[90px] px-3 py-2 bg-emerald-500 text-black text-[10px] font-black uppercase tracking-widest rounded-lg opacity-0 group-hover/nav:opacity-100 -translate-x-2 group-hover/nav:translate-x-0 pointer-events-none transition-all duration-300 whitespace-nowrap shadow-[0_10px_30px_rgba(0,0,0,0.5)] z-[100]">
                                        {item.label}
                                        <div className="absolute top-1/2 -left-1 -translate-y-1/2 w-2 h-2 bg-emerald-500 rotate-45 -z-10" />
                                    </div>
                                </div>
                            );
                        })}
                    </nav>
                </aside>

                {/* --- MAIN WORKSPACE --- */}
                <main className="flex-grow min-w-0 flex flex-col overflow-hidden relative">
                    <div
                        ref={workspaceRef}
                        className="flex-grow overflow-y-auto custom-scrollbar relative"
                    >
                        <div className="px-6 pt-4 pb-12 lg:px-10 lg:pt-6 lg:pb-12 w-full">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={activeTab}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    {renderActiveTab()}
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </div>
                </main>
            </div>

            {/* --- LOGOUT MODAL --- */}
            <AnimatePresence>
                {showLogoutConfirm && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowLogoutConfirm(false)}
                            className="absolute inset-0 bg-black/80 backdrop-blur-md"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative w-full max-w-sm bg-zinc-900 border border-white/10 p-8 rounded-[32px] shadow-2xl overflow-hidden"
                        >
                            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 via-transparent to-red-500 opacity-20" />
                            <div className="text-center">
                                <div className="w-16 h-16 rounded-2xl bg-red-500/10 flex items-center justify-center mx-auto mb-6 text-red-500 border border-red-500/20">
                                    <LogOut size={32} />
                                </div>
                                <h3 className="text-xl font-bold mb-2">Terminate Session?</h3>
                                <p className="text-white/40 text-sm mb-8">You will be required to re-authenticate to access the admin portal.</p>
                                <div className="flex flex-col gap-3">
                                    <button
                                        onClick={handleLogout}
                                        className="w-full py-4 rounded-xl bg-red-500 hover:bg-red-400 text-black font-bold text-xs uppercase tracking-widest transition-all"
                                    >
                                        Log Out Now
                                    </button>
                                    <button
                                        onClick={() => setShowLogoutConfirm(false)}
                                        className="w-full py-4 rounded-xl bg-white/5 hover:bg-white/10 text-white font-bold text-xs uppercase tracking-widest transition-all"
                                    >
                                        Stay Authenticated
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* --- MOBILE SIDEBAR --- */}
            <AnimatePresence>
                {isSidebarOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsSidebarOpen(false)}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
                        />
                        <motion.div
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed inset-y-0 left-0 w-80 bg-[#080808] border-r border-white/5 z-[70] p-8 flex flex-col overscroll-behavior-contain"
                        >
                            <div className="flex justify-between items-center mb-10">
                                <div className="flex items-center gap-3">
                                    <img src="/logo.png" alt="" className="w-8 h-8" />
                                    <span className="font-bold text-lg">PROHOSTIX</span>
                                </div>
                                <button onClick={() => setIsSidebarOpen(false)} className="p-2 text-white/40">
                                    <X size={24} />
                                </button>
                            </div>

                            <nav className="flex-grow flex flex-col gap-2 overflow-y-auto custom-scrollbar -mx-2 px-2">
                                {menuItems.map((item) => {
                                    const Icon = item.icon;
                                    const isActive = activeTab === item.id;
                                    return (
                                        <button
                                            key={item.id}
                                            onClick={() => setActiveTab(item.id)}
                                            className={`flex items-center gap-4 px-5 py-4 rounded-xl transition-all ${isActive ? 'bg-emerald-500 text-black font-black shadow-lg shadow-emerald-500/20' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
                                        >
                                            <Icon size={18} />
                                            <span className="text-sm tracking-tight font-bold">{item.label}</span>
                                        </button>
                                    );
                                })}
                            </nav>
                        </motion.div>
                    </>
                )
                }
            </AnimatePresence >
        </div >
    );
}

export default function DashboardPage() {
    return (
        <ProtectedRoute>
            <Suspense fallback={
                <div className="min-h-screen bg-[#050505] flex items-center justify-center">
                    <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                </div>
            }>
                <DashboardContent />
            </Suspense>
        </ProtectedRoute>
    );
}
