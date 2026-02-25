import type { Metadata } from 'next';
import CareersClient from './CareersClient';

export const metadata: Metadata = {
    title: "Join the Elite",
    description: "Explore career opportunities at ProHostix and help architect the future of intelligent systems.",
    keywords: ["Careers", "Engineering Jobs", "Software Architecture"]
};

export default function Careers() {
    return <CareersClient />;
}
