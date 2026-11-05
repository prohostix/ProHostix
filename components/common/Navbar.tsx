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

    const containerClasses = "flex flex-row items-center gap-8 xl:gap-10";

    return (
        <nav
            className="hidden lg:flex flex-grow justify-center"
            role="navigation"
            aria-label="Primary navigation"
        >
            <ul className={containerClasses}>
                {navItems.map(({ label, path }: any) => {
                    const isActive = pathname === path;

                    return (
                        <li key={label}>
                            <Link
                                href={path}
                                aria-current={isActive ? "page" : undefined}
                                className={[
                                    "relative flex h-10 items-center text-base font-medium",
                                    "transition-colors duration-300 focus:outline-none",
                                    isActive
                                        ? "text-emerald-400"
                                        : isLight
                                            ? "text-slate-700 hover:text-slate-900"
                                            : "text-white hover:text-emerald-300",
                                ].join(" ")}
                            >
                                <span>{label}</span>
                                {isActive && (
                                    <span
                                        aria-hidden
                                        className="absolute left-1/2 -translate-x-1/2 bottom-0 h-[2px] w-6 rounded-full bg-emerald-400"
                                    />
                                )}
                            </Link>
                        </li>
                    );
                })}
            </ul>
        </nav>
    );
});
