'use client';

import React from 'react';
import Hero from "@/components/home/Hero";
import CoreSpecializations from "@/components/home/CoreSpecializations";
import OperationalExcellence from "@/components/home/OperationalExcellence";
import ScalableIntelligence from "@/components/home/ScalableIntelligence";
import PioneerWork from "@/components/home/PioneerWork";
import LatestInsights from "@/components/home/LatestInsights";
import CTASection from "@/components/home/CTASection";

interface HomeClientProps {
    latestBlogs: any[];
}

export default function HomeClient({ latestBlogs }: HomeClientProps) {
    return (
        <div className="relative w-full flex flex-col items-start px-0 overflow-visible">
            <Hero />
            <CoreSpecializations />
            <OperationalExcellence />
            <ScalableIntelligence />
            <PioneerWork />
            <LatestInsights blogs={latestBlogs} />
            <CTASection />
        </div>
    );
}
