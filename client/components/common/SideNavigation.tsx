'use client';

import React, { useState, useEffect, memo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useSelector, useDispatch } from "react-redux";
import { setQuery, setSearchExpanded, performSearch } from "../../features/search/searchSlice";
import { fetchNavigation } from "../../features/navigation/navigationSlice";
import { fetchSettings } from "../../features/settings/settingsSlice";
import { useNavigationQuery, useSettingsQuery, useUserProfile } from "../../hooks/usePageData";
import { useViewport } from "../../hooks/useViewport";
import { NAVIGATION } from "../../data/staticContent";
import {
    LayoutGrid,
    Puzzle,
    Briefcase,
    FolderKanban,
    Building2,
    BookOpenText,
    Menu,
    X,
    Search,
    LogIn,
    MessageSquare,
    Loader2,
    ArrowRight
} from "lucide-react";

const iconMap: any = {
    LayoutGrid,
    Puzzle,
    Briefcase,
    FolderKanban,
    Building2,
    BookOpenText
};

export const SideNavigation = memo(() => {
    const dispatch = useDispatch();
    const pathname = usePathname();
    const { data: apiNavItems } = useNavigationQuery();
    const { data: settings } = useSettingsQuery() as any;
    const { forceHamburger: viewportForceHamburger, isTablet: viewportIsTablet } = useViewport() as any;
    const {
        query: searchQuery,
        results: searchResults,
        isSearching
    } = useSelector((state: any) => state.search);

    const navItems = apiNavItems?.length ? apiNavItems : NAVIGATION;

    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
    const [isAtTop, setIsAtTop] = useState(true);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const forceHamburger = mounted ? viewportForceHamburger : false;
    const isTablet = mounted ? viewportIsTablet : false;

    useEffect(() => {
        let ticking = false;
        const handleScroll = () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    setIsAtTop(window.scrollY < 20);
                    ticking = false;
                });
                ticking = true;
            }
        };
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Search Logic
    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (searchQuery.length > 0) {
                // @ts-ignore
                dispatch(performSearch(searchQuery));
            }
        }, 300);
        return () => clearTimeout(delayDebounceFn);
    }, [searchQuery, dispatch]);

    // Close on navigation
    useEffect(() => {
        setIsDrawerOpen(false);
        setIsMobileSearchOpen(false);
    }, [pathname]);

    // Lock body scroll when drawer is open
    useEffect(() => {
        if (isDrawerOpen || isMobileSearchOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isDrawerOpen, isMobileSearchOpen]);

    return (
        <>
            {/* --- MOBILE TOP BAR REMOVED - HANDLED BY UNIVERSAL TOPBAR --- */}

            {/* --- MOBILE SEARCH OVERLAY --- */}
            <AnimatePresence>
                {isMobileSearchOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        onClick={() => setIsMobileSearchOpen(false)}
                        className="fixed top-20 left-0 right-0 bottom-0 z-[50] bg-[#0B1015]/90 safari-blur-fix force-gpu p-6 flex flex-col border-t border-white/5 overscroll-behavior-contain"
                    >

                        <div className="flex-grow overflow-y-auto space-y-2">
                            {searchResults.map((result: any, idx: number) => (
                                <Link
                                    key={idx}
                                    href={result.path}
                                    onClick={() => dispatch(setSearchExpanded(false))}
                                    className="flex items-center justify-between p-5 bg-white/5 rounded-2xl border border-transparent hover:border-emerald-500/30 transition-all group"
                                >
                                    <div>
                                        <div className="text-white font-semibold mb-1">{result.title}</div>
                                        <div className="text-emerald-500/60 text-xs font-bold uppercase tracking-widest">{result.category}</div>
                                    </div>
                                    <ArrowRight size={18} className="text-gray-600 group-hover:text-emerald-500 group-hover:translate-x-1 transition-all" />
                                </Link>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* --- MOBILE DRAWER --- */}
            <AnimatePresence>
                {isDrawerOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsDrawerOpen(false)}
                            className="fixed inset-0 bg-black/80 backdrop-blur-md z-[70]"
                        />
                        <motion.div
                            initial={{ x: "-100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "-100%" }}
                            transition={{ type: "spring", damping: 30, stiffness: 300 }}
                            className="fixed top-0 left-0 w-[80%] md:w-[60%] h-full bg-[#0B0F14] border-r border-white/10 z-[80] p-8 flex flex-col shadow-2xl overscroll-behavior-contain"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <div className="flex items-center gap-2">
                                    <div className="w-10 h-10 flex items-center justify-center bg-transparent">
                                        <img src="/logo.png" alt="" className="w-full h-full object-contain pointer-events-none" />
                                    </div>
                                    <span className="font-bold text-xl">{settings?.companyName || "ProHostix"}</span>
                                </div>
                                <button onClick={() => setIsDrawerOpen(false)} className="p-2 text-gray-500"><X size={28} /></button>
                            </div>

                            <nav className="flex-grow flex flex-col justify-start gap-2 overflow-y-auto custom-scrollbar -mx-2 px-2">
                                {navItems.map((item: any) => {
                                    const Icon = iconMap[item.icon] || LayoutGrid;
                                    const isActive = pathname === item.path;
                                    return (
                                        <Link
                                            key={item.label}
                                            href={item.path}
                                            className={`
                                                flex items-center gap-4 p-4 rounded-xl text-base font-normal transition-all
                                                ${isActive ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/20' : 'text-gray-400 hover:text-white hover:bg-white/5'}
                                            `}
                                        >
                                            <Icon size={20} />
                                            <span>{item.label}</span>
                                        </Link>
                                    );
                                })}
                            </nav>

                            <div className="pt-8 border-t border-white/5 space-y-4">
                                <Link href="/admin/login" className="flex items-center gap-4 text-gray-400 hover:text-white font-medium p-2 transition-colors text-sm">
                                    <LogIn size={18} />
                                    <span>Administrator Access</span>
                                </Link>
                                <Link href="/lets-talk" className="flex items-center justify-center gap-3 h-14 bg-gradient-to-r from-emerald-600 to-emerald-400 text-black font-extrabold text-base rounded-2xl shadow-xl">
                                    <MessageSquare size={20} />
                                    <span>Get Started</span>
                                </Link>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* --- MOBILE/TABLET TOP BAR (< 1024px) --- */}
            <div className={`flex lg:hidden fixed top-0 left-0 right-0 h-16 md:h-20 z-[70] transition-all duration-300 px-6 ${!forceHamburger ? 'md:pl-28' : ''} items-center justify-between
                ${isAtTop
                    ? 'bg-transparent border-transparent'
                    : 'bg-[#0B0F14]/95 backdrop-blur-xl border-b border-white/5 shadow-lg'}`}>

                <Link href="/" className="flex items-center gap-2 shrink-0">
                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl overflow-hidden flex items-center justify-center bg-transparent">
                        <img src="/logo.png" alt="" className="w-full h-full object-contain pointer-events-none" />
                    </div>
                    <span className="font-bold text-lg md:text-xl text-white tracking-tighter">
                        {settings?.companyName || "ProHostix"}
                    </span>
                </Link>

                {isMobileSearchOpen && (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex-grow mx-4"
                    >
                        <div className="relative w-full h-9 md:h-10">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-500/50" size={16} />
                            <input
                                autoFocus
                                type="text"
                                value={searchQuery}
                                onChange={(e) => dispatch(setQuery(e.target.value))}
                                placeholder="Search..."
                                className="w-full h-full bg-white/10 rounded-xl pl-10 pr-4 text-white text-sm outline-none focus:ring-1 focus:ring-emerald-500/50 transition-all"
                            />
                        </div>
                    </motion.div>
                )}

                <div className="flex items-center gap-2 shrink-0">
                    <button
                        onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
                        className={`w-10 h-10 md:w-11 md:h-11 flex items-center justify-center rounded-xl transition-all font-bold ${isMobileSearchOpen ? 'text-emerald-400 bg-emerald-500/10' : 'text-gray-400 hover:text-emerald-400'}`}
                    >
                        {isMobileSearchOpen ? <X size={22} /> : <Search size={22} />}
                    </button>
                    {/* Admin Login — shown in top bar only when Nav Rail is visible (tablet + sufficient height) */}
                    {mounted && isTablet && !forceHamburger && (
                        <Link
                            href="/admin/login"
                            className="hidden md:flex w-10 h-10 md:w-11 md:h-11 items-center justify-center rounded-xl text-gray-400 hover:text-emerald-400 hover:bg-white/5 transition-all"
                            title="Administrator Access"
                        >
                            <LogIn size={22} />
                        </Link>
                    )}
                    <Link
                        href="/lets-talk"
                        className="h-10 px-4 bg-emerald-500 text-black text-[12px] font-black uppercase tracking-widest rounded-xl flex items-center justify-center hover:bg-emerald-400 transition-all active:scale-95 shadow-lg shadow-emerald-500/20"
                    >
                        <span className="hidden xs:inline">Let's Talk</span>
                        <MessageSquare size={16} className="xs:hidden" />
                    </Link>
                    <button
                        onClick={() => setIsDrawerOpen(true)}
                        className={`w-10 h-10 md:w-11 md:h-11 ${forceHamburger ? 'flex' : 'md:hidden'} items-center justify-center rounded-xl text-gray-400 hover:text-emerald-400 transition-all font-bold`}
                    >
                        <Menu size={26} />
                    </button>
                </div>
            </div>

            {/* --- NAV RAIL (Tablet Only: md to lg) --- */}
            <nav className={`${forceHamburger ? 'hidden' : 'hidden md:flex lg:hidden'} fixed top-20 left-0 h-[calc(100vh-theme(spacing.20))] w-24 flex-col items-center gap-4 pt-8 pb-8 z-[60] transition-all duration-300 overflow-hidden overscroll-behavior-contain
                ${isAtTop
                    ? 'bg-transparent border-transparent'
                    : 'bg-[#0B0F14]/95 backdrop-blur-xl border-r border-white/5'}`}>

                <div className="flex flex-col gap-2 flex-grow justify-center">
                    {navItems.map((item: any) => {
                        const Icon = iconMap[item.icon] || LayoutGrid;
                        const isActive = pathname === item.path;
                        return (
                            <div key={item.label} className="relative group flex items-center">
                                <Link
                                    href={item.path}
                                    className={`
                                        w-12 h-12 flex items-center justify-center rounded-2xl transition-all duration-300 relative
                                        ${isActive
                                            ? 'bg-emerald-500/10 text-emerald-400'
                                            : 'text-gray-500 hover:text-white hover:bg-white/5'}
                                    `}
                                >
                                    <Icon size={24} />
                                    {isActive && (
                                        <motion.div
                                            layoutId="active-pill"
                                            className="absolute -right-5 w-1 h-8 bg-emerald-500 rounded-full"
                                            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                        />
                                    )}
                                </Link>
                                <div className="absolute left-20 px-3 py-2 bg-emerald-500 text-black text-[10px] font-black uppercase tracking-widest rounded-lg opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 pointer-events-none transition-all duration-300 whitespace-nowrap shadow-2xl z-[100]">
                                    {item.label}
                                </div>
                            </div>
                        );
                    })}
                </div>



            </nav>
        </>
    );
});
