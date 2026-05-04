import type { Metadata } from 'next';
import LetsTalkClient from './LetsTalkClient';

export const metadata: Metadata = {
    title: "Contact Us | Get a Free Software Consultation",
    description: "Ready to build custom software? Contact ProHostix for a free consultation on ERP systems, web apps, mobile apps, SaaS platforms, or cloud architecture.",
    keywords: [
        "contact software company",
        "free software consultation",
        "hire software developers",
        "custom software quote",
        "software development inquiry",
        "IT company contact",
        "get software built",
        "ProHostix contact",
    ],
    openGraph: {
        title: "Contact ProHostix | Free Software Consultation",
        description: "Get a free consultation for your custom software project — ERP, web apps, mobile apps, SaaS, or cloud architecture.",
        url: "https://www.prohostix.com/lets-talk",
    },
    alternates: { canonical: "https://www.prohostix.com/lets-talk" },
};

export default function LetsTalk() {
    return <LetsTalkClient />;
}
