'use client';

import React, { useEffect, useState } from "react";
import Footer from "../common/Footer";
import TopBar from "../common/TopBar";
import { SideNavigation } from "../common/SideNavigation";
import { ProgressLoader } from "../ui/Skeleton";
import { useNavigationQuery, useSettingsQuery, usePrefetch, useUserProfile } from "@/hooks/usePageData";
import { useViewport } from "@/hooks/useViewport";

const SiteLayout = ({ children }: { children: React.ReactNode }) => {
    const { isMobile: viewportIsMobile, forceHamburger: viewportForceHamburger } = useViewport() as any;
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const isMobile = mounted ? viewportIsMobile : false;
    const forceHamburger = mounted ? viewportForceHamburger : false;

    // Critical Global Data - Fetched on first entry and cached
    const { isLoading: navLoading } = useNavigationQuery();
    const { isLoading: settingsLoading } = useSettingsQuery();
    const { data: user } = useUserProfile();

    // Prefetching engine
    const prefetch = usePrefetch();

    useEffect(() => {
        // --- Security: Prevent Inspection ---
        const handleContextMenu = (e: MouseEvent) => {
            e.preventDefault();
        };

        const handleKeyDown = (e: KeyboardEvent) => {
            // Prevent F12
            if (e.code === 'F12') {
                e.preventDefault();
                return;
            }

            // Prevent Inspection Shortcuts
            // Windows/Linux: Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+Shift+C, Ctrl+U
            // Mac: Meta+Option+I, Meta+Option+J, Meta+Option+C, Meta+Option+U
            const isCtrlShift = e.ctrlKey && e.shiftKey;
            const isMacInspect = e.metaKey && e.altKey;

            if (
                (isCtrlShift && (e.code === 'KeyI' || e.code === 'KeyJ' || e.code === 'KeyC')) ||
                (e.ctrlKey && e.code === 'KeyU') ||
                (isMacInspect && (e.code === 'KeyI' || e.code === 'KeyJ' || e.code === 'KeyC' || e.code === 'KeyU'))
            ) {
                e.preventDefault();
                return;
            }
        };

        document.addEventListener('contextmenu', handleContextMenu);
        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('contextmenu', handleContextMenu);
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    useEffect(() => {
        const loadHighProbRoutes = async () => {
            await Promise.allSettled([
                prefetch.solutions(),
                prefetch.services(),
                prefetch.blogs()
            ]);

            if (typeof window !== 'undefined' && localStorage.getItem('token')) {
                prefetch.admin();
            }
        };

        loadHighProbRoutes();
    }, [prefetch]);

    // We no longer block the whole layout with a loader. 
    // Components inside will handle their own loading states if needed, 
    // but the layout itself stays responsive.

    return (
        <div className="relative min-h-screen text-white overflow-x-hidden selection:bg-emerald-500/30">

            {/* ===== GLOBAL AI BACKGROUND ===== */}
            <div className="fixed inset-0 z-0 pointer-events-none bg-black">
                {/* Background layers optimized for GPU rendering */}
                <div className="absolute inset-0 force-gpu" style={{ background: "linear-gradient(135deg, #0b0b0b 0%, #151515 100%)", opacity: 0.28 }} />
                <div className={`absolute top-[12%] right-[8%] w-[42%] h-[42%] rounded-full opacity-60 pointer-events-none ${isMobile ? 'blur-[60px]' : 'blur-[100px]'}`} style={{ background: "rgba(16, 185, 129, 0.03)", willChange: "filter" }} />
                <div className="absolute inset-0 opacity-[0.025] force-gpu" style={{ backgroundImage: "linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)", backgroundSize: "64px 64px" }} />

                {/* Static Noise Overlay (Performance optimized for Safari) */}
                <div className="absolute inset-0 static-noise force-gpu hidden md:block" />
            </div>

            {/* ===== RESPONSIVE NAVIGATION ===== */}
            <SideNavigation />
            <TopBar />

            {/* ===== PAGE CONTENT ===== */}
            <main className={`relative z-10 ${forceHamburger ? 'pl-0' : 'md:pl-24 lg:pl-0'} min-h-screen transition-all duration-300`}>
                {children}

                {/* ===== FOOTER ===== */}
                <Footer />
            </main>
        </div>
    );
};

export default SiteLayout;
