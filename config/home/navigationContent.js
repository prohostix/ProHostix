import {
    LayoutGrid,
    Puzzle,
    Briefcase,
    FolderKanban,
    Building2,
    BookOpenText
} from "lucide-react";

export const NAV_ITEMS = [
    {
        label: "Home",
        path: "/",
        icon: LayoutGrid
    },
    {
        label: "Solutions",
        path: "/solutions",
        icon: Puzzle
    },
    {
        label: "Services",
        path: "/services",
        icon: Briefcase
    },
    {
        label: "Case Studies",
        path: "/case-studies",
        icon: FolderKanban
    },
    {
        label: "Company",
        path: "/company",
        icon: Building2
    },
    {
        label: "Blog",
        path: "/blog",
        icon: BookOpenText
    }
];
