'use client';

import React from "react";

interface SkeletonProps {
    className?: string;
    variant?: 'rect' | 'circle' | 'text' | 'title' | 'badge';
}

const Skeleton = ({ className = "", variant = "rect" }: SkeletonProps) => {
    const baseClass = "animate-pulse bg-white/5 relative overflow-hidden";

    // Different shapes
    const shapes = {
        rect: "rounded-lg",
        circle: "rounded-full",
        text: "rounded h-4 w-full mb-2",
        title: "rounded-lg h-10 w-3/4 mb-4",
        badge: "rounded-full h-6 w-24 mb-6",
    };

    return (
        <div className={`${baseClass} ${shapes[variant]} ${className}`}>
            <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/5 to-transparent shadow-[0_0_40px_rgba(255,255,255,0.05)]" />
        </div>
    );
};

export const SectionSkeleton = () => (
    <div className="w-full py-24 px-8 lg:px-40 bg-black animate-fade-in">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20">
            <div>
                <Skeleton variant="badge" />
                <Skeleton variant="title" className="h-16 md:h-24 w-full mb-8" />
                <Skeleton variant="text" className="w-1/2 h-8 mb-12" />
                <div className="space-y-4">
                    <Skeleton variant="rect" className="h-20 w-full" />
                    <Skeleton variant="rect" className="h-20 w-full" />
                    <Skeleton variant="rect" className="h-20 w-full" />
                </div>
            </div>
            <div className="flex justify-center items-center">
                <Skeleton variant="rect" className="w-full aspect-square max-w-[500px] rounded-[40px]" />
            </div>
        </div>
    </div>
);

export const HeroSkeleton = () => (
    <div className="w-full h-[70vh] bg-[#0B0F14] flex items-center px-8 lg:px-40">
        <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div className="space-y-6">
                <Skeleton variant="badge" />
                <Skeleton variant="title" className="h-24 md:h-32 w-full" />
                <Skeleton variant="text" className="h-6 w-3/4" />
                <Skeleton variant="text" className="h-4 w-1/2" />
                <div className="flex gap-4 pt-10">
                    <Skeleton variant="rect" className="h-14 w-40 rounded-xl" />
                    <Skeleton variant="rect" className="h-14 w-40 rounded-xl" />
                </div>
            </div>
            <div className="hidden lg:flex justify-center items-center">
                <Skeleton variant="rect" className="w-full h-96 rounded-3xl" />
            </div>
        </div>
    </div>
);

export const ProgressLoader = () => (
    <div className="fixed top-0 left-0 w-full h-1 z-[100] overflow-hidden bg-emerald-500/10">
        <div className="h-full bg-emerald-500 animate-progress-loading origin-left shadow-[0_0_10px_#10b981]" />
    </div>
);

export default Skeleton;
