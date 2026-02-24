"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

import { getAbsoluteImageUrl } from '@/utils/imageUrl';

/**
 * SmartImage - A robust image component that handles placeholders, 
 * loading states, and error fallbacks gracefully using Next.js Image.
 * 
 * @param {string} src - The real image URL from API
 * @param {string} fallbackSrc - The placeholder/fallback image URL
 * @param {string} alt - Alt text for the image
 * @param {string} className - Additional CSS classes
 */
const SmartImage = ({
    src,
    alt = "",
    className = "",
    priority = false,
    fallbackSrc = "/hero-ai.jpg"
}: {
    src: string;
    alt?: string;
    className?: string;
    priority?: boolean;
    fallbackSrc?: string;
}) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [currentSrc, setCurrentSrc] = useState(getAbsoluteImageUrl(src) || fallbackSrc);

    // Update state if prop changes, but prioritize fallback if src is bad
    React.useEffect(() => {
        setCurrentSrc(getAbsoluteImageUrl(src) || fallbackSrc);
    }, [src, fallbackSrc]);

    const handleError = () => {
        if (currentSrc !== fallbackSrc) {
            setCurrentSrc(fallbackSrc);
            setIsLoaded(false);
        }
    };

    return (
        <div className={`relative overflow-hidden bg-white/5 ${className}`}>
            <Image
                src={currentSrc}
                alt={alt}
                fill
                priority={priority}
                onLoad={() => setIsLoaded(true)}
                onError={handleError}
                className={`object-cover transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />

            {/* Loading Shimmer / Placeholder */}
            {!isLoaded && (
                <div className="absolute inset-0 bg-neutral-900/40 animate-pulse bg-gradient-to-r from-transparent via-white/5 to-transparent" />
            )}
        </div>
    );
};

export default SmartImage;
