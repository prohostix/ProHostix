'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ShortlistingRedirect() {
    const router = useRouter();

    useEffect(() => {
        router.replace('/admin/dashboard?tab=shortlisting');
    }, [router]);

    return (
        <div className="min-h-screen bg-[#050505] flex items-center justify-center text-white text-sm font-medium">
            Loading Prohostix AI Shortlisting Portal...
        </div>
    );
}
