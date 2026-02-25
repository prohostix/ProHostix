import type { Metadata } from 'next';
import LetsTalkClient from './LetsTalkClient';

export const metadata: Metadata = {
    title: "Let's Talk",
    description: "Ready to build something intelligent? Start your consultation with ProHostix today.",
    keywords: ["Consultation", "Project Inquiry", "Software Development"],
};

export default function LetsTalk() {
    return <LetsTalkClient />;
}
