import type { Metadata } from 'next';
import CareersClient from './CareersClient';

export const metadata: Metadata = {
    title: "Careers at ProHostix | Software Engineering Jobs",
    description: "Join ProHostix — a fast-growing custom software development company. Explore open roles in software engineering, cloud architecture, mobile development, and more.",
    keywords: [
        "software engineering jobs",
        "IT company careers",
        "software developer jobs",
        "tech jobs",
        "software company hiring",
        "engineering careers",
        "ProHostix careers",
        "remote software jobs",
    ],
    openGraph: {
        title: "Careers at ProHostix | Software Engineering Jobs",
        description: "Join ProHostix and help build the next generation of enterprise software. Explore open engineering roles.",
        url: "https://www.prohostix.com/careers",
    },
    alternates: { canonical: "https://www.prohostix.com/careers" },
};

export default function Careers() {
    return <CareersClient />;
}
