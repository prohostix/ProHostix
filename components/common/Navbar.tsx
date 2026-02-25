'use client';

import React, { useEffect, useMemo, memo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useNavigationQuery } from "../../hooks/usePageData";
import { NAVIGATION } from "../../data/staticContent";
import {
    LayoutGrid,
    Puzzle,
    Briefcase,
    FolderKanban,
    Building2,
    BookOpenText,
} from "lucide-react";

/* ---------------------------------------------
   ICON REGISTRY (safe & extendable)
---------------------------------------------- */
const ICONS: any = {
    LayoutGrid,
    Puzzle,
    Briefcase,
    FolderKanban,
    Building2,
    BookOpenText,
};

/* ---------------------------------------------
   NAVBAR
---------------------------------------------- */
export const Navbar = memo(({ isLight = false }: { isLight?: boolean }) => {
    const pathname = usePathname();
    const { data: apiNavItems } = useNavigationQuery();
    const navItems = apiNavItems?.length ? apiNavItems : NAVIGATION;

    const containerClasses = useMemo(
        () =>
            [
                "flex flex-row items-center gap-1 p-1 rounded-lg border",
                "safari-blur-fix force-gpu shadow-2xl transition-all duration-300",
                isLight
                    ? "bg-white/90 border-slate-200/60 shadow-slate-200/50"
                    : "bg-black/60 border-white/10",
            ].join(" "),
        [isLight]
    );

    return (
        <nav
            className="hidden lg:flex flex-grow justify-center"
            role="navigation"
            aria-label="Primary navigation"
        >
            <ul className={containerClasses}>
                {navItems.map(({ label, path, icon }: any) => {
                    const Icon = ICONS[icon] ?? LayoutGrid;
                    const isActive = pathname === path;

                    return (
                        <li key={label}>
                            <Link
                                href={path}
                                className={[
                                    "group flex h-10 items-center gap-2 px-3 rounded-md text-sm font-medium",
                                    "transition-all duration-300 focus:outline-none",
                                    isActive
                                        ? isLight
                                            ? "bg-slate-100/80 text-emerald-700 shadow-sm"
                                            : "bg-white/10 text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]"
                                        : isLight
                                            ? "text-slate-500 hover:text-slate-900 hover:bg-slate-100/50"
                                            : "text-gray-400 hover:text-white hover:bg-white/5",
                                ].join(" ")}
                            >
                                <Icon
                                    size={16}
                                    aria-hidden
                                    className={[
                                        "transition-all duration-300",
                                        isActive
                                            ? "opacity-100 w-4"
                                            : "opacity-0 w-0 group-hover:opacity-100 group-hover:w-4",
                                        isLight && isActive
                                            ? "text-emerald-600"
                                            : "text-emerald-400",
                                    ].join(" ")}
                                />
                                <span>{label}</span>
                            </Link>
                        </li>
                    );
                })}
            </ul>
        </nav>
    );
});
