'use client';

import { Search, X, Loader2, ArrowRight } from "lucide-react";
import { Navbar } from "./Navbar";
import React, { useState, useRef, useEffect, memo } from "react";
import Link from "next/link";
import { useSelector, useDispatch } from "react-redux";
import { setQuery, setSearchExpanded, performSearch } from "../../features/search/searchSlice";
import { useSettingsQuery } from "../../hooks/usePageData";
import { useViewport } from "../../hooks/useViewport";

const TopBar = memo(() => {
    const dispatch = useDispatch();
    const { data: settings } = useSettingsQuery() as any;
    const { forceHamburger: viewportForceHamburger } = useViewport() as any;
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const forceHamburger = mounted ? viewportForceHamburger : false;
    const {
        query: searchQuery,
        results: searchResults,
        isSearching,
        isExpanded: isSearchExpanded
    } = useSelector((state: any) => state.search);

    const [isLogoAnimating, setIsLogoAnimating] = useState(false);
    const [isTitleAnimating, setIsTitleAnimating] = useState(false);
    const [isVisible, setIsVisible] = useState(true);
    const isLight = false;
    const [isAtTop, setIsAtTop] = useState(true);
    const lastScrollY = useRef(0);
    const inputRef = useRef<HTMLInputElement>(null);

    // No longer need manual dispatch for settings as useSettingsQuery handles it with caching

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

    const handleKeyDown = (e: any) => {
        if (e.key === 'Enter' && searchQuery.length > 0) {
            // @ts-ignore
            dispatch(performSearch(searchQuery));
        }
    };

    // Auto-focus input when expanded
    useEffect(() => {
        if (isSearchExpanded && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isSearchExpanded]);

    const handleLogoClick = () => {
        if (!isLogoAnimating) {
            setIsLogoAnimating(true);
            setTimeout(() => setIsLogoAnimating(false), 400);
        }
    };

    const handleTitleClick = () => {
        if (!isTitleAnimating) {
            setIsTitleAnimating(true);
            setTimeout(() => setIsTitleAnimating(false), 400);
        }
    };

    // Scroll Logic to Hide/Show Navbar
    useEffect(() => {
        let ticking = false;
        const handleScroll = () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    const currentScrollY = window.scrollY;

                    // Transparency logic
                    setIsAtTop(currentScrollY < 20);

                    if (currentScrollY > lastScrollY.current && currentScrollY > 50) {
                        // Scrolling DOWN and past threshold -> Hide
                        setIsVisible(false);
                    } else {
                        // Scrolling UP -> Show
                        setIsVisible(true);
                    }

                    lastScrollY.current = currentScrollY;
                    ticking = false;
                });
                ticking = true;
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${forceHamburger ? 'hidden' : 'hidden lg:flex'} ${isVisible ? 'translate-y-0' : '-translate-y-full'} 
            ${isAtTop
                ? 'bg-transparent border-transparent text-white'
                : (isLight ? 'text-slate-900 bg-white/80 safari-blur-fix force-gpu shadow-sm' : 'text-white bg-[#0B0F14]/90 safari-blur-fix force-gpu border-b border-white/10')}`}>
            <nav className={`max-w-[1920px] mx-auto w-full px-6 flex items-center justify-between transition-all duration-300 h-24 ${isAtTop ? '' : 'shadow-2xl'}`}>

                {/* --- LEFT SECTION: Brand --- */}
                <div className="flex-1 flex justify-start">
                    <Link href="/" className="flex items-center gap-3 shrink-0 select-none min-w-fit relative z-[70]">
                        <div
                            onClick={handleLogoClick}
                            className={`
                                w-10 h-10 flex items-center justify-center 
                                cursor-pointer bg-transparent
                                ${isLogoAnimating ? 'animate-logo-nudge' : ''}
                            `}
                        >
                            <img src="/logo.png" alt="Logo" className="w-full h-full object-contain pointer-events-none" />
                        </div>

                        {/* Clickable Title with overlap animation */}
                        <div
                            onClick={handleTitleClick}
                            className={`font-bold tracking-tight flex items-baseline cursor-pointer ${isLight ? 'text-slate-900' : 'text-white'}`}
                            style={{ fontSize: '24px' }}
                        >
                            <span className={isTitleAnimating ? 'animate-pro-move' : ''}>{settings?.brandWordmarkPart1 || "Pro"}</span>
                            <span className={isTitleAnimating ? 'animate-hostix-move' : ''}>{settings?.brandWordmarkPart2 || "Hostix"}</span>
                            <span className="w-3 h-3 bg-emerald-500 ml-2 mb-1 animate-cursor" />
                        </div>
                    </Link>
                </div>

                {/* --- CENTER SECTION: Nav Block --- */}
                <div className={`flex-grow flex justify-center items-center transition-all duration-500 overflow-hidden ${isSearchExpanded ? 'opacity-0 pointer-events-none scale-95 max-w-0' : 'opacity-100 scale-100'}`}>
                    <Navbar isLight={isLight} />
                </div>

                {/* --- RIGHT SECTION: Actions --- */}
                <div className="flex-1 flex justify-end items-center gap-3 shrink-0">
                    {/* Actions & Expanding Search */}
                    <div className="flex items-center gap-3 justify-end min-w-fit">

                        {/* Expanding Search Bar Container */}
                        <div className={`relative flex items-center transition-all duration-500 ease-in-out ${isSearchExpanded ? 'w-64 md:w-80' : 'w-10'}`}>
                            <div className={`
                            absolute right-0 flex items-center w-full h-11 
                            backdrop-blur-md border rounded-xl 
                            transition-all duration-500 ease-in-out
                            ${isLight ? 'bg-slate-100/50 border-slate-200' : 'bg-white/5 border-white/10'}
                            ${isSearchExpanded ? 'opacity-100' : 'opacity-0 pointer-events-none'}
                        `}>
                                {isSearching ? <Loader2 className="absolute left-3 text-emerald-500/80 animate-spin" size={18} /> : <Search className="absolute left-3 text-emerald-500/80" size={18} />}
                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => dispatch(setQuery(e.target.value))}
                                    onKeyDown={handleKeyDown}
                                    placeholder="Search..."
                                    className={`w-full h-full bg-transparent pl-10 pr-10 outline-none text-sm placeholder:text-gray-500 ${isLight ? 'text-slate-900' : 'text-white'}`}
                                />
                                <button
                                    onClick={() => dispatch(setSearchExpanded(false))}
                                    className={`absolute right-2 p-1 transition-colors ${isLight ? 'text-slate-400 hover:text-slate-700' : 'text-gray-400 hover:text-white'}`}
                                >
                                    <X size={16} />
                                </button>

                                {/* Search Results Dropdown */}
                                {isSearchExpanded && searchQuery.length > 0 && (isSearching || searchResults.length > 0 || !isSearching) && (
                                    <div className="absolute top-14 left-0 w-full bg-[#0B0F14] border border-white/10 rounded-xl overflow-hidden shadow-2xl z-[60]">
                                        {isSearching ? (
                                            <div className="p-4 flex items-center justify-center gap-2 text-white/40">
                                                <Loader2 size={16} className="animate-spin text-emerald-500" />
                                                <span className="text-sm">Searching...</span>
                                            </div>
                                        ) : searchResults.length > 0 ? (
                                            searchResults.slice(0, 10).map((result: any, idx: number) => (
                                                <Link
                                                    key={idx}
                                                    href={result.path || '/'}
                                                    onClick={() => dispatch(setSearchExpanded(false))}
                                                    className="flex items-center justify-between p-4 hover:bg-white/5 border-b border-white/5 last:border-none transition-colors group"
                                                >
                                                    <div className="flex flex-col">
                                                        <span className="text-white font-medium text-sm line-clamp-1">{result.title}</span>
                                                        <span className="text-white/40 text-[10px] uppercase tracking-widest">{result.category || result.industry || 'Result'}</span>
                                                    </div>
                                                    <ArrowRight size={14} className="text-white/20 group-hover:text-emerald-500 group-hover:translate-x-1 transition-all" />
                                                </Link>
                                            ))
                                        ) : (
                                            <div className="p-4 text-center text-white/40 text-sm">
                                                No results found for "{searchQuery}"
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Search Trigger Icon (only visible when not expanded) */}
                            {!isSearchExpanded && (
                                <button
                                    onClick={() => dispatch(setSearchExpanded(true))}
                                    className={`p-2 rounded-full transition-all duration-300 flex items-center justify-center ${isLight ? 'text-slate-500 hover:text-emerald-600 hover:bg-slate-100' : 'text-gray-400 hover:text-emerald-400 hover:bg-white/5'}`}
                                    aria-label="Open search"
                                >
                                    <Search size={18} />
                                </button>
                            )}
                        </div>

                        {/* Login Button - Always Visible */}
                        <Link href="/admin/login" className={`
                        h-11 px-5 font-medium 
                        backdrop-blur-xl border rounded-lg 
                        transition-all duration-300 ease-out
                        hover:scale-[1.01] 
                        active:scale-95 shrink-0 flex items-center justify-center
                        ${isLight
                                ? 'bg-white/90 border-slate-200 text-slate-700 hover:bg-white hover:border-emerald-500/30'
                                : 'text-white/70 bg-[#1a1a1a]/80 border-white/10 hover:bg-white/10 hover:border-emerald-500/30 hover:text-white active:bg-[#1a1a1a]/80'}
                    `}
                            style={{ fontSize: '14px' }}>
                            Login
                        </Link>

                        {/* Contact Us Button - Visible only on larger screens to save space */}
                        <Link href="/lets-talk" className={`
                        h-11 px-4 xl:px-8 rounded-xl font-semibold 
                        hidden lg:flex items-center justify-center
                        bg-emerald-500 text-black hover:bg-emerald-400 
                        transition-all font-outfit whitespace-nowrap shrink-0
                        hover:bg-emerald-400 hover:scale-[1.02] active:scale-[0.98]
                    `}
                            style={{ fontSize: '14px' }}>
                            Let's Talk
                        </Link>


                    </div>
                </div>

            </nav>
        </header>
    );
});

export default TopBar;